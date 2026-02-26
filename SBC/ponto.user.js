// ==UserScript==
// @name         Verificador de Ponto + BSaldo - Central do Funcionário
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Analisa inconsistências no cartão de ponto e extrai BSaldo do dia anterior
// @author       Almeida
// @match        https://centraldofuncionario.com.br/*/cartao-ponto*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const TIME_REGEX = /^\d{2}:\d{2}$/;

  // ─────────────────────────────────────────
  // VERIFICADOR DE PONTO
  // ─────────────────────────────────────────

  function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) &&
      getComputedStyle(el).visibility !== 'hidden' &&
      getComputedStyle(el).display !== 'none';
  }

  function getVisibleTimes(container) {
    const times = [];
    for (const el of container.querySelectorAll('*')) {
      if (el.children.length > 0) continue;
      const text = el.textContent.trim();
      if (TIME_REGEX.test(text) && isVisible(el)) {
        times.push(text);
      }
    }
    return times;
  }

  function analyzePonto() {
    const dayContainers = document.querySelectorAll('[id^="dia-resumido-"]');
    const errors = [];
    for (const container of dayContainers) {
      const dateMatch = container.id.match(/dia-resumido-(\d{4}-\d{2}-\d{2})/);
      if (!dateMatch) continue;
      const date = dateMatch[1];
      const times = getVisibleTimes(container);
      if (times.length % 2 !== 0) {
        errors.push({ date, times, container });
      }
    }
    return errors;
  }

  function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }

  function showResults(errors, bSaldo) {
    const existingPanel = document.getElementById('ponto-checker-panel');
    if (existingPanel) existingPanel.remove();

    const panel = document.createElement('div');
    panel.id = 'ponto-checker-panel';
    panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99999;
      background: #1e1e2e;
      color: #cdd6f4;
      border-radius: 12px;
      padding: 20px;
      min-width: 300px;
      max-width: 420px;
      max-height: 80vh;
      overflow-y: auto;
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 14px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      border: 1px solid #313244;
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;';

    const title = document.createElement('span');
    title.textContent = '🕐 Verificador de Ponto';
    title.style.cssText = 'font-weight:700; font-size:16px;';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'background:none; border:none; color:#cdd6f4; cursor:pointer; font-size:16px; padding:0 4px; opacity:0.7;';
    closeBtn.onclick = () => panel.remove();

    header.appendChild(title);
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // ── BSaldo Card ──
    const bSaldoCard = document.createElement('div');
    bSaldoCard.id = 'bsaldo-card';

    if (bSaldo === 'aguardando') {
      bSaldoCard.style.cssText = 'background:#313244; border-left:3px solid #89b4fa; border-radius:8px; padding:10px 14px; margin-bottom:14px; color:#89b4fa; font-weight:600;';
      bSaldoCard.textContent = '⏳ Aguardando BSaldo... (abra o Cartão Completo)';
    } else if (bSaldo === null) {
      bSaldoCard.style.cssText = 'background:#313244; border-left:3px solid #f9e2af; border-radius:8px; padding:10px 14px; margin-bottom:14px; color:#f9e2af; font-weight:600;';
      bSaldoCard.textContent = '⚠️ BSaldo do dia anterior não encontrado';
    } else {
      const isNegative = bSaldo.startsWith('-');
      const color = isNegative ? '#f38ba8' : '#a6e3a1';
      bSaldoCard.style.cssText = `background:#313244; border-left:3px solid ${color}; border-radius:8px; padding:10px 14px; margin-bottom:14px;`;
      bSaldoCard.innerHTML = `
        <div style="font-size:11px; color:#a6adc8; margin-bottom:4px;">BANCO DE HORAS - DIA ANTERIOR</div>
        <div style="font-weight:700; font-size:20px; color:${color};">${bSaldo}</div>
      `;
    }

    panel.appendChild(bSaldoCard);

    // ── Inconsistências ──
    if (errors.length === 0) {
      const ok = document.createElement('div');
      ok.style.cssText = 'background:#a6e3a1; color:#1e1e2e; border-radius:8px; padding:12px 16px; font-weight:600; text-align:center;';
      ok.textContent = '✅ Nenhuma inconsistência encontrada!';
      panel.appendChild(ok);
    } else {
      const summary = document.createElement('div');
      summary.style.cssText = 'background:#f38ba8; color:#1e1e2e; border-radius:8px; padding:10px 14px; font-weight:600; margin-bottom:14px;';
      summary.textContent = `⚠️ ${errors.length} dia(s) com inconsistência`;
      panel.appendChild(summary);

      for (const err of errors) {
        const card = document.createElement('div');
        card.style.cssText = 'background:#313244; border-left:3px solid #f38ba8; border-radius:6px; padding:10px 14px; margin-bottom:10px;';

        const dateEl = document.createElement('div');
        dateEl.style.cssText = 'font-weight:700; margin-bottom:6px; color:#f38ba8;';
        dateEl.textContent = `📅 ${formatDate(err.date)}`;

        const timesEl = document.createElement('div');
        timesEl.style.cssText = 'color:#a6adc8; font-size:13px;';
        timesEl.textContent = err.times.length > 0
          ? `Horários (${err.times.length}): ${err.times.join(' · ')}`
          : 'Nenhum horário encontrado';

        const scrollBtn = document.createElement('button');
        scrollBtn.textContent = '👁 Ver no calendário';
        scrollBtn.style.cssText = `
          margin-top: 8px;
          background: #45475a;
          border: none;
          color: #cdd6f4;
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 12px;
          cursor: pointer;
        `;
        scrollBtn.onclick = () => {
          err.container.scrollIntoView({ behavior: 'smooth', block: 'center' });
          err.container.style.outline = '2px solid #f38ba8';
          err.container.style.outlineOffset = '4px';
        };

        card.appendChild(dateEl);
        card.appendChild(timesEl);
        card.appendChild(scrollBtn);
        panel.appendChild(card);
      }
    }

    const footer = document.createElement('div');
    footer.style.cssText = 'margin-top:14px; font-size:12px; color:#585b70; text-align:right;';
    footer.textContent = `Atualizado às ${new Date().toLocaleTimeString('pt-BR')}`;
    panel.appendChild(footer);

    document.body.appendChild(panel);
  }

  // ─────────────────────────────────────────
  // BSALDO - busca após abrir o cartão completo
  // ─────────────────────────────────────────

  function getDataOntem() {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    const dd = String(ontem.getDate()).padStart(2, '0');
    const mm = String(ontem.getMonth() + 1).padStart(2, '0');
    const yyyy = ontem.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  function buscarBSaldo(callback, tentativas = 20, intervalo = 300) {
    const dataOntem = getDataOntem();
    let tentativa = 0;

    const timer = setInterval(() => {
      tentativa++;

      let linhaEncontrada = null;
      let i = 1;
      while (true) {
        const celulaData = document.getElementById(`cartao-ponto-completo-tabela-${i}-2`);
        if (!celulaData) break;
        if (celulaData.textContent.trim().startsWith(dataOntem)) {
          linhaEncontrada = i;
          break;
        }
        i++;
      }

      if (linhaEncontrada !== null) {
        const celula = document.getElementById(`cartao-ponto-completo-tabela-${linhaEncontrada}-33`);
        if (celula && celula.textContent.trim() !== '') {
          clearInterval(timer);
          callback(celula.textContent.trim());
          return;
        }
      }

      if (tentativa >= tentativas) {
        clearInterval(timer);
        callback(null);
      }
    }, intervalo);
  }

  // ─────────────────────────────────────────
  // LISTENER no botão "Completo"
  // ─────────────────────────────────────────

  function observarBotaoCompleto() {
    // Usa delegação de evento no body para capturar mesmo após React re-renderizar
    document.body.addEventListener('click', (e) => {
      const botao = e.target.closest('[data-testid="cartao-ponto-completo"]');
      if (!botao) return;

      // Só age se estiver abrindo (cor azul = estava fechado)
      const bg = botao.style.backgroundColor;
      const estaAbrindo = bg === 'rgb(89, 203, 232)' || bg === '';

      if (!estaAbrindo) return;

      // Atualiza o card de BSaldo para "aguardando" se painel já existir
      const bsaldoCard = document.getElementById('bsaldo-card');
      if (bsaldoCard) {
        bsaldoCard.style.cssText = 'background:#313244; border-left:3px solid #89b4fa; border-radius:8px; padding:10px 14px; margin-bottom:14px; color:#89b4fa; font-weight:600;';
        bsaldoCard.textContent = '⏳ Carregando BSaldo...';
      }

      buscarBSaldo((bSaldo) => {
        const card = document.getElementById('bsaldo-card');
        if (!card) return;

        if (bSaldo === null) {
          card.style.cssText = 'background:#313244; border-left:3px solid #f9e2af; border-radius:8px; padding:10px 14px; margin-bottom:14px; color:#f9e2af; font-weight:600;';
          card.textContent = '⚠️ BSaldo do dia anterior não encontrado';
        } else {
          const isNegative = bSaldo.startsWith('-');
          const color = isNegative ? '#f38ba8' : '#a6e3a1';
          card.style.cssText = `background:#313244; border-left:3px solid ${color}; border-radius:8px; padding:10px 14px; margin-bottom:14px;`;
          card.innerHTML = `
            <div style="font-size:11px; color:#a6adc8; margin-bottom:4px;">BANCO DE HORAS - DIA ANTERIOR</div>
            <div style="font-weight:700; font-size:20px; color:${color};">${bSaldo}</div>
          `;
        }
      });
    }, true); // capture=true para pegar antes do React
  }

  // ─────────────────────────────────────────
  // INICIALIZAÇÃO
  // ─────────────────────────────────────────

  function clearHighlights() {
    document.querySelectorAll('[id^="dia-resumido-"]').forEach(el => {
      el.style.outline = '';
      el.style.outlineOffset = '';
    });
  }

  function run() {
    clearHighlights();
    const errors = analyzePonto();
    showResults(errors, 'aguardando');
    observarBotaoCompleto();
  }

  function waitForContent(callback, maxTries = 20) {
    let tries = 0;
    const interval = setInterval(() => {
      const found = document.querySelector('[id^="dia-resumido-"]');
      if (found || tries >= maxTries) {
        clearInterval(interval);
        callback();
      }
      tries++;
    }, 500);
  }

  let debounceTimer;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      clearHighlights();
      const errors = analyzePonto();
      // Mantém o BSaldo atual se já foi carregado
      const bsaldoCard = document.getElementById('bsaldo-card');
      const bsaldoAtual = bsaldoCard ? bsaldoCard.querySelector('div:last-child')?.textContent : null;
      showResults(errors, bsaldoAtual || 'aguardando');
    }, 1200);
  });

  waitForContent(() => {
    run();
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  });

})();
