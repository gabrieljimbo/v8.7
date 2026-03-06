# 📝 Changelog - DOM Store

## [v2.0] - Modal de Cancelamento Completo - 05/02/2026

### ✨ Novo
- **Modal profissional de cancelamento** com todos os termos e condições
- Cálculo automático da taxa de 30% e valor a receber (70%)
- Exibição clara de todos os termos de uso
- Checkbox obrigatório para aceitar termos antes de cancelar
- Aviso sobre prazo de reembolso (30 dias úteis)
- Design responsivo e acessível

### 🎨 Interface
- Modal com header destacado em laranja (⚠️)
- Seções organizadas: Termos, Cálculo, Prazo
- Valores formatados corretamente (R$ 0.000,00)
- Destaque visual para informações importantes
- Botões claramente identificados ("Manter" vs "Cancelar")

### 🔧 Funcionalidades
- Validação: usuário deve aceitar termos para cancelar
- Se valor acumulado = R$ 0,00: cancelamento simples
- Se valor acumulado > R$ 0,00: modal completo com cálculos
- Redirecionamento automático após cancelamento
- Toast informativo com valor de reembolso

### 📊 Cálculos Implementados
```
Valor Acumulado: R$ X,XX
Taxa (30%): R$ X,XX
Valor a Receber (70%): R$ X,XX
```

### 🔐 Termos Incluídos
- [x] Sistema de compra programada
- [x] Não é poupança/investimento
- [x] Sem rendimentos
- [x] Pagamento via Pix
- [x] Uso exclusivo para produto
- [x] Sem saque livre
- [x] Taxa de 30% no cancelamento
- [x] Reembolso de 70% em 30 dias
- [x] Impossível cancelar após 100%

### 📱 Responsividade
- Layout adaptado para mobile
- Scroll interno no modal
- Botões empilhados em telas pequenas

## [v1.0] - Lançamento Inicial

### Recursos Principais
- Sistema de login funcional
- Catálogo de 3 iPhones
- Dashboard com progresso circular
- Depósitos via Pix
- Histórico de transações
- Marcos de progresso (10%, 25%, 50%, 75%, 90%)

---

**Próximas atualizações:**
- [ ] Integração real com API de pagamento
- [ ] Backend com banco de dados
- [ ] Notificações por email
- [ ] Múltiplos objetivos simultâneos
