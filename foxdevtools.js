javascript:(function(){
  if (window.FoxDevTools) return;

  // Configurações iniciais
  const FoxDevTools = {
    version: '1.0.0',
    initialized: false,
    settings: {
      theme: 'dark',
      autoClickerInterval: null,
      inspectorMode: false,
      performanceMetrics: {
        startTime: performance.now(),
        domContentLoaded: false,
        loadTime: false
      }
    },
    elements: {
      button: null,
      panel: null,
      console: null,
      autoClicker: null,
      inspector: null,
      storage: null,
      tools: null,
      performance: null,
      debug: null,
      shortcuts: null,
      orientation: null
    }
  };

  // Salvar no escopo global
  window.FoxDevTools = FoxDevTools;

  // Carregar recursos
  const loadResources = () => {
    // CSS
    const css = `
      /* Estilos base */
      .fox-devtools {
        --primary-color: black;
        --primary-dark: #e65100;
        --primary-light: #ff9e40;
        --text-primary: #f5f5f5;
        --text-secondary: #bdbdbd;
        --bg-primary: #212121;
        --bg-secondary: #424242;
        --bg-tertiary: #616161;
        --success-color: #4caf50;
        --error-color: #f44336;
        --warning-color: #ff9800;
        --info-color: #2196f3;
        --border-radius: 4px;
        --transition: all 0.3s ease;
        --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        --font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }

      .fox-devtools.light {
        --text-primary: #212121;
        --text-secondary: #424242;
        --bg-primary: #f5f5f5;
        --bg-secondary: #e0e0e0;
        --bg-tertiary: #bdbdbd;
      }

      /* Botão flutuante */
      .fox-devtools-button {
        position: fixed;
        bottom: 40px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 0%;
        background-color: var(--primary-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: var(--shadow);
        z-index: 99999;
        border: none;
        outline: none;
        transition: var(--transition);
      }

      .fox-devtools-button:hover {
        background-color: var(--primary-dark);
        transform: scale(1.1);
      }

      .fox-devtools-button img {
        width: 30px;
        height: 30px;
      }

      /* Painel principal */
      .fox-devtools-panel {
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 90%;
        max-width: 400px;
        max-height: 70vh;
        background-color: black;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 99998;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: var(--transition);
        transform: translateY(20px);
        opacity: 0;
        visibility: hidden;
      }

      .fox-devtools-panel.visible {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      /* Cabeçalho */
      .fox-devtools-header {
        padding: 10px 15px;
        background-color: var(--primary-color);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: var(--font-family);
        font-weight: bold;
      }

      .fox-devtools-title {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .fox-devtools-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
      }

      /* Abas */
      .fox-devtools-tabs {
        display: flex;
        background-color: var(--bg-secondary);
        overflow-x: auto;
        scrollbar-width: none;
      }

      .fox-devtools-tabs::-webkit-scrollbar {
        display: none;
      }

      .fox-devtools-tab {
        padding: 10px 15px;
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-family: var(--font-family);
        font-size: 14px;
        white-space: nowrap;
        border-bottom: 2px solid transparent;
        transition: var(--transition);
      }

      .fox-devtools-tab.active {
        color: var(--text-primary);
        border-bottom: 2px solid var(--primary-color);
      }

      /* Conteúdo */
      .fox-devtools-content {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        font-family: var(--font-family);
        color: var(--text-primary);
      }

      /* Estilos comuns para seções */
      .fox-devtools-section {
        margin-bottom: 20px;
      }

      .fox-devtools-section-title {
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: bold;
        color: var(--primary-color);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .fox-devtools-input-group {
        margin-bottom: 15px;
      }

      .fox-devtools-label {
        display: block;
        margin-bottom: 5px;
        font-size: 14px;
        color: var(--text-primary);
      }

      .fox-devtools-input {
        width: 100%;
        padding: 8px 10px;
        border-radius: var(--border-radius);
        border: 1px solid var(--bg-tertiary);
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        font-family: var(--font-family);
        font-size: 14px;
        transition: var(--transition);
      }

      .fox-devtools-input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(255, 109, 0, 0.2);
      }

      .fox-devtools-button-group {
        display: flex;
        gap: 10px;
        margin-top: 10px;
      }

      .fox-devtools-button-primary {
        background-color: var(--primary-color);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-family: var(--font-family);
        font-size: 14px;
        transition: var(--transition);
        flex: 1;
      }

      .fox-devtools-button-primary:hover {
        background-color: var(--primary-dark);
      }

      .fox-devtools-button-secondary {
        background-color: var(--bg-tertiary);
        color: var(--text-primary);
        border: none;
        padding: 8px 15px;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-family: var(--font-family);
        font-size: 14px;
        transition: var(--transition);
        flex: 1;
      }

      .fox-devtools-button-secondary:hover {
        background-color: var(--bg-secondary);
      }

      .fox-devtools-button-danger {
        background-color: var(--error-color);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-family: var(--font-family);
        font-size: 14px;
        transition: var(--transition);
        flex: 1;
      }

      .fox-devtools-button-danger:hover {
        background-color: #d32f2f;
      }

      /* Console */
      .fox-devtools-console-output {
        height: 200px;
        overflow-y: auto;
        background-color: var(--bg-secondary);
        border-radius: var(--border-radius);
        padding: 10px;
        margin-bottom: 10px;
        font-family: monospace;
        font-size: 13px;
      }

      .fox-devtools-console-entry {
        margin-bottom: 5px;
        padding-bottom: 5px;
        border-bottom: 1px solid var(--bg-tertiary);
        word-break: break-word;
      }

      .fox-devtools-console-entry.log {
        color: var(--text-primary);
      }

      .fox-devtools-console-entry.info {
        color: var(--info-color);
      }

      .fox-devtools-console-entry.warn {
        color: var(--warning-color);
      }

      .fox-devtools-console-entry.error {
        color: var(--error-color);
      }

      .fox-devtools-console-input {
        display: flex;
        gap: 10px;
      }

      .fox-devtools-console-input-field {
        flex: 1;
        padding: 8px 10px;
        border-radius: var(--border-radius);
        border: 1px solid var(--bg-tertiary);
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        font-family: monospace;
        font-size: 13px;
      }

      .fox-devtools-console-input-field:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      /* Inspetor de elementos */
      .fox-devtools-inspector-info {
        background-color: var(--bg-secondary);
        border-radius: var(--border-radius);
        padding: 10px;
        margin-bottom: 10px;
      }

      .fox-devtools-inspector-property {
        margin-bottom: 5px;
      }

      .fox-devtools-inspector-property-label {
        font-weight: bold;
        color: var(--primary-color);
        margin-right: 5px;
      }

      .fox-devtools-inspector-css {
        margin-top: 10px;
      }

      .fox-devtools-inspector-css-property {
        display: flex;
        margin-bottom: 3px;
      }

      .fox-devtools-inspector-css-name {
        flex: 1;
        color: var(--primary-light);
      }

      .fox-devtools-inspector-css-value {
        flex: 2;
      }

      /* Gerenciador de armazenamento */
      .fox-devtools-storage-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
      }

      .fox-devtools-storage-table th {
        text-align: left;
        padding: 8px;
        background-color: var(--bg-tertiary);
        color: var(--text-primary);
      }

      .fox-devtools-storage-table td {
        padding: 8px;
        border-bottom: 1px solid var(--bg-tertiary);
        vertical-align: top;
      }

      .fox-devtools-storage-actions {
        display: flex;
        gap: 5px;
      }

      .fox-devtools-storage-edit {
        background-color: var(--info-color);
        color: white;
        border: none;
        border-radius: 2px;
        padding: 2px 5px;
        cursor: pointer;
        font-size: 12px;
      }

      .fox-devtools-storage-delete {
        background-color: var(--error-color);
        color: white;
        border: none;
        border-radius: 2px;
        padding: 2px 5px;
        cursor: pointer;
        font-size: 12px;
      }

      /* Performance */
      .fox-devtools-performance-metrics {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .fox-devtools-performance-metric {
        background-color: var(--bg-secondary);
        border-radius: var(--border-radius);
        padding: 10px;
        text-align: center;
      }

      .fox-devtools-performance-metric-value {
        font-size: 18px;
        font-weight: bold;
        color: var(--primary-color);
        margin: 5px 0;
      }

      .fox-devtools-performance-metric-label {
        font-size: 12px;
        color: var(--text-secondary);
      }

      /* Responsividade */
      @media (max-width: 480px) {
        .fox-devtools-panel {
          width: calc(100% - 40px);
          bottom: 70px;
          right: 20px;
          max-height: 60vh;
        }

        .fox-devtools-button {
          width: 45px;
          height: 45px;
          bottom: 15px;
          right: 15px;
        }
      }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Ícones (usando SVG inline)
    const icons = `
      <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <symbol id="fox-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,12,20z M15.7,11.3c0.4,0.4,0.4,1,0,1.4c-0.4,0.4-1,0.4-1.4,0l-2.3-2.3l-2.3,2.3c-0.4,0.4-1,0.4-1.4,0c-0.4-0.4-0.4-1,0-1.4l2.3-2.3L8.3,6.7c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l2.3,2.3l2.3-2.3c0.4-0.4,1-0.4,1.4,0c0.4,0.4,0.4,1,0,1.4L13.4,9L15.7,11.3z"/>
        </symbol>
        <symbol id="console-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M5,3h14c1.1,0,2,0.9,2,2v14c0,1.1-0.9,2-2,2H5c-1.1,0-2-0.9-2-2V5C3,3.9,3.9,3,5,3z M6,7v2h8V7H6z M6,11v2h5v-2H6z M16,17l-4-4l4-4V17z"/>
        </symbol>
        <symbol id="click-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M11,4h2v7h7v2h-7v7h-2v-7H4v-2h7V4z"/>
        </symbol>
        <symbol id="inspect-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,9c1.7,0,3,1.3,3,3s-1.3,3-3,3s-3-1.3-3-3S10.3,9,12,9z M12,4.5c5,0,9.5,4.5,9.5,9.5S17,23.5,12,23.5S2.5,19,2.5,14S7,4.5,12,4.5z M12,3C6.5,3,2,7.5,2,13s4.5,10,10,10s10-4.5,10-10S17.5,3,12,3z"/>
        </symbol>
        <symbol id="storage-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M18,4h-12c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V6C20,4.9,19.1,4,18,4z M12,7h4v4h-4V7z M8,7h2v4H8V7z M18,17H6v-2h12V17z M18,13h-4v-4h4V13z M8,13H6v-4h2V13z"/>
        </symbol>
        <symbol id="tools-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M21.7,18.6l-1.3-1.3c0.4-0.8,0.6-1.6,0.6-2.5c0-2.5-2-4.5-4.5-4.5S12,12.2,12,14.7s2,4.5,4.5,4.5c0.9,0,1.7-0.2,2.5-0.6l1.3,1.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l1.3-1.3C22.1,19.6,22.1,18.9,21.7,18.6z M14.5,17.2c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5S15.9,17.2,14.5,17.2z M12,3v2h7v2h-7v2l-3-3L12,3z M4,9v2h7V9H4z M4,13v2h7v-2H4z"/>
        </symbol>
        <symbol id="performance-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z M7,12h2v4H7V12z M11,8h2v8h-2V8z M15,10h2v6h-2V10z"/>
        </symbol>
        <symbol id="debug-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,12,20z M13,17h-2v-2h2V17z M13,13h-2V7h2V13z"/>
        </symbol>
        <symbol id="shortcuts-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z M7,12h5V7h2v5h5v2h-5v5h-2v-5H7V12z"/>
        </symbol>
        <symbol id="orientation-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M17,15h2v2h-2V15z M17,11h2v2h-2V11z M13,15h2v2h-2V15z M13,11h2v2h-2V11z M9,15h2v2H9V15z M9,11h2v2H9V11z M5,15h2v2H5V15z M5,11h2v2H5V11z M17,7h2v2h-2V7z M13,7h2v2h-2V7z M9,7h2v2H9V7z M5,7h2v2H5V7z"/>
        </symbol>
        <symbol id="close-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19,6.4L17.6,5L12,10.6L6.4,5L5,6.4L10.6,12L5,17.6L6.4,19L12,13.4L17.6,19L19,17.6L13.4,12L19,6.4z"/>
        </symbol>
        <symbol id="theme-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,3c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S17,3,12,3z M12,19c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7S15.9,19,12,19z"/>
        </symbol>
      </svg>
    `;

    document.body.insertAdjacentHTML('beforeend', icons);
  };

  // Criar elementos da UI
  const createUI = () => {
    // Botão flutuante
    const button = document.createElement('button');
    button.className = 'fox-devtools-button';
    button.innerHTML = `
  <img src="https://i.imgur.com/ISca1dC.png" 
       width="24" 
       height="24"
       style="object-fit: contain">
`;
    document.body.appendChild(button);
    FoxDevTools.elements.button = button;

    // Painel principal
    const panel = document.createElement('div');
    panel.className = 'fox-devtools-panel';
    panel.innerHTML = `
      <div class="fox-devtools-header">
        <div class="fox-devtools-title">
          <svg width="16" height="16">
            <use xlink:href="#fox-icon"></use>
          </svg>
          <span>FoxDevTools</span>
        </div>
        <button class="fox-devtools-close">
          <svg width="16" height="16">
            <use xlink:href="#close-icon"></use>
          </svg>
        </button>
      </div>
      <div class="fox-devtools-tabs">
        <button class="fox-devtools-tab active" data-tab="console">
          <svg width="14" height="14">
            <use xlink:href="#console-icon"></use>
          </svg>
          Console
        </button>
        <button class="fox-devtools-tab" data-tab="auto-clicker">
          <svg width="14" height="14">
            <use xlink:href="#click-icon"></use>
          </svg>
          Auto Clicker
        </button>
        <button class="fox-devtools-tab" data-tab="inspector">
          <svg width="14" height="14">
            <use xlink:href="#inspect-icon"></use>
          </svg>
          Inspetor
        </button>
        <button class="fox-devtools-tab" data-tab="storage">
          <svg width="14" height="14">
            <use xlink:href="#storage-icon"></use>
          </svg>
          Armazenamento
        </button>
        <button class="fox-devtools-tab" data-tab="tools">
          <svg width="14" height="14">
            <use xlink:href="#tools-icon"></use>
          </svg>
          Ferramentas
        </button>
        <button class="fox-devtools-tab" data-tab="performance">
          <svg width="14" height="14">
            <use xlink:href="#performance-icon"></use>
          </svg>
          Desempenho
        </button>
        <button class="fox-devtools-tab" data-tab="debug">
          <svg width="14" height="14">
            <use xlink:href="#debug-icon"></use>
          </svg>
          Depuração
        </button>
        <button class="fox-devtools-tab" data-tab="shortcuts">
          <svg width="14" height="14">
            <use xlink:href="#shortcuts-icon"></use>
          </svg>
          Atalhos
        </button>
        <button class="fox-devtools-tab" data-tab="orientation">
          <svg width="14" height="14">
            <use xlink:href="#orientation-icon"></use>
          </svg>
          Orientação
        </button>
      </div>
      <div class="fox-devtools-content">
        <!-- Conteúdo será injetado dinamicamente -->
      </div>
    `;
    document.body.appendChild(panel);
    FoxDevTools.elements.panel = panel;

    // Conteúdo das abas
    const content = panel.querySelector('.fox-devtools-content');
    
    // Console
    const consoleContent = document.createElement('div');
    consoleContent.className = 'fox-devtools-tab-content active';
    consoleContent.dataset.tabContent = 'console';
    consoleContent.innerHTML = `
      <div class="fox-devtools-section">
        <div class="fox-devtools-console-output"></div>
        <div class="fox-devtools-console-input">
          <input type="text" class="fox-devtools-console-input-field" placeholder="Digite um comando JS...">
          <button class="fox-devtools-button-primary">Executar</button>
        </div>
        <div class="fox-devtools-button-group">
          <button class="fox-devtools-button-secondary">Limpar</button>
          <button class="fox-devtools-button-secondary">Histórico</button>
        </div>
      </div>
    `;
    content.appendChild(consoleContent);
    FoxDevTools.elements.console = consoleContent;

    // Auto Clicker
    const autoClickerContent = document.createElement('div');
    autoClickerContent.className = 'fox-devtools-tab-content';
    autoClickerContent.dataset.tabContent = 'auto-clicker';
    autoClickerContent.innerHTML = `
      <div class="fox-devtools-section">
        <div class="fox-devtools-input-group">
          <label class="fox-devtools-label">Seletor CSS</label>
          <input type="text" class="fox-devtools-input" placeholder="ex: .button, #submit">
        </div>
        <div class="fox-devtools-input-group">
          <label class="fox-devtools-label">Intervalo (ms)</label>
          <input type="number" class="fox-devtools-input" value="1000" min="100" step="100">
        </div>
        <div class="fox-devtools-button-group">
          <button class="fox-devtools-button-primary">Iniciar</button>
          <button class="fox-devtools-button-danger" disabled>Parar</button>
        </div>
        <div class="fox-devtools-status" style="margin-top: 10px; color: var(--text-secondary); font-size: 13px;">
          Status: Inativo
        </div>
      </div>
    `;
    content.appendChild(autoClickerContent);
    FoxDevTools.elements.autoClicker = autoClickerContent;

    // Inspetor de elementos
    const inspectorContent = document.createElement('div');
    inspectorContent.className = 'fox-devtools-tab-content';
    inspectorContent.dataset.tabContent = 'inspector';
    inspectorContent.innerHTML = `
      <div class="fox-devtools-section">
        <div class="fox-devtools-button-group">
          <button class="fox-devtools-button-primary">Ativar Inspetor</button>
        </div>
        <div class="fox-devtools-status" style="margin-top: 10px; color: var(--text-secondary); font-size: 13px;">
          Status: Desativado
        </div>
        <div class="fox-devtools-inspector-info" style="margin-top: 15px; display: none;">
          <div class="fox-devtools-inspector-property">
            <span class="fox-devtools-inspector-property-label">Tag:</span>
            <span class="fox-devtools-inspector-property-value" data-property="tag"></span>
          </div>
          <div class="fox-devtools-inspector-property">
            <span class="fox-devtools-inspector-property-label">ID:</span>
            <span class="fox-devtools-inspector-property-value" data-property="id"></span>
          </div>
          <div class="fox-devtools-inspector-property">
            <span class="fox-devtools-inspector-property-label">Classes:</span>
            <span class="fox-devtools-inspector-property-value" data-property="classes"></span>
          </div>
          <div class="fox-devtools-inspector-property">
            <span class="fox-devtools-inspector-property-label">Texto:</span>
            <span class="fox-devtools-inspector-property-value" data-property="text"></span>
          </div>
          <div class="fox-devtools-inspector-css">
            <div class="fox-devtools-section-title">CSS Computado</div>
            <div class="fox-devtools-inspector-css-property">
              <span class="fox-devtools-inspector-css-name">display:</span>
              <span class="fox-devtools-inspector-css-value" data-css="display"></span>
            </div>
            <div class="fox-devtools-inspector-css-property">
              <span class="fox-devtools-inspector-css-name">color:</span>
              <span class="fox-devtools-inspector-css-value" data-css="color"></span>
            </div>
            <div class="fox-devtools-inspector-css-property">
              <span class="fox-devtools-inspector-css-name">font-size:</span>
              <span class="fox-devtools-inspector-css-value" data-css="font-size"></span>
            </div>
            <div class="fox-devtools-inspector-css-property">
              <span class="fox-devtools-inspector-css-name">background:</span>
              <span class="fox-devtools-inspector-css-value" data-css="background"></span>
            </div>
          </div>
        </div>
      </div>
    `;
    content.appendChild(inspectorContent);
    FoxDevTools.elements.inspector = inspectorContent;

    // Gerenciador de armazenamento
    const storageContent = document.createElement('div');
    storageContent.className = 'fox-devtools-tab-content';
    storageContent.dataset.tabContent = 'storage';
    storageContent.innerHTML = `
      <div class="fox-devtools-section">
        <div class="fox-devtools-tabs" style="margin-bottom: 15px;">
          <button class="fox-devtools-tab active" data-storage-tab="local">localStorage</button>
          <button class="fox-devtools-tab" data-storage-tab="session">sessionStorage</button>
          <button class="fox-devtools-tab" data-storage-tab="cookies">Cookies</button>
        </div>
        <div class="fox-devtools-storage-content" data-storage-content="local">
          <table class="fox-devtools-storage-table">
            <thead>
              <tr>
                <th>Chave</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <div class="fox-devtools-button-group">
            <button class="fox-devtools-button-secondary">Adicionar</button>
            <button class="fox-devtools-button-danger">Limpar</button>
          </div>
        </div>
        <div class="fox-devtools-storage-content" data-storage-content="session" style="display: none;">
          <table class="fox-devtools-storage-table">
            <thead>
              <tr>
                <th>Chave</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <div class="fox-devtools-button-group">
            <button class="fox-devtools-button-secondary">Adicionar</button>
            <button class="fox-devtools-button-danger">Limpar</button>
          </div>
        </div>
        <div class="fox-devtools-storage-content" data-storage-content="cookies" style="display: none;">
          <table class="fox-devtools-storage-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <div class="fox-devtools-button-group">
            <button class="fox-devtools-button-secondary">Adicionar</button>
            <button class="fox-devtools-button-danger">Limpar</button>
          </div>
        </div>
      </div>
    `;
    content.appendChild(storageContent);
    FoxDevTools.elements.storage = storageContent;

    // Ferramentas
    const toolsContent = document.createElement('div');
    toolsContent.className = 'fox-devtools-tab-content';
    toolsContent.dataset.tabContent = 'tools';
    toolsContent.innerHTML = `
      <div class="fox-devtools-section">
        <div class="fox-devtools-input-group">
          <label class="fox-devtools-label">CSS Personalizado</label>
          <textarea class="fox-devtools-input" rows="3" placeholder="Digite seu CSS aqui..."></textarea>
        </div>
        <div class="fox-devtools-button-group">
          <button class="fox-devtools-button-primary">Aplicar</button>
          <button class="fox-devtools-button-secondary">Remover</button>
        </div>
      </div>
      <div class="fox-devtools-section">
        <div class="fox-devtools-input-group">
          <label class="fox-devtools-label">Cor de Fundo</label>
          <input type="color" class="fox-devtools-input" value="#ffffff">
        </div>
        <div class="fox-devtools-button-group">
          <button class="fox-devtools-button-primary">Aplicar</button>
          <button class="fox-devtools-button-secondary">Resetar</button>
        </div>
      </div>
      <div class="fox-devtools-section">
        <div class="fox-devtools-input-group">
          <label class="fox-devtools-label">Filtros CSS</label>
          <select class="fox-devtools-input">
            <option value="none">Nenhum</option>
            <option value="grayscale(100%)">Escala de cinza</option>
            <option value="invert(100%)">Inverter cores</option>
            <option value="sepia(100%)">Sépia</option>
            <option value="blur(2px)">Desfoque</option>
            <option value="brightness(150%)">Brilho</option>
          </select>
        </div>
        <div class="fox-devtools-button-group">
          <button class="fox-devtools-button-primary">Aplicar</button>
          <button class="fox-devtools-button-secondary">Remover</button>
        </div>
      </div>
      <div class="fox-devtools-section">
        <div class="fox-devtools-input-group">
          <label class="fox-devtools-label">Ocultar Elemento</label>
          <input type="text" class="fox-devtools-input" placeholder="Seletor CSS">
        </div>
        <div class="fox-devtools-button-group">
          <button class="fox-devtools-button-primary">Ocultar</button>
          <button class="fox-devtools-button-secondary">Mostrar</button>
        </div>
      </div>
    `;
    content.appendChild(toolsContent);
    FoxDevTools.elements.tools = toolsContent;

    // Desempenho
    const performanceContent = document.createElement('div');
    performanceContent.className = 'fox-devtools-tab-content';
    performanceContent.dataset.tabContent = 'performance';
    performanceContent.innerHTML = `
      <div class="fox-devtools-section">
        <div class="fox-devtools-performance-metrics">
          <div class="fox-devtools-performance-metric">
            <div class="fox-devtools-performance-metric-label">DOMContentLoaded</div>
            <div class="fox-devtools-performance-metric-value" data-metric="dom">0ms</div>
          </div>
          <div class="fox-devtools-performance-metric">
            <div class="fox-devtools-performance-metric-label">Load Time</div>
            <div class="fox-devtools-performance-metric-value" data-metric="load">0ms</div>
          </div>
          <div class="fox-devtools-performance-metric">
            <div class="fox-devtools-performance-metric-label">Tempo Execução</div>
            <div class="fox-devtools-performance-metric-value" data-metric="runtime">0ms</div>
          </div>
          <div class="fox-devtools-performance-metric">
            <div class="fox-devtools-performance-metric-label">FPS</div>
            <div class="fox-devtools-performance-metric-value" data-metric="fps">0</div>
          </div>
        </div>
      </div>
      <div class="fox-devtools-section">
        <div class="fox-devtools-button-group">
          <button class="fox-devtools-button-primary">Atualizar</button>
        </div>
      </div>
    `;
    content.appendChild(performanceContent);
    FoxDevTools.elements.performance = performanceContent;

    // Depuração
    const debugContent = document.createElement('div');
    debugContent.className = 'fox-devtools-tab-content';
    debugContent.dataset.tabContent = 'debug';
    debugContent.innerHTML = `
      <div class="fox-devtools-section">
        <div class="fox-devtools-input-group">
          <label class="fox-devtools-label">Logs ao vivo</label>
          <div class="fox-devtools-button-group">
            <button class="fox-devtools-button-primary">Ativar</button>
            <button class="fox-devtools-button-secondary" disabled>Desativar</button>
          </div>
        </div>
      </div>
      <div class="fox-devtools-section">
        <div class="fox-devtools-console-output" style="height: 150px;"></div>
      </div>
    `;
    content.appendChild(debugContent);
    FoxDevTools.elements.debug = debugContent;

    // Atalhos
    const shortcutsContent = document.createElement('div');
    shortcutsContent.className = 'fox-devtools-tab-content';
    shortcutsContent.dataset.tabContent = 'shortcuts';
    shortcutsContent.innerHTML = `
      <div class="fox-devtools-section">
        <div class="fox-devtools-button-group" style="flex-wrap: wrap;">
          <button class="fox-devtools-button-secondary" data-action="scroll-top">Topo da Página</button>
          <button class="fox-devtools-button-secondary" data-action="reload">Recarregar</button>
          <button class="fox-devtools-button-secondary" data-action="inject-jquery">Injetar jQuery</button>
          <button class="fox-devtools-button-secondary" data-action="disable-scripts">Desativar Scripts</button>
          <button class="fox-devtools-button-secondary" data-action="copy-html">Copiar HTML</button>
        </div>
      </div>
    `;
    content.appendChild(shortcutsContent);
    FoxDevTools.elements.shortcuts = shortcutsContent;

    // Orientação
    const orientationContent = document.createElement('div');
    orientationContent.className = 'fox-devtools-tab-content';
    orientationContent.dataset.tabContent = 'orientation';
    orientationContent.innerHTML = `
      <div class="fox-devtools-section">
        <div class="fox-devtools-button-group" style="flex-wrap: wrap;">
          <button class="fox-devtools-button-secondary" data-orientation="left">Girar Esquerda</button>
          <button class="fox-devtools-button-secondary" data-orientation="right">Girar Direita</button>
          <button class="fox-devtools-button-secondary" data-orientation="upside">Inverter</button>
          <button class="fox-devtools-button-primary" data-orientation="reset">Restaurar</button>
        </div>
      </div>
    `;
    content.appendChild(orientationContent);
    FoxDevTools.elements.orientation = orientationContent;

    // Botão de tema
    const themeButton = document.createElement('button');
    themeButton.className = 'fox-devtools-button-secondary';
    themeButton.style.position = 'absolute';
    themeButton.style.top = '10px';
    themeButton.style.right = '10px';
    themeButton.innerHTML = `
      <svg width="14" height="14">
        <use xlink:href="#theme-icon"></use>
      </svg>
    `;
    panel.querySelector('.fox-devtools-header').appendChild(themeButton);
  };

  // Configurar eventos
  const setupEvents = () => {
    // Botão flutuante
    FoxDevTools.elements.button.addEventListener('click', () => {
      const panel = FoxDevTools.elements.panel;
      panel.classList.toggle('visible');
    });

    // Fechar painel
    FoxDevTools.elements.panel.querySelector('.fox-devtools-close').addEventListener('click', () => {
      FoxDevTools.elements.panel.classList.remove('visible');
    });

    // Alternar abas
    const tabs = FoxDevTools.elements.panel.querySelectorAll('.fox-devtools-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remover classe active de todas as abas e conteúdos
        tabs.forEach(t => t.classList.remove('active'));
        FoxDevTools.elements.panel.querySelectorAll('.fox-devtools-tab-content').forEach(content => {
          content.classList.remove('active');
        });

        // Adicionar classe active à aba clicada e seu conteúdo
        tab.classList.add('active');
        const tabName = tab.dataset.tab;
        FoxDevTools.elements.panel.querySelector(`.fox-devtools-tab-content[data-tab-content="${tabName}"]`).classList.add('active');
      });
    });

    // Alternar abas de armazenamento
    const storageTabs = FoxDevTools.elements.storage.querySelectorAll('[data-storage-tab]');
    storageTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        storageTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const tabName = tab.dataset.storageTab;
        FoxDevTools.elements.storage.querySelectorAll('[data-storage-content]').forEach(content => {
          content.style.display = content.dataset.storageContent === tabName ? 'block' : 'none';
        });

        // Atualizar dados da aba selecionada
        updateStorageData(tabName);
      });
    });

    // Console - Executar comando
    const consoleInput = FoxDevTools.elements.console.querySelector('.fox-devtools-console-input-field');
    const consoleExecute = FoxDevTools.elements.console.querySelector('.fox-devtools-button-primary');
    
    consoleExecute.addEventListener('click', () => {
      executeConsoleCommand(consoleInput.value);
      consoleInput.value = '';
    });

    consoleInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        executeConsoleCommand(consoleInput.value);
        consoleInput.value = '';
      }
    });

    // Console - Limpar
    FoxDevTools.elements.console.querySelector('.fox-devtools-button-secondary').addEventListener('click', () => {
      FoxDevTools.elements.console.querySelector('.fox-devtools-console-output').innerHTML = '';
    });

    // Auto Clicker - Iniciar/Parar
    const autoClickerStart = FoxDevTools.elements.autoClicker.querySelector('.fox-devtools-button-primary');
    const autoClickerStop = FoxDevTools.elements.autoClicker.querySelector('.fox-devtools-button-danger');
    const autoClickerStatus = FoxDevTools.elements.autoClicker.querySelector('.fox-devtools-status');
    
    autoClickerStart.addEventListener('click', () => {
      const selector = FoxDevTools.elements.autoClicker.querySelector('input[type="text"]').value;
      const interval = parseInt(FoxDevTools.elements.autoClicker.querySelector('input[type="number"]').value);
      
      if (!selector) {
        logToConsole('Erro: Seletor CSS não informado', 'error');
        return;
      }
      
      if (interval < 100) {
        logToConsole('Erro: Intervalo mínimo é 100ms', 'error');
        return;
      }
      
      startAutoClicker(selector, interval);
      autoClickerStart.disabled = true;
      autoClickerStop.disabled = false;
      autoClickerStatus.textContent = 'Status: Clicando a cada ' + interval + 'ms';
      autoClickerStatus.style.color = 'var(--success-color)';
    });
    
    autoClickerStop.addEventListener('click', () => {
      stopAutoClicker();
      autoClickerStart.disabled = false;
      autoClickerStop.disabled = true;
      autoClickerStatus.textContent = 'Status: Inativo';
      autoClickerStatus.style.color = 'var(--text-secondary)';
    });

    // Inspetor - Ativar/Desativar
    const inspectorButton = FoxDevTools.elements.inspector.querySelector('.fox-devtools-button-primary');
    const inspectorStatus = FoxDevTools.elements.inspector.querySelector('.fox-devtools-status');
    const inspectorInfo = FoxDevTools.elements.inspector.querySelector('.fox-devtools-inspector-info');
    
    inspectorButton.addEventListener('click', () => {
      FoxDevTools.settings.inspectorMode = !FoxDevTools.settings.inspectorMode;
      
      if (FoxDevTools.settings.inspectorMode) {
        inspectorButton.textContent = 'Desativar Inspetor';
        inspectorStatus.textContent = 'Status: Ativo - Clique em qualquer elemento';
        inspectorStatus.style.color = 'var(--success-color)';
        document.body.style.cursor = 'crosshair';
        
        // Adicionar evento de clique na página
        document.addEventListener('click', inspectElementHandler, true);
      } else {
        inspectorButton.textContent = 'Ativar Inspetor';
        inspectorStatus.textContent = 'Status: Desativado';
        inspectorStatus.style.color = 'var(--text-secondary)';
        document.body.style.cursor = '';
        inspectorInfo.style.display = 'none';
        
        // Remover evento de clique
        document.removeEventListener('click', inspectElementHandler, true);
      }
    });

    // Armazenamento - Adicionar item
    FoxDevTools.elements.storage.querySelectorAll('[data-storage-content]').forEach(content => {
      const addButton = content.querySelector('.fox-devtools-button-secondary');
      const clearButton = content.querySelector('.fox-devtools-button-danger');
      
      addButton.addEventListener('click', () => {
        const tabName = content.dataset.storageContent;
        addStorageItem(tabName);
      });
      
      clearButton.addEventListener('click', () => {
        const tabName = content.dataset.storageContent;
        clearStorage(tabName);
      });
    });

    // Ferramentas - Aplicar CSS
    const cssTextarea = FoxDevTools.elements.tools.querySelector('textarea');
    const applyCssButton = FoxDevTools.elements.tools.querySelector('.fox-devtools-button-primary');
    const removeCssButton = FoxDevTools.elements.tools.querySelector('.fox-devtools-button-secondary');
    
    applyCssButton.addEventListener('click', () => {
      const css = cssTextarea.value;
      if (css) {
        applyCustomCSS(css);
        logToConsole('CSS personalizado aplicado', 'info');
      }
    });
    
    removeCssButton.addEventListener('click', () => {
      removeCustomCSS();
      cssTextarea.value = '';
      logToConsole('CSS personalizado removido', 'info');
    });

    // Ferramentas - Cor de fundo
    const colorInput = FoxDevTools.elements.tools.querySelector('input[type="color"]');
    const applyColorButton = FoxDevTools.elements.tools.querySelectorAll('.fox-devtools-button-primary')[1];
    const resetColorButton = FoxDevTools.elements.tools.querySelectorAll('.fox-devtools-button-secondary')[1];
    
    applyColorButton.addEventListener('click', () => {
      document.body.style.backgroundColor = colorInput.value;
      logToConsole(`Cor de fundo alterada para ${colorInput.value}`, 'info');
    });
    
    resetColorButton.addEventListener('click', () => {
      document.body.style.backgroundColor = '';
      colorInput.value = '#ffffff';
      logToConsole('Cor de fundo resetada', 'info');
    });

    // Ferramentas - Filtros CSS
    const filterSelect = FoxDevTools.elements.tools.querySelector('select');
    const applyFilterButton = FoxDevTools.elements.tools.querySelectorAll('.fox-devtools-button-primary')[2];
    const removeFilterButton = FoxDevTools.elements.tools.querySelectorAll('.fox-devtools-button-secondary')[2];
    
    applyFilterButton.addEventListener('click', () => {
      document.body.style.filter = filterSelect.value;
      logToConsole(`Filtro CSS aplicado: ${filterSelect.value}`, 'info');
    });
    
    removeFilterButton.addEventListener('click', () => {
      document.body.style.filter = '';
      logToConsole('Filtro CSS removido', 'info');
    });

    // Ferramentas - Ocultar elemento
    const hideInput = FoxDevTools.elements.tools.querySelectorAll('input[type="text"]')[1];
    const hideButton = FoxDevTools.elements.tools.querySelectorAll('.fox-devtools-button-primary')[3];
    const showButton = FoxDevTools.elements.tools.querySelectorAll('.fox-devtools-button-secondary')[3];
    
    hideButton.addEventListener('click', () => {
      const selector = hideInput.value;
      if (selector) {
        document.querySelectorAll(selector).forEach(el => {
          el.style.display = 'none';
        });
        logToConsole(`Elemento(s) com seletor "${selector}" ocultado(s)`, 'info');
      }
    });
    
    showButton.addEventListener('click', () => {
      const selector = hideInput.value;
      if (selector) {
        document.querySelectorAll(selector).forEach(el => {
          el.style.display = '';
        });
        logToConsole(`Elemento(s) com seletor "${selector}" mostrado(s)`, 'info');
      }
    });

    // Desempenho - Atualizar
    FoxDevTools.elements.performance.querySelector('.fox-devtools-button-primary').addEventListener('click', () => {
      updatePerformanceMetrics();
    });

    // Depuração - Ativar logs
    const enableLogsButton = FoxDevTools.elements.debug.querySelector('.fox-devtools-button-primary');
    const disableLogsButton = FoxDevTools.elements.debug.querySelector('.fox-devtools-button-secondary');
    
    enableLogsButton.addEventListener('click', () => {
      startLogCapture();
      enableLogsButton.disabled = true;
      disableLogsButton.disabled = false;
      logToConsole('Captura de logs ativada', 'info');
    });
    
    disableLogsButton.addEventListener('click', () => {
      stopLogCapture();
      enableLogsButton.disabled = false;
      disableLogsButton.disabled = true;
      logToConsole('Captura de logs desativada', 'info');
    });

    // Atalhos
    FoxDevTools.elements.shortcuts.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        executeShortcut(action);
      });
    });

    // Orientação
    FoxDevTools.elements.orientation.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        const orientation = button.dataset.orientation;
        rotateScreen(orientation);
      });
    });

    // Tema
    FoxDevTools.elements.panel.querySelector('.fox-devtools-header button:last-child').addEventListener('click', () => {
      toggleTheme();
    });
  };

  // Funções auxiliares
  const logToConsole = (message, type = 'log') => {
    const consoleOutput = FoxDevTools.elements.console.querySelector('.fox-devtools-console-output');
    const entry = document.createElement('div');
    entry.className = `fox-devtools-console-entry ${type}`;
    entry.textContent = message;
    consoleOutput.appendChild(entry);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
    
    // Também logar no console real
    if (type === 'log') console.log(message);
    else if (type === 'info') console.info(message);
    else if (type === 'warn') console.warn(message);
    else if (type === 'error') console.error(message);
  };

  const executeConsoleCommand = (command) => {
    if (!command) return;
    
    try {
      // Logar o comando
      logToConsole(`> ${command}`, 'log');
      
      // Executar e logar o resultado
      const result = eval(command);
      if (result !== undefined) {
        logToConsole(result, 'info');
      }
    } catch (error) {
      logToConsole(error.message, 'error');
    }
  };

  const startAutoClicker = (selector, interval) => {
    stopAutoClicker(); // Parar qualquer intervalo existente
    
    FoxDevTools.settings.autoClickerInterval = setInterval(() => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach(el => {
          el.click();
          logToConsole(`Clicando em elemento: ${selector}`, 'info');
        });
      } else {
        logToConsole(`Nenhum elemento encontrado com o seletor: ${selector}`, 'warn');
      }
    }, interval);
  };

  const stopAutoClicker = () => {
    if (FoxDevTools.settings.autoClickerInterval) {
      clearInterval(FoxDevTools.settings.autoClickerInterval);
      FoxDevTools.settings.autoClickerInterval = null;
    }
  };

  const inspectElementHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.target;
    const inspectorInfo = FoxDevTools.elements.inspector.querySelector('.fox-devtools-inspector-info');
    const computedStyle = window.getComputedStyle(element);
    
    // Preencher informações
    FoxDevTools.elements.inspector.querySelector('[data-property="tag"]').textContent = element.tagName.toLowerCase();
    FoxDevTools.elements.inspector.querySelector('[data-property="id"]').textContent = element.id || 'Nenhum';
    FoxDevTools.elements.inspector.querySelector('[data-property="classes"]').textContent = element.className || 'Nenhuma';
    FoxDevTools.elements.inspector.querySelector('[data-property="text"]').textContent = element.textContent.trim() || 'Nenhum';
    
    // CSS computado
    FoxDevTools.elements.inspector.querySelector('[data-css="display"]').textContent = computedStyle.display;
    FoxDevTools.elements.inspector.querySelector('[data-css="color"]').textContent = computedStyle.color;
    FoxDevTools.elements.inspector.querySelector('[data-css="font-size"]').textContent = computedStyle.fontSize;
    FoxDevTools.elements.inspector.querySelector('[data-css="background"]').textContent = computedStyle.background || computedStyle.backgroundColor;
    
    // Mostrar informações
    inspectorInfo.style.display = 'block';
    
    // Destacar elemento
    const prevOutline = element.style.outline;
    const prevOutlineOffset = element.style.outlineOffset;
    element.style.outline = '2px solid var(--primary-color)';
    element.style.outlineOffset = '2px';
    
    // Remover destaque após 2 segundos
    setTimeout(() => {
      element.style.outline = prevOutline;
      element.style.outlineOffset = prevOutlineOffset;
    }, 2000);
    
    return false;
  };

  const updateStorageData = (type) => {
    let data = [];
    const tbody = FoxDevTools.elements.storage.querySelector(`[data-storage-content="${type}"] tbody`);
    tbody.innerHTML = '';
    
    if (type === 'local') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data.push({ key, value: localStorage.getItem(key) });
      }
    } else if (type === 'session') {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        data.push({ key, value: sessionStorage.getItem(key) });
      }
    } else if (type === 'cookies') {
      data = document.cookie.split(';').map(cookie => {
        const [key, value] = cookie.trim().split('=');
        return { key, value: decodeURIComponent(value) };
      });
    }
    
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.key}</td>
        <td>${item.value}</td>
        <td>
          <div class="fox-devtools-storage-actions">
            <button class="fox-devtools-storage-edit" data-key="${item.key}">Editar</button>
            <button class="fox-devtools-storage-delete" data-key="${item.key}">Excluir</button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });
    
    // Configurar eventos de edição/exclusão
    tbody.querySelectorAll('.fox-devtools-storage-edit').forEach(button => {
      button.addEventListener('click', () => {
        const key = button.dataset.key;
        const newValue = prompt(`Editar valor para "${key}"`, data.find(item => item.key === key).value);
        if (newValue !== null) {
          if (type === 'local') localStorage.setItem(key, newValue);
          else if (type === 'session') sessionStorage.setItem(key, newValue);
          else if (type === 'cookies') setCookie(key, newValue);
          updateStorageData(type);
        }
      });
    });
    
    tbody.querySelectorAll('.fox-devtools-storage-delete').forEach(button => {
      button.addEventListener('click', () => {
        const key = button.dataset.key;
        if (confirm(`Excluir "${key}"?`)) {
          if (type === 'local') localStorage.removeItem(key);
          else if (type === 'session') sessionStorage.removeItem(key);
          else if (type === 'cookies') deleteCookie(key);
          updateStorageData(type);
        }
      });
    });
  };

  const addStorageItem = (type) => {
    const key = prompt('Chave:');
    if (!key) return;
    
    const value = prompt('Valor:');
    if (value === null) return;
    
    if (type === 'local') localStorage.setItem(key, value);
    else if (type === 'session') sessionStorage.setItem(key, value);
    else if (type === 'cookies') setCookie(key, value);
    
    updateStorageData(type);
    logToConsole(`${type === 'cookies' ? 'Cookie' : 'Item'} adicionado: ${key}=${value}`, 'info');
  };

  const clearStorage = (type) => {
    if (confirm(`Limpar todos os ${type === 'cookies' ? 'cookies' : 'itens'}?`)) {
      if (type === 'local') localStorage.clear();
      else if (type === 'session') sessionStorage.clear();
      else if (type === 'cookies') clearCookies();
      
      updateStorageData(type);
      logToConsole(`${type === 'cookies' ? 'Cookies' : 'Armazenamento'} limpo`, 'info');
    }
  };

  const setCookie = (name, value, days = 365) => {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
  };

  const deleteCookie = (name) => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  };

  const clearCookies = () => {
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      deleteCookie(name);
    });
  };

  const applyCustomCSS = (css) => {
    // Remover CSS anterior se existir
    removeCustomCSS();
    
    // Criar nova tag de estilo
    const style = document.createElement('style');
    style.id = 'fox-devtools-custom-css';
    style.textContent = css;
    document.head.appendChild(style);
  };

  const removeCustomCSS = () => {
    const existingStyle = document.getElementById('fox-devtools-custom-css');
    if (existingStyle) {
      existingStyle.remove();
    }
  };

  const updatePerformanceMetrics = () => {
    const now = performance.now();
    const metrics = FoxDevTools.settings.performanceMetrics;
    
    // Tempo de carregamento
    if (!metrics.domContentLoaded && document.readyState === 'complete') {
      metrics.domContentLoaded = now - metrics.startTime;
      FoxDevTools.elements.performance.querySelector('[data-metric="dom"]').textContent = 
        Math.round(metrics.domContentLoaded) + 'ms';
    }
    
    // Tempo total (aproximado)
    FoxDevTools.elements.performance.querySelector('[data-metric="runtime"]').textContent = 
      Math.round(now - metrics.startTime) + 'ms';
    
    // FPS (estimativa simples)
    if (!FoxDevTools.lastFrameTime) {
      FoxDevTools.lastFrameTime = now;
      FoxDevTools.frameCount = 0;
    } else {
      FoxDevTools.frameCount++;
      if (now - FoxDevTools.lastFrameTime >= 1000) {
        const fps = Math.round((FoxDevTools.frameCount * 1000) / (now - FoxDevTools.lastFrameTime));
        FoxDevTools.elements.performance.querySelector('[data-metric="fps"]').textContent = fps;
        FoxDevTools.lastFrameTime = now;
        FoxDevTools.frameCount = 0;
      }
    }
  };

  const startLogCapture = () => {
    // Salvar referências originais
    FoxDevTools.originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error
    };
    
    // Sobrescrever métodos do console
    console.log = function() {
      FoxDevTools.originalConsole.log.apply(console, arguments);
      logToConsole(Array.from(arguments).join(' '), 'log');
    };
    
    console.info = function() {
      FoxDevTools.originalConsole.info.apply(console, arguments);
      logToConsole(Array.from(arguments).join(' '), 'info');
    };
    
    console.warn = function() {
      FoxDevTools.originalConsole.warn.apply(console, arguments);
      logToConsole(Array.from(arguments).join(' '), 'warn');
    };
    
    console.error = function() {
      FoxDevTools.originalConsole.error.apply(console, arguments);
      logToConsole(Array.from(arguments).join(' '), 'error');
    };
    
    // Capturar erros globais
    FoxDevTools.originalErrorHandler = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      logToConsole(`${message} (${source}:${lineno}:${colno})`, 'error');
      if (FoxDevTools.originalErrorHandler) {
        return FoxDevTools.originalErrorHandler(message, source, lineno, colno, error);
      }
    };
  };

  const stopLogCapture = () => {
    // Restaurar métodos originais
    if (FoxDevTools.originalConsole) {
      console.log = FoxDevTools.originalConsole.log;
      console.info = FoxDevTools.originalConsole.info;
      console.warn = FoxDevTools.originalConsole.warn;
      console.error = FoxDevTools.originalConsole.error;
    }
    
    // Restaurar handler de erros
    if (FoxDevTools.originalErrorHandler) {
      window.onerror = FoxDevTools.originalErrorHandler;
    }
  };

  const executeShortcut = (action) => {
    switch (action) {
      case 'scroll-top':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        logToConsole('Rolado para o topo da página', 'info');
        break;
      case 'reload':
        location.reload();
        break;
      case 'inject-jquery':
        if (typeof jQuery === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
          script.onload = () => logToConsole('jQuery injetado com sucesso', 'info');
          script.onerror = () => logToConsole('Falha ao injetar jQuery', 'error');
          document.head.appendChild(script);
        } else {
          logToConsole('jQuery já está disponível', 'info');
        }
        break;
      case 'disable-scripts':
        document.querySelectorAll('script').forEach(script => {
          if (!script.src && script.textContent) {
            script.textContent = '';
          } else if (script.src) {
            script.remove();
          }
        });
        logToConsole('Todos os scripts da página foram desativados', 'info');
        break;
      case 'copy-html':
        if (FoxDevTools.lastInspectedElement) {
          navigator.clipboard.writeText(FoxDevTools.lastInspectedElement.outerHTML)
            .then(() => logToConsole('HTML copiado para a área de transferência', 'info'))
            .catch(() => logToConsole('Falha ao copiar HTML', 'error'));
        } else {
          logToConsole('Nenhum elemento inspecionado recentemente', 'warn');
        }
        break;
    }
  };

  const rotateScreen = (orientation) => {
    const body = document.body;
    
    // Resetar transformações anteriores
    body.style.transform = '';
    body.style.width = '';
    body.style.height = '';
    body.style.margin = '';
    
    switch (orientation) {
      case 'left':
        body.style.transform = 'rotate(-90deg)';
        body.style.transformOrigin = 'center center';
        body.style.width = '100vh';
        body.style.height = '100vw';
        body.style.margin = `calc((100vh - 100vw) / 2) calc((100vw - 100vh) / 2)`;
        logToConsole('Tela girada para a esquerda', 'info');
        break;
      case 'right':
        body.style.transform = 'rotate(90deg)';
        body.style.transformOrigin = 'center center';
        body.style.width = '100vh';
        body.style.height = '100vw';
        body.style.margin = `calc((100vh - 100vw) / 2) calc((100vw - 100vh) / 2)`;
        logToConsole('Tela girada para a direita', 'info');
        break;
      case 'upside':
        body.style.transform = 'rotate(180deg)';
        logToConsole('Tela invertida', 'info');
        break;
      case 'reset':
        default:
        logToConsole('Orientação da tela restaurada', 'info');
        break;
    }
  };

  const toggleTheme = () => {
    const panel = FoxDevTools.elements.panel;
    panel.classList.toggle('light');
    
    const newTheme = panel.classList.contains('light') ? 'light' : 'dark';
    FoxDevTools.settings.theme = newTheme;
    
    // Salvar preferência
    localStorage.setItem('fox-devtools-theme', newTheme);
    logToConsole(`Tema alterado para ${newTheme}`, 'info');
  };

  // Inicialização
  const init = () => {
    if (FoxDevTools.initialized) return;
    
    // Carregar recursos
    loadResources();
    
    // Criar UI
    createUI();
    
    // Configurar eventos
    setupEvents();
    
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('fox-devtools-theme');
    if (savedTheme === 'light') {
      FoxDevTools.elements.panel.classList.add('light');
      FoxDevTools.settings.theme = 'light';
    }
    
    // Iniciar métricas de desempenho
    updatePerformanceMetrics();
    setInterval(updatePerformanceMetrics, 1000);
    
    // Capturar eventos de carregamento da página
    document.addEventListener('DOMContentLoaded', () => {
      const time = performance.now() - FoxDevTools.settings.performanceMetrics.startTime;
      FoxDevTools.settings.performanceMetrics.domContentLoaded = time;
      FoxDevTools.elements.performance.querySelector('[data-metric="dom"]').textContent = 
        Math.round(time) + 'ms';
    });
    
    window.addEventListener('load', () => {
      const time = performance.now() - FoxDevTools.settings.performanceMetrics.startTime;
      FoxDevTools.settings.performanceMetrics.loadTime = time;
      FoxDevTools.elements.performance.querySelector('[data-metric="load"]').textContent = 
        Math.round(time) + 'ms';
    });
    
    // Inicialização completa
    FoxDevTools.initialized = true;
    logToConsole('FoxDevTools inicializado', 'info');
  };

  // Iniciar quando o DOM estiver pronto
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 1);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
