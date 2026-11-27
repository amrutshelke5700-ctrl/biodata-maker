import React, { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import {
  AlertCircle,
  Camera,
  ImagePlus,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react';
import { AppLanguage } from '../types/biodata';
import { getCopy } from '../utils/translations';

interface QrScannerModalProps {
  isOpen: boolean;
  language: AppLanguage;
  onClose: () => void;
  onScanSuccess: (scannedUrl: string) => void;
}

export function extractQrPortfolioValue(rawText: string): string {
  const trimmed = (rawText || '').trim();
  if (!trimmed) return '';

  // Handle vCard business card QR codes (extract URL field if present)
  if (/^BEGIN:VCARD/i.test(trimmed)) {
    const lines = trimmed.split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^URL(?:;[^:]*)?:(.+)$/i);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  }

  return trimmed;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  language,
  onClose,
  onScanSuccess,
}) => {
  const copy = getCopy(language);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasScannedRef = useRef(false);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isStarting, setIsStarting] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const handleDecodedText = useCallback(
    (rawText: string) => {
      if (hasScannedRef.current) return;
      const extracted = extractQrPortfolioValue(rawText);
      if (!extracted) return;
      hasScannedRef.current = true;
      stopCamera();
      onScanSuccess(extracted);
      onClose();
    },
    [onClose, onScanSuccess, stopCamera]
  );

  const startCamera = useCallback(
    async (preferredFacing: 'environment' | 'user') => {
      stopCamera();
      setErrorMsg('');
      setIsStarting(true);
      hasScannedRef.current = false;

      if (
        typeof navigator === 'undefined' ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setIsStarting(false);
        setErrorMsg(copy.scanQrCameraDenied);
        return;
      }

      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: preferredFacing } },
            audio: false,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) {
          for (const track of stream.getTracks()) track.stop();
          return;
        }

        video.srcObject = stream;
        await video.play();
        setIsStarting(false);
        setCameraActive(true);

        let lastScanTs = 0;
        const scanLoop = (timestamp: number) => {
          if (hasScannedRef.current || !streamRef.current) return;

          const activeVideo = videoRef.current;
          if (
            activeVideo &&
            activeVideo.readyState >= activeVideo.HAVE_ENOUGH_DATA &&
            activeVideo.videoWidth > 0 &&
            activeVideo.videoHeight > 0 &&
            timestamp - lastScanTs >= 120
          ) {
            lastScanTs = timestamp;
            let canvas = scanCanvasRef.current;
            if (!canvas) {
              canvas = document.createElement('canvas');
              scanCanvasRef.current = canvas;
            }
            const maxDim = 720;
            const scale = Math.min(
              1,
              maxDim / Math.max(activeVideo.videoWidth, activeVideo.videoHeight)
            );
            const w = Math.max(1, Math.round(activeVideo.videoWidth * scale));
            const h = Math.max(1, Math.round(activeVideo.videoHeight * scale));
            if (canvas.width !== w || canvas.height !== h) {
              canvas.width = w;
              canvas.height = h;
            }
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              ctx.drawImage(activeVideo, 0, 0, w, h);
              const imgData = ctx.getImageData(0, 0, w, h);
              const decoded = jsQR(imgData.data, w, h, {
                inversionAttempts: 'attemptBoth',
              });
              if (decoded && decoded.data) {
                handleDecodedText(decoded.data);
                return;
              }
            }
          }

          rafRef.current = requestAnimationFrame(scanLoop);
        };

        rafRef.current = requestAnimationFrame(scanLoop);
      } catch {
        setIsStarting(false);
        setCameraActive(false);
        setErrorMsg(copy.scanQrCameraDenied);
      }
    },
    [copy.scanQrCameraDenied, handleDecodedText, stopCamera]
  );

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    void startCamera(facingMode);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopCamera();
    };
  }, [isOpen, facingMode, startCamera, stopCamera, onClose]);

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setErrorMsg('');
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const maxDim = 1200;
        const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          setErrorMsg(copy.scanQrNoCodeFound);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const decoded = jsQR(imgData.data, w, h, {
          inversionAttempts: 'attemptBoth',
        });
        if (decoded && decoded.data) {
          handleDecodedText(decoded.data);
        } else {
          setErrorMsg(copy.scanQrNoCodeFound);
        }
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setErrorMsg(copy.scanQrNoCodeFound);
    };
    img.src = objectUrl;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-scanner-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 id="qr-scanner-modal-title" className="text-sm font-bold text-slate-900">
                {copy.scanQrModalTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{copy.scanQrModalSubtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.closeAriaLabel}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewport */}
        <div className="p-5 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`w-full h-full object-cover ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Scanner Reticle */}
            {cameraActive && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 relative">
                  <span className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                  <span className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                  <span className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                  <span className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                </div>
              </div>
            )}

            {isStarting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                <span className="text-xs font-medium text-slate-200">
                  {copy.scanQrCameraStarting}
                </span>
              </div>
            )}

            {!isStarting && !cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-slate-300">
                <Camera className="w-8 h-8 text-slate-500" />
              </div>
            )}
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Controls: Switch Camera + Upload QR Photo Fallback */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageFileSelect}
            className="hidden"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{copy.scanQrSwitchCamBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer"
              >
                <ImagePlus className="w-3.5 h-3.5" />
                <span>{copy.scanQrUploadBtn}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              {copy.cropCancelBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
