import { UiLang } from './siteI18n';

export type ToolRoute =
  | '/biodata-maker'
  | '/resume-maker'
  | '/background-remover'
  | '/pdf-tools'
  | '/image-compressor'
  | '/qr-generator'
  | '/age-calculator';

export type LegalRoute = '/about' | '/privacy-policy' | '/terms' | '/contact';

export type AppRoute = '/' | ToolRoute | LegalRoute;

export interface ToolCatalogItem {
  route: ToolRoute;
  id: string;
  title: Record<UiLang, string>;
  shortDesc: Record<UiLang, string>;
  metaLabel: Record<UiLang, string>;
  accentBg: string;
  accentText: string;
  seoTitle: Record<UiLang, string>;
}

export const TOOL_CATALOG: ToolCatalogItem[] = [
  {
    route: '/biodata-maker',
    id: 'biodata-maker',
    title: {
      en: 'Marriage Biodata Maker',
      mr: 'लग्न बायोडाटा मेकर',
      hi: 'मैरिज बायोडाटा मेकर',
    },
    shortDesc: {
      en: 'Create a printable A4 marriage biodata in 2 minutes with 110 traditional and modern templates, photo cropper, and instant PDF download.',
      mr: 'पारंपरिक पैठणी, शाही पेशवाई व ११० आधुनिक टेम्प्लेट्ससह २ मिनिटांत लग्नाचा A4 बायोडाटा आणि PDF बनवा.',
      hi: '११० पारंपरिक और आधुनिक टेम्प्लेट्स, फोटो क्रॉपर और लाइव प्रिव्यू के साथ २ मिनट में शादी का A4 बायोडाटा PDF बनाएं।',
    },
    metaLabel: {
      en: '110 Templates · 12 Languages',
      mr: '११० डिझाईन्स · १२ भाषा',
      hi: '११० डिज़ाइन · १२ भाषाएँ',
    },
    accentBg: 'bg-rose-50 border-rose-200',
    accentText: 'text-rose-700',
    seoTitle: {
      en: 'Free Marriage Biodata Maker Online — A4 PDF Download | SadhanBox',
      mr: 'लग्न बायोडाटा मेकर — लग्नाचा मराठी बायोडाटा मोफत बनवा | SadhanBox',
      hi: 'फ्री मैरिज बायोडाटा मेकर — शादी का बायोडाटा PDF बनाएं | SadhanBox',
    },
  },
  {
    route: '/resume-maker',
    id: 'resume-maker',
    title: {
      en: 'Resume Maker',
      mr: 'नोकरी रेझ्युमे मेकर',
      hi: 'जॉब रिज्यूमे मेकर',
    },
    shortDesc: {
      en: 'Build a clean, recruiter-ready A4 job resume with education, work experience, skills, photo upload, and instant PDF export.',
      mr: 'नोकरीसाठी स्वच्छ, व्यावसायिक आणि प्रिंट-रेडी A4 रेझ्युमे तयार करून झटपट PDF डाउनलोड करा.',
      hi: 'नौकरी के लिए प्रोफेशनल और प्रिंट-रेडी A4 रिज्यूमे बनाएं और तुरंत PDF डाउनलोड करें।',
    },
    metaLabel: {
      en: 'Corporate Layouts · A4 PDF',
      mr: 'कॉर्पोरेट टेम्प्लेट्स · A4 PDF',
      hi: 'कॉर्पोरेट टेम्प्लेट्स · A4 PDF',
    },
    accentBg: 'bg-blue-50 border-blue-200',
    accentText: 'text-blue-700',
    seoTitle: {
      en: 'Free Resume Maker Online — A4 Job Resume PDF | SadhanBox',
      mr: 'रेझ्युमे मेकर — नोकरीसाठी मोफत रेझ्युमे बनवा | SadhanBox',
      hi: 'फ्री रिज्यूमे मेकर — नौकरी के लिए ऑनलाइन रिज्यूमे PDF बनाएं | SadhanBox',
    },
  },
  {
    route: '/background-remover',
    id: 'background-remover',
    title: {
      en: 'Background Remover',
      mr: 'फोटो बॅकग्राउंड रिमूव्हर',
      hi: 'बैकग्राउंड रिमूवर',
    },
    shortDesc: {
      en: 'Remove image backgrounds automatically inside your browser, pick Transparent, White, or Blue backdrop, and download crisp PNG files.',
      mr: 'फोटोचे बॅकग्राउंड आपोआप काढून Transparent, पांढरा किंवा निळा रंग निवडा आणि PNG डाउनलोड करा.',
      hi: 'फोटो का बैकग्राउंड अपने ब्राउज़र में ऑटोमैटिक हटाएं, Transparent, सफेद या नीला रंग चुनें और PNG डाउनलोड करें।',
    },
    metaLabel: {
      en: 'Browser AI · Transparent PNG',
      mr: 'ब्राउझर AI · PNG डाउनलोड',
      hi: 'ब्राउज़र AI · PNG डाउनलोड',
    },
    accentBg: 'bg-violet-50 border-violet-200',
    accentText: 'text-violet-700',
    seoTitle: {
      en: 'Free Background Remover Online — Transparent, White, Blue PNG | SadhanBox',
      mr: 'बॅकग्राउंड रिमूव्हर — फोटोचे बॅकग्राउंड मोफत काढा | SadhanBox',
      hi: 'फ्री बैकग्राउंड रिमूवर — फोटो का बैकग्राउंड ऑनलाइन हटाएं | SadhanBox',
    },
  },
  {
    route: '/pdf-tools',
    id: 'pdf-tools',
    title: {
      en: 'PDF Tools (Merge & Split)',
      mr: 'PDF टूल्स (Merge व Split)',
      hi: 'PDF टूल्स (Merge व Split)',
    },
    shortDesc: {
      en: 'Merge multiple PDF documents, split selected pages into a new PDF, or convert JPG/PNG/WEBP images into a single PDF securely.',
      mr: 'एकापेक्षा जास्त PDF एकत्र करा (Merge), हवी ती पाने वेगळी करा (Split) आणि फोटोंची PDF बनवा.',
      hi: 'कई PDF फाइलों को जोड़ें (Merge), मनचाहे पेज अलग करें (Split) और फोटो से PDF बनाएं।',
    },
    metaLabel: {
      en: 'Merge · Split · Images to PDF',
      mr: 'Merge · Split · फोटोंची PDF',
      hi: 'Merge · Split · Images to PDF',
    },
    accentBg: 'bg-amber-50 border-amber-200',
    accentText: 'text-amber-700',
    seoTitle: {
      en: 'Free PDF Tools — Merge PDF, Split PDF, Images to PDF | SadhanBox',
      mr: 'PDF टूल्स — Merge, Split आणि फोटोंची PDF मोफत बनवा | SadhanBox',
      hi: 'फ्री PDF टूल्स — Merge, Split और Images to PDF ऑनलाइन | SadhanBox',
    },
  },
  {
    route: '/image-compressor',
    id: 'image-compressor',
    title: {
      en: 'Image Compressor (KB)',
      mr: 'इमेज कॉम्प्रेसर (KB मध्ये)',
      hi: 'इमेज कंप्रेसर (KB में)',
    },
    shortDesc: {
      en: 'Compress photos and signatures accurately to 20KB, 50KB, 100KB, or any custom KB size for MPSC, UPSC, and government forms.',
      mr: 'MPSC, UPSC व सरकारी फॉर्मसाठी फोटो आणि सही 20KB, 50KB, 100KB किंवा हव्या त्या KB साईजमध्ये कॉम्प्रेस करा.',
      hi: 'MPSC, UPSC और सरकारी फॉर्म के लिए फोटो व सिग्नेचर 20KB, 50KB, 100KB या मनचाहे KB साइज में कंप्रेस करें।',
    },
    metaLabel: {
      en: '20KB / 50KB / Custom KB',
      mr: '20KB / 50KB / कस्टम KB',
      hi: '20KB / 50KB / कस्टम KB',
    },
    accentBg: 'bg-emerald-50 border-emerald-200',
    accentText: 'text-emerald-700',
    seoTitle: {
      en: 'Image Compressor to 20KB, 50KB, 100KB Online Free | SadhanBox',
      mr: 'इमेज कॉम्प्रेसर — फोटो 20KB, 50KB, 100KB मध्ये कॉम्प्रेस करा | SadhanBox',
      hi: 'इमेज कंप्रेसर — फोटो को 20KB, 50KB, 100KB में कंप्रेस करें | SadhanBox',
    },
  },
  {
    route: '/qr-generator',
    id: 'qr-generator',
    title: {
      en: 'QR Code Generator',
      mr: 'QR Code जनरेटर',
      hi: 'QR Code जनरेटर',
    },
    shortDesc: {
      en: 'Generate high-resolution QR Codes instantly for website links, plain text, WhatsApp numbers, or UPI payment IDs in PNG format.',
      mr: 'वेबसाइट लिंक, मजकूर, WhatsApp नंबर किंवा UPI आयडीचा झटपट QR Code तयार करून PNG डाउनलोड करा.',
      hi: 'वेबसाइट लिंक, टेक्स्ट, WhatsApp नंबर या UPI आईडी के लिए तुरंत QR Code बनाएं और PNG डाउनलोड करें।',
    },
    metaLabel: {
      en: 'URL · WhatsApp · UPI QR Code',
      mr: 'लिंक · WhatsApp · UPI QR Code',
      hi: 'लिंक · WhatsApp · UPI QR Code',
    },
    accentBg: 'bg-cyan-50 border-cyan-200',
    accentText: 'text-cyan-700',
    seoTitle: {
      en: 'Free QR Code Generator — Link, WhatsApp & UPI QR PNG | SadhanBox',
      mr: 'QR Code जनरेटर — लिंक, WhatsApp आणि UPI QR Code मोफत बनवा | SadhanBox',
      hi: 'फ्री QR Code जनरेटर — लिंक, WhatsApp और UPI QR Code बनाएं | SadhanBox',
    },
  },
  {
    route: '/age-calculator',
    id: 'age-calculator',
    title: {
      en: 'Age Calculator',
      mr: 'वय कॅल्क्युलेटर',
      hi: 'आयु कैलकुलेटर',
    },
    shortDesc: {
      en: 'Calculate exact chronological age in years, months, and days, total days and hours lived, and your next birthday countdown.',
      mr: 'जन्मतारखेनुसार अचूक वय (वर्षे, महिने, दिवस), एकूण दिवस व तास आणि पुढील वाढदिवसाचे काउंटडाऊन तपासा.',
      hi: 'जन्मतिथि के आधार पर सटीक उम्र (वर्ष, महीने, दिन), कुल दिन/घंटे और अगले जन्मदिन का काउंटडाउन देखें।',
    },
    metaLabel: {
      en: 'Exact Years, Months & Days',
      mr: 'अचूक वर्षे, महिने व दिवस',
      hi: 'सटीक वर्ष, महीने व दिन',
    },
    accentBg: 'bg-indigo-50 border-indigo-200',
    accentText: 'text-indigo-700',
    seoTitle: {
      en: 'Age Calculator — Exact Years, Months, Days & Birthday Countdown | SadhanBox',
      mr: 'वय कॅल्क्युलेटर — अचूक वय व पुढील वाढदिवस काउंटडाऊन | SadhanBox',
      hi: 'आयु कैलकुलेटर — सटीक उम्र और अगला जन्मदिन काउंटडाउन | SadhanBox',
    },
  },
];

export const LEGAL_ROUTES: LegalRoute[] = ['/about', '/privacy-policy', '/terms', '/contact'];

const VALID_ROUTES = new Set<string>([
  '/',
  ...TOOL_CATALOG.map((t) => t.route),
  ...LEGAL_ROUTES,
]);

export function normalizeAppRoute(pathname: string): AppRoute {
  const cleaned = pathname.replace(/\/+$/, '') || '/';
  return VALID_ROUTES.has(cleaned) ? (cleaned as AppRoute) : '/';
}

export function getHomePageTitle(lang: UiLang = 'en'): string {
  if (lang === 'mr') {
    return 'SadhanBox (साधनबॉक्स) — तुमच्या दैनंदिन कामांसाठी १००% मोफत आणि सुरक्षित ऑनलाइन साधने';
  }
  if (lang === 'hi') {
    return 'SadhanBox (साधनबॉक्स) — आपके दैनिक कार्यों के लिए १००% मुफ्त और सुरक्षित ऑनलाइन टूल्स';
  }
  return 'SadhanBox — 100% Free & Private Client-Side Online Utility Tools';
}
