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

export type DocumentType = 'biodata' | 'resume';

export interface FileDownloadEventParams {
  documentType: DocumentType;
  fileName: string;
  downloadVariant: 'free_sample' | 'hd_pdf';
  downloadMethod?: 'promo_code' | 'upi_payment';
  templateId: string;
  language: string;
}

export function trackFileDownloadEvent({
  documentType,
  fileName,
  downloadVariant,
  downloadMethod,
  templateId,
  language,
}: FileDownloadEventParams): void {
  pushDataLayerEvent('file_download', {
    document_type: documentType,
    file_name: fileName,
    file_extension: 'pdf',
    download_variant: downloadVariant,
    ...(downloadMethod ? { download_method: downloadMethod } : {}),
    template_id: templateId,
    language,
  });
}
