declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (
      command: 'event' | 'config' | 'js' | 'set',
      targetOrEventName: string | Date,
      params?: Record<string, unknown>
    ) => void;
  }
}

export function pushDataLayerEvent(
  eventName: string,
  params: Record<string, unknown> = {}
): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}
