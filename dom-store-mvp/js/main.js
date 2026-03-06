/**
 * DOM Store - Main JavaScript
 * 
 * JavaScript global para todas as páginas
 * Configurações, listeners globais, etc.
 */

// Previne comportamento padrão de alguns elementos
document.addEventListener('DOMContentLoaded', function() {
    // Fecha modals ao clicar no overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.classList.add('hidden');
            }
        });
    });
    
    // Previne submit em links com # apenas
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
});

// Detecta se está em mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Smooth scroll para elementos
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Service Worker (para PWA - funcionalidade futura)
if ('serviceWorker' in navigator) {
    // Desabilitado no MVP, mas preparado para o futuro
    // navigator.serviceWorker.register('/sw.js');
}

console.log('✅ DOM Store MVP carregado');
