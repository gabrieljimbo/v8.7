/**
 * DOM Store - Instalação PWA
 * Detecta dispositivo e mostra instruções adequadas
 */

let deferredPrompt = null;

// Detectar tipo de dispositivo
function detectarDispositivo() {
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
    const isChrome = /chrome/.test(ua);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                      || window.navigator.standalone 
                      || document.referrer.includes('android-app://');
    
    return {
        isIOS,
        isAndroid,
        isSafari,
        isChrome,
        isStandalone,
        isMobile: isIOS || isAndroid
    };
}

// Captura evento de instalação (Android/Desktop Chrome)
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('💡 Prompt de instalação disponível');
    e.preventDefault();
    deferredPrompt = e;
});

// Instalar PWA (Android/Desktop Chrome)
async function instalarPWA() {
    if (!deferredPrompt) {
        console.warn('Prompt de instalação não disponível');
        return false;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        console.log('✅ PWA instalado');
        deferredPrompt = null;
        return true;
    } else {
        console.log('❌ Instalação cancelada');
        return false;
    }
}

// Abrir modal de instalação
function abrirModalInstalacao() {
    const device = detectarDispositivo();
    
    // Se já está instalado, avisar
    if (device.isStandalone) {
        mostrarToast('O app já está instalado! 🎉', 'success');
        return;
    }
    
    // Se é Android/Desktop Chrome e tem prompt, instalar direto
    if (deferredPrompt && (device.isAndroid || (!device.isMobile && device.isChrome))) {
        instalarPWA().then(success => {
            if (success) {
                mostrarToast('App instalado com sucesso! 🎉', 'success');
            }
        });
        return;
    }
    
    // Caso contrário, mostrar modal com instruções
    mostrarModalInstrucoes(device);
}

// Mostrar modal com instruções específicas
function mostrarModalInstrucoes(device) {
    const modal = document.createElement('div');
    modal.id = 'modal-instalacao-pwa';
    modal.className = 'modal-overlay';
    modal.style.zIndex = '10000';
    
    let conteudo = '';
    
    if (device.isIOS) {
        // Instruções para iOS
        conteudo = `
            <div class="modal" style="max-width: 400px;">
                <div class="modal-header" style="background: #FFF9E6; border-bottom: 2px solid #FEDB19;">
                    <div class="modal-title-container">
                        <span style="font-size: 32px;">📱</span>
                        <div>
                            <h3 class="modal-title" style="color: #F57C00;">Instalar App iOS</h3>
                            <p class="modal-subtitle">Siga os passos abaixo</p>
                        </div>
                    </div>
                    <button class="modal-close" onclick="fecharModalInstalacao()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="#666" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                
                <div class="modal-body" style="padding: 24px;">
                    <div style="background: #FFFBF0; border: 2px solid #FEDB19; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                        <p style="font-weight: 600; margin-bottom: 16px; color: #333;">📋 Passos para instalar:</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 16px;">
                            <div style="display: flex; gap: 12px; align-items: start;">
                                <div style="background: #FEDB19; color: #000; font-weight: 700; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">1</div>
                                <div>
                                    <p style="font-weight: 600; margin-bottom: 4px;">Toque no botão de compartilhar</p>
                                    <p style="font-size: 14px; color: #666;">Ícone <span style="font-size: 20px;">□↑</span> na parte <strong>inferior</strong> da tela</p>
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 12px; align-items: start;">
                                <div style="background: #FEDB19; color: #000; font-weight: 700; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">2</div>
                                <div>
                                    <p style="font-weight: 600; margin-bottom: 4px;">Role para baixo</p>
                                    <p style="font-size: 14px; color: #666;">Procure por "Adicionar à Tela de Início"</p>
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 12px; align-items: start;">
                                <div style="background: #FEDB19; color: #000; font-weight: 700; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">3</div>
                                <div>
                                    <p style="font-weight: 600; margin-bottom: 4px;">Toque em "Adicionar"</p>
                                    <p style="font-size: 14px; color: #666;">Confirme no canto superior direito</p>
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 12px; align-items: start;">
                                <div style="background: #4CAF50; color: #fff; font-weight: 700; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">✓</div>
                                <div>
                                    <p style="font-weight: 600; margin-bottom: 4px;">Pronto!</p>
                                    <p style="font-size: 14px; color: #666;">O ícone aparecerá na sua tela inicial</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: #E3F2FD; border-left: 4px solid #2196F3; padding: 12px; border-radius: 8px;">
                        <p style="font-size: 13px; color: #1976D2;">
                            <strong>💡 Dica:</strong> Certifique-se de estar usando o <strong>Safari</strong> para instalar o app.
                        </p>
                    </div>
                </div>
                
                <div class="modal-footer" style="padding: 16px 24px; border-top: 1px solid #E0E0E0;">
                    <button class="btn btn-primary" onclick="fecharModalInstalacao()" style="width: 100%;">
                        Entendi
                    </button>
                </div>
            </div>
        `;
    } else if (device.isAndroid && !deferredPrompt) {
        // Android mas sem prompt (talvez já instalado ou não suportado)
        conteudo = `
            <div class="modal" style="max-width: 400px;">
                <div class="modal-header" style="background: #FFF9E6; border-bottom: 2px solid #FEDB19;">
                    <div class="modal-title-container">
                        <span style="font-size: 32px;">📱</span>
                        <div>
                            <h3 class="modal-title" style="color: #F57C00;">Instalar App Android</h3>
                            <p class="modal-subtitle">Via menu do navegador</p>
                        </div>
                    </div>
                    <button class="modal-close" onclick="fecharModalInstalacao()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="#666" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                
                <div class="modal-body" style="padding: 24px;">
                    <div style="background: #FFFBF0; border: 2px solid #FEDB19; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                        <p style="font-weight: 600; margin-bottom: 16px; color: #333;">📋 Passos para instalar:</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 16px;">
                            <div style="display: flex; gap: 12px; align-items: start;">
                                <div style="background: #FEDB19; color: #000; font-weight: 700; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">1</div>
                                <div>
                                    <p style="font-weight: 600; margin-bottom: 4px;">Toque nos 3 pontos</p>
                                    <p style="font-size: 14px; color: #666;">Menu <span style="font-size: 20px;">⋮</span> no canto superior direito</p>
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 12px; align-items: start;">
                                <div style="background: #FEDB19; color: #000; font-weight: 700; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">2</div>
                                <div>
                                    <p style="font-weight: 600; margin-bottom: 4px;">Toque em "Instalar app"</p>
                                    <p style="font-size: 14px; color: #666;">Ou "Adicionar à tela inicial"</p>
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 12px; align-items: start;">
                                <div style="background: #FEDB19; color: #000; font-weight: 700; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">3</div>
                                <div>
                                    <p style="font-weight: 600; margin-bottom: 4px;">Confirme a instalação</p>
                                    <p style="font-size: 14px; color: #666;">Toque em "Instalar"</p>
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 12px; align-items: start;">
                                <div style="background: #4CAF50; color: #fff; font-weight: 700; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">✓</div>
                                <div>
                                    <p style="font-weight: 600; margin-bottom: 4px;">Pronto!</p>
                                    <p style="font-size: 14px; color: #666;">O app abrirá automaticamente</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer" style="padding: 16px 24px; border-top: 1px solid #E0E0E0;">
                    <button class="btn btn-primary" onclick="fecharModalInstalacao()" style="width: 100%;">
                        Entendi
                    </button>
                </div>
            </div>
        `;
    } else {
        // Desktop ou outro
        conteudo = `
            <div class="modal" style="max-width: 400px;">
                <div class="modal-header" style="background: #FFF9E6; border-bottom: 2px solid #FEDB19;">
                    <div class="modal-title-container">
                        <span style="font-size: 32px;">💻</span>
                        <div>
                            <h3 class="modal-title" style="color: #F57C00;">Instalar App Desktop</h3>
                            <p class="modal-subtitle">Rápido e fácil</p>
                        </div>
                    </div>
                    <button class="modal-close" onclick="fecharModalInstalacao()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="#666" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                
                <div class="modal-body" style="padding: 24px;">
                    <div style="background: #FFFBF0; border: 2px solid #FEDB19; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                        <p style="font-weight: 600; margin-bottom: 16px; color: #333;">📋 Passos para instalar:</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 16px;">
                            <div style="display: flex; gap: 12px; align-items: start;">
                                <div style="background: #FEDB19; color: #000; font-weight: 700; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">1</div>
                                <div>
                                    <p style="font-weight: 600; margin-bottom: 4px;">Procure o ícone de instalação</p>
                                    <p style="font-size: 14px; color: #666;">Ícone <strong>+</strong> ou <strong>⬇</strong> na barra de endereço</p>
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 12px; align-items: start;">
                                <div style="background: #FEDB19; color: #000; font-weight: 700; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">2</div>
                                <div>
                                    <p style="font-weight: 600; margin-bottom: 4px;">Clique em "Instalar"</p>
                                    <p style="font-size: 14px; color: #666;">Na janela que aparecer</p>
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 12px; align-items: start;">
                                <div style="background: #4CAF50; color: #fff; font-weight: 700; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">✓</div>
                                <div>
                                    <p style="font-weight: 600; margin-bottom: 4px;">Pronto!</p>
                                    <p style="font-size: 14px; color: #666;">O app abrirá em janela própria</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer" style="padding: 16px 24px; border-top: 1px solid #E0E0E0;">
                    <button class="btn btn-primary" onclick="fecharModalInstalacao()" style="width: 100%;">
                        Entendi
                    </button>
                </div>
            </div>
        `;
    }
    
    modal.innerHTML = conteudo;
    document.body.appendChild(modal);
    
    // Anima entrada
    setTimeout(() => modal.classList.remove('hidden'), 10);
    
    // Fecha ao clicar fora
    modal.onclick = (e) => {
        if (e.target === modal) {
            fecharModalInstalacao();
        }
    };
}

// Fechar modal de instalação
function fecharModalInstalacao() {
    const modal = document.getElementById('modal-instalacao-pwa');
    if (modal) {
        modal.classList.add('hidden');
        setTimeout(() => modal.remove(), 300);
    }
}

// Expor funções globalmente
window.abrirModalInstalacao = abrirModalInstalacao;
window.fecharModalInstalacao = fecharModalInstalacao;
window.detectarDispositivo = detectarDispositivo;

console.log('✅ Install PWA carregado');
