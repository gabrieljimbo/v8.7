/**
 * DOM Store - Criar Conta
 * 
 * JavaScript para página de criação de conta
 * Gerencia: validações, máscaras, submit do formulário
 */

// ========== ELEMENTOS DO DOM ==========
const form = document.getElementById('form-criar-conta');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputCPF = document.getElementById('cpf');
const inputTelefone = document.getElementById('telefone');
const inputEstado = document.getElementById('estado');
const inputCidade = document.getElementById('cidade');
const inputSenha = document.getElementById('senha');
const inputConfirmarSenha = document.getElementById('confirmar-senha');
const checkboxTermos = document.getElementById('aceitar-termos');
const btnSubmit = document.getElementById('btn-criar-conta');
const cpfError = document.getElementById('cpf-error');

// ========== MÁSCARAS EM TEMPO REAL ==========

/**
 * Aplica máscara de CPF enquanto usuário digita
 */
inputCPF.addEventListener('input', function(e) {
    e.target.value = mascaraCPF(e.target.value);
    
    // Remove erro visual quando usuário começa a digitar novamente
    if (inputCPF.classList.contains('error')) {
        inputCPF.classList.remove('error');
        cpfError.classList.add('hidden');
    }
});

/**
 * Aplica máscara de telefone enquanto usuário digita
 */
inputTelefone.addEventListener('input', function(e) {
    e.target.value = mascaraTelefone(e.target.value);
});

// ========== VALIDAÇÕES ==========

/**
 * Valida CPF ao sair do campo
 */
inputCPF.addEventListener('blur', function() {
    const cpf = inputCPF.value;
    
    if (cpf && !validarCPF(cpf)) {
        inputCPF.classList.add('error');
        cpfError.classList.remove('hidden');
    } else {
        inputCPF.classList.remove('error');
        cpfError.classList.add('hidden');
    }
});

/**
 * Valida se senhas coincidem
 */
inputConfirmarSenha.addEventListener('blur', function() {
    const senha = inputSenha.value;
    const confirmarSenha = inputConfirmarSenha.value;
    
    if (confirmarSenha && senha !== confirmarSenha) {
        inputConfirmarSenha.classList.add('error');
        mostrarToast('As senhas não coincidem', 'error');
    } else {
        inputConfirmarSenha.classList.remove('error');
    }
});

// ========== SUBMIT DO FORMULÁRIO ==========

/**
 * Processa submissão do formulário
 */
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validações finais
    if (!validarFormulario()) {
        return;
    }
    
    // Mostra loading no botão
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<div class="loading-spinner"></div> Criando conta...';
    
    // Coleta dados do formulário
    const dados = {
        nome: inputNome.value.trim(),
        email: inputEmail.value.trim(),
        cpf: inputCPF.value.replace(/\D/g, ''), // Remove formatação
        telefone: inputTelefone.value.replace(/\D/g, ''), // Remove formatação
        estado: inputEstado.value,
        cidade: inputCidade.value.trim(),
        senha: inputSenha.value,
        aceitouTermos: checkboxTermos.checked,
        dataCriacao: new Date().toISOString()
    };
    
    try {
        // Simula chamada de API (substituir por chamada real)
        await simularCriacaoConta(dados);
        
        // Salva dados do usuário no localStorage (apenas para MVP)
        salvarLocal('usuario', {
            nome: dados.nome,
            email: dados.email,
            cpf: dados.cpf,
            telefone: dados.telefone,
            estado: dados.estado,
            cidade: dados.cidade,
            dataCriacao: dados.dataCriacao
        });
        
        // Marca como autenticado
        salvarLocal('autenticado', true);
        
        // Sucesso
        mostrarToast('Conta criada com sucesso!', 'success');
        
        // Aguarda 1 segundo e redireciona para escolha de iPhone
        setTimeout(() => {
            window.location.href = 'escolher-iphone.html';
        }, 1000);
        
    } catch (error) {
        console.error('Erro ao criar conta:', error);
        mostrarToast('Erro ao criar conta. Tente novamente.', 'error');
        
        // Restaura botão
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = 'Continuar';
    }
});

/**
 * Valida todos os campos do formulário
 * @returns {boolean} - true se válido, false se inválido
 */
function validarFormulario() {
    let valido = true;
    let primeiroErro = null;
    
    // Valida nome
    if (!inputNome.value.trim()) {
        inputNome.classList.add('error');
        mostrarToast('Por favor, preencha seu nome completo', 'error');
        valido = false;
        if (!primeiroErro) primeiroErro = inputNome;
    } else {
        inputNome.classList.remove('error');
    }
    
    // Valida email
    if (!validarEmail(inputEmail.value)) {
        inputEmail.classList.add('error');
        mostrarToast('Por favor, insira um email válido', 'error');
        valido = false;
        if (!primeiroErro) primeiroErro = inputEmail;
    } else {
        inputEmail.classList.remove('error');
    }
    
    // Valida CPF
    if (!validarCPF(inputCPF.value)) {
        inputCPF.classList.add('error');
        cpfError.classList.remove('hidden');
        valido = false;
        if (!primeiroErro) primeiroErro = inputCPF;
    } else {
        inputCPF.classList.remove('error');
        cpfError.classList.add('hidden');
    }
    
    // Valida telefone
    if (!validarTelefone(inputTelefone.value)) {
        inputTelefone.classList.add('error');
        mostrarToast('Por favor, insira um telefone válido', 'error');
        valido = false;
        if (!primeiroErro) primeiroErro = inputTelefone;
    } else {
        inputTelefone.classList.remove('error');
    }
    
    // Valida estado
    if (!inputEstado.value) {
        inputEstado.classList.add('error');
        mostrarToast('Por favor, selecione seu estado', 'error');
        valido = false;
        if (!primeiroErro) primeiroErro = inputEstado;
    } else {
        inputEstado.classList.remove('error');
    }
    
    // Valida cidade
    if (!inputCidade.value.trim()) {
        inputCidade.classList.add('error');
        mostrarToast('Por favor, insira sua cidade', 'error');
        valido = false;
        if (!primeiroErro) primeiroErro = inputCidade;
    } else {
        inputCidade.classList.remove('error');
    }
    
    // Valida senha
    if (inputSenha.value.length < 8) {
        inputSenha.classList.add('error');
        mostrarToast('A senha deve ter no mínimo 8 caracteres', 'error');
        valido = false;
        if (!primeiroErro) primeiroErro = inputSenha;
    } else {
        inputSenha.classList.remove('error');
    }
    
    // Valida confirmação de senha
    if (inputSenha.value !== inputConfirmarSenha.value) {
        inputConfirmarSenha.classList.add('error');
        mostrarToast('As senhas não coincidem', 'error');
        valido = false;
        if (!primeiroErro) primeiroErro = inputConfirmarSenha;
    } else {
        inputConfirmarSenha.classList.remove('error');
    }
    
    // Valida checkbox de termos
    if (!checkboxTermos.checked) {
        mostrarToast('Você precisa aceitar os Termos de Uso', 'warning');
        valido = false;
    }
    
    // Foca no primeiro campo com erro
    if (!valido && primeiroErro) {
        primeiroErro.focus();
    }
    
    return valido;
}

/**
 * Simula criação de conta (substituir por API real)
 * @param {Object} dados - Dados do usuário
 * @returns {Promise} - Promise que resolve após 1 segundo
 */
function simularCriacaoConta(dados) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simula sucesso (95% de chance)
            if (Math.random() > 0.05) {
                console.log('Conta criada:', dados);
                resolve(dados);
            } else {
                // Simula erro (5% de chance)
                reject(new Error('Erro ao criar conta'));
            }
        }, 1500);
    });
}

// ========== INICIALIZAÇÃO ==========

/**
 * Verifica se usuário já está autenticado
 */
function verificarAutenticacao() {
    const autenticado = obterLocal('autenticado');
    
    if (autenticado) {
        // Se já está autenticado, redireciona para dashboard
        const objetivoAtivo = obterLocal('objetivoAtivo');
        if (objetivoAtivo) {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'escolher-iphone.html';
        }
    }
}

// Verifica autenticação ao carregar página
verificarAutenticacao();

// ========== CONSOLE LOG ==========
console.log('✅ criar-conta.js carregado');
