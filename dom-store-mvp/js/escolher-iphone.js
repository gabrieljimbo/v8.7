/**
 * DOM Store - Escolher iPhone
 * Catálogo completo com 20 modelos
 */

// Catálogo completo de iPhones
const iphones = [
    {
        id: 1,
        nome: 'iPhone 11',
        modelo: '11',
        armazenamento: '128GB',
        estado: 'Seminovo Premium',
        valorTotal: 1599.00,
        imagem: 'assets/iphones/iphone-01.jpg',
        destaque: false
    },
    {
        id: 2,
        nome: 'iPhone 11',
        modelo: '11',
        armazenamento: '64GB',
        estado: 'Seminovo Premium',
        valorTotal: 1399.00,
        imagem: 'assets/iphones/iphone-02.jpg',
        destaque: false
    },
    {
        id: 3,
        nome: 'iPhone 12 Pro Max',
        modelo: '12 Pro Max',
        armazenamento: 'Consulte disponibilidade',
        estado: 'Seminovo Premium',
        valorTotal: 2799.00,
        imagem: 'assets/iphones/iphone-03.jpg',
        destaque: false
    },
    {
        id: 4,
        nome: 'iPhone 12 Pro',
        modelo: '12 Pro',
        armazenamento: 'Consulte disponibilidade',
        estado: 'Seminovo Premium',
        valorTotal: 2349.00,
        imagem: 'assets/iphones/iphone-04.jpg',
        destaque: false
    },
    {
        id: 5,
        nome: 'iPhone 13',
        modelo: '13',
        armazenamento: '128GB',
        estado: 'Lacrado',
        valorTotal: 3299.00,
        imagem: 'assets/iphones/iphone-05.jpg',
        destaque: true,
        badge: 'NOVO'
    },
    {
        id: 6,
        nome: 'iPhone 13',
        modelo: '13',
        armazenamento: '128GB',
        estado: 'Seminovo Premium',
        valorTotal: 2299.00,
        imagem: 'assets/iphones/iphone-06.jpg',
        destaque: false
    },
    {
        id: 7,
        nome: 'iPhone 13',
        modelo: '13',
        armazenamento: '128GB',
        estado: 'Seminovo Premium',
        valorTotal: 2349.00,
        imagem: 'assets/iphones/iphone-07.jpg',
        destaque: false
    },
    {
        id: 8,
        nome: 'iPhone 14 Pro Max',
        modelo: '14 Pro Max',
        armazenamento: '128GB',
        estado: 'Seminovo Premium',
        valorTotal: 3899.00,
        imagem: 'assets/iphones/iphone-08.jpg',
        destaque: false
    },
    {
        id: 9,
        nome: 'iPhone 14 Pro Max',
        modelo: '14 Pro Max',
        armazenamento: '256GB',
        estado: 'Seminovo Premium',
        valorTotal: 4299.00,
        imagem: 'assets/iphones/iphone-09.jpg',
        destaque: true
    },
    {
        id: 10,
        nome: 'iPhone 14 Pro',
        modelo: '14 Pro',
        armazenamento: '128GB',
        estado: 'Seminovo Premium',
        valorTotal: 3299.00,
        imagem: 'assets/iphones/iphone-10.jpg',
        destaque: false
    },
    {
        id: 11,
        nome: 'iPhone 14 Pro',
        modelo: '14 Pro',
        armazenamento: '256GB',
        estado: 'Seminovo Premium',
        valorTotal: 3499.00,
        imagem: 'assets/iphones/iphone-11.jpg',
        destaque: false
    },
    {
        id: 12,
        nome: 'iPhone 14',
        modelo: '14',
        armazenamento: '128GB',
        estado: 'Seminovo Premium',
        valorTotal: 2699.00,
        imagem: 'assets/iphones/iphone-12.jpg',
        destaque: false
    },
    {
        id: 13,
        nome: 'iPhone 15 Pro Max',
        modelo: '15 Pro Max',
        armazenamento: '256GB',
        estado: 'Seminovo Premium',
        valorTotal: 4899.00,
        imagem: 'assets/iphones/iphone-13.jpg',
        destaque: true
    },
    {
        id: 14,
        nome: 'iPhone 16 Pro Max',
        modelo: '16 Pro Max',
        armazenamento: 'Consulte disponibilidade',
        estado: 'Seminovo Premium',
        valorTotal: 6499.00,
        imagem: 'assets/iphones/iphone-14.jpg',
        destaque: true
    },
    {
        id: 15,
        nome: 'iPhone 16 Pro',
        modelo: '16 Pro',
        armazenamento: '128GB',
        estado: 'Seminovo Premium',
        valorTotal: 5299.00,
        imagem: 'assets/iphones/iphone-15.jpg',
        destaque: true
    },
    {
        id: 16,
        nome: 'iPhone 16 Pro',
        modelo: '16 Pro',
        armazenamento: '256GB',
        estado: 'Seminovo Premium',
        valorTotal: 5599.00,
        imagem: 'assets/iphones/iphone-16.jpg',
        destaque: true
    },
    {
        id: 17,
        nome: 'iPhone 16',
        modelo: '16',
        armazenamento: '128GB',
        estado: 'Lacrado',
        valorTotal: 4799.00,
        imagem: 'assets/iphones/iphone-17.jpg',
        destaque: true,
        badge: 'NOVO'
    },
    {
        id: 18,
        nome: 'iPhone 17 Pro Max',
        modelo: '17 Pro Max',
        armazenamento: '256GB',
        estado: 'Lacrado',
        valorTotal: 8599.00,
        imagem: 'assets/iphones/iphone-18.jpg',
        destaque: true,
        badge: 'LANÇAMENTO'
    },
    {
        id: 19,
        nome: 'iPhone 17 Pro',
        modelo: '17 Pro',
        armazenamento: '256GB',
        estado: 'Lacrado',
        valorTotal: 7999.00,
        imagem: 'assets/iphones/iphone-19.jpg',
        destaque: true,
        badge: 'LANÇAMENTO'
    },
    {
        id: 20,
        nome: 'iPhone 17',
        modelo: '17',
        armazenamento: '256GB',
        estado: 'Lacrado',
        valorTotal: 6499.00,
        imagem: 'assets/iphones/iphone-20.jpg',
        destaque: true,
        badge: 'LANÇAMENTO'
    }
];

// =============================================
// ADMIN — estado
// =============================================
let _modoAdmin = false;
let _produtoOcultarPendente = null; // { id (int), nome }
let _produtoExcluirDbPendente = null; // { id (uuid), nome }

// =============================================
// RENDERIZAR CARDS
// =============================================

function renderizarIphones(lista) {
    const grid = document.getElementById('iphones-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!lista || lista.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px;color:#aaa;">Nenhum produto disponível no momento.</div>';
        return;
    }

    lista.forEach(iphone => {
        const card = document.createElement('div');
        card.className = `iphone-card ${iphone.destaque ? 'destaque' : ''}`;

        const badgeHtml = iphone.badge ? `<span class="badge-iphone badge-${iphone.badge.toLowerCase()}">${iphone.badge}</span>` : '';
        const imgSrc = iphone.imagem_url || iphone.imagem || 'assets/logo-dom-novo.png';
        const valor = iphone.valorTotal || iphone.valor_total;

        // Controles admin
        let adminHtml = '';
        if (_modoAdmin) {
            if (iphone._tipo === 'db') {
                adminHtml = `
                    <div class="admin-card-controls">
                        <button class="admin-card-btn admin-card-btn-excluir" onclick="event.stopPropagation();pedirExcluirDb('${iphone._dbId}','${iphone.nome.replace(/'/g,"\\'")}')">Excluir</button>
                    </div>
                    <span class="admin-card-tag">Banco</span>`;
            } else {
                adminHtml = `
                    <div class="admin-card-controls">
                        <button class="admin-card-btn admin-card-btn-ocultar" onclick="event.stopPropagation();pedirOcultar(${iphone.id},'${iphone.nome.replace(/'/g,"\\'")}')">Ocultar</button>
                    </div>`;
            }
        }

        card.innerHTML = `
            ${adminHtml}
            ${badgeHtml}
            <div class="iphone-imagem">
                <img
                    src="${imgSrc}"
                    alt="${iphone.nome}"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='assets/logo-dom-novo.png'; this.style.padding='20px';">
            </div>
            <div class="iphone-info">
                <h3 class="iphone-nome">${iphone.nome}</h3>
                <p class="iphone-specs">${iphone.armazenamento} • ${iphone.estado}</p>
                <p class="iphone-valor">${formatarMoeda(valor)}</p>
                <button class="btn btn-primary btn-full">
                    ${_modoAdmin ? 'Visualizar' : 'Escolher este iPhone'}
                </button>
            </div>
        `;

        // Admin não abre modal de compra
        if (!_modoAdmin) {
            card.onclick = () => selecionarIphone(iphone);
        }

        grid.appendChild(card);
    });
}

// =============================================
// NORMALIZAR PRODUTO DO BANCO
// =============================================

function normalizarProduto(p) {
    return {
        id: p.id,
        _tipo: 'db',
        _dbId: p.id,
        nome: p.nome,
        modelo: p.modelo || '',
        armazenamento: p.armazenamento || '',
        estado: p.estado || 'Lacrado',
        valorTotal: p.valor_total,
        imagem: p.imagem_url || 'assets/logo-dom-novo.png',
        imagem_url: p.imagem_url,
        destaque: p.destaque || false,
        badge: p.badge || null
    };
}

// =============================================
// CARREGAR CATÁLOGO
// =============================================

async function carregarCatalogo() {
    const grid = document.getElementById('iphones-grid');
    if (grid) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#999;">Carregando catálogo...</div>';

    try {
        // Buscar IDs de hardcoded ocultos
        const { data: ocultos } = await _supabase
            .from('hardcode_ocultos')
            .select('produto_id');

        const ocultoIds = new Set((ocultos || []).map(o => o.produto_id));

        // Buscar produtos do banco
        const { data: dbProdutos, error } = await _supabase
            .from('produtos')
            .select('*')
            .eq('ativo', true)
            .order('destaque', { ascending: false })
            .order('created_at', { ascending: false });

        // Montar lista final
        let lista = [];

        // Produtos do banco (sempre exibidos se ativo)
        if (!error && dbProdutos && dbProdutos.length > 0) {
            lista = dbProdutos.map(p => ({ ...normalizarProduto(p) }));
        }

        // Hardcoded: filtrar ocultos
        const hardcodedVisiveis = iphones
            .filter(ip => !ocultoIds.has(ip.id))
            .map(ip => ({ ...ip, _tipo: 'hardcode' }));

        lista = [...lista, ...hardcodedVisiveis];

        // Destaque primeiro
        lista.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));

        console.log(`✅ Catálogo: ${lista.length} produtos (${dbProdutos?.length || 0} banco + ${hardcodedVisiveis.length} local)`);
        renderizarIphones(lista);

    } catch (e) {
        console.warn('Erro ao carregar catálogo:', e);
        renderizarIphones(iphones.map(ip => ({ ...ip, _tipo: 'hardcode' })));
    }
}

// =============================================
// ADMIN — OCULTAR HARDCODED
// =============================================

function pedirOcultar(id, nome) {
    _produtoOcultarPendente = { id, nome };
    document.getElementById('ocultar-nome').textContent = nome;
    document.getElementById('modal-ocultar').classList.remove('hidden');
}

function fecharModalOcultar() {
    document.getElementById('modal-ocultar').classList.add('hidden');
    _produtoOcultarPendente = null;
}

async function confirmarOcultar() {
    if (!_produtoOcultarPendente) return;
    const btn = document.getElementById('btn-confirmar-ocultar');
    btn.disabled = true;
    btn.textContent = 'Ocultando...';

    const { error } = await _supabase
        .from('hardcode_ocultos')
        .insert({ produto_id: _produtoOcultarPendente.id });

    btn.disabled = false;
    btn.textContent = 'Ocultar';

    if (error) {
        mostrarToast('Erro ao ocultar produto.', 'error');
        return;
    }

    fecharModalOcultar();
    mostrarToast('Produto ocultado para todos os clientes.', 'success');
    carregarCatalogo();
}

// =============================================
// ADMIN — EXCLUIR DO BANCO
// =============================================

function pedirExcluirDb(id, nome) {
    _produtoExcluirDbPendente = { id, nome };
    document.getElementById('excluir-db-nome').textContent = nome;
    document.getElementById('modal-excluir-db').classList.remove('hidden');
}

function fecharModalExcluirDb() {
    document.getElementById('modal-excluir-db').classList.add('hidden');
    _produtoExcluirDbPendente = null;
}

async function confirmarExcluirDb() {
    if (!_produtoExcluirDbPendente) return;
    const btn = document.getElementById('btn-confirmar-excluir-db');
    btn.disabled = true;
    btn.textContent = 'Excluindo...';

    const { error } = await _supabase
        .from('produtos')
        .delete()
        .eq('id', _produtoExcluirDbPendente.id);

    btn.disabled = false;
    btn.textContent = 'Excluir';

    if (error) {
        mostrarToast('Erro ao excluir produto.', 'error');
        return;
    }

    fecharModalExcluirDb();
    mostrarToast('Produto excluído permanentemente.', 'success');
    carregarCatalogo();
}

// Fechar modais clicando fora
document.addEventListener('click', (e) => {
    if (e.target.id === 'modal-ocultar') fecharModalOcultar();
    if (e.target.id === 'modal-excluir-db') fecharModalExcluirDb();
});

window.pedirOcultar = pedirOcultar;
window.fecharModalOcultar = fecharModalOcultar;
window.confirmarOcultar = confirmarOcultar;
window.pedirExcluirDb = pedirExcluirDb;
window.fecharModalExcluirDb = fecharModalExcluirDb;
window.confirmarExcluirDb = confirmarExcluirDb;

// Selecionar iPhone
let _iphoneSelecionado = null;

function selecionarIphone(iphone) {
    _iphoneSelecionado = iphone;
    document.getElementById('modal-iphone-title').textContent = `${iphone.nome} ${iphone.armazenamento}`;
    document.getElementById('modal-iphone-valor').textContent = formatarMoeda(iphone.valorTotal);
    document.getElementById('modal-confirmar').classList.remove('hidden');
}

function fecharModal() {
    document.getElementById('modal-confirmar').classList.add('hidden');
    _iphoneSelecionado = null;
}

async function confirmarEscolha() {
    if (!_iphoneSelecionado) return;
    const iphone = _iphoneSelecionado;

    const usuario = obterUsuarioLogado();
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }

    const btnConfirmar = document.querySelector('#modal-confirmar .btn-primary');
    if (btnConfirmar) {
        btnConfirmar.disabled = true;
        btnConfirmar.textContent = 'Salvando...';
    }

    const { data: jornada, error } = await _supabase
        .from('jornadas')
        .insert({
            user_id: usuario.id,
            iphone_nome: iphone.nome,
            iphone_modelo: iphone.modelo,
            iphone_armazenamento: iphone.armazenamento,
            iphone_estado: iphone.estado,
            iphone_imagem: iphone.imagem,
            valor_total: iphone.valorTotal,
            valor_acumulado: 0,
            porcentagem: 0,
            status: 'ativa'
        })
        .select()
        .single();

    if (error) {
        console.error('Erro ao salvar jornada:', error);
        mostrarToast('Erro ao salvar objetivo. Tente novamente.', 'error');
        if (btnConfirmar) {
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = 'Confirmar e começar';
        }
        return;
    }

    salvarLocal('objetivoAtivo', {
        id: jornada.id,
        iphoneId: iphone.id,
        nome: iphone.nome,
        modelo: iphone.modelo,
        armazenamento: iphone.armazenamento,
        estado: iphone.estado,
        valorTotal: iphone.valorTotal,
        valorAcumulado: 0,
        porcentagem: 0,
        depositos: [],
        dataCriacao: jornada.created_at,
        imagem: iphone.imagem
    });

    window.location.href = 'aceitar-termos.html';
}

window.fecharModal = fecharModal;
window.confirmarEscolha = confirmarEscolha;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    if (!estaAutenticado()) {
        window.location.href = 'login.html';
        return;
    }

    const usuario = obterUsuarioLogado();

    // Admin: ativa modo admin (NÃO redireciona mais)
    if (usuario && usuario.tipo === 'admin') {
        _modoAdmin = true;
        const adminBar = document.getElementById('admin-bar');
        if (adminBar) adminBar.style.display = 'block';
    }

    carregarCatalogo();

    const userNameEl = document.getElementById('user-name');
    if (userNameEl && usuario) {
        userNameEl.textContent = usuario.nome.split(' ')[0];
    }
});

console.log('✅ Escolher iPhone carregado - 20 modelos disponíveis');
