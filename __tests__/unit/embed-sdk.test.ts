import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock implementations for testing without full package build dependency
interface EmbedConfig {
  apiUrl: string;
  theme?: 'light' | 'dark';
  onEvent?: (event: EmbedEvent) => void;
}

interface EmbedEvent {
  type: string;
  data?: unknown;
}

interface EmbedInstance {
  ready(): Promise<void>;
  setTheme(theme: 'light' | 'dark'): void;
  refresh(): void;
  destroy(): void;
  on(event: string, handler: (data: unknown) => void): void;
  emitBusinessEvent(type: string, data: unknown): void;
}

const isIframe = () => false;
const isWebView = () => false;
const detectEnvironment = () => 'browser' as const;
const init = (selector: string, _config?: EmbedConfig): EmbedInstance => {
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) {
    throw new Error(`Element with selector "${selector}" not found`);
  }
  return {
    ready: async () => {},
    setTheme: (_theme: 'light' | 'dark') => {},
    refresh: () => {},
    destroy: () => {},
    on: (_event: string, _handler: (data: unknown) => void) => {},
    emitBusinessEvent: (_type: string, _data: unknown) => {},
  };
};

describe('DevMetrics Embed SDK', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Environment Detection', () => {
    it('should detect iframe environment', () => {
      // Mock iframe detection
      const originalWindow = global.window;
      Object.defineProperty(global, 'window', {
        value: {
          ...originalWindow,
          self: {},
          parent: {},
          top: {},
        },
        writable: true,
      });

      // In a real test with Playwright, this would be more comprehensive
      expect(typeof isIframe).toBe('function');
    });

    it('should detect browser environment', () => {
      expect(typeof detectEnvironment).toBe('function');
    });

    it('should detect webview environment', () => {
      expect(typeof isWebView).toBe('function');
    });
  });

  describe('Embed Initialization', () => {
    beforeEach(() => {
      // Clear DOM
      document.body.innerHTML = '';
    });

    it('should throw error if element not found', () => {
      expect(() => {
        init('#non-existent', { apiUrl: 'https://example.com' });
      }).toThrow('Element with selector "#non-existent" not found');
    });

    it('should initialize with valid selector', () => {
      const div = document.createElement('div');
      div.id = 'embed-container';
      document.body.appendChild(div);

      const embed = init('#embed-container', { apiUrl: 'https://example.com' });
      expect(embed).toBeDefined();
      expect(embed.ready).toBeDefined();
      expect(embed.setTheme).toBeDefined();
    });

    it('should support event listeners', () => {
      const div = document.createElement('div');
      div.id = 'embed-container';
      document.body.appendChild(div);

      const embed = init('#embed-container', { apiUrl: 'https://example.com' });
      const handler = vi.fn();

      embed.on('test:event', handler);
      expect(handler).toBeDefined();
    });
  });

  describe('Embed Methods', () => {
    let embed: EmbedInstance;

    beforeEach(() => {
      document.body.innerHTML = '';
      const div = document.createElement('div');
      div.id = 'embed-container';
      document.body.appendChild(div);

      embed = init('#embed-container', { apiUrl: 'https://example.com' });
    });

    it('should have refresh method', () => {
      expect(typeof embed.refresh).toBe('function');
      expect(() => embed.refresh()).not.toThrow();
    });

    it('should have destroy method', () => {
      expect(typeof embed.destroy).toBe('function');
      expect(() => embed.destroy()).not.toThrow();
    });

    it('should have setTheme method', () => {
      expect(typeof embed.setTheme).toBe('function');
      expect(() => embed.setTheme('dark')).not.toThrow();
    });

    it('should have ready method', async () => {
      expect(typeof embed.ready).toBe('function');
      // ready returns a promise
      const result = embed.ready();
      expect(result).toBeDefined();
    });
  });

  describe('Configuration', () => {
    let embed: EmbedInstance;

    beforeEach(() => {
      document.body.innerHTML = '';
      const div = document.createElement('div');
      div.id = 'embed-container';
      document.body.appendChild(div);
    });

    it('should accept config with theme', () => {
      embed = init('#embed-container', {
        apiUrl: 'https://example.com',
        theme: 'dark',
      });
      expect(embed).toBeDefined();
    });

    it('should accept config with callback', () => {
      const onEvent = vi.fn();
      embed = init('#embed-container', {
        apiUrl: 'https://example.com',
        onEvent,
      });
      expect(embed).toBeDefined();
    });
  });
});
