# 📸 Guia de Logos - DOM Store

## 🎨 Logos Disponíveis

O projeto possui 2 versões do logo na pasta `assets/`:

### 1. **logo-dom.png** (Logo Simples)
- Contém apenas "DOM" 
- Usado em: **Headers, Navegação**
- Tamanho padrão: 40px de altura
- Arquivo original: `Dom_-_Logo_V1__PNG_.png`

### 2. **logo-dom-store.png** (Logo Completo)
- Contém "DOM" + "store"
- Usado em: **Páginas de autenticação, Hero sections**
- Tamanho padrão: 60-80px de altura
- Arquivo original: `Dom_-_Logo_V2__PNG_.png`

## 📁 Estrutura de Arquivos

```
dom-store-mvp/
├── assets/
│   ├── logo-dom.png           ← Logo simples "DOM"
│   └── logo-dom-store.png     ← Logo completo "DOM store"
```

## 🔧 Como Usar nos HTMLs

### Header / Navegação (Logo Pequeno)
```html
<div class="logo">
    <img src="assets/logo-dom.png" alt="DOM Store">
</div>
```

### Páginas de Autenticação (Logo Médio)
```html
<div class="auth-logo">
    <img src="assets/logo-dom-store.png" alt="DOM Store" style="height: 80px;">
</div>
```

### Footer (Logo Pequeno)
```html
<div class="logo logo-small">
    <img src="assets/logo-dom.png" alt="DOM Store">
</div>
```

## 📐 Tamanhos Recomendados

| Contexto | Logo | Altura |
|----------|------|--------|
| Header | logo-dom.png | 40px |
| Footer | logo-dom.png | 30px |
| Auth Pages | logo-dom-store.png | 80px |
| Hero Section | logo-dom-store.png | 100px |
| Modais | logo-dom-store.png | 60px |

## 🎨 Classes CSS Disponíveis

```css
.logo           /* Tamanho padrão (40px) */
.logo-small     /* Pequeno (30px) */
.logo-large     /* Grande (60px) */
.logo-hero      /* Extra grande (80px) */
```

## 🔄 Substituir Logos

Se você quiser usar outros logos:

1. Substitua os arquivos na pasta `assets/`:
   - `logo-dom.png` (formato: PNG, fundo transparente)
   - `logo-dom-store.png` (formato: PNG, fundo transparente)

2. **Importante:** Mantenha os mesmos nomes de arquivo para que o código continue funcionando!

3. Tamanhos recomendados:
   - **logo-dom.png:** ~300x100px (proporção 3:1)
   - **logo-dom-store.png:** ~400x150px (proporção ~2.5:1)

## 🎯 Onde Cada Logo Aparece

### `logo-dom.png` é usado em:
- ✅ index.html (header e footer)
- ✅ escolher-iphone.html (header)
- ✅ dashboard.html (header)
- ✅ depositar.html (header)

### `logo-dom-store.png` é usado em:
- ✅ login.html (tela de login)
- ✅ criar-conta.html (tela de cadastro)
- ✅ aceitar-termos.html (modal de termos)
- ✅ termos.html (página de termos)

## 🐛 Troubleshooting

**Logo não aparece?**
1. Verifique se os arquivos estão na pasta `assets/`
2. Verifique se os nomes estão corretos
3. Limpe o cache do navegador (Ctrl + Shift + R)

**Logo muito grande/pequeno?**
1. Ajuste o atributo `style="height: XXpx;"` no HTML
2. Ou use as classes CSS: `.logo-small`, `.logo-large`, `.logo-hero`

**Logo com fundo branco?**
- Use arquivos PNG com fundo transparente
- Ou adicione `background: transparent;` no CSS

---

**Dica:** Os logos originais enviados já estão com fundo transparente e cores corretas (amarelo e preto)! 🎨
