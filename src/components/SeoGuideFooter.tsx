import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const MARATHI_FAQS = [
  {
    id: 'faq-download-pdf',
    question: 'बायोडाटा PDF मध्ये कसा डाउनलोड करावा?',
    answer:
      'तुमची सर्व वैयक्तिक, शैक्षणिक आणि कौटुंबिक माहिती भरल्यानंतर व आवडीचे टेम्प्लेट निवडल्यानंतर "मोफत नमुना डाउनलोड करा" किंवा "वॉटरमार्कशिवाय HD PDF डाउनलोड करा" या बटणावर क्लिक करा. काही सेकंदांत तुमचा A4 आकाराचा बायोडाटा थेट मोबाईल किंवा संगणकावर PDF स्वरूपात सेव्ह होतो.',
  },
  {
    id: 'faq-is-free',
    question: 'हा बायोडाटा मेकर मोफत आहे का?',
    answer:
      'होय! या वेबसाइटवर विवाह बायोडाटा आणि नोकरी रेझ्युमे तयार करणे, सर्व १० पैठणी व पेशवाई बॉर्डर डिझाइन्स वापरणे, फोटो क्रॉप करणे आणि नमुना A4 PDF डाउनलोड करणे पूर्णपणे मोफत आहे. तसेच कोणताही वॉटरमार्क नसलेला प्रिंट-रेडी HD PDF तुम्ही फक्त ₹२९ मध्ये त्वरित डाउनलोड करू शकता.',
  },
  {
    id: 'faq-biodata-fields',
    question: 'लग्नाच्या बायोडाटामध्ये कोणती माहिती असावी?',
    answer:
      'लग्नाच्या मराठी बायोडाटामध्ये संपूर्ण नाव, जन्मतारीख व वय, जन्मवेळ, जन्मठिकाण, उंची, रक्तगट, रास व गोत्र/कुलदैवत, शिक्षण, नोकरी व वार्षिक उत्पन्न, आई-वडिलांचे व भावंडांचे तपशील, मामाचे नाव व गाव, जोडीदाराकडून अपेक्षा तसेच संपर्क पत्ता व मोबाईल क्रमांक ही आवश्यक माहिती असावी.',
  },
];

export const SeoGuideFooter: React.FC = () => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <section
      lang="mr"
      dir="ltr"
      aria-label="मराठी विवाह बायोडाटा मार्गदर्शक आणि वारंवार विचारले जाणारे प्रश्न"
      className="border-t border-slate-100 bg-slate-50/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIsGuideOpen((prev) => !prev)}
            aria-expanded={isGuideOpen}
            aria-controls="seo-marathi-guide-panel"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-left"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>मराठी विवाह बायोडाटा कसा बनवावा? · मार्गदर्शक व प्रश्नोत्तरे</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                isGuideOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          <span className="text-[11px] text-slate-400">
            मोफत ऑनलाइन मराठी बायोडाटा व रेझ्युमे PDF जनरेटर
          </span>
        </div>

        <div
          id="seo-marathi-guide-panel"
          className={isGuideOpen ? 'mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5' : 'sr-only'}
        >
          {/* Short 3-4 line Marathi Biodata Guide */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-4">
            <h2 className="text-xs font-bold text-slate-800 mb-2">
              मराठी विवाह बायोडाटा कसा बनवावा?
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              प्रथम वरून विवाह बायोडाटा किंवा नोकरी बायोडाटा प्रकार निवडा आणि पैठणी, शाही पेशवाई
              किंवा आधुनिक डिझाइन्समधून आवडते टेम्प्लेट निवडा. त्यानंतर फॉर्ममध्ये वैयक्तिक माहिती,
              जन्मवेळ, रास, शिक्षण, नोकरी व कुटुंबाचा तपशील भरून ६००×९०० आकाराचा फोटो अपलोड करा.
              बाजूच्या लाइव्ह A4 प्रिव्ह्यूमध्ये सर्व माहिती तपासा आणि काही सेकंदांत मोफत नमुना किंवा
              वॉटरमार्कशिवाय HD PDF डाउनलोड करा.
            </p>
          </div>

          {/* 3 Short Marathi FAQs */}
          <div className="lg:col-span-7 space-y-2">
            {MARATHI_FAQS.map((faq) => (
              <details
                key={faq.id}
                className="group bg-white rounded-xl border border-slate-200/80 px-4 py-2.5"
              >
                <summary className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-800 cursor-pointer list-none">
                  <span>{faq.question}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
