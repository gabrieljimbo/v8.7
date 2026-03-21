/**
 * DOM Store — Admin Dashboard JS
 * Carrega KPIs, gráficos, tabela de clientes e feed de atividade
 */

// Estado global
let _depositos = [];
let _jornadas  = [];
let _chartsInit = false;
let _chartStatus, _chartCadastros, _chartValor;

// ========== INICIALIZAÇÃO ==========

document.addEventListener('DOMContentLoaded', async () => {
    // Aguarda auth.js
    await new Promise(r => setTimeout(r, 500));

    const usuario = obterLocal('usuario');
    if (!usuario || usuario.tipo !== 'admin') {
        mostrarToast('Acesso restrito a administradores', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    // Header
    document.getElementById('admin-nome').textContent = usuario.nome;

    // Saudação com hora
    const hora = new Date().getHours();
    const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
    document.getElementById('greeting').textContent = `${saudacao}, ${usuario.nome.split(' ')[0]}!`;

    // Data atual
    const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('dash-date').textContent = hoje.charAt(0).toUpperCase() + hoje.slice(1);

    await carregarDados();
});

// ========== CARREGAR DADOS (paralelo) ==========

async function carregarDados() {
    const seteDias    = new Date(Date.now() - 7  * 86400e3).toISOString();
    const quatorze    = new Date(Date.now() - 14 * 86400e3).toISOString();

    try {
        const [
            resClientes,
            resAdesoes,
            resJornadas,
            resDepositos,
            resCadastros
        ] = await Promise.all([
            _supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('tipo', 'cliente'),
            _supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('tipo', 'cliente').gte('created_at', seteDias),
            _supabase.from('jornadas').select(`
                id, iphone_nome, iphone_armazenamento, valor_total,
                valor_acumulado, porcentagem, status, created_at,
                profiles:user_id ( nome, email )
            `).order('created_at', { ascending: false }),
            _supabase.from('depositos').select(`
                id, valor, status, created_at, jornada_id,
                profiles:user_id ( nome, email ),
                jornadas:jornada_id ( iphone_nome )
            `).order('created_at', { ascending: false }),
            _supabase.from('profiles').select('created_at').eq('tipo', 'cliente').gte('created_at', quatorze).order('created_at', { ascending: true })
        ]);

        _jornadas  = resJornadas.data  || [];
        _depositos = resDepositos.data || [];

        const totalClientes = resClientes.count  || 0;
        const novasAdesoes  = resAdesoes.count   || 0;
        const cadastrosDias = resCadastros.data  || [];

        // Atualiza KPIs
        renderKPIs(totalClientes, novasAdesoes);

        // Badge de pendentes no nav
        const pendentesNav = _depositos.filter(d => d.status === 'pendente').length;
        if (pendentesNav > 0) {
            const badge = document.getElementById('badge-pendentes');
            badge.textContent = pendentesNav;
            badge.style.display = 'inline-flex';
        }

        // Gráficos
        renderGraficos(cadastrosDias);

        // Tabela e feed
        renderTabela();
        renderFeed();

    } catch (err) {
        console.error('Erro ao carregar dados:', err);
        mostrarToast('Erro ao carregar dados. Verifique a conexão.', 'error');
    }
}

// ========== KPIs ==========

function renderKPIs(totalClientes, novasAdesoes) {
    const aprovados  = _depositos.filter(d => d.status === 'aprovado');
    const pendentes  = _depositos.filter(d => d.status === 'pendente');
    const ativas     = _jornadas.filter(j => j.status === 'ativa');
    const total      = _depositos.length;

    const valorAprovado = aprovados.reduce((s, d) => s + parseFloat(d.valor || 0), 0);
    const taxa          = total > 0 ? ((aprovados.length / total) * 100).toFixed(0) : 0;

    document.getElementById('v-clientes').textContent  = totalClientes;
    document.getElementById('s-clientes').textContent  = `${totalClientes === 1 ? 'cliente cadastrado' : 'clientes cadastrados'}`;
    document.getElementById('v-adesoes').textContent   = novasAdesoes;
    document.getElementById('v-ativas').textContent    = ativas.length;
    document.getElementById('s-ativas').textContent    = `${ativas.length === 1 ? 'em andamento' : 'em andamento'}`;
    document.getElementById('v-aprovado').textContent  = formatarMoeda(valorAprovado);
    document.getElementById('v-pendentes').textContent = pendentes.length;
    document.getElementById('v-taxa').textContent      = `${taxa}%`;
    document.getElementById('s-taxa').textContent      = `${aprovados.length} de ${total} depósitos`;

    // Destaque pendentes visível só quando há pendentes
    if (pendentes.length === 0) {
        document.getElementById('kpi-pendentes').classList.remove('kpi-destaque');
    }

    // Total aprovado no gráfico de linha
    document.getElementById('chart-total-aprovado').textContent = formatarMoeda(valorAprovado);
}

// ========== GRÁFICOS ==========

function renderGraficos(cadastrosDias) {
    // 1. Donut — status dos depósitos
    renderDonut();

    // 2. Barras — cadastros por dia (14 dias)
    renderBarras(cadastrosDias);

    // 3. Linha — valor aprovado acumulado (30 dias)
    renderLinha();
}

function renderDonut() {
    const aprovados  = _depositos.filter(d => d.status === 'aprovado').length;
    const pendentes  = _depositos.filter(d => d.status === 'pendente').length;
    const rejeitados = _depositos.filter(d => d.status === 'rejeitado').length;
    const total      = _depositos.length;

    document.getElementById('donut-num').textContent = total;

    const ctx = document.getElementById('chart-status').getContext('2d');
    if (_chartStatus) _chartStatus.destroy();

    _chartStatus = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Aprovado', 'Pendente', 'Rejeitado'],
            datasets: [{
                data: [aprovados, pendentes, rejeitados],
                backgroundColor: ['#00BFA5', '#FEDB19', '#F44336'],
                borderWidth: 0,
                hoverOffset: 6
            }]
        },
        options: {
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ${ctx.parsed} depósitos (${total > 0 ? ((ctx.parsed/total)*100).toFixed(0) : 0}%)`
                    }
                }
            }
        }
    });

    // Legenda manual
    const cores = ['#00BFA5', '#FEDB19', '#F44336'];
    const labels = ['Aprovados', 'Pendentes', 'Rejeitados'];
    const vals   = [aprovados, pendentes, rejeitados];
    document.getElementById('donut-legend').innerHTML = labels.map((l, i) => `
        <div class="legend-item">
            <div class="legend-left">
                <div class="legend-dot" style="background:${cores[i]}"></div>
                ${l}
            </div>
            <div class="legend-right">
                ${vals[i]}
                <span class="legend-pct">${total > 0 ? ((vals[i]/total)*100).toFixed(0) : 0}%</span>
            </div>
        </div>
    `).join('');
}

function renderBarras(cadastrosDias) {
    const labels = gerarUltimosDias(14);
    const diasMap = {};
    cadastrosDias.forEach(p => {
        const k = chaveData(p.created_at);
        diasMap[k] = (diasMap[k] || 0) + 1;
    });
    const valores = labels.map(l => diasMap[l] || 0);

    const ctx = document.getElementById('chart-cadastros').getContext('2d');
    if (_chartCadastros) _chartCadastros.destroy();

    _chartCadastros = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Novas adesões',
                data: valores,
                backgroundColor: '#FEDB19',
                borderRadius: 6,
                borderSkipped: false,
                hoverBackgroundColor: '#F5C800'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, font: { size: 11 } },
                    grid: { color: '#f0f0f0' }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 10 }, maxRotation: 0 }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} cadastro${ctx.parsed.y !== 1 ? 's' : ''}` } }
            }
        }
    });
}

function renderLinha() {
    const labels30 = gerarUltimosDias(30);
    const diasMap  = {};

    _depositos
        .filter(d => d.status === 'aprovado')
        .forEach(d => {
            const k = chaveData(d.created_at);
            diasMap[k] = (diasMap[k] || 0) + parseFloat(d.valor || 0);
        });

    // Acumula progressivamente
    let acum = 0;
    const valores30 = labels30.map(l => {
        acum += diasMap[l] || 0;
        return parseFloat(acum.toFixed(2));
    });

    const ctx = document.getElementById('chart-valor').getContext('2d');
    if (_chartValor) _chartValor.destroy();

    // Gradiente
    const grad = ctx.createLinearGradient(0, 0, 0, 200);
    grad.addColorStop(0, 'rgba(0,191,165,0.18)');
    grad.addColorStop(1, 'rgba(0,191,165,0)');

    _chartValor = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels30,
            datasets: [{
                label: 'Valor aprovado',
                data: valores30,
                borderColor: '#00BFA5',
                backgroundColor: grad,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#00BFA5',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { size: 11 },
                        callback: v => v >= 1000 ? `R$${(v/1000).toFixed(0)}k` : `R$${v}`
                    },
                    grid: { color: '#f5f5f5' }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 10 }, maxTicksLimit: 8, maxRotation: 0 }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ` Acumulado: ${formatarMoeda(ctx.parsed.y)}`
                    }
                }
            }
        }
    });
}

// ========== TABELA DE CLIENTES ==========

function renderTabela(filtro = '') {
    const lista = document.getElementById('clientes-lista');
    const count = document.getElementById('clientes-count');

    let filtradas = _jornadas;
    if (filtro) {
        const q = filtro.toLowerCase();
        filtradas = _jornadas.filter(j =>
            j.profiles?.nome?.toLowerCase().includes(q) ||
            j.profiles?.email?.toLowerCase().includes(q) ||
            j.iphone_nome?.toLowerCase().includes(q)
        );
    }

    count.textContent = `${filtradas.length} cliente${filtradas.length !== 1 ? 's' : ''}`;

    if (filtradas.length === 0) {
        lista.innerHTML = `<div class="empty-table">${filtro ? 'Nenhum cliente encontrado para "' + filtro + '"' : 'Nenhum cliente cadastrado ainda'}</div>`;
        return;
    }

    lista.innerHTML = filtradas.map(j => {
        const nome  = j.profiles?.nome  || '—';
        const email = j.profiles?.email || '';
        const pct   = Math.min(parseFloat(j.porcentagem || 0), 100);
        const pctStr = pct.toFixed(0) + '%';

        const fillClass = pct < 25 ? 'inicio' : pct < 60 ? 'meio' : pct < 100 ? 'quase' : 'pronto';

        const ultimoDep = _depositos.find(d => d.jornada_id === j.id);

        return `
            <div class="cliente-row">
                <div>
                    <div class="cr-nome">${nome}</div>
                    <div class="cr-email">${email}</div>
                </div>
                <div>
                    <div class="cr-iphone">${j.iphone_nome || '—'}</div>
                    <div class="cr-storage">${j.iphone_armazenamento || ''}</div>
                </div>
                <div class="progress-wrap">
                    <div class="progress-bar">
                        <div class="progress-fill ${fillClass}" style="width:${pct}%"></div>
                    </div>
                    <span class="progress-pct">${pctStr}</span>
                </div>
                <div>
                    <div class="cr-valor">${formatarMoeda(j.valor_acumulado || 0)}</div>
                    <div class="cr-meta">de ${formatarMoeda(j.valor_total || 0)}</div>
                </div>
                <div>
                    <span class="status-jornada ${j.status || 'ativa'}">${j.status || 'ativa'}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ========== FEED DE ATIVIDADE ==========

function renderFeed() {
    const feed = document.getElementById('feed-atividade');
    const recentes = _depositos.slice(0, 15);

    if (recentes.length === 0) {
        feed.innerHTML = `<div class="empty-table">Nenhum depósito ainda</div>`;
        return;
    }

    feed.innerHTML = recentes.map(d => {
        const nome    = d.profiles?.nome || '—';
        const iphone  = d.jornadas?.iphone_nome || '';
        const valor   = formatarMoeda(parseFloat(d.valor || 0));
        const hora    = formatarDataHora(d.created_at);
        const status  = d.status;

        const statusLabel = status === 'aprovado' ? '✓ Aprovado'
            : status === 'pendente' ? '⏳ Pendente' : '✕ Rejeitado';

        return `
            <div class="feed-item">
                <div class="feed-dot ${status}"></div>
                <div class="feed-info">
                    <div class="feed-nome">${nome}</div>
                    <div class="feed-desc">
                        <span class="status-badge status-${status}" style="font-size:10px;padding:2px 7px">${statusLabel}</span>
                        ${iphone ? `<span class="feed-iphone"> · ${iphone}</span>` : ''}
                    </div>
                </div>
                <div class="feed-right">
                    <div class="feed-valor">${valor}</div>
                    <div class="feed-hora">${hora}</div>
                </div>
            </div>
        `;
    }).join('');
}

// ========== BUSCA COM DEBOUNCE ==========

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const busca = document.getElementById('busca-cliente');
        if (busca) {
            let timeout;
            busca.addEventListener('input', e => {
                clearTimeout(timeout);
                timeout = setTimeout(() => renderTabela(e.target.value.trim()), 250);
            });
        }
    }, 600);
});

// ========== RECARREGAR ==========

async function recarregar() {
    const btn = document.getElementById('btn-refresh');
    btn.classList.add('loading');
    btn.disabled = true;
    await carregarDados();
    btn.classList.remove('loading');
    btn.disabled = false;
    mostrarToast('Dados atualizados!', 'success');
}
window.recarregar = recarregar;

// ========== SAIR ==========
function sair() { fazerLogout(); }
window.sair = sair;

// ========== HELPERS DE DATA ==========

function gerarUltimosDias(n) {
    return Array.from({ length: n }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (n - 1 - i));
        return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
    });
}

function chaveData(iso) {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
}

console.log('✅ dashboard-admin.js carregado');
