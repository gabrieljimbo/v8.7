# ZENTRA - MVP

> Plataforma de pagamento antecipado para compra de iPhones

## 📋 Sobre o Projeto

ZENTRA é uma plataforma que permite aos usuários juntarem dinheiro para comprar iPhones através de depósitos via Pix. O conceito é simples: escolha seu iPhone, deposite quando quiser e puder, e quando atingir 100% do valor, receba seu produto.

### 🎯 Proposta de Valor

- **Sem juros**: Ao contrário do parcelamento no cartão de crédito
- **Flexibilidade**: Deposite quando e quanto quiser
- **Preço travado**: O valor do iPhone fica fixo desde o início
- **Transparente**: Sem taxas ocultas ou rendimentos

### ⚠️ Importante

Este **NÃO É**:
- ❌ Investimento
- ❌ Poupança
- ❌ Conta digital com rendimento

Este **É**:
- ✅ Sistema de compra programada
- ✅ Pagamento antecipado com objetivo específico

## 🏗️ Estrutura do Projeto

```
zentra-mvp/
├── index.html              # Landing page / Home
├── criar-conta.html        # Cadastro de usuários
├── escolher-iphone.html    # Catálogo de iPhones
├── aceitar-termos.html     # Aceite de termos antes de iniciar
├── dashboard.html          # Dashboard principal com progresso
├── depositar.html          # Página para fazer depósitos via Pix
├── termos.html             # Termos de uso completos
│
├── css/
│   ├── global.css          # Estilos globais e variáveis
│   ├── home.css            # Estilos da landing page
│   ├── auth.css            # Estilos de autenticação
│   ├── escolher-iphone.css # Estilos do catálogo
│   ├── dashboard.css       # Estilos da dashboard
│   └── depositar.css       # Estilos da página de depósito
│
└── js/
    ├── utils.js            # Funções utilitárias (validações, máscaras, etc)
    ├── main.js             # JavaScript global
    ├── criar-conta.js      # Lógica de criação de conta
    ├── escolher-iphone.js  # Lógica do catálogo
    ├── dashboard.js        # Lógica da dashboard
    └── depositar.js        # Lógica de depósito
```

## 🚀 Funcionalidades Implementadas

### ✅ Fase 1: Autenticação e Cadastro
- [x] Landing page com proposta de valor
- [x] Formulário de criação de conta
- [x] Validação de CPF, email, telefone
- [x] Máscaras de input em tempo real
- [x] Armazenamento local (localStorage)

### ✅ Fase 2: Escolha de Produto
- [x] Catálogo de iPhones com preços
- [x] Busca/filtro de modelos
- [x] Modal de confirmação de escolha
- [x] Travamento de preço

### ✅ Fase 3: Dashboard e Progresso
- [x] Visualização do objetivo
- [x] Círculo de progresso animado
- [x] Marcos de progresso (10%, 25%, 50%, 75%, 90%)
- [x] Histórico de depósitos
- [x] Cálculo de valor faltante

### ✅ Fase 4: Depósitos
- [x] Formulário de depósito
- [x] Valores rápidos (R$ 5, R$ 10, R$ 20, etc)
- [x] Geração de QR Code Pix (simulado)
- [x] Confirmação de pagamento
- [x] Atualização de progresso

### ✅ Fase 5: Termos e Políticas
- [x] Página de termos de uso
- [x] Modal de aceite de termos
- [x] Avisos sobre natureza do serviço
- [x] Opção de cancelamento

## 💻 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com variáveis CSS
- **JavaScript (Vanilla)**: Lógica sem dependências externas
- **LocalStorage**: Armazenamento de dados (MVP)
- **SVG**: Ícones e ilustrações

## 🎨 Design System

### Cores Principais
- **Primary**: #00BFA5 (Teal)
- **Primary Dark**: #00A08F
- **Primary Light**: #E0F7F4
- **Text Primary**: #1A1A1A
- **Text Secondary**: #666666
- **Background**: #F5F7FA

### Tipografia
- **Font Family**: Sistema (San Francisco, Roboto, etc)
- **Font Sizes**: 12px - 48px (escala modular)
- **Font Weights**: 400, 500, 600, 700

### Espaçamentos
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **2XL**: 48px
- **3XL**: 64px

## 📱 Responsividade

O projeto é totalmente responsivo e funciona em:
- 📱 Mobile (até 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (1024px+)

## 🔧 Como Usar

### 1. Abrir o Projeto

Simplesmente abra o arquivo `index.html` em um navegador moderno.

```bash
# Se tiver Python instalado
python -m http.server 8000

# Ou Node.js
npx serve
```

### 2. Fluxo do Usuário

1. **Home** → Conhecer a proposta
2. **Criar Conta** → Cadastrar-se
3. **Escolher iPhone** → Selecionar modelo
4. **Aceitar Termos** → Concordar com regras
5. **Dashboard** → Ver progresso
6. **Depositar** → Fazer depósitos via Pix
7. **Atingir 100%** → Receber iPhone

### 3. Dados de Teste

Como é um MVP com localStorage, você pode testar com qualquer dados:

```javascript
// CPF válido de teste
457.894.211-45

// Email
teste@email.com

// Telefone
(11) 98765-4321
```

## 📊 Estrutura de Dados (LocalStorage)

### Usuario
```javascript
{
  nome: "João Silva",
  email: "joao@email.com",
  cpf: "45789421145",
  telefone: "11987654321",
  estado: "SP",
  cidade: "São Paulo",
  dataCriacao: "2026-02-05T10:00:00.000Z"
}
```

### Objetivo Ativo
```javascript
{
  id: "iphone-16",
  nome: "iPhone 16",
  armazenamento: "128GB",
  valorTotal: 4499.00,
  valorAcumulado: 450.00,
  porcentagem: 10,
  dataCriacao: "2026-02-05T10:00:00.000Z",
  termosAceitos: true,
  dataAceiteTermos: "2026-02-05T10:05:00.000Z",
  depositos: [
    {
      valor: 100.00,
      data: "2026-02-05T10:10:00.000Z",
      tipo: "pix",
      status: "confirmado"
    }
  ]
}
```

## 🔐 Segurança (Produção)

⚠️ **ATENÇÃO**: Este é um MVP que usa localStorage. Para produção, será necessário:

1. **Backend seguro** com autenticação JWT
2. **Banco de dados** (PostgreSQL, MongoDB)
3. **API de pagamento** (integração real com Pix)
4. **Criptografia** de dados sensíveis
5. **HTTPS** obrigatório
6. **Rate limiting** e proteção contra ataques
7. **Logs** e auditoria de transações

## 🚧 Próximos Passos (Roadmap)

### Fase 1: Backend
- [ ] API REST com Node.js/Express
- [ ] Banco de dados PostgreSQL
- [ ] Autenticação JWT
- [ ] Integração real com Pix (Asaas, PagBank)

### Fase 2: Features
- [ ] Notificações (email, push)
- [ ] Foto de perfil
- [ ] Histórico completo
- [ ] Múltiplos objetivos simultâneos
- [ ] Programa de indicação

### Fase 3: Avançado
- [ ] App mobile (React Native)
- [ ] Chat de suporte
- [ ] Dashboard admin
- [ ] Analytics e métricas
- [ ] Testes automatizados

## 📝 Documentação Adicional

### Validações Implementadas

- **CPF**: Validação completa com dígitos verificadores
- **Email**: Regex padrão RFC 5322
- **Telefone**: 10 ou 11 dígitos
- **Senha**: Mínimo 8 caracteres

### Máscaras Implementadas

- **CPF**: 000.000.000-00
- **Telefone**: (00) 00000-0000
- **Moeda**: R$ 0.000,00

### Animações

- **Progresso**: Círculo animado com SVG
- **Toast**: Slide in/out
- **Hover**: Elevação e mudança de cor
- **Transições**: 250ms ease (padrão)

## 🐛 Debugging

Para debug, abra o console do navegador (F12) e digite:

```javascript
// Ver dados do usuário
obterLocal('usuario')

// Ver objetivo ativo
obterLocal('objetivoAtivo')

// Limpar tudo
limparLocal()

// Simular depósito
const obj = obterLocal('objetivoAtivo');
obj.valorAcumulado += 100;
salvarLocal('objetivoAtivo', obj);
```

## 📄 Licença

Este é um projeto MVP para demonstração. Todos os direitos reservados.

## 👥 Autor

Desenvolvido para demonstrar capacidades de desenvolvimento full-stack.

---

**ZENTRA** - Conquiste seu iPhone dos sonhos 📱✨
