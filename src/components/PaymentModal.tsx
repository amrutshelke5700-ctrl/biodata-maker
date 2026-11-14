import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  Lock,
  QrCode,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { AppLanguage } from '../types/biodata';
import { toAsciiDigits, toLocalizedDigits } from '../utils/smartFieldOptions';
import { getCopy } from '../utils/translations';

interface PaymentModalProps {
  isOpen: boolean;
  isExporting: boolean;
  language: AppLanguage;
  templateName: string;
  modeLabel: string;
  onClose: () => void;
  onConfirmPaymentAndDownload: () => Promise<void>;
}

type PaymentTab = 'qr' | 'upi';

const MERCHANT_UPI_ID = 'amrutshelke5700@okhdfcbank';
const PAYEE_NAME = 'Marathi Biodata';
const PAYMENT_AMOUNT = '29';
const PAYMENT_CURRENCY = 'INR';

const UPI_PAYMENT_LINK = `upi://pay?pa=${encodeURIComponent(
  MERCHANT_UPI_ID
)}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${encodeURIComponent(
  PAYMENT_AMOUNT
)}&cu=${encodeURIComponent(PAYMENT_CURRENCY)}`;

async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to execCommand below
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  isExporting,
  language,
  templateName,
  modeLabel,
  onClose,
  onConfirmPaymentAndDownload,
}) => {
  const copy = getCopy(language);
  const [activeTab, setActiveTab] = useState<PaymentTab>('qr');
  const [utrRef, setUtrRef] = useState('');
  const [downloadDone, setDownloadDone] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  const utrDigits = toAsciiDigits(utrRef).replace(/\D/g, '');
  const isUtrValid = utrDigits.length >= 12;

  useEffect(() => {
    if (!isOpen) {
      setDownloadDone(false);
      setUpiCopied(false);
      setActiveTab('qr');
      return;
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isExporting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, isExporting, onClose]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleUtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^\d०-९૦-૯০-৯੦-੯୦-୯۰-۹٠-٩]/g, '');
    setUtrRef(cleaned);
  };

  const handleCopyUpiId = async () => {
    const ok = await copyTextToClipboard(MERCHANT_UPI_ID);
    if (ok) {
      setUpiCopied(true);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setUpiCopied(false);
      }, 3000);
    }
  };

  const handleConfirm = async () => {
    if (!isUtrValid || isExporting) return;
    await onConfirmPaymentAndDownload();
    setDownloadDone(true);
  };

  const upiAppOptions = [
    {
      id: 'gpay',
      label: copy.payAppGpay,
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      dotColor: 'bg-blue-600',
    },
    {
      id: 'phonepe',
      label: copy.payAppPhonePe,
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      dotColor: 'bg-purple-600',
    },
    {
      id: 'paytm',
      label: copy.payAppPaytm,
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      dotColor: 'bg-sky-600',
    },
    {
      id: 'any',
      label: copy.payAppAny,
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-600',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      onClick={() => {
        if (!isExporting) onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 id="payment-modal-title" className="text-base font-bold text-slate-900">
                {copy.payModalTitle}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {modeLabel} · {templateName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            aria-label={copy.closeAriaLabel}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Amount Summary */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-xs font-medium text-slate-500">{copy.paySummaryTitle}</div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">
                {copy.paySummarySubtitle}
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {copy.currencyAmountLabel}
            </div>
          </div>

          {/* Payment Method Tabs: Scan QR Code | UPI App */}
          <div
            role="tablist"
            aria-label={copy.payModalTitle}
            className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'qr'}
              onClick={() => setActiveTab('qr')}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{copy.payTabScanQr}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'upi'}
              onClick={() => setActiveTab('upi')}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'upi'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{copy.payTabUpiApp}</span>
            </button>
          </div>

          {/* Tab Panel 1: Dynamic QR Code View */}
          {activeTab === 'qr' ? (
            <div
              role="tabpanel"
              className="flex flex-col items-center text-center bg-slate-50/70 rounded-xl border border-slate-200 p-4"
            >
              <div className="text-xs font-bold text-slate-800 mb-3">
                {copy.payScanPrompt}
              </div>

              <div className="relative p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-600 rounded-tl-xs" />
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-600 rounded-tr-xs" />
                <span className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-600 rounded-bl-xs" />
                <span className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-600 rounded-br-xs" />

                <QRCodeSVG
                  value={UPI_PAYMENT_LINK}
                  size={168}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
              </div>

              <p className="text-xs font-medium text-slate-600 mt-3">{copy.payAppsNote}</p>

              {/* Quick Actions: Direct UPI App Link + One-Click Copy UPI ID */}
              <div className="mt-3 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={UPI_PAYMENT_LINK}
                  target="_top"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{copy.payUpiAppBtn}</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyUpiId}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    upiCopied
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {upiCopied ? (
                    <Check className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span className="truncate">
                    {upiCopied ? copy.payCopiedUpiBtn : copy.payCopyUpiBtn}
                  </span>
                </button>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-600 mt-2.5">
                {copy.payFallbackNote}
              </p>
            </div>
          ) : (
            /* Tab Panel 2: Direct UPI App View */
            <div
              role="tabpanel"
              className="bg-slate-50/70 rounded-xl border border-slate-200 p-4 space-y-3"
            >
              <div className="text-center">
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  {copy.payUpiAppTitle}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">{copy.payUpiAppSubtitle}</p>
              </div>

              {/* Direct Pay via UPI App Deep Links (GPay / PhonePe / Paytm / Any UPI App) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {upiAppOptions.map((app) => (
                  <a
                    key={app.id}
                    href={UPI_PAYMENT_LINK}
                    target="_top"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-xl transition-all shadow-2xs group"
                  >
                    <span className="inline-flex items-center gap-2 min-w-0">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${app.dotColor}`}
                        aria-hidden="true"
                      />
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {app.label}
                      </span>
                    </span>
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-lg border shrink-0 ${app.badgeBg}`}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>
                ))}
              </div>

              {/* One-Click Copy UPI ID & Switch to QR Fallback */}
              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleCopyUpiId}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                    upiCopied
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {upiCopied ? (
                    <Check className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{upiCopied ? copy.payCopiedUpiBtn : copy.payCopyUpiBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('qr')}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 shrink-0" />
                  <span>{copy.paySwitchToQrBtn}</span>
                </button>
              </div>

              <div className="rounded-lg bg-amber-50/80 border border-amber-200/80 px-3 py-2 text-[11px] leading-relaxed text-amber-900">
                {copy.payUpiFallbackNote}
              </div>
            </div>
          )}

          {/* Mandatory 12-Digit UTR / Transaction ID */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label htmlFor="utr-input" className="block text-xs font-semibold text-slate-700">
                {copy.payUtrLabel}
              </label>
              <span
                className={`text-xs font-semibold tabular-nums ${
                  isUtrValid ? 'text-emerald-700' : 'text-slate-500'
                }`}
              >
                {toLocalizedDigits(`${utrDigits.length}/12`, language)}
              </span>
            </div>
            <input
              id="utr-input"
              type="text"
              inputMode="numeric"
              required
              minLength={12}
              value={utrRef}
              onChange={handleUtrChange}
              placeholder={copy.payUtrPlaceholder}
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none tabular-nums ${
                isUtrValid
                  ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10'
              }`}
            />
            <p
              className={`text-[11px] mt-1.5 font-medium ${
                isUtrValid ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {isUtrValid ? copy.payUtrReadyHint : copy.payUtrRequiredHint}
            </p>
          </div>

          {downloadDone && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              {copy.paySuccessNote}
            </div>
          )}

          {/* Unlock & Download Button */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!isUtrValid || isExporting}
              className={`w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl transition-colors ${
                isUtrValid && !isExporting
                  ? 'text-white bg-emerald-700 hover:bg-emerald-800 cursor-pointer'
                  : 'text-slate-400 bg-slate-200 cursor-not-allowed'
              }`}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{copy.payDownloadingBtn}</span>
                </>
              ) : !isUtrValid ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{copy.payConfirmBtn}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{copy.payConfirmBtn}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{copy.payTrustNote}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
