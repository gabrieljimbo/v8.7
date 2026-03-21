/**
 * DOM Store - Sistema de Autenticação (Supabase)
 */

// Sincroniza sessão Supabase → localStorage ao inicializar
(async function inicializarSessao() {
    try {
        const { data: { session } } = await _supabase.auth.getSession();
        if (session) {
            const { data: profile } = await _supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profile) {
                salvarLocal('usuario', {
                    id: session.user.id,
                    nome: profile.nome,
                    email: session.user.email,
                    cpf: profile.cpf,
                    telefone: profile.telefone,
                    estado: profile.estado,
                    cidade: profile.cidade,
                    tipo: profile.tipo
                });
                salvarLocal('autenticado', true);
            }
        } else {
            removerLocal('usuario');
            removerLocal('autenticado');
        }
    } catch (err) {
        console.warn('Erro ao inicializar sessão:', err);
    }
})();

/**
 * Faz login do usuário via Supabase Auth
 */
async function fazerLogin(email, senha) {
    const { data, error } = await _supabase.auth.signInWithPassword({
        email,
        password: senha
    });

    if (error) {
        const msg = error.message.includes('Invalid') ? 'Email ou senha incorretos' : error.message;
        return { sucesso: false, erro: msg };
    }

    let { data: profile } = await _supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

    // Se não tem perfil mas tem dados pendentes (cadastro com email confirmation)
    if (!profile) {
        const pendingData = obterLocal('_pendingProfileData');
        if (pendingData && pendingData.email === data.user.email) {
            await _supabase.from('profiles').insert({
                id: data.user.id,
                nome: pendingData.nome,
                email: pendingData.email,
                cpf: pendingData.cpf,
                telefone: pendingData.telefone,
                estado: pendingData.estado,
                cidade: pendingData.cidade,
                tipo: 'cliente'
            });
            removerLocal('_pendingProfileData');

            const { data: newProfile } = await _supabase
                .from('profiles').select('*').eq('id', data.user.id).single();
            profile = newProfile;
        }
    }

    const dadosSessao = {
        id: data.user.id,
        nome: profile?.nome || data.user.email,
        email: data.user.email,
        cpf: profile?.cpf,
        telefone: profile?.telefone,
        estado: profile?.estado,
        cidade: profile?.cidade,
        tipo: profile?.tipo || 'cliente'
    };

    salvarLocal('usuario', dadosSessao);
    salvarLocal('autenticado', true);

    return { sucesso: true, usuario: dadosSessao };
}

/**
 * Faz logout
 */
async function fazerLogout() {
    await _supabase.auth.signOut();
    removerLocal('usuario');
    removerLocal('autenticado');
    removerLocal('objetivoAtivo');
    window.location.href = 'index.html';
}

/**
 * Verifica se está autenticado (sync - usa localStorage)
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

window.fazerLogin = fazerLogin;
window.fazerLogout = fazerLogout;
window.estaAutenticado = estaAutenticado;
window.obterUsuarioLogado = obterUsuarioLogado;
window.ehAdmin = ehAdmin;

console.log('✅ auth.js carregado (Supabase)');
