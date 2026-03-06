
---

## 🆕 Testando o Modal de Cancelamento (v2.0)

### Cenário 1: Cancelamento SEM depósitos

1. Faça login
2. Escolha um iPhone
3. No dashboard (com R$ 0,00), clique em "Cancelar objetivo"
4. ✅ Deve aparecer um alert simples pedindo confirmação
5. ✅ Ao confirmar, redireciona para escolher iPhone

### Cenário 2: Cancelamento COM depósitos

1. Faça login
2. Escolha um iPhone (ex: iPhone 15 - R$ 5.199,90)
3. Faça um depósito de R$ 1.000,00
4. Volte ao dashboard
5. Clique em "Cancelar objetivo"

**✅ O que deve acontecer:**

6. Modal completo se abre com:
   - ⚠️ Título "Cancelar objetivo?"
   - Todos os termos de uso
   - Cálculo automático:
     - Valor acumulado: R$ 1.000,00
     - Taxa (30%): - R$ 300,00
     - Valor a receber: R$ 700,00
   - Aviso de prazo: 30 dias úteis
   - Checkbox "Li e concordo"
   - Botões: "Não, manter" e "Sim, cancelar" (desabilitado)

7. Marque o checkbox
8. ✅ Botão "Sim, cancelar" fica habilitado (vermelho)
9. Clique em "Sim, cancelar e aceitar"
10. ✅ Toast aparece: "Objetivo cancelado. Reembolso de R$ 700,00 em até 30 dias úteis"
11. ✅ Redireciona para escolher iPhone

### Cenário 3: Testar com diferentes valores

| Depósito | Taxa 30% | Recebe 70% |
|----------|----------|------------|
| R$ 100   | R$ 30    | R$ 70      |
| R$ 500   | R$ 150   | R$ 350     |
| R$ 1.000 | R$ 300   | R$ 700     |
| R$ 2.000 | R$ 600   | R$ 1.400   |
| R$ 5.000 | R$ 1.500 | R$ 3.500   |

### Cenário 4: Fechar modal sem confirmar

1. Abra o modal de cancelamento
2. Clique no X ou fora do modal
3. ✅ Modal fecha sem cancelar
4. ✅ Objetivo permanece ativo

### Checklist do Modal

- [ ] Modal abre apenas quando há valor acumulado
- [ ] Todos os termos aparecem
- [ ] Cálculo está correto (30% taxa / 70% recebe)
- [ ] Valores formatados: R$ 0.000,00
- [ ] Checkbox obrigatório
- [ ] Botão só habilita após marcar checkbox
- [ ] Botão cancelar é vermelho
- [ ] Toast mostra valor correto de reembolso
- [ ] Redireciona após confirmar
- [ ] Fecha ao clicar fora
- [ ] Fecha ao clicar no X
- [ ] Responsivo em mobile

---

## 🎯 Fluxo Completo Recomendado

1. **Login** → teste@domstore.com / 12345678
2. **Escolher iPhone** → iPhone 15 Pro Max (R$ 5.199,90)
3. **Aceitar termos**
4. **Dashboard** → Veja 0%
5. **Depositar R$ 500** → Veja progresso ~9-10%
6. **Depositar R$ 500** → Veja progresso ~19-20% (marco 10% amarelo!)
7. **Depositar R$ 1.000** → Veja progresso ~38-40% (marco 25% amarelo!)
8. **Cancelar objetivo** → Veja modal completo
   - Acumulado: R$ 2.000,00
   - Taxa: R$ 600,00
   - Recebe: R$ 1.400,00
9. **Confirmar cancelamento** → Sucesso!

---

**Última atualização:** 05/02/2026 - v2.0 🎉
