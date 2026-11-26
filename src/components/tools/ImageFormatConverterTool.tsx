import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Crown,
  Download,
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { ToolShell } from './ToolShell';
import { pushDataLayerEvent } from '../../utils/gtm';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang, getSiteStrings } from '../../utils/siteI18n';

interface ImageFormatConverterToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
  onToolDownload: () => void;
}

type TargetFormatMime = 'image/jpeg' | 'image/png' | 'image/webp';

interface ConvItem {
  id: string;
  file: File;
  sourceUrl: string;
  sourceExt: string;
  origDims: { w: number; h: number } | null;
  resultBlob: Blob | null;
  resultUrl: string;
  resultMime: TargetFormatMime;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function detectFileFormatLabel(file: File): string {
  if (file.type) {
    const sub = file.type.split('/')[1] || '';
    if (sub) return sub.toUpperCase().replace('JPEG', 'JPG');
  }
  const match = file.name.match(/\.([^.]+)$/);
  return match ? match[1].toUpperCase() : 'IMG';
}

function mimeToExt(mime: TargetFormatMime): 'jpg' | 'png' | 'webp' {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  return 'jpg';
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
}

async function decodeImageToCanvasAndConvert(
  file: File,
  targetMime: TargetFormatMime,
  qualityPct: number,
  jpgBgColor: string
): Promise<{ blob: Blob; width: number; height: number }> {
  let width = 0;
  let height = 0;
  let drawable: CanvasImageSource | null = null;
  let bitmapToClose: ImageBitmap | null = null;

  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      width = bitmap.width;
      height = bitmap.height;
      drawable = bitmap;
      bitmapToClose = bitmap;
    } catch {
      drawable = null;
    }
  }

  if (!drawable) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Decode error'));
        image.src = url;
      });
      width = img.naturalWidth || img.width;
      height = img.naturalHeight || img.height;
      drawable = img;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  if (!drawable || width <= 0 || height <= 0) {
    if (bitmapToClose) bitmapToClose.close();
    throw new Error('Invalid image dimensions');
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    if (bitmapToClose) bitmapToClose.close();
    throw new Error('Canvas 2D unavailable');
  }

  if (targetMime === 'image/jpeg') {
    ctx.fillStyle = jpgBgColor || '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(drawable, 0, 0, width, height);

  if (bitmapToClose) {
    bitmapToClose.close();
  }

  const qualityVal =
    targetMime === 'image/png' ? 1 : Math.min(1, Math.max(0.5, qualityPct / 100));

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Format encoding failed'));
      },
      targetMime,
      qualityVal
    );
  });

  return { blob, width, height };
}

export const ImageFormatConverterTool: React.FC<ImageFormatConverterToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
  onToolDownload,
}) => {
  const s = getSiteStrings(uiLang);
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/image-converter')!;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<ConvItem[]>([]);
  const [targetMime, setTargetMime] = useState<TargetFormatMime>('image/jpeg');
  const [qualityPct, setQualityPct] = useState<number>(92);
  const [jpgBgColor, setJpgBgColor] = useState<string>('#FFFFFF');
  const [isConverting, setIsConverting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const itemsRef = useRef<ConvItem[]>([]);
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
      (f) =>
        f.type.startsWith('image/') ||
        /\.(jpe?g|png|webp|bmp|gif|avif)$/i.test(f.name)
    );

    if (valid.length === 0) {
      setErrorMsg(s.convFileTypeError);
      return;
    }

    setErrorMsg('');
    for (const old of items) {
      URL.revokeObjectURL(old.sourceUrl);
      if (old.resultUrl) URL.revokeObjectURL(old.resultUrl);
    }

    const chosen = isPro ? valid : [valid[0]];
    // Smart default: if user uploads PNG/WebP, default to JPG; if JPG, default to PNG
    const firstExt = detectFileFormatLabel(chosen[0]);
    if (firstExt === 'JPG') {
      setTargetMime('image/png');
    } else {
      setTargetMime('image/jpeg');
    }

    setItems(
      chosen.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        sourceUrl: URL.createObjectURL(file),
        sourceExt: detectFileFormatLabel(file),
        origDims: null,
        resultBlob: null,
        resultUrl: '',
        resultMime: targetMime,
      }))
    );
  };

  const handleClear = () => {
    for (const old of items) {
      URL.revokeObjectURL(old.sourceUrl);
      if (old.resultUrl) URL.revokeObjectURL(old.resultUrl);
    }
    setItems([]);
    setErrorMsg('');
  };

  const handleConvert = async () => {
    if (items.length === 0 || isConverting) return;
    setErrorMsg('');
    setIsConverting(true);

    try {
      const updated = [...items];
      for (let i = 0; i < updated.length; i++) {
        const entry = updated[i];
        const { blob, width, height } = await decodeImageToCanvasAndConvert(
          entry.file,
          targetMime,
          qualityPct,
          jpgBgColor
        );
        if (entry.resultUrl) URL.revokeObjectURL(entry.resultUrl);
        updated[i] = {
          ...entry,
          origDims: { w: width, h: height },
          resultBlob: blob,
          resultUrl: URL.createObjectURL(blob),
          resultMime: targetMime,
        };
      }
      setItems(updated);
    } catch {
      setErrorMsg(s.convErrorGeneric);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadItem = (item: ConvItem) => {
    if (!item.resultBlob) return;
    const ext = mimeToExt(item.resultMime);
    const base = item.file.name.replace(/\.[^.]+$/, '') || 'sadhanbox-image';
    const filename = `${base}-converted.${ext}`;
    triggerBlobDownload(item.resultBlob, filename);

    pushDataLayerEvent('file_download', {
      document_type: 'converted_image',
      source_format: item.sourceExt,
      target_format: ext,
      output_bytes: item.resultBlob.size,
    });
    onToolDownload();
  };

  const handleDownloadAll = () => {
    const ready = items.filter((it) => Boolean(it.resultBlob));
    ready.forEach((it, idx) => {
      window.setTimeout(() => handleDownloadItem(it), idx * 180);
    });
  };

  const primaryItem = items[0] || null;
  const readyCount = items.filter((it) => Boolean(it.resultBlob)).length;

  return (
    <ToolShell
      route="/image-converter"
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
        accept="image/png,image/webp,image/jpeg,image/bmp,image/gif,image/*"
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
          className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-8 sm:p-12 text-center bg-slate-50/70 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center mx-auto mb-3">
            <ImagePlus className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">{s.convUploadTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
            {s.convUploadHint}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer"
          >
            <ImagePlus className="w-4 h-4" />
            <span>{s.convUploadBtn}</span>
          </button>

          {errorMsg && (
            <div
              role="alert"
              className="mt-4 max-w-md mx-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Controls Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Target Format Segmented Buttons */}
              <div className="md:col-span-5 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  {s.convFormatLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { mime: 'image/jpeg', label: 'JPG' },
                      { mime: 'image/png', label: 'PNG' },
                      { mime: 'image/webp', label: 'WebP' },
                    ] as { mime: TargetFormatMime; label: string }[]
                  ).map((opt) => {
                    const active = targetMime === opt.mime;
                    return (
                      <button
                        key={opt.mime}
                        type="button"
                        onClick={() => setTargetMime(opt.mime)}
                        className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quality Slider (for JPG/WebP) or PNG lossless note */}
              <div className="md:col-span-4 space-y-2">
                {targetMime === 'image/png' ? (
                  <p className="text-xs text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2.5 leading-snug">
                    {s.convPngLosslessHint}
                  </p>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <label htmlFor="conv-quality-slider">{s.convQualityLabel}</label>
                      <span className="tabular-nums text-[#1E40AF]">{qualityPct}%</span>
                    </div>
                    <input
                      id="conv-quality-slider"
                      type="range"
                      min={60}
                      max={100}
                      step={2}
                      value={qualityPct}
                      onChange={(e) => setQualityPct(Number(e.target.value))}
                      className="w-full accent-[#1E40AF] cursor-pointer"
                    />
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{s.convConvertingBtn}</span>
                    </>
                  ) : (
                    <span>{s.convConvertBtn}</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title={s.convAddMoreBtn}
                  className="px-3 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  title={s.convClearBtn}
                  className="px-3 py-2.5 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Optional Background Fill selector when converting to JPG */}
            {targetMime === 'image/jpeg' && (
              <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-200/80">
                <span className="text-xs font-semibold text-slate-600">{s.convBgFillLabel}:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { color: '#FFFFFF', label: s.convBgWhite },
                    { color: '#000000', label: s.convBgBlack },
                    { color: '#F1F5F9', label: s.convBgSoft },
                  ].map((bg) => (
                    <button
                      key={bg.color}
                      type="button"
                      onClick={() => setJpgBgColor(bg.color)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        jpgBgColor === bg.color
                          ? 'border-[#1E40AF] bg-blue-50 text-[#1E40AF]'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                        style={{ backgroundColor: bg.color }}
                        aria-hidden="true"
                      />
                      <span>{bg.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isPro && (
              <div className="flex items-center justify-between gap-2 pt-1 text-xs text-slate-600">
                <span>{s.convBatchProHint}</span>
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
          </div>

          {/* Single vs Batch Display */}
          {items.length === 1 && primaryItem ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Original Image */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="px-4 py-2.5 border-b border-slate-200 bg-white flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700">{s.convOriginalLabel}</span>
                  <span className="text-xs font-bold text-slate-700 tabular-nums">
                    {primaryItem.sourceExt} · {formatFileSize(primaryItem.file.size)}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-center min-h-[260px]">
                  <img
                    src={primaryItem.sourceUrl}
                    alt={s.convOriginalLabel}
                    className="max-h-[300px] w-auto object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* Converted Output */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="px-4 py-2.5 border-b border-slate-200 bg-white flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700">{s.convOutputLabel}</span>
                  {primaryItem.resultBlob ? (
                    <span className="text-xs font-bold text-emerald-700 tabular-nums">
                      {mimeToExt(primaryItem.resultMime).toUpperCase()} ·{' '}
                      {formatFileSize(primaryItem.resultBlob.size)}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">{s.convWaitingLabel}</span>
                  )}
                </div>

                <div className="p-4 flex flex-col items-center justify-center min-h-[260px] gap-3">
                  {primaryItem.resultUrl && primaryItem.resultBlob ? (
                    <>
                      <img
                        src={primaryItem.resultUrl}
                        alt={s.convOutputLabel}
                        className="max-h-[260px] w-auto object-contain rounded-lg"
                      />
                      <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                          <span className="tabular-nums">
                            {mimeToExt(primaryItem.resultMime).toUpperCase()} ·{' '}
                            {formatFileSize(primaryItem.resultBlob.size)}
                            {primaryItem.origDims
                              ? ` · ${primaryItem.origDims.w}×${primaryItem.origDims.h}px`
                              : ''}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDownloadItem(primaryItem)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>
                            {s.convDownloadBtn} {mimeToExt(primaryItem.resultMime).toUpperCase()}
                          </span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500 text-center max-w-xs">
                      {s.convWaitingLabel}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {readyCount > 1 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleDownloadAll}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {s.convDownloadAllBtn} ({readyCount})
                    </span>
                  </button>
                </div>
              )}

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
                        {item.resultBlob
                          ? `${mimeToExt(item.resultMime).toUpperCase()} · ${formatFileSize(
                              item.resultBlob.size
                            )}`
                          : `${item.sourceExt} · ${formatFileSize(item.file.size)}`}
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
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>
                            {s.convDownloadBtn} {mimeToExt(item.resultMime).toUpperCase()}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
};
