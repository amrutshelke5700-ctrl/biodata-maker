import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Fingerprint,
  ImagePlus,
  Loader2,
  PenTool,
  RefreshCw,
} from 'lucide-react';
import { ToolShell } from './ToolShell';
import { pushDataLayerEvent } from '../../utils/gtm';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang, getSiteStrings } from '../../utils/siteI18n';

interface SignatureResizeToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
  onToolDownload: () => void;
}

type PresetId = 'sig-140x60' | 'thumb-240x240' | 'sig-300x120' | 'custom';

interface PresetSpec {
  id: PresetId;
  width: number;
  height: number;
  minKb: number;
  maxKb: number;
}

const PRESETS: Record<Exclude<PresetId, 'custom'>, PresetSpec> = {
  'sig-140x60': { id: 'sig-140x60', width: 140, height: 60, minKb: 10, maxKb: 20 },
  'thumb-240x240': { id: 'thumb-240x240', width: 240, height: 240, minKb: 10, maxKb: 20 },
  'sig-300x120': { id: 'sig-300x120', width: 300, height: 120, minKb: 10, maxKb: 20 },
};

function formatKb(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
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
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
  });
}

function estimatePaperLuminance(data: Uint8ClampedArray, w: number, h: number): number {
  const sampleCoords: [number, number][] = [];
  const stepX = Math.max(1, Math.floor(w / 10));
  const stepY = Math.max(1, Math.floor(h / 10));
  for (let x = 0; x < w; x += stepX) {
    sampleCoords.push([x, 0], [x, h - 1]);
  }
  for (let y = 0; y < h; y += stepY) {
    sampleCoords.push([0, y], [w - 1, y]);
  }

  let total = 0;
  let count = 0;
  for (const [sx, sy] of sampleCoords) {
    const idx = (sy * w + sx) * 4;
    const a = data[idx + 3];
    if (a < 20) continue;
    const luma = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
    total += luma;
    count++;
  }
  return count > 0 ? total / count : 245;
}

function createPreparedSourceCanvas(
  img: HTMLImageElement,
  autoCrop: boolean,
  cleanPaper: boolean
): HTMLCanvasElement {
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = origW;
  srcCanvas.height = origH;
  const srcCtx = srcCanvas.getContext('2d');
  if (!srcCtx) return srcCanvas;

  // Flatten onto pure white background in case input is transparent PNG
  srcCtx.fillStyle = '#FFFFFF';
  srcCtx.fillRect(0, 0, origW, origH);
  srcCtx.drawImage(img, 0, 0, origW, origH);

  const imgData = srcCtx.getImageData(0, 0, origW, origH);
  const data = imgData.data;
  const paperLuma = estimatePaperLuminance(data, origW, origH);
  const inkLumaCutoff = Math.min(228, paperLuma - 22);

  let minX = origW;
  let minY = origH;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < origH; y++) {
    for (let x = 0; x < origW; x++) {
      const idx = (y * origW + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);

      const isInk = luma < inkLumaCutoff || (chroma > 28 && luma < paperLuma - 12);

      if (autoCrop && isInk) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }

      if (cleanPaper) {
        if (!isInk && luma >= paperLuma - 28 && chroma < 32) {
          data[idx] = 255;
          data[idx + 1] = 255;
          data[idx + 2] = 255;
        } else if (isInk) {
          // Gently deepen ink clarity
          data[idx] = Math.max(0, Math.round(r * 0.85));
          data[idx + 1] = Math.max(0, Math.round(g * 0.85));
          data[idx + 2] = Math.max(0, Math.round(b * 0.85));
        }
      }
    }
  }

  if (cleanPaper) {
    srcCtx.putImageData(imgData, 0, 0);
  }

  if (!autoCrop || maxX <= minX || maxY <= minY) {
    return srcCanvas;
  }

  const boxW = maxX - minX + 1;
  const boxH = maxY - minY + 1;
  const padX = Math.max(6, Math.round(boxW * 0.06));
  const padY = Math.max(6, Math.round(boxH * 0.06));

  const cropX = Math.max(0, minX - padX);
  const cropY = Math.max(0, minY - padY);
  const cropW = Math.min(origW - cropX, boxW + padX * 2);
  const cropH = Math.min(origH - cropY, boxH + padY * 2);

  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = Math.max(1, cropW);
  croppedCanvas.height = Math.max(1, cropH);
  const cropCtx = croppedCanvas.getContext('2d');
  if (cropCtx) {
    cropCtx.fillStyle = '#FFFFFF';
    cropCtx.fillRect(0, 0, cropW, cropH);
    cropCtx.drawImage(srcCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
  }

  return croppedCanvas;
}

async function padJpegToTargetBytes(jpegBlob: Blob, targetBytes: number): Promise<Blob> {
  if (jpegBlob.size >= targetBytes) return jpegBlob;
  const buf = new Uint8Array(await jpegBlob.arrayBuffer());
  if (buf.length < 4 || buf[buf.length - 2] !== 0xff || buf[buf.length - 1] !== 0xd9) {
    return jpegBlob;
  }

  const needed = targetBytes - buf.length;
  // Standard JPEG COM marker (0xFF 0xFE) adds 4 header bytes + payload bytes
  if (needed <= 4) return jpegBlob;
  const payloadLen = Math.min(65531, needed - 4);
  const segLen = payloadLen + 2;

  const padded = new Uint8Array(buf.length + payloadLen + 4);
  const headLen = buf.length - 2;
  padded.set(buf.subarray(0, headLen), 0);
  padded[headLen] = 0xff;
  padded[headLen + 1] = 0xfe;
  padded[headLen + 2] = (segLen >> 8) & 0xff;
  padded[headLen + 3] = segLen & 0xff;
  // Fill comment payload with ASCII space (0x20)
  padded.fill(0x20, headLen + 4, headLen + 4 + payloadLen);
  padded[padded.length - 2] = 0xff;
  padded[padded.length - 1] = 0xd9;

  return new Blob([padded], { type: 'image/jpeg' });
}

async function renderExactSizeJpg(
  preparedCanvas: HTMLCanvasElement,
  targetW: number,
  targetH: number,
  minKb: number,
  maxKb: number
): Promise<Blob> {
  const outCanvas = document.createElement('canvas');
  outCanvas.width = targetW;
  outCanvas.height = targetH;
  const outCtx = outCanvas.getContext('2d');
  if (!outCtx) throw new Error('Canvas unavailable');

  outCtx.fillStyle = '#FFFFFF';
  outCtx.fillRect(0, 0, targetW, targetH);

  const margin = Math.max(2, Math.round(Math.min(targetW, targetH) * 0.04));
  const availW = Math.max(1, targetW - margin * 2);
  const availH = Math.max(1, targetH - margin * 2);
  const scale = Math.min(availW / preparedCanvas.width, availH / preparedCanvas.height);

  const drawW = Math.max(1, Math.round(preparedCanvas.width * scale));
  const drawH = Math.max(1, Math.round(preparedCanvas.height * scale));
  const drawX = Math.round((targetW - drawW) / 2);
  const drawY = Math.round((targetH - drawH) / 2);

  outCtx.imageSmoothingEnabled = true;
  outCtx.imageSmoothingQuality = 'high';
  outCtx.drawImage(preparedCanvas, drawX, drawY, drawW, drawH);

  const toJpg = (q: number) =>
    new Promise<Blob>((resolve, reject) => {
      outCanvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('JPEG encoding failed'));
        },
        'image/jpeg',
        q
      );
    });

  const minBytes = Math.round(minKb * 1024);
  const maxBytes = Math.round(maxKb * 1024);

  const maxQualityBlob = await toJpg(0.98);
  if (maxQualityBlob.size <= maxBytes) {
    if (maxQualityBlob.size >= minBytes) {
      return maxQualityBlob;
    }
    const sweetSpot = Math.min(maxBytes, Math.round((minBytes + maxBytes) / 2));
    return await padJpegToTargetBytes(maxQualityBlob, sweetSpot);
  }

  let low = 0.08;
  let high = 0.96;
  let bestUnder: Blob | null = null;

  for (let i = 0; i < 10; i++) {
    const mid = (low + high) / 2;
    const candidate = await toJpg(mid);
    if (candidate.size <= maxBytes) {
      bestUnder = candidate;
      low = mid;
    } else {
      high = mid;
    }
  }

  if (bestUnder) {
    if (bestUnder.size < minBytes) {
      const sweetSpot = Math.min(maxBytes, Math.round((minBytes + maxBytes) / 2));
      return await padJpegToTargetBytes(bestUnder, sweetSpot);
    }
    return bestUnder;
  }

  return await toJpg(0.05);
}

export const SignatureResizeTool: React.FC<SignatureResizeToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
  onToolDownload,
}) => {
  const s = getSiteStrings(uiLang);
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/signature-resize')!;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [sourceDims, setSourceDims] = useState<{ w: number; h: number } | null>(null);

  const [preset, setPreset] = useState<PresetId>('sig-140x60');
  const [widthPx, setWidthPx] = useState<string>('140');
  const [heightPx, setHeightPx] = useState<string>('60');
  const [minKbInput, setMinKbInput] = useState<string>('10');
  const [maxKbInput, setMaxKbInput] = useState<string>('20');
  const [autoCrop, setAutoCrop] = useState<boolean>(true);
  const [cleanPaper, setCleanPaper] = useState<boolean>(true);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string>('');
  const [resultDims, setResultDims] = useState<{ w: number; h: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const urlsRef = useRef<{ sourceUrl: string; resultUrl: string }>({
    sourceUrl: '',
    resultUrl: '',
  });
  urlsRef.current = { sourceUrl, resultUrl };

  useEffect(() => {
    return () => {
      if (urlsRef.current.sourceUrl) URL.revokeObjectURL(urlsRef.current.sourceUrl);
      if (urlsRef.current.resultUrl) URL.revokeObjectURL(urlsRef.current.resultUrl);
    };
  }, []);

  const runProcessing = useCallback(
    async (
      img: HTMLImageElement,
      wStr: string,
      hStr: string,
      minStr: string,
      maxStr: string,
      doAutoCrop: boolean,
      doCleanPaper: boolean
    ) => {
      const targetW = Math.round(Number(wStr));
      const targetH = Math.round(Number(hStr));
      const minKb = Number(minStr);
      const maxKb = Number(maxStr);

      if (
        !Number.isFinite(targetW) ||
        !Number.isFinite(targetH) ||
        targetW < 30 ||
        targetW > 2000 ||
        targetH < 30 ||
        targetH > 2000 ||
        !Number.isFinite(minKb) ||
        !Number.isFinite(maxKb) ||
        minKb < 5 ||
        maxKb > 500 ||
        minKb > maxKb
      ) {
        setErrorMsg(s.sigRangeError);
        return;
      }

      setErrorMsg('');
      setIsProcessing(true);
      try {
        const prepared = createPreparedSourceCanvas(img, doAutoCrop, doCleanPaper);
        const blob = await renderExactSizeJpg(prepared, targetW, targetH, minKb, maxKb);
        const nextResultUrl = URL.createObjectURL(blob);
        if (urlsRef.current.resultUrl) URL.revokeObjectURL(urlsRef.current.resultUrl);

        setResultBlob(blob);
        setResultUrl(nextResultUrl);
        setResultDims({ w: targetW, h: targetH });
      } catch {
        setErrorMsg(s.sigErrorGeneric);
      } finally {
        setIsProcessing(false);
      }
    },
    [s.sigErrorGeneric, s.sigRangeError]
  );

  const handleFileSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
      setErrorMsg(s.sigFileTypeError);
      return;
    }

    setErrorMsg('');
    const nextUrl = URL.createObjectURL(file);
    try {
      const loaded = await loadImageFromUrl(nextUrl);
      if (urlsRef.current.sourceUrl) URL.revokeObjectURL(urlsRef.current.sourceUrl);
      if (urlsRef.current.resultUrl) URL.revokeObjectURL(urlsRef.current.resultUrl);

      setSourceFile(file);
      setSourceUrl(nextUrl);
      setSourceImg(loaded);
      setSourceDims({
        w: loaded.naturalWidth || loaded.width,
        h: loaded.naturalHeight || loaded.height,
      });
      setResultBlob(null);
      setResultUrl('');
      setResultDims(null);

      void runProcessing(
        loaded,
        widthPx,
        heightPx,
        minKbInput,
        maxKbInput,
        autoCrop,
        cleanPaper
      );
    } catch {
      URL.revokeObjectURL(nextUrl);
      setErrorMsg(s.sigFileTypeError);
    }
  };

  const handlePresetSelect = (nextPreset: PresetId) => {
    setPreset(nextPreset);
    if (nextPreset === 'custom') return;
    const spec = PRESETS[nextPreset];
    const wStr = String(spec.width);
    const hStr = String(spec.height);
    const minStr = String(spec.minKb);
    const maxStr = String(spec.maxKb);
    setWidthPx(wStr);
    setHeightPx(hStr);
    setMinKbInput(minStr);
    setMaxKbInput(maxStr);

    if (sourceImg) {
      void runProcessing(sourceImg, wStr, hStr, minStr, maxStr, autoCrop, cleanPaper);
    }
  };

  const handleDownloadJpg = () => {
    if (!resultBlob || !resultDims) return;
    const prefix = preset === 'thumb-240x240' ? 'sadhanbox-thumb' : 'sadhanbox-signature';
    const filename = `${prefix}-${resultDims.w}x${resultDims.h}.jpg`;
    triggerBlobDownload(resultBlob, filename);

    pushDataLayerEvent('file_download', {
      document_type: preset === 'thumb-240x240' ? 'thumb_resized_jpg' : 'signature_resized_jpg',
      width_px: resultDims.w,
      height_px: resultDims.h,
      output_bytes: resultBlob.size,
      file_extension: 'jpg',
    });
    onToolDownload();
  };

  return (
    <ToolShell
      route="/signature-resize"
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
          className="border-2 border-dashed border-slate-300 hover:border-teal-400 rounded-2xl p-8 sm:p-12 text-center bg-slate-50/70 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3">
            <PenTool className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[#0F172A]">{s.sigUploadTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
            {s.sigUploadHint}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer"
          >
            <ImagePlus className="w-4 h-4" />
            <span>{s.sigUploadBtn}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Controls Panel */}
          <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-4 sm:p-5 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">{s.sigPresetLabel}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {(
                  [
                    {
                      id: 'sig-140x60',
                      label: s.sigPreset140,
                      icon: <PenTool className="w-3.5 h-3.5 shrink-0" />,
                    },
                    {
                      id: 'thumb-240x240',
                      label: s.sigPreset240,
                      icon: <Fingerprint className="w-3.5 h-3.5 shrink-0" />,
                    },
                    {
                      id: 'sig-300x120',
                      label: s.sigPreset300,
                      icon: <PenTool className="w-3.5 h-3.5 shrink-0" />,
                    },
                    {
                      id: 'custom',
                      label: s.sigPresetCustom,
                      icon: null,
                    },
                  ] as const
                ).map((item) => {
                  const active = preset === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handlePresetSelect(item.id)}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                          : 'bg-white text-[#0F172A] border-slate-300 hover:border-blue-400'
                      }`}
                    >
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimension & KB Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label
                  htmlFor="sig-width-input"
                  className="block text-[11px] font-bold text-slate-700 mb-1"
                >
                  {s.sigWidthLabel}
                </label>
                <input
                  id="sig-width-input"
                  type="number"
                  min={30}
                  max={2000}
                  value={widthPx}
                  onChange={(e) => {
                    setPreset('custom');
                    setWidthPx(e.target.value);
                  }}
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-lg text-[#0F172A] tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label
                  htmlFor="sig-height-input"
                  className="block text-[11px] font-bold text-slate-700 mb-1"
                >
                  {s.sigHeightLabel}
                </label>
                <input
                  id="sig-height-input"
                  type="number"
                  min={30}
                  max={2000}
                  value={heightPx}
                  onChange={(e) => {
                    setPreset('custom');
                    setHeightPx(e.target.value);
                  }}
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-lg text-[#0F172A] tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label
                  htmlFor="sig-minkb-input"
                  className="block text-[11px] font-bold text-slate-700 mb-1"
                >
                  {s.sigMinKbLabel}
                </label>
                <input
                  id="sig-minkb-input"
                  type="number"
                  min={5}
                  max={500}
                  value={minKbInput}
                  onChange={(e) => setMinKbInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-lg text-[#0F172A] tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label
                  htmlFor="sig-maxkb-input"
                  className="block text-[11px] font-bold text-slate-700 mb-1"
                >
                  {s.sigMaxKbLabel}
                </label>
                <input
                  id="sig-maxkb-input"
                  type="number"
                  min={5}
                  max={500}
                  value={maxKbInput}
                  onChange={(e) => setMaxKbInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-lg text-[#0F172A] tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            {/* Auto-Crop & Clean White Paper Toggles + Action Buttons */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1 border-t border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 lg:pt-0">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoCrop}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setAutoCrop(next);
                      if (sourceImg) {
                        void runProcessing(
                          sourceImg,
                          widthPx,
                          heightPx,
                          minKbInput,
                          maxKbInput,
                          next,
                          cleanPaper
                        );
                      }
                    }}
                    className="w-4 h-4 mt-0.5 rounded accent-[#1E40AF] cursor-pointer shrink-0"
                  />
                  <span>
                    <span className="block text-xs font-bold text-slate-800">
                      {s.sigAutoCropLabel}
                    </span>
                    <span className="block text-[11px] text-slate-500">{s.sigAutoCropHint}</span>
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cleanPaper}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setCleanPaper(next);
                      if (sourceImg) {
                        void runProcessing(
                          sourceImg,
                          widthPx,
                          heightPx,
                          minKbInput,
                          maxKbInput,
                          autoCrop,
                          next
                        );
                      }
                    }}
                    className="w-4 h-4 mt-0.5 rounded accent-[#1E40AF] cursor-pointer shrink-0"
                  />
                  <span>
                    <span className="block text-xs font-bold text-slate-800">
                      {s.sigCleanPaperLabel}
                    </span>
                    <span className="block text-[11px] text-slate-500">{s.sigCleanPaperHint}</span>
                  </span>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    void runProcessing(
                      sourceImg,
                      widthPx,
                      heightPx,
                      minKbInput,
                      maxKbInput,
                      autoCrop,
                      cleanPaper
                    )
                  }
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{s.sigProcessingBtn}</span>
                    </>
                  ) : (
                    <span>{s.sigProcessBtn}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{s.sigChangeBtn}</span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="flex items-start gap-2 px-3.5 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Original Preview */}
            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-slate-50">
              <div className="px-4 py-2.5 border-b border-[#E2E8F0] bg-white flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700">{s.sigOriginalLabel}</span>
                <span className="text-xs font-bold text-slate-600 tabular-nums">
                  {sourceFile ? formatKb(sourceFile.size) : ''}
                  {sourceDims ? ` · ${sourceDims.w}×${sourceDims.h} px` : ''}
                </span>
              </div>
              <div className="p-4 flex items-center justify-center min-h-[220px]">
                <img
                  src={sourceUrl}
                  alt={s.sigOriginalLabel}
                  className="max-h-[240px] w-auto object-contain rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            {/* Resized Output Preview */}
            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-slate-50 flex flex-col">
              <div className="px-4 py-2.5 border-b border-[#E2E8F0] bg-white flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700">{s.sigResultLabel}</span>
                {resultBlob && resultDims && (
                  <span className="text-xs font-bold text-[#16A34A] tabular-nums">
                    {formatKb(resultBlob.size)} · {resultDims.w}×{resultDims.h} px
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col items-center justify-center min-h-[220px] gap-4">
                {resultUrl && resultBlob && resultDims ? (
                  <>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-center">
                      <img
                        src={resultUrl}
                        alt={s.sigResultLabel}
                        style={{
                          width: `${Math.max(resultDims.w, 140)}px`,
                          maxWidth: '100%',
                          height: 'auto',
                        }}
                        className="border border-dashed border-slate-300"
                      />
                    </div>

                    <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A]">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{s.sigReadyBadge}</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleDownloadJpg}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>{s.sigDownloadJpgBtn}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolShell>
  );
};
