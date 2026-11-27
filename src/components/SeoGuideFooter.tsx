import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { AppRoute } from '../utils/routes';
import { UiLang, getSiteStrings } from '../utils/siteI18n';

interface SeoGuideFooterProps {
  uiLang: UiLang;
  onNavigate: (route: AppRoute) => void;
}

const FOOTER_FAQS_BY_LANG: Record<
  UiLang,
  {
    toggleLabel: string;
    guideTitle: string;
    guideDesc: string;
    faqs: { q: string; a: string }[];
  }
> = {
  en: {
    toggleLabel: 'How SadhanBox works · Guide & FAQs',
    guideTitle: 'SadhanBox — 14 Utility Tools in One Browser Suite',
    guideDesc:
      'SadhanBox gives you instant access to Marriage Biodata Maker, Resume Maker, Passport Photo Maker, Signature & Thumb Resize, Rent Receipt & Salary Slip Generator, GST & EMI Calculator, Image Format Converter, Word Counter & Marathi/Hindi Typing Pad, AI Background Remover, PDF Merge & Split, KB Image Compressor, QR Code Generator, Age Calculator, and Pro Watermark Adder with zero sign-up.',
    faqs: [
      {
        q: 'Is my data private while using SadhanBox tools?',
        a: 'Yes! All 14 tools run strictly inside your browser (Client-Side). Files and personal details never leave your device.',
      },
      {
        q: 'How do I download a Biodata or Resume PDF?',
        a: 'Fill in your details, choose a template, and click Free Sample Download or Unlock Pro HD PDF to save your A4 PDF immediately.',
      },
      {
        q: 'Are Background Remover, PDF Tools, and Image Compressor free?',
        a: 'Yes, daily individual processing is completely free, and Pro Pass (₹49/mo) removes all ads and unlocks Pro Watermark Adder and batch tools.',
      },
    ],
  },
  mr: {
    toggleLabel: 'SadhanBox कसे वापरावे? · मार्गदर्शक व प्रश्नोत्तरे',
    guideTitle: 'SadhanBox — एकाच ठिकाणी १४ उपयुक्त साधने',
    guideDesc:
      'SadhanBox वर तुम्हाला लग्न बायोडाटा मेकर, रेझ्युमे मेकर, पासपोर्ट फोटो मेकर, सही व अंगठा रिसाईझ, घरभाडे पावती व पगार स्लिप, GST व EMI कॅल्क्युलेटर, इमेज फॉरमॅट कन्व्हर्टर, वर्ड काउंटर व मराठी/हिंदी टायपिंग पॅड, बॅकग्राउंड रिमूव्हर, PDF टूल्स, इमेज कॉम्प्रेसर, QR Code जनरेटर, वय कॅल्क्युलेटर आणि Pro वॉटरमार्क ॲडर ही सर्व साधने विना-साइनअप मिळतात.',
    faqs: [
      {
        q: 'SadhanBox वापरताना माझा डेटा सुरक्षित राहतो का?',
        a: 'होय! सर्व १४ साधने पूर्णपणे तुमच्या ब्राउझरमध्ये चालतात व कोणतीही माहिती सर्व्हरवर पाठवली जात नाही.',
      },
      {
        q: 'बायोडाटा व रेझ्युमे PDF मध्ये कसा डाउनलोड करावा?',
        a: 'माहिती भरून आवडते टेम्प्लेट निवडा आणि मोफत नमुना किंवा Pro HD PDF डाउनलोड बटणावर क्लिक करा.',
      },
      {
        q: 'बॅकग्राउंड रिमूव्हर, PDF टूल्स व इमेज कॉम्प्रेसर मोफत आहेत का?',
        a: 'होय, दैनंदिन वापर पूर्णपणे मोफत आहे व Pro पास (₹49) द्वारे जाहिरातमुक्त अनुभव आणि Pro वॉटरमार्क ॲडर मिळतो.',
      },
    ],
  },
  hi: {
    toggleLabel: 'SadhanBox का उपयोग कैसे करें? · गाइड और प्रश्न',
    guideTitle: 'SadhanBox — एक ही स्थान पर १४ उपयोगी टूल्स',
    guideDesc:
      'SadhanBox पर आपको मैरिज बायोडाटा मेकर, रिज्यूमे मेकर, पासपोर्ट फोटो मेकर, सिग्नेचर व थंब रिसाइज़, रेंट रसीद व सैलरी स्लिप, GST व EMI कैलकुलेटर, इमेज फॉर्मेट कन्वर्टर, वर्ड काउंटर व मराठी/हिंदी टाइपिंग पैड, बैकग्राउंड रिमूवर, PDF टूल्स, इमेज कंप्रेसर, QR Code जनरेटर, आयु कैलकुलेटर और Pro वॉटरमार्क ऐडर बिना साइन-अप मिलते हैं।',
    faqs: [
      {
        q: 'क्या SadhanBox टूल्स इस्तेमाल करते समय मेरा डेटा सुरक्षित रहता है?',
        a: 'हां! सभी १४ टूल्स पूरी तरह आपके ब्राउज़र में चलते हैं और कोई भी फाइल सर्वर पर अपलोड नहीं होती।',
      },
      {
        q: 'बायोडाटा और रिज्यूमे PDF में कैसे डाउनलोड करें?',
        a: 'जानकारी भरकर टेम्प्लेट चुनें और मुफ्त सैंपल या Pro HD PDF डाउनलोड बटन पर क्लिक करें।',
      },
      {
        q: 'क्या बैकग्राउंड रिमूवर, PDF टूल्स और इमेज कंप्रेसर मुफ्त हैं?',
        a: 'हां, दैनिक उपयोग पूरी तरह मुफ्त है और Pro पास (₹49) से सभी विज्ञापन हटते हैं और Pro वॉटरमार्क ऐडर अनलॉक होता है।',
      },
    ],
  },
};

export const SeoGuideFooter: React.FC<SeoGuideFooterProps> = ({ uiLang, onNavigate }) => {
  const s = getSiteStrings(uiLang);
  const content = FOOTER_FAQS_BY_LANG[uiLang] || FOOTER_FAQS_BY_LANG.en;
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <section
      lang={uiLang}
      dir="ltr"
      aria-label={content.toggleLabel}
      className="border-t border-slate-100 bg-slate-50/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        {/* Mandatory Legal Links + Quick Guide Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <nav
            aria-label="Legal Navigation"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-600"
          >
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/about');
              }}
              className="hover:text-slate-900 transition-colors"
            >
              {s.footerAbout}
            </a>
            <a
              href="/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/privacy-policy');
              }}
              className="hover:text-slate-900 transition-colors"
            >
              {s.footerPrivacy}
            </a>
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/terms');
              }}
              className="hover:text-slate-900 transition-colors"
            >
              {s.footerTerms}
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/contact');
              }}
              className="hover:text-slate-900 transition-colors"
            >
              {s.footerContact}
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setIsGuideOpen((prev) => !prev)}
            aria-expanded={isGuideOpen}
            aria-controls="seo-marathi-guide-panel"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-left"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{content.toggleLabel}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                isGuideOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        <div
          id="seo-marathi-guide-panel"
          className={isGuideOpen ? 'pt-2 grid grid-cols-1 lg:grid-cols-12 gap-5' : 'sr-only'}
        >
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-4">
            <h2 className="text-xs font-bold text-slate-800 mb-2">{content.guideTitle}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{content.guideDesc}</p>
          </div>

          <div className="lg:col-span-7 space-y-2">
            {content.faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl border border-slate-200/80 px-4 py-2.5"
              >
                <summary className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-800 cursor-pointer list-none">
                  <span>{faq.q}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
