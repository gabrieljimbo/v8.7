/**
 * DOM Store - Service Worker
 * PWA com cache estratégico para funcionamento offline
 */

const CACHE_NAME = 'dom-store-v8.2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './login.html',
    './criar-conta.html',
    './escolher-iphone.html',
    './dashboard.html',
    './depositar.html',
    './aceitar-termos.html',
    './termos.html',
    './css/global.css',
    './css/home.css',
    './css/auth.css',
    './css/dashboard.css',
    './css/depositar.css',
    './css/escolher-iphone.css',
    './css/logo.css',
    './css/modal-cancelamento.css',
    './css/responsive.css',
    './js/utils.js',
    './js/auth.js',
    './js/main.js',
    './js/dashboard.js',
    './js/depositar.js',
    './js/escolher-iphone.js',
    './js/criar-conta.js',
    './js/pwa-register.js',
    './assets/logo-dom.png',
    './assets/logo-dom-store.png',
    './manifest.json'
];

// Instalação - cacheia recursos
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cacheando arquivos');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Ativação - limpa caches antigos
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativando...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - estratégia Cache First para assets, Network First para API
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignora requisições não-GET
    if (request.method !== 'GET') {
        return;
    }
    
    // Cache First para assets estáticos
    if (ASSETS_TO_CACHE.some(asset => url.pathname.includes(asset))) {
        event.respondWith(
            caches.match(request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetch(request).then((response) => {
                        if (response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, responseClone);
                            });
                        }
                        return response;
                    });
                })
        );
    } else {
        // Network First para outras requisições
        event.respondWith(
            fetch(request)
                .catch(() => caches.match(request))
        );
    }
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[Service Worker] Carregado');
