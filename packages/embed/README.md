# @devmetrics/embed

Universal SDK for embedding the DevMetrics Dashboard into any web or mobile application.

## Installation

```bash
npm install @devmetrics/embed
# or
yarn add @devmetrics/embed
```

## Quick Start (React / ESM)

```typescript
import { init } from '@devmetrics/embed';

const dashboard = init('#dashboard-container', {
  apiUrl: 'https://your-devmetrics-source.com',
  theme: 'dark'
});

// React to system events
dashboard.on('metrics:deployment_success', (data) => {
  console.log('Deploy successful:', data);
});
```

## Vanilla JS Integration

Ideal for non-React environments or static sites.

```html
<div id="metrics-widget" style="width: 100%; height: 500px;"></div>

<script src="https://unpkg.com/@devmetrics/embed/dist/index.global.js"></script>
<script>
  DevMetrics.init('#metrics-widget', {
    apiUrl: 'https://api.devmetrics.io',
    compact: true
  });
</script>
```

## Advanced Features

### Host Communication Bridge
Communicate across the iframe/WebView boundary using the built-in bridge.

```typescript
// From the host to the dashboard
dashboard.emitBusinessEvent('cart:checkout', { items: [...] });

// Listening for bridge events in the host
window.addEventListener('message', (event) => {
  if (event.data.type === 'metrics:service_alert') {
    showToast(event.data.message);
  }
});
```

### Automatic Environment Optimization
The SDK automatically detects the environment and renders the optimized layout:
- **Iframes**: Renders a compact, no-navigation layout.
- **WebViews**: Renders a touch-optimized layout with safe-area inset protection for iOS/Android.

## Publishing

Ensure you have built the artifacts before publishing:

```bash
npm run build
npm publish --access public
```
