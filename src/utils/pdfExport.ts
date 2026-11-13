import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AppLanguage } from '../types/biodata';
import { ensureLanguageFontLoaded, getLanguageMeta } from './languageFonts';

export interface ExportPdfParams {
  element: HTMLElement;
  filename: string;
  language: AppLanguage;
}

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1122;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

async function waitForImagesInElement(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.allSettled(
    images.map(async (img) => {
      if (!img.getAttribute('src')) return;
      img.loading = 'eager';
      img.decoding = 'sync';
      if (!img.complete) {
        await new Promise<void>((resolve) => {
          const done = () => resolve();
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
          setTimeout(done, 4000);
        });
      }
      if (typeof img.decode === 'function') {
        try {
          await img.decode();
        } catch {
          // Ignore decode failures for already-loaded or SVG/data images
        }
      }
    })
  );
}

function waitTwoFrames(win: Window): Promise<void> {
  return new Promise((resolve) => {
    const raf = win.requestAnimationFrame || window.requestAnimationFrame;
    if (typeof raf === 'function') {
      raf(() => raf(() => resolve()));
    } else {
      setTimeout(resolve, 32);
    }
  });
}

function isCanvasBlank(canvas: HTMLCanvasElement): boolean {
  if (canvas.width <= 0 || canvas.height <= 0) return true;
  try {
    const probeW = 60;
    const probeH = 85;
    const probe = document.createElement('canvas');
    probe.width = probeW;
    probe.height = probeH;
    const ctx = probe.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, probeW, probeH);
    ctx.drawImage(canvas, 0, 0, probeW, probeH);
    const { data } = ctx.getImageData(0, 0, probeW, probeH);
    // Check if there is any non-near-white pixel on the sheet
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

async function captureA4Canvas(
  element: HTMLElement,
  language: AppLanguage,
  scale: number
): Promise<HTMLCanvasElement> {
  const langMeta = getLanguageMeta(language);

  return html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    width: A4_WIDTH_PX,
    height: A4_HEIGHT_PX,
    windowWidth: A4_WIDTH_PX,
    windowHeight: A4_HEIGHT_PX,
    x: 0,
    y: 0,
    scrollX: 0,
    scrollY: 0,
    logging: false,
    removeContainer: true,
    onclone: async (clonedDoc, clonedEl) => {
      // Remove Tailwind v4 stylesheets using oklch()/oklab()/color-mix() which break html2canvas@1.4.1
      // while preserving Google Fonts <link> tags. A4PreviewSheet uses 100% inline hex styles & SVGs.
      const styleTags = Array.from(clonedDoc.querySelectorAll('style'));
      for (const tag of styleTags) {
        const css = tag.textContent || '';
        if (css.includes('oklch') || css.includes('oklab') || css.includes('color-mix')) {
          tag.remove();
        }
      }

      const linkTags = Array.from(clonedDoc.querySelectorAll('link[rel="stylesheet"]'));
      for (const link of linkTags) {
        const href = link.getAttribute('href') || '';
        if (!href.includes('fonts.googleapis.com')) {
          link.remove();
        }
      }

      const safeCss = clonedDoc.createElement('style');
      safeCss.textContent = `
        :root {
          --font-sans: 'Noto Sans Devanagari', 'Noto Sans Gujarati', 'Noto Sans Bengali', 'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Kannada', 'Noto Sans Malayalam', 'Noto Sans Gurmukhi', 'Noto Sans Oriya', 'Noto Sans Arabic', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          --font-serif-mr: 'Noto Serif Devanagari', 'Noto Sans Devanagari', Georgia, serif;
        }
        *, *::before, *::after {
          box-sizing: border-box;
        }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: ${A4_WIDTH_PX}px !important;
          height: ${A4_HEIGHT_PX}px !important;
          background-color: #ffffff !important;
          color: #111827 !important;
          overflow: hidden !important;
          font-family: ${langMeta.fontStack} !important;
        }
        svg, img {
          display: block;
        }
        .a4-paper-root {
          width: ${A4_WIDTH_PX}px !important;
          min-height: ${A4_HEIGHT_PX}px !important;
          height: ${A4_HEIGHT_PX}px !important;
          box-sizing: border-box !important;
          position: relative !important;
          overflow: hidden !important;
          font-variant-ligatures: normal !important;
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1 !important;
          text-rendering: optimizeLegibility !important;
          color: #1f2937 !important;
          -webkit-font-smoothing: antialiased !important;
        }
      `;
      clonedDoc.head.appendChild(safeCss);

      clonedDoc.documentElement.lang = language;
      clonedDoc.documentElement.dir = langMeta.dir;

      // Hide unrelated app UI in the cloned document and place clonedEl at exact (0, 0)
      Array.from(clonedDoc.body.children).forEach((child) => {
        if (child !== clonedEl) {
          (child as HTMLElement).style.display = 'none';
        }
      });

      if (clonedEl.parentElement !== clonedDoc.body) {
        clonedDoc.body.appendChild(clonedEl);
      }

      clonedEl.removeAttribute('aria-hidden');
      clonedEl.style.position = 'relative';
      clonedEl.style.left = '0px';
      clonedEl.style.top = '0px';
      clonedEl.style.right = 'auto';
      clonedEl.style.bottom = 'auto';
      clonedEl.style.margin = '0px';
      clonedEl.style.padding = '0px';
      clonedEl.style.width = `${A4_WIDTH_PX}px`;
      clonedEl.style.height = `${A4_HEIGHT_PX}px`;
      clonedEl.style.transform = 'none';
      clonedEl.style.opacity = '1';
      clonedEl.style.visibility = 'visible';
      clonedEl.style.display = 'block';
      clonedEl.style.overflow = 'hidden';

      await waitForImagesInElement(clonedEl);
      if (clonedDoc.fonts && clonedDoc.fonts.ready) {
        try {
          await clonedDoc.fonts.ready;
        } catch {
          // Proceed with loaded fonts
        }
      }
      await waitTwoFrames(clonedDoc.defaultView || window);
    },
  });
}

export async function exportA4Pdf({ element, filename, language }: ExportPdfParams): Promise<void> {
  // Ensure the active language's Google Noto Font & embedded portrait photo are fully ready before capture
  await Promise.all([ensureLanguageFontLoaded(language), waitForImagesInElement(element)]);

  const scalesToTry = [2, 1.5, 1];
  let capturedCanvas: HTMLCanvasElement | null = null;
  let lastError: unknown = null;

  for (const scale of scalesToTry) {
    try {
      const candidate = await captureA4Canvas(element, language, scale);
      if (!isCanvasBlank(candidate)) {
        capturedCanvas = candidate;
        break;
      }
    } catch (err) {
      lastError = err;
    }
  }

  if (!capturedCanvas) {
    throw lastError instanceof Error
      ? lastError
      : new Error('Unable to render non-blank PDF canvas');
  }

  const imgData = capturedCanvas.toDataURL('image/jpeg', 0.96);
  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: true,
  });

  pdf.addImage(imgData, 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'FAST');
  pdf.save(filename);
}
