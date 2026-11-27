import React, { useEffect, useRef, useState } from 'react';
import { removeBackground, Config } from '@imgly/background-removal';
import {
  AlertCircle,
  Briefcase,
  Crown,
  Download,
  Eraser,
  Heart,
  ImagePlus,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { ToolShell } from './ToolShell';
import { WhatsAppShareBar } from './WhatsAppShareBar';
import { pushDataLayerEvent } from '../../utils/gtm';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang, getSiteStrings } from '../../utils/siteI18n';

interface BackgroundRemoverToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
  onToolDownload: () => void;
  onUsePhotoInMaker: (dataUrl: string, target: 'biodata' | 'resume') => void;
}

type BgOption = 'transparent' | 'white' | 'blue';

interface BgBatchItem {
  id: string;
  file: File;
  sourceUrl: string;
  transparentBlob: Blob | null;
  transparentUrl: string;
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

async function compositeWithBackground(pngBlob: Blob, bgHex: string | null): Promise<Blob> {
  if (!bgHex) return pngBlob;

  const imgUrl = URL.createObjectURL(pngBlob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Image load failed'));
      el.src = imgUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return pngBlob;

    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    return await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b || pngBlob), 'image/png', 1);
    });
  } finally {
    URL.revokeObjectURL(imgUrl);
  }
}

export const BackgroundRemoverTool: React.FC<BackgroundRemoverToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
  onToolDownload,
  onUsePhotoInMaker,
}) => {
  const s = getSiteStrings(uiLang);
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/background-remover')!;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<BgBatchItem[]>([]);
  const [selectedBg, setSelectedBg] = useState<BgOption>('transparent');
  const [useHdModel, setUseHdModel] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const itemsRef = useRef<BgBatchItem[]>([]);
  itemsRef.current = items;

  useEffect(() => {
    return () => {
      for (const item of itemsRef.current) {
        URL.revokeObjectURL(item.sourceUrl);
        if (item.transparentUrl) URL.revokeObjectURL(item.transparentUrl);
      }
    };
  }, []);

  const bgColors: Record<BgOption, { label: string; hex: string | null; swatchClass: string }> = {
    transparent: {
      label: s.bgTransparentLabel,
      hex: null,
      swatchClass:
        'bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)] bg-[length:12px_12px] bg-[position:0_0,0_6px,6px_-6px,-6px_0] bg-white',
    },
    white: { label: s.bgWhiteLabel, hex: '#FFFFFF', swatchClass: 'bg-white' },
    blue: { label: s.bgBlueLabel, hex: '#1D4ED8', swatchClass: 'bg-blue-700' },
  };

  const handleFilesSelected = (fileList: FileList | null, append = false) => {
    if (!fileList || fileList.length === 0) return;
    const validFiles = Array.from(fileList).filter(
      (f) => f.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(f.name)
    );
    if (validFiles.length === 0) {
      setErrorMsg(s.bgFileTypeError);
      return;
    }

    setErrorMsg('');
    setStatusMsg('');
    setProgress(0);

    // Free users process 1 file at a time; Pro users can batch upload multiple files
    const chosen = isPro ? validFiles : [validFiles[0]];
    const nextEntries: BgBatchItem[] = chosen.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      sourceUrl: URL.createObjectURL(file),
      transparentBlob: null,
      transparentUrl: '',
    }));

    if (append && isPro) {
      setItems((prev) => [...prev, ...nextEntries]);
    } else {
      for (const old of items) {
        URL.revokeObjectURL(old.sourceUrl);
        if (old.transparentUrl) URL.revokeObjectURL(old.transparentUrl);
      }
      setItems(nextEntries);
    }
  };

  const handleRemoveBackground = async () => {
    if (items.length === 0 || isProcessing) return;
    setIsProcessing(true);
    setErrorMsg('');
    setProgress(5);
    setStatusMsg(s.bgLoadingModel);

    try {
      const modelChoice = isPro && useHdModel ? 'isnet_fp16' : 'isnet_quint8';
      const updated = [...items];

      for (let idx = 0; idx < updated.length; idx++) {
        const currentItem = updated[idx];
        const config: Config = {
          model: modelChoice,
          output: {
            format: 'image/png',
            quality: 1,
          },
          progress: (key: string, current: number, total: number) => {
            if (total > 0) {
              const singlePct = Math.min(99, Math.max(5, Math.round((current / total) * 100)));
              const overallPct = Math.round(
                ((idx + singlePct / 100) / updated.length) * 100
              );
              setProgress(Math.min(99, overallPct));
              const prefix =
                updated.length > 1 ? `[${idx + 1}/${updated.length}] ` : '';
              if (key.includes('fetch')) {
                setStatusMsg(`${prefix}${s.bgDownloadingModel}: ${singlePct}%`);
              } else {
                setStatusMsg(`${prefix}${s.bgRemovingProgress}: ${singlePct}%`);
              }
            }
          },
        };

        const resultBlob = await removeBackground(currentItem.file, config);
        if (currentItem.transparentUrl) URL.revokeObjectURL(currentItem.transparentUrl);
        updated[idx] = {
          ...currentItem,
          transparentBlob: resultBlob,
          transparentUrl: URL.createObjectURL(resultBlob),
        };
        setItems([...updated]);
      }

      setProgress(100);
      setStatusMsg(s.bgDoneStatus);
    } catch {
      setErrorMsg(s.bgErrorGeneric);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = async (item: BgBatchItem) => {
    if (!item.transparentBlob) return;
    const bgHex = bgColors[selectedBg].hex;
    const finalBlob = await compositeWithBackground(item.transparentBlob, bgHex);
    const baseName = item.file.name.replace(/\.[^.]+$/, '') || 'sadhanbox-photo';
    const suffix = selectedBg === 'transparent' ? 'transparent' : selectedBg;
    triggerBlobDownload(finalBlob, `${baseName}-${suffix}.png`);

    pushDataLayerEvent('file_download', {
      document_type: 'background_removed_png',
      background_color: selectedBg,
      file_extension: 'png',
    });
    onToolDownload();
  };

  const handleDownloadAllBatch = async () => {
    const readyItems = items.filter((it) => it.transparentBlob);
    for (const item of readyItems) {
      await handleDownloadSingle(item);
    }
  };

  const handleUseInBiodataOrResume = async (
    item: BgBatchItem,
    target: 'biodata' | 'resume'
  ) => {
    if (!item.transparentBlob) return;
    const bgHex = bgColors[selectedBg].hex;
    const finalBlob = await compositeWithBackground(item.transparentBlob, bgHex);
    const dataUrl = await blobToDataUrl(finalBlob);
    onUsePhotoInMaker(dataUrl, target);
  };

  const primaryItem = items[0] || null;
  const hasAnyResult = items.some((it) => Boolean(it.transparentUrl));

  const previewBackdropStyle: React.CSSProperties =
    selectedBg === 'transparent'
      ? {
          backgroundImage:
            'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0_75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
          backgroundColor: '#ffffff',
        }
      : {
          backgroundColor: bgColors[selectedBg].hex || '#ffffff',
        };

  return (
    <ToolShell
      route="/background-remover"
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
        accept="image/png,image/jpeg,image/webp"
        multiple={isPro}
        onChange={(e) => {
          handleFilesSelected(e.target.files, false);
          e.target.value = '';
        }}
        className="hidden"
      />

      {items.length === 0 ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFilesSelected(e.dataTransfer.files, false);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-violet-400 rounded-2xl p-8 sm:p-12 text-center bg-slate-50/70 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mx-auto mb-3">
            <ImagePlus className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">{s.bgUploadTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{s.bgUploadHint}</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer"
          >
            <ImagePlus className="w-4 h-4" />
            <span>{s.bgUploadBtn}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-[#E2E8F0] rounded-xl p-3.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleRemoveBackground}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{s.bgProcessingBtn}</span>
                  </>
                ) : (
                  <>
                    <Eraser className="w-4 h-4" />
                    <span>{s.bgRemoveBtn}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{s.bgChooseAnotherBtn}</span>
              </button>

              {/* Pro HD Model Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (!isPro) {
                    onOpenProModal();
                    return;
                  }
                  setUseHdModel((prev) => !prev);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                  isPro && useHdModel
                    ? 'bg-amber-100 border-amber-400 text-amber-950'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-amber-400'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>{s.bgHdModeLabel}</span>
              </button>
            </div>

            {hasAnyResult && primaryItem && (
              <button
                type="button"
                onClick={() =>
                  items.length > 1
                    ? void handleDownloadAllBatch()
                    : void handleDownloadSingle(primaryItem)
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>
                  {items.length > 1 ? `${s.bgBatchDownloadAll} (${items.length})` : s.bgDownloadPngBtn}
                </span>
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-violet-900">
                <span>{statusMsg}</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-violet-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-700 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <div
              role="alert"
              className="flex items-start gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm font-medium text-rose-700"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Background Color Selector after Removal */}
          {hasAnyResult && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="text-xs font-bold text-slate-800 mb-2.5">{s.bgSelectBgLabel}</div>
              <div className="flex flex-wrap gap-2.5">
                {(['transparent', 'white', 'blue'] as const).map((bgKey) => {
                  const cfg = bgColors[bgKey];
                  const active = selectedBg === bgKey;
                  return (
                    <button
                      key={bgKey}
                      type="button"
                      onClick={() => setSelectedBg(bgKey)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-sm border border-slate-300 shrink-0 ${cfg.swatchClass}`}
                      />
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Single Preview or Batch Grid */}
          {items.length === 1 && primaryItem ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="px-4 py-2.5 border-b border-slate-200 bg-white text-xs font-bold text-slate-700">
                  {s.bgOriginalLabel}
                </div>
                <div className="p-4 flex items-center justify-center min-h-[280px]">
                  <img
                    src={primaryItem.sourceUrl}
                    alt={s.bgOriginalLabel}
                    className="max-h-[340px] w-auto object-contain rounded-lg"
                  />
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="px-4 py-2.5 border-b border-slate-200 bg-white text-xs font-bold text-slate-700">
                  {s.bgResultLabel}
                </div>
                <div
                  style={primaryItem.transparentUrl ? previewBackdropStyle : undefined}
                  className="p-4 flex items-center justify-center min-h-[280px]"
                >
                  {primaryItem.transparentUrl ? (
                    <img
                      src={primaryItem.transparentUrl}
                      alt={s.bgResultLabel}
                      className="max-h-[340px] w-auto object-contain"
                    />
                  ) : (
                    <p className="text-xs text-slate-500 text-center max-w-xs">
                      {s.bgEmptyResultHint}
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
                  <div className="px-3.5 py-2 border-b border-slate-200 bg-white text-xs font-semibold text-slate-800 truncate">
                    {item.file.name}
                  </div>
                  <div
                    style={item.transparentUrl ? previewBackdropStyle : undefined}
                    className="p-3 flex items-center justify-center h-52"
                  >
                    <img
                      src={item.transparentUrl || item.sourceUrl}
                      alt={item.file.name}
                      className="max-h-44 w-auto object-contain rounded"
                    />
                  </div>
                  {item.transparentBlob && (
                    <div className="p-3 bg-white border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => void handleDownloadSingle(item)}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{s.bgDownloadPngBtn}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Cross-Promotion & WhatsApp Share below Download once result is ready */}
          {hasAnyResult && primaryItem?.transparentBlob && (
            <div className="space-y-3">
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
              <WhatsAppShareBar
                uiLang={uiLang}
                route="/background-remover"
                toolTitle={toolMeta.title[uiLang]}
                compact
              />
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
};
