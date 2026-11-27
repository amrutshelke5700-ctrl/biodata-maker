import React, { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  AlertCircle,
  Check,
  Download,
  FileDown,
  FileUp,
  Loader2,
} from 'lucide-react';
import { ToolShell } from './ToolShell';
import { WhatsAppShareBar } from './WhatsAppShareBar';
import { pushDataLayerEvent } from '../../utils/gtm';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang } from '../../utils/siteI18n';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PdfCompressorToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
  onToolDownload: () => void;
}

const PRESET_KBS = [100, 200, 500, 1024];

const COPY: Record<
  UiLang,
  {
    uploadTitle: string;
    uploadHint: string;
    selectBtn: string;
    changeBtn: string;
    targetLabel: string;
    customPlaceholder: string;
    kbUnit: string;
    compressBtn: string;
    workingBtn: string;
    renderingLabel: string;
    optimizingLabel: string;
    originalLabel: string;
    compressedLabel: string;
    savedLabel: string;
    pagesLabel: string;
    downloadBtn: string;
    invalidFileError: string;
    rangeError: string;
    loadError: string;
    compressError: string;
    doneNote: string;
    targetMinNote: string;
  }
> = {
  en: {
    uploadTitle: 'Upload a PDF file to compress',
    uploadHint: 'Reduce PDF size to 100 KB, 200 KB, 500 KB, or any custom KB size right inside your browser.',
    selectBtn: 'Select PDF File',
    changeBtn: 'Choose Another PDF',
    targetLabel: 'Target Maximum Size (KB)',
    customPlaceholder: 'Custom KB',
    kbUnit: 'KB',
    compressBtn: 'Compress PDF',
    workingBtn: 'Compressing PDF...',
    renderingLabel: 'Rendering PDF pages',
    optimizingLabel: 'Optimizing quality for target KB...',
    originalLabel: 'Original PDF Size',
    compressedLabel: 'Compressed PDF Size',
    savedLabel: 'Reduced by',
    pagesLabel: 'Pages',
    downloadBtn: 'Download Compressed PDF',
    invalidFileError: 'Please select a valid PDF file.',
    rangeError: 'Enter a valid target size between 20 KB and 25,600 KB.',
    loadError: 'Could not read this PDF. Make sure it is not password-protected.',
    compressError: 'Could not compress this PDF. Please try another file.',
    doneNote: 'PDF compressed cleanly and ready to download.',
    targetMinNote: 'Compressed to the smallest readable size possible for this number of pages.',
  },
  mr: {
    uploadTitle: 'कॉम्प्रेस करण्यासाठी PDF फाईल निवडा',
    uploadHint: 'सरकारी फॉर्म, कॉलेज व नोकरी पोर्टलसाठी PDF ची साईज थेट ब्राउझरमध्ये 100 KB, 200 KB किंवा 500 KB करा.',
    selectBtn: 'PDF फाईल निवडा',
    changeBtn: 'दुसरी PDF निवडा',
    targetLabel: 'लक्ष्यित कमाल साईज (KB मध्ये)',
    customPlaceholder: 'कस्टम KB',
    kbUnit: 'KB',
    compressBtn: 'PDF कॉम्प्रेस करा',
    workingBtn: 'PDF कॉम्प्रेस होत आहे...',
    renderingLabel: 'PDF पाने प्रोसेस होत आहेत',
    optimizingLabel: 'योग्य KB साईजसाठी गुणवत्ता सेट करत आहे...',
    originalLabel: 'मूळ PDF साईज',
    compressedLabel: 'कॉम्प्रेस केलेली PDF',
    savedLabel: 'बचत',
    pagesLabel: 'पाने',
    downloadBtn: 'कॉम्प्रेस PDF डाउनलोड करा',
    invalidFileError: 'कृपया वैध PDF फाईल निवडा.',
    rangeError: 'कृपया २० KB ते २५,६०० KB दरम्यान योग्य साईज टाका.',
    loadError: 'ही PDF वाचता आली नाही. फाईल पासवर्ड-लॉक्ड नाही याची खात्री करा.',
    compressError: 'PDF कॉम्प्रेस करता आली नाही. कृपया दुसरी फाईल तपासा.',
    doneNote: 'PDF यशस्वीरीत्या कॉम्प्रेस झाली आहे.',
    targetMinNote: 'या पानांच्या संख्येसाठी शक्य तितक्या लहान व वाचण्यायोग्य साईजमध्ये PDF तयार केली आहे.',
  },
  hi: {
    uploadTitle: 'कंप्रेस करने के लिए PDF फाइल चुनें',
    uploadHint: 'सरकारी फॉर्म, कॉलेज व जॉब पोर्टल के लिए PDF साइज सीधे ब्राउज़र में 100 KB, 200 KB या 500 KB करें।',
    selectBtn: 'PDF फाइल चुनें',
    changeBtn: 'दूसरी PDF चुनें',
    targetLabel: 'वांछित अधिकतम साइज (KB में)',
    customPlaceholder: 'कस्टम KB',
    kbUnit: 'KB',
    compressBtn: 'PDF कंप्रेस करें',
    workingBtn: 'PDF कंप्रेस हो रही है...',
    renderingLabel: 'PDF पेज प्रोसेस हो रहे हैं',
    optimizingLabel: 'तय KB के लिए क्वालिटी सेट हो रही है...',
    originalLabel: 'मूल PDF साइज',
    compressedLabel: 'कंप्रेस की गई PDF',
    savedLabel: 'बचत',
    pagesLabel: 'पेज',
    downloadBtn: 'कंप्रेस PDF डाउनलोड करें',
    invalidFileError: 'कृपया एक मान्य PDF फाइल चुनें।',
    rangeError: 'कृपया 20 KB से 25,600 KB के बीच सही साइज दर्ज करें।',
    loadError: 'यह PDF पढ़ी नहीं जा सकी। सुनिश्चित करें कि यह पासवर्ड-लॉक्ड नहीं है।',
    compressError: 'PDF कंप्रेस नहीं हो सकी। कृपया दूसरी फाइल आजमाएं।',
    doneNote: 'PDF सफलतापूर्वक कंप्रेस हो गई है और डाउनलोड के लिए तैयार है।',
    targetMinNote: 'इन पेजों की संख्या के अनुसार न्यूनतम पठनीय साइज में PDF तैयार की गई है।',
  },
};

function formatKb(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function downloadPdfBytes(bytes: Uint8Array, filename: string) {
  const safeBuffer = new Uint8Array(bytes).buffer;
  const blob = new Blob([safeBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

interface RenderedPageCanvas {
  canvas: HTMLCanvasElement;
  ptWidth: number;
  ptHeight: number;
}

async function buildPdfFromCanvases(
  pages: RenderedPageCanvas[],
  scaleFactor: number,
  jpegQuality: number
): Promise<Uint8Array> {
  const outDoc = await PDFDocument.create();
  for (const p of pages) {
    let targetCanvas = p.canvas;
    if (scaleFactor < 0.99) {
      const scaled = document.createElement('canvas');
      scaled.width = Math.max(120, Math.round(p.canvas.width * scaleFactor));
      scaled.height = Math.max(120, Math.round(p.canvas.height * scaleFactor));
      const sctx = scaled.getContext('2d');
      if (sctx) {
        sctx.fillStyle = '#ffffff';
        sctx.fillRect(0, 0, scaled.width, scaled.height);
        sctx.imageSmoothingEnabled = true;
        sctx.imageSmoothingQuality = 'high';
        sctx.drawImage(p.canvas, 0, 0, scaled.width, scaled.height);
        targetCanvas = scaled;
      }
    }

    const blob = await new Promise<Blob>((resolve, reject) => {
      targetCanvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('JPEG encode failed'))),
        'image/jpeg',
        jpegQuality
      );
    });
    const jpgBytes = new Uint8Array(await blob.arrayBuffer());
    const embedded = await outDoc.embedJpg(jpgBytes);
    const page = outDoc.addPage([p.ptWidth, p.ptHeight]);
    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width: p.ptWidth,
      height: p.ptHeight,
    });
  }
  return outDoc.save({ useObjectStreams: true });
}

export const PdfCompressorTool: React.FC<PdfCompressorToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
  onToolDownload,
}) => {
  const c = COPY[uiLang];
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/pdf-compressor')!;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [targetKbInput, setTargetKbInput] = useState<string>('200');
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [metTarget, setMetTarget] = useState<boolean>(true);
  const [hasDownloaded, setHasDownloaded] = useState<boolean>(false);

  const handleSelectFile = async (file: File | undefined) => {
    if (!file) return;
    setErrorMsg('');
    setResultBytes(null);
    setHasDownloaded(false);

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg(c.invalidFileError);
      return;
    }

    try {
      const bytes = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(bytes) });
      const pdf = await loadingTask.promise;
      setSourceFile(file);
      setPageCount(pdf.numPages);
      void loadingTask.destroy();
    } catch {
      setErrorMsg(c.loadError);
    }
  };

  const handleCompress = async () => {
    if (!sourceFile) return;
    const targetKb = Number(targetKbInput);
    if (!Number.isFinite(targetKb) || targetKb < 20 || targetKb > 25600) {
      setErrorMsg(c.rangeError);
      return;
    }

    setErrorMsg('');
    setResultBytes(null);
    setHasDownloaded(false);
    setIsWorking(true);

    try {
      const targetBytes = targetKb * 1024;
      const srcBuffer = await sourceFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(srcBuffer) });
      const pdf = await loadingTask.promise;

      const renderedPages: RenderedPageCanvas[] = [];
      const baseRenderScale = pdf.numPages > 12 ? 1.15 : 1.4;

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgressText(`${c.renderingLabel} (${i}/${pdf.numPages})...`);
        const page = await pdf.getPage(i);
        const baseViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: baseRenderScale });

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(viewport.width));
        canvas.height = Math.max(1, Math.round(viewport.height));
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas unavailable');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        renderedPages.push({
          canvas,
          ptWidth: baseViewport.width,
          ptHeight: baseViewport.height,
        });
      }
      void loadingTask.destroy();

      setProgressText(c.optimizingLabel);

      // Step through quality/scale combinations from crispest to smallest
      const candidates: Array<{ scale: number; quality: number }> = [
        { scale: 1.0, quality: 0.84 },
        { scale: 1.0, quality: 0.72 },
        { scale: 0.9, quality: 0.62 },
        { scale: 0.8, quality: 0.54 },
        { scale: 0.7, quality: 0.46 },
        { scale: 0.6, quality: 0.38 },
        { scale: 0.5, quality: 0.32 },
        { scale: 0.42, quality: 0.28 },
      ];

      let bestBytes: Uint8Array | null = null;
      let hitTarget = false;

      // Binary/progressive probe: check middle or start from quality 0.72 and narrow down
      for (const cand of candidates) {
        const out = await buildPdfFromCanvases(renderedPages, cand.scale, cand.quality);
        bestBytes = out;
        if (out.byteLength <= targetBytes) {
          hitTarget = true;
          break;
        }
      }

      if (!bestBytes) throw new Error('Empty PDF output');

      // If original PDF was already smaller than our best re-encoded output & under target, keep original bytes
      const originalBytes = new Uint8Array(srcBuffer);
      if (originalBytes.byteLength <= targetBytes && originalBytes.byteLength < bestBytes.byteLength) {
        setResultBytes(originalBytes);
        setMetTarget(true);
      } else {
        setResultBytes(bestBytes);
        setMetTarget(hitTarget);
      }
    } catch {
      setErrorMsg(c.compressError);
    } finally {
      setIsWorking(false);
      setProgressText('');
    }
  };

  const handleDownload = () => {
    if (!resultBytes || !sourceFile) return;
    const baseName = sourceFile.name.replace(/\.pdf$/i, '');
    downloadPdfBytes(resultBytes, `${baseName}-compressed.pdf`);
    setHasDownloaded(true);
    pushDataLayerEvent('file_download', {
      document_type: 'pdf_compress',
      file_extension: 'pdf',
    });
    onToolDownload();
  };

  const savedPercent =
    sourceFile && resultBytes
      ? Math.max(0, Math.round(((sourceFile.size - resultBytes.byteLength) / sourceFile.size) * 100))
      : 0;

  return (
    <ToolShell
      route="/pdf-compressor"
      title={toolMeta.title[uiLang]}
      subtitle={toolMeta.shortDesc[uiLang]}
      uiLang={uiLang}
      isPro={isPro}
      onBackHome={onBackHome}
      onOpenProModal={onOpenProModal}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          void handleSelectFile(e.target.files?.[0]);
          e.target.value = '';
        }}
        className="hidden"
      />

      {!sourceFile ? (
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50/70 space-y-3">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <FileDown className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900">{c.uploadTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">{c.uploadHint}</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer"
          >
            <FileUp className="w-4 h-4" />
            <span>{c.selectBtn}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Selected file summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate">{sourceFile.name}</div>
              <div className="text-xs text-slate-600 mt-0.5 tabular-nums">
                {c.originalLabel}: <strong>{formatKb(sourceFile.size)}</strong> · {pageCount} {c.pagesLabel}
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isWorking}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {c.changeBtn}
            </button>
          </div>

          {/* Target KB Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <label htmlFor="pdf-target-kb" className="block text-xs font-bold text-slate-800">
              {c.targetLabel}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_KBS.map((kb) => {
                const active = Number(targetKbInput) === kb;
                return (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => setTargetKbInput(String(kb))}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border tabular-nums transition-colors cursor-pointer ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {kb >= 1024 ? `${kb / 1024} MB` : `${kb} ${c.kbUnit}`}
                  </button>
                );
              })}

              <div className="inline-flex items-center gap-1.5 ml-auto">
                <input
                  id="pdf-target-kb"
                  type="number"
                  min={20}
                  max={25600}
                  value={targetKbInput}
                  onChange={(e) => setTargetKbInput(e.target.value)}
                  placeholder={c.customPlaceholder}
                  className="w-28 rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 tabular-nums focus:outline-none focus:border-slate-500"
                />
                <span className="text-xs font-semibold text-slate-500">{c.kbUnit}</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => void handleCompress()}
                disabled={isWorking}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer disabled:opacity-60"
              >
                {isWorking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{progressText || c.workingBtn}</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    <span>{c.compressBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="flex items-start gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm font-medium text-rose-700"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {resultBytes && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{metTarget ? c.doneNote : c.targetMinNote}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 tabular-nums pt-1">
                    <span>
                      {c.originalLabel}: <strong>{formatKb(sourceFile.size)}</strong>
                    </span>
                    <span>
                      {c.compressedLabel}:{' '}
                      <strong className="text-emerald-800">{formatKb(resultBytes.byteLength)}</strong>
                    </span>
                    {savedPercent > 0 && (
                      <span className="font-bold text-emerald-700">
                        {c.savedLabel}: {savedPercent}%
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>{c.downloadBtn}</span>
                </button>
              </div>

              {hasDownloaded && (
                <WhatsAppShareBar
                  uiLang={uiLang}
                  route="/pdf-compressor"
                  toolTitle={toolMeta.title[uiLang]}
                />
              )}
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
};
