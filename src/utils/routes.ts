import { UiLang } from './siteI18n';

export type ToolRoute =
  | '/biodata-maker'
  | '/resume-maker'
  | '/background-remover'
  | '/pdf-tools'
  | '/image-compressor'
  | '/qr-generator'
  | '/age-calculator'
  | '/passport-photo-maker'
  | '/signature-resize'
  | '/rent-receipt-generator'
  | '/gst-emi-calculator'
  | '/image-converter'
  | '/word-counter-typing'
  | '/watermark-adder'
  | '/pdf-compressor'
  | '/id-card-print'
  | '/invitation-card-maker'
  | '/gst-invoice-maker'
  | '/pdf-to-jpg-scanner';

export type LegalRoute = '/about' | '/privacy-policy' | '/terms' | '/contact';

export type AppRoute = '/' | ToolRoute | LegalRoute;

export interface ToolCatalogItem {
  route: ToolRoute;
  id: string;
  isProOnly?: boolean;
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
  {
    route: '/passport-photo-maker',
    id: 'passport-photo-maker',
    title: {
      en: 'Passport Photo Maker',
      mr: 'पासपोर्ट फोटो मेकर',
      hi: 'पासपोर्ट फोटो मेकर',
    },
    shortDesc: {
      en: 'Add Name and Photo Date on passport photos, pick White or Light Blue background, and download 8 or 12 photo A4 sheets for MPSC/UPSC in PDF or JPG.',
      mr: 'फोटोखाली नाव व फोटो काढल्याची तारीख लिहा, पांढरे किंवा हलके निळे बॅकग्राउंड निवडा आणि MPSC/UPSC साठी ८ किंवा १२ फोटोंची A4 शीट PDF/JPG मध्ये डाउनलोड करा.',
      hi: 'फोटो के नीचे नाम व तारीख जोड़ें, सफेद या हल्का नीला बैकग्राउंड चुनें और MPSC/UPSC के लिए ८ या १२ फोटो की A4 शीट PDF/JPG में डाउनलोड करें।',
    },
    metaLabel: {
      en: 'Name & Date · A4 8/12 PDF & JPG',
      mr: 'नाव व तारीख · A4 ८/१२ PDF/JPG',
      hi: 'नाम व तारीख · A4 ८/१२ PDF/JPG',
    },
    accentBg: 'bg-sky-50 border-sky-200',
    accentText: 'text-sky-700',
    seoTitle: {
      en: 'Free Passport Photo Maker Online — Name & Date, A4 8/12 Sheet PDF & JPG | SadhanBox',
      mr: 'पासपोर्ट फोटो मेकर — नाव व तारीख टाकून MPSC/UPSC साठी A4 शीट PDF/JPG बनवा | SadhanBox',
      hi: 'फ्री पासपोर्ट फोटो मेकर — नाम व तारीख के साथ A4 शीट PDF/JPG बनाएं | SadhanBox',
    },
  },
  {
    route: '/signature-resize',
    id: 'signature-resize',
    title: {
      en: 'Signature & Thumb Resize Tool',
      mr: 'सही आणि अंगठा रिसाईझ टूल',
      hi: 'सिग्नेचर व थंब रिसाइज़ टूल',
    },
    shortDesc: {
      en: 'Auto-crop and resize signatures and thumb impressions to exact govt form dimensions (140×60px, 240×240px) and 10KB–20KB JPG size.',
      mr: 'सरकारी फॉर्मसाठी सही व अंगठ्याचा ठसा अचूक पिक्सेल (140×60px, 240×240px) आणि 10KB ते 20KB साईझमध्ये ऑटो-क्रॉप व कॉम्प्रेस करा.',
      hi: 'सरकारी फॉर्म के लिए सिग्नेचर और अंगूठे के निशान को सटीक पिक्सेल (140×60px, 240×240px) और 10KB–20KB में ऑटो-क्रॉप व कंप्रेस करें।',
    },
    metaLabel: {
      en: '140×60px · 240×240px · 10–20KB',
      mr: '140×60px · 240×240px · 10–20KB',
      hi: '140×60px · 240×240px · 10–20KB',
    },
    accentBg: 'bg-teal-50 border-teal-200',
    accentText: 'text-teal-700',
    seoTitle: {
      en: 'Signature & Thumb Impression Resize Online (140×60px, 240×240px, 10–20KB) | SadhanBox',
      mr: 'सही आणि अंगठा रिसाईझ टूल — 140×60px, 240×240px व 10–20KB ऑटो-क्रॉप | SadhanBox',
      hi: 'सिग्नेचर व थंब रिसाइज़ टूल — 140×60px, 240×240px और 10–20KB ऑटो-क्रॉप | SadhanBox',
    },
  },
  {
    route: '/rent-receipt-generator',
    id: 'rent-receipt-generator',
    title: {
      en: 'Rent Receipt & Salary Slip Generator',
      mr: 'घरभाडे पावती व पगार स्लिप जनरेटर',
      hi: 'रेंट रसीद व सैलरी स्लिप जनरेटर',
    },
    shortDesc: {
      en: 'Generate printable HRA Rent Receipts (with Revenue Stamp & PAN) and professional Salary Slips, and export ready-to-print A4 PDFs instantly.',
      mr: 'आयकर (HRA) बचतीसाठी घरभाडे पावती (Rent Receipt) आणि सोपी पगार स्लिप (Salary Slip) तयार करून झटपट A4 PDF डाउनलोड करा.',
      hi: 'इनकम टैक्स (HRA) बचत के लिए रेंट रसीद (Rent Receipt) और प्रोफेशनल सैलरी स्लिप (Salary Slip) बनाकर तुरंत A4 PDF डाउनलोड करें।',
    },
    metaLabel: {
      en: 'HRA Rent Receipt · Salary Slip A4 PDF',
      mr: 'HRA घरभाडे पावती · पगार स्लिप PDF',
      hi: 'HRA रेंट रसीद · सैलरी स्लिप PDF',
    },
    accentBg: 'bg-orange-50 border-orange-200',
    accentText: 'text-orange-700',
    seoTitle: {
      en: 'Free Rent Receipt (HRA) & Salary Slip Generator — A4 PDF | SadhanBox',
      mr: 'घरभाडे पावती व पगार स्लिप जनरेटर — HRA साठी A4 PDF मोफत बनवा | SadhanBox',
      hi: 'फ्री रेंट रसीद (HRA) व सैलरी स्लिप जनरेटर — A4 PDF डाउनलोड | SadhanBox',
    },
  },
  {
    route: '/gst-emi-calculator',
    id: 'gst-emi-calculator',
    title: {
      en: 'GST & EMI Calculator',
      mr: 'GST व EMI कॅल्क्युलेटर',
      hi: 'GST व EMI कैलकुलेटर',
    },
    shortDesc: {
      en: 'Calculate GST Inclusive & Exclusive amounts (3%, 5%, 12%, 18%, 28%) with CGST/SGST split, and compute Home/Vehicle Loan EMI & total interest.',
      mr: 'व्यवसायासाठी GST (3%, 5%, 12%, 18%, 28%) Inclusive/Exclusive आणि गृहकर्ज/वाहन कर्जाचा मासिक EMI व व्याज अचूक मोजा.',
      hi: 'व्यापार के लिए GST (3%, 5%, 12%, 18%, 28%) Inclusive/Exclusive और होम/वाहन लोन की मासिक EMI व कुल ब्याज आसानी से निकालें।',
    },
    metaLabel: {
      en: 'GST (3–28%) · Home & Car Loan EMI',
      mr: 'GST (3–28%) · कर्ज EMI व व्याज',
      hi: 'GST (3–28%) · लोन EMI व ब्याज',
    },
    accentBg: 'bg-purple-50 border-purple-200',
    accentText: 'text-purple-700',
    seoTitle: {
      en: 'Free GST Calculator (3%–28%) & Loan EMI Calculator Online | SadhanBox',
      mr: 'GST व EMI कॅल्क्युलेटर — GST हिशोब आणि कर्ज हप्ता (EMI) मोफत मोजा | SadhanBox',
      hi: 'फ्री GST कैलकुलेटर (3%–28%) और लोन EMI कैलकुलेटर | SadhanBox',
    },
  },
  {
    route: '/image-converter',
    id: 'image-converter',
    title: {
      en: 'Image Format Converter',
      mr: 'इमेज फॉरमॅट कन्व्हर्टर',
      hi: 'इमेज फॉर्मेट कन्वर्टर',
    },
    shortDesc: {
      en: 'Convert any mobile or desktop photo (PNG, WebP, JPG, BMP) into crisp high-quality JPG, PNG, or WebP directly in your browser.',
      mr: 'मोबाईलमधील कोणत्याही फोटोचे (PNG, WebP, JPG, BMP) थेट ब्राउझरमध्ये उच्च गुणवत्तेच्या JPG, PNG किंवा WebP फॉरमॅटमध्ये रूपांतर करा.',
      hi: 'मोबाइल की किसी भी फोटो (PNG, WebP, JPG, BMP) को सीधे ब्राउज़र में उच्च गुणवत्ता वाले JPG, PNG या WebP में बदलें।',
    },
    metaLabel: {
      en: 'PNG · JPG · WebP · BMP',
      mr: 'PNG · JPG · WebP · BMP',
      hi: 'PNG · JPG · WebP · BMP',
    },
    accentBg: 'bg-pink-50 border-pink-200',
    accentText: 'text-pink-700',
    seoTitle: {
      en: 'Free Image Format Converter — PNG, WebP, JPG, BMP Online | SadhanBox',
      mr: 'इमेज फॉरमॅट कन्व्हर्टर — फोटो JPG, PNG व WebP मध्ये मोफत बदला | SadhanBox',
      hi: 'फ्री इमेज फॉर्मेट कन्वर्टर — फोटो JPG, PNG व WebP में बदलें | SadhanBox',
    },
  },
  {
    route: '/word-counter-typing',
    id: 'word-counter-typing',
    title: {
      en: 'Word Counter & Marathi/Hindi Typing Pad',
      mr: 'वर्ड काउंटर व मराठी/हिंदी टायपिंग पॅड',
      hi: 'वर्ड काउंटर व मराठी/हिंदी टाइपिंग पैड',
    },
    shortDesc: {
      en: 'Count exact words, characters, and sentences in real time, and type Marathi or Hindi phonetically using English letters with one-click copy.',
      mr: 'मजकुरातील शब्द, अक्षरे व वाक्यांची संख्या मोजा आणि इंग्रजी अक्षरांतून (Transliteration) मराठी किंवा हिंदी टाईप करून कॉपी करा.',
      hi: 'टेक्स्ट में शब्द, अक्षर और वाक्य गिनें, साथ ही अंग्रेजी अक्षरों (Transliteration) से मराठी या हिंदी टाइप करके तुरंत कॉपी करें।',
    },
    metaLabel: {
      en: 'Words & Chars · English → मराठी / हिंदी',
      mr: 'शब्द मोजणी · English → मराठी / हिंदी',
      hi: 'शब्द गणना · English → मराठी / हिंदी',
    },
    accentBg: 'bg-lime-50 border-lime-200',
    accentText: 'text-lime-700',
    seoTitle: {
      en: 'Word Counter & English to Marathi / Hindi Typing Pad Online | SadhanBox',
      mr: 'वर्ड काउंटर व मराठी/हिंदी टायपिंग पॅड — शब्द मोजणी व टायपिंग | SadhanBox',
      hi: 'वर्ड काउंटर व मराठी/हिंदी टाइपिंग पैड — शब्द गिनें और टाइप करें | SadhanBox',
    },
  },
  {
    route: '/watermark-adder',
    id: 'watermark-adder',
    isProOnly: true,
    title: {
      en: 'Watermark Adder (Image, PDF & Video)',
      mr: 'वॉटरमार्क ॲडर (इमेज, PDF व व्हिडिओ)',
      hi: 'वॉटरमार्क ऐडर (इमेज, PDF व वीडियो)',
    },
    shortDesc: {
      en: 'Add custom text or logo watermarks on Photos, PDF documents, and Videos with diagonal tiling, opacity, rotation, and color controls.',
      mr: 'फोटो, PDF कागदपत्रे आणि व्हिडिओवर हवा तो मजकूर किंवा लोगो वॉटरमार्क (तिरका, मध्यभागी किंवा कोपऱ्यात) जोडून डाउनलोड करा.',
      hi: 'फोटो, PDF डॉक्यूमेंट और वीडियो पर मनचाहा टेक्स्ट या लोगो वॉटरमार्क (तिरछा, बीच या कोने में) लगाकर डाउनलोड करें।',
    },
    metaLabel: {
      en: 'Image · PDF · Video · Pro Tool',
      mr: 'इमेज · PDF · व्हिडिओ · Pro टूल',
      hi: 'इमेज · PDF · वीडियो · Pro टूल',
    },
    accentBg: 'bg-amber-50 border-amber-200',
    accentText: 'text-amber-700',
    seoTitle: {
      en: 'Watermark Adder for Image, PDF & Video Online | SadhanBox Pro',
      mr: 'वॉटरमार्क ॲडर — फोटो, PDF व व्हिडिओवर वॉटरमार्क लावा | SadhanBox Pro',
      hi: 'वॉटरमार्क ऐडर — फोटो, PDF और वीडियो पर वॉटरमार्क लगाएं | SadhanBox Pro',
    },
  },
  {
    route: '/pdf-compressor',
    id: 'pdf-compressor',
    title: {
      en: 'PDF Compressor (Target KB)',
      mr: 'PDF कॉम्प्रेसर (KB मध्ये)',
      hi: 'PDF कंप्रेसर (KB में)',
    },
    shortDesc: {
      en: 'Reduce PDF file size cleanly to 100 KB, 200 KB, 500 KB, or any custom KB target for government forms and portals inside your browser.',
      mr: 'सरकारी फॉर्म व पोर्टलसाठी PDF ची साईज अचूक 100 KB, 200 KB, 500 KB किंवा हव्या त्या KB मध्ये थेट ब्राउझरमध्ये कमी करा.',
      hi: 'सरकारी फॉर्म और पोर्टल के लिए PDF साइज सीधे ब्राउज़र में 100 KB, 200 KB, 500 KB या मनचाहे KB में कम करें।',
    },
    metaLabel: {
      en: '100KB / 200KB / Custom KB',
      mr: '100KB / 200KB / कस्टम KB',
      hi: '100KB / 200KB / कस्टम KB',
    },
    accentBg: 'bg-emerald-50 border-emerald-200',
    accentText: 'text-emerald-700',
    seoTitle: {
      en: 'Free PDF Compressor Online — Reduce PDF Size to 100KB, 200KB | SadhanBox',
      mr: 'PDF कॉम्प्रेसर — PDF साईज 100KB, 200KB मध्ये मोफत कमी करा | SadhanBox',
      hi: 'फ्री PDF कंप्रेसर — PDF साइज 100KB, 200KB में कम करें | SadhanBox',
    },
  },
  {
    route: '/id-card-print',
    id: 'id-card-print',
    title: {
      en: 'ID Card A4 Print Maker',
      mr: 'आधार / पॅन ID कार्ड A4 प्रिंट मेकर',
      hi: 'आधार / पैन ID कार्ड A4 प्रिंट मेकर',
    },
    shortDesc: {
      en: 'Place Front & Back photos of Aadhaar, PAN, or Voter ID onto a crisp A4 print sheet (1, 2, or 4 copies) with crop, rotate, and text boost.',
      mr: 'आधार, पॅन किंवा मतदार कार्डची पुढची व मागची बाजू एकाच A4 पानावर क्रॉप, रोटेट व स्पष्ट अक्षरांसह प्रिंटसाठी तयार करा.',
      hi: 'आधार, पैन या वोटर ID के आगे और पीछे की फोटो एक ही A4 पेज पर क्रॉप, रोटेट व साफ टेक्स्ट के साथ प्रिंट-रेडी बनाएं।',
    },
    metaLabel: {
      en: 'Front + Back · 1/2/4 Copies A4',
      mr: 'Front + Back · १/२/४ प्रती A4',
      hi: 'Front + Back · 1/2/4 कॉपी A4',
    },
    accentBg: 'bg-sky-50 border-sky-200',
    accentText: 'text-sky-700',
    seoTitle: {
      en: 'ID Card A4 Print Maker — Aadhaar & PAN Front Back on One Page PDF | SadhanBox',
      mr: 'ID कार्ड A4 प्रिंट मेकर — आधार व पॅन दोन्ही बाजू एकाच पानावर PDF बनवा | SadhanBox',
      hi: 'ID कार्ड A4 प्रिंट मेकर — आधार व पैन आगे-पीछे एक पेज PDF | SadhanBox',
    },
  },
  {
    route: '/invitation-card-maker',
    id: 'invitation-card-maker',
    title: {
      en: 'Digital Invitation & Festival Card Maker',
      mr: 'डिजिटल निमंत्रण व सण शुभेच्छा कार्ड मेकर',
      hi: 'डिजिटल निमंत्रण व त्यौहार कार्ड मेकर',
    },
    shortDesc: {
      en: 'Design WhatsApp-ready Wedding Save-the-Date, Birthday Invitations, and Festival / Shop Offer cards in Marathi, Hindi & English with instant PNG/JPG.',
      mr: 'मराठी, हिंदी व इंग्रजीत लग्न निमंत्रण (Save the Date), वाढदिवस आणि सण/दुकान ऑफरची WhatsApp कार्ड्स काही सेकंदांत बनवा.',
      hi: 'मराठी, हिंदी और अंग्रेजी में शादी निमंत्रण, जन्मदिन व त्यौहार/दुकान ऑफर के WhatsApp कार्ड कुछ सेकंड में बनाएं।',
    },
    metaLabel: {
      en: 'Wedding · Birthday · Festival PNG',
      mr: 'लग्न · वाढदिवस · सण व ऑफर कार्ड',
      hi: 'शादी · जन्मदिन · त्यौहार कार्ड',
    },
    accentBg: 'bg-rose-50 border-rose-200',
    accentText: 'text-rose-700',
    seoTitle: {
      en: 'Free Digital Invitation & Festival Card Maker — Marathi WhatsApp Cards | SadhanBox',
      mr: 'डिजिटल निमंत्रण व सण कार्ड मेकर — मराठी लग्नपत्रिका व WhatsApp कार्ड बनवा | SadhanBox',
      hi: 'फ्री डिजिटल निमंत्रण व त्यौहार कार्ड मेकर — WhatsApp कार्ड बनाएं | SadhanBox',
    },
  },
  {
    route: '/gst-invoice-maker',
    id: 'gst-invoice-maker',
    title: {
      en: 'GST Invoice & Quotation Maker',
      mr: 'GST बिल (Invoice) व कोटेशन मेकर',
      hi: 'GST बिल (Invoice) व कोटेशन मेकर',
    },
    shortDesc: {
      en: 'Create professional GST Tax Invoices (CGST+SGST / IGST) and Business Quotations with HSN codes, auto Rupee words, and instant A4 PDF export.',
      mr: 'व्यवसाय व दुकानदारांसाठी CGST+SGST / IGST सह व्यावसायिक टॅक्स बिल (Invoice) आणि कोटेशन A4 PDF झटपट तयार करा.',
      hi: 'व्यापार व दुकानों के लिए CGST+SGST / IGST के साथ प्रोफेशनल GST बिल (Invoice) और कोटेशन A4 PDF तुरंत बनाएं।',
    },
    metaLabel: {
      en: 'Tax Invoice · Quotation · A4 PDF',
      mr: 'GST टॅक्स बिल · कोटेशन · A4 PDF',
      hi: 'GST बिल · कोटेशन · A4 PDF',
    },
    accentBg: 'bg-indigo-50 border-indigo-200',
    accentText: 'text-indigo-700',
    seoTitle: {
      en: 'Free GST Invoice & Quotation Generator Online — A4 PDF | SadhanBox',
      mr: 'GST बिल व कोटेशन मेकर — दुकानाचे मोफत A4 PDF बिल बनवा | SadhanBox',
      hi: 'फ्री GST बिल व कोटेशन जनरेटर ऑनलाइन — A4 PDF डाउनलोड | SadhanBox',
    },
  },
  {
    route: '/pdf-to-jpg-scanner',
    id: 'pdf-to-jpg-scanner',
    title: {
      en: 'PDF to JPG & Document Scan Cleaner',
      mr: 'PDF ते JPG व डॉक्युमेंट स्कॅन क्लीनर',
      hi: 'PDF से JPG व डॉक्यूमेंट स्कैन क्लीनर',
    },
    shortDesc: {
      en: 'Convert PDF pages into crisp JPG photos or whiten dark/shadowed mobile document photos into clean scanner-quality JPG and A4 PDF files.',
      mr: 'PDF मधील पाने JPG फोटोत बदला किंवा मोबाईलने काढलेले काळपट कागदपत्रे पांढरे स्वच्छ (Scan Cleaner) करून JPG/PDF डाउनलोड करा.',
      hi: 'PDF पेजों को साफ JPG फोटो में बदलें या मोबाइल से ली गई अंधेरी डॉक्यूमेंट फोटो को सफेद साफ स्कैन (JPG/PDF) बनाएं।',
    },
    metaLabel: {
      en: 'PDF → JPG · White Scan Cleaner',
      mr: 'PDF → JPG · स्कॅन क्लीनर',
      hi: 'PDF → JPG · स्कैन क्लीनर',
    },
    accentBg: 'bg-cyan-50 border-cyan-200',
    accentText: 'text-cyan-700',
    seoTitle: {
      en: 'PDF to JPG Converter & Document Scan Cleaner Online Free | SadhanBox',
      mr: 'PDF ते JPG व डॉक्युमेंट स्कॅन क्लीनर — मोफत ऑनलाइन टूल | SadhanBox',
      hi: 'PDF से JPG कन्वर्टर व डॉक्यूमेंट स्कैन क्लीनर ऑनलाइन | SadhanBox',
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
  return 'SadhanBox - Free Online Tools for Biodata, Resume, PDF, Image & QR';
}
