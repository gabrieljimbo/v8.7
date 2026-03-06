/**
 * DOM Store - Animação de Loading/Onboarding
 * Anima DENTRO do mockup do iPhone na home (LOOP INFINITO)
 */

let animationInterval = null;
let conteudoOriginalSalvo = null;

/**
 * Inicia animação dentro do mockup ao carregar a página
 */
function iniciarAnimacaoOnboarding() {
    // Busca o mockup do iPhone na home
    const phoneScreen = document.querySelector('.phone-screen');
    if (!phoneScreen) return;
    
    // Salva conteúdo original apenas uma vez
    if (!conteudoOriginalSalvo) {
        conteudoOriginalSalvo = phoneScreen.innerHTML;
    }
    
    // Injeta conteúdo animado
    phoneScreen.innerHTML = `
        <div class="onboarding-content active">
            <!-- Ícone PIX -->
            <div class="pix-icon-animated">
                <svg width="50" height="50" viewBox="0 0 60 60" fill="none">
                    <rect x="5" y="5" width="22" height="22" rx="4" fill="#00BFA5"/>
                    <rect x="33" y="5" width="22" height="22" rx="4" fill="#00BFA5"/>
                    <rect x="5" y="33" width="22" height="22" rx="4" fill="#00BFA5"/>
                    <rect x="33" y="33" width="22" height="22" rx="4" fill="#00BFA5"/>
                    <path d="M20 20L40 40M40 20L20 40" stroke="#00BFA5" stroke-width="4" stroke-linecap="round"/>
                </svg>
                <span class="pix-label">PIX</span>
            </div>
            
            <!-- Texto principal -->
            <h3 class="onboarding-text">Não é 1x, é quando<br>quiser e puder</h3>
            <p class="onboarding-subtitle">seu próximo iPhone</p>
            
            <!-- Barra de progresso -->
            <div class="progress-wrapper">
                <div class="progress-values">
                    <span class="value-start">R$ 0</span>
                    <span class="value-end" id="progress-value">R$ 0</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" id="progress-bar"></div>
                </div>
                <div class="progress-percent" id="progress-percent">0%</div>
            </div>
        </div>
    `;
    
    // Inicia animação após pequeno delay
    setTimeout(() => animarProgresso(), 500);
}

/**
 * Anima progresso de R$ 0 até valor do iPhone
 */
function animarProgresso() {
    const valorFinal = 5999;
    const duracao = 3500; // 3.5 segundos
    const incrementos = 100;
    const intervalo = duracao / incrementos;
    
    let progresso = 0;
    let contador = 0;
    
    const progressBar = document.getElementById('progress-bar');
    const progressValue = document.getElementById('progress-value');
    const progressPercent = document.getElementById('progress-percent');
    
    // Limpa interval anterior se existir
    if (animationInterval) {
        clearInterval(animationInterval);
    }
    
    animationInterval = setInterval(() => {
        contador++;
        progresso = (contador / incrementos) * 100;
        
        // Atualiza barra
        if (progressBar) {
            progressBar.style.width = `${progresso}%`;
        }
        
        // Atualiza valor
        const valorAtual = Math.round((contador / incrementos) * valorFinal);
        if (progressValue) {
            progressValue.textContent = formatarMoeda(valorAtual);
        }
        
        // Atualiza porcentagem
        if (progressPercent) {
            progressPercent.textContent = `${Math.round(progresso)}%`;
        }
        
        // Finaliza e REINICIA
        if (contador >= incrementos) {
            clearInterval(animationInterval);
            // Aguarda 1.5s e reinicia
            setTimeout(() => {
                reiniciarAnimacao();
            }, 1500);
        }
    }, intervalo);
}

/**
 * Reinicia a animação (loop infinito)
 */
function reiniciarAnimacao() {
    const phoneScreen = document.querySelector('.phone-screen');
    if (!phoneScreen) return;
    
    // Fade out suave
    const onboardingContent = phoneScreen.querySelector('.onboarding-content');
    if (onboardingContent) {
        onboardingContent.classList.add('fade-out');
        
        // Após fade out, reinicia
        setTimeout(() => {
            iniciarAnimacaoOnboarding();
        }, 500);
    }
}

/**
 * Formata valor para moeda
 */
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(valor);
}

// Auto-iniciar quando página carrega (apenas em home)
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarAnimacaoOnboarding);
    } else {
        iniciarAnimacaoOnboarding();
    }
}

console.log('✅ Onboarding animation loaded (infinite loop)');

