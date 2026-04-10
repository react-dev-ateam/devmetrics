/**
 * DevMetrics Embed SDK
 * Supports iframe and WebView integrations
 */

export interface EmbedConfig {
  apiUrl: string;
  theme?: 'light' | 'dark';
  compact?: boolean;
  onEvent?: (event: EmbedEvent) => void;
}

export interface EmbedEvent {
  type: string;
  data?: unknown;
}

export interface DevMetricsEmbed {
  ready(): Promise<void>;
  setTheme(theme: 'light' | 'dark'): void;
  refresh(): void;
  destroy(): void;
  on(event: string, handler: (data: unknown) => void): void;
  off(event: string, handler: (data: unknown) => void): void;
  emitBusinessEvent(type: string, data: unknown): void;
}

/**
 * Detect if running in an iframe
 */
function isIframe(): boolean {
  try {
    return typeof window !== 'undefined' && window !== window.parent;
  } catch {
    return false;
  }
}

interface WindowWithWebView extends Window {
  ReactNativeWebView?: {
    postMessage(message: string): void;
  };
}

/**
 * Detect if running in a React Native WebView
 */
function isWebView(): boolean {
  return typeof window !== "undefined" && (window as WindowWithWebView).ReactNativeWebView !== undefined;
}

/**
 * Detect the execution environment
 */
function detectEnvironment(): 'iframe' | 'webview' | 'browser' {
  if (isIframe()) return 'iframe';
  if (isWebView()) return 'webview';
  return 'browser';
}

/**
 * Create a DevMetrics embed instance
 */
function createEmbed(element: HTMLElement, config: EmbedConfig): DevMetricsEmbed {
  const environment = detectEnvironment();
  const eventListeners = new Map<string, Set<(data: unknown) => void>>();
  let isReady = false;

  const emit = (event: EmbedEvent) => {
    if (config.onEvent) {
      config.onEvent(event);
    }

    const handlers = eventListeners.get(event.type);
    if (handlers) {
      handlers.forEach((handler) => handler(event.data));
    }

    // Bridge communication
    if (environment === 'webview' && (window as WindowWithWebView).ReactNativeWebView) {
      (window as WindowWithWebView).ReactNativeWebView!.postMessage(JSON.stringify(event));
    } else if (environment === 'iframe') {
      window.parent.postMessage(event, '*');
    }
  };

  const instance = {
    async ready() {
      return new Promise<void>((resolve) => {
        if (isReady) {
          resolve();
          return;
        }

        // Guard: if an iframe already exists (e.g. React StrictMode double-invoke),
        // mark as ready and bail out without appending a second iframe.
        const existingIframe = element.querySelector('iframe');
        if (existingIframe) {
          isReady = true;
          resolve();
          return;
        }

        // Build embed URL — if apiUrl already ends with an embed path, use it directly.
        // Otherwise append the correct embed route.
        let url: string;
        const apiBase = config.apiUrl.replace(/\/$/, ''); // strip trailing slash

        if (apiBase.includes('/embed/')) {
          // User passed a full embed URL like https://app.com/embed/webview
          url = apiBase;
        } else if (isWebView()) {
          url = `${apiBase}/embed/webview`;
        } else {
          url = `${apiBase}/embed/widget`;
        }

        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';

        element.appendChild(iframe);

        iframe.onload = () => {
          isReady = true;
          emit({
            type: 'embed:ready',
            data: { environment, apiUrl: config.apiUrl },
          });
          resolve();
        };
      });
    },

    setTheme(theme: 'light' | 'dark') {
      emit({
        type: 'theme:change',
        data: { theme },
      });
      element.classList.toggle('dark', theme === 'dark');
    },

    refresh() {
      const iframe = element.querySelector('iframe');
      if (iframe) {
        iframe.src = iframe.src;
      }
    },

    emitBusinessEvent(type: string, data: unknown) {
      emit({ type, data });
    },

    destroy() {
      element.innerHTML = '';
      eventListeners.clear();
      element.removeAttribute('data-devmetrics-embed');
    },

    on(event: string, handler: (data: unknown) => void) {
      if (!eventListeners.has(event)) {
        eventListeners.set(event, new Set());
      }
      eventListeners.get(event)!.add(handler);
    },

    off(event: string, handler: (data: unknown) => void) {
      const handlers = eventListeners.get(event);
      if (handlers) {
        handlers.delete(handler);
      }
    },
  };

  return instance;
}

/**
 * Initialize a DevMetrics embed
 */
export function init(selector: string, config: EmbedConfig): DevMetricsEmbed {
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) {
    throw new Error(`Element with selector "${selector}" not found`);
  }

  element.setAttribute('data-devmetrics-embed', '');
  element.style.overflow = 'hidden';

  if (config.theme) {
    element.classList.toggle('dark', config.theme === 'dark');
  }

  const embed = createEmbed(element, config);

  // Auto-trigger ready for immediate loading
  embed.ready();

  return embed;
}

/**
 * Auto-initialize embeds
 */
export function autoInit(config: Omit<EmbedConfig, 'apiUrl'> & { apiUrl?: string }) {
  const apiUrl = config.apiUrl || 'https://devmetrics-mock-api-production-5ed8.up.railway.app';

  const elements = document.querySelectorAll('[data-devmetrics]');
  elements.forEach((element) => {
    const selector = (element as HTMLElement).getAttribute('data-devmetrics') || '';
    if (selector) {
      init(selector, { ...config, apiUrl });
    }
  });
}

// Auto-initialize if data attribute is present
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('[data-devmetrics-auto]')) {
      autoInit({});
    }
  });
}

const devMetrics = {
  init,
  autoInit,
  isIframe,
  isWebView,
  detectEnvironment,
};

export default devMetrics;
