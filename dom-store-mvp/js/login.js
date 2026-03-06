/**
 * DOM Store - Login
 * Handler do formulário de login
 */

// Elementos do formulário
const formLogin = document.getElementById('form-login');
const btnLogin = document.getElementById('btn-login');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('senha');

// Intercepta submit do formulário
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault(); // CRITICAL: Previne submit padrão
        
        const email = inputEmail.value.trim();
        const senha = inputSenha.value;
        
        // Validações básicas
        if (!email || !senha) {
            mostrarToast('Preencha todos os campos', 'error');
            return;
        }
        
        if (!validarEmail(email)) {
            mostrarToast('E-mail inválido', 'error');
            return;
        }
        
        // Desabilita botão
        btnLogin.disabled = true;
        btnLogin.textContent = 'Entrando...';
        
        // Tenta fazer login
        const resultado = fazerLogin(email, senha);
        
        if (resultado.sucesso) {
            mostrarToast('Login realizado com sucesso!', 'success');
            
            // Redireciona
            setTimeout(() => {
                // Verifica se já tem objetivo ativo
                const objetivoAtivo = obterLocal('objetivoAtivo');
                
                if (objetivoAtivo) {
                    // Vai direto pro dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    // Vai escolher iPhone
                    window.location.href = 'escolher-iphone.html';
                }
            }, 500);
        } else {
            // Erro no login
            mostrarToast(resultado.erro || 'Erro ao fazer login', 'error');
            
            // Reabilita botão
            btnLogin.disabled = false;
            btnLogin.textContent = 'Entrar';
        }
    });
}

// Enter no campo de senha
if (inputSenha) {
    inputSenha.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            formLogin.dispatchEvent(new Event('submit'));
        }
    });
}

// Toggle de visibilidade da senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// Expor função globalmente para o onclick do HTML
window.togglePassword = togglePassword;

console.log('✅ Login handler carregado');
