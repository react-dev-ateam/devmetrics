import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: { type: string; [key: string]: unknown }) => {
        // Send actual SSE event name if type is available
        if (data.type) {
          controller.enqueue(encoder.encode(`event: ${data.type}\n`));
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Initial stats
      sendEvent({
        type: "metric_update",
        success_rate: 97.2,
        active_deployments: 3,
        ts: Date.now(),
      });

      const events = [
        () => ({
          type: "metric_update",
          success_rate: (95 + Math.random() * 4).toFixed(1),
          active_deployments: Math.floor(Math.random() * 5),
          ts: Date.now(),
        }),
        () => ({
          type: "deployment_started",
          service: "api-gateway",
          environment: "production",
          ts: Date.now(),
        }),
        () => ({
          type: "deployment_success",
          service: "api-gateway",
          duration_ms: 70000 + Math.floor(Math.random() * 10000),
          ts: Date.now(),
        }),
        () => ({
          type: "build_failed",
          service: "payments-v2",
          error: "TypeScript error in gateway.ts:88",
          ts: Date.now(),
        }),
        () => ({
          type: "service_alert",
          severity: "high",
          service: "payments-v2",
          message: "p99 latency 840ms",
          ts: Date.now(),
        }),
      ];

      let counter = 0;
      const interval = setInterval(() => {
        const event = events[counter % events.length]();
        sendEvent(event);
        counter++;
      }, 3000);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
