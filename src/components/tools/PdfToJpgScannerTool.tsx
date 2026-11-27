import React, { useEffect, useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  AlertCircle,
  Crop,
  Download,
  FileImage,
  FileUp,
  ImagePlus,
  Loader2,
  RotateCw,
  ScanLine,
} from 'lucide-react';
import { PdfImageCropModal } from './PdfImageCropModal';
import { ToolShell } from './ToolShell';
import { WhatsAppShareBar } from './WhatsAppShareBar';
import { rotateImageFile } from '../../utils/cropImage';
import { pushDataLayerEvent } from '../../utils/gtm';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang } from '../../utils/siteI18n';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PdfToJpgScannerToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
  onToolDownload: () => void;
}

type ToolTab = 'pdf-to-jpg' | 'scan-cleaner';
type ScanFilter = 'magic-white' | 'bw-sharp' | 'color-boost' | 'original';

interface RenderedPageItem {
  pageNumber: number;
  previewUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

const COPY: Record<
  UiLang,
  {
    tabPdfToJpg: string;
    tabScanCleaner: string;
    pdfUploadTitle: string;
    pdfUploadHint: string;
    pdfSelectBtn: string;
    pdfChangeBtn: string;
    dpiLabel: string;
    dpiStandard: string;
    dpiHigh: string;
    renderingProgress: string;
    pageLabel: string;
    downloadPageBtn: string;
    downloadAllBtn: string;
    pdfInvalidError: string;
    pdfReadError: string;
    scanUploadTitle: string;
    scanUploadHint: string;
    scanSelectBtn: string;
    scanChangeBtn: string;
    scanFilterLabel: string;
    filterMagicWhite: string;
    filterBwSharp: string;
    filterColorBoost: string;
    filterOriginal: string;
    contrastLabel: string;
    brightnessLabel: string;
    cropBtn: string;
    rotateBtn: string;
    beforeLabel: string;
    afterLabel: string;
    downloadCleanJpg: string;
    downloadCleanPdf: string;
    scanInvalidError: string;
    scanProcessError: string;
  }
> = {
  en: {
    tabPdfToJpg: 'PDF to JPG',
    tabScanCleaner: 'Document Scan Cleaner',
    pdfUploadTitle: 'Select a PDF to convert pages to JPG images',
    pdfUploadHint: 'Convert every page of a PDF into sharp JPG photos locally in your browser.',
    pdfSelectBtn: 'Select PDF File',
    pdfChangeBtn: 'Choose Another PDF',
    dpiLabel: 'Output Quality:',
    dpiStandard: 'Standard (150 DPI)',
    dpiHigh: 'High Quality (250 DPI)',
    renderingProgress: 'Converting page',
    pageLabel: 'Page',
    downloadPageBtn: 'Download JPG',
    downloadAllBtn: 'Download All Pages',
    pdfInvalidError: 'Please select a valid PDF file.',
    pdfReadError: 'Could not read this PDF. Please check it is not password-protected.',
    scanUploadTitle: 'Upload a dark or shadowed document photo',
    scanUploadHint: 'Clean paper backgrounds, whiten shadows, crop edges, and save as a crisp JPG or A4 PDF.',
    scanSelectBtn: 'Select Document Photo',
    scanChangeBtn: 'Change Photo',
    scanFilterLabel: 'Scan Enhancement Mode',
    filterMagicWhite: 'Magic White Scan',
    filterBwSharp: 'B&W Sharp Text',
    filterColorBoost: 'Color Boost',
    filterOriginal: 'Original',
    contrastLabel: 'Contrast',
    brightnessLabel: 'Brightness',
    cropBtn: 'Crop',
    rotateBtn: 'Rotate 90°',
    beforeLabel: 'Original Photo',
    afterLabel: 'Cleaned Scan Output',
    downloadCleanJpg: 'Download Clean JPG',
    downloadCleanPdf: 'Save as A4 PDF',
    scanInvalidError: 'Please select a valid JPG, PNG, or WEBP image.',
    scanProcessError: 'Could not process this document photo.',
  },
  mr: {
    tabPdfToJpg: 'PDF ते JPG',
    tabScanCleaner: 'डॉक्युमेंट स्कॅन क्लीनर',
    pdfUploadTitle: 'JPG फोटोंमध्ये रूपांतरित करण्यासाठी PDF निवडा',
    pdfUploadHint: 'PDF मधील प्रत्येक पानाचा स्पष्ट JPG फोटो थेट ब्राउझरमध्ये तयार करा.',
    pdfSelectBtn: 'PDF फाईल निवडा',
    pdfChangeBtn: 'दुसरी PDF निवडा',
    dpiLabel: 'गुणवत्ता:',
    dpiStandard: 'सामान्य (150 DPI)',
    dpiHigh: 'उच्च गुणवत्ता (250 DPI)',
    renderingProgress: 'पान तयार होत आहे',
    pageLabel: 'पान',
    downloadPageBtn: 'JPG डाउनलोड',
    downloadAllBtn: 'सर्व पाने डाउनलोड करा',
    pdfInvalidError: 'कृपया वैध PDF फाईल निवडा.',
    pdfReadError: 'ही PDF वाचता आली नाही. फाईल पासवर्ड-लॉक्ड नाही याची खात्री करा.',
    scanUploadTitle: 'सावली असलेला किंवा काळपट डॉक्युमेंट फोटो अपलोड करा',
    scanUploadHint: 'कागदावरील सावली काढून पांढरा स्वच्छ स्कॅन (CamScanner सारखा) बनवा आणि JPG किंवा PDF सेव्ह करा.',
    scanSelectBtn: 'डॉक्युमेंट फोटो निवडा',
    scanChangeBtn: 'फोटो बदला',
    scanFilterLabel: 'स्कॅन फिल्टर निवडा',
    filterMagicWhite: 'मॅजिक व्हाईट स्कॅन',
    filterBwSharp: 'ब्लॅक अँड व्हाईट (स्पष्ट)',
    filterColorBoost: 'कलर बूस्ट',
    filterOriginal: 'मूळ फोटो',
    contrastLabel: 'कॉन्ट्रास्ट',
    brightnessLabel: 'ब्राइटनेस',
    cropBtn: 'क्रॉप',
    rotateBtn: '९०° फिरवा',
    beforeLabel: 'मूळ फोटो',
    afterLabel: 'स्वच्छ स्कॅन केलेला फोटो',
    downloadCleanJpg: 'स्वच्छ JPG डाउनलोड करा',
    downloadCleanPdf: 'A4 PDF सेव्ह करा',
    scanInvalidError: 'कृपया वैध JPG, PNG किंवा WEBP फोटो निवडा.',
    scanProcessError: 'हा फोटो प्रोसेस करताना त्रुटी आली.',
  },
  hi: {
    tabPdfToJpg: 'PDF से JPG',
    tabScanCleaner: 'डॉक्यूमेंट स्कैन क्लीनर',
    pdfUploadTitle: 'JPG इमेज में बदलने के लिए PDF चुनें',
    pdfUploadHint: 'PDF के हर पेज को सीधे ब्राउज़र में साफ JPG फोटो में बदलें।',
    pdfSelectBtn: 'PDF फाइल चुनें',
    pdfChangeBtn: 'दूसरी PDF चुनें',
    dpiLabel: 'क्वालिटी:',
    dpiStandard: 'सामान्य (150 DPI)',
    dpiHigh: 'हाई क्वालिटी (250 DPI)',
    renderingProgress: 'पेज बदल रहा है',
    pageLabel: 'पेज',
    downloadPageBtn: 'JPG डाउनलोड',
    downloadAllBtn: 'सभी पेज डाउनलोड करें',
    pdfInvalidError: 'कृपया एक मान्य PDF फाइल चुनें।',
    pdfReadError: 'यह PDF पढ़ी नहीं जा सकी। सुनिश्चित करें कि यह पासवर्ड-लॉक्ड नहीं है।',
    scanUploadTitle: 'कम रोशनी या परछाई वाली डॉक्यूमेंट फोटो अपलोड करें',
    scanUploadHint: 'कागज का बैकग्राउंड सफेद व साफ बनाएं (CamScanner जैसा), किनारे क्रॉप करें और JPG या A4 PDF सेव करें।',
    scanSelectBtn: 'डॉक्यूमेंट फोटो चुनें',
    scanChangeBtn: 'फोटो बदलें',
    scanFilterLabel: 'स्कैन फिल्टर चुनें',
    filterMagicWhite: 'मैजिक व्हाइट स्कैन',
    filterBwSharp: 'B&W शार्प टेक्स्ट',
    filterColorBoost: 'कलर बूस्ट',
    filterOriginal: 'मूल फोटो',
    contrastLabel: 'कंट्रास्ट',
    brightnessLabel: 'ब्राइटनेस',
    cropBtn: 'क्रॉप',
    rotateBtn: '90° घुमाएँ',
    beforeLabel: 'मूल फोटो',
    afterLabel: 'साफ स्कैन आउटपुट',
    downloadCleanJpg: 'साफ JPG डाउनलोड करें',
    downloadCleanPdf: 'A4 PDF सेव करें',
    scanInvalidError: 'कृपया एक मान्य JPG, PNG या WEBP फोटो चुनें।',
    scanProcessError: 'इस फोटो को प्रोसेस करने में समस्या आई।',
  },
};

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function applyDocumentScanFilter(
  sourceCanvas: HTMLCanvasElement,
  filter: ScanFilter,
  contrast: number,
  brightness: number
): HTMLCanvasElement {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d');
  if (!ctx) return sourceCanvas;

  ctx.drawImage(sourceCanvas, 0, 0);
  if (filter === 'original' && contrast === 100 && brightness === 100) {
    return out;
  }

  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;

  const contrastFactor = (259 * ((contrast - 100) * 1.4 + 255)) / (255 * (259 - (contrast - 100) * 1.4));
  const brightOffset = (brightness - 100) * 1.6;

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];

    if (filter === 'magic-white') {
      // Push light paper pixels cleanly toward white while preserving ink darkness
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum > 165) {
        const boost = Math.min(1, (lum - 165) / 55);
        r = r + (255 - r) * boost * 0.92;
        g = g + (255 - g) * boost * 0.92;
        b = b + (255 - b) * boost * 0.92;
      } else if (lum < 120) {
        r *= 0.78;
        g *= 0.78;
        b *= 0.78;
      }
      r = contrastFactor * (r - 128) + 128 + brightOffset;
      g = contrastFactor * (g - 128) + 128 + brightOffset;
      b = contrastFactor * (b - 128) + 128 + brightOffset;
    } else if (filter === 'bw-sharp') {
      let gray = 0.299 * r + 0.587 * g + 0.114 * b;
      gray = contrastFactor * (gray - 128) + 128 + brightOffset;
      // Soft S-curve thresholding so ink stays crisp and paper becomes clean white
      if (gray > 165) gray = 255;
      else if (gray < 85) gray = gray * 0.45;
      r = g = b = gray;
    } else if (filter === 'color-boost') {
      r = contrastFactor * (r - 128) + 128 + brightOffset;
      g = contrastFactor * (g - 128) + 128 + brightOffset;
      b = contrastFactor * (b - 128) + 128 + brightOffset;
    } else {
      r = contrastFactor * (r - 128) + 128 + brightOffset;
      g = contrastFactor * (g - 128) + 128 + brightOffset;
      b = contrastFactor * (b - 128) + 128 + brightOffset;
    }

    d[i] = Math.max(0, Math.min(255, r));
    d[i + 1] = Math.max(0, Math.min(255, g));
    d[i + 2] = Math.max(0, Math.min(255, b));
  }

  ctx.putImageData(imgData, 0, 0);
  return out;
}

export const PdfToJpgScannerTool: React.FC<PdfToJpgScannerToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
  onToolDownload,
}) => {
  const c = COPY[uiLang];
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/pdf-to-jpg-scanner')!;

  const [activeTab, setActiveTab] = useState<ToolTab>('pdf-to-jpg');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [hasDownloaded, setHasDownloaded] = useState<boolean>(false);

  // Tab 1: PDF to JPG state
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [renderScale, setRenderScale] = useState<number>(2.0);
  const [renderedPages, setRenderedPages] = useState<RenderedPageItem[]>([]);
  const [isRenderingPdf, setIsRenderingPdf] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<string>('');

  const renderedPagesRef = useRef<RenderedPageItem[]>([]);
  renderedPagesRef.current = renderedPages;

  // Tab 2: Document Scan Cleaner state
  const scanInputRef = useRef<HTMLInputElement | null>(null);
  const scanOutputCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [scanPreviewUrl, setScanPreviewUrl] = useState<string>('');
  const [scanFilter, setScanFilter] = useState<ScanFilter>('magic-white');
  const [contrast, setContrast] = useState<number>(118);
  const [brightness, setBrightness] = useState<number>(106);
  const [isCroppingScan, setIsCroppingScan] = useState<boolean>(false);
  const [isExportingScan, setIsExportingScan] = useState<boolean>(false);

  const scanPreviewUrlRef = useRef<string>('');
  scanPreviewUrlRef.current = scanPreviewUrl;

  useEffect(() => {
    return () => {
      for (const p of renderedPagesRef.current) {
        URL.revokeObjectURL(p.previewUrl);
      }
      if (scanPreviewUrlRef.current) {
        URL.revokeObjectURL(scanPreviewUrlRef.current);
      }
    };
  }, []);

  // --- PDF to JPG handlers ---
  const renderPdfToJpgs = async (file: File, scale: number) => {
    setErrorMsg('');
    setIsRenderingPdf(true);
    setHasDownloaded(false);

    for (const old of renderedPagesRef.current) {
      URL.revokeObjectURL(old.previewUrl);
    }
    setRenderedPages([]);

    try {
      const buffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
      const pdf = await loadingTask.promise;
      const items: RenderedPageItem[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setRenderProgress(`${c.renderingProgress} ${i} / ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(viewport.width));
        canvas.height = Math.max(1, Math.round(viewport.height));
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas unavailable');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('JPG encode failed'))), 'image/jpeg', 0.92);
        });

        items.push({
          pageNumber: i,
          previewUrl: URL.createObjectURL(blob),
          blob,
          width: canvas.width,
          height: canvas.height,
        });
      }
      void loadingTask.destroy();
      setRenderedPages(items);
    } catch {
      setErrorMsg(c.pdfReadError);
    } finally {
      setIsRenderingPdf(false);
      setRenderProgress('');
    }
  };

  const handleSelectPdfFile = (file: File | undefined) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg(c.pdfInvalidError);
      return;
    }
    setPdfFile(file);
    void renderPdfToJpgs(file, renderScale);
  };

  const handleDownloadSinglePage = (item: RenderedPageItem) => {
    if (!pdfFile) return;
    const base = pdfFile.name.replace(/\.pdf$/i, '');
    triggerBlobDownload(item.blob, `${base}-page-${item.pageNumber}.jpg`);
    setHasDownloaded(true);
    pushDataLayerEvent('file_download', {
      document_type: 'pdf_to_jpg_page',
      file_extension: 'jpg',
    });
    onToolDownload();
  };

  const handleDownloadAllPages = () => {
    if (!pdfFile || renderedPages.length === 0) return;
    const base = pdfFile.name.replace(/\.pdf$/i, '');
    renderedPages.forEach((item, idx) => {
      window.setTimeout(() => {
        triggerBlobDownload(item.blob, `${base}-page-${item.pageNumber}.jpg`);
      }, idx * 140);
    });
    setHasDownloaded(true);
    pushDataLayerEvent('file_download', {
      document_type: 'pdf_to_jpg_all',
      file_extension: 'jpg',
    });
    onToolDownload();
  };

  // --- Document Scan Cleaner handlers ---
  const setScanFileAndUrl = (file: File) => {
    const nextUrl = URL.createObjectURL(file);
    if (scanPreviewUrlRef.current) URL.revokeObjectURL(scanPreviewUrlRef.current);
    setScanFile(file);
    setScanPreviewUrl(nextUrl);
  };

  const handleSelectScanFile = (file: File | undefined) => {
    if (!file) return;
    setErrorMsg('');
    setHasDownloaded(false);
    const isValid = file.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(file.name);
    if (!isValid) {
      setErrorMsg(c.scanInvalidError);
      return;
    }
    setScanFileAndUrl(file);
  };

  const handleRotateScan = async () => {
    if (!scanFile) return;
    try {
      const rotated = await rotateImageFile(scanFile, 90);
      setScanFileAndUrl(rotated);
    } catch {
      setErrorMsg(c.scanProcessError);
    }
  };

  useEffect(() => {
    if (!scanPreviewUrl || activeTab !== 'scan-cleaner') return;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      const canvas = scanOutputCanvasRef.current;
      if (!canvas) return;
      const maxPrev = 1200;
      const scale = Math.min(1, maxPrev / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
      const w = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
      const h = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));

      const tmp = document.createElement('canvas');
      tmp.width = w;
      tmp.height = h;
      const tctx = tmp.getContext('2d');
      if (!tctx) return;
      tctx.drawImage(img, 0, 0, w, h);

      const processed = applyDocumentScanFilter(tmp, scanFilter, contrast, brightness);
      canvas.width = processed.width;
      canvas.height = processed.height;
      const outCtx = canvas.getContext('2d');
      if (outCtx) {
        outCtx.drawImage(processed, 0, 0);
      }
    };
    img.src = scanPreviewUrl;
    return () => {
      cancelled = true;
    };
  }, [scanPreviewUrl, scanFilter, contrast, brightness, activeTab]);

  const buildFullResProcessedBlob = async (): Promise<Blob> => {
    if (!scanPreviewUrl) throw new Error('No image');
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = 'anonymous';
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Image error'));
      el.src = scanPreviewUrl;
    });
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    const maxOut = 2600;
    const scale = Math.min(1, maxOut / Math.max(w, h));
    const tmp = document.createElement('canvas');
    tmp.width = Math.max(1, Math.round(w * scale));
    tmp.height = Math.max(1, Math.round(h * scale));
    const tctx = tmp.getContext('2d');
    if (!tctx) throw new Error('Canvas unavailable');
    tctx.drawImage(img, 0, 0, tmp.width, tmp.height);

    const processed = applyDocumentScanFilter(tmp, scanFilter, contrast, brightness);
    return new Promise<Blob>((resolve, reject) => {
      processed.toBlob((b) => (b ? resolve(b) : reject(new Error('Encode failed'))), 'image/jpeg', 0.93);
    });
  };

  const handleDownloadScanJpg = async () => {
    if (!scanFile) return;
    setIsExportingScan(true);
    setErrorMsg('');
    try {
      const blob = await buildFullResProcessedBlob();
      const base = scanFile.name.replace(/\.[^.]+$/, '');
      triggerBlobDownload(blob, `${base}-scanned.jpg`);
      setHasDownloaded(true);
      pushDataLayerEvent('file_download', {
        document_type: 'document_scan_jpg',
        file_extension: 'jpg',
      });
      onToolDownload();
    } catch {
      setErrorMsg(c.scanProcessError);
    } finally {
      setIsExportingScan(false);
    }
  };

  const handleDownloadScanPdf = async () => {
    if (!scanFile) return;
    setIsExportingScan(true);
    setErrorMsg('');
    try {
      const blob = await buildFullResProcessedBlob();
      const jpgBytes = new Uint8Array(await blob.arrayBuffer());
      const pdfDoc = await PDFDocument.create();
      const embedded = await pdfDoc.embedJpg(jpgBytes);
      const a4W = 595.28;
      const a4H = 841.89;
      const margin = 20;
      const maxW = a4W - margin * 2;
      const maxH = a4H - margin * 2;
      const scale = Math.min(maxW / embedded.width, maxH / embedded.height);
      const drawW = embedded.width * scale;
      const drawH = embedded.height * scale;
      const page = pdfDoc.addPage([a4W, a4H]);
      page.drawImage(embedded, {
        x: (a4W - drawW) / 2,
        y: (a4H - drawH) / 2,
        width: drawW,
        height: drawH,
      });

      const outBytes = await pdfDoc.save();
      const pdfBlob = new Blob([new Uint8Array(outBytes).buffer], { type: 'application/pdf' });
      const base = scanFile.name.replace(/\.[^.]+$/, '');
      triggerBlobDownload(pdfBlob, `${base}-scanned.pdf`);
      setHasDownloaded(true);
      pushDataLayerEvent('file_download', {
        document_type: 'document_scan_pdf',
        file_extension: 'pdf',
      });
      onToolDownload();
    } catch {
      setErrorMsg(c.scanProcessError);
    } finally {
      setIsExportingScan(false);
    }
  };

  return (
    <ToolShell
      route="/pdf-to-jpg-scanner"
      title={toolMeta.title[uiLang]}
      subtitle={toolMeta.shortDesc[uiLang]}
      uiLang={uiLang}
      isPro={isPro}
      onBackHome={onBackHome}
      onOpenProModal={onOpenProModal}
    >
      {/* 2 Sub-Tool Tabs */}
      <div
        role="tablist"
        aria-label="PDF to JPG & Scan Cleaner"
        className="inline-flex flex-wrap p-1 bg-slate-100 rounded-xl gap-1 mb-5"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'pdf-to-jpg'}
          onClick={() => {
            setActiveTab('pdf-to-jpg');
            setErrorMsg('');
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'pdf-to-jpg'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileImage className="w-4 h-4 text-blue-600" />
          <span>{c.tabPdfToJpg}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'scan-cleaner'}
          onClick={() => {
            setActiveTab('scan-cleaner');
            setErrorMsg('');
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'scan-cleaner'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ScanLine className="w-4 h-4 text-emerald-600" />
          <span>{c.tabScanCleaner}</span>
        </button>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm font-medium text-rose-700"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TAB 1: PDF TO JPG */}
      {activeTab === 'pdf-to-jpg' && (
        <div className="space-y-4">
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              handleSelectPdfFile(e.target.files?.[0]);
              e.target.value = '';
            }}
            className="hidden"
          />

          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/70">
            <p className="text-sm font-bold text-slate-900">
              {pdfFile ? pdfFile.name : c.pdfUploadTitle}
            </p>
            <p className="text-xs text-slate-500 mt-1">{c.pdfUploadHint}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-600">{c.dpiLabel}</span>
                {[
                  { label: c.dpiStandard, scale: 1.8 },
                  { label: c.dpiHigh, scale: 2.6 },
                ].map((opt) => (
                  <button
                    key={opt.scale}
                    type="button"
                    onClick={() => {
                      setRenderScale(opt.scale);
                      if (pdfFile) void renderPdfToJpgs(pdfFile, opt.scale);
                    }}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                      renderScale === opt.scale
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                disabled={isRenderingPdf}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer disabled:opacity-60"
              >
                <FileUp className="w-4 h-4" />
                <span>{pdfFile ? c.pdfChangeBtn : c.pdfSelectBtn}</span>
              </button>
            </div>
          </div>

          {isRenderingPdf && (
            <div className="flex items-center justify-center gap-2 py-8 text-sm font-semibold text-slate-700">
              <Loader2 className="w-5 h-5 animate-spin text-[#1E40AF]" />
              <span>{renderProgress}</span>
            </div>
          )}

          {renderedPages.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 tabular-nums">
                  {renderedPages.length} {c.pageLabel}
                </span>
                {renderedPages.length > 1 && (
                  <button
                    type="button"
                    onClick={handleDownloadAllPages}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{c.downloadAllBtn}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {renderedPages.map((item) => (
                  <div
                    key={item.pageNumber}
                    className="bg-white border border-slate-200 rounded-xl p-2.5 flex flex-col gap-2"
                  >
                    <div className="w-full h-44 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={item.previewUrl}
                        alt={`${c.pageLabel} ${item.pageNumber}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 tabular-nums">
                      <span className="font-bold text-slate-800">
                        {c.pageLabel} {item.pageNumber}
                      </span>
                      <span>{(item.blob.size / 1024).toFixed(0)} KB</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadSinglePage(item)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{c.downloadPageBtn}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DOCUMENT SCAN CLEANER */}
      {activeTab === 'scan-cleaner' && (
        <div className="space-y-4">
          <input
            ref={scanInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              handleSelectScanFile(e.target.files?.[0]);
              e.target.value = '';
            }}
            className="hidden"
          />

          {!scanFile ? (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50/70 space-y-3">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <ScanLine className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-base font-bold text-slate-900">{c.scanUploadTitle}</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">{c.scanUploadHint}</p>
              <button
                type="button"
                onClick={() => scanInputRef.current?.click()}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer"
              >
                <ImagePlus className="w-4 h-4" />
                <span>{c.scanSelectBtn}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Filter & Adjustment Toolbar */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold text-slate-800">{c.scanFilterLabel}</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCroppingScan(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      <Crop className="w-3.5 h-3.5" />
                      <span>{c.cropBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleRotateScan()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>{c.rotateBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => scanInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      {c.scanChangeBtn}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: 'magic-white', label: c.filterMagicWhite },
                      { id: 'bw-sharp', label: c.filterBwSharp },
                      { id: 'color-boost', label: c.filterColorBoost },
                      { id: 'original', label: c.filterOriginal },
                    ] as Array<{ id: ScanFilter; label: string }>
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setScanFilter(f.id);
                        if (f.id === 'magic-white') {
                          setContrast(118);
                          setBrightness(106);
                        } else if (f.id === 'bw-sharp') {
                          setContrast(130);
                          setBrightness(110);
                        } else if (f.id === 'color-boost') {
                          setContrast(115);
                          setBrightness(104);
                        } else {
                          setContrast(100);
                          setBrightness(100);
                        }
                      }}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                        scanFilter === f.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>{c.contrastLabel}</span>
                      <span className="tabular-nums">{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={160}
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-slate-900 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>{c.brightnessLabel}</span>
                      <span className="tabular-nums">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={145}
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-slate-900 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Before & After Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="text-xs font-bold text-slate-600">{c.beforeLabel}</div>
                  <div className="w-full h-72 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden p-2">
                    <img
                      src={scanPreviewUrl}
                      alt={c.beforeLabel}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="text-xs font-bold text-emerald-700">{c.afterLabel}</div>
                  <div className="w-full h-72 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden p-2">
                    <canvas
                      ref={scanOutputCanvasRef}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Download Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => void handleDownloadScanJpg()}
                  disabled={isExportingScan}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isExportingScan ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{c.downloadCleanJpg}</span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleDownloadScanPdf()}
                  disabled={isExportingScan}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Download className="w-4 h-4" />
                  <span>{c.downloadCleanPdf}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {hasDownloaded && (
        <div className="mt-5">
          <WhatsAppShareBar
            uiLang={uiLang}
            route="/pdf-to-jpg-scanner"
            toolTitle={toolMeta.title[uiLang]}
          />
        </div>
      )}

      <PdfImageCropModal
        isOpen={isCroppingScan && Boolean(scanFile && scanPreviewUrl)}
        imageSrc={scanPreviewUrl}
        file={scanFile}
        uiLang={uiLang}
        onClose={() => setIsCroppingScan(false)}
        onApply={(updatedFile) => setScanFileAndUrl(updatedFile)}
      />
    </ToolShell>
  );
};
