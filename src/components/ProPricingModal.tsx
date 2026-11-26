import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  CreditCard,
  Crown,
  ExternalLink,
  KeyRound,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  PRO_UNLOCK_CODES,
  ProState,
  SINGLE_UNLOCK_CODES,
  activateProPlan,
  addSingleProCredit,
  isProActive,
} from '../utils/proState';
import { UiLang, getSiteStrings } from '../utils/siteI18n';
import { toAsciiDigits } from '../utils/smartFieldOptions';

export type SelectedCheckoutPlan = 'single' | 'monthly' | 'yearly';

interface ProPricingModalProps {
  isOpen: boolean;
  uiLang: UiLang;
  proState: ProState;
  initialPlan?: SelectedCheckoutPlan;
  onClose: () => void;
  onProStateChange: (next: ProState) => void;
}

const MERCHANT_UPI_ID = 'amrutshelke5700@okhdfcbank';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (window.Razorpay) return true;
  return await new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(true), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const ProPricingModal: React.FC<ProPricingModalProps> = ({
  isOpen,
  uiLang,
  proState,
  initialPlan = 'monthly',
  onClose,
  onProStateChange,
}) => {
  const s = getSiteStrings(uiLang);
  const [selectedPlan, setSelectedPlan] = useState<SelectedCheckoutPlan>(initialPlan);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentTab, setPaymentTab] = useState<'upi' | 'code'>('upi');
  const [utrInput, setUtrInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const proActive = isProActive(proState);

  useEffect(() => {
    if (isOpen) {
      setSelectedPlan(initialPlan);
      if (initialPlan === 'yearly') setBillingCycle('yearly');
      if (initialPlan === 'monthly') setBillingCycle('monthly');
      setFeedbackMsg('');
      setErrorMsg('');
    }
  }, [isOpen, initialPlan]);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const checkoutAmount =
    selectedPlan === 'single' ? 19 : billingCycle === 'yearly' ? 199 : 49;

  const upiUri = `upi://pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(
    'SadhanBox'
  )}&am=${checkoutAmount}&cu=INR&tn=${encodeURIComponent(
    `SadhanBox ${selectedPlan === 'single' ? 'Single Pro' : 'Pro Pass'}`
  )}`;

  const completeUnlock = (ref: string, forcePlan?: 'single' | 'monthly' | 'yearly') => {
    const planToUnlock = forcePlan || selectedPlan;
    let nextState: ProState;
    if (planToUnlock === 'single') {
      nextState = addSingleProCredit(ref);
    } else {
      nextState = activateProPlan(
        billingCycle === 'yearly' || planToUnlock === 'yearly' ? 'pro_yearly' : 'pro_monthly',
        ref
      );
    }
    onProStateChange(nextState);
    setErrorMsg('');
    setFeedbackMsg(s.proSuccessUnlocked);
  };

  const handleRazorpayCheckout = async () => {
    setErrorMsg('');
    setFeedbackMsg('');
    const rzpKey = (import.meta as unknown as { env?: Record<string, string> }).env
      ?.VITE_RAZORPAY_KEY_ID;
    if (!rzpKey) {
      setPaymentTab('upi');
      setErrorMsg(s.proRazorpayMissingNote);
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      setPaymentTab('upi');
      setErrorMsg(s.proRazorpayMissingNote);
      return;
    }

    const rzp = new window.Razorpay({
      key: rzpKey,
      amount: checkoutAmount * 100,
      currency: 'INR',
      name: 'SadhanBox',
      description:
        selectedPlan === 'single'
          ? 'Single Pro Download (₹19)'
          : `All-Tools Pro Pass (${billingCycle === 'yearly' ? '₹199/year' : '₹49/month'})`,
      handler: (response: { razorpay_payment_id?: string }) => {
        completeUnlock(response?.razorpay_payment_id || 'razorpay_ok');
      },
      theme: {
        color: '#0F172A',
      },
    });
    rzp.open();
  };

  const handleVerifyUtr = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = toAsciiDigits(utrInput).replace(/\D/g, '');
    if (digits.length < 12) {
      setErrorMsg(s.proUtrPlaceholder);
      return;
    }
    completeUnlock(`UPI-${digits}`);
    setUtrInput('');
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = codeInput.trim().toUpperCase();
    if (PRO_UNLOCK_CODES.has(normalized)) {
      completeUnlock(`CODE-${normalized}`, billingCycle);
      setCodeInput('');
      return;
    }
    if (SINGLE_UNLOCK_CODES.has(normalized)) {
      completeUnlock(`CODE-${normalized}`, 'single');
      setCodeInput('');
      return;
    }
    setErrorMsg(s.proCodeError);
  };

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(MERCHANT_UPI_ID);
      setCopiedUpi(true);
      window.setTimeout(() => setCopiedUpi(false), 1800);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pro-pricing-modal-title"
      onClick={onClose}
    >
      <div
        lang={uiLang}
        dir="ltr"
        className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 id="pro-pricing-modal-title" className="text-base sm:text-lg font-extrabold text-slate-900">
                {s.proModalTitle}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">{s.proModalSubtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          {proActive && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{s.proActiveBanner}</span>
            </div>
          )}

          {/* 3-Tier Plan Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {/* Tier 1: Free Plan */}
            <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-slate-500">{s.proFreeAudience}</div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{s.proFreeName}</h3>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  {s.proFreePrice}
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {s.proFreeFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                {s.proFreeCurrentBtn}
              </button>
            </div>

            {/* Tier 2: Single Pro Download (₹19) */}
            <div
              className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 border transition-all ${
                selectedPlan === 'single'
                  ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-slate-500">{s.proSingleAudience}</div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{s.proSingleName}</h3>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  {s.proSinglePrice}
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {s.proSingleFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlan('single');
                  setErrorMsg('');
                  setFeedbackMsg('');
                }}
                className={`w-full py-2.5 px-3 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  selectedPlan === 'single'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
              >
                {s.proSingleSelectBtn}
              </button>
            </div>

            {/* Tier 3: All-Tools Pro Pass (₹49/month or ₹199/year) */}
            <div
              className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 border transition-all ${
                selectedPlan !== 'single'
                  ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/15'
                  : 'border-amber-300 bg-amber-50/20'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-amber-800">{s.proPassAudience}</div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{s.proPassName}</h3>
                  </div>
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md shrink-0">
                    {s.proPassBadge}
                  </span>
                </div>

                {/* Billing Switcher: Monthly ₹49 | Yearly ₹199 */}
                <div className="inline-flex p-1 bg-white border border-amber-200 rounded-xl w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setBillingCycle('monthly');
                      setSelectedPlan('monthly');
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg tabular-nums cursor-pointer transition-colors ${
                      billingCycle === 'monthly'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {s.proPassMonthlyLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBillingCycle('yearly');
                      setSelectedPlan('yearly');
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg tabular-nums cursor-pointer transition-colors ${
                      billingCycle === 'yearly'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {s.proPassYearlyLabel}
                  </button>
                </div>

                <ul className="space-y-2 text-xs text-slate-700">
                  {s.proPassFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlan(billingCycle);
                  setErrorMsg('');
                  setFeedbackMsg('');
                }}
                className={`w-full py-2.5 px-3 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  selectedPlan !== 'single'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-950'
                }`}
              >
                {s.proPassSelectBtn}
              </button>
            </div>
          </div>

          {/* Checkout Box: Razorpay + Merchant UPI QR + Unlock Code */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{s.proCheckoutHeading}</h3>
                <div className="text-xs text-slate-600 tabular-nums mt-0.5">
                  {selectedPlan === 'single'
                    ? `${s.proSingleName} — ₹19`
                    : `${s.proPassName} — ₹${checkoutAmount}`}
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleRazorpayCheckout()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  {s.proPayRazorpayBtn} (₹{checkoutAmount})
                </span>
              </button>
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

            {feedbackMsg && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            {/* Payment Method Tabs: Merchant UPI QR | Unlock Code */}
            <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setPaymentTab('upi')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                  paymentTab === 'upi' ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{s.proPayUpiTab}</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentTab('code')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                  paymentTab === 'code' ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{s.proPayCodeTab}</span>
              </button>
            </div>

            {paymentTab === 'upi' ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-1">
                <div className="md:col-span-4 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl p-3">
                  <QRCodeSVG value={upiUri} size={136} level="M" includeMargin={false} />
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                    <code>{MERCHANT_UPI_ID}</code>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                      aria-label={s.supportCopyBtn}
                    >
                      {copiedUpi ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <form onSubmit={handleVerifyUtr} className="md:col-span-8 space-y-3">
                  <p className="text-xs text-slate-600">{s.proUpiScanHint}</p>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={upiUri}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>
                        {s.proUpiOpenAppBtn} (₹{checkoutAmount})
                      </span>
                    </a>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="pro-utr-input" className="block text-xs font-bold text-slate-700">
                      {s.proUtrLabel}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        id="pro-utr-input"
                        type="text"
                        value={utrInput}
                        onChange={(e) => setUtrInput(e.target.value)}
                        placeholder={s.proUtrPlaceholder}
                        className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/15 tabular-nums"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {s.proUtrVerifyBtn}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-2.5 pt-1">
                <label htmlFor="pro-unlock-code" className="block text-xs font-bold text-slate-700">
                  {s.proCodeLabel}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="pro-unlock-code"
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder={s.proCodePlaceholder}
                    className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm font-semibold uppercase bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {s.proCodeVerifyBtn}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
