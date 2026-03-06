/**
 * DOM Store - Dashboard JavaScript
 */

// Elementos
const userName = document.getElementById('user-name');
const objetivoNome = document.getElementById('objetivo-nome');
const objetivoSpecs = document.getElementById('objetivo-specs');
const objetivoValor = document.getElementById('objetivo-valor');
const progressCircle = document.getElementById('progress-ring-circle');
const progressoPorcentagem = document.getElementById('progresso-porcentagem');
const valorAcumulado = document.getElementById('valor-acumulado');
const valorMeta = document.getElementById('valor-meta');
const valorFaltante = document.getElementById('valor-faltante');
const totalDepositos = document.getElementById('total-depositos');
const historicoLista = document.getElementById('historico-lista');
const mensagemIncentivo = document.getElementById('mensagem-incentivo');

// Carregar dados
function carregarDados() {
    const usuario = obterLocal('usuario');
    const objetivo = obterLocal('objetivoAtivo');
    
    if (!usuario || !objetivo) {
        window.location.href = 'index.html';
        return;
    }
    
    // Se objetivo foi cancelado, redireciona
    if (objetivo.cancelado) {
        mostrarToast('Este objetivo foi cancelado', 'info');
        setTimeout(() => {
            removerLocal('objetivoAtivo');
            window.location.href = 'escolher-iphone.html';
        }, 2000);
        return;
    }
    
    // Nome do usuário
    userName.textContent = usuario.nome.split(' ')[0];
    
    // Dados do objetivo
    objetivoNome.textContent = objetivo.nome;
    objetivoSpecs.textContent = `${objetivo.armazenamento} • Seminovo Premium`;
    objetivoValor.textContent = formatarMoeda(objetivo.valorTotal);
    
    // Valores e progresso
    const acumulado = objetivo.valorAcumulado || 0;
    const porcentagem = Math.min((acumulado / objetivo.valorTotal) * 100, 100);
    const faltante = Math.max(objetivo.valorTotal - acumulado, 0);
    
    valorAcumulado.textContent = formatarMoeda(acumulado);
    valorMeta.textContent = formatarMoeda(objetivo.valorTotal);
    valorFaltante.textContent = formatarMoeda(faltante);
    progressoPorcentagem.textContent = `${Math.floor(porcentagem)}%`;
    
    // Atualiza círculo de progresso
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (porcentagem / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    
    // Atualiza marcos
    document.querySelectorAll('.marco').forEach(marco => {
        const marcoPorc = parseInt(marco.dataset.porcentagem);
        if (porcentagem >= marcoPorc) {
            marco.classList.add('ativo');
        }
    });
    
    // Mensagem de incentivo
    if (porcentagem < 10) {
        mensagemIncentivo.innerHTML = 'Próximo marco: <strong>Ótimo começo!</strong> (10%)';
    } else if (porcentagem < 25) {
        mensagemIncentivo.innerHTML = 'Próximo marco: <strong>Quase lá!</strong> (25%)';
    } else if (porcentagem < 50) {
        mensagemIncentivo.innerHTML = 'Próximo marco: <strong>Metade do caminho!</strong> (50%)';
    } else if (porcentagem < 75) {
        mensagemIncentivo.innerHTML = 'Próximo marco: <strong>Na reta final!</strong> (75%)';
    } else if (porcentagem < 100) {
        mensagemIncentivo.innerHTML = 'Próximo marco: <strong>Quase seu!</strong> (100%)';
    } else {
        mensagemIncentivo.innerHTML = '<strong>🎉 Parabéns! Você atingiu 100%!</strong>';
    }
    
    // Histórico
    const depositos = objetivo.depositos || [];
    totalDepositos.textContent = `${depositos.length} depósito${depositos.length !== 1 ? 's' : ''}`;
    
    if (depositos.length > 0) {
        historicoLista.innerHTML = '';
        depositos.reverse().forEach(dep => {
            const item = document.createElement('div');
            item.className = 'historico-item';
            item.innerHTML = `
                <div class="historico-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8" stroke="#FEDB19" stroke-width="2"/>
                        <path d="M6 10H14M10 6V14" stroke="#FEDB19" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="historico-info">
                    <div class="historico-titulo">Depósito Pix</div>
                    <div class="historico-data">${formatarDataHora(dep.data)}</div>
                </div>
                <div class="historico-valor">+${formatarMoeda(dep.valor)}</div>
            `;
            historicoLista.appendChild(item);
        });
    }
}

function cancelarObjetivo() {
    const objetivo = obterLocal('objetivoAtivo');
    if (!objetivo) return;
    
    const acumulado = objetivo.valorAcumulado || 0;
    
    // SEMPRE abre o modal customizado (mesmo com R$ 0,00)
    abrirModalCancelamento(acumulado);
}

function abrirModalCancelamento(valorAcumulado) {
    const modal = document.getElementById('modal-cancelamento');
    const taxa = valorAcumulado * 0.3;
    const valorReceber = valorAcumulado - taxa;
    
    // Preenche valores no modal
    document.getElementById('modal-valor-acumulado').textContent = formatarMoeda(valorAcumulado);
    document.getElementById('modal-taxa-cancelamento').textContent = '- ' + formatarMoeda(taxa);
    document.getElementById('modal-valor-receber').textContent = formatarMoeda(valorReceber);
    
    // Reseta checkbox
    const checkbox = document.getElementById('checkbox-aceitar-cancelamento');
    const btnConfirmar = document.getElementById('btn-confirmar-cancelamento');
    checkbox.checked = false;
    btnConfirmar.disabled = true;
    
    // Listener para habilitar botão
    checkbox.onchange = function() {
        btnConfirmar.disabled = !this.checked;
    };
    
    // Listener para confirmar
    btnConfirmar.onclick = function() {
        confirmarCancelamento(valorAcumulado, taxa, valorReceber);
    };
    
    // Abre modal
    modal.classList.remove('hidden');
    
    // Fecha ao clicar fora
    modal.onclick = function(e) {
        if (e.target === modal) {
            fecharModalCancelamento();
        }
    };
}

function fecharModalCancelamento() {
    const modal = document.getElementById('modal-cancelamento');
    modal.classList.add('hidden');
}

function confirmarCancelamento(valorAcumulado, taxa, valorReceber) {
    const objetivo = obterLocal('objetivoAtivo');
    if (!objetivo) return;
    
    // Se não tem valor acumulado, apenas remove o objetivo
    if (valorAcumulado === 0) {
        removerLocal('objetivoAtivo');
        fecharModalCancelamento();
        mostrarToast('Objetivo cancelado com sucesso', 'info');
        setTimeout(() => {
            window.location.href = 'escolher-iphone.html';
        }, 1000);
        return;
    }
    
    // Se tem valor, marca como cancelado e salva dados do reembolso
    objetivo.cancelado = true;
    objetivo.dataCancelamento = new Date().toISOString();
    objetivo.valorAcumulado = valorAcumulado;
    objetivo.taxaCancelamento = taxa;
    objetivo.valorReembolso = valorReceber;
    objetivo.statusReembolso = 'pendente';
    objetivo.prazoReembolso = '30 dias úteis';
    
    salvarLocal('objetivoAtivo', objetivo);
    
    fecharModalCancelamento();
    
    const mensagem = valorReceber > 0 
        ? `Objetivo cancelado. Reembolso de ${formatarMoeda(valorReceber)} em até 30 dias úteis.`
        : 'Objetivo cancelado com sucesso';
    
    mostrarToast(mensagem, 'info', 5000);
    
    setTimeout(() => {
        window.location.href = 'escolher-iphone.html';
    }, 2000);
}

function sair() {
    if (confirm('Deseja sair da sua conta?')) {
        limparLocal();
        window.location.href = 'index.html';
    }
}

function scrollToDeposit(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
        window.location.href = 'depositar.html';
    }, 500);
}

// Expõe funções
window.cancelarObjetivo = cancelarObjetivo;
window.abrirModalCancelamento = abrirModalCancelamento;
window.fecharModalCancelamento = fecharModalCancelamento;
window.confirmarCancelamento = confirmarCancelamento;
window.sair = sair;
window.scrollToDeposit = scrollToDeposit;

// Inicializa
carregarDados();
console.log('✅ dashboard.js carregado');
