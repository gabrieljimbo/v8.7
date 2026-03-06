/**
 * DOM Store - PWA Registration
 * Registra o Service Worker e gerencia instalação
 */

// Registrar Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then((registration) => {
                console.log('✅ Service Worker registrado:', registration.scope);
                
                // Verifica atualizações
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Nova versão disponível
                            if (confirm('Nova versão disponível! Atualizar agora?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('❌ Erro ao registrar Service Worker:', error);
            });
    });
}

// Prompt de instalação PWA
let deferredPrompt;
const installButton = document.getElementById('install-pwa-button');

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('💡 Prompt de instalação disponível');
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostra botão de instalação se existir
    if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', installPWA);
    }
});

function installPWA() {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('✅ PWA instalado');
            if (installButton) {
                installButton.style.display = 'none';
            }
        }
        deferredPrompt = null;
    });
}

// Detecta se está rodando como PWA
window.addEventListener('load', () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                      || window.navigator.standalone 
                      || document.referrer.includes('android-app://');
    
    if (isStandalone) {
        console.log('✅ Rodando como PWA');
        document.body.classList.add('pwa-mode');
    }
});

// Sincronização em background (futuro)
if ('sync' in registration) {
    // Implementar sync de depósitos pendentes
}

console.log('✅ PWA Registration carregado');
