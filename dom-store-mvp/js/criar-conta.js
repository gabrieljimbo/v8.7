/**
 * DOM Store - Criar Conta (Supabase)
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

// ========== MÁSCARAS ==========
inputCPF.addEventListener('input', function(e) {
    e.target.value = mascaraCPF(e.target.value);
    if (inputCPF.classList.contains('error')) {
        inputCPF.classList.remove('error');
        cpfError.classList.add('hidden');
    }
});

inputTelefone.addEventListener('input', function(e) {
    e.target.value = mascaraTelefone(e.target.value);
});

// ========== VALIDAÇÕES ==========
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

inputConfirmarSenha.addEventListener('blur', function() {
    if (inputConfirmarSenha.value && inputSenha.value !== inputConfirmarSenha.value) {
        inputConfirmarSenha.classList.add('error');
        mostrarToast('As senhas não coincidem', 'error');
    } else {
        inputConfirmarSenha.classList.remove('error');
    }
});

// ========== SUBMIT ==========
form.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validarFormulario()) return;

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<div class="loading-spinner"></div> Criando conta...';

    const dados = {
        nome: inputNome.value.trim(),
        email: inputEmail.value.trim(),
        cpf: inputCPF.value.replace(/\D/g, ''),
        telefone: inputTelefone.value.replace(/\D/g, ''),
        estado: inputEstado.value,
        cidade: inputCidade.value.trim(),
        senha: inputSenha.value
    };

    try {
        // 1. Cadastra no Supabase Auth
        const { data: authData, error: authError } = await _supabase.auth.signUp({
            email: dados.email,
            password: dados.senha,
            options: {
                data: {
                    nome: dados.nome,
                    cpf: dados.cpf,
                    telefone: dados.telefone,
                    estado: dados.estado,
                    cidade: dados.cidade
                }
            }
        });

        if (authError) {
            const msg = authError.message.includes('already registered')
                ? 'Este email já está cadastrado'
                : authError.message;
            throw new Error(msg);
        }

        // Se retornou sessão (email confirmation desativado), salva tudo agora
        if (authData.session) {
            // 2. Salva perfil na tabela profiles
            const { error: profileError } = await _supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    nome: dados.nome,
                    email: dados.email,
                    cpf: dados.cpf,
                    telefone: dados.telefone,
                    estado: dados.estado,
                    cidade: dados.cidade,
                    tipo: 'cliente'
                });

            if (profileError && !profileError.message.includes('duplicate')) {
                throw new Error(profileError.message);
            }

            // 3. Salva sessão local
            salvarLocal('usuario', {
                id: authData.user.id,
                nome: dados.nome,
                email: dados.email,
                cpf: dados.cpf,
                telefone: dados.telefone,
                estado: dados.estado,
                cidade: dados.cidade,
                tipo: 'cliente',
                // guarda metadados para criar perfil no login se necessário
                _pendingProfile: false
            });
            salvarLocal('autenticado', true);

            mostrarToast('Conta criada com sucesso!', 'success');
            setTimeout(() => { window.location.href = 'escolher-iphone.html'; }, 1000);
        } else {
            // Email confirmation necessária — salva metadados pendentes e avisa
            salvarLocal('_pendingProfileData', {
                nome: dados.nome,
                email: dados.email,
                cpf: dados.cpf,
                telefone: dados.telefone,
                estado: dados.estado,
                cidade: dados.cidade
            });
            mostrarToast('Conta criada! Verifique seu email para confirmar o cadastro.', 'success', 6000);
            setTimeout(() => { window.location.href = 'login.html'; }, 3000);
        }

    } catch (error) {
        console.error('Erro ao criar conta:', error);
        mostrarToast(error.message || 'Erro ao criar conta. Tente novamente.', 'error');
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = 'Continuar';
    }
});

// ========== VALIDAÇÃO DO FORMULÁRIO ==========
function validarFormulario() {
    let valido = true;
    let primeiroErro = null;

    if (!inputNome.value.trim()) {
        inputNome.classList.add('error');
        mostrarToast('Por favor, preencha seu nome completo', 'error');
        valido = false;
        if (!primeiroErro) primeiroErro = inputNome;
    } else { inputNome.classList.remove('error'); }

    if (!validarEmail(inputEmail.value)) {
        inputEmail.classList.add('error');
        mostrarToast('Por favor, insira um email válido', 'error');
        valido = false;
        if (!primeiroErro) primeiroErro = inputEmail;
    } else { inputEmail.classList.remove('error'); }

    if (!validarCPF(inputCPF.value)) {
        inputCPF.classList.add('error');
        cpfError.classList.remove('hidden');
        valido = false;
        if (!primeiroErro) primeiroErro = inputCPF;
    } else {
        inputCPF.classList.remove('error');
        cpfError.classList.add('hidden');
    }

    if (!validarTelefone(inputTelefone.value)) {
        inputTelefone.classList.add('error');
        mostrarToast('Por favor, insira um telefone válido', 'error');
        valido = false;
        if (!primeiroErro) primeiroErro = inputTelefone;
    } else { inputTelefone.classList.remove('error'); }

    if (!inputEstado.value) {
        inputEstado.classList.add('error');
        mostrarToast('Por favor, selecione seu estado', 'error');
        valido = false;
        if (!primeiroErro) primeiroErro = inputEstado;
    } else { inputEstado.classList.remove('error'); }

    if (!inputCidade.value.trim()) {
        inputCidade.classList.add('error');
        mostrarToast('Por favor, insira sua cidade', 'error');
        valido = false;
        if (!primeiroErro) primeiroErro = inputCidade;
    } else { inputCidade.classList.remove('error'); }

    if (inputSenha.value.length < 8) {
        inputSenha.classList.add('error');
        mostrarToast('A senha deve ter no mínimo 8 caracteres', 'error');
        valido = false;
        if (!primeiroErro) primeiroErro = inputSenha;
    } else { inputSenha.classList.remove('error'); }

    if (inputSenha.value !== inputConfirmarSenha.value) {
        inputConfirmarSenha.classList.add('error');
        mostrarToast('As senhas não coincidem', 'error');
        valido = false;
        if (!primeiroErro) primeiroErro = inputConfirmarSenha;
    } else { inputConfirmarSenha.classList.remove('error'); }

    if (!checkboxTermos.checked) {
        mostrarToast('Você precisa aceitar os Termos de Uso', 'warning');
        valido = false;
    }

    if (!valido && primeiroErro) primeiroErro.focus();
    return valido;
}

// Redireciona se já autenticado
if (obterLocal('autenticado')) {
    const objetivoAtivo = obterLocal('objetivoAtivo');
    window.location.href = objetivoAtivo ? 'dashboard.html' : 'escolher-iphone.html';
}

console.log('✅ criar-conta.js carregado (Supabase)');
