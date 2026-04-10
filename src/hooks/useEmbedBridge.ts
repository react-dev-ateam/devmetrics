"use client";

import { useEffect, useCallback } from "react";

export interface BridgeEvent {
  type: string;
  data?: unknown;
}

interface WindowWithWebView extends Window {
  ReactNativeWebView?: {
    postMessage(message: string): void;
  };
}

export function useEmbedBridge() {
  const emit = useCallback((event: BridgeEvent) => {
    // 1. Detect environment
    const isIframe = window !== window.parent;
    const webViewWindow = window as WindowWithWebView;
    const isWebView = webViewWindow.ReactNativeWebView !== undefined;

    // 2. Transmit based on host
    if (isWebView) {
      webViewWindow.ReactNativeWebView!.postMessage(JSON.stringify(event));
    } else if (isIframe) {
      window.parent.postMessage(event, "*");
    }
    
    // 3. Local log for debugging
    if (process.env.NODE_ENV === "development") {
      console.log(`[Bridge] Emitted ${event.type}`, event.data);
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data as BridgeEvent;
      if (message?.type === "embed:ping") {
        emit({ type: "embed:pong", data: { timestamp: Date.now() } });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [emit]);

  return { emit };
}
