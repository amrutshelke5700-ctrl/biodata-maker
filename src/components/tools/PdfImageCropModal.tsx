import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Loader2,
  Maximize2,
  RotateCcw,
  RotateCw,
  X,
} from 'lucide-react';
import { cropAndRotateRegionToFile, NormalizedCropRegion } from '../../utils/cropImage';
import { UiLang } from '../../utils/siteI18n';

type AspectPreset = 'free' | 'original' | 'a4-portrait' | 'a4-landscape' | 'square';
type DragHandle = 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';

interface PdfImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  file: File | null;
  uiLang: UiLang;
  onClose: () => void;
  onApply: (updatedFile: File) => void;
}

const MIN_REGION = 0.06;

const MODAL_COPY: Record<
  UiLang,
  {
    title: string;
    subtitle: string;
    aspectLabel: string;
    aspectFree: string;
    aspectOriginal: string;
    aspectA4Portrait: string;
    aspectA4Landscape: string;
    aspectSquare: string;
    rotateLeft: string;
    rotateRight: string;
    fullSelectionBtn: string;
    resetBtn: string;
    cancelBtn: string;
    applyBtn: string;
    applyingBtn: string;
    errorMsg: string;
    closeAria: string;
    selectionLabel: string;
  }
> = {
  en: {
    title: 'Crop & Rotate Image',
    subtitle: 'Drag corners or edges to select any region and rotate in 90° steps.',
    aspectLabel: 'Crop Shape',
    aspectFree: 'Free',
    aspectOriginal: 'Original',
    aspectA4Portrait: 'A4 Portrait',
    aspectA4Landscape: 'A4 Landscape',
    aspectSquare: '1:1 Square',
    rotateLeft: 'Rotate -90°',
    rotateRight: 'Rotate +90°',
    fullSelectionBtn: 'Full Image',
    resetBtn: 'Reset',
    cancelBtn: 'Cancel',
    applyBtn: 'Apply Crop',
    applyingBtn: 'Applying...',
    errorMsg: 'Could not crop this image. Please try again.',
    closeAria: 'Close crop modal',
    selectionLabel: 'Selection',
  },
  mr: {
    title: 'इमेज क्रॉप आणि रोटेट करा',
    subtitle: 'हवा तो भाग निवडण्यासाठी कोपरे किंवा कडा ड्रॅग करा आणि ९०° मध्ये फिरवा.',
    aspectLabel: 'क्रॉप आकार',
    aspectFree: 'फ्री (मोकळा)',
    aspectOriginal: 'मूळ आकार',
    aspectA4Portrait: 'A4 उभा',
    aspectA4Landscape: 'A4 आडवा',
    aspectSquare: '1:1 चौरस',
    rotateLeft: '-९०° फिरवा',
    rotateRight: '+९०° फिरवा',
    fullSelectionBtn: 'संपूर्ण इमेज',
    resetBtn: 'रीसेट',
    cancelBtn: 'रद्द करा',
    applyBtn: 'क्रॉप लागू करा',
    applyingBtn: 'प्रक्रिया सुरू...',
    errorMsg: 'इमेज क्रॉप करता आली नाही. कृपया पुन्हा प्रयत्न करा.',
    closeAria: 'क्रॉप विंडो बंद करा',
    selectionLabel: 'निवडलेला भाग',
  },
  hi: {
    title: 'इमेज क्रॉप और रोटेट करें',
    subtitle: 'हिस्सा चुनने के लिए कोने या किनारे ड्रैग करें और 90° में घुमाएँ।',
    aspectLabel: 'क्रॉप आकार',
    aspectFree: 'फ्री',
    aspectOriginal: 'मूल आकार',
    aspectA4Portrait: 'A4 पोर्ट्रेट',
    aspectA4Landscape: 'A4 लैंडस्केप',
    aspectSquare: '1:1 चौकोर',
    rotateLeft: '-90° घुमाएँ',
    rotateRight: '+90° घुमाएँ',
    fullSelectionBtn: 'पूरी इमेज',
    resetBtn: 'रीसेट',
    cancelBtn: 'रद्द करें',
    applyBtn: 'क्रॉप लागू करें',
    applyingBtn: 'प्रोसेस हो रहा है...',
    errorMsg: 'इमेज क्रॉप नहीं हो सकी। कृपया दोबारा कोशिश करें।',
    closeAria: 'क्रॉप विंडो बंद करें',
    selectionLabel: 'चयनित क्षेत्र',
  },
};

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function fitRegionToAspect(
  region: NormalizedCropRegion,
  targetPixelAspect: number,
  rotW: number,
  rotH: number
): NormalizedCropRegion {
  const cx = region.x + region.w / 2;
  const cy = region.y + region.h / 2;
  const imgAspect = rotW / rotH;
  const normRatio = targetPixelAspect / imgAspect;

  let w = region.w;
  let h = w / normRatio;
  if (h > 1) {
    h = 1;
    w = h * normRatio;
  }
  if (w > 1) {
    w = 1;
    h = w / normRatio;
  }
  if (w < MIN_REGION) {
    w = MIN_REGION;
    h = w / normRatio;
  }
  if (h < MIN_REGION) {
    h = MIN_REGION;
    w = h * normRatio;
  }

  const x = clamp(cx - w / 2, 0, 1 - w);
  const y = clamp(cy - h / 2, 0, 1 - h);
  return { x, y, w, h };
}

export const PdfImageCropModal: React.FC<PdfImageCropModalProps> = ({
  isOpen,
  imageSrc,
  file,
  uiLang,
  onClose,
  onApply,
}) => {
  const c = MODAL_COPY[uiLang];
  const [rotation, setRotation] = useState<number>(0);
  const [aspectPreset, setAspectPreset] = useState<AspectPreset>('free');
  const [region, setRegion] = useState<NormalizedCropRegion>({ x: 0.06, y: 0.06, w: 0.88, h: 0.88 });
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number }>({ w: 1, h: 1 });
  const [rotatedPreviewUrl, setRotatedPreviewUrl] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const stageWrapRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageBounds, setStageBounds] = useState<{ w: number; h: number }>({ w: 500, h: 300 });
  const dragStateRef = useRef<{
    handle: DragHandle;
    startX: number;
    startY: number;
    startRegion: NormalizedCropRegion;
  } | null>(null);

  useEffect(() => {
    const el = stageWrapRef.current;
    if (!el || !isOpen) return;
    const updateBounds = () => {
      const w = Math.max(160, el.clientWidth - 24);
      const h = Math.max(160, el.clientHeight - 24);
      setStageBounds({ w, h });
    };
    updateBounds();
    const ro = new ResizeObserver(updateBounds);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  const normalizedRot = ((rotation % 360) + 360) % 360;
  const swapDims = normalizedRot === 90 || normalizedRot === 270;
  const rotW = swapDims ? naturalSize.h : naturalSize.w;
  const rotH = swapDims ? naturalSize.w : naturalSize.h;

  // Reset modal state whenever opened for a new image
  useEffect(() => {
    if (!isOpen) return;
    setRotation(0);
    setAspectPreset('free');
    setRegion({ x: 0.06, y: 0.06, w: 0.88, h: 0.88 });
    setErrorMsg('');
  }, [isOpen, imageSrc]);

  // Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSaving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, isSaving, onClose]);

  // Render an upright rotated preview image so coordinate mapping stays 1:1
  useEffect(() => {
    if (!isOpen || !imageSrc) return;
    let cancelled = false;
    let createdUrl = '';

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      const w = img.naturalWidth || img.width || 1;
      const h = img.naturalHeight || img.height || 1;
      setNaturalSize({ w, h });

      if (normalizedRot === 0) {
        setRotatedPreviewUrl(imageSrc);
        return;
      }

      const outW = swapDims ? h : w;
      const outH = swapDims ? w : h;
      const previewScale = Math.min(1, 1400 / Math.max(outW, outH));
      const canvasW = Math.max(1, Math.round(outW * previewScale));
      const canvasH = Math.max(1, Math.round(outH * previewScale));

      const canvas = document.createElement('canvas');
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setRotatedPreviewUrl(imageSrc);
        return;
      }

      ctx.translate(canvasW / 2, canvasH / 2);
      ctx.rotate((normalizedRot * Math.PI) / 180);
      const drawW = Math.round(w * previewScale);
      const drawH = Math.round(h * previewScale);
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

      canvas.toBlob(
        (blob) => {
          if (cancelled) return;
          if (!blob) {
            setRotatedPreviewUrl(imageSrc);
            return;
          }
          createdUrl = URL.createObjectURL(blob);
          setRotatedPreviewUrl(createdUrl);
        },
        'image/png',
        0.92
      );
    };
    img.src = imageSrc;

    return () => {
      cancelled = true;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [isOpen, imageSrc, normalizedRot, swapDims]);

  const lockedPixelAspect = useMemo(() => {
    switch (aspectPreset) {
      case 'original':
        return rotW / rotH;
      case 'a4-portrait':
        return 210 / 297;
      case 'a4-landscape':
        return 297 / 210;
      case 'square':
        return 1;
      case 'free':
      default:
        return null;
    }
  }, [aspectPreset, rotW, rotH]);

  const handleSelectAspect = (preset: AspectPreset) => {
    setAspectPreset(preset);
    if (preset === 'free') return;
    const targetAspect =
      preset === 'original'
        ? rotW / rotH
        : preset === 'a4-portrait'
          ? 210 / 297
          : preset === 'a4-landscape'
            ? 297 / 210
            : 1;
    setRegion((prev) => fitRegionToAspect(prev, targetAspect, rotW, rotH));
  };

  const handleRotateStep = (delta: -90 | 90) => {
    setRotation((prev) => (prev + delta + 360) % 360);
    setRegion((prev) => {
      if (delta === 90) {
        return {
          x: clamp(1 - (prev.y + prev.h), 0, 1 - MIN_REGION),
          y: clamp(prev.x, 0, 1 - MIN_REGION),
          w: clamp(prev.h, MIN_REGION, 1),
          h: clamp(prev.w, MIN_REGION, 1),
        };
      }
      return {
        x: clamp(prev.y, 0, 1 - MIN_REGION),
        y: clamp(1 - (prev.x + prev.w), 0, 1 - MIN_REGION),
        w: clamp(prev.h, MIN_REGION, 1),
        h: clamp(prev.w, MIN_REGION, 1),
      };
    });
    if (aspectPreset === 'a4-portrait') {
      setAspectPreset('a4-landscape');
    } else if (aspectPreset === 'a4-landscape') {
      setAspectPreset('a4-portrait');
    }
  };

  const beginDrag = useCallback(
    (handle: DragHandle, e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      dragStateRef.current = {
        handle,
        startX: e.clientX,
        startY: e.clientY,
        startRegion: { ...region },
      };
    },
    [region]
  );

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const drag = dragStateRef.current;
      const stage = stageRef.current;
      if (!drag || !stage) return;

      const rect = stage.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const dx = (e.clientX - drag.startX) / rect.width;
      const dy = (e.clientY - drag.startY) / rect.height;
      const s = drag.startRegion;

      if (drag.handle === 'move') {
        setRegion({
          x: clamp(s.x + dx, 0, 1 - s.w),
          y: clamp(s.y + dy, 0, 1 - s.h),
          w: s.w,
          h: s.h,
        });
        return;
      }

      let left = s.x;
      let right = s.x + s.w;
      let top = s.y;
      let bottom = s.y + s.h;

      if (drag.handle.includes('w')) {
        left = clamp(s.x + dx, 0, right - MIN_REGION);
      }
      if (drag.handle.includes('e')) {
        right = clamp(s.x + s.w + dx, left + MIN_REGION, 1);
      }
      if (drag.handle.includes('n')) {
        top = clamp(s.y + dy, 0, bottom - MIN_REGION);
      }
      if (drag.handle.includes('s')) {
        bottom = clamp(s.y + s.h + dy, top + MIN_REGION, 1);
      }

      let w = right - left;
      let h = bottom - top;

      if (lockedPixelAspect !== null) {
        const normRatio = lockedPixelAspect / (rotW / rotH);
        const horizontalChange = drag.handle === 'e' || drag.handle === 'w';
        if (horizontalChange) {
          h = w / normRatio;
          if (top + h > 1) {
            h = 1 - top;
            w = h * normRatio;
            if (drag.handle.includes('w')) left = right - w;
          }
        } else {
          w = h * normRatio;
          if (drag.handle.includes('w')) {
            left = right - w;
            if (left < 0) {
              left = 0;
              w = right;
              h = w / normRatio;
            }
          } else if (left + w > 1) {
            w = 1 - left;
            h = w / normRatio;
          }
          if (drag.handle.includes('n')) {
            top = bottom - h;
            if (top < 0) {
              top = 0;
              h = bottom;
              w = h * normRatio;
            }
          } else if (top + h > 1) {
            h = 1 - top;
            w = h * normRatio;
          }
        }
      }

      w = clamp(w, MIN_REGION, 1 - left);
      h = clamp(h, MIN_REGION, 1 - top);
      setRegion({ x: left, y: top, w, h });
    };

    const onPointerUp = () => {
      dragStateRef.current = null;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [lockedPixelAspect, rotW, rotH]);

  if (!isOpen || !imageSrc || !file) return null;

  const cropPixelW = Math.max(1, Math.round(region.w * rotW));
  const cropPixelH = Math.max(1, Math.round(region.h * rotH));

  const handleReset = () => {
    setRotation(0);
    setAspectPreset('free');
    setRegion({ x: 0.06, y: 0.06, w: 0.88, h: 0.88 });
    setErrorMsg('');
  };

  const handleSelectFull = () => {
    setAspectPreset('free');
    setRegion({ x: 0, y: 0, w: 1, h: 1 });
  };

  const handleApply = async () => {
    setIsSaving(true);
    setErrorMsg('');
    try {
      const updatedFile = await cropAndRotateRegionToFile(
        imageSrc,
        normalizedRot,
        region,
        file
      );
      onApply(updatedFile);
      onClose();
    } catch {
      setErrorMsg(c.errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const aspectOptions: Array<{ id: AspectPreset; label: string }> = [
    { id: 'free', label: c.aspectFree },
    { id: 'original', label: c.aspectOriginal },
    { id: 'a4-portrait', label: c.aspectA4Portrait },
    { id: 'a4-landscape', label: c.aspectA4Landscape },
    { id: 'square', label: c.aspectSquare },
  ];

  // Compute responsive display size inside actual measured wrapper bounds
  const stageScale = Math.min(stageBounds.w / rotW, stageBounds.h / rotH);
  const displayW = Math.max(80, Math.round(rotW * stageScale));
  const displayH = Math.max(80, Math.round(rotH * stageScale));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-crop-modal-title"
      onClick={() => {
        if (!isSaving) onClose();
      }}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-100">
          <div>
            <h2 id="pdf-crop-modal-title" className="text-base font-bold text-slate-900">
              {c.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{c.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label={c.closeAria}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Interactive Crop Stage */}
          <div
            ref={stageWrapRef}
            className="w-full h-72 sm:h-80 bg-slate-950 rounded-xl flex items-center justify-center p-3 overflow-hidden select-none"
          >
            <div
              ref={stageRef}
              style={{ width: displayW, height: displayH }}
              className="relative touch-none select-none shadow-lg"
            >
              {rotatedPreviewUrl && (
                <img
                  src={rotatedPreviewUrl}
                  alt={file.name}
                  draggable={false}
                  className="w-full h-full object-fill block pointer-events-none select-none"
                />
              )}

              {/* Selection Box with darkened surround via box-shadow */}
              <div
                onPointerDown={(e) => beginDrag('move', e)}
                style={{
                  left: `${region.x * 100}%`,
                  top: `${region.y * 100}%`,
                  width: `${region.w * 100}%`,
                  height: `${region.h * 100}%`,
                  boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.58)',
                }}
                className="absolute border-2 border-white cursor-move touch-none"
              >
                {/* Rule-of-thirds guides */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/35" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/35" />
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-white/35" />
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-white/35" />
                </div>

                {/* 4 Corner Handles */}
                <button
                  type="button"
                  aria-label="Resize top left"
                  onPointerDown={(e) => beginDrag('nw', e)}
                  className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-slate-900 rounded-sm cursor-nwse-resize"
                />
                <button
                  type="button"
                  aria-label="Resize top right"
                  onPointerDown={(e) => beginDrag('ne', e)}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-slate-900 rounded-sm cursor-nesw-resize"
                />
                <button
                  type="button"
                  aria-label="Resize bottom left"
                  onPointerDown={(e) => beginDrag('sw', e)}
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-slate-900 rounded-sm cursor-nesw-resize"
                />
                <button
                  type="button"
                  aria-label="Resize bottom right"
                  onPointerDown={(e) => beginDrag('se', e)}
                  className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-slate-900 rounded-sm cursor-nwse-resize"
                />

                {/* 4 Edge Handles */}
                <button
                  type="button"
                  aria-label="Resize top"
                  onPointerDown={(e) => beginDrag('n', e)}
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-7 h-3 bg-white border border-slate-900 rounded-full cursor-ns-resize"
                />
                <button
                  type="button"
                  aria-label="Resize bottom"
                  onPointerDown={(e) => beginDrag('s', e)}
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-7 h-3 bg-white border border-slate-900 rounded-full cursor-ns-resize"
                />
                <button
                  type="button"
                  aria-label="Resize left"
                  onPointerDown={(e) => beginDrag('w', e)}
                  className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-7 bg-white border border-slate-900 rounded-full cursor-ew-resize"
                />
                <button
                  type="button"
                  aria-label="Resize right"
                  onPointerDown={(e) => beginDrag('e', e)}
                  className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-7 bg-white border border-slate-900 rounded-full cursor-ew-resize"
                />
              </div>
            </div>
          </div>

          {/* Aspect Ratio Presets & Live Dimensions */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mr-1">
                {c.aspectLabel}
              </span>
              {aspectOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectAspect(opt.id)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    aspectPreset === opt.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-semibold text-slate-600 tabular-nums">
              {c.selectionLabel}: {cropPixelW} × {cropPixelH} px · {normalizedRot}°
            </span>
          </div>

          {/* 90-degree Rotation & Selection Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleRotateStep(-90)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{c.rotateLeft}</span>
              </button>
              <button
                type="button"
                onClick={() => handleRotateStep(90)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{c.rotateRight}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectFull}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{c.fullSelectionBtn}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
              >
                {c.resetBtn}
              </button>
            </div>
          </div>

          {errorMsg && <p className="text-xs font-medium text-rose-600">{errorMsg}</p>}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
            >
              {c.cancelBtn}
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{c.applyingBtn}</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{c.applyBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
