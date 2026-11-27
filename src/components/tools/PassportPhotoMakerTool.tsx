import React, { useEffect, useRef, useState } from 'react';
import { removeBackground, Config } from '@imgly/background-removal';
import { PDFDocument } from 'pdf-lib';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  ImagePlus,
  Loader2,
  RefreshCw,
  Sparkles,
  UserSquare2,
} from 'lucide-react';
import { ToolShell } from './ToolShell';
import { WhatsAppShareBar } from './WhatsAppShareBar';
import { pushDataLayerEvent } from '../../utils/gtm';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang, getSiteStrings } from '../../utils/siteI18n';

interface PassportPhotoMakerToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
  onToolDownload: () => void;
}

type PassportBgMode = 'original' | 'white' | 'lightblue';
type SheetCount = 8 | 12;

// 300 DPI standard dimensions:
// 3.5 cm x 4.5 cm = 413 x 531 px
// A4 Portrait (210 x 297 mm) = 2480 x 3508 px
const TILE_W = 413;
const TILE_H = 531;
const A4_W = 2480;
const A4_H = 3508;

function formatPhotoDateDisplay(rawDate: string): string {
  if (!rawDate.trim()) return '';
  const match = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }
  return rawDate.trim();
}

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

async function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

function checkImageHasTransparency(img: HTMLImageElement): boolean {
  try {
    const c = document.createElement('canvas');
    c.width = 40;
    c.height = 40;
    const ctx = c.getContext('2d');
    if (!ctx) return false;
    ctx.drawImage(img, 0, 0, 40, 40);
    const data = ctx.getImageData(0, 0, 40, 40).data;
    // Check top corners for alpha transparency
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 40; x++) {
        if (x < 8 || x >= 32) {
          const alpha = data[(y * 40 + x) * 4 + 3];
          if (alpha < 230) return true;
        }
      }
    }
    return false;
  } catch {
    return false;
  }
}

function drawPassportTile(
  ctx: CanvasRenderingContext2D,
  sourceImg: HTMLImageElement,
  options: {
    bgMode: PassportBgMode;
    photoName: string;
    formattedDate: string;
    datePrefix: string;
    zoom: number;
    offsetY: number;
    showCutBorder: boolean;
  },
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const scaleFactor = dw / TILE_W;
  const trimmedName = options.photoName.trim().toUpperCase();
  const hasName = trimmedName.length > 0;
  const hasDate = options.formattedDate.length > 0;
  const linesCount = (hasName ? 1 : 0) + (hasDate ? 1 : 0);

  const stripH = linesCount === 0 ? 0 : Math.round((linesCount === 2 ? 78 : 46) * scaleFactor);
  const photoAreaH = dh - stripH;

  ctx.save();
  ctx.beginPath();
  ctx.rect(dx, dy, dw, dh);
  ctx.clip();

  // Fill background
  if (options.bgMode === 'white') {
    ctx.fillStyle = '#FFFFFF';
  } else if (options.bgMode === 'lightblue') {
    ctx.fillStyle = '#DBEAFE';
  } else {
    ctx.fillStyle = '#FFFFFF';
  }
  ctx.fillRect(dx, dy, dw, dh);

  // Draw portrait inside photoAreaH using cover scaling + zoom + vertical offset
  ctx.save();
  ctx.beginPath();
  ctx.rect(dx, dy, dw, photoAreaH);
  ctx.clip();

  const imgW = sourceImg.naturalWidth || sourceImg.width;
  const imgH = sourceImg.naturalHeight || sourceImg.height;
  const coverScale = Math.max(dw / imgW, photoAreaH / imgH) * options.zoom;
  const drawW = imgW * coverScale;
  const drawH = imgH * coverScale;

  const drawX = dx + (dw - drawW) / 2;
  const baseCenterY = dy + (photoAreaH - drawH) / 2;
  const shiftY = (options.offsetY / 100) * (photoAreaH * 0.45);
  const drawY = baseCenterY + shiftY;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(sourceImg, drawX, drawY, drawW, drawH);
  ctx.restore();

  // Optional crisp white Name & Date strip at bottom
  if (linesCount > 0) {
    const stripY = dy + photoAreaH;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(dx, stripY, dw, stripH);

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = Math.max(1, 1.5 * scaleFactor);
    ctx.beginPath();
    ctx.moveTo(dx, stripY);
    ctx.lineTo(dx + dw, stripY);
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const centerX = dx + dw / 2;
    const maxTextWidth = dw - 18 * scaleFactor;

    if (hasName && hasDate) {
      let fontSize = Math.round(23 * scaleFactor);
      ctx.font = `700 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      while (ctx.measureText(trimmedName).width > maxTextWidth && fontSize > 12 * scaleFactor) {
        fontSize -= 1;
        ctx.font = `700 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      }
      ctx.fillText(trimmedName, centerX, stripY + stripH * 0.34, maxTextWidth);

      const dateSize = Math.round(20 * scaleFactor);
      ctx.font = `600 ${dateSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      ctx.fillText(
        `${options.datePrefix} ${options.formattedDate}`,
        centerX,
        stripY + stripH * 0.72,
        maxTextWidth
      );
    } else if (hasName) {
      let fontSize = Math.round(24 * scaleFactor);
      ctx.font = `700 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      while (ctx.measureText(trimmedName).width > maxTextWidth && fontSize > 12 * scaleFactor) {
        fontSize -= 1;
        ctx.font = `700 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      }
      ctx.fillText(trimmedName, centerX, stripY + stripH * 0.52, maxTextWidth);
    } else if (hasDate) {
      const dateSize = Math.round(22 * scaleFactor);
      ctx.font = `700 ${dateSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      ctx.fillText(
        `${options.datePrefix} ${options.formattedDate}`,
        centerX,
        stripY + stripH * 0.52,
        maxTextWidth
      );
    }
  }

  ctx.restore();

  if (options.showCutBorder) {
    ctx.save();
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = Math.max(1, 2 * scaleFactor);
    ctx.strokeRect(dx + 0.5, dy + 0.5, dw - 1, dh - 1);
    ctx.restore();
  }
}

function renderA4SheetToCanvas(
  canvas: HTMLCanvasElement,
  sourceImg: HTMLImageElement,
  sheetCount: SheetCount,
  options: {
    bgMode: PassportBgMode;
    photoName: string;
    formattedDate: string;
    datePrefix: string;
    zoom: number;
    offsetY: number;
    showCutBorder: boolean;
  },
  scale = 1
) {
  const width = Math.round(A4_W * scale);
  const height = Math.round(A4_H * scale);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  const cols = 4;
  const rows = sheetCount === 12 ? 3 : 2;
  const tileW = TILE_W * scale;
  const tileH = TILE_H * scale;
  const gapX = 95 * scale;
  const gapY = 120 * scale;

  const gridW = cols * tileW + (cols - 1) * gapX;
  const startX = (width - gridW) / 2;
  const startY = 230 * scale;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dx = startX + c * (tileW + gapX);
      const dy = startY + r * (tileH + gapY);
      drawPassportTile(ctx, sourceImg, options, dx, dy, tileW, tileH);
    }
  }
}

export const PassportPhotoMakerTool: React.FC<PassportPhotoMakerToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
  onToolDownload,
}) => {
  const s = getSiteStrings(uiLang);
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/passport-photo-maker')!;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const singleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sheetPreviewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [cutoutUrl, setCutoutUrl] = useState('');
  const [cutoutImg, setCutoutImg] = useState<HTMLImageElement | null>(null);

  const [photoName, setPhotoName] = useState('');
  const [photoDate, setPhotoDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [bgMode, setBgMode] = useState<PassportBgMode>('original');
  const [sheetCount, setSheetCount] = useState<SheetCount>(8);
  const [zoom, setZoom] = useState<number>(1.05);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [showCutBorder, setShowCutBorder] = useState<boolean>(true);

  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [bgProgress, setBgProgress] = useState(0);
  const [bgStatus, setBgStatus] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const urlsRef = useRef<{ sourceUrl: string; cutoutUrl: string }>({
    sourceUrl: '',
    cutoutUrl: '',
  });
  urlsRef.current = { sourceUrl, cutoutUrl };

  useEffect(() => {
    return () => {
      if (urlsRef.current.sourceUrl) URL.revokeObjectURL(urlsRef.current.sourceUrl);
      if (urlsRef.current.cutoutUrl) URL.revokeObjectURL(urlsRef.current.cutoutUrl);
    };
  }, []);

  const runAiBackgroundRemoval = async (fileToProcess: File, alreadyTransparent: boolean) => {
    if (alreadyTransparent) {
      setBgStatus(s.passAiBgReady);
      return;
    }
    setIsRemovingBg(true);
    setBgProgress(5);
    setBgStatus(s.passAiBgWorking);
    setErrorMsg('');

    try {
      const config: Config = {
        model: isPro ? 'isnet_fp16' : 'isnet_quint8',
        output: { format: 'image/png', quality: 1 },
        progress: (_key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.min(99, Math.max(5, Math.round((current / total) * 100)));
            setBgProgress(pct);
          }
        },
      };
      const resultBlob = await removeBackground(fileToProcess, config);
      const nextUrl = URL.createObjectURL(resultBlob);
      const loadedCutout = await loadImageFromUrl(nextUrl);

      if (urlsRef.current.cutoutUrl) URL.revokeObjectURL(urlsRef.current.cutoutUrl);
      setCutoutUrl(nextUrl);
      setCutoutImg(loadedCutout);
      setBgProgress(100);
      setBgStatus(s.passAiBgReady);
    } catch {
      setErrorMsg(s.passAiBgError);
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleFileSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
      setErrorMsg(s.passFileTypeError);
      return;
    }

    setErrorMsg('');
    setBgStatus('');
    setBgProgress(0);

    const nextSourceUrl = URL.createObjectURL(file);
    try {
      const loaded = await loadImageFromUrl(nextSourceUrl);
      if (urlsRef.current.sourceUrl) URL.revokeObjectURL(urlsRef.current.sourceUrl);
      if (urlsRef.current.cutoutUrl) URL.revokeObjectURL(urlsRef.current.cutoutUrl);

      setSourceFile(file);
      setSourceUrl(nextSourceUrl);
      setSourceImg(loaded);
      setCutoutUrl('');
      setCutoutImg(null);
      setZoom(1.05);
      setOffsetY(0);

      if (checkImageHasTransparency(loaded)) {
        setCutoutImg(loaded);
      } else if (bgMode !== 'original') {
        void runAiBackgroundRemoval(file, false);
      }
    } catch {
      URL.revokeObjectURL(nextSourceUrl);
      setErrorMsg(s.passFileTypeError);
    }
  };

  const handleBgModeSelect = (nextMode: PassportBgMode) => {
    setBgMode(nextMode);
    setErrorMsg('');
    if (
      nextMode !== 'original' &&
      sourceFile &&
      sourceImg &&
      !cutoutImg &&
      !isRemovingBg
    ) {
      const transparent = checkImageHasTransparency(sourceImg);
      if (transparent) {
        setCutoutImg(sourceImg);
      } else {
        void runAiBackgroundRemoval(sourceFile, false);
      }
    }
  };

  const activePortraitImg =
    bgMode !== 'original' && cutoutImg ? cutoutImg : sourceImg;

  const formattedDate = formatPhotoDateDisplay(photoDate);

  useEffect(() => {
    if (!activePortraitImg) return;

    const tileOptions = {
      bgMode,
      photoName,
      formattedDate,
      datePrefix: s.passDatePrefix,
      zoom,
      offsetY,
      showCutBorder,
    };

    if (singleCanvasRef.current) {
      const sc = singleCanvasRef.current;
      sc.width = TILE_W;
      sc.height = TILE_H;
      const sctx = sc.getContext('2d');
      if (sctx) {
        drawPassportTile(sctx, activePortraitImg, tileOptions, 0, 0, TILE_W, TILE_H);
      }
    }

    if (sheetPreviewCanvasRef.current) {
      renderA4SheetToCanvas(
        sheetPreviewCanvasRef.current,
        activePortraitImg,
        sheetCount,
        tileOptions,
        0.38
      );
    }
  }, [
    activePortraitImg,
    bgMode,
    photoName,
    formattedDate,
    s.passDatePrefix,
    zoom,
    offsetY,
    showCutBorder,
    sheetCount,
  ]);

  const createFullResA4Blob = async (): Promise<Blob | null> => {
    if (!activePortraitImg) return null;
    const exportCanvas = document.createElement('canvas');
    renderA4SheetToCanvas(
      exportCanvas,
      activePortraitImg,
      sheetCount,
      {
        bgMode,
        photoName,
        formattedDate,
        datePrefix: s.passDatePrefix,
        zoom,
        offsetY,
        showCutBorder,
      },
      1
    );
    return await new Promise<Blob | null>((resolve) => {
      exportCanvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95);
    });
  };

  const handleDownloadA4Jpg = async () => {
    const blob = await createFullResA4Blob();
    if (!blob) return;
    triggerBlobDownload(blob, `sadhanbox-passport-${sheetCount}-a4.jpg`);
    pushDataLayerEvent('file_download', {
      document_type: 'passport_a4_jpg',
      sheet_count: sheetCount,
      file_extension: 'jpg',
    });
    onToolDownload();
    setHasDownloaded(true);
  };

  const handleDownloadA4Pdf = async () => {
    if (!activePortraitImg || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setErrorMsg('');
    try {
      const jpgBlob = await createFullResA4Blob();
      if (!jpgBlob) return;
      const jpgBytes = await jpgBlob.arrayBuffer();
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]);
      const embeddedJpg = await pdfDoc.embedJpg(jpgBytes);
      page.drawImage(embeddedJpg, {
        x: 0,
        y: 0,
        width: 595.28,
        height: 841.89,
      });
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      triggerBlobDownload(pdfBlob, `sadhanbox-passport-${sheetCount}-a4.pdf`);
      pushDataLayerEvent('file_download', {
        document_type: 'passport_a4_pdf',
        sheet_count: sheetCount,
        file_extension: 'pdf',
      });
      onToolDownload();
      setHasDownloaded(true);
    } catch {
      setErrorMsg(s.passFileTypeError);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadSingleJpg = async () => {
    if (!activePortraitImg) return;
    const singleExport = document.createElement('canvas');
    singleExport.width = TILE_W;
    singleExport.height = TILE_H;
    const ctx = singleExport.getContext('2d');
    if (!ctx) return;
    drawPassportTile(
      ctx,
      activePortraitImg,
      {
        bgMode,
        photoName,
        formattedDate,
        datePrefix: s.passDatePrefix,
        zoom,
        offsetY,
        showCutBorder: false,
      },
      0,
      0,
      TILE_W,
      TILE_H
    );
    const blob = await new Promise<Blob | null>((resolve) => {
      singleExport.toBlob((b) => resolve(b), 'image/jpeg', 0.95);
    });
    if (!blob) return;
    triggerBlobDownload(blob, 'sadhanbox-passport-single.jpg');
    pushDataLayerEvent('file_download', {
      document_type: 'passport_single_jpg',
      file_extension: 'jpg',
    });
    onToolDownload();
    setHasDownloaded(true);
  };

  return (
    <ToolShell
      route="/passport-photo-maker"
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
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          void handleFileSelected(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />

      {!sourceImg ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void handleFileSelected(e.dataTransfer.files);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-sky-400 rounded-2xl p-8 sm:p-12 text-center bg-slate-50/70 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-3">
            <UserSquare2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[#0F172A]">{s.passUploadTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
            {s.passUploadHint}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer"
          >
            <ImagePlus className="w-4 h-4" />
            <span>{s.passUploadBtn}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-4">
            {/* Name & Date Inputs */}
            <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-4 space-y-3.5">
              <div>
                <label
                  htmlFor="passport-name-input"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  {s.passNameLabel}
                </label>
                <input
                  id="passport-name-input"
                  type="text"
                  maxLength={32}
                  value={photoName}
                  onChange={(e) => setPhotoName(e.target.value)}
                  placeholder={s.passNamePlaceholder}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label
                    htmlFor="passport-date-input"
                    className="block text-xs font-bold text-slate-700"
                  >
                    {s.passDateLabel}
                  </label>
                  {photoDate && (
                    <button
                      type="button"
                      onClick={() => setPhotoDate('')}
                      className="text-[11px] font-semibold text-blue-700 hover:underline cursor-pointer"
                    >
                      {s.passClearDateBtn}
                    </button>
                  )}
                </div>
                <input
                  id="passport-date-input"
                  type="date"
                  value={photoDate}
                  onChange={(e) => setPhotoDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            {/* Background Color Picker */}
            <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-slate-800">{s.passBgLabel}</div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { key: 'original', label: s.passBgOriginal, swatch: 'bg-slate-200' },
                    { key: 'white', label: s.passBgWhite, swatch: 'bg-white' },
                    { key: 'lightblue', label: s.passBgLightBlue, swatch: 'bg-[#DBEAFE]' },
                  ] as const
                ).map((item) => {
                  const active = bgMode === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleBgModeSelect(item.key)}
                      className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        active
                          ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                          : 'bg-white text-[#0F172A] border-slate-300 hover:border-blue-400'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-sm border border-slate-300 shrink-0 ${item.swatch}`}
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {sourceFile && !cutoutImg && !isRemovingBg && (
                <button
                  type="button"
                  onClick={() => {
                    if (bgMode === 'original') setBgMode('white');
                    void runAiBackgroundRemoval(sourceFile, false);
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1E40AF] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{s.passAiBgBtn}</span>
                </button>
              )}

              {isRemovingBg && (
                <div className="bg-white border border-blue-200 rounded-lg p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
                    <span className="inline-flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      {bgStatus}
                    </span>
                    <span className="tabular-nums">{bgProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2563EB] transition-all duration-200"
                      style={{ width: `${bgProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {!isRemovingBg && bgStatus && bgMode !== 'original' && cutoutImg && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#16A34A]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{bgStatus}</span>
                </div>
              )}
            </div>

            {/* A4 Sheet Photo Count & Framing Sliders */}
            <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-4 space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-800 mb-2">
                  {s.passSheetCountLabel}
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {([8, 12] as const).map((cnt) => {
                    const active = sheetCount === cnt;
                    return (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setSheetCount(cnt)}
                        className={`px-3 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          active
                            ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                            : 'bg-white text-[#0F172A] border-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {cnt === 8 ? s.passCount8 : s.passCount12}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{s.passZoomLabel}</span>
                    <span className="tabular-nums">{zoom.toFixed(2)}×</span>
                  </div>
                  <input
                    type="range"
                    min={0.9}
                    max={1.75}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-[#1E40AF] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{s.passOffsetYLabel}</span>
                    <span className="tabular-nums">{offsetY > 0 ? `+${offsetY}` : offsetY}</span>
                  </div>
                  <input
                    type="range"
                    min={-45}
                    max={45}
                    step={1}
                    value={offsetY}
                    onChange={(e) => setOffsetY(Number(e.target.value))}
                    className="w-full accent-[#1E40AF] cursor-pointer"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={showCutBorder}
                    onChange={(e) => setShowCutBorder(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#1E40AF] cursor-pointer"
                  />
                  <span>{s.passCutBorderLabel}</span>
                </label>
              </div>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{s.passChangePhotoBtn}</span>
            </button>
          </div>

          {/* Right Column: Single Tile + Live A4 Sheet Preview & Download Buttons */}
          <div className="lg:col-span-7 space-y-4">
            {/* Download Action Bar */}
            <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => void handleDownloadA4Pdf()}
                  disabled={isGeneratingPdf}
                  className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{s.passPdfGenerating}</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>{s.passDownloadPdfBtn}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => void handleDownloadA4Jpg()}
                  className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{s.passDownloadJpgBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleDownloadSingleJpg()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-[#0F172A] bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#1E40AF]" />
                  <span>{s.passDownloadSingleBtn}</span>
                </button>
              </div>
              {hasDownloaded && (
                <WhatsAppShareBar
                  uiLang={uiLang}
                  route="/passport-photo-maker"
                  toolTitle={toolMeta.title[uiLang]}
                  compact
                />
              )}
            </div>

            {/* Previews */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Single Passport Tile Preview */}
              <div className="md:col-span-4 border border-[#E2E8F0] rounded-xl overflow-hidden bg-slate-50">
                <div className="px-3.5 py-2.5 border-b border-[#E2E8F0] bg-white text-xs font-bold text-slate-700">
                  {s.passSinglePreviewTitle}
                </div>
                <div className="p-4 flex items-center justify-center">
                  <canvas
                    ref={singleCanvasRef}
                    className="w-36 h-auto rounded-md shadow-xs border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* A4 Printable Sheet Preview */}
              <div className="md:col-span-8 border border-[#E2E8F0] rounded-xl overflow-hidden bg-slate-100">
                <div className="px-3.5 py-2.5 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{s.passSheetPreviewTitle}</span>
                  <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
                    A4 · {sheetCount === 8 ? '4×2' : '4×3'}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-center">
                  <canvas
                    ref={sheetPreviewCanvasRef}
                    className="w-full max-w-[360px] h-auto rounded-md shadow-md border border-slate-300 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolShell>
  );
};
