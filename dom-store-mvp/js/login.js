/**
 * DOM Store - Login (Supabase)
 */

const formLogin = document.getElementById('form-login');
const btnLogin = document.getElementById('btn-login');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('senha');

if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = inputEmail.value.trim();
        const senha = inputSenha.value;

        if (!email || !senha) {
            mostrarToast('Preencha todos os campos', 'warning');
            return;
        }

        if (!validarEmail(email)) {
            mostrarToast('E-mail inválido', 'error');
            return;
        }

        btnLogin.disabled = true;
        btnLogin.innerHTML = '<div class="loading-spinner"></div> Entrando...';

        const resultado = await fazerLogin(email, senha);

        if (resultado.sucesso) {
            mostrarToast('Login realizado com sucesso!', 'success');
            setTimeout(() => {
                if (resultado.usuario.tipo === 'admin') {
                    window.location.href = 'admin.html';
                    return;
                }
                const objetivoAtivo = obterLocal('objetivoAtivo');
                if (objetivoAtivo && !objetivoAtivo.cancelado) {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'escolher-iphone.html';
                }
            }, 1000);
        } else {
            mostrarToast(resultado.erro || 'Erro ao fazer login', 'error');
            btnLogin.disabled = false;
            btnLogin.innerHTML = 'Entrar';
        }
    });
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
}
window.togglePassword = togglePassword;

// Redireciona se já autenticado
if (obterLocal('autenticado')) {
    const usuario = obterLocal('usuario');
    if (usuario && usuario.tipo === 'admin') {
        window.location.href = 'admin.html';
    } else {
        const objetivoAtivo = obterLocal('objetivoAtivo');
        if (objetivoAtivo && !objetivoAtivo.cancelado) {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'escolher-iphone.html';
        }
    }
}

console.log('✅ login.js carregado (Supabase)');
