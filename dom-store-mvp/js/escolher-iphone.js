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

// Renderizar iPhones no grid
function renderizarIphones() {
    const grid = document.getElementById('iphones-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    iphones.forEach(iphone => {
        const card = document.createElement('div');
        card.className = `iphone-card ${iphone.destaque ? 'destaque' : ''}`;
        card.onclick = () => selecionarIphone(iphone);
        
        const badgeHtml = iphone.badge ? `<span class="badge-iphone badge-${iphone.badge.toLowerCase()}">${iphone.badge}</span>` : '';
        
        card.innerHTML = `
            ${badgeHtml}
            <div class="iphone-imagem">
                <img 
                    src="${iphone.imagem}" 
                    alt="${iphone.nome}" 
                    loading="lazy"
                    onerror="console.error('Erro ao carregar:', '${iphone.imagem}'); this.onerror=null; this.src='assets/logo-dom-novo.png'; this.style.padding='20px';"
                    onload="console.log('✅ Imagem carregada:', '${iphone.imagem}')">
            </div>
            <div class="iphone-info">
                <h3 class="iphone-nome">${iphone.nome}</h3>
                <p class="iphone-specs">${iphone.armazenamento} • ${iphone.estado}</p>
                <p class="iphone-valor">${formatarMoeda(iphone.valorTotal)}</p>
                <button class="btn btn-primary btn-full">
                    Escolher este iPhone
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

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

    const _u = obterUsuarioLogado();
    if (_u && _u.tipo === 'admin') {
        window.location.href = 'dashboard-admin.html';
        return;
    }
    
    renderizarIphones();
    
    const usuario = obterUsuarioLogado();
    const userNameEl = document.getElementById('user-name');
    if (userNameEl && usuario) {
        userNameEl.textContent = usuario.nome.split(' ')[0];
    }
});

console.log('✅ Escolher iPhone carregado - 20 modelos disponíveis');
