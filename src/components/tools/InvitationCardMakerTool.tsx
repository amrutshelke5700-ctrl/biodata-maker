import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import {
  AlertCircle,
  Download,
  ImagePlus,
  Loader2,
  PartyPopper,
  RotateCcw,
  Sparkles,
  Store,
  Trash2,
  Type,
} from 'lucide-react';
import { ToolShell } from './ToolShell';
import { WhatsAppShareBar } from './WhatsAppShareBar';
import { pushDataLayerEvent } from '../../utils/gtm';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang } from '../../utils/siteI18n';

interface InvitationCardMakerToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
  onToolDownload: () => void;
}

type CardCategory = 'wedding' | 'birthday' | 'festival';
type CardAspect = '4:5' | '9:16' | '1:1';
type TemplateLayoutId =
  | 'royal-arch'
  | 'modern-editorial'
  | 'floral-botanical'
  | 'festive-toran'
  | 'spotlight-ribbon'
  | 'luxe-foil';
type FontStyleId =
  | 'royal-serif'
  | 'calligraphy'
  | 'heritage-palace'
  | 'modern-editorial'
  | 'festive-brush'
  | 'classic-clean';
type ThemeId =
  | 'paithani-gold'
  | 'champagne-blush'
  | 'sage-ivory'
  | 'crimson-royal'
  | 'festive-saffron'
  | 'midnight-luxe'
  | 'lavender-royal'
  | 'peacock-teal';
type TextScaleId = 'compact' | 'standard' | 'large';

interface CardTheme {
  id: ThemeId;
  label: Record<UiLang, string>;
  bg: string;
  bgGradient: string;
  innerBg: string;
  innerBgGradient: string;
  border: string;
  accent: string;
  secondaryAccent: string;
  headingColor: string;
  textColor: string;
  mutedColor: string;
  badgeBg: string;
  badgeText: string;
}

interface TemplateOption {
  id: TemplateLayoutId;
  label: Record<UiLang, string>;
  tag: Record<UiLang, string>;
}

interface FontStyleOption {
  id: FontStyleId;
  label: Record<UiLang, string>;
  sample: string;
  headingFamily: string;
  bodyFamily: string;
  headingWeight: number;
  namesMultiplier: number;
  letterSpacing: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'royal-arch',
    label: { en: 'Royal Arch', mr: 'शाही कमान', hi: 'शाही मेहराब' },
    tag: { en: 'Mandap Dome', mr: 'मंगल कलश', hi: 'मंगल कलश' },
  },
  {
    id: 'modern-editorial',
    label: { en: 'Modern Minimal', mr: 'मॉडर्न मिनिमल', hi: 'मॉडर्न मिनिमल' },
    tag: { en: 'Editorial Chic', mr: 'आधुनिक', hi: 'आधुनिक' },
  },
  {
    id: 'floral-botanical',
    label: { en: 'Floral Frame', mr: 'पुष्प नक्षी', hi: 'पुष्प बॉर्डर' },
    tag: { en: 'Lotus & Vine', mr: 'फुलांची सजावट', hi: 'फूल-पत्ती' },
  },
  {
    id: 'festive-toran',
    label: { en: 'Festive Toran', mr: 'उत्सव तोरण', hi: 'त्यौहार तोरण' },
    tag: { en: 'Diya & Garland', mr: 'झेंडू तोरण', hi: 'दीया व तोरण' },
  },
  {
    id: 'spotlight-ribbon',
    label: { en: 'Crest & Ribbon', mr: 'रिबन पोस्टर', hi: 'रिबन पोस्टर' },
    tag: { en: 'Celebration', mr: 'फोटो हायलाइट', hi: 'सेलिब्रेशन' },
  },
  {
    id: 'luxe-foil',
    label: { en: 'Luxe Mandala', mr: 'लक्झरी मंडला', hi: 'लक्ज़री मंडला' },
    tag: { en: 'Gold Crest', mr: 'सुवर्ण फ्रेम', hi: 'स्वर्ण फ्रेम' },
  },
];

const FONT_STYLES: FontStyleOption[] = [
  {
    id: 'royal-serif',
    label: { en: 'Royal Serif', mr: 'रॉयल सेरिफ', hi: 'रॉयल सेरिफ' },
    sample: 'Aa · श्री',
    headingFamily: "'Playfair Display', 'Rozha One', 'Noto Serif Devanagari', Georgia, serif",
    bodyFamily: "'Cormorant Garamond', 'Noto Serif Devanagari', Georgia, serif",
    headingWeight: 700,
    namesMultiplier: 1.04,
    letterSpacing: '0.01em',
  },
  {
    id: 'calligraphy',
    label: { en: 'Calligraphy', mr: 'कॅलिग्राफी', hi: 'कैलिग्राफी' },
    sample: 'Aa · शुभ',
    headingFamily: "'Great Vibes', 'Kalam', 'Noto Serif Devanagari', cursive",
    bodyFamily: "'Cormorant Garamond', 'Noto Serif Devanagari', Georgia, serif",
    headingWeight: 700,
    namesMultiplier: 1.24,
    letterSpacing: '0.01em',
  },
  {
    id: 'heritage-palace',
    label: { en: 'Heritage Display', mr: 'पारंपरिक ठसा', hi: 'पारंपरिक शैली' },
    sample: 'AA · मंगल',
    headingFamily: "'Cinzel', 'Yatra One', 'Noto Serif Devanagari', Georgia, serif",
    bodyFamily: "'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif",
    headingWeight: 700,
    namesMultiplier: 0.98,
    letterSpacing: '0.025em',
  },
  {
    id: 'modern-editorial',
    label: { en: 'Modern Sans', mr: 'मॉडर्न सॅन्स', hi: 'मॉडर्न सैंस' },
    sample: 'Aa · निमंत्रण',
    headingFamily: "'Outfit', 'Noto Sans Devanagari', sans-serif",
    bodyFamily: "'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif",
    headingWeight: 800,
    namesMultiplier: 1.0,
    letterSpacing: '-0.01em',
  },
  {
    id: 'festive-brush',
    label: { en: 'Festive Brush', mr: 'उत्सवी ब्रश', hi: 'उत्सवी ब्रश' },
    sample: 'Aa · उत्सव',
    headingFamily: "'Dancing Script', 'Tillana', 'Noto Sans Devanagari', cursive",
    bodyFamily: "'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif",
    headingWeight: 700,
    namesMultiplier: 1.14,
    letterSpacing: '0.005em',
  },
  {
    id: 'classic-clean',
    label: { en: 'Classic Print', mr: 'क्लासिक प्रिंट', hi: 'क्लासिक प्रिंट' },
    sample: 'Aa · आमंत्रण',
    headingFamily: "'Plus Jakarta Sans', 'Noto Serif Devanagari', sans-serif",
    bodyFamily: "'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif",
    headingWeight: 700,
    namesMultiplier: 0.98,
    letterSpacing: '0em',
  },
];

const THEMES: CardTheme[] = [
  {
    id: 'paithani-gold',
    label: { en: 'Royal Paithani', mr: 'शाही पैठणी', hi: 'शाही पैठणी' },
    bg: '#4A0E24',
    bgGradient: 'linear-gradient(145deg, #4A0E24 0%, #74183B 55%, #3B091B 100%)',
    innerBg: '#FFFBF2',
    innerBgGradient: 'linear-gradient(180deg, #FFFDF8 0%, #FDF4E3 100%)',
    border: '#D4AF37',
    accent: '#9A3412',
    secondaryAccent: '#B45309',
    headingColor: '#7C1D35',
    textColor: '#1E293B',
    mutedColor: '#64748B',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
  },
  {
    id: 'champagne-blush',
    label: { en: 'Champagne Blush', mr: 'शॅम्पेन ब्लश', hi: 'शैम्पेन ब्लश' },
    bg: '#8C545E',
    bgGradient: 'linear-gradient(145deg, #F5E6E1 0%, #E7CEC8 55%, #D9B6AE 100%)',
    innerBg: '#FFFCFA',
    innerBgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FDF5F2 100%)',
    border: '#B77B6F',
    accent: '#9D4E5A',
    secondaryAccent: '#C08A58',
    headingColor: '#6E2E3A',
    textColor: '#292524',
    mutedColor: '#6B5E5B',
    badgeBg: '#F9E8E4',
    badgeText: '#7C3642',
  },
  {
    id: 'sage-ivory',
    label: { en: 'Sage & Gold', mr: 'सेज व सुवर्ण', hi: 'सेज और गोल्ड' },
    bg: '#284B3C',
    bgGradient: 'linear-gradient(145deg, #213F32 0%, #355E4B 55%, #1D372B 100%)',
    innerBg: '#FAFBF7',
    innerBgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F3F6EE 100%)',
    border: '#C59B43',
    accent: '#2D5A45',
    secondaryAccent: '#B38728',
    headingColor: '#1E4032',
    textColor: '#1E293B',
    mutedColor: '#526058',
    badgeBg: '#E6F0EA',
    badgeText: '#1E4032',
  },
  {
    id: 'crimson-royal',
    label: { en: 'Mangal Kumkum', mr: 'मंगल कुंकू', hi: 'मंगल कुमकुम' },
    bg: '#7F1D1D',
    bgGradient: 'linear-gradient(145deg, #7F1D1D 0%, #991B1B 50%, #5F1111 100%)',
    innerBg: '#FFF9F0',
    innerBgGradient: 'linear-gradient(180deg, #FFFDF9 0%, #FEF1DC 100%)',
    border: '#CA8A04',
    accent: '#B91C1C',
    secondaryAccent: '#D97706',
    headingColor: '#881313',
    textColor: '#1F2937',
    mutedColor: '#6B7280',
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
  },
  {
    id: 'festive-saffron',
    label: { en: 'Festive Marigold', mr: 'झेंडू उत्सव', hi: 'गेंदा उत्सव' },
    bg: '#C2410C',
    bgGradient: 'linear-gradient(145deg, #B45309 0%, #EA580C 52%, #9A3412 100%)',
    innerBg: '#FFFBEB',
    innerBgGradient: 'linear-gradient(180deg, #FFFDF5 0%, #FEF3C7 100%)',
    border: '#EA580C',
    accent: '#C2410C',
    secondaryAccent: '#EAB308',
    headingColor: '#9A3412',
    textColor: '#1E293B',
    mutedColor: '#57534E',
    badgeBg: '#FFEDD5',
    badgeText: '#9A3412',
  },
  {
    id: 'midnight-luxe',
    label: { en: 'Midnight Gold', mr: 'रॉयल नाईट', hi: 'रॉयल नाइट' },
    bg: '#0F172A',
    bgGradient: 'linear-gradient(145deg, #090E1A 0%, #172542 55%, #0B1221 100%)',
    innerBg: '#162033',
    innerBgGradient: 'linear-gradient(180deg, #1A263D 0%, #10192B 100%)',
    border: '#EAB308',
    accent: '#FACC15',
    secondaryAccent: '#FDE047',
    headingColor: '#FEF08A',
    textColor: '#F8FAFC',
    mutedColor: '#CBD5E1',
    badgeBg: '#27354F',
    badgeText: '#FDE047',
  },
  {
    id: 'lavender-royal',
    label: { en: 'Lavender Luxe', mr: 'लॅव्हेंडर लक्स', hi: 'लैवेंडर लक्स' },
    bg: '#4C1D95',
    bgGradient: 'linear-gradient(145deg, #4C1D95 0%, #6D28D9 55%, #3B0764 100%)',
    innerBg: '#FCF9FF',
    innerBgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F5EEFF 100%)',
    border: '#C084FC',
    accent: '#6D28D9',
    secondaryAccent: '#D97706',
    headingColor: '#4C1D95',
    textColor: '#1E1B4B',
    mutedColor: '#64748B',
    badgeBg: '#EDE9FE',
    badgeText: '#5B21B6',
  },
  {
    id: 'peacock-teal',
    label: { en: 'Peacock Teal', mr: 'मोरपंखी निळा', hi: 'मोरपंखी टील' },
    bg: '#0F4C5C',
    bgGradient: 'linear-gradient(145deg, #0B3B49 0%, #155E75 55%, #082F3B 100%)',
    innerBg: '#F6FCFB',
    innerBgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #EAF7F5 100%)',
    border: '#D97706',
    accent: '#0E7490',
    secondaryAccent: '#F59E0B',
    headingColor: '#0F4C5C',
    textColor: '#1E293B',
    mutedColor: '#475569',
    badgeBg: '#CCFBF1',
    badgeText: '#115E59',
  },
];

interface CardContent {
  topInvocation: string;
  eventTitle: string;
  mainNames: string;
  dateTimeLine: string;
  venueLine: string;
  messageLine: string;
  hostLine: string;
  photoDataUrl: string;
}

function getDefaultContent(cat: CardCategory, lang: UiLang): CardContent {
  if (cat === 'wedding') {
    if (lang === 'mr') {
      return {
        topInvocation: '|| श्री गणेशाय नमः ||',
        eventTitle: 'शुभमंगल निमंत्रण',
        mainNames: 'चि. रोहन आणि चि.सौ.कां. स्नेहा',
        dateTimeLine: 'रविवार, २४ जानेवारी २०२७ · दु. १२:२५ वा.',
        venueLine: 'श्री मंगल कार्यालय, कोथरूड, पुणे',
        messageLine: 'आमच्या शुभविवाह सोहळ्यास आपली स्नेहपूर्ण उपस्थिती प्रार्थनीय आहे.',
        hostLine: 'निमंत्रक: देशमुख व कुलकर्णी परिवार',
        photoDataUrl: '',
      };
    }
    if (lang === 'hi') {
      return {
        topInvocation: '|| श्री गणेशाय नमः ||',
        eventTitle: 'शुभ विवाह निमंत्रण',
        mainNames: 'चि. रोहन संग आयु. स्नेहा',
        dateTimeLine: 'रविवार, २४ जनवरी २०२७ · दोपहर १२:२५ बजे',
        venueLine: 'श्री मंगल भवन, कोथरूड, पुणे',
        messageLine: 'हमारे विवाह समारोह में सपरिवार पधारकर वर-वधू को आशीर्वाद प्रदान करें।',
        hostLine: 'दर्शनाभिलाषी: देशमुख एवं कुलकर्णी परिवार',
        photoDataUrl: '',
      };
    }
    return {
      topInvocation: '|| SHRI GANESHAYA NAMAH ||',
      eventTitle: 'Save The Date · Wedding Invitation',
      mainNames: 'Rohan & Sneha',
      dateTimeLine: 'Sunday, 24 Jan 2027 · 12:25 PM',
      venueLine: 'Shri Mangal Hall, Kothrud, Pune',
      messageLine: 'We joyfully invite you and your family to bless us on our special day.',
      hostLine: 'With Love: Deshmukh & Kulkarni Family',
      photoDataUrl: '',
    };
  }

  if (cat === 'birthday') {
    if (lang === 'mr') {
      return {
        topInvocation: 'वाढदिवसाच्या हार्दिक शुभेच्छा',
        eventTitle: 'वाढदिवस सोहळा निमंत्रण',
        mainNames: 'चि. आरव पाटील',
        dateTimeLine: 'शनिवार, १२ डिसेंबर २०२६ · सायं. ७:०० वा.',
        venueLine: 'हॉटेल सह्याद्री बँक्वेट्स, नाशिक',
        messageLine: 'आमच्या लाडक्या आरवच्या ५ व्या वाढदिवसाच्या आनंद सोहळ्यास नक्की या!',
        hostLine: 'निमंत्रक: पाटील परिवार',
        photoDataUrl: '',
      };
    }
    if (lang === 'hi') {
      return {
        topInvocation: 'जन्मदिन की हार्दिक शुभकामनाएँ',
        eventTitle: 'जन्मदिन समारोह निमंत्रण',
        mainNames: 'मास्टर आरव पाटिल',
        dateTimeLine: 'शनिवार, १२ दिसंबर २०२६ · शाम ७:०० बजे',
        venueLine: 'होटल सह्याद्रि बैंक्वेट्स, नासिक',
        messageLine: 'हमारे प्यारे आरव के ५वें जन्मदिन के जश्न में सपरिवार सादर आमंत्रित हैं।',
        hostLine: 'आयोजक: पाटिल परिवार',
        photoDataUrl: '',
      };
    }
    return {
      topInvocation: 'CELEBRATE WITH US',
      eventTitle: 'Birthday Party Invitation',
      mainNames: 'Aarav Patil Turns 5!',
      dateTimeLine: 'Saturday, 12 Dec 2026 · 7:00 PM',
      venueLine: 'Hotel Sahyadri Banquets, Nashik',
      messageLine: 'Join us for cake, dinner, and lots of fun as we celebrate Aarav’s 5th birthday.',
      hostLine: 'Hosted by: Patil Family',
      photoDataUrl: '',
    };
  }

  if (lang === 'mr') {
    return {
      topInvocation: 'दीपावली व नववर्ष शुभेच्छा',
      eventTitle: 'सण-उत्सव व दुकान ऑफर',
      mainNames: 'श्री गणेश इलेक्ट्रॉनिक्स अँड मोबाईल',
      dateTimeLine: 'खास ऑफर: १५% ते ३०% पर्यंत सवलत!',
      venueLine: 'मेन रोड, शिवाजी चौक, कोल्हापूर · मो. ९८XXXXXX१०',
      messageLine: 'आपणास व आपल्या परिवारास सुख, समृद्धी व भरभराटीच्या मनःपूर्वक शुभेच्छा!',
      hostLine: 'शुभेच्छुक: श्री गणेश परिवार',
      photoDataUrl: '',
    };
  }
  if (lang === 'hi') {
    return {
      topInvocation: 'दीपावली की हार्दिक शुभकामनाएँ',
      eventTitle: 'त्यौहार एवं विशेष ऑफर',
      mainNames: 'श्री गणेश इलेक्ट्रॉनिक्स एंड मोबाइल',
      dateTimeLine: 'विशेष छूट: १५% से ३०% तक ऑफर!',
      venueLine: 'मेन रोड, शिवाजी चौक, कोल्हापुर · मो. 98XXXXXX10',
      messageLine: 'आपको और आपके परिवार को सुख, शांति और समृद्धि की हार्दिक शुभकामनाएँ!',
      hostLine: 'शुभेच्छु: श्री गणेश परिवार',
      photoDataUrl: '',
    };
  }
  return {
    topInvocation: 'FESTIVE GREETINGS & OFFER',
    eventTitle: 'Grand Festive Celebration',
    mainNames: 'Shri Ganesh Electronics & Mobiles',
    dateTimeLine: 'Special Offer: Flat 15% – 30% Off!',
    venueLine: 'Main Road, Shivaji Chowk, Kolhapur · 98XXXXXX10',
    messageLine: 'Wishing you and your family joy, prosperity, and bright celebrations!',
    hostLine: 'Warm Wishes: Shri Ganesh Team',
    photoDataUrl: '',
  };
}

const COPY: Record<
  UiLang,
  {
    catWedding: string;
    catBirthday: string;
    catFestival: string;
    templateLabel: string;
    fontLabel: string;
    fontSizeLabel: string;
    sizeCompact: string;
    sizeStandard: string;
    sizeLarge: string;
    themeLabel: string;
    aspectLabel: string;
    aspectCard: string;
    aspectStatus: string;
    aspectSquare: string;
    topInvocationLabel: string;
    eventTitleLabel: string;
    mainNamesLabel: string;
    dateTimeLabel: string;
    venueLabel: string;
    messageLabel: string;
    hostLabel: string;
    uploadPhotoBtn: string;
    removePhotoBtn: string;
    resetSampleBtn: string;
    previewLabel: string;
    downloadPngBtn: string;
    downloadJpgBtn: string;
    workingBtn: string;
    exportError: string;
  }
> = {
  en: {
    catWedding: 'Wedding Invite',
    catBirthday: 'Birthday Invite',
    catFestival: 'Festival / Shop Card',
    templateLabel: 'Card Template Design',
    fontLabel: 'Font Style',
    fontSizeLabel: 'Text Size',
    sizeCompact: 'Compact',
    sizeStandard: 'Standard',
    sizeLarge: 'Large',
    themeLabel: 'Color Palette',
    aspectLabel: 'Card Format',
    aspectCard: 'WhatsApp Card (4:5)',
    aspectStatus: 'WhatsApp Status (9:16)',
    aspectSquare: 'Square Post (1:1)',
    topInvocationLabel: 'Top Greeting / Blessing',
    eventTitleLabel: 'Event / Offer Heading',
    mainNamesLabel: 'Couple / Person / Shop Name',
    dateTimeLabel: 'Date, Time or Offer Highlight',
    venueLabel: 'Venue / Shop Address & Phone',
    messageLabel: 'Invitation / Greeting Message',
    hostLabel: 'Host / Family / Sender Name',
    uploadPhotoBtn: 'Add Photo / Logo',
    removePhotoBtn: 'Remove',
    resetSampleBtn: 'Reset Sample',
    previewLabel: 'Live Card Preview',
    downloadPngBtn: 'Download PNG',
    downloadJpgBtn: 'Download JPG',
    workingBtn: 'Rendering...',
    exportError: 'Could not export card image. Please try again.',
  },
  mr: {
    catWedding: 'लग्न निमंत्रण',
    catBirthday: 'वाढदिवस',
    catFestival: 'सण / दुकान ऑफर',
    templateLabel: 'आधुनिक टेम्पलेट डिझाईन',
    fontLabel: 'फॉन्ट स्टाईल',
    fontSizeLabel: 'अक्षर आकार',
    sizeCompact: 'लहान',
    sizeStandard: 'मध्यम',
    sizeLarge: 'मोठे',
    themeLabel: 'रंगसंगती (Color Theme)',
    aspectLabel: 'कार्ड आकार',
    aspectCard: 'WhatsApp कार्ड (4:5)',
    aspectStatus: 'WhatsApp स्टेटस (9:16)',
    aspectSquare: 'चौरस पोस्ट (1:1)',
    topInvocationLabel: 'वरचे शुभवचन / श्लोक',
    eventTitleLabel: 'निमंत्रण / ऑफर शीर्षक',
    mainNamesLabel: 'वर-वधू / व्यक्तीचे / दुकानाचे नाव',
    dateTimeLabel: 'तारीख, वेळ किंवा खास ऑफर',
    venueLabel: 'स्थळ / पत्ता व मोबाईल नंबर',
    messageLabel: 'निमंत्रण किंवा शुभेच्छा संदेश',
    hostLabel: 'निमंत्रक / परिवार / शुभेच्छुक',
    uploadPhotoBtn: 'फोटो / लोगो जोडा',
    removePhotoBtn: 'काढा',
    resetSampleBtn: 'नमुना रीसेट',
    previewLabel: 'लाइव्ह कार्ड प्रिव्ह्यू',
    downloadPngBtn: 'PNG डाउनलोड करा',
    downloadJpgBtn: 'JPG डाउनलोड करा',
    workingBtn: 'तयार होत आहे...',
    exportError: 'कार्ड तयार करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
  },
  hi: {
    catWedding: 'शादी निमंत्रण',
    catBirthday: 'जन्मदिन',
    catFestival: 'त्यौहार / दुकान कार्ड',
    templateLabel: 'आधुनिक टेम्पलेट डिज़ाइन',
    fontLabel: 'फ़ॉन्ट स्टाइल',
    fontSizeLabel: 'टेक्स्ट साइज',
    sizeCompact: 'छोटा',
    sizeStandard: 'मध्यम',
    sizeLarge: 'बड़ा',
    themeLabel: 'कलर थीम',
    aspectLabel: 'कार्ड साइज',
    aspectCard: 'WhatsApp कार्ड (4:5)',
    aspectStatus: 'WhatsApp स्टेटस (9:16)',
    aspectSquare: 'चौकोर पोस्ट (1:1)',
    topInvocationLabel: 'ऊपर का शुभ संदेश / मंत्र',
    eventTitleLabel: 'निमंत्रण / ऑफर शीर्षक',
    mainNamesLabel: 'वर-वधू / व्यक्ति / दुकान का नाम',
    dateTimeLabel: 'तारीख, समय या विशेष ऑफर',
    venueLabel: 'स्थान / पता व मोबाइल नंबर',
    messageLabel: 'निमंत्रण या शुभकामना संदेश',
    hostLabel: 'निमंत्रक / परिवार / शुभेच्छु',
    uploadPhotoBtn: 'फोटो / लोगो जोड़ें',
    removePhotoBtn: 'हटाएँ',
    resetSampleBtn: 'सैंपल रीसेट',
    previewLabel: 'लाइव कार्ड प्रिव्यू',
    downloadPngBtn: 'PNG डाउनलोड करें',
    downloadJpgBtn: 'JPG डाउनलोड करें',
    workingBtn: 'तैयार हो रहा है...',
    exportError: 'कार्ड डाउनलोड करने में समस्या आई। कृपया दोबारा कोशिश करें।',
  },
};

const TemplateThumb: React.FC<{ id: TemplateLayoutId; active: boolean }> = ({ id, active }) => {
  const stroke = active ? '#FFFFFF' : '#475569';
  const accent = active ? '#FDE047' : '#D97706';

  return (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none" className="shrink-0">
      <rect x="1.5" y="1.5" width="21" height="25" rx="2.5" stroke={stroke} strokeWidth="1.4" />
      {id === 'royal-arch' && (
        <>
          <path d="M5 23V11C5 7 8 4.5 12 4.5C16 4.5 19 7 19 11V23H5Z" stroke={accent} strokeWidth="1.3" />
          <circle cx="12" cy="8.5" r="1.3" fill={accent} />
        </>
      )}
      {id === 'modern-editorial' && (
        <>
          <line x1="5" y1="6.5" x2="19" y2="6.5" stroke={accent} strokeWidth="1.3" />
          <line x1="6" y1="13" x2="18" y2="13" stroke={stroke} strokeWidth="2.2" />
          <line x1="7" y1="18" x2="17" y2="18" stroke={accent} strokeWidth="1" />
        </>
      )}
      {id === 'floral-botanical' && (
        <>
          <rect x="4" y="4" width="16" height="20" rx="1.5" stroke={stroke} strokeWidth="0.9" />
          <circle cx="5.5" cy="5.5" r="2" fill={accent} />
          <circle cx="18.5" cy="5.5" r="2" fill={accent} />
          <circle cx="5.5" cy="22.5" r="2" fill={accent} />
          <circle cx="18.5" cy="22.5" r="2" fill={accent} />
        </>
      )}
      {id === 'festive-toran' && (
        <>
          <path d="M2 5C5 8.5 9 8.5 12 5C15 8.5 19 8.5 22 5" stroke={accent} strokeWidth="1.5" />
          <circle cx="7" cy="7.5" r="1.3" fill={accent} />
          <circle cx="12" cy="7" r="1.3" fill={accent} />
          <circle cx="17" cy="7.5" r="1.3" fill={accent} />
          <rect x="5.5" y="13" width="13" height="3.2" rx="1" fill={accent} opacity="0.7" />
        </>
      )}
      {id === 'spotlight-ribbon' && (
        <>
          <circle cx="12" cy="9" r="3.4" stroke={accent} strokeWidth="1.4" />
          <path d="M4.5 15.5H19.5L18 18L19.5 20.5H4.5L6 18L4.5 15.5Z" fill={accent} opacity="0.85" />
        </>
      )}
      {id === 'luxe-foil' && (
        <>
          <rect x="4" y="4" width="16" height="20" stroke={accent} strokeWidth="1.1" />
          <path d="M12 6.5L14 8.5L12 10.5L10 8.5Z" fill={accent} />
          <path d="M4 8L8 4M20 8L16 4M4 20L8 24M20 20L16 24" stroke={accent} strokeWidth="1.2" />
        </>
      )}
    </svg>
  );
};

export const InvitationCardMakerTool: React.FC<InvitationCardMakerToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
  onToolDownload,
}) => {
  const c = COPY[uiLang];
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/invitation-card-maker')!;

  const [category, setCategory] = useState<CardCategory>('wedding');
  const [templateLayout, setTemplateLayout] = useState<TemplateLayoutId>('royal-arch');
  const [fontStyleId, setFontStyleId] = useState<FontStyleId>('royal-serif');
  const [textScale, setTextScale] = useState<TextScaleId>('standard');
  const [themeId, setThemeId] = useState<ThemeId>('paithani-gold');
  const [aspect, setAspect] = useState<CardAspect>('4:5');
  const [content, setContent] = useState<CardContent>(() => getDefaultContent('wedding', uiLang));
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [hasDownloaded, setHasDownloaded] = useState<boolean>(false);

  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const cardCaptureRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setContent((prev) => ({
      ...getDefaultContent(category, uiLang),
      photoDataUrl: prev.photoDataUrl,
    }));
  }, [category, uiLang]);

  const activeTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const activeFont = FONT_STYLES.find((f) => f.id === fontStyleId) || FONT_STYLES[0];
  const scaleFactor = textScale === 'compact' ? 0.9 : textScale === 'large' ? 1.12 : 1.0;

  const handleCategorySwitch = (nextCat: CardCategory) => {
    setCategory(nextCat);
    if (nextCat === 'wedding') {
      setTemplateLayout('royal-arch');
      setFontStyleId('royal-serif');
      setThemeId('paithani-gold');
    } else if (nextCat === 'birthday') {
      setTemplateLayout('spotlight-ribbon');
      setFontStyleId('festive-brush');
      setThemeId('lavender-royal');
    } else {
      setTemplateLayout('festive-toran');
      setFontStyleId('modern-editorial');
      setThemeId('festive-saffron');
    }
  };

  const handlePhotoUpload = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setContent((prev) => ({ ...prev, photoDataUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExport = async (format: 'png' | 'jpg') => {
    if (!cardCaptureRef.current) return;
    setErrorMsg('');
    setIsExporting(true);
    try {
      await document.fonts?.ready;
      const canvas = await html2canvas(cardCaptureRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: activeTheme.bg,
        logging: false,
      });
      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mime, 0.95);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `sadhanbox-${category}-${templateLayout}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setHasDownloaded(true);
      pushDataLayerEvent('file_download', {
        document_type: `invitation_${category}_${templateLayout}`,
        file_extension: format,
      });
      onToolDownload();
    } catch {
      setErrorMsg(c.exportError);
    } finally {
      setIsExporting(false);
    }
  };

  const cardDims =
    aspect === '9:16'
      ? { w: 360, h: 640 }
      : aspect === '1:1'
        ? { w: 400, h: 400 }
        : { w: 380, h: 475 };

  const baseNameSize = aspect === '1:1' ? 23 : 26;
  const computedNamesSize = Math.round(baseNameSize * activeFont.namesMultiplier * scaleFactor);
  const computedTitleSize = Math.round(12.5 * scaleFactor);
  const computedBodySize = Math.round(12.5 * scaleFactor);
  const computedDateSize = Math.round(13.5 * scaleFactor);

  const renderCardDecorations = () => {
    if (templateLayout === 'royal-arch') {
      return (
        <>
          {/* Top Kalash & Lotus Emblem */}
          <svg
            width="64"
            height="34"
            viewBox="0 0 64 34"
            style={{ margin: '0 auto 6px', display: 'block', pointerEvents: 'none' }}
          >
            <path
              d="M6 26 C16 26, 22 18, 32 10 C42 18, 48 26, 58 26"
              fill="none"
              stroke={activeTheme.border}
              strokeWidth="1.5"
            />
            <path
              d="M32 3 C34.5 8, 38 11, 32 17 C26 11, 29.5 8, 32 3 Z"
              fill={activeTheme.border}
            />
            <path
              d="M23 14 C26 12, 29 14, 30 18 C25 18, 23 16, 23 14 Z"
              fill={activeTheme.accent}
              opacity="0.85"
            />
            <path
              d="M41 14 C38 12, 35 14, 34 18 C39 18, 41 16, 41 14 Z"
              fill={activeTheme.accent}
              opacity="0.85"
            />
            <circle cx="14" cy="24" r="2" fill={activeTheme.border} />
            <circle cx="50" cy="24" r="2" fill={activeTheme.border} />
          </svg>
        </>
      );
    }

    if (templateLayout === 'floral-botanical') {
      return (
        <>
          {/* Four Corner Floral Sprays */}
          {(
            [
              { top: 4, left: 4, transform: 'none' },
              { top: 4, right: 4, transform: 'scaleX(-1)' },
              { bottom: 4, left: 4, transform: 'scaleY(-1)' },
              { bottom: 4, right: 4, transform: 'scale(-1, -1)' },
            ] as const
          ).map((pos, idx) => (
            <svg
              key={idx}
              width="66"
              height="66"
              viewBox="0 0 66 66"
              style={{ position: 'absolute', ...pos, pointerEvents: 'none' }}
            >
              <path
                d="M6 54 C10 34, 24 14, 52 8"
                fill="none"
                stroke={activeTheme.border}
                strokeWidth="1.3"
                opacity="0.8"
              />
              <ellipse cx="20" cy="22" rx="7" ry="3.5" transform="rotate(-35 20 22)" fill={activeTheme.accent} opacity="0.28" />
              <ellipse cx="32" cy="14" rx="6.5" ry="3.2" transform="rotate(-15 32 14)" fill={activeTheme.border} opacity="0.55" />
              <ellipse cx="13" cy="35" rx="6.5" ry="3.2" transform="rotate(-65 13 35)" fill={activeTheme.border} opacity="0.55" />
              <circle cx="15" cy="15" r="5" fill={activeTheme.accent} opacity="0.82" />
              <circle cx="15" cy="15" r="2.1" fill={activeTheme.border} />
              <circle cx="25" cy="10" r="2.2" fill={activeTheme.accent} opacity="0.65" />
              <circle cx="10" cy="25" r="2.2" fill={activeTheme.accent} opacity="0.65" />
            </svg>
          ))}
        </>
      );
    }

    if (templateLayout === 'festive-toran') {
      return (
        <svg
          width="100%"
          height="42"
          viewBox="0 0 340 42"
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none' }}
        >
          {/* Decorative Festive Mango Leaf & Marigold Toran */}
          <path
            d="M0 4 Q42 30 85 4 Q127 30 170 4 Q212 30 255 4 Q297 30 340 4"
            fill="none"
            stroke={activeTheme.border}
            strokeWidth="2.2"
          />
          {[28, 56, 85, 114, 142, 170, 198, 226, 255, 284, 312].map((cx, i) => (
            <g key={cx}>
              <path
                d={`M${cx - 4} 6 L${cx} ${i % 2 === 0 ? 22 : 17} L${cx + 4} 6 Z`}
                fill={activeTheme.accent}
                opacity="0.72"
              />
              <circle
                cx={cx}
                cy={i % 2 === 0 ? 24 : 18}
                r={i % 2 === 0 ? 5.5 : 4}
                fill={i % 2 === 0 ? activeTheme.secondaryAccent : activeTheme.border}
              />
              <circle cx={cx} cy={i % 2 === 0 ? 24 : 18} r="2" fill={activeTheme.innerBg} opacity="0.7" />
            </g>
          ))}
        </svg>
      );
    }

    if (templateLayout === 'spotlight-ribbon') {
      return (
        <>
          {/* Subtle Festive Sparkles */}
          <svg
            width="100%"
            height="64"
            viewBox="0 0 340 64"
            style={{ position: 'absolute', top: 6, left: 0, right: 0, pointerEvents: 'none' }}
          >
            <path d="M26 16 L28 22 L34 24 L28 26 L26 32 L24 26 L18 24 L24 22 Z" fill={activeTheme.border} opacity="0.8" />
            <path d="M312 18 L314 23 L319 25 L314 27 L312 32 L310 27 L305 25 L310 23 Z" fill={activeTheme.border} opacity="0.8" />
            <circle cx="52" cy="14" r="2.6" fill={activeTheme.accent} opacity="0.45" />
            <circle cx="288" cy="14" r="2.6" fill={activeTheme.accent} opacity="0.45" />
            <circle cx="42" cy="40" r="1.8" fill={activeTheme.secondaryAccent} opacity="0.6" />
            <circle cx="298" cy="42" r="1.8" fill={activeTheme.secondaryAccent} opacity="0.6" />
          </svg>
        </>
      );
    }

    if (templateLayout === 'luxe-foil') {
      return (
        <>
          {(
            [
              { top: 8, left: 8, transform: 'none' },
              { top: 8, right: 8, transform: 'scaleX(-1)' },
              { bottom: 8, left: 8, transform: 'scaleY(-1)' },
              { bottom: 8, right: 8, transform: 'scale(-1, -1)' },
            ] as const
          ).map((pos, idx) => (
            <svg
              key={idx}
              width="42"
              height="42"
              viewBox="0 0 42 42"
              style={{ position: 'absolute', ...pos, pointerEvents: 'none' }}
            >
              <path
                d="M2 34 V2 H34 M2 2 L14 14 M8 24 V8 H24"
                fill="none"
                stroke={activeTheme.border}
                strokeWidth="1.6"
              />
              <polygon points="14,14 19,14 14,19" fill={activeTheme.border} />
            </svg>
          ))}
        </>
      );
    }

    return null;
  };

  return (
    <ToolShell
      route="/invitation-card-maker"
      title={toolMeta.title[uiLang]}
      subtitle={toolMeta.shortDesc[uiLang]}
      uiLang={uiLang}
      isPro={isPro}
      onBackHome={onBackHome}
      onOpenProModal={onOpenProModal}
    >
      {/* Category Switcher */}
      <div className="inline-flex flex-wrap p-1 bg-slate-100 rounded-xl gap-1 mb-5">
        <button
          type="button"
          onClick={() => handleCategorySwitch('wedding')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            category === 'wedding' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-rose-600" />
          <span>{c.catWedding}</span>
        </button>
        <button
          type="button"
          onClick={() => handleCategorySwitch('birthday')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            category === 'birthday' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PartyPopper className="w-4 h-4 text-amber-600" />
          <span>{c.catBirthday}</span>
        </button>
        <button
          type="button"
          onClick={() => handleCategorySwitch('festival')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            category === 'festival' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Store className="w-4 h-4 text-emerald-600" />
          <span>{c.catFestival}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Form Controls */}
        <div className="lg:col-span-6 space-y-4">
          {/* 1. Modern Template Design Switcher */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-800">{c.templateLabel}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TEMPLATES.map((tpl) => {
                const active = tpl.id === templateLayout;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplateLayout(tpl.id)}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <TemplateThumb id={tpl.id} active={active} />
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{tpl.label[uiLang]}</div>
                      <div
                        className={`text-[10px] truncate ${
                          active ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {tpl.tag[uiLang]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Expressive Font Style Picker */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Type className="w-3.5 h-3.5 text-slate-600" />
                <span>{c.fontLabel}</span>
              </div>
              <div className="inline-flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                {(
                  [
                    { id: 'compact', label: c.sizeCompact },
                    { id: 'standard', label: c.sizeStandard },
                    { id: 'large', label: c.sizeLarge },
                  ] as Array<{ id: TextScaleId; label: string }>
                ).map((sz) => (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => setTextScale(sz.id)}
                    className={`px-2 py-0.5 text-[11px] font-semibold rounded-md cursor-pointer transition-colors ${
                      textScale === sz.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FONT_STYLES.map((fs) => {
                const active = fs.id === fontStyleId;
                return (
                  <button
                    key={fs.id}
                    type="button"
                    onClick={() => setFontStyleId(fs.id)}
                    className={`flex flex-col items-start px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className="text-sm leading-snug"
                      style={{
                        fontFamily: fs.headingFamily,
                        fontWeight: fs.headingWeight,
                      }}
                    >
                      {fs.sample}
                    </span>
                    <span
                      className={`text-[11px] font-medium truncate w-full ${
                        active ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {fs.label[uiLang]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Theme Color Palette Picker */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-800">{c.themeLabel}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {THEMES.map((t) => {
                const active = t.id === themeId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setThemeId(t.id)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border shrink-0"
                      style={{ background: t.bgGradient, borderColor: t.border }}
                    />
                    <span className="truncate">{t.label[uiLang]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Aspect Ratio */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-800">{c.aspectLabel}</div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: '4:5', label: c.aspectCard },
                  { id: '9:16', label: c.aspectStatus },
                  { id: '1:1', label: c.aspectSquare },
                ] as Array<{ id: CardAspect; label: string }>
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAspect(opt.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer whitespace-nowrap ${
                    aspect === opt.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Text Fields */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {c.topInvocationLabel}
                </label>
                <input
                  type="text"
                  value={content.topInvocation}
                  onChange={(e) => setContent((p) => ({ ...p, topInvocation: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {c.eventTitleLabel}
                </label>
                <input
                  type="text"
                  value={content.eventTitle}
                  onChange={(e) => setContent((p) => ({ ...p, eventTitle: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {c.mainNamesLabel}
              </label>
              <input
                type="text"
                value={content.mainNames}
                onChange={(e) => setContent((p) => ({ ...p, mainNames: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {c.dateTimeLabel}
              </label>
              <input
                type="text"
                value={content.dateTimeLine}
                onChange={(e) => setContent((p) => ({ ...p, dateTimeLine: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {c.venueLabel}
              </label>
              <input
                type="text"
                value={content.venueLine}
                onChange={(e) => setContent((p) => ({ ...p, venueLine: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {c.messageLabel}
              </label>
              <textarea
                rows={2}
                value={content.messageLine}
                onChange={(e) => setContent((p) => ({ ...p, messageLine: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {c.hostLabel}
              </label>
              <input
                type="text"
                value={content.hostLine}
                onChange={(e) => setContent((p) => ({ ...p, hostLine: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-500"
              />
            </div>

            {/* Optional Photo / Logo */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  handlePhotoUpload(e.target.files?.[0]);
                  e.target.value = '';
                }}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  <ImagePlus className="w-3.5 h-3.5 text-[#1E40AF]" />
                  <span>{c.uploadPhotoBtn}</span>
                </button>
                {content.photoDataUrl && (
                  <button
                    type="button"
                    onClick={() => setContent((p) => ({ ...p, photoDataUrl: '' }))}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{c.removePhotoBtn}</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setContent(getDefaultContent(category, uiLang))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/70 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{c.resetSampleBtn}</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="flex items-start gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm font-medium text-rose-700"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => void handleExport('png')}
              disabled={isExporting}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer disabled:opacity-60"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{isExporting ? c.workingBtn : c.downloadPngBtn}</span>
            </button>
            <button
              type="button"
              onClick={() => void handleExport('jpg')}
              disabled={isExporting}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>{c.downloadJpgBtn}</span>
            </button>
          </div>

          {hasDownloaded && (
            <WhatsAppShareBar
              uiLang={uiLang}
              route="/invitation-card-maker"
              toolTitle={toolMeta.title[uiLang]}
            />
          )}
        </div>

        {/* Right: Live Card Canvas (Explicit Hex/RGBA & Inline Styles for crisp html2canvas export) */}
        <div className="lg:col-span-6 lg:sticky lg:top-6 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{c.previewLabel}</span>
            <span className="text-[11px] font-medium text-slate-500 tabular-nums">
              {TEMPLATES.find((t) => t.id === templateLayout)?.label[uiLang]} · {aspect}
            </span>
          </div>

          <div className="bg-slate-200/80 border border-slate-300 rounded-2xl p-4 sm:p-6 flex items-center justify-center overflow-x-auto">
            <div
              ref={cardCaptureRef}
              style={{
                width: `${cardDims.w}px`,
                minHeight: `${cardDims.h}px`,
                backgroundColor: activeTheme.bg,
                backgroundImage:
                  templateLayout === 'modern-editorial'
                    ? activeTheme.innerBgGradient
                    : activeTheme.bgGradient,
                padding: templateLayout === 'modern-editorial' ? '14px' : '15px',
                boxSizing: 'border-box',
                position: 'relative',
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'center',
                fontFamily: activeFont.bodyFamily,
              }}
            >
              {/* Outer Accent Double Frame for Royal Arch / Luxe */}
              <div
                style={{
                  width: '100%',
                  backgroundColor: activeTheme.innerBg,
                  backgroundImage: activeTheme.innerBgGradient,
                  border:
                    templateLayout === 'modern-editorial'
                      ? `1.5px solid ${activeTheme.border}`
                      : `2px solid ${activeTheme.border}`,
                  borderTopLeftRadius: templateLayout === 'royal-arch' ? '185px' : '12px',
                  borderTopRightRadius: templateLayout === 'royal-arch' ? '185px' : '12px',
                  borderBottomLeftRadius: '12px',
                  borderBottomRightRadius: '12px',
                  padding:
                    templateLayout === 'festive-toran'
                      ? aspect === '9:16'
                        ? '46px 22px 26px'
                        : '42px 20px 20px'
                      : templateLayout === 'royal-arch'
                        ? aspect === '9:16'
                          ? '34px 22px 24px'
                          : '28px 20px 20px'
                        : aspect === '9:16'
                          ? '28px 22px'
                          : '22px 20px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                }}
              >
                {/* Inner Hairline Frame for Royal Arch / Floral / Luxe */}
                {(templateLayout === 'royal-arch' || templateLayout === 'luxe-foil') && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '7px',
                      left: '7px',
                      right: '7px',
                      bottom: '7px',
                      border: `1px solid ${activeTheme.border}`,
                      opacity: 0.45,
                      borderTopLeftRadius: templateLayout === 'royal-arch' ? '178px' : '8px',
                      borderTopRightRadius: templateLayout === 'royal-arch' ? '178px' : '8px',
                      borderBottomLeftRadius: '8px',
                      borderBottomRightRadius: '8px',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {renderCardDecorations()}

                {/* Top Section */}
                <div style={{ width: '100%', position: 'relative', zIndex: 2 }}>
                  {content.topInvocation && (
                    <div
                      style={{
                        fontSize: `${Math.round(11.5 * scaleFactor)}px`,
                        fontWeight: 700,
                        color: activeTheme.accent,
                        letterSpacing:
                          templateLayout === 'modern-editorial' ? '0.14em' : '0.04em',
                        marginBottom: templateLayout === 'modern-editorial' ? '10px' : '8px',
                        textTransform: templateLayout === 'modern-editorial' ? 'uppercase' : 'none',
                      }}
                    >
                      {content.topInvocation}
                    </div>
                  )}

                  {templateLayout === 'modern-editorial' ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          height: '1px',
                          width: '32px',
                          backgroundColor: activeTheme.border,
                        }}
                      />
                      <span
                        style={{
                          fontSize: `${computedTitleSize}px`,
                          fontWeight: 700,
                          color: activeTheme.headingColor,
                          letterSpacing: '0.06em',
                        }}
                      >
                        {content.eventTitle}
                      </span>
                      <span
                        style={{
                          height: '1px',
                          width: '32px',
                          backgroundColor: activeTheme.border,
                        }}
                      />
                    </div>
                  ) : templateLayout === 'spotlight-ribbon' ? (
                    <div
                      style={{
                        display: 'inline-block',
                        backgroundImage: activeTheme.bgGradient,
                        backgroundColor: activeTheme.bg,
                        color: '#FFFFFF',
                        padding: '6px 22px',
                        borderRadius: '4px',
                        fontSize: `${computedTitleSize}px`,
                        fontWeight: 700,
                        border: `1.5px solid ${activeTheme.border}`,
                        marginBottom: '12px',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {content.eventTitle}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'inline-block',
                        backgroundColor: activeTheme.badgeBg,
                        color: activeTheme.badgeText,
                        padding: '4px 16px',
                        borderRadius: templateLayout === 'royal-arch' ? '999px' : '6px',
                        fontSize: `${computedTitleSize}px`,
                        fontWeight: 700,
                        border: `1px solid ${activeTheme.border}`,
                        marginBottom: '12px',
                      }}
                    >
                      {content.eventTitle}
                    </div>
                  )}
                </div>

                {/* Middle Highlight */}
                <div style={{ width: '100%', padding: '4px 0', position: 'relative', zIndex: 2 }}>
                  {content.photoDataUrl && (
                    <div
                      style={{
                        width: templateLayout === 'spotlight-ribbon' ? '98px' : '84px',
                        height: templateLayout === 'spotlight-ribbon' ? '98px' : '84px',
                        margin: '0 auto 12px',
                        borderRadius: templateLayout === 'modern-editorial' ? '14px' : '9999px',
                        border: `3px solid ${activeTheme.border}`,
                        padding: '2px',
                        backgroundColor: '#FFFFFF',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={content.photoDataUrl}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: templateLayout === 'modern-editorial' ? '10px' : '9999px',
                        }}
                      />
                    </div>
                  )}

                  <div
                    style={{
                      fontFamily: activeFont.headingFamily,
                      fontSize: `${computedNamesSize}px`,
                      fontWeight: activeFont.headingWeight,
                      color: activeTheme.headingColor,
                      lineHeight: 1.28,
                      letterSpacing: activeFont.letterSpacing,
                      marginBottom: '11px',
                      padding: '0 6px',
                    }}
                  >
                    {content.mainNames}
                  </div>

                  {content.dateTimeLine && (
                    <div
                      style={{
                        fontSize: `${computedDateSize}px`,
                        fontWeight: 700,
                        color:
                          templateLayout === 'festive-toran'
                            ? activeTheme.badgeText
                            : activeTheme.textColor,
                        backgroundColor:
                          templateLayout === 'festive-toran' ? activeTheme.badgeBg : 'transparent',
                        borderRadius: templateLayout === 'festive-toran' ? '8px' : '0px',
                        padding: templateLayout === 'festive-toran' ? '7px 14px' : '6px 10px',
                        borderTop:
                          templateLayout === 'festive-toran'
                            ? `1.5px solid ${activeTheme.border}`
                            : `1px ${templateLayout === 'modern-editorial' ? 'solid' : 'dashed'} ${activeTheme.border}`,
                        borderBottom:
                          templateLayout === 'festive-toran'
                            ? `1.5px solid ${activeTheme.border}`
                            : `1px ${templateLayout === 'modern-editorial' ? 'solid' : 'dashed'} ${activeTheme.border}`,
                        marginBottom: '11px',
                      }}
                    >
                      {content.dateTimeLine}
                    </div>
                  )}

                  {content.messageLine && (
                    <p
                      style={{
                        fontSize: `${computedBodySize}px`,
                        lineHeight: 1.55,
                        color: activeTheme.textColor,
                        margin: '0 auto 10px',
                        maxWidth: '295px',
                      }}
                    >
                      {content.messageLine}
                    </p>
                  )}

                  {content.venueLine && (
                    <div
                      style={{
                        fontSize: `${Math.round(12 * scaleFactor)}px`,
                        fontWeight: 600,
                        color: activeTheme.mutedColor,
                        lineHeight: 1.45,
                      }}
                    >
                      {content.venueLine}
                    </div>
                  )}
                </div>

                {/* Bottom Host + Credit */}
                <div style={{ width: '100%', paddingTop: '10px', position: 'relative', zIndex: 2 }}>
                  {(templateLayout === 'floral-botanical' || templateLayout === 'luxe-foil') && (
                    <div
                      style={{
                        width: '72px',
                        height: '1px',
                        backgroundColor: activeTheme.border,
                        margin: '0 auto 8px',
                        opacity: 0.65,
                      }}
                    />
                  )}
                  {content.hostLine && (
                    <div
                      style={{
                        fontFamily: activeFont.headingFamily,
                        fontSize: `${Math.round(13.5 * scaleFactor)}px`,
                        fontWeight: 700,
                        color: activeTheme.headingColor,
                        marginBottom: '6px',
                      }}
                    >
                      {content.hostLine}
                    </div>
                  )}
                  {!isPro && (
                    <div
                      style={{
                        fontSize: '9.5px',
                        color: activeTheme.mutedColor,
                        opacity: 0.72,
                      }}
                    >
                      Created with SadhanBox
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
};
