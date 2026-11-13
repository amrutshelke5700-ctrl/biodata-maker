import React, { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import {
  Check,
  Circle,
  Loader2,
  RotateCw,
  Square,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { AppLanguage, PhotoShape } from '../types/biodata';
import { getCroppedImageDataUrl } from '../utils/cropImage';
import { toLocalizedDigits } from '../utils/smartFieldOptions';
import { getCopy } from '../utils/translations';

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  photoShape: PhotoShape;
  language: AppLanguage;
  onChangeShape: (shape: PhotoShape) => void;
  onClose: () => void;
  onSaveCropped: (croppedDataUrl: string) => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  photoShape,
  language,
  onChangeShape,
  onClose,
  onSaveCropped,
}) => {
  const copy = getCopy(language);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [cropError, setCropError] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCropError('');
  }, [isOpen, imageSrc]);

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

  const onCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  if (!isOpen || !imageSrc) return null;

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsSaving(true);
    setCropError('');
    try {
      const targetWidth = 600;
      const targetHeight = photoShape === 'circle' ? 600 : 900;
      const dataUrl = await getCroppedImageDataUrl(
        imageSrc,
        croppedAreaPixels,
        rotation,
        targetWidth,
        targetHeight
      );
      onSaveCropped(dataUrl);
      onClose();
    } catch {
      setCropError(copy.cropError);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
      onClick={() => {
        if (!isSaving) onClose();
      }}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-100">
          <div>
            <h2 id="crop-modal-title" className="text-base font-bold text-slate-900">
              {copy.cropTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{copy.cropSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label={copy.closeAriaLabel}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Stage */}
        <div className="p-5 space-y-4">
          <div className="relative w-full h-72 sm:h-80 bg-slate-900 rounded-xl overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={photoShape === 'circle' ? 1 : 600 / 900}
              cropShape={photoShape === 'circle' ? 'round' : 'rect'}
              showGrid={true}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Controls: Zoom + Rotate + Frame Shape */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, Number((z - 0.2).toFixed(2))))}
                aria-label={copy.cropZoomOutLabel}
                className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                aria-label={copy.cropZoomLabel}
                className="flex-1 accent-slate-900 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, Number((z + 0.2).toFixed(2))))}
                aria-label={copy.cropZoomInLabel}
                className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium text-slate-600 w-10 text-right tabular-nums">
                {toLocalizedDigits(zoom.toFixed(1), language)}×
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{copy.photoFrameLabel}</span>
                <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => onChangeShape('circle')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      photoShape === 'circle'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Circle className="w-3 h-3" />
                    {copy.frameCircle}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeShape('square')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      photoShape === 'square'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Square className="w-3 h-3" />
                    {copy.frameSquare}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                {copy.cropRotateBtn}
              </button>
            </div>
          </div>

          {cropError && <p className="text-xs font-medium text-rose-600">{cropError}</p>}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
            >
              {copy.cropCancelBtn}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {copy.cropSavingBtn}
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  {copy.cropSaveBtn}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
