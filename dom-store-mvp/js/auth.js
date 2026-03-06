/**
 * DOM Store - Sistema de Autenticação
 * 
 * Gerencia login, logout e controle de acesso
 */

// Usuários do sistema
const USUARIOS = {
    teste: {
        nome: 'Usuário Teste',
        email: 'teste@domstore.com',
        senha: '12345678',
        cpf: '12345678900',
        telefone: '11987654321',
        tipo: 'cliente',
        estado: 'SP',
        cidade: 'São Paulo'
    },
    admin: {
        nome: 'Administrador',
        email: 'admin@domstore.com',
        senha: 'admin123',
        cpf: '00000000000',
        telefone: '11999999999',
        tipo: 'admin',
        estado: 'SP',
        cidade: 'São Paulo'
    }
};

/**
 * Faz login do usuário
 */
function fazerLogin(email, senha) {
    // Busca usuário
    const usuario = Object.values(USUARIOS).find(u => u.email === email);
    
    if (!usuario) {
        return { sucesso: false, erro: 'Usuário não encontrado' };
    }
    
    if (usuario.senha !== senha) {
        return { sucesso: false, erro: 'Senha incorreta' };
    }
    
    // Salva sessão
    const dadosSessao = {
        nome: usuario.nome,
        email: usuario.email,
        cpf: usuario.cpf,
        telefone: usuario.telefone,
        tipo: usuario.tipo,
        estado: usuario.estado,
        cidade: usuario.cidade,
        dataLogin: new Date().toISOString()
    };
    
    salvarLocal('usuario', dadosSessao);
    salvarLocal('autenticado', true);
    
    return { sucesso: true, usuario: dadosSessao };
}

/**
 * Faz logout
 */
function fazerLogout() {
    removerLocal('usuario');
    removerLocal('autenticado');
    removerLocal('objetivoAtivo');
    window.location.href = 'index.html';
}

/**
 * Verifica se está autenticado
 */
function estaAutenticado() {
    return obterLocal('autenticado') === true;
}

/**
 * Obtém usuário logado
 */
function obterUsuarioLogado() {
    return obterLocal('usuario');
}

/**
 * Verifica se é admin
 */
function ehAdmin() {
    const usuario = obterUsuarioLogado();
    return usuario && usuario.tipo === 'admin';
}

// Exporta funções
window.fazerLogin = fazerLogin;
window.fazerLogout = fazerLogout;
window.estaAutenticado = estaAutenticado;
window.obterUsuarioLogado = obterUsuarioLogado;
window.ehAdmin = ehAdmin;

console.log('✅ Sistema de autenticação carregado');
console.log('👤 Usuários disponíveis:');
console.log('   Cliente: teste@domstore.com / 12345678');
console.log('   Admin: admin@domstore.com / admin123');
