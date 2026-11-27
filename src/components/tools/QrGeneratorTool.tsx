import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  AlertCircle,
  Copy,
  Check,
  Download,
  Globe,
  IndianRupee,
  MessageCircle,
  Type,
} from 'lucide-react';
import { ToolShell } from './ToolShell';
import { WhatsAppShareBar } from './WhatsAppShareBar';
import { pushDataLayerEvent } from '../../utils/gtm';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang, getSiteStrings } from '../../utils/siteI18n';

interface QrGeneratorToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
  onToolDownload: () => void;
}

type QrMode = 'url' | 'text' | 'whatsapp' | 'upi';

export const QrGeneratorTool: React.FC<QrGeneratorToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
  onToolDownload,
}) => {
  const s = getSiteStrings(uiLang);
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/qr-generator')!;
  const [activeTab, setActiveTab] = useState<QrMode>('url');

  // Input states
  const [urlValue, setUrlValue] = useState('https://sadhanbox.in');
  const [textValue, setTextValue] = useState('SadhanBox QR Code');
  const [waCountryCode, setWaCountryCode] = useState('91');
  const [waPhone, setWaPhone] = useState('');
  const [waMessage, setWaMessage] = useState(s.qrWaDefaultMsg);
  const [upiId, setUpiId] = useState('');
  const [upiName, setUpiName] = useState('');
  const [upiAmount, setUpiAmount] = useState('');
  const [upiNote, setUpiNote] = useState('');

  // Appearance states
  const [fgColor, setFgColor] = useState('#0F172A');
  const [qrSize, setQrSize] = useState<512 | 1024>(512);

  // Rendered output
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const qrTabs: { id: QrMode; label: string; icon: React.ReactNode }[] = [
    { id: 'url', label: s.qrTabUrl, icon: <Globe className="w-4 h-4" /> },
    { id: 'text', label: s.qrTabText, icon: <Type className="w-4 h-4" /> },
    { id: 'whatsapp', label: s.qrTabWhatsapp, icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'upi', label: s.qrTabUpi, icon: <IndianRupee className="w-4 h-4" /> },
  ];

  const buildPayload = (): { payload: string; validationError: string } => {
    if (activeTab === 'url') {
      const trimmed = urlValue.trim();
      if (!trimmed) return { payload: '', validationError: s.qrUrlRequired };
      const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      return { payload: normalized, validationError: '' };
    }

    if (activeTab === 'text') {
      const trimmed = textValue.trim();
      if (!trimmed) return { payload: '', validationError: s.qrTextRequired };
      return { payload: trimmed, validationError: '' };
    }

    if (activeTab === 'whatsapp') {
      const cleanPhone = waPhone.replace(/\D/g, '');
      const cleanCode = waCountryCode.replace(/\D/g, '') || '91';
      if (cleanPhone.length < 7) {
        return { payload: '', validationError: s.qrWaPhoneRequired };
      }
      const msg = waMessage.trim();
      const waUrl = `https://wa.me/${cleanCode}${cleanPhone}${
        msg ? `?text=${encodeURIComponent(msg)}` : ''
      }`;
      return { payload: waUrl, validationError: '' };
    }

    const cleanUpi = upiId.trim();
    if (!cleanUpi || !cleanUpi.includes('@')) {
      return { payload: '', validationError: s.qrUpiIdRequired };
    }
    const params = new URLSearchParams();
    params.set('pa', cleanUpi);
    params.set('pn', upiName.trim() || 'Merchant');
    const numericAmt = Number(upiAmount);
    if (upiAmount.trim() && Number.isFinite(numericAmt) && numericAmt > 0) {
      params.set('am', numericAmt.toFixed(2));
    }
    if (upiNote.trim()) {
      params.set('tn', upiNote.trim());
    }
    params.set('cu', 'INR');
    return { payload: `upi://pay?${params.toString()}`, validationError: '' };
  };

  const { payload, validationError } = buildPayload();

  useEffect(() => {
    let cancelled = false;
    if (!payload || validationError) {
      setQrDataUrl('');
      setErrorMsg(validationError);
      return;
    }

    setErrorMsg('');
    void QRCode.toDataURL(payload, {
      width: qrSize,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: fgColor,
        light: '#FFFFFF',
      },
    })
      .then((dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) {
          setQrDataUrl('');
          setErrorMsg(s.qrGenError);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [payload, validationError, fgColor, qrSize, s.qrGenError]);

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `sadhanbox-${activeTab}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    pushDataLayerEvent('file_download', {
      document_type: 'qr_code_png',
      qr_type: activeTab,
      resolution: qrSize,
      file_extension: 'png',
    });
    onToolDownload();
    setHasDownloaded(true);
  };

  const handleCopyPayload = async () => {
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(payload);
      setCopiedPayload(true);
      window.setTimeout(() => setCopiedPayload(false), 1800);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  return (
    <ToolShell
      route="/qr-generator"
      title={toolMeta.title[uiLang]}
      subtitle={toolMeta.shortDesc[uiLang]}
      uiLang={uiLang}
      isPro={isPro}
      onBackHome={onBackHome}
      onOpenProModal={onOpenProModal}
    >
      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap gap-2 pb-5 border-b border-slate-100">
        {qrTabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
                active
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-4">
          {activeTab === 'url' && (
            <div className="space-y-1.5">
              <label htmlFor="qr-url-input" className="block text-xs font-bold text-slate-700">
                {s.qrUrlLabel}
              </label>
              <input
                id="qr-url-input"
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/20"
              />
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-1.5">
              <label htmlFor="qr-text-input" className="block text-xs font-bold text-slate-700">
                {s.qrTextLabel}
              </label>
              <textarea
                id="qr-text-input"
                rows={4}
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder={s.qrTextPlaceholder}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/20"
              />
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4 sm:col-span-3 space-y-1.5">
                  <label htmlFor="qr-wa-cc" className="block text-xs font-bold text-slate-700">
                    {s.qrWaCodeLabel}
                  </label>
                  <input
                    id="qr-wa-cc"
                    type="text"
                    value={waCountryCode}
                    onChange={(e) => setWaCountryCode(e.target.value)}
                    placeholder="91"
                    className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/20 tabular-nums"
                  />
                </div>
                <div className="col-span-8 sm:col-span-9 space-y-1.5">
                  <label htmlFor="qr-wa-phone" className="block text-xs font-bold text-slate-700">
                    {s.qrWaPhoneLabel}
                  </label>
                  <input
                    id="qr-wa-phone"
                    type="tel"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/20 tabular-nums"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="qr-wa-msg" className="block text-xs font-bold text-slate-700">
                  {s.qrWaMsgLabel}
                </label>
                <input
                  id="qr-wa-msg"
                  type="text"
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/20"
                />
              </div>
            </div>
          )}

          {activeTab === 'upi' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="qr-upi-id" className="block text-xs font-bold text-slate-700">
                    {s.qrUpiIdLabel}
                  </label>
                  <input
                    id="qr-upi-id"
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="name@okhdfcbank"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="qr-upi-name" className="block text-xs font-bold text-slate-700">
                    {s.qrUpiNameLabel}
                  </label>
                  <input
                    id="qr-upi-name"
                    type="text"
                    value={upiName}
                    onChange={(e) => setUpiName(e.target.value)}
                    placeholder={s.qrUpiNamePlaceholder}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="qr-upi-amt" className="block text-xs font-bold text-slate-700">
                    {s.qrUpiAmtLabel}
                  </label>
                  <input
                    id="qr-upi-amt"
                    type="number"
                    min={1}
                    value={upiAmount}
                    onChange={(e) => setUpiAmount(e.target.value)}
                    placeholder={s.qrUpiAmtPlaceholder}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/20 tabular-nums"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="qr-upi-note" className="block text-xs font-bold text-slate-700">
                    {s.qrUpiNoteLabel}
                  </label>
                  <input
                    id="qr-upi-note"
                    type="text"
                    value={upiNote}
                    onChange={(e) => setUpiNote(e.target.value)}
                    placeholder={s.qrUpiNotePlaceholder}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* QR Style Options */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="block text-xs font-bold text-slate-700">{s.qrColorLabel}</span>
              <div className="flex items-center gap-2">
                {['#0F172A', '#1D4ED8', '#7C3AED', '#047857', '#B91C1C'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFgColor(color)}
                    aria-label={`Select color ${color}`}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-lg cursor-pointer transition-transform ${
                      fgColor === color ? 'ring-2 ring-offset-2 ring-slate-900 scale-105' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="block text-xs font-bold text-slate-700">{s.qrResLabel}</span>
              <div className="flex items-center gap-2">
                {([512, 1024] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setQrSize(sz)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border tabular-nums cursor-pointer ${
                      qrSize === sz
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {sz}×{sz} px
                  </button>
                ))}
              </div>
            </div>
          </div>

          {payload && !validationError && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-600 truncate font-mono">{payload}</span>
              <button
                type="button"
                onClick={handleCopyPayload}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 shrink-0 cursor-pointer"
              >
                {copiedPayload ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{s.qrCopiedBtn}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{s.qrCopyBtn}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Preview & Download */}
        <div className="lg:col-span-5 border border-slate-200 rounded-2xl bg-slate-50 p-5 flex flex-col items-center justify-center text-center space-y-4">
          {qrDataUrl ? (
            <>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <img
                  src={qrDataUrl}
                  alt="Generated QR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
                />
              </div>
              <button
                type="button"
                onClick={handleDownloadPng}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{s.qrDownloadBtn}</span>
              </button>
              {hasDownloaded && (
                <div className="w-full text-left">
                  <WhatsAppShareBar
                    uiLang={uiLang}
                    route="/qr-generator"
                    toolTitle={toolMeta.title[uiLang]}
                    compact
                  />
                </div>
              )}
            </>
          ) : (
            <div className="py-10 space-y-2">
              {errorMsg ? (
                <div className="inline-flex items-start gap-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-2.5 rounded-xl text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              ) : (
                <p className="text-xs text-slate-500">{s.qrEmptyHint}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
};
