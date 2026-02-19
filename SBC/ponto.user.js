// ==UserScript==
// @name         Verificador de Ponto - Central do Funcionário
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Analisa inconsistências no cartão de ponto (marcações ímpares)
// @author       Almeida
// @match        https://centraldofuncionario.com.br/*/cartao-ponto*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const TIME_REGEX = /^\d{2}:\d{2}$/;

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

  function showResults(errors) {
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

        // Botão scroll até o dia
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

  function clearHighlights() {
    document.querySelectorAll('[id^="dia-resumido-"]').forEach(el => {
      el.style.outline = '';
      el.style.outlineOffset = '';
    });
  }

  function run() {
    clearHighlights();
    const errors = analyzePonto();
    showResults(errors);
  }

  // Aguarda o React renderizar o conteúdo
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

  // Monitora mudanças dinâmicas (troca de mês, etc.)
  let debounceTimer;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(run, 1200);
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
