# 📱 Guia Completo PWA - DOM Store

## 🎯 O que é PWA?

Progressive Web App (PWA) é uma aplicação web que funciona como app nativo:
- ✅ Instala no celular/desktop
- ✅ Funciona offline
- ✅ Recebe notificações
- ✅ Tela cheia (sem barra do navegador)
- ✅ Ícone na home screen
- ✅ Rápido e responsivo

## 📦 Arquivos do PWA

### 1. `manifest.json` (Configuração do App)
```json
{
  "name": "DOM Store",
  "short_name": "DOM Store",
  "display": "standalone",
  "theme_color": "#FFC107",
  "background_color": "#000000"
}
```

**Localização:** `/manifest.json` (raiz do projeto)

**O que faz:**
- Define nome do app
- Cor do tema (amarelo DOM)
- Cor de fundo (preto)
- Modo de exibição (tela cheia)
- Ícones para diferentes tamanhos

### 2. `service-worker.js` (Funcionamento Offline)

**Localização:** `/service-worker.js` (raiz do projeto)

**O que faz:**
- Cacheia arquivos para uso offline
- Intercepta requisições de rede
- Atualiza cache automaticamente
- Estratégias: Cache First (assets) e Network First (API)

**Arquivos cacheados:**
- HTMLs (todas as páginas)
- CSS (todos os estilos)
- JS (todos os scripts)
- Imagens (logos)
- Manifest

### 3. `pwa-register.js` (Registro e Instalação)

**Localização:** `/js/pwa-register.js`

**O que faz:**
- Registra o Service Worker
- Detecta atualizações
- Mostra prompt de instalação
- Gerencia modo standalone

## 🚀 Como Implementar

### Passo 1: Adicionar Meta Tags

Em **TODOS** os arquivos HTML, adicione no `<head>`:

```html
<!-- Meta tags básicas -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="description" content="Conquiste seu iPhone dos sonhos com pagamentos flexíveis via Pix">

<!-- PWA -->
<meta name="theme-color" content="#FFC107">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="DOM Store">

<!-- Manifest -->
<link rel="manifest" href="/manifest.json">

<!-- Ícones Apple -->
<link rel="apple-touch-icon" href="/assets/icon-192.png">
<link rel="apple-touch-icon" sizes="152x152" href="/assets/icon-152.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/icon-180.png">
<link rel="apple-touch-icon" sizes="167x167" href="/assets/icon-167.png">

<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/assets/icon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/icon-16.png">

<!-- CSS Responsivo -->
<link rel="stylesheet" href="css/global.css">
<link rel="stylesheet" href="css/responsive.css">
```

### Passo 2: Adicionar Scripts

No final do `<body>`, **antes** de outros scripts:

```html
<!-- PWA Registration -->
<script src="/js/pwa-register.js"></script>

<!-- Outros scripts -->
<script src="/js/utils.js"></script>
<script src="/js/auth.js"></script>
<!-- etc -->
```

### Passo 3: Criar Ícones

**Necessário criar ícones PNG:**

| Tamanho | Nome | Uso |
|---------|------|-----|
| 16x16 | icon-16.png | Favicon |
| 32x32 | icon-32.png | Favicon |
| 152x152 | icon-152.png | iOS |
| 167x167 | icon-167.png | iOS iPad |
| 180x180 | icon-180.png | iOS iPhone |
| 192x192 | icon-192.png | Android |
| 512x512 | icon-512.png | Splash screen |

**Como criar:**
1. Use o logo DOM Store (logo-dom.png)
2. Adicione padding/margem interna (20%)
3. Fundo amarelo #FFC107 ou transparente
4. Exporte nos tamanhos acima
5. Salve em `/assets/`

**Ferramenta recomendada:**
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

## 📲 Como Instalar (Usuário)

### Android (Chrome/Edge)

1. Abra o site no Chrome
2. Clique nos 3 pontos (⋮)
3. Selecione "Instalar app" ou "Adicionar à tela inicial"
4. Confirme
5. ✅ Ícone aparece na home

### iOS (Safari)

1. Abra o site no Safari
2. Toque no botão de compartilhar (□↑)
3. Role e toque em "Adicionar à Tela de Início"
4. Edite o nome (opcional)
5. Toque em "Adicionar"
6. ✅ Ícone aparece na home

### Desktop (Chrome/Edge)

1. Abra o site
2. Veja ícone de instalação (+) na barra de endereço
3. Clique e confirme
4. ✅ App abre em janela própria

## 🧪 Como Testar PWA

### 1. Teste Local

```bash
# Usando Python
cd dom-store-mvp
python -m http.server 8000

# Usando Node.js
npx serve -s . -p 8000

# Acesse: http://localhost:8000
```

### 2. Teste com HTTPS (necessário para PWA)

**Opção A: Netlify (recomendado)**
```bash
# Instalar CLI
npm install -g netlify-cli

# Deploy
cd dom-store-mvp
netlify deploy --prod
```

**Opção B: GitHub Pages**
1. Crie repositório no GitHub
2. Faça upload dos arquivos
3. Ative GitHub Pages nas configurações
4. Acesse: `https://seuusuario.github.io/dom-store`

### 3. Verificar PWA no Chrome DevTools

1. Abra o site (com HTTPS)
2. Pressione F12
3. Vá em "Application"
4. Seção "Manifest": Veja se carregou
5. Seção "Service Workers": Veja se registrou
6. Seção "Cache Storage": Veja arquivos cacheados
7. Clique em "Lighthouse"
8. Selecione "Progressive Web App"
9. Clique em "Generate report"
10. ✅ Score deve ser 90+

## 📊 Checklist PWA Completo

### Obrigatório
- [ ] manifest.json configurado
- [ ] service-worker.js criado
- [ ] HTTPS habilitado
- [ ] viewport configurado
- [ ] theme-color definido
- [ ] Ícones 192x192 e 512x512
- [ ] start_url definido
- [ ] display: standalone

### Recomendado
- [ ] Ícones para iOS
- [ ] Splash screens
- [ ] Funciona offline
- [ ] Cache estratégico
- [ ] Atualização automática
- [ ] Prompt de instalação
- [ ] Shortcuts (atalhos)
- [ ] Screenshots

### Avançado
- [ ] Notificações Push
- [ ] Background Sync
- [ ] Geolocalização
- [ ] Share API
- [ ] Payment Request API

## 🎨 Responsividade

### Breakpoints Usados

```css
/* Mobile First */
Base: até 768px (mobile)

/* Tablet */
769px - 1024px

/* Desktop */
1025px+

/* Landscape Mobile */
@media (orientation: landscape)

/* Touch Devices */
@media (hover: none) and (pointer: coarse)
```

### Features Implementadas

✅ **Safe Areas (iPhone X+)**
- Suporta notch
- Padding automático

✅ **Touch Friendly**
- Botões mínimo 44px
- Feedback tátil
- Scroll suave

✅ **Modais Mobile**
- Tela cheia em mobile
- Scroll interno
- Botões empilhados

✅ **Performance**
- Lazy loading
- Cache agressivo
- Imagens otimizadas

## 🔧 Manutenção

### Atualizar PWA

1. Modifique arquivos
2. **IMPORTANTE:** Altere `CACHE_NAME` no service-worker.js:
```javascript
const CACHE_NAME = 'dom-store-v2'; // v1 -> v2
```
3. Faça deploy
4. Usuários receberão prompt de atualização

### Adicionar Novo Arquivo ao Cache

Edite `service-worker.js`:
```javascript
const ASSETS_TO_CACHE = [
    // ... arquivos existentes
    '/novo-arquivo.html',
    '/css/novo-style.css'
];
```

### Limpar Cache (emergência)

```javascript
// No console do navegador:
caches.keys().then(keys => {
    keys.forEach(key => caches.delete(key));
});
location.reload();
```

## 🐛 Troubleshooting

**PWA não instala:**
- ✅ Verifique HTTPS
- ✅ Verifique manifest.json válido
- ✅ Verifique ícones existem
- ✅ Verifique service worker registrado

**Cache não atualiza:**
- ✅ Mude CACHE_NAME no service-worker
- ✅ Force refresh (Ctrl+Shift+R)
- ✅ Limpe cache manualmente

**Ícones não aparecem:**
- ✅ Verifique caminhos no manifest
- ✅ Verifique tamanhos corretos
- ✅ Verifique formato PNG

**Offline não funciona:**
- ✅ Verifique service worker ativo
- ✅ Verifique arquivos no cache
- ✅ Teste Network offline no DevTools

## 📱 Recursos Futuros

### Push Notifications
```javascript
// Pedir permissão
Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
        // Enviar notificações
    }
});
```

### Background Sync
```javascript
// Sincronizar quando voltar online
navigator.serviceWorker.ready.then(registration => {
    return registration.sync.register('sync-deposits');
});
```

### Share API
```javascript
// Compartilhar progresso
navigator.share({
    title: 'Meu progresso DOM Store',
    text: 'Já estou em 50%!',
    url: 'https://domstore.app'
});
```

## 🎯 Checklist de Deploy

- [ ] Ícones criados (todos os tamanhos)
- [ ] Meta tags em todos os HTMLs
- [ ] manifest.json configurado
- [ ] service-worker.js funcionando
- [ ] pwa-register.js incluído
- [ ] responsive.css incluído
- [ ] Testado em Chrome (Android)
- [ ] Testado em Safari (iOS)
- [ ] Testado offline
- [ ] HTTPS configurado
- [ ] Lighthouse score 90+
- [ ] Cache funcionando
- [ ] Instalação funcionando

---

**Versão:** 3.0 - PWA Completo
**Data:** 05/02/2026 🚀
**Status:** Pronto para produção ✅
