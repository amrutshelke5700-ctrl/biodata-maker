import React from 'react';
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { LegalRoute } from '../utils/routes';
import { UiLang, getSiteStrings } from '../utils/siteI18n';

interface LegalPageViewProps {
  route: LegalRoute;
  uiLang: UiLang;
  onBackHome: () => void;
}

interface LegalDocContent {
  title: string;
  updatedAt: string;
  sections: { heading: string; paragraphs: string[] }[];
}

const LEGAL_DOCS: Record<LegalRoute, Record<UiLang, LegalDocContent>> = {
  '/about': {
    en: {
      title: 'About Us — SadhanBox',
      updatedAt: 'Updated: November 2026',
      sections: [
        {
          heading: 'Who We Are',
          paragraphs: [
            'SadhanBox is a privacy-first online utility platform designed to simplify everyday digital tasks for students, job seekers, families, and small businesses across India and worldwide.',
            'Every core tool on SadhanBox — including Marriage Biodata Maker, Resume Maker, Background Remover, PDF Merge & Split, Image Compressor, QR Code Generator, and Age Calculator — runs directly inside your web browser without uploading personal files to any backend server.',
          ],
        },
        {
          heading: 'Our Mission',
          paragraphs: [
            'Many everyday tools force users to sign up, pay high subscriptions, or upload sensitive IDs and family biodata to unknown cloud servers. SadhanBox solves this by processing files locally on your device using modern browser technologies.',
          ],
        },
      ],
    },
    mr: {
      title: 'आमच्याबद्दल — SadhanBox (साधनबॉक्स)',
      updatedAt: 'अद्ययावत: नोव्हेंबर २०२६',
      sections: [
        {
          heading: 'SadhanBox म्हणजे काय?',
          paragraphs: [
            'SadhanBox (साधनबॉक्स) हे विद्यार्थी, नोकरी शोधणारे तरुण, कुटुंबे आणि लहान व्यावसायिकांच्या दैनंदिन डिजिटल कामांसाठी तयार केलेले सुरक्षित ऑनलाइन व्यासपीठ आहे.',
            'लग्न बायोडाटा मेकर, रेझ्युमे मेकर, बॅकग्राउंड रिमूव्हर, PDF टूल्स, इमेज कॉम्प्रेसर, QR Code जनरेटर आणि वय कॅल्क्युलेटर ही सर्व ७ साधने थेट तुमच्या ब्राउझरमध्ये चालतात.',
          ],
        },
        {
          heading: 'आमचा उद्देश',
          paragraphs: [
            'कोणत्याही लॉगिनशिवाय किंवा सर्व्हरवर वैयक्तिक कागदपत्रे अपलोड न करता प्रत्येकास मोफत, वेगवान आणि गोपनीय ऑनलाइन साधने उपलब्ध करून देणे हे आमचे ध्येय आहे.',
          ],
        },
      ],
    },
    hi: {
      title: 'हमारे बारे में — SadhanBox (साधनबॉक्स)',
      updatedAt: 'अपडेटेड: नवंबर २०२६',
      sections: [
        {
          heading: 'SadhanBox क्या है?',
          paragraphs: [
            'SadhanBox (साधनबॉक्स) छात्रों, नौकरी तलाशने वालों, परिवारों और छोटे व्यवसायों के दैनिक डिजिटल कामों को आसान बनाने वाला एक सुरक्षित ऑनलाइन प्लेटफॉर्म है।',
            'मैरिज बायोडाटा मेकर, रिज्यूमे मेकर, बैकग्राउंड रिमूवर, PDF टूल्स, इमेज कंप्रेसर, QR Code जनरेटर और आयु कैलकुलेटर — ये सभी ७ टूल्स सीधे आपके ब्राउज़र में काम करते हैं।',
          ],
        },
        {
          heading: 'हमारा उद्देश्य',
          paragraphs: [
            'हमारा लक्ष्य बिना किसी लॉगिन या सर्वर अपलोड के सभी उपयोगकर्ताओं को तेज, मुफ्त और गोपनीयता-केंद्रित ऑनलाइन टूल्स उपलब्ध कराना है।',
          ],
        },
      ],
    },
  },
  '/privacy-policy': {
    en: {
      title: 'Privacy Policy — SadhanBox',
      updatedAt: 'Effective Date: November 2026',
      sections: [
        {
          heading: '1. Zero Server Uploads (Client-Side Processing)',
          paragraphs: [
            'SadhanBox processes your images, PDFs, biodata entries, resumes, and QR payloads locally inside your browser. Your personal documents and uploaded photos are never transmitted to or stored on SadhanBox servers.',
          ],
        },
        {
          heading: '2. Local Storage & Preferences',
          paragraphs: [
            'We use browser localStorage solely to remember your preferred language (English, Marathi, or Hindi), saved draft biodata/resume entries, and optional Pro Pass unlock status on your device.',
          ],
        },
        {
          heading: '3. Analytics & Advertising (Google AdSense)',
          paragraphs: [
            'We use anonymous aggregate download counters and Google Analytics/Tag Manager to measure tool usage. For free-tier visitors, third-party ad partners such as Google AdSense may use cookies to serve relevant advertisements. Ad slots are automatically hidden for All-Tools Pro Pass users.',
          ],
        },
      ],
    },
    mr: {
      title: 'गोपनीयता धोरण (Privacy Policy) — SadhanBox',
      updatedAt: 'लागू तारीख: नोव्हेंबर २०२६',
      sections: [
        {
          heading: '१. कोणताही सर्व्हर अपलोड नाही (१००% ब्राउझर प्रक्रिया)',
          paragraphs: [
            'SadhanBox वरील तुमचे फोटो, PDF फाईल्स, लग्नाचा बायोडाटा, रेझ्युमे आणि QR Code माहिती पूर्णपणे तुमच्याच ब्राउझरमध्ये प्रक्रिया केली जाते. तुमचा डेटा आमच्या सर्व्हरवर पाठवला किंवा साठवला जात नाही.',
          ],
        },
        {
          heading: '२. लोकल स्टोरेज (Local Storage)',
          paragraphs: [
            'तुम्ही निवडलेली भाषा, बायोडाटा ड्राफ्ट आणि Pro पास स्थिती तुमच्या डिव्हाइसवर लक्षात ठेवण्यासाठी केवळ ब्राउझरच्या localStorage चा वापर केला जातो.',
          ],
        },
        {
          heading: '३. विश्लेषण आणि Google AdSense जाहिराती',
          paragraphs: [
            'एकूण डाउनलोड संख्या मोजण्यासाठी आम्ही निनावी काऊंटर आणि विश्लेषण वापरतो. मोफत युझर्ससाठी पानांवर Google AdSense जाहिराती कुकीजचा वापर करू शकतात; Pro पास युझर्ससाठी सर्व जाहिराती बंद असतात.',
          ],
        },
      ],
    },
    hi: {
      title: 'गोपनीयता नीति (Privacy Policy) — SadhanBox',
      updatedAt: 'प्रभावी तिथि: नवंबर २०२६',
      sections: [
        {
          heading: '१. कोई सर्वर अपलोड नहीं (क्लाइंट-साइड प्रोसेसिंग)',
          paragraphs: [
            'SadhanBox पर आपकी फोटो, PDF फाइलें, बायोडाटा, रिज्यूमे और QR कोड डेटा पूरी तरह आपके ब्राउज़र के भीतर ही प्रोसेस होता है। आपकी निजी फाइलें हमारे किसी भी सर्वर पर अपलोड या स्टोर नहीं होतीं।',
          ],
        },
        {
          heading: '२. लोकल स्टोरेज उपयोग',
          paragraphs: [
            'आपकी चुनी गई भाषा, बायोडाटा ड्राफ्ट और Pro पास स्थिति को आपके डिवाइस पर याद रखने के लिए ब्राउज़र के localStorage का उपयोग किया जाता है।',
          ],
        },
        {
          heading: '३. एनालिटिक्स और Google AdSense विज्ञापन',
          paragraphs: [
            'हम टूल उपयोग मापने के लिए अनाम एनालिटिक्स का उपयोग करते हैं। मुफ्त यूजर्स के लिए Google AdSense विज्ञापन कुकीज़ का उपयोग कर सकता है; Pro पास यूजर्स के लिए सभी विज्ञापन स्वतः छिप जाते हैं।',
          ],
        },
      ],
    },
  },
  '/terms': {
    en: {
      title: 'Terms & Conditions — SadhanBox',
      updatedAt: 'Effective Date: November 2026',
      sections: [
        {
          heading: '1. Acceptance of Terms',
          paragraphs: [
            'By accessing and using SadhanBox tools, you agree to use them lawfully for personal, educational, or legitimate business purposes.',
          ],
        },
        {
          heading: '2. Free & Pro Services',
          paragraphs: [
            'All 7 core utilities are available free for everyday individual use. Optional Single Pro Downloads (₹19) and All-Tools Pro Pass subscriptions (₹49/month or ₹199/year) unlock watermark-free exports, Royal templates, HD background removal, batch processing, and an ad-free interface in your browser.',
          ],
        },
        {
          heading: '3. User Responsibility & Disclaimer',
          paragraphs: [
            'Because processing happens locally in your browser, you retain full ownership and responsibility for the files you generate. SadhanBox is provided on an "as-is" basis without warranties for uninterrupted third-party network availability.',
          ],
        },
      ],
    },
    mr: {
      title: 'अटी व शर्ती (Terms & Conditions) — SadhanBox',
      updatedAt: 'लागू तारीख: नोव्हेंबर २०२६',
      sections: [
        {
          heading: '१. सेवेचा वापर',
          paragraphs: [
            'SadhanBox वरील सर्व साधने वैयक्तिक, शैक्षणिक आणि कायदेशीर व्यावसायिक वापरासाठी उपलब्ध आहेत.',
          ],
        },
        {
          heading: '२. मोफत व Pro सेवा',
          paragraphs: [
            'सर्व ७ मूलभूत साधने दैनंदिन वापरासाठी मोफत आहेत. ऐच्छिक सिंगल डाउनलोड (₹19) आणि All-Tools Pro Pass (₹49/महिना किंवा ₹199/वर्ष) द्वारे वॉटरमार्कशिवाय PDF, रॉयल टेम्प्लेट्स, HD बॅकग्राउंड रिमूव्हल, बॅच प्रोसेसिंग आणि जाहिरातमुक्त अनुभव मिळतो.',
          ],
        },
        {
          heading: '३. युझरची जबाबदारी',
          paragraphs: [
            'तयार केलेल्या सर्व फाईल्स व मजकुराची संपूर्ण मालकी आणि जबाबदारी युझरची राहील. कोणतीही फाईल आमच्या सर्व्हरवर साठवली जात नसल्याने महत्त्वाच्या फाईल्स तुमच्या डिव्हाइसवर सेव्ह ठेवणे आवश्यक आहे.',
          ],
        },
      ],
    },
    hi: {
      title: 'नियम व शर्तें (Terms & Conditions) — SadhanBox',
      updatedAt: 'प्रभावी तिथि: नवंबर २०२६',
      sections: [
        {
          heading: '१. सेवा का उपयोग',
          paragraphs: [
            'SadhanBox के सभी टूल्स व्यक्तिगत, शैक्षणिक और वैध व्यावसायिक उपयोग के लिए प्रदान किए जाते हैं।',
          ],
        },
        {
          heading: '२. मुफ्त व Pro सेवाएं',
          paragraphs: [
            'सभी ७ मुख्य टूल्स दैनिक उपयोग के लिए मुफ्त हैं। वैकल्पिक सिंगल डाउनलोड (₹19) और All-Tools Pro Pass (₹49/माह या ₹199/वर्ष) द्वारा बिना वॉटरमार्क PDF, रॉयल टेम्प्लेट्स, HD बैकग्राउंड रिमूवल, बैच प्रोसेसिंग और विज्ञापन-मुक्त अनुभव मिलता है।',
          ],
        },
        {
          heading: '३. उपयोगकर्ता की जिम्मेदारी',
          paragraphs: [
            'चूंकि सभी फाइलें आपके ब्राउज़र में बनती हैं, इसलिए उनकी सुरक्षा और बैकअप की जिम्मेदारी उपयोगकर्ता की है।',
          ],
        },
      ],
    },
  },
  '/contact': {
    en: {
      title: 'Contact Us — SadhanBox',
      updatedAt: 'Support Hours: Mon–Sat, 10:00 AM – 6:00 PM IST',
      sections: [
        {
          heading: 'Get in Touch',
          paragraphs: [
            'Have questions about SadhanBox tools, Pro Pass activation, payment verification, or feature suggestions? Reach out to our team directly via email.',
            'Support Email: visionenterprises5700@gmail.com',
          ],
        },
        {
          heading: 'Payment & Pro Pass Assistance',
          paragraphs: [
            'If you have completed a UPI or Razorpay payment and need assistance unlocking your Pro Pass, please include your 12-digit UTR or Razorpay Payment ID in your email for quick support.',
          ],
        },
      ],
    },
    mr: {
      title: 'संपर्क साधा (Contact Us) — SadhanBox',
      updatedAt: 'संपर्क वेळ: सोमवार ते शनिवार, सकाळी १० ते सायंकाळी ६',
      sections: [
        {
          heading: 'आमच्याशी संपर्क साधा',
          paragraphs: [
            'SadhanBox टूल्स, Pro पास सक्रियता, पेमेंट तपासणी किंवा नवीन सुविधांबाबत काही प्रश्न असल्यास आम्हाला ईमेल करा.',
            'ईमेल पत्ता: visionenterprises5700@gmail.com',
          ],
        },
        {
          heading: 'पेमेंट व Pro पास मदत',
          paragraphs: [
            'UPI किंवा Razorpay पेमेंटनंतर काही अडचण आल्यास कृपया तुमच्या ईमेलमध्ये १२-अंकी UTR क्रमांक किंवा Payment ID नमूद करा.',
          ],
        },
      ],
    },
    hi: {
      title: 'संपर्क करें (Contact Us) — SadhanBox',
      updatedAt: 'सहायता समय: सोमवार से शनिवार, सुबह १० से शाम ६ बजे',
      sections: [
        {
          heading: 'हमसे संपर्क करें',
          paragraphs: [
            'यदि आपको SadhanBox टूल्स, Pro पास एक्टिवेशन, पेमेंट सत्यापन या किसी नए सुझाव के बारे में पूछना है, तो कृपया ईमेल द्वारा संपर्क करें।',
            'सहायता ईमेल: visionenterprises5700@gmail.com',
          ],
        },
        {
          heading: 'पेमेंट और Pro पास सहायता',
          paragraphs: [
            'यदि UPI या Razorpay भुगतान के बाद अनलॉक करने में कोई समस्या आती है, तो कृपया ईमेल में अपना १२-अंकों का UTR नंबर या Payment ID अवश्य लिखें।',
          ],
        },
      ],
    },
  },
};

export const LegalPageView: React.FC<LegalPageViewProps> = ({
  route,
  uiLang,
  onBackHome,
}) => {
  const s = getSiteStrings(uiLang);
  const doc = LEGAL_DOCS[route][uiLang] || LEGAL_DOCS[route].en;

  return (
    <div lang={uiLang} dir="ltr" className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>{s.backToHome}</span>
        </button>

        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>{s.privacyBadge}</span>
        </div>
      </div>

      <article className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{doc.title}</h1>
          <p className="text-xs text-slate-500 mt-1">{doc.updatedAt}</p>
        </div>

        <div className="space-y-5">
          {doc.sections.map((sec, idx) => (
            <section key={idx} className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">{sec.heading}</h2>
              {sec.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-sm text-slate-600 leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {route === '/contact' && (
          <div className="pt-2">
            <a
              href="mailto:visionenterprises5700@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>visionenterprises5700@gmail.com</span>
            </a>
          </div>
        )}
      </article>
    </div>
  );
};
