# 🔍 DEBUG - Fotos não aparecem

## 🚨 Como Verificar o Erro

### **1. Abra o Console (F12)**
```
Chrome/Edge: F12 > Console
```

### **2. Procure por erros vermelhos:**

**Possíveis erros:**

❌ **"iphones-grid is null"**
```
Solução: Verificar se div#iphones-grid existe no HTML
```

❌ **"estaAutenticado is not defined"**
```
Solução: Carregar js/auth.js antes de escolher-iphone.js
```

❌ **"formatarMoeda is not defined"**
```
Solução: Carregar js/utils.js antes de escolher-iphone.js
```

❌ **"Failed to load resource: assets/iphones/iphone-01.jpg"**
```
Solução: Verificar se pasta assets/iphones existe com as 20 fotos
```

---

## ✅ Checklist Rápido

### **No Navegador:**
1. [ ] F12 > Console está sem erros vermelhos?
2. [ ] F12 > Network > ver se arquivos .js carregaram (status 200)?
3. [ ] F12 > Network > ver se fotos .jpg tentaram carregar?
4. [ ] F12 > Application > Storage > localStorage tem "autenticado"?

### **Nos Arquivos:**
1. [ ] `assets/iphones/` existe com 20 fotos?
2. [ ] `js/escolher-iphone.js` tem array com 20 iPhones?
3. [ ] `escolher-iphone.html` carrega scripts nesta ordem:
   - pwa-register.js
   - utils.js
   - auth.js
   - escolher-iphone.js

---

## 🔧 Comandos de Debug no Console

### **Testar se funções existem:**
```javascript
typeof estaAutenticado        // deve ser "function"
typeof formatarMoeda          // deve ser "function"
typeof renderizarIphones      // deve ser "function"
```

### **Testar se array de iPhones existe:**
```javascript
iphones                       // deve mostrar array com 20 itens
iphones.length                // deve ser 20
iphones[0].imagem             // deve ser "assets/iphones/iphone-01.jpg"
```

### **Testar se grid existe:**
```javascript
document.getElementById('iphones-grid')  // deve retornar a div
```

### **Forçar renderização:**
```javascript
renderizarIphones()           // deve criar 20 cards
```

### **Ver localStorage:**
```javascript
localStorage.getItem('autenticado')       // deve ser "true"
localStorage.getItem('usuarioLogado')     // deve ter dados do usuário
```

---

## 🛠️ Soluções Rápidas

### **Problema 1: Grid vazio**
```javascript
// No console:
const grid = document.getElementById('iphones-grid');
console.log('Grid existe?', grid);
console.log('iPhones array:', iphones);
renderizarIphones();
```

### **Problema 2: Erro de autenticação**
```javascript
// No console:
localStorage.setItem('autenticado', 'true');
localStorage.setItem('usuarioLogado', JSON.stringify({
    nome: 'Teste',
    email: 'teste@domstore.com'
}));
location.reload();
```

### **Problema 3: Cache antigo**
```javascript
// No console:
caches.keys().then(k => k.forEach(c => caches.delete(c)));
navigator.serviceWorker.getRegistrations().then(r => r.forEach(reg => reg.unregister()));
location.reload();
```

---

## 📸 Verificar Fotos

### **No Console:**
```javascript
// Testar se foto carrega:
const img = new Image();
img.onload = () => console.log('✅ Foto carregou!');
img.onerror = () => console.log('❌ Foto NÃO carregou!');
img.src = 'assets/iphones/iphone-01.jpg';
```

### **Verificar todas as fotos:**
```javascript
for(let i = 1; i <= 20; i++) {
    const img = new Image();
    img.onload = () => console.log(`✅ iphone-${i.toString().padStart(2,'0')}.jpg OK`);
    img.onerror = () => console.log(`❌ iphone-${i.toString().padStart(2,'0')}.jpg ERRO`);
    img.src = `assets/iphones/iphone-${i.toString().padStart(2,'0')}.jpg`;
}
```

---

## 🎯 Teste Final Completo

### **1. Limpar tudo:**
```javascript
localStorage.clear();
caches.keys().then(k => k.forEach(c => caches.delete(c)));
navigator.serviceWorker.getRegistrations().then(r => r.forEach(reg => reg.unregister()));
```

### **2. Fazer login:**
- Ir para /login.html
- Email: teste@domstore.com
- Senha: 12345678

### **3. Ver iPhones:**
- Deve redirecionar para escolher-iphone.html
- Deve ver 20 cards com fotos reais

---

## 📋 Informações para Reportar

Se continuar sem funcionar, copie e mande essas informações:

### **1. Erro do Console:**
```
[COPIAR ERRO COMPLETO AQUI]
```

### **2. Network Tab:**
```
Status dos arquivos:
- escolher-iphone.js: [200/404/etc]
- utils.js: [200/404/etc]
- auth.js: [200/404/etc]
- iphone-01.jpg: [200/404/etc]
```

### **3. Resultado dos testes:**
```javascript
// Copiar resultado de:
typeof renderizarIphones
iphones.length
document.getElementById('iphones-grid')
localStorage.getItem('autenticado')
```

---

**Com essas informações consigo identificar exatamente o problema!** 🔍
