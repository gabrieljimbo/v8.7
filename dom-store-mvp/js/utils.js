/**
 * DOM Store - Utilidades JavaScript
 * 
 * Funções auxiliares reutilizáveis em todo o projeto
 * Inclui: validações, formatações, máscaras, localStorage, etc.
 */

// ========== VALIDAÇÕES ==========

/**
 * Valida CPF brasileiro
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} - true se válido, false se inválido
 */
function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Valida primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    
    if (parseInt(cpf.charAt(9)) !== digito1) return false;
    
    // Valida segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    
    return parseInt(cpf.charAt(10)) === digito2;
}

/**
 * Valida email
 * @param {string} email - Email a ser validado
 * @returns {boolean} - true se válido, false se inválido
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Valida telefone brasileiro
 * @param {string} telefone - Telefone a ser validado
 * @returns {boolean} - true se válido, false se inválido
 */
function validarTelefone(telefone) {
    const numeros = telefone.replace(/[^\d]/g, '');
    return numeros.length === 10 || numeros.length === 11;
}

// ========== MÁSCARAS ==========

/**
 * Aplica máscara de CPF
 * @param {string} valor - Valor a ser formatado
 * @returns {string} - CPF formatado (000.000.000-00)
 */
function mascaraCPF(valor) {
    valor = valor.replace(/\D/g, ''); // Remove não dígitos
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return valor;
}

/**
 * Aplica máscara de telefone
 * @param {string} valor - Valor a ser formatado
 * @returns {string} - Telefone formatado ((00) 00000-0000)
 */
function mascaraTelefone(valor) {
    valor = valor.replace(/\D/g, '');
    
    if (valor.length <= 10) {
        // Formato: (00) 0000-0000
        valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
        valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        // Formato: (00) 00000-0000
        valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
        valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    return valor;
}

/**
 * Formata valor monetário
 * @param {number} valor - Valor numérico
 * @returns {string} - Valor formatado (R$ 0.000,00)
 */
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

/**
 * Remove máscara de valor monetário
 * @param {string} valor - Valor formatado
 * @returns {number} - Valor numérico
 */
function removerMascaraMoeda(valor) {
    const numero = valor.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(numero) || 0;
}

// ========== TOGGLE PASSWORD ==========

/**
 * Alterna visibilidade da senha
 * @param {string} inputId - ID do input de senha
 */
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 3L17 17" stroke="#666" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7Z" stroke="#666" stroke-width="1.5"/>
                <path d="M10 3C5.58172 3 2 10 2 10C2 10 5.58172 17 10 17C14.4183 17 18 10 18 10C18 10 14.4183 3 10 3Z" stroke="#666" stroke-width="1.5"/>
            </svg>
        `;
    } else {
        input.type = 'password';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7Z" stroke="#666" stroke-width="1.5"/>
                <path d="M10 3C5.58172 3 2 10 2 10C2 10 5.58172 17 10 17C14.4183 17 18 10 18 10C18 10 14.4183 3 10 3Z" stroke="#666" stroke-width="1.5"/>
            </svg>
        `;
    }
}

// ========== LOCAL STORAGE ==========

/**
 * Salva dados no localStorage
 * @param {string} chave - Chave do dado
 * @param {any} valor - Valor a ser salvo
 */
function salvarLocal(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
        return true;
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
        return false;
    }
}

/**
 * Recupera dados do localStorage
 * @param {string} chave - Chave do dado
 * @returns {any} - Valor recuperado ou null
 */
function obterLocal(chave) {
    try {
        const valor = localStorage.getItem(chave);
        return valor ? JSON.parse(valor) : null;
    } catch (error) {
        console.error('Erro ao obter do localStorage:', error);
        return null;
    }
}

/**
 * Remove dados do localStorage
 * @param {string} chave - Chave do dado
 */
function removerLocal(chave) {
    try {
        localStorage.removeItem(chave);
        return true;
    } catch (error) {
        console.error('Erro ao remover do localStorage:', error);
        return false;
    }
}

/**
 * Limpa todo o localStorage
 */
function limparLocal() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Erro ao limpar localStorage:', error);
        return false;
    }
}

// ========== TOAST/NOTIFICAÇÕES ==========

/**
 * Exibe notificação toast
 * @param {string} mensagem - Mensagem a ser exibida
 * @param {string} tipo - Tipo da notificação (success, error, warning, info)
 * @param {number} duracao - Duração em ms (padrão: 3000)
 */
function mostrarToast(mensagem, tipo = 'info', duracao = 3000) {
    // Remove toast anterior se existir
    const toastExistente = document.querySelector('.toast');
    if (toastExistente) {
        toastExistente.remove();
    }
    
    // Cria o toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    
    // Define ícone baseado no tipo
    let icone = '';
    switch (tipo) {
        case 'success':
            icone = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/><path d="M6 10L9 13L14 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
            break;
        case 'error':
            icone = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/><path d="M10 6V10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="13" r="0.5" fill="currentColor"/></svg>';
            break;
        case 'warning':
            icone = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3L2 17H18L10 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 8V11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="14" r="0.5" fill="currentColor"/></svg>';
            break;
        default:
            icone = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/><path d="M10 6V10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="13" r="0.5" fill="currentColor"/></svg>';
    }
    
    toast.innerHTML = `
        ${icone}
        <span>${mensagem}</span>
    `;
    
    // Adiciona estilos inline
    toast.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        padding: 16px 24px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    // Adiciona cor baseada no tipo
    const cores = {
        success: '#00BFA5',
        error: '#F44336',
        warning: '#FF9800',
        info: '#2196F3'
    };
    toast.style.color = cores[tipo] || cores.info;
    
    // Adiciona ao body
    document.body.appendChild(toast);
    
    // Remove após duração
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duracao);
}

// Adiciona animações CSS para o toast
if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ========== DEBOUNCE ==========

/**
 * Cria função com debounce
 * @param {Function} func - Função a ser executada
 * @param {number} delay - Delay em ms
 * @returns {Function} - Função com debounce
 */
function debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ========== UTILITÁRIOS DE DATA ==========

/**
 * Formata data para padrão brasileiro
 * @param {Date|string} data - Data a ser formatada
 * @returns {string} - Data formatada (dd/mm/aaaa)
 */
function formatarData(data) {
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

/**
 * Formata data e hora
 * @param {Date|string} data - Data a ser formatada
 * @returns {string} - Data e hora formatadas (dd/mm/aaaa às HH:mm)
 */
function formatarDataHora(data) {
    const d = new Date(data);
    const dataFormatada = formatarData(d);
    const hora = String(d.getHours()).padStart(2, '0');
    const minuto = String(d.getMinutes()).padStart(2, '0');
    return `${dataFormatada} às ${hora}:${minuto}`;
}

// Exporta funções para uso global
window.validarCPF = validarCPF;
window.validarEmail = validarEmail;
window.validarTelefone = validarTelefone;
window.mascaraCPF = mascaraCPF;
window.mascaraTelefone = mascaraTelefone;
window.formatarMoeda = formatarMoeda;
window.removerMascaraMoeda = removerMascaraMoeda;
window.togglePassword = togglePassword;
window.salvarLocal = salvarLocal;
window.obterLocal = obterLocal;
window.removerLocal = removerLocal;
window.limparLocal = limparLocal;
window.mostrarToast = mostrarToast;
window.debounce = debounce;
window.formatarData = formatarData;
window.formatarDataHora = formatarDataHora;
