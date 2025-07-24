javascript:(function() {
  'use strict';

  // Configurações globais
  const config = {
    primaryColor: '#6a5acd', // Roxo ardósia
    secondaryColor: '#4682b4', // Azul aço
    darkBg: '#1a1a1a',
    lightText: '#ffffff',
    borderRadius: '12px',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease'
  };

  // Estado da aplicação
  let state = {
    inspecting: false,
    consoleOpen: false,
    autoClicking: false,
    autoScrolling: false,
    modifiedElements: []
  };

  // Elementos da UI
  const uiElements = {
    mainButton: null,
    panel: null,
    consolePanel: null,
    inspectOverlay: null
  };

  // Inicializa a FoxDevTools
  function initFoxDevTools() {
    // Verifica se já está carregado para evitar duplicação
    if (document.getElementById('fox-devtools-root')) return;
    
    // Cria o elemento raiz
    const root = document.createElement('div');
    root.id = 'fox-devtools-root';
    document.body.appendChild(root);
    
    // Cria os elementos da UI
    createMainButton();
    createMainPanel();
    createConsolePanel();
    createInspectOverlay();
    
    // Adiciona estilos globais
    addGlobalStyles();
    
    console.log('FoxDevTools carregado com sucesso!');
  }

  // Cria o botão principal flutuante
  function createMainButton() {
    const button = document.createElement('button');
    button.id = 'fox-devtools-main-button';
    button.innerHTML = '🦊';
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: ${config.primaryColor};
      color: white;
      border: none;
      font-size: 24px;
      cursor: pointer;
      z-index: 99998;
      box-shadow: ${config.shadow};
      transition: ${config.transition};
    `;
    
    button.addEventListener('click', toggleMainPanel);
    
    uiElements.mainButton = button;
    document.getElementById('fox-devtools-root').appendChild(button);
  }

  // Cria o painel principal
  function createMainPanel() {
    const panel = document.createElement('div');
    panel.id = 'fox-devtools-panel';
    panel.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      width: 280px;
      background-color: ${config.darkBg};
      color: ${config.lightText};
      border-radius: ${config.borderRadius};
      padding: 15px;
      box-shadow: ${config.shadow};
      z-index: 99999;
      display: none;
      transition: ${config.transition};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0; color: ${config.primaryColor};">FoxDevTools</h3>
        <button id="fox-devtools-close-btn" style="background: none; border: none; color: white; font-size: 18px;">×</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button id="fox-inspect-btn" class="fox-btn" style="background-color: ${config.secondaryColor};">
          <span class="fox-btn-icon">🔍</span> Inspecionar Elementos
        </button>
        <button id="fox-console-btn" class="fox-btn">
          <span class="fox-btn-icon">📋</span> Console
        </button>
        <button id="fox-actions-btn" class="fox-btn">
          <span class="fox-btn-icon">⚡</span> Ações Automáticas
        </button>
        <button id="fox-unlock-btn" class="fox-btn">
          <span class="fox-btn-icon">🔓</span> Desbloquear Site
        </button>
        <button id="fox-clear-btn" class="fox-btn" style="background-color: #d9534f;">
          <span class="fox-btn-icon">🗑️</span> Limpar Alterações
        </button>
      </div>
    `;
    
    // Adiciona eventos aos botões
    panel.querySelector('#fox-inspect-btn').addEventListener('click', toggleInspectMode);
    panel.querySelector('#fox-console-btn').addEventListener('click', toggleConsole);
    panel.querySelector('#fox-actions-btn').addEventListener('click', showActionsMenu);
    panel.querySelector('#fox-unlock-btn').addEventListener('click', unlockSite);
    panel.querySelector('#fox-clear-btn').addEventListener('click', clearChanges);
    panel.querySelector('#fox-devtools-close-btn').addEventListener('click', toggleMainPanel);
    
    uiElements.panel = panel;
    document.getElementById('fox-devtools-root').appendChild(panel);
  }

  // Cria o painel do console
  function createConsolePanel() {
    const consolePanel = document.createElement('div');
    consolePanel.id = 'fox-devtools-console';
    consolePanel.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 200px;
      background-color: rgba(30, 30, 30, 0.95);
      color: #e0e0e0;
      border-top: 2px solid ${config.primaryColor};
      z-index: 99997;
      display: none;
      flex-direction: column;
      font-family: monospace;
      overflow: hidden;
    `;
    
    consolePanel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background-color: rgba(0, 0, 0, 0.2);">
        <strong>Console</strong>
        <div>
          <button id="fox-console-clear" style="margin-right: 8px; background: #555; border: none; color: white; border-radius: 4px; padding: 2px 8px;">Limpar</button>
          <button id="fox-console-close" style="background: none; border: none; color: white; font-size: 18px;">×</button>
        </div>
      </div>
      <div id="fox-console-content" style="flex: 1; overflow-y: auto; padding: 8px 12px; font-size: 14px;"></div>
      <div style="display: flex; padding: 8px; background-color: rgba(0, 0, 0, 0.2);">
        <input id="fox-console-input" type="text" style="flex: 1; padding: 6px; border: 1px solid #555; background: #222; color: white; border-radius: 4px;">
        <button id="fox-console-send" style="margin-left: 8px; padding: 6px 12px; background: ${config.primaryColor}; border: none; color: white; border-radius: 4px;">Enviar</button>
      </div>
    `;
    
    // Adiciona eventos
    consolePanel.querySelector('#fox-console-close').addEventListener('click', toggleConsole);
    consolePanel.querySelector('#fox-console-clear').addEventListener('click', () => {
      document.getElementById('fox-console-content').innerHTML = '';
    });
    consolePanel.querySelector('#fox-console-send').addEventListener('click', () => {
      const input = document.getElementById('fox-console-input');
      if (input.value.trim()) {
        logToConsole(input.value, 'user');
        try {
          const result = eval(input.value);
          logToConsole(result, 'result');
        } catch (e) {
          logToConsole(e.message, 'error');
        }
        input.value = '';
      }
    });
    
    uiElements.consolePanel = consolePanel;
    document.getElementById('fox-devtools-root').appendChild(consolePanel);
  }

  // Cria overlay para modo de inspeção
  function createInspectOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'fox-inspect-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(100, 180, 255, 0.2);
      z-index: 99996;
      display: none;
      pointer-events: none;
    `;
    
    uiElements.inspectOverlay = overlay;
    document.getElementById('fox-devtools-root').appendChild(overlay);
  }

  // Adiciona estilos globais
  function addGlobalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .fox-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 15px;
        background-color: #333;
        color: white;
        border: none;
        border-radius: ${config.borderRadius};
        cursor: pointer;
        transition: ${config.transition};
        font-size: 14px;
      }
      .fox-btn:hover {
        opacity: 0.9;
      }
      .fox-btn-icon {
        font-size: 16px;
      }
      #fox-inspect-overlay.highlight {
        pointer-events: auto;
        background-color: rgba(100, 180, 255, 0.3);
        outline: 2px dashed ${config.primaryColor};
      }
      .element-info-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: ${config.darkBg};
        color: white;
        border-radius: ${config.borderRadius};
        padding: 15px;
        width: 80%;
        max-width: 300px;
        z-index: 100000;
        box-shadow: ${config.shadow};
      }
      .element-info-modal h3 {
        margin-top: 0;
        color: ${config.primaryColor};
        border-bottom: 1px solid #444;
        padding-bottom: 8px;
      }
      .element-info-content {
        margin-bottom: 15px;
        max-height: 200px;
        overflow-y: auto;
        font-family: monospace;
        font-size: 13px;
      }
      .element-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .element-actions button {
        padding: 8px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .element-actions button.change-text {
        background-color: ${config.secondaryColor};
        color: white;
      }
      .element-actions button.change-bg {
        background-color: #5bc0de;
        color: white;
      }
      .element-actions button.remove {
        background-color: #d9534f;
        color: white;
      }
      .element-actions button.close {
        background-color: #777;
        color: white;
      }
      .actions-menu {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: ${config.darkBg};
        color: white;
        border-radius: ${config.borderRadius};
        padding: 15px;
        width: 80%;
        max-width: 300px;
        z-index: 100000;
        box-shadow: ${config.shadow};
      }
      .actions-menu h3 {
        margin-top: 0;
        color: ${config.primaryColor};
      }
      .actions-menu button {
        display: block;
        width: 100%;
        padding: 10px;
        margin-bottom: 8px;
        background-color: #333;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .actions-menu button.close {
        margin-top: 15px;
        background-color: #777;
      }
    `;
    
    document.head.appendChild(style);
  }

  // Alterna o painel principal
  function toggleMainPanel() {
    const panel = uiElements.panel;
    if (panel.style.display === 'block') {
      panel.style.display = 'none';
    } else {
      panel.style.display = 'block';
      // Atualiza o estado dos botões
      updateButtonStates();
    }
  }

  // Alterna o modo de inspeção
  function toggleInspectMode() {
    state.inspecting = !state.inspecting;
    
    if (state.inspecting) {
      uiElements.inspectOverlay.style.display = 'block';
      document.body.style.cursor = 'pointer';
      logToConsole('Modo de inspeção ativado. Toque em qualquer elemento para inspecionar.');
    } else {
      uiElements.inspectOverlay.style.display = 'none';
      document.body.style.cursor = '';
      logToConsole('Modo de inspeção desativado.');
    }
    
    updateButtonStates();
    setupInspectMode();
  }

  // Configura os eventos do modo de inspeção
  function setupInspectMode() {
    const overlay = uiElements.inspectOverlay;
    
    // Remove eventos anteriores para evitar duplicação
    overlay.removeEventListener('mousemove', handleElementHover);
    overlay.removeEventListener('click', handleElementClick);
    document.removeEventListener('keydown', handleEscapeKey);
    
    if (state.inspecting) {
      overlay.addEventListener('mousemove', handleElementHover);
      overlay.addEventListener('click', handleElementClick);
      document.addEventListener('keydown', handleEscapeKey);
    }
  }

  // Manipula o hover sobre elementos
  function handleElementHover(e) {
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element || element === uiElements.inspectOverlay) return;
    
    const rect = element.getBoundingClientRect();
    const overlay = uiElements.inspectOverlay;
    
    overlay.style.left = `${rect.left}px`;
    overlay.style.top = `${rect.top}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.classList.add('highlight');
  }

  // Manipula o clique em elementos
  function handleElementClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element || element === uiElements.inspectOverlay) return;
    
    showElementInfo(element);
    toggleInspectMode(); // Desativa o modo de inspeção após selecionar um elemento
  }

  // Manipula a tecla Escape para sair do modo de inspeção
  function handleEscapeKey(e) {
    if (e.key === 'Escape' && state.inspecting) {
      toggleInspectMode();
    }
  }

  // Mostra informações do elemento selecionado
  function showElementInfo(element) {
    // Cria um modal com informações do elemento
    const modal = document.createElement('div');
    modal.className = 'element-info-modal';
    
    // Obtém informações do elemento
    const tagName = element.tagName.toLowerCase();
    const elementId = element.id ? `#${element.id}` : '';
    const elementClasses = element.className ? `.${element.className.split(' ').join('.')}` : '';
    const elementText = element.innerText || element.textContent || '';
    const attributes = Array.from(element.attributes)
      .map(attr => `${attr.name}="${attr.value}"`)
      .join(' ');
    
    modal.innerHTML = `
      <h3>${tagName}${elementId}${elementClasses}</h3>
      <div class="element-info-content">
        <p><strong>Tag:</strong> &lt;${tagName}&gt;</p>
        ${elementId ? `<p><strong>ID:</strong> ${element.id}</p>` : ''}
        ${elementClasses ? `<p><strong>Classes:</strong> ${element.className}</p>` : ''}
        ${attributes ? `<p><strong>Atributos:</strong> ${attributes}</p>` : ''}
        <p><strong>Texto:</strong> ${elementText.trim() || '(vazio)'}</p>
      </div>
      <div class="element-actions">
        <button class="change-text">Alterar Texto</button>
        <button class="change-bg">Mudar Cor de Fundo</button>
        <button class="remove">Remover Elemento</button>
        <button class="close">Fechar</button>
      </div>
    `;
    
    // Adiciona eventos aos botões
    modal.querySelector('.change-text').addEventListener('click', () => {
      const newText = prompt('Digite o novo texto:', elementText);
      if (newText !== null) {
        element.innerText = newText;
        state.modifiedElements.push(element);
        logToConsole(`Texto do elemento ${tagName} alterado para: "${newText}"`);
        modal.remove();
      }
    });
    
    modal.querySelector('.change-bg').addEventListener('click', () => {
      const newColor = prompt('Digite a nova cor de fundo (nome, hex, rgb):', '#ff0000');
      if (newColor) {
        element.style.backgroundColor = newColor;
        state.modifiedElements.push(element);
        logToConsole(`Cor de fundo do elemento ${tagName} alterada para: ${newColor}`);
        modal.remove();
      }
    });
    
    modal.querySelector('.remove').addEventListener('click', () => {
      if (confirm('Tem certeza que deseja remover este elemento?')) {
        element.remove();
        state.modifiedElements.push(element);
        logToConsole(`Elemento ${tagName} removido da página`);
        modal.remove();
      }
    });
    
    modal.querySelector('.close').addEventListener('click', () => {
      modal.remove();
    });
    
    document.body.appendChild(modal);
  }

  // Alterna o console
  function toggleConsole() {
    state.consoleOpen = !state.consoleOpen;
    
    if (state.consoleOpen) {
      uiElements.consolePanel.style.display = 'flex';
      logToConsole('Console aberto. Os logs serão exibidos aqui.');
    } else {
      uiElements.consolePanel.style.display = 'none';
    }
    
    updateButtonStates();
  }

  // Mostra o menu de ações automáticas
  function showActionsMenu() {
    const menu = document.createElement('div');
    menu.className = 'actions-menu';
    
    menu.innerHTML = `
      <h3>Ações Automáticas</h3>
      <button id="fox-auto-click">${state.autoClicking ? '🛑 Parar' : '🖱️'} Clicks Automáticos</button>
      <button id="fox-auto-scroll">${state.autoScrolling ? '🛑 Parar' : '📜'} Scroll Automático</button>
      <button id="fox-show-links">🔗 Mostrar Links</button>
      <button class="close">Fechar</button>
    `;
    
    // Adiciona eventos
    menu.querySelector('#fox-auto-click').addEventListener('click', () => {
      state.autoClicking = !state.autoClicking;
      if (state.autoClicking) {
        startAutoClicking();
        logToConsole('Clicks automáticos iniciados (a cada 2 segundos)');
      } else {
        logToConsole('Clicks automáticos parados');
      }
      menu.remove();
    });
    
    menu.querySelector('#fox-auto-scroll').addEventListener('click', () => {
      state.autoScrolling = !state.autoScrolling;
      if (state.autoScrolling) {
        startAutoScrolling();
        logToConsole('Scroll automático iniciado');
      } else {
        logToConsole('Scroll automático parado');
      }
      menu.remove();
    });
    
    menu.querySelector('#fox-show-links').addEventListener('click', () => {
      showAllLinks();
      menu.remove();
    });
    
    menu.querySelector('.close').addEventListener('click', () => {
      menu.remove();
    });
    
    document.body.appendChild(menu);
  }

  // Inicia clicks automáticos
  function startAutoClicking() {
    if (!state.autoClicking) return;
    
    const buttons = document.querySelectorAll('button, a[href], input[type="submit"], input[type="button"]');
    if (buttons.length > 0) {
      const randomIndex = Math.floor(Math.random() * buttons.length);
      buttons[randomIndex].click();
      logToConsole(`Click automático em: ${buttons[randomIndex].tagName} ${buttons[randomIndex].innerText || buttons[randomIndex].value || buttons[randomIndex].getAttribute('href') || ''}`);
    }
    
    setTimeout(startAutoClicking, 2000);
  }

  // Inicia scroll automático
  function startAutoScrolling() {
    if (!state.autoScrolling) return;
    
    const scrollStep = 50;
    const currentPosition = window.pageYOffset;
    const maxPosition = document.body.scrollHeight - window.innerHeight;
    
    if (currentPosition < maxPosition) {
      window.scrollBy(0, scrollStep);
      setTimeout(startAutoScrolling, 100);
    } else {
      state.autoScrolling = false;
      logToConsole('Scroll automático concluído (fim da página alcançado)');
    }
  }

  // Mostra todos os links da página
  function showAllLinks() {
    const links = Array.from(document.querySelectorAll('a[href]'));
    const linksInfo = links.map(link => {
      return `- ${link.innerText.trim() || '(sem texto)'}\n  ${link.href}`;
    }).join('\n\n');
    
    if (linksInfo) {
      alert(`LINKS ENCONTRADOS (${links.length}):\n\n${linksInfo}`);
      logToConsole(`${links.length} links encontrados na página`);
    } else {
      alert('Nenhum link encontrado na página.');
      logToConsole('Nenhum link encontrado na página');
    }
  }

  // Desbloqueia o site
  function unlockSite() {
    document.body.oncontextmenu = null;
    document.body.onselectstart = null;
    document.oncontextmenu = null;
    document.onselectstart = null;
    
    // Permite seleção de texto e menu de contexto
    document.body.style.userSelect = 'auto';
    document.body.style.webkitUserSelect = 'auto';
    
    logToConsole('Site desbloqueado: copiar, colar e menu de contexto habilitados');
    alert('Site desbloqueado!\nAgora você pode copiar, colar e usar o menu de contexto.');
  }

  // Limpa todas as alterações
  function clearChanges() {
    state.modifiedElements.forEach(element => {
      if (element.parentNode) {
        element.style.backgroundColor = '';
      }
    });
    
    // Remove elementos que foram deletados do array
    state.modifiedElements = state.modifiedElements.filter(el => el.parentNode);
    
    logToConsole('Todas as alterações visuais foram revertidas');
    alert('Alterações visuais revertidas com sucesso!');
  }

  // Atualiza o estado dos botões
  function updateButtonStates() {
    if (!uiElements.panel) return;
    
    const inspectBtn = uiElements.panel.querySelector('#fox-inspect-btn');
    const consoleBtn = uiElements.panel.querySelector('#fox-console-btn');
    
    if (inspectBtn) {
      inspectBtn.textContent = state.inspecting ? '🔍 Parar Inspeção' : '🔍 Inspecionar Elementos';
      inspectBtn.style.backgroundColor = state.inspecting ? config.primaryColor : config.secondaryColor;
    }
    
    if (consoleBtn) {
      consoleBtn.textContent = state.consoleOpen ? '📋 Fechar Console' : '📋 Console';
    }
  }

  // Registra mensagens no console visual
  function logToConsole(message, type = 'log') {
    if (!uiElements.consolePanel) return;
    
    const consoleContent = document.getElementById('fox-console-content');
    if (!consoleContent) return;
    
    const timestamp = new Date().toLocaleTimeString();
    let messageElement = document.createElement('div');
    
    // Estiliza de acordo com o tipo de mensagem
    switch (type) {
      case 'error':
        messageElement.style.color = '#ff6b6b';
        break;
      case 'warn':
        messageElement.style.color = '#feca57';
        break;
      case 'info':
        messageElement.style.color = '#48dbfb';
        break;
      case 'result':
        messageElement.style.color = '#1dd1a1';
        break;
      case 'user':
        messageElement.style.color = '#6a5acd';
        break;
      default:
        messageElement.style.color = '#e0e0e0';
    }
    
    messageElement.textContent = `[${timestamp}] ${message}`;
    consoleContent.appendChild(messageElement);
    
    // Auto-scroll para a última mensagem
    consoleContent.scrollTop = consoleContent.scrollHeight;
    
    // Também registra no console real para depuração
    if (typeof console !== 'undefined') {
      console[type](message);
    }
  }

  // Sobrescreve o console.log padrão para capturar logs
  function overrideConsoleLogs() {
    if (typeof console !== 'undefined') {
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      const originalInfo = console.info;
      
      console.log = function() {
        logToConsole(Array.from(arguments).join(' '), 'log');
        originalLog.apply(console, arguments);
      };
      
      console.error = function() {
        logToConsole(Array.from(arguments).join(' '), 'error');
        originalError.apply(console, arguments);
      };
      
      console.warn = function() {
        logToConsole(Array.from(arguments).join(' '), 'warn');
        originalWarn.apply(console, arguments);
      };
      
      console.info = function() {
        logToConsole(Array.from(arguments).join(' '), 'info');
        originalInfo.apply(console, arguments);
      };
    }
  }

  // Inicializa a ferramenta
  initFoxDevTools();
  overrideConsoleLogs();
})();
