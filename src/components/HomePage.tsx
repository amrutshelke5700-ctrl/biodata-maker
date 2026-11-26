import React, { useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  Cake,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Eraser,
  ExternalLink,
  FileDown,
  Files,
  Heart,
  HelpCircle,
  Lock,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { AdSlot } from './AdSlot';
import { AppRoute, TOOL_CATALOG } from '../utils/routes';
import { formatDownloadCount } from '../utils/downloadCounter';
import { UiLang, getSiteStrings } from '../utils/siteI18n';

interface HomePageProps {
  uiLang: UiLang;
  isPro: boolean;
  downloadCount: number;
  onNavigate: (route: AppRoute) => void;
  onOpenProModal: () => void;
}

const DONATION_UPI_ID = 'amrutshelke5700@okhdfcbank';

const TOOL_ICONS: Record<string, React.ReactNode> = {
  'biodata-maker': <Heart className="w-5 h-5 text-rose-600" />,
  'resume-maker': <Briefcase className="w-5 h-5 text-blue-600" />,
  'background-remover': <Eraser className="w-5 h-5 text-violet-600" />,
  'pdf-tools': <Files className="w-5 h-5 text-amber-600" />,
  'image-compressor': <FileDown className="w-5 h-5 text-emerald-600" />,
  'qr-generator': <QrCode className="w-5 h-5 text-cyan-600" />,
  'age-calculator': <Cake className="w-5 h-5 text-indigo-600" />,
};

const HOME_FAQS_BY_LANG: Record<UiLang, { title: string; overviewTitle: string; items: { q: string; a: string }[] }> = {
  en: {
    title: 'Frequently Asked Questions',
    overviewTitle: 'Quick Overview of SadhanBox Tools',
    items: [
      {
        q: 'Are SadhanBox tools safe and private? Is my data uploaded to any server?',
        a: 'All 7 tools on SadhanBox run 100% locally inside your browser (Client-Side). Your photos, PDFs, marriage biodata, and resumes are never uploaded or stored on any server.',
      },
      {
        q: 'Are Background Remover, PDF Tools, and Image Compressor free?',
        a: 'Yes! Everyday use of all 7 tools is completely free. Optional Single Downloads (₹19) or All-Tools Pro Pass (₹49/month or ₹199/year) unlock watermark-free Royal biodata templates, HD background removal, batch processing, and an ad-free interface.',
      },
      {
        q: 'How can I compress a photo to 20KB or 50KB for MPSC or UPSC forms?',
        a: 'Open Image Compressor, upload your photo or signature, click 20 KB or 50 KB (or type any custom KB limit), and click Compress to download an image strictly under your chosen size.',
      },
      {
        q: 'How do I merge or split PDF files without installing software?',
        a: 'Open PDF Tools and select Merge PDF, Split PDF, or Images to PDF. Add your files, arrange page order or page ranges, and download the generated PDF directly in your browser.',
      },
    ],
  },
  mr: {
    title: 'वारंवार विचारले जाणारे प्रश्न',
    overviewTitle: 'SadhanBox साधनांची थोडक्यात माहिती',
    items: [
      {
        q: 'SadhanBox वरील टूल्स सुरक्षित आहेत का? माझा डेटा सर्व्हरवर सेव्ह होतो का?',
        a: 'SadhanBox वरील सर्व ७ साधने १००% तुमच्या ब्राउझरमध्ये चालतात. तुमचे फोटो, PDF फाईल्स, लग्नाचा बायोडाटा किंवा रेझ्युमे कोणत्याही सर्व्हरवर अपलोड केला जात नाही.',
      },
      {
        q: 'बॅकग्राउंड रिमूव्हर, PDF टूल्स व इमेज कॉम्प्रेसर मोफत आहेत का?',
        a: 'होय! सर्व ७ साधनांचा दैनंदिन वापर पूर्णपणे मोफत आहे. तसेच ₹19 सिंगल डाउनलोड किंवा ₹49 All-Tools Pro Pass मध्ये जाहिरातमुक्त अनुभव, रॉयल टेम्प्लेट्स आणि बॅच प्रोसेसिंग मिळते.',
      },
      {
        q: 'MPSC / UPSC फॉर्मसाठी फोटो 20KB किंवा 50KB मध्ये कसा कॉम्प्रेस करायचा?',
        a: 'Image Compressor टूल उघडून फोटो अपलोड करा, 20 KB किंवा 50 KB बटण निवडा (किंवा स्वतःची KB संख्या टाका) आणि लगेच डाउनलोड करा.',
      },
      {
        q: 'PDF एकत्र (Merge) किंवा वेगळी (Split) कशी करावी?',
        a: 'PDF टूल्स पानावर जाऊन Merge PDF, Split PDF किंवा फोटोंची PDF निवडा आणि काही सेकंदांत नवीन PDF डाउनलोड करा.',
      },
    ],
  },
  hi: {
    title: 'अक्सर पूछे जाने वाले प्रश्न',
    overviewTitle: 'SadhanBox टूल्स की संक्षिप्त जानकारी',
    items: [
      {
        q: 'क्या SadhanBox के टूल्स सुरक्षित हैं? क्या मेरा डेटा सर्वर पर सेव होता है?',
        a: 'SadhanBox के सभी ७ टूल्स १००% आपके ब्राउज़र में चलते हैं। आपकी फोटो, PDF फाइलें, शादी का बायोडाटा या रिज्यूमे किसी भी सर्वर पर अपलोड नहीं होता।',
      },
      {
        q: 'क्या बैकग्राउंड रिमूवर, PDF टूल्स और इमेज कंप्रेसर मुफ्त हैं?',
        a: 'हां! सभी ७ टूल्स का दैनिक उपयोग पूरी तरह मुफ्त है। ₹19 सिंगल डाउनलोड या ₹49 All-Tools Pro Pass से विज्ञापन-मुक्त अनुभव, रॉयल टेम्प्लेट्स और बैच प्रोसेसिंग अनलॉक होती है।',
      },
      {
        q: 'MPSC / UPSC फॉर्म के लिए फोटो 20KB या 50KB में कैसे कंप्रेस करें?',
        a: 'Image Compressor टूल खोलें, फोटो अपलोड करें, 20 KB या 50 KB चुनें (या कस्टम KB लिखें) और तुरंत डाउनलोड करें।',
      },
      {
        q: 'बिना सॉफ्टवेयर के PDF मर्ज या स्प्लिट कैसे करें?',
        a: 'PDF टूल्स पेज पर जाकर Merge PDF, Split PDF या फोटो से PDF चुनें और कुछ सेकंड में नई PDF डाउनलोड करें।',
      },
    ],
  },
};

export const HomePage: React.FC<HomePageProps> = ({
  uiLang,
  isPro,
  downloadCount,
  onNavigate,
  onOpenProModal,
}) => {
  const s = getSiteStrings(uiLang);
  const faqPack = HOME_FAQS_BY_LANG[uiLang] || HOME_FAQS_BY_LANG.en;
  const [donationAmount, setDonationAmount] = useState<string>('51');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const upiUri = (() => {
    const params = new URLSearchParams();
    params.set('pa', DONATION_UPI_ID);
    params.set('pn', 'SadhanBox');
    const numericAmt = Number(donationAmount);
    if (donationAmount && Number.isFinite(numericAmt) && numericAmt > 0) {
      params.set('am', numericAmt.toFixed(0));
    }
    params.set('cu', 'INR');
    params.set('tn', 'SadhanBox Support');
    return `upi://pay?${params.toString()}`;
  })();

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(DONATION_UPI_ID);
      setCopiedUpi(true);
      window.setTimeout(() => setCopiedUpi(false), 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  return (
    <div lang={uiLang} dir="ltr" className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10">
      {/* Hero Section */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                {s.heroTrustPrivacy}
              </span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-700">
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {s.heroTrustNoUpload}
              </span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <strong className="tabular-nums font-bold">
                  {formatDownloadCount(downloadCount, uiLang)}
                </strong>{' '}
                {s.heroTrustDownloadsSuffix}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight text-balance">
              {s.heroTitle}
            </h1>

            <p className="text-base sm:text-lg font-medium text-slate-700 max-w-2xl leading-relaxed">
              {s.heroTagline}
            </p>

            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              {s.heroSubtitle}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/biodata-maker')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>{s.heroPrimaryCta}</span>
              </button>
              <a
                href="#all-tools-grid"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <span>{s.heroSecondaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Live Trust Summary Panel */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/sadhanbox-logo.svg"
                alt="SadhanBox Logo"
                width={48}
                height={48}
                className="w-12 h-12 rounded-xl shrink-0"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">{s.heroSuiteTitle}</div>
                <div className="text-xs text-slate-500">{s.heroSuiteSubtitle}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-white border border-slate-200 rounded-xl p-3">
                <div className="text-lg font-extrabold text-slate-900 tabular-nums">
                  {formatDownloadCount(downloadCount, uiLang)}
                </div>
                <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                  {s.heroLiveDownloadsLabel}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3">
                <div className="text-lg font-extrabold text-emerald-700 tabular-nums">
                  {s.heroPrivacyStatVal}
                </div>
                <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                  {s.heroPrivacyStatLabel}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{s.heroNoSignupNote}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Tools Responsive Grid */}
      <section id="all-tools-grid" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{s.toolsGridHeading}</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{s.toolsGridSubheading}</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 tabular-nums">
            {s.toolsGridCount}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {TOOL_CATALOG.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => onNavigate(tool.route)}
              className="group text-left bg-white border border-slate-200 hover:border-slate-400 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-sm cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${tool.accentBg}`}
                  >
                    {TOOL_ICONS[tool.id]}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 text-right leading-snug">
                    {tool.metaLabel[uiLang]}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-950">
                    {tool.title[uiLang]}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {tool.shortDesc[uiLang]}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
                <span>{s.openToolCta}</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-slate-900 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Home AdSense Slot (Automatically hidden for Pro users) */}
      <AdSlot
        slotId="sadhanbox-home-mid"
        isPro={isPro}
        uiLang={uiLang}
        onOpenProModal={onOpenProModal}
      />

      {/* Support / Donation QR Code Section */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">{s.supportHeading}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              {s.supportDesc}
            </p>

            <div className="pt-1 space-y-2">
              <div className="text-xs font-bold text-slate-700">{s.supportAmountLabel}</div>
              <div className="flex flex-wrap items-center gap-2">
                {['29', '51', '101', ''].map((amt) => {
                  const active = donationAmount === amt;
                  return (
                    <button
                      key={amt || 'custom'}
                      type="button"
                      onClick={() => setDonationAmount(amt)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border tabular-nums transition-colors cursor-pointer ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {amt ? `₹${amt}` : s.supportCustomAmt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                <span className="text-slate-500">UPI ID:</span>
                <code className="font-bold text-slate-900 select-all">{DONATION_UPI_ID}</code>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-md hover:bg-slate-100 cursor-pointer"
                >
                  {copiedUpi ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{s.supportCopiedBtn}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{s.supportCopyBtn}</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={upiUri}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{s.supportUpiAppBtn}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <QRCodeSVG value={upiUri} size={156} level="M" includeMargin={false} />
            </div>
            <p className="text-xs font-bold text-slate-800 mt-3">{s.supportScanLabel}</p>
            <p className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
              {donationAmount ? `${s.supportSuggestedAmtPrefix}${donationAmount}` : s.supportAnyAmt}
            </p>
          </div>
        </div>
      </section>

      {/* Brief Tool Descriptions + FAQs for Google SEO */}
      <section className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">{faqPack.overviewTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
            {TOOL_CATALOG.map((tool) => (
              <div key={tool.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                <h3 className="font-bold text-slate-900 mb-1">{tool.title[uiLang]}</h3>
                <p>{tool.shortDesc[uiLang]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900">{faqPack.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {faqPack.items.map((item, idx) => (
              <details
                key={idx}
                open
                className="group bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
              >
                <summary className="flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-slate-800 cursor-pointer list-none">
                  <span>{item.q}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
