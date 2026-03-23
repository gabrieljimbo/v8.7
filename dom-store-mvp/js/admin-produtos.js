/**
 * DOM Store — Admin Produtos
 * CRUD de produtos com upload de foto para Supabase Storage
 */

let _produtoParaExcluir = null;
let _fotoUrl = null; // URL da foto após upload
let _fotoArquivo = null; // Arquivo selecionado (ainda não enviado)

// =============================================
// INICIALIZAÇÃO
// =============================================

// Catálogo hardcoded (copiar apenas nome e id para referência)
const IPHONES_HARDCODE = [
    { id: 1, nome: 'iPhone 11 128GB Seminovo' },
    { id: 2, nome: 'iPhone 11 64GB Seminovo' },
    { id: 3, nome: 'iPhone 12 Pro Max Seminovo' },
    { id: 4, nome: 'iPhone 12 Pro Seminovo' },
    { id: 5, nome: 'iPhone 13 128GB Lacrado' },
    { id: 6, nome: 'iPhone 13 128GB Seminovo' },
    { id: 7, nome: 'iPhone 13 128GB Seminovo (2)' },
    { id: 8, nome: 'iPhone 14 Pro Max 128GB Seminovo' },
    { id: 9, nome: 'iPhone 14 Pro Max 256GB Seminovo' },
    { id: 10, nome: 'iPhone 14 Pro 128GB Seminovo' },
    { id: 11, nome: 'iPhone 14 Pro 256GB Seminovo' },
    { id: 12, nome: 'iPhone 14 128GB Seminovo' },
    { id: 13, nome: 'iPhone 15 Pro Max 256GB Seminovo' },
    { id: 14, nome: 'iPhone 16 Pro Max Seminovo' },
    { id: 15, nome: 'iPhone 16 Pro 128GB Seminovo' },
    { id: 16, nome: 'iPhone 16 Pro 256GB Seminovo' },
    { id: 17, nome: 'iPhone 16 128GB Lacrado' },
    { id: 18, nome: 'iPhone 17 Pro Max 256GB Lacrado' },
    { id: 19, nome: 'iPhone 17 Pro 256GB Lacrado' },
    { id: 20, nome: 'iPhone 17 256GB Lacrado' },
];

document.addEventListener('DOMContentLoaded', () => {
    if (!estaAutenticado()) {
        window.location.href = 'login.html';
        return;
    }

    const usuario = obterUsuarioLogado();
    if (!usuario || usuario.tipo !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    const adminNomeEl = document.getElementById('admin-nome');
    if (adminNomeEl) adminNomeEl.textContent = usuario.nome?.split(' ')[0] || 'Admin';

    carregarProdutos();
    carregarOcultosHardcode();
    configurarDragDrop();
});

// =============================================
// CARREGAR PRODUTOS
// =============================================

async function carregarProdutos() {
    const grid = document.getElementById('produtos-grid');
    const vazio = document.getElementById('estado-vazio');

    grid.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Carregando produtos...</p></div>';

    const { data, error } = await _supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        grid.innerHTML = '<div class="loading-state"><p style="color:#e00">Erro ao carregar produtos.</p></div>';
        return;
    }

    if (!data || data.length === 0) {
        grid.innerHTML = '';
        vazio.style.display = 'flex';
        return;
    }

    vazio.style.display = 'none';
    grid.innerHTML = '';
    data.forEach(p => grid.appendChild(criarCard(p)));
}

function criarCard(produto) {
    const card = document.createElement('div');
    card.className = `produto-card ${produto.ativo ? '' : 'inativo'}`;

    const imgHtml = produto.imagem_url
        ? `<img class="produto-card-img" src="${produto.imagem_url}" alt="${produto.nome}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
        : '';

    const placeholderHtml = `<div class="produto-card-img-placeholder" ${produto.imagem_url ? 'style="display:none"' : ''}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="2" y="7" width="32" height="22" rx="3" stroke="#ddd" stroke-width="1.5"/><circle cx="12" cy="16" r="3.5" stroke="#ddd" stroke-width="1.5"/><path d="M2 24l9-8 6 6 5-5 14 10" stroke="#ddd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>`;

    const badgeHtml = produto.badge
        ? `<span class="produto-badge badge-${produto.badge.toLowerCase()}">${produto.badge}</span>`
        : '';

    const destaqueHtml = produto.destaque
        ? `<span class="produto-destaque-star">★</span>`
        : '';

    const inativoHtml = !produto.ativo
        ? `<span class="produto-inativo-tag">INATIVO</span>`
        : '';

    card.innerHTML = `
        ${imgHtml}
        ${placeholderHtml}
        ${badgeHtml}
        ${produto.destaque && produto.ativo ? destaqueHtml : ''}
        ${!produto.ativo ? inativoHtml : ''}
        <div class="produto-card-body">
            <p class="produto-card-nome">${produto.nome}</p>
            <p class="produto-card-specs">${[produto.armazenamento, produto.estado].filter(Boolean).join(' • ')}</p>
            <p class="produto-card-valor">${formatarMoeda(produto.valor_total)}</p>
            <div class="produto-card-actions">
                <button class="btn-editar" onclick="abrirModalEditar(${JSON.stringify(produto).replace(/"/g, '&quot;')})">Editar</button>
                <button class="btn-excluir-card" onclick="abrirModalExcluir('${produto.id}', '${produto.nome}')">Remover</button>
            </div>
        </div>
    `;

    return card;
}

// =============================================
// MODAL: NOVO PRODUTO
// =============================================

function abrirModalNovo() {
    limparFormulario();
    document.getElementById('modal-titulo').textContent = 'Novo Produto';
    document.getElementById('modal-produto').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// =============================================
// MODAL: EDITAR PRODUTO
// =============================================

function abrirModalEditar(produto) {
    limparFormulario();
    document.getElementById('modal-titulo').textContent = 'Editar Produto';

    document.getElementById('produto-id').value = produto.id;
    document.getElementById('produto-nome').value = produto.nome || '';
    document.getElementById('produto-modelo').value = produto.modelo || '';
    document.getElementById('produto-armazenamento').value = produto.armazenamento || '';
    document.getElementById('produto-estado').value = produto.estado || 'Lacrado';
    document.getElementById('produto-valor').value = produto.valor_total || '';
    document.getElementById('produto-badge').value = produto.badge || '';
    document.getElementById('produto-destaque').checked = produto.destaque || false;
    document.getElementById('produto-ativo').checked = produto.ativo !== false;

    if (produto.imagem_url) {
        _fotoUrl = produto.imagem_url;
        const preview = document.getElementById('preview-foto');
        preview.src = produto.imagem_url;
        preview.style.display = 'block';
        document.getElementById('upload-placeholder').style.display = 'none';
    }

    document.getElementById('modal-produto').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    document.getElementById('modal-produto').classList.add('hidden');
    document.body.style.overflow = '';
    limparFormulario();
}

function limparFormulario() {
    document.getElementById('form-produto').reset();
    document.getElementById('produto-id').value = '';
    document.getElementById('preview-foto').style.display = 'none';
    document.getElementById('preview-foto').src = '';
    document.getElementById('upload-placeholder').style.display = 'flex';
    document.getElementById('upload-progress').classList.add('hidden');
    document.getElementById('form-erro').classList.add('hidden');
    _fotoUrl = null;
    _fotoArquivo = null;
}

// =============================================
// UPLOAD DE FOTO
// =============================================

function previewFoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        mostrarErroForm('A foto deve ter no máximo 5MB.');
        return;
    }

    _fotoArquivo = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('preview-foto');
        preview.src = e.target.result;
        preview.style.display = 'block';
        document.getElementById('upload-placeholder').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

async function uploadFoto() {
    if (!_fotoArquivo) return _fotoUrl; // Retorna URL existente se não há novo arquivo

    const progress = document.getElementById('upload-progress');
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');

    progress.classList.remove('hidden');
    fill.style.width = '20%';
    text.textContent = 'Enviando foto...';

    const ext = _fotoArquivo.name.split('.').pop();
    const nomeArquivo = `produto-${Date.now()}.${ext}`;

    fill.style.width = '50%';

    const { data, error } = await _supabase.storage
        .from('produtos')
        .upload(nomeArquivo, _fotoArquivo, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        progress.classList.add('hidden');
        throw new Error('Erro ao enviar foto: ' + error.message);
    }

    fill.style.width = '100%';
    text.textContent = 'Foto enviada!';

    // Pegar URL pública
    const { data: urlData } = _supabase.storage
        .from('produtos')
        .getPublicUrl(nomeArquivo);

    setTimeout(() => progress.classList.add('hidden'), 800);

    return urlData.publicUrl;
}

// =============================================
// SALVAR PRODUTO (INSERT / UPDATE)
// =============================================

async function salvarProduto(event) {
    event.preventDefault();

    const btnText = document.getElementById('btn-salvar-text');
    const btnLoad = document.getElementById('btn-salvar-load');
    const btn = document.getElementById('btn-salvar');

    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoad.style.display = 'inline';
    document.getElementById('form-erro').classList.add('hidden');

    try {
        // 1. Fazer upload da foto se houver novo arquivo
        const fotoFinal = await uploadFoto();

        // 2. Montar dados do produto
        const dados = {
            nome: document.getElementById('produto-nome').value.trim(),
            modelo: document.getElementById('produto-modelo').value.trim() || null,
            armazenamento: document.getElementById('produto-armazenamento').value.trim() || null,
            estado: document.getElementById('produto-estado').value,
            valor_total: parseFloat(document.getElementById('produto-valor').value),
            badge: document.getElementById('produto-badge').value || null,
            destaque: document.getElementById('produto-destaque').checked,
            ativo: document.getElementById('produto-ativo').checked,
            imagem_url: fotoFinal || null
        };

        const idExistente = document.getElementById('produto-id').value;

        let error;
        if (idExistente) {
            // UPDATE
            ({ error } = await _supabase
                .from('produtos')
                .update(dados)
                .eq('id', idExistente));
        } else {
            // INSERT
            ({ error } = await _supabase
                .from('produtos')
                .insert(dados));
        }

        if (error) throw new Error(error.message);

        fecharModal();
        mostrarToast(idExistente ? 'Produto atualizado!' : 'Produto adicionado!', 'success');
        carregarProdutos();

    } catch (err) {
        mostrarErroForm(err.message || 'Erro ao salvar produto.');
    } finally {
        btn.disabled = false;
        btnText.style.display = 'inline';
        btnLoad.style.display = 'none';
    }
}

// =============================================
// EXCLUIR PRODUTO
// =============================================

function abrirModalExcluir(id, nome) {
    _produtoParaExcluir = id;
    document.getElementById('excluir-nome-produto').textContent = nome;
    document.getElementById('modal-excluir').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function fecharModalExcluir() {
    document.getElementById('modal-excluir').classList.add('hidden');
    document.body.style.overflow = '';
    _produtoParaExcluir = null;
}

async function confirmarExclusao() {
    if (!_produtoParaExcluir) return;

    const btn = document.getElementById('btn-confirmar-excluir');
    btn.disabled = true;
    btn.textContent = 'Removendo...';

    const { error } = await _supabase
        .from('produtos')
        .delete()
        .eq('id', _produtoParaExcluir);

    btn.disabled = false;
    btn.textContent = 'Remover';

    if (error) {
        mostrarToast('Erro ao remover produto.', 'error');
        return;
    }

    fecharModalExcluir();
    mostrarToast('Produto removido.', 'success');
    carregarProdutos();
}

// =============================================
// DRAG & DROP
// =============================================

function configurarDragDrop() {
    const area = document.getElementById('upload-area');
    if (!area) return;

    area.addEventListener('dragover', (e) => {
        e.preventDefault();
        area.classList.add('drag-over');
    });

    area.addEventListener('dragleave', () => area.classList.remove('drag-over'));

    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            _fotoArquivo = file;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const preview = document.getElementById('preview-foto');
                preview.src = ev.target.result;
                preview.style.display = 'block';
                document.getElementById('upload-placeholder').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });
}

// =============================================
// PRODUTOS HARDCODED OCULTOS
// =============================================

async function carregarOcultosHardcode() {
    const { data, error } = await _supabase
        .from('hardcode_ocultos')
        .select('produto_id')
        .order('produto_id');

    if (error || !data || data.length === 0) return;

    const secao = document.getElementById('secao-ocultos');
    const grid = document.getElementById('ocultos-grid');
    if (!secao || !grid) return;

    secao.style.display = 'block';
    grid.innerHTML = '';

    data.forEach(({ produto_id }) => {
        const info = IPHONES_HARDCODE.find(h => h.id === produto_id);
        const nome = info?.nome || `Produto local #${produto_id}`;

        const card = document.createElement('div');
        card.className = 'produto-card';
        card.style.opacity = '0.7';
        card.innerHTML = `
            <div class="produto-card-img-placeholder">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="2" y="7" width="32" height="22" rx="3" stroke="#ddd" stroke-width="1.5"/><path d="M2 24l9-8 6 6 5-5 14 10" stroke="#ddd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="produto-card-body">
                <p class="produto-card-nome">${nome}</p>
                <p class="produto-card-specs">Catálogo local • ID ${produto_id}</p>
                <p class="produto-card-specs" style="color:#e57600;font-size:11px;">Oculto para clientes</p>
                <div class="produto-card-actions" style="margin-top:10px;">
                    <button class="btn-editar" onclick="reexibirHardcode(${produto_id}, this)">Reexibir</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function reexibirHardcode(produtoId, btn) {
    btn.disabled = true;
    btn.textContent = 'Reexibindo...';

    const { error } = await _supabase
        .from('hardcode_ocultos')
        .delete()
        .eq('produto_id', produtoId);

    if (error) {
        btn.disabled = false;
        btn.textContent = 'Reexibir';
        mostrarToast('Erro ao reexibir produto.', 'error');
        return;
    }

    mostrarToast('Produto reexibido no catálogo!', 'success');
    carregarOcultosHardcode();
}

// =============================================
// HELPERS
// =============================================

function mostrarErroForm(msg) {
    const el = document.getElementById('form-erro');
    el.textContent = msg;
    el.classList.remove('hidden');
}

function sair() {
    _supabase.auth.signOut().then(() => {
        localStorage.clear();
        window.location.href = 'login.html';
    });
}

// Fechar modais clicando fora
document.addEventListener('click', (e) => {
    if (e.target.id === 'modal-produto') fecharModal();
    if (e.target.id === 'modal-excluir') fecharModalExcluir();
});

console.log('✅ Admin Produtos carregado');
