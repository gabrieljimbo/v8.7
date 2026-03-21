/**
 * DOM Store - Painel Administrativo
 * Gerencia validação de depósitos pendentes
 */

let filtroAtivo = 'pendente';
let todosDepositos = [];

// ========== INICIALIZAÇÃO ==========

document.addEventListener('DOMContentLoaded', async () => {
    // Verifica se é admin
    const usuario = obterLocal('usuario');
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }

    // Aguarda auth.js inicializar a sessão (getSession é async)
    await new Promise(resolve => setTimeout(resolve, 500));

    const usuarioAtualizado = obterLocal('usuario');
    if (!usuarioAtualizado || usuarioAtualizado.tipo !== 'admin') {
        mostrarToast('Acesso restrito a administradores', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    document.getElementById('admin-nome').textContent = usuarioAtualizado.nome;

    await carregarDepositos();
});

// ========== CARREGAR DEPÓSITOS ==========

async function carregarDepositos() {
    mostrarLoading(true);

    const { data, error } = await _supabase
        .from('depositos')
        .select(`
            *,
            profiles:user_id ( nome, email, cpf ),
            jornadas:jornada_id ( iphone_nome, iphone_armazenamento, valor_total )
        `)
        .order('created_at', { ascending: false });

    mostrarLoading(false);

    if (error) {
        console.error('Erro ao carregar depósitos:', error);
        mostrarToast('Erro ao carregar depósitos', 'error');
        return;
    }

    todosDepositos = data || [];
    atualizarStats();
    renderizarDepositos();
}

// ========== STATS ==========

function atualizarStats() {
    const pendentes = todosDepositos.filter(d => d.status === 'pendente');
    const aprovados = todosDepositos.filter(d => d.status === 'aprovado');
    const valorPendente = pendentes.reduce((acc, d) => acc + parseFloat(d.valor), 0);

    document.getElementById('stat-pendentes').textContent = pendentes.length;
    document.getElementById('stat-aprovados').textContent = aprovados.length;
    document.getElementById('stat-valor-pendente').textContent = formatarMoeda(valorPendente);
}

// ========== FILTROS ==========

function filtrar(status) {
    filtroAtivo = status;

    document.querySelectorAll('.btn-filtro').forEach(btn => {
        btn.classList.toggle('ativo', btn.dataset.filtro === status);
    });

    renderizarDepositos();
}

window.filtrar = filtrar;

// ========== RENDERIZAR LISTA ==========

function renderizarDepositos() {
    const lista = document.getElementById('depositos-lista');
    const contador = document.getElementById('depositos-count');

    const filtrados = filtroAtivo === 'todos'
        ? todosDepositos
        : todosDepositos.filter(d => d.status === filtroAtivo);

    contador.textContent = `${filtrados.length} registro${filtrados.length !== 1 ? 's' : ''}`;

    if (filtrados.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" stroke="#ccc" stroke-width="2"/>
                    <path d="M16 24H32M24 16V32" stroke="#ccc" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <p>Nenhum depósito ${filtroAtivo === 'pendente' ? 'pendente' : filtroAtivo === 'aprovado' ? 'aprovado' : filtroAtivo === 'rejeitado' ? 'rejeitado' : ''} encontrado</p>
            </div>
        `;
        return;
    }

    lista.innerHTML = filtrados.map(dep => {
        const nome = dep.profiles?.nome || 'Cliente';
        const email = dep.profiles?.email || '';
        const iphone = dep.jornadas?.iphone_nome || 'iPhone';
        const armazenamento = dep.jornadas?.iphone_armazenamento || '';
        const valor = parseFloat(dep.valor);
        const data = formatarDataHora(dep.created_at);
        const isPendente = dep.status === 'pendente';

        const badgeClass = `status-${dep.status}`;
        const badgeText = dep.status === 'pendente' ? '⏳ Pendente'
            : dep.status === 'aprovado' ? '✓ Aprovado'
            : '✕ Rejeitado';

        const botoes = isPendente ? `
            <div class="acoes">
                <button class="btn-aprovar" onclick="aprovar('${dep.id}', ${valor}, '${dep.jornada_id}')">
                    Aprovar
                </button>
                <button class="btn-rejeitar" onclick="rejeitar('${dep.id}')">
                    Rejeitar
                </button>
            </div>
        ` : `<div class="acoes" style="color:#bbb;font-size:12px">—</div>`;

        return `
            <div class="deposito-item" id="dep-${dep.id}">
                <div class="cliente-info">
                    <div class="cliente-nome">${nome}</div>
                    <div class="cliente-email">${email}</div>
                    <div class="cliente-iphone">${iphone} ${armazenamento}</div>
                </div>
                <div class="deposito-valor">${formatarMoeda(valor)}</div>
                <div class="deposito-data">${data}</div>
                <div><span class="status-badge ${badgeClass}">${badgeText}</span></div>
                ${botoes}
            </div>
        `;
    }).join('');
}

// ========== APROVAR ==========

async function aprovar(depositoId, valor, jornadaId) {
    const row = document.getElementById(`dep-${depositoId}`);
    const btns = row.querySelectorAll('button');
    btns.forEach(b => b.disabled = true);

    // 1. Atualiza status do depósito
    const { error: depError } = await _supabase
        .from('depositos')
        .update({ status: 'aprovado' })
        .eq('id', depositoId);

    if (depError) {
        mostrarToast('Erro ao aprovar depósito', 'error');
        btns.forEach(b => b.disabled = false);
        return;
    }

    // 2. Busca valores atuais da jornada
    const { data: jornada } = await _supabase
        .from('jornadas')
        .select('valor_acumulado, valor_total')
        .eq('id', jornadaId)
        .single();

    if (jornada) {
        const novoAcumulado = parseFloat(jornada.valor_acumulado) + valor;
        const novaPorcentagem = Math.min((novoAcumulado / parseFloat(jornada.valor_total)) * 100, 100);

        // 3. Atualiza jornada
        await _supabase
            .from('jornadas')
            .update({
                valor_acumulado: novoAcumulado,
                porcentagem: novaPorcentagem,
                updated_at: new Date().toISOString()
            })
            .eq('id', jornadaId);
    }

    mostrarToast('Depósito aprovado com sucesso!', 'success');

    // Atualiza localmente sem recarregar tudo
    const dep = todosDepositos.find(d => d.id === depositoId);
    if (dep) dep.status = 'aprovado';
    atualizarStats();
    renderizarDepositos();
}

// ========== REJEITAR ==========

async function rejeitar(depositoId) {
    if (!confirm('Tem certeza que deseja rejeitar este depósito?')) return;

    const row = document.getElementById(`dep-${depositoId}`);
    const btns = row.querySelectorAll('button');
    btns.forEach(b => b.disabled = true);

    const { error } = await _supabase
        .from('depositos')
        .update({ status: 'rejeitado' })
        .eq('id', depositoId);

    if (error) {
        mostrarToast('Erro ao rejeitar depósito', 'error');
        btns.forEach(b => b.disabled = false);
        return;
    }

    mostrarToast('Depósito rejeitado', 'info');

    const dep = todosDepositos.find(d => d.id === depositoId);
    if (dep) dep.status = 'rejeitado';
    atualizarStats();
    renderizarDepositos();
}

window.aprovar = aprovar;
window.rejeitar = rejeitar;

// ========== HELPERS ==========

function mostrarLoading(show) {
    const loading = document.getElementById('loading-state');
    const lista = document.getElementById('depositos-lista');
    if (loading) loading.style.display = show ? 'block' : 'none';
    if (lista) lista.style.display = show ? 'none' : 'block';
}

function sair() {
    fazerLogout();
}
window.sair = sair;

console.log('✅ admin.js carregado');
