/**
 * DOM Store - Depositar JS
 */

const valorInput = document.getElementById('valor-input');
const btnGerarPix = document.getElementById('btn-gerar-pix');
const faltaMeta = document.getElementById('falta-meta');
const modalPix = document.getElementById('modal-pix');
const valorPix = document.getElementById('valor-pix');

let valorAtual = 0;

// Carrega dados
function carregarDados() {
    const objetivo = obterLocal('objetivoAtivo');
    if (!objetivo) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    const faltante = objetivo.valorTotal - (objetivo.valorAcumulado || 0);
    faltaMeta.textContent = formatarMoeda(faltante);
}

// Formata valor enquanto digita
valorInput.addEventListener('input', function(e) {
    let valor = e.target.value.replace(/\D/g, '');
    
    if (valor) {
        valor = (parseInt(valor) / 100).toFixed(2);
        e.target.value = valor.replace('.', ',');
        valorAtual = parseFloat(valor);
        
        btnGerarPix.disabled = valorAtual < 5;
    } else {
        valorAtual = 0;
        btnGerarPix.disabled = true;
    }
});

// Botões de valor rápido
document.querySelectorAll('.btn-valor').forEach(btn => {
    btn.addEventListener('click', function() {
        const valor = parseFloat(this.dataset.valor);
        valorInput.value = valor.toFixed(2).replace('.', ',');
        valorAtual = valor;
        btnGerarPix.disabled = false;
    });
});

// Gera PIX
btnGerarPix.addEventListener('click', function() {
    if (valorAtual < 5) {
        mostrarToast('Valor mínimo: R$ 5,00', 'warning');
        return;
    }
    
    valorPix.textContent = formatarMoeda(valorAtual);
    modalPix.classList.remove('hidden');
});

function fecharModalPix() {
    modalPix.classList.add('hidden');
}

function copiarCodigo() {
    mostrarToast('Código Pix copiado!', 'success');
}

// Nova função: Copiar chave PIX
function copiarChavePix() {
    const chavePix = document.getElementById('chave-pix');
    const feedback = document.getElementById('copy-feedback');
    
    // Copia para clipboard
    chavePix.select();
    chavePix.setSelectionRange(0, 99999); // Para mobile
    
    navigator.clipboard.writeText(chavePix.value).then(() => {
        // Mostra feedback
        feedback.classList.remove('hidden');
        mostrarToast('Chave PIX copiada!', 'success');
        
        // Esconde feedback após 2s
        setTimeout(() => {
            feedback.classList.add('hidden');
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        mostrarToast('Erro ao copiar chave', 'error');
    });
}

async function confirmarPagamento() {
    const objetivo = obterLocal('objetivoAtivo');
    if (!objetivo) return;

    const { data: { user } } = await _supabase.auth.getUser();
    if (!user) {
        mostrarToast('Sessão expirada. Faça login novamente.', 'error');
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }

    const btnPago = document.querySelector('[onclick="confirmarPagamento()"]');
    if (btnPago) {
        btnPago.disabled = true;
        btnPago.textContent = 'Enviando...';
    }

    // Cria depósito com status PENDENTE — aguarda validação do admin
    const { error: depositoError } = await _supabase
        .from('depositos')
        .insert({
            user_id: user.id,
            jornada_id: objetivo.id,
            valor: valorAtual,
            tipo: 'pix',
            status: 'pendente'
        });

    if (depositoError) {
        console.error('Erro ao salvar depósito:', depositoError);
        mostrarToast('Erro ao registrar depósito. Tente novamente.', 'error');
        if (btnPago) {
            btnPago.disabled = false;
            btnPago.textContent = 'Já paguei';
        }
        return;
    }

    // Adiciona ao histórico local como pendente (sem atualizar valor acumulado)
    if (!objetivo.depositos) objetivo.depositos = [];
    objetivo.depositos.push({
        valor: valorAtual,
        data: new Date().toISOString(),
        tipo: 'pix',
        status: 'pendente'
    });
    salvarLocal('objetivoAtivo', objetivo);

    fecharModalPix();
    mostrarToast('Depósito enviado! Aguardando validação do administrador.', 'success', 5000);
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
}

window.fecharModalPix = fecharModalPix;
window.copiarCodigo = copiarCodigo;
window.copiarChavePix = copiarChavePix;
window.confirmarPagamento = confirmarPagamento;

carregarDados();
console.log('✅ depositar.js carregado');
