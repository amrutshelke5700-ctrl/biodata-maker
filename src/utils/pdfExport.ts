import html2pdf from 'html2pdf.js';
import { AppLanguage } from '../types/biodata';
import { ensureLanguageFontLoaded } from './languageFonts';

export interface ExportPdfParams {
  element: HTMLElement;
  filename: string;
  language: AppLanguage;
}

export async function exportA4Pdf({ element, filename, language }: ExportPdfParams): Promise<void> {
  // Ensure the active language's Google Noto Font is fully loaded before rasterizing
  await ensureLanguageFontLoaded(language);

  const options = {
    margin: 0,
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    enableLinks: false,
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: 1122,
      windowWidth: 794,
      scrollX: 0,
      scrollY: 0,
      logging: false,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait' as const,
      compress: true,
    },
    pagebreak: { mode: ['avoid-all'] },
  };

  await html2pdf().set(options).from(element).save();
}
