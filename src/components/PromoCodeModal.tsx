import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  Crown,
  Download,
  Loader2,
  Tag,
  X,
} from 'lucide-react';
import { AppLanguage } from '../types/biodata';
import { PRO_UNLOCK_CODES, SINGLE_UNLOCK_CODES } from '../utils/proState';
import { UiLang, getSiteStrings } from '../utils/siteI18n';
import { getCopy } from '../utils/translations';

interface PromoCodeModalProps {
  isOpen: boolean;
  isExporting: boolean;
  language: AppLanguage;
  uiLang: UiLang;
  templateName: string;
  modeLabel: string;
  onClose: () => void;
  onVerifyAndDownload: (method?: 'promo_code' | 'upi_payment') => Promise<void>;
  onSwitchToProUpgrade: () => void;
}

const InstagramIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const PromoCodeModal: React.FC<PromoCodeModalProps> = ({
  isOpen,
  isExporting,
  language,
  uiLang,
  templateName,
  modeLabel,
  onClose,
  onVerifyAndDownload,
  onSwitchToProUpgrade,
}) => {
  const copy = getCopy(language);
  const s = getSiteStrings(uiLang);
  const [promoCode, setPromoCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPromoCode('');
      setErrorMsg('');
      setDownloadSuccess(false);
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isExporting) return;

    const normalized = promoCode.trim().toUpperCase();
    const isValid =
      Boolean(normalized) &&
      (SINGLE_UNLOCK_CODES.has(normalized) || PRO_UNLOCK_CODES.has(normalized));

    if (!isValid) {
      setDownloadSuccess(false);
      setErrorMsg(s.promoInvalidError);
      return;
    }

    setErrorMsg('');
    try {
      await onVerifyAndDownload('promo_code');
      setDownloadSuccess(true);
    } catch {
      setErrorMsg(copy.exportErrorMsg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-modal-title"
      onClick={() => {
        if (!isExporting) onClose();
      }}
    >
      <div
        lang={uiLang}
        dir="ltr"
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 id="promo-modal-title" className="text-base font-bold text-slate-900">
                {s.promoTitle}
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
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label
              htmlFor="promo-code-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              {s.promoLabel}
            </label>
            <input
              id="promo-code-input"
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                if (errorMsg) setErrorMsg('');
                if (downloadSuccess) setDownloadSuccess(false);
              }}
              placeholder={s.promoPlaceholder}
              autoComplete="off"
              autoCapitalize="characters"
              autoFocus
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold tracking-wide text-slate-900 placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal focus:outline-none ${
                errorMsg
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15'
              }`}
            />

            {errorMsg && (
              <div
                role="alert"
                className="mt-2 flex items-start gap-2 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-60"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{s.promoGeneratingBtn}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{s.promoVerifyBtn}</span>
              </>
            )}
          </button>

          {downloadSuccess && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{s.promoSuccessMsg}</span>
            </div>
          )}

          {/* Social Note */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
            <p className="text-xs leading-relaxed font-medium text-slate-700">
              {s.promoSocialNote}
            </p>

            <div className="flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-pink-400 text-xs font-semibold text-pink-700 hover:bg-pink-50/60 transition-colors"
              >
                <InstagramIcon />
                <span>Instagram</span>
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-xs font-semibold text-blue-700 hover:bg-blue-50/60 transition-colors"
              >
                <FacebookIcon />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          <div className="pt-1 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onSwitchToProUpgrade}
              disabled={isExporting}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>{s.promoPayAlternative}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
