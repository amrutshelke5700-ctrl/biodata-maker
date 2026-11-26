import React, { useEffect, useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Crown,
  Download,
  FileDown,
  Heart,
  ImagePlus,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { ToolShell } from './ToolShell';
import { pushDataLayerEvent } from '../../utils/gtm';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang, getSiteStrings } from '../../utils/siteI18n';

interface ImageCompressorToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
  onToolDownload: () => void;
  onUsePhotoInMaker: (dataUrl: string, target: 'biodata' | 'resume') => void;
}

type OutputMimeType = 'image/jpeg' | 'image/webp' | 'image/png';

interface CompItem {
  id: string;
  file: File;
  sourceUrl: string;
  resultBlob: Blob | null;
  resultUrl: string;
  resultMime: OutputMimeType;
  dimensions: { w: number; h: number } | null;
}

const KB_PRESETS = [20, 50, 100, 200];

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

async function blobToDataUrl(blob: Blob): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}

async function loadImageFromFile(file: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Image load error'));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function encodeCanvas(
  img: HTMLImageElement,
  width: number,
  height: number,
  mimeType: OutputMimeType,
  quality: number
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Compression failed'));
      },
      mimeType,
      quality
    );
  });
}

async function compressToTargetBytes(
  file: File,
  targetKB: number,
  mimeType: OutputMimeType,
  pngNoteText: string
): Promise<{ blob: Blob; effectiveMime: OutputMimeType; note: string }> {
  const targetBytes = Math.max(5, targetKB) * 1024;
  const maxMB = Math.max(0.005, targetBytes / (1024 * 1024));

  let seedBlob: Blob = file;
  let effectiveMime: OutputMimeType = mimeType;
  let note = '';

  try {
    seedBlob = await imageCompression(file, {
      maxSizeMB: maxMB,
      maxWidthOrHeight: targetKB <= 30 ? 800 : targetKB <= 80 ? 1200 : 1920,
      useWebWorker: true,
      fileType: effectiveMime,
      initialQuality: 0.85,
    });
  } catch {
    seedBlob = file;
  }

  if (seedBlob.size <= targetBytes && seedBlob.type === effectiveMime) {
    return { blob: seedBlob, effectiveMime, note };
  }

  const img = await loadImageFromFile(file);
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  if (effectiveMime === 'image/png') {
    const testPng = await encodeCanvas(
      img,
      Math.min(origW, 600),
      Math.min(origH, 600),
      'image/png',
      1
    );
    if (testPng.size > targetBytes) {
      effectiveMime = 'image/jpeg';
      note = pngNoteText;
    }
  }

  let scale = 1;
  const maxDim = Math.max(origW, origH);
  if (maxDim > 1800 && targetKB <= 150) {
    scale = 1800 / maxDim;
  }

  let bestBlob: Blob = seedBlob;

  for (let pass = 0; pass < 7; pass++) {
    const w = Math.max(64, Math.round(origW * scale));
    const h = Math.max(64, Math.round(origH * scale));

    if (effectiveMime === 'image/png') {
      const candidate = await encodeCanvas(img, w, h, 'image/png', 1);
      bestBlob = candidate;
      if (candidate.size <= targetBytes) {
        return { blob: candidate, effectiveMime, note };
      }
      scale *= 0.72;
      continue;
    }

    let low = 0.12;
    let high = 0.94;
    let passBest: Blob | null = null;

    for (let i = 0; i < 8; i++) {
      const mid = (low + high) / 2;
      const candidate = await encodeCanvas(img, w, h, effectiveMime, mid);
      if (candidate.size <= targetBytes) {
        passBest = candidate;
        low = mid;
      } else {
        high = mid;
      }
    }

    if (passBest) {
      return { blob: passBest, effectiveMime, note };
    }

    bestBlob = await encodeCanvas(img, w, h, effectiveMime, 0.12);
    scale *= 0.72;
  }

  return { blob: bestBlob, effectiveMime, note };
}

export const ImageCompressorTool: React.FC<ImageCompressorToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
  onToolDownload,
  onUsePhotoInMaker,
}) => {
  const s = getSiteStrings(uiLang);
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/image-compressor')!;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<CompItem[]>([]);
  const [targetKB, setTargetKB] = useState<number>(50);
  const [customInput, setCustomInput] = useState<string>('50');
  const [outputMime, setOutputMime] = useState<OutputMimeType>('image/jpeg');
  const [isCompressing, setIsCompressing] = useState(false);
  const [infoNote, setInfoNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const itemsRef = useRef<CompItem[]>([]);
  itemsRef.current = items;

  useEffect(() => {
    return () => {
      for (const it of itemsRef.current) {
        URL.revokeObjectURL(it.sourceUrl);
        if (it.resultUrl) URL.revokeObjectURL(it.resultUrl);
      }
    };
  }, []);

  const handleSelectFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const valid = Array.from(fileList).filter(
      (f) => f.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(f.name)
    );
    if (valid.length === 0) {
      setErrorMsg(s.compFileTypeError);
      return;
    }

    setErrorMsg('');
    setInfoNote('');

    const chosen = isPro ? valid : [valid[0]];
    for (const old of items) {
      URL.revokeObjectURL(old.sourceUrl);
      if (old.resultUrl) URL.revokeObjectURL(old.resultUrl);
    }

    setItems(
      chosen.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        sourceUrl: URL.createObjectURL(file),
        resultBlob: null,
        resultUrl: '',
        resultMime: outputMime,
        dimensions: null,
      }))
    );
  };

  const handlePresetClick = (kb: number) => {
    setTargetKB(kb);
    setCustomInput(String(kb));
    setErrorMsg('');
  };

  const handleCustomKbChange = (val: string) => {
    setCustomInput(val);
    const parsed = Number(val);
    if (Number.isFinite(parsed) && parsed >= 5 && parsed <= 10240) {
      setTargetKB(Math.round(parsed));
    }
  };

  const handleCompress = async () => {
    if (items.length === 0 || isCompressing) return;
    const parsed = Number(customInput);
    if (!Number.isFinite(parsed) || parsed < 5 || parsed > 10240) {
      setErrorMsg(s.compRangeError);
      return;
    }

    setErrorMsg('');
    setInfoNote('');
    setIsCompressing(true);

    try {
      const updated = [...items];
      let latestNote = '';
      for (let i = 0; i < updated.length; i++) {
        const entry = updated[i];
        const { blob, effectiveMime, note } = await compressToTargetBytes(
          entry.file,
          Math.round(parsed),
          outputMime,
          s.compPngNote
        );
        if (note) latestNote = note;
        const img = await loadImageFromFile(blob);
        if (entry.resultUrl) URL.revokeObjectURL(entry.resultUrl);
        updated[i] = {
          ...entry,
          resultBlob: blob,
          resultUrl: URL.createObjectURL(blob),
          resultMime: effectiveMime,
          dimensions: { w: img.naturalWidth || img.width, h: img.naturalHeight || img.height },
        };
      }
      setItems(updated);
      setInfoNote(latestNote);
    } catch {
      setErrorMsg(s.compErrorGeneric);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownloadItem = (item: CompItem) => {
    if (!item.resultBlob) return;
    const ext =
      item.resultMime === 'image/webp'
        ? 'webp'
        : item.resultMime === 'image/png'
          ? 'png'
          : 'jpg';
    const base = item.file.name.replace(/\.[^.]+$/, '') || 'sadhanbox-image';
    const filename = `${base}-${targetKB}kb.${ext}`;
    triggerBlobDownload(item.resultBlob, filename);

    pushDataLayerEvent('file_download', {
      document_type: 'compressed_image',
      target_kb: targetKB,
      output_bytes: item.resultBlob.size,
      file_extension: ext,
    });
    onToolDownload();
  };

  const handleUseInBiodataOrResume = async (
    item: CompItem,
    target: 'biodata' | 'resume'
  ) => {
    if (!item.resultBlob) return;
    const dataUrl = await blobToDataUrl(item.resultBlob);
    onUsePhotoInMaker(dataUrl, target);
  };

  const primaryItem = items[0] || null;
  const hasAnyResult = items.some((it) => Boolean(it.resultBlob));
  const reductionPct =
    primaryItem && primaryItem.resultBlob
      ? Math.max(
          0,
          Math.round(
            ((primaryItem.file.size - primaryItem.resultBlob.size) / primaryItem.file.size) * 100
          )
        )
      : 0;

  return (
    <ToolShell
      route="/image-compressor"
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
        multiple={isPro}
        onChange={(e) => {
          handleSelectFiles(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />

      {items.length === 0 ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleSelectFiles(e.dataTransfer.files);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-2xl p-8 sm:p-12 text-center bg-slate-50/70 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <ImagePlus className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">{s.compUploadTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{s.compUploadHint}</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <ImagePlus className="w-4 h-4" />
            <span>{s.compUploadBtn}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Controls Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Target KB Presets + Custom KB */}
              <div className="md:col-span-6 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  {s.compTargetLabel}
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {KB_PRESETS.map((kb) => (
                    <button
                      key={kb}
                      type="button"
                      onClick={() => handlePresetClick(kb)}
                      className={`px-3 py-2 text-xs font-bold rounded-lg border tabular-nums transition-colors cursor-pointer ${
                        targetKB === kb
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {kb} KB
                    </button>
                  ))}
                  <div className="inline-flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-emerald-600/20">
                    <input
                      type="number"
                      min={5}
                      max={10240}
                      value={customInput}
                      onChange={(e) => handleCustomKbChange(e.target.value)}
                      aria-label="Custom KB"
                      className="w-20 px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none tabular-nums"
                    />
                    <span className="px-2 text-xs font-semibold text-slate-500 bg-slate-50 border-l border-slate-200 py-2">
                      KB
                    </span>
                  </div>
                </div>
              </div>

              {/* Output Format */}
              <div className="md:col-span-3 space-y-2">
                <label htmlFor="compressor-format" className="block text-xs font-bold text-slate-700">
                  {s.compFormatLabel}
                </label>
                <select
                  id="compressor-format"
                  value={outputMime}
                  onChange={(e) => setOutputMime(e.target.value as OutputMimeType)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                >
                  <option value="image/jpeg">{s.compFormatJpg}</option>
                  <option value="image/webp">{s.compFormatWebp}</option>
                  <option value="image/png">{s.compFormatPng}</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCompress}
                  disabled={isCompressing}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isCompressing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{s.compWorkingBtn}</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      <span>
                        {items.length > 1 ? `${s.compBatchCompressAll} (${items.length})` : s.compActionBtn}
                      </span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title={s.bgChooseAnotherBtn}
                  className="px-3 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isPro && (
              <div className="flex items-center justify-between gap-2 pt-1 text-xs text-slate-600">
                <span>{s.compBatchProHint}</span>
                <button
                  type="button"
                  onClick={onOpenProModal}
                  className="inline-flex items-center gap-1 px-2.5 py-1 font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg cursor-pointer shrink-0"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-700" />
                  <span>{s.goProHeaderBtn}</span>
                </button>
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="flex items-start gap-2 px-3.5 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {infoNote && (
              <p className="text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2">
                {infoNote}
              </p>
            )}
          </div>

          {/* Single vs Batch Display */}
          {items.length === 1 && primaryItem ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Original Card */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="px-4 py-2.5 border-b border-slate-200 bg-white flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{s.compOriginalLabel}</span>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">
                    {formatKb(primaryItem.file.size)}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-center min-h-[260px]">
                  <img
                    src={primaryItem.sourceUrl}
                    alt={s.compOriginalLabel}
                    className="max-h-[300px] w-auto object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* Compressed Result Card */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="px-4 py-2.5 border-b border-slate-200 bg-white flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700">{s.compResultLabel}</span>
                  {primaryItem.resultBlob ? (
                    <div className="flex items-center gap-2 text-xs tabular-nums">
                      <span className="font-bold text-emerald-700">
                        {formatKb(primaryItem.resultBlob.size)}
                      </span>
                      {reductionPct > 0 && (
                        <span className="text-slate-500 font-semibold">(-{reductionPct}%)</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">{s.compWaitingLabel}</span>
                  )}
                </div>

                <div className="p-4 flex flex-col items-center justify-center min-h-[260px] gap-3">
                  {primaryItem.resultUrl && primaryItem.resultBlob ? (
                    <>
                      <img
                        src={primaryItem.resultUrl}
                        alt={s.compResultLabel}
                        className="max-h-[260px] w-auto object-contain rounded-lg"
                      />
                      <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="tabular-nums">
                            {formatKb(primaryItem.resultBlob.size)}
                            {primaryItem.dimensions
                              ? ` · ${primaryItem.dimensions.w}×${primaryItem.dimensions.h}px`
                              : ''}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDownloadItem(primaryItem)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>{s.compDownloadBtn}</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500 text-center max-w-xs">
                      {s.compEmptyHint}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col"
                >
                  <div className="px-3.5 py-2 border-b border-slate-200 bg-white flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {item.file.name}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 tabular-nums shrink-0">
                      {item.resultBlob ? formatKb(item.resultBlob.size) : formatKb(item.file.size)}
                    </span>
                  </div>
                  <div className="p-3 flex items-center justify-center h-44">
                    <img
                      src={item.resultUrl || item.sourceUrl}
                      alt={item.file.name}
                      className="max-h-36 w-auto object-contain rounded"
                    />
                  </div>
                  {item.resultBlob && (
                    <div className="p-3 bg-white border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleDownloadItem(item)}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{s.compDownloadBtn}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Cross-Promotion below Download once result is ready */}
          {hasAnyResult && primaryItem?.resultBlob && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm font-semibold text-slate-800">{s.crossPromoTitle}</p>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => void handleUseInBiodataOrResume(primaryItem, 'biodata')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                  <span>{s.crossPromoUseBiodata}</span>
                </button>
                <button
                  type="button"
                  onClick={() => void handleUseInBiodataOrResume(primaryItem, 'resume')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>{s.crossPromoUseResume}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
};
