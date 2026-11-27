import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  Briefcase,
  Cake,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Crown,
  Download,
  Eraser,
  ExternalLink,
  Eye,
  FileCheck2,
  FileDown,
  FileText,
  Files,
  Heart,
  Home,
  IdCard,
  Languages,
  LayoutGrid,
  Loader2,
  PartyPopper,
  PenTool,
  QrCode,
  ReceiptText,
  ScanLine,
  Stamp,
  Type,
  UserSquare2,
  X,
} from 'lucide-react';
import { A4PreviewSheet } from './components/A4PreviewSheet';
import { BiodataForm } from './components/BiodataForm';
import { HomePage } from './components/HomePage';
import { LegalPageView } from './components/LegalPageView';
import { ProPricingModal, SelectedCheckoutPlan } from './components/ProPricingModal';
import { PromoCodeModal } from './components/PromoCodeModal';
import { SeoGuideFooter } from './components/SeoGuideFooter';
import { TemplateSelector } from './components/TemplateSelector';
import { AgeCalculatorTool } from './components/tools/AgeCalculatorTool';
import { BackgroundRemoverTool } from './components/tools/BackgroundRemoverTool';
import { GstEmiCalculatorTool } from './components/tools/GstEmiCalculatorTool';
import { GstInvoiceMakerTool } from './components/tools/GstInvoiceMakerTool';
import { IdCardPrintTool } from './components/tools/IdCardPrintTool';
import { ImageCompressorTool } from './components/tools/ImageCompressorTool';
import { ImageFormatConverterTool } from './components/tools/ImageFormatConverterTool';
import { InvitationCardMakerTool } from './components/tools/InvitationCardMakerTool';
import { PassportPhotoMakerTool } from './components/tools/PassportPhotoMakerTool';
import { PdfCompressorTool } from './components/tools/PdfCompressorTool';
import { PdfToJpgScannerTool } from './components/tools/PdfToJpgScannerTool';
import { PdfToolsTool } from './components/tools/PdfToolsTool';
import { QrGeneratorTool } from './components/tools/QrGeneratorTool';
import { RentReceiptSalarySlipTool } from './components/tools/RentReceiptSalarySlipTool';
import { SignatureResizeTool } from './components/tools/SignatureResizeTool';
import { ToolSeoSection } from './components/tools/ToolSeoSection';
import { WatermarkAdderTool } from './components/tools/WatermarkAdderTool';
import { WhatsAppShareBar } from './components/tools/WhatsAppShareBar';
import { WordCounterTypingTool } from './components/tools/WordCounterTypingTool';
import {
  AppLanguage,
  BiodataMode,
  DEFAULT_RESUME_CUSTOMIZATION,
  EMPTY_JOB_DATA,
  EMPTY_MARRIAGE_DATA,
  JobBiodata,
  MarriageBiodata,
  ResumeCustomization,
  TEMPLATES,
  TemplateId,
} from './types/biodata';
import {
  LANGUAGE_LIST,
  VALID_LANGUAGES,
  ensureLanguageFontLoaded,
  getLanguageMeta,
} from './utils/languageFonts';
import { exportA4Pdf } from './utils/pdfExport';
import { pushDataLayerEvent, trackFileDownloadEvent } from './utils/gtm';
import {
  fetchDownloadCount,
  formatDownloadCount,
  getInitialDownloadCount,
  incrementDownloadCount,
} from './utils/downloadCounter';
import {
  ProState,
  consumeSingleProCredit,
  isProActive,
  isTemplatePro,
  loadProState,
} from './utils/proState';
import {
  getReligionConfig,
  isKnownReligionDefaultTitle,
  translateReligionSect,
} from './utils/religionConfig';
import {
  AppRoute,
  LEGAL_ROUTES,
  LegalRoute,
  TOOL_CATALOG,
  getHomePageTitle,
  normalizeAppRoute,
} from './utils/routes';
import { SAMPLE_DATA_BY_LANGUAGE, getSampleBundle } from './utils/sampleData';
import { UiLang, getInitialUiLang, getSiteStrings, saveUiLang } from './utils/siteI18n';
import {
  HEIGHT_OPTIONS,
  MAHARASHTRA_BIRTHPLACES,
  RASHI_OPTIONS,
  formatBirthTimeValue,
  parseBirthTime,
  translateSmartFieldValue,
} from './utils/smartFieldOptions';
import { getLocalizedTemplateCopy } from './utils/templateTranslations';
import { getCopy } from './utils/translations';

const STORAGE_KEY_MARRIAGE = 'marathi_biodata_marriage_v4';
const STORAGE_KEY_JOB = 'marathi_biodata_job_v2';
const STORAGE_KEY_LANG = 'marathi_biodata_lang_v1';
const STORAGE_KEY_RESUME_CUSTOMIZATION = 'sadhanbox_resume_customization_v1';

const UI_LANGUAGE_OPTIONS: { code: UiLang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'mr', label: 'मराठी' },
  { code: 'hi', label: 'हिंदी' },
];

const NAV_TOOL_ICONS: Record<string, React.ReactNode> = {
  'biodata-maker': <Heart className="w-4 h-4 text-rose-600 shrink-0" />,
  'resume-maker': <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />,
  'background-remover': <Eraser className="w-4 h-4 text-violet-600 shrink-0" />,
  'pdf-tools': <Files className="w-4 h-4 text-amber-600 shrink-0" />,
  'image-compressor': <FileDown className="w-4 h-4 text-emerald-600 shrink-0" />,
  'qr-generator': <QrCode className="w-4 h-4 text-cyan-600 shrink-0" />,
  'age-calculator': <Cake className="w-4 h-4 text-indigo-600 shrink-0" />,
  'passport-photo-maker': <UserSquare2 className="w-4 h-4 text-sky-600 shrink-0" />,
  'signature-resize': <PenTool className="w-4 h-4 text-teal-600 shrink-0" />,
  'rent-receipt-generator': <ReceiptText className="w-4 h-4 text-orange-600 shrink-0" />,
  'gst-emi-calculator': <Calculator className="w-4 h-4 text-purple-600 shrink-0" />,
  'image-converter': <ArrowLeftRight className="w-4 h-4 text-pink-600 shrink-0" />,
  'word-counter-typing': <Type className="w-4 h-4 text-lime-700 shrink-0" />,
  'watermark-adder': <Stamp className="w-4 h-4 text-amber-600 shrink-0" />,
  'pdf-compressor': <FileDown className="w-4 h-4 text-emerald-600 shrink-0" />,
  'id-card-print': <IdCard className="w-4 h-4 text-sky-600 shrink-0" />,
  'invitation-card-maker': <PartyPopper className="w-4 h-4 text-rose-600 shrink-0" />,
  'gst-invoice-maker': <FileCheck2 className="w-4 h-4 text-indigo-600 shrink-0" />,
  'pdf-to-jpg-scanner': <ScanLine className="w-4 h-4 text-cyan-600 shrink-0" />,
};

const IN_APP_BANNER_COPY: Record<
  UiLang,
  { prefix: string; strongDots: string; middle: string; strongChrome: string; suffix: string; dismiss: string }
> = {
  en: {
    prefix: 'For smooth PDF and image downloads, tap the three dots (',
    strongDots: '⋮',
    middle: ') in the top corner and choose ',
    strongChrome: "'Open in Chrome'",
    suffix: '.',
    dismiss: 'Dismiss notice',
  },
  mr: {
    prefix: 'PDF व फोटो डाउनलोड सुरळीत होण्यासाठी, कृपया वरच्या कोपऱ्यातील तीन डॉट्स (',
    strongDots: '⋮',
    middle: ') वर टॅप करा आणि ',
    strongChrome: "'Open in Chrome'",
    suffix: ' निवडा.',
    dismiss: 'सूचना बंद करा',
  },
  hi: {
    prefix: 'PDF और फोटो डाउनलोड बिना रुकावट करने के लिए ऊपर कोने में तीन डॉट्स (',
    strongDots: '⋮',
    middle: ') पर टैप करें और ',
    strongChrome: "'Open in Chrome'",
    suffix: ' चुनें।',
    dismiss: 'सूचना बंद करें',
  },
};

function getInitialDocumentLanguage(): AppLanguage {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LANG) as AppLanguage | null;
    if (saved && VALID_LANGUAGES.includes(saved)) return saved;
  } catch {
    // Ignore storage errors
  }
  return getInitialUiLang();
}

function getInitialRoute(): AppRoute {
  if (typeof window === 'undefined') return '/';
  return normalizeAppRoute(window.location.pathname);
}

function isSocialInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /FBAN|FBAV|Instagram/i.test(ua);
}

function loadSavedState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

function isSameMarriageContent(a: MarriageBiodata, b: MarriageBiodata): boolean {
  const { photoDataUrl: _p1, photoShape: _s1, showAge: _a1, ...restA } = a;
  const { photoDataUrl: _p2, photoShape: _s2, showAge: _a2, ...restB } = b;
  return JSON.stringify(restA) === JSON.stringify(restB);
}

function isSameJobContent(a: JobBiodata, b: JobBiodata): boolean {
  const normalize = (data: JobBiodata) => ({
    fullName: data.fullName,
    designation: data.designation,
    mobile: data.mobile,
    email: data.email,
    address: data.address,
    careerObjective: data.careerObjective,
    educationList: data.educationList.map(({ id: _id, ...rest }) => rest),
    experienceList: data.experienceList.map(({ id: _id, ...rest }) => rest),
    skills: data.skills,
    languages: data.languages,
  });
  return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
}

function isLegalRoute(route: AppRoute): route is LegalRoute {
  return (LEGAL_ROUTES as string[]).includes(route);
}

export default function App() {
  const [activeRoute, setActiveRoute] = useState<AppRoute>(getInitialRoute);
  const [uiLang, setUiLang] = useState<UiLang>(getInitialUiLang);
  const [language, setLanguage] = useState<AppLanguage>(getInitialDocumentLanguage);
  const [proState, setProState] = useState<ProState>(loadProState);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [proModalInitialPlan, setProModalInitialPlan] =
    useState<SelectedCheckoutPlan>('monthly');

  const [mode, setMode] = useState<BiodataMode>(() =>
    getInitialRoute() === '/resume-maker' ? 'job' : 'marriage'
  );
  const [templateId, setTemplateId] = useState<TemplateId>(() =>
    getInitialRoute() === '/resume-maker' ? 'modern-blue' : 'lotus-rose'
  );
  const [marriageData, setMarriageData] = useState<MarriageBiodata>(() => {
    const lang = getInitialDocumentLanguage();
    return loadSavedState(STORAGE_KEY_MARRIAGE, getSampleBundle(lang).marriage);
  });
  const [jobData, setJobData] = useState<JobBiodata>(() => {
    const lang = getInitialDocumentLanguage();
    return loadSavedState(STORAGE_KEY_JOB, getSampleBundle(lang).job);
  });
  const [resumeCustomization, setResumeCustomization] = useState<ResumeCustomization>(() =>
    loadSavedState(STORAGE_KEY_RESUME_CUSTOMIZATION, DEFAULT_RESUME_CUSTOMIZATION)
  );

  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement | null>(null);

  const isBiodataOrResumeRoute =
    activeRoute === '/biodata-maker' || activeRoute === '/resume-maker';

  const s = getSiteStrings(uiLang);
  const copy = getCopy(language);
  const langMeta = getLanguageMeta(language);
  const uiLangMeta = getLanguageMeta(uiLang);
  const proActive = isProActive(proState);

  const [mobilePane, setMobilePane] = useState<'editor' | 'preview'>('editor');
  const previewWrapperRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState<number>(0.68);

  const sampleCaptureRef = useRef<HTMLDivElement | null>(null);
  const hdCaptureRef = useRef<HTMLDivElement | null>(null);

  const [isExportingSample, setIsExportingSample] = useState(false);
  const [isExportingHd, setIsExportingHd] = useState(false);
  const [hasBiodataDownloaded, setHasBiodataDownloaded] = useState(false);
  const [resumeWatermarkEnabled, setResumeWatermarkEnabled] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [exportError, setExportError] = useState('');
  const [showInAppBanner, setShowInAppBanner] = useState<boolean>(isSocialInAppBrowser);
  const [downloadCount, setDownloadCount] = useState<number>(getInitialDownloadCount);

  useEffect(() => {
    let active = true;
    void fetchDownloadCount().then((count) => {
      if (active) setDownloadCount(count);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setIsToolsMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsToolsMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = normalizeAppRoute(window.location.pathname);
      setActiveRoute(nextRoute);
      if (nextRoute === '/resume-maker') {
        setMode('job');
        setTemplateId((prev) => {
          const tpl = TEMPLATES.find((t) => t.id === prev);
          return tpl?.category === 'traditional' ? 'modern-blue' : prev;
        });
      } else if (nextRoute === '/biodata-maker') {
        setMode('marriage');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const syncModeForRoute = (nextRoute: AppRoute) => {
    if (nextRoute === '/resume-maker') {
      setMode('job');
      const activeTpl = TEMPLATES.find((t) => t.id === templateId);
      if (activeTpl?.category === 'traditional') {
        setTemplateId('modern-blue');
      }
    } else if (nextRoute === '/biodata-maker') {
      setMode('marriage');
      if (
        templateId === 'modern-blue' ||
        templateId === 'charcoal-exec' ||
        templateId === 'teal-modern'
      ) {
        setTemplateId('lotus-rose');
      }
    }
  };

  const navigateTo = (nextRoute: AppRoute) => {
    setIsToolsMenuOpen(false);
    syncModeForRoute(nextRoute);
    setActiveRoute(nextRoute);
    if (window.location.pathname !== nextRoute) {
      window.history.pushState({}, '', nextRoute);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProModal = (initialPlan: SelectedCheckoutPlan = 'monthly') => {
    setProModalInitialPlan(initialPlan);
    setIsProModalOpen(true);
  };

  // Update HTML lang, direction, font stack, and page title per route & selected uiLang
  useEffect(() => {
    if (isBiodataOrResumeRoute) {
      const meta = getLanguageMeta(language);
      document.documentElement.lang = language;
      document.documentElement.dir = meta.dir;
      document.body.style.fontFamily = uiLangMeta.fontStack;
      const matchedTool = TOOL_CATALOG.find((t) => t.route === activeRoute);
      document.title = matchedTool ? matchedTool.seoTitle[uiLang] : getHomePageTitle(uiLang);
      void ensureLanguageFontLoaded(language);
      void ensureLanguageFontLoaded(uiLang);
    } else {
      document.documentElement.lang = uiLang;
      document.documentElement.dir = 'ltr';
      document.body.style.fontFamily = uiLangMeta.fontStack;
      void ensureLanguageFontLoaded(uiLang);

      if (activeRoute === '/') {
        document.title = getHomePageTitle(uiLang);
      } else if (isLegalRoute(activeRoute)) {
        const legalMap: Record<LegalRoute, string> = {
          '/about': `${s.footerAbout} | SadhanBox`,
          '/privacy-policy': `${s.footerPrivacy} | SadhanBox`,
          '/terms': `${s.footerTerms} | SadhanBox`,
          '/contact': `${s.footerContact} | SadhanBox`,
        };
        document.title = legalMap[activeRoute];
      } else {
        const matchedTool = TOOL_CATALOG.find((t) => t.route === activeRoute);
        document.title = matchedTool ? matchedTool.seoTitle[uiLang] : getHomePageTitle(uiLang);
      }
    }
  }, [activeRoute, isBiodataOrResumeRoute, language, uiLang, uiLangMeta.fontStack, s]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, language);
    } catch {
      // Ignore storage errors
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MARRIAGE, JSON.stringify(marriageData));
    } catch {
      // Ignore quota errors
    }
  }, [marriageData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JOB, JSON.stringify(jobData));
    } catch {
      // Ignore quota errors
    }
  }, [jobData]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_RESUME_CUSTOMIZATION,
        JSON.stringify(resumeCustomization)
      );
    } catch {
      // Ignore quota errors
    }
  }, [resumeCustomization]);

  useEffect(() => {
    if (!isBiodataOrResumeRoute) return;
    const el = previewWrapperRef.current;
    if (!el) return;

    const updateScale = () => {
      const availableWidth = el.clientWidth;
      if (availableWidth > 0) {
        const nextScale = Math.min(1, availableWidth / 794);
        setPreviewScale(nextScale);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    window.addEventListener('resize', updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [mobilePane, isBiodataOrResumeRoute, activeRoute]);

  const handleToolDownload = () => {
    void incrementDownloadCount().then(setDownloadCount);
  };

  const handleLanguageSwitch = (nextLang: AppLanguage) => {
    if (nextLang === language) return;
    setLanguage(nextLang);

    const targetBundle = getSampleBundle(nextLang);
    const allBundles = Object.values(SAMPLE_DATA_BY_LANGUAGE);

    const isMarriageSample = allBundles.some((bundle) =>
      isSameMarriageContent(marriageData, bundle.marriage)
    );
    const isMarriageEmpty =
      isSameMarriageContent(marriageData, EMPTY_MARRIAGE_DATA) ||
      isSameMarriageContent(marriageData, {
        ...EMPTY_MARRIAGE_DATA,
        religion: marriageData.religion,
        headerTitle: marriageData.headerTitle,
      });

    if (isMarriageSample) {
      setMarriageData((prev) => ({
        ...targetBundle.marriage,
        showAge: prev.showAge ?? true,
        photoDataUrl: prev.photoDataUrl,
        photoShape: prev.photoShape,
      }));
    } else if (isMarriageEmpty && isKnownReligionDefaultTitle(marriageData.headerTitle)) {
      const cfg = getReligionConfig(marriageData.religion);
      setMarriageData((prev) => ({
        ...EMPTY_MARRIAGE_DATA,
        religion: prev.religion,
        headerTitle: cfg.defaultTitle[nextLang],
        showAge: prev.showAge ?? true,
        photoDataUrl: prev.photoDataUrl,
        photoShape: prev.photoShape,
      }));
    } else {
      setMarriageData((prev) => {
        const parsed = parseBirthTime(prev.birthTime, nextLang);
        const convertedTime =
          parsed.hour && parsed.minute
            ? formatBirthTimeValue(parsed.hour, parsed.minute, parsed.period, nextLang)
            : prev.birthTime;
        const cfg = getReligionConfig(prev.religion);
        const nextHeaderTitle = isKnownReligionDefaultTitle(prev.headerTitle)
          ? cfg.defaultTitle[nextLang]
          : prev.headerTitle;
        return {
          ...prev,
          headerTitle: nextHeaderTitle,
          height: translateSmartFieldValue(HEIGHT_OPTIONS, prev.height, nextLang),
          rashi: translateSmartFieldValue(RASHI_OPTIONS, prev.rashi, nextLang),
          sect: translateReligionSect(prev.religion, prev.sect, nextLang),
          birthPlace: translateSmartFieldValue(MAHARASHTRA_BIRTHPLACES, prev.birthPlace, nextLang),
          birthTime: convertedTime,
        };
      });
    }

    const isJobSample = allBundles.some((bundle) => isSameJobContent(jobData, bundle.job));

    if (isJobSample) {
      setJobData((prev) => ({
        ...targetBundle.job,
        photoDataUrl: prev.photoDataUrl,
        photoShape: prev.photoShape,
        portfolioUrl: prev.portfolioUrl || '',
      }));
    }
  };

  const handleUiLangChange = (nextUiLang: UiLang) => {
    setUiLang(nextUiLang);
    saveUiLang(nextUiLang);
    handleLanguageSwitch(nextUiLang);
  };

  const handleUsePhotoInMaker = (dataUrl: string, target: 'biodata' | 'resume') => {
    if (target === 'biodata') {
      setMarriageData((prev) => ({ ...prev, photoDataUrl: dataUrl }));
      navigateTo('/biodata-maker');
    } else {
      setJobData((prev) => ({ ...prev, photoDataUrl: dataUrl }));
      navigateTo('/resume-maker');
    }
  };

  const handleModeSwitch = (nextMode: BiodataMode) => {
    setMode(nextMode);
    const nextRoute: AppRoute = nextMode === 'job' ? '/resume-maker' : '/biodata-maker';
    setActiveRoute(nextRoute);
    if (window.location.pathname !== nextRoute) {
      window.history.pushState({}, '', nextRoute);
    }

    const activeTpl = TEMPLATES.find((t) => t.id === templateId);
    if (nextMode === 'job' && activeTpl?.category === 'traditional') {
      setTemplateId('modern-blue');
    } else if (
      nextMode === 'marriage' &&
      (templateId === 'modern-blue' ||
        templateId === 'charcoal-exec' ||
        templateId === 'teal-modern')
    ) {
      setTemplateId('lotus-rose');
    }
  };

  const handleLoadSample = () => {
    const bundle = getSampleBundle(language);
    if (mode === 'marriage') {
      setMarriageData((prev) => ({
        ...bundle.marriage,
        photoDataUrl: prev.photoDataUrl,
        photoShape: prev.photoShape,
      }));
    } else {
      setJobData((prev) => ({
        ...bundle.job,
        photoDataUrl: prev.photoDataUrl,
        photoShape: prev.photoShape,
      }));
    }
  };

  const handleClearAll = () => {
    if (mode === 'marriage') {
      const cfg = getReligionConfig(marriageData.religion);
      setMarriageData({
        ...EMPTY_MARRIAGE_DATA,
        religion: cfg.id,
        headerTitle: cfg.defaultTitle[language],
      });
    } else {
      setJobData(EMPTY_JOB_DATA);
    }
  };

  const getPdfFilename = (isSample: boolean) => {
    const rawName =
      mode === 'marriage' ? marriageData.fullName.trim() : jobData.fullName.trim();
    const fallbackPrefix = mode === 'marriage' ? copy.pdfMarriagePrefix : copy.pdfJobPrefix;
    const safePrefix = rawName
      ? rawName.replace(/\s+/g, '-').slice(0, 32)
      : fallbackPrefix;
    const suffix = isSample ? copy.pdfSampleSuffix : copy.pdfHdSuffix;
    return `${safePrefix}-${suffix}.pdf`;
  };

  const handleDownloadSample = async () => {
    if (!sampleCaptureRef.current) return;
    const filename = getPdfFilename(true);
    const documentType = mode === 'marriage' ? 'biodata' : 'resume';
    setExportError('');
    setIsExportingSample(true);
    try {
      await exportA4Pdf({
        element: sampleCaptureRef.current,
        filename,
        language,
      });
      trackFileDownloadEvent({
        documentType,
        fileName: filename,
        downloadVariant: 'free_sample',
        templateId,
        language,
      });
      handleToolDownload();
      setHasBiodataDownloaded(true);
    } catch {
      setExportError(copy.exportErrorMsg);
    } finally {
      setIsExportingSample(false);
    }
  };

  const handleDownloadHd = async (method: 'promo_code' | 'upi_payment' = 'upi_payment') => {
    if (!hdCaptureRef.current) return;
    const filename = getPdfFilename(false);
    const documentType = mode === 'marriage' ? 'biodata' : 'resume';
    setExportError('');
    setIsExportingHd(true);
    try {
      pushDataLayerEvent('biodata_pdf_download', {
        download_method: method,
        biodata_mode: mode,
        document_type: documentType,
        template_id: templateId,
        language,
      });
      await exportA4Pdf({
        element: hdCaptureRef.current,
        filename,
        language,
      });
      trackFileDownloadEvent({
        documentType,
        fileName: filename,
        downloadVariant: 'hd_pdf',
        downloadMethod: method,
        templateId,
        language,
      });
      handleToolDownload();
      setHasBiodataDownloaded(true);
    } catch {
      setExportError(copy.exportErrorMsg);
      throw new Error('HD PDF export failed');
    } finally {
      setIsExportingHd(false);
    }
  };

  const handleOpenHdModal = () => {
    setExportError('');
    if (proActive) {
      void handleDownloadHd('upi_payment');
      return;
    }
    if (proState.singleCredits > 0) {
      const next = consumeSingleProCredit();
      setProState(next);
      void handleDownloadHd('upi_payment');
      return;
    }
    setIsPromoModalOpen(true);
  };

  const activeTemplate = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
  const activeTemplateName = getLocalizedTemplateCopy(activeTemplate.id, language).name;
  const modeLabel = mode === 'marriage' ? copy.marriageTab : copy.jobTab;
  const bannerStrings = IN_APP_BANNER_COPY[uiLang];

  return (
    <div
      dir={isBiodataOrResumeRoute ? langMeta.dir : 'ltr'}
      style={{
        fontFamily: uiLangMeta.fontStack,
      }}
      className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]"
    >
      {/* Instagram / Facebook In-App Browser Guidance Banner */}
      {showInAppBanner && (
        <div
          role="region"
          aria-label="Browser recommendation"
          lang={uiLang}
          dir="ltr"
          className="bg-amber-100 border-b border-amber-300 text-amber-950 px-3 sm:px-6 py-2.5"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
            <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm font-medium leading-snug">
              <ExternalLink
                className="w-4 h-4 text-amber-800 shrink-0 mt-0.5 sm:mt-0"
                aria-hidden="true"
              />
              <p>
                {bannerStrings.prefix}
                <strong className="font-bold">{bannerStrings.strongDots}</strong>
                {bannerStrings.middle}
                <strong className="font-bold">{bannerStrings.strongChrome}</strong>
                {bannerStrings.suffix}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowInAppBanner(false)}
              aria-label={bannerStrings.dismiss}
              className="p-1 rounded-md text-amber-800 hover:text-amber-950 hover:bg-amber-200/70 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header lang={uiLang} dir="ltr" className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: SadhanBox Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/');
            }}
            className="inline-flex items-center gap-2.5 min-w-0 shrink-0"
          >
            <img
              src="/sadhanbox-logo.svg"
              alt="SadhanBox Logo"
              width={36}
              height={36}
              className="w-9 h-9 shrink-0 rounded-xl"
            />
            <div className="leading-tight min-w-0">
              <div className="text-sm sm:text-lg font-extrabold text-[#1E40AF] tracking-tight truncate">
                {s.brandName}
              </div>
              <div className="hidden lg:block text-[11px] font-medium text-slate-500 truncate">
                {s.brandTaglineShort}
              </div>
            </div>
          </a>

          {/* Center / Right Navigation: Home, All Tools, Language Switcher, Go Pro CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <nav className="flex items-center gap-1 sm:gap-1.5" aria-label="Primary Navigation">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/');
                }}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                  activeRoute === '/'
                    ? 'bg-[#1E40AF] text-white'
                    : 'text-[#0F172A] hover:bg-blue-50 hover:text-[#1E40AF]'
                }`}
              >
                <Home className="w-3.5 h-3.5 shrink-0" />
                <span>{s.navHome}</span>
              </a>

              {/* All Tools Dropdown Menu */}
              <div ref={toolsMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsToolsMenuOpen((prev) => !prev)}
                  aria-expanded={isToolsMenuOpen}
                  aria-haspopup="menu"
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap cursor-pointer ${
                    activeRoute !== '/'
                      ? 'bg-slate-100 border-slate-300 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                  <span className="hidden md:inline">{s.navAllTools}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                      isToolsMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isToolsMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 md:hidden"
                      aria-hidden="true"
                      onClick={() => setIsToolsMenuOpen(false)}
                    />
                    <div
                      role="menu"
                      aria-label="SadhanBox Tools Menu"
                      className="fixed inset-x-4 top-[4.25rem] mx-auto max-w-md md:absolute md:inset-x-auto md:top-auto md:right-0 md:mt-2 md:w-80 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-2 z-50 max-h-[80vh] overflow-y-auto"
                    >
                      <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400">
                        {s.navAllToolsSubheading}
                      </div>
                    <div className="space-y-0.5 mt-1">
                      {TOOL_CATALOG.map((tool) => {
                        const isCurrent = activeRoute === tool.route;
                        return (
                          <a
                            key={tool.id}
                            href={tool.route}
                            role="menuitem"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo(tool.route);
                            }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                              isCurrent
                                ? 'bg-slate-100 text-slate-900'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${tool.accentBg}`}
                            >
                              {NAV_TOOL_ICONS[tool.id]}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900 truncate">
                                  {tool.title[uiLang]}
                                </span>
                                {tool.isProOnly && (
                                  <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 border border-[#F59E0B]/40 px-1 py-0.2 text-[9px] font-extrabold text-[#B45309] shrink-0">
                                    <Crown className="w-2.5 h-2.5 text-[#D97706]" />
                                    {s.tplProBadge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {tool.metaLabel[uiLang]}
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                  </>
                )}
              </div>
            </nav>

            {/* 3-Language Switcher: English | मराठी | हिंदी */}
            <div
              role="group"
              aria-label="Website Language"
              className="inline-flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-xl shrink-0"
            >
              {UI_LANGUAGE_OPTIONS.map((item) => {
                const active = uiLang === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleUiLangChange(item.code)}
                    aria-pressed={active}
                    className={`px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Glowing Go Pro (₹49) Header Button */}
            <button
              type="button"
              onClick={() => openProModal('monthly')}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                proActive
                  ? 'bg-emerald-50 text-[#16A34A] border border-emerald-300 hover:bg-emerald-100'
                  : 'bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white shadow-md shadow-amber-500/25 hover:brightness-105'
              }`}
            >
              <Crown className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">
                {proActive ? s.proActiveHeaderBadge : s.goProHeaderBtn}
              </span>
              <span className="sm:hidden">{proActive ? 'Pro' : '₹49'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area by Route */}
      <main id="top" className="flex-1 w-full">
        {activeRoute === '/' && (
          <HomePage
            uiLang={uiLang}
            isPro={proActive}
            downloadCount={downloadCount}
            onNavigate={navigateTo}
            onOpenProModal={() => openProModal('monthly')}
          />
        )}

        {activeRoute === '/background-remover' && (
          <BackgroundRemoverTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
            onToolDownload={handleToolDownload}
            onUsePhotoInMaker={handleUsePhotoInMaker}
          />
        )}

        {activeRoute === '/pdf-tools' && (
          <PdfToolsTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
            onToolDownload={handleToolDownload}
          />
        )}

        {activeRoute === '/image-compressor' && (
          <ImageCompressorTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
            onToolDownload={handleToolDownload}
            onUsePhotoInMaker={handleUsePhotoInMaker}
          />
        )}

        {activeRoute === '/qr-generator' && (
          <QrGeneratorTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
            onToolDownload={handleToolDownload}
          />
        )}

        {activeRoute === '/age-calculator' && (
          <AgeCalculatorTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
          />
        )}

        {activeRoute === '/passport-photo-maker' && (
          <PassportPhotoMakerTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
            onToolDownload={handleToolDownload}
          />
        )}

        {activeRoute === '/signature-resize' && (
          <SignatureResizeTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
            onToolDownload={handleToolDownload}
          />
        )}

        {activeRoute === '/rent-receipt-generator' && (
          <RentReceiptSalarySlipTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
            onToolDownload={handleToolDownload}
          />
        )}

        {activeRoute === '/gst-emi-calculator' && (
          <GstEmiCalculatorTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
          />
        )}

        {activeRoute === '/image-converter' && (
          <ImageFormatConverterTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
            onToolDownload={handleToolDownload}
          />
        )}

        {activeRoute === '/word-counter-typing' && (
          <WordCounterTypingTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
            onToolDownload={handleToolDownload}
          />
        )}

        {activeRoute === '/watermark-adder' && (
          <WatermarkAdderTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
            onToolDownload={handleToolDownload}
          />
        )}

        {activeRoute === '/pdf-compressor' && (
          <PdfCompressorTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
            onToolDownload={handleToolDownload}
          />
        )}

        {activeRoute === '/id-card-print' && (
          <IdCardPrintTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
            onToolDownload={handleToolDownload}
          />
        )}

        {activeRoute === '/invitation-card-maker' && (
          <InvitationCardMakerTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
            onToolDownload={handleToolDownload}
          />
        )}

        {activeRoute === '/gst-invoice-maker' && (
          <GstInvoiceMakerTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
            onToolDownload={handleToolDownload}
          />
        )}

        {activeRoute === '/pdf-to-jpg-scanner' && (
          <PdfToJpgScannerTool
            uiLang={uiLang}
            isPro={proActive}
            onBackHome={() => navigateTo('/')}
            onOpenProModal={() => openProModal('monthly')}
            onToolDownload={handleToolDownload}
          />
        )}

        {isLegalRoute(activeRoute) && (
          <LegalPageView
            route={activeRoute}
            uiLang={uiLang}
            onBackHome={() => navigateTo('/')}
          />
        )}

        {/* Marriage Biodata Maker & Resume Maker Workspace */}
        {isBiodataOrResumeRoute && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
            {/* Back to Home + Document Language Selector */}
            <div lang={uiLang} dir="ltr" className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigateTo('/')}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>{s.backToHome}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs font-semibold text-slate-500">
                  {copy.languageLabel}
                </span>
                <div className="relative inline-flex items-center shrink-0">
                  <Languages
                    className="w-4 h-4 text-slate-500 pointer-events-none absolute left-2.5"
                    aria-hidden="true"
                  />
                  <select
                    id="app-language-select"
                    aria-label={copy.langAriaLabel}
                    value={language}
                    onChange={(e) => handleLanguageSwitch(e.target.value as AppLanguage)}
                    className="appearance-none bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold rounded-xl py-2 pl-8 pr-7 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/15 transition-colors whitespace-nowrap"
                  >
                    {LANGUAGE_LIST.map((langItem) => (
                      <option key={langItem.code} value={langItem.code}>
                        {langItem.nativeName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* Top Mode Switcher Bar */}
            <section
              id="mode-switcher"
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
              <div>
                <h1
                  className={`text-xl sm:text-2xl font-bold text-slate-900 text-balance ${
                    language === 'en' ? 'tracking-tight' : ''
                  }`}
                >
                  {copy.heroTitle}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{copy.heroSubtitle}</p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span className="tabular-nums font-bold">
                    {formatDownloadCount(downloadCount, language)}
                  </span>
                  <span>{copy.downloadsCountLabel}</span>
                </div>
              </div>

              <div className="self-start lg:self-auto w-full lg:w-auto">
                {/* Mode Switcher Tab: Marriage Biodata | Job Resume */}
                <div
                  role="tablist"
                  aria-label={copy.navMode}
                  className="inline-flex p-1 bg-slate-100 rounded-xl w-full sm:w-auto"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'marriage'}
                    onClick={() => handleModeSwitch('marriage')}
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      mode === 'marriage'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{copy.marriageTab}</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'job'}
                    onClick={() => handleModeSwitch('job')}
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      mode === 'job'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{copy.jobTab}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 110 Templates Selector */}
            <TemplateSelector
              selectedTemplate={templateId}
              mode={mode}
              language={language}
              uiLang={uiLang}
              isPro={proActive}
              onSelectTemplate={setTemplateId}
              onOpenProModal={() => openProModal('monthly')}
              resumeCustomization={resumeCustomization}
              onChangeResumeCustomization={setResumeCustomization}
              marriageData={marriageData}
              jobData={jobData}
            />

            {/* Mobile / Tablet Pane Toggle */}
            <div className="lg:hidden flex items-center p-1 bg-slate-200/70 rounded-xl">
              <button
                type="button"
                onClick={() => setMobilePane('editor')}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  mobilePane === 'editor' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <FileText className="w-4 h-4" />
                {copy.mobileFormTab}
              </button>
              <button
                type="button"
                onClick={() => setMobilePane('preview')}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  mobilePane === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <Eye className="w-4 h-4" />
                {copy.mobilePreviewTab}
              </button>
            </div>

            {/* Main 2-Column Workspace */}
            <div
              id="biodata-workspace"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Left Column: Form Editor */}
              <div className={`lg:col-span-5 ${mobilePane === 'editor' ? 'block' : 'hidden lg:block'}`}>
                <BiodataForm
                  mode={mode}
                  language={language}
                  marriageData={marriageData}
                  jobData={jobData}
                  onChangeMarriage={setMarriageData}
                  onChangeJob={setJobData}
                  onLoadSample={handleLoadSample}
                  onClearAll={handleClearAll}
                />
              </div>

              {/* Right Column: Live A4 Preview & Download Actions */}
              <div
                id="preview-panel"
                className={`lg:col-span-7 lg:sticky lg:top-20 space-y-4 ${
                  mobilePane === 'preview' ? 'block' : 'hidden lg:block'
                }`}
              >
                {/* Download Action Bar */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        {copy.previewHeading} ({activeTemplateName})
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">{copy.previewWatermarkHint}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500 tabular-nums">
                      {copy.a4SizeLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadSample}
                      disabled={isExportingSample}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {isExportingSample ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                          <span>{copy.exportingBtn}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 shrink-0" />
                          <span>{copy.freeSampleBtn}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenHdModal}
                      disabled={isExportingHd}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-60"
                    >
                      {isExportingHd ? (
                        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      ) : proActive || proState.singleCredits > 0 ? (
                        <Crown className="w-4 h-4 shrink-0" />
                      ) : (
                        <QrCode className="w-4 h-4 shrink-0" />
                      )}
                      <span>
                        {proActive || proState.singleCredits > 0
                          ? copy.headerDownloadCta
                          : copy.hdPdfBtn}
                      </span>
                    </button>
                  </div>

                  {mode === 'job' && (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800">
                            {copy.resumeWatermarkToggleLabel}
                          </span>
                          {!proActive && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 border border-[#F59E0B]/40 px-1.5 py-0.5 text-[10px] font-extrabold text-[#B45309]">
                              <Crown className="w-2.5 h-2.5 text-[#D97706]" />
                              {s.tplProBadge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {proActive ? copy.resumeWatermarkProHint : copy.resumeWatermarkFreeHint}
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        dir="ltr"
                        aria-label={copy.resumeWatermarkToggleLabel}
                        aria-checked={proActive ? resumeWatermarkEnabled : true}
                        aria-disabled={!proActive}
                        disabled={!proActive}
                        onClick={() => {
                          if (!proActive) return;
                          setResumeWatermarkEnabled((prev) => !prev);
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${
                          !proActive
                            ? 'bg-slate-300 opacity-60 cursor-not-allowed'
                            : resumeWatermarkEnabled
                            ? 'bg-[#16A34A] cursor-pointer'
                            : 'bg-slate-300 cursor-pointer'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                            !proActive || resumeWatermarkEnabled
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  )}

                  {exportError && <p className="text-xs font-medium text-rose-600">{exportError}</p>}

                  {hasBiodataDownloaded && (
                    <WhatsAppShareBar
                      uiLang={uiLang}
                      route={activeRoute === '/resume-maker' ? '/resume-maker' : '/biodata-maker'}
                      toolTitle={modeLabel}
                      compact
                    />
                  )}
                </div>

                {/* Scaled Live A4 Viewport Container */}
                <div className="bg-slate-200/80 rounded-xl border border-slate-300 p-3 sm:p-5">
                  <div
                    ref={previewWrapperRef}
                    className="w-full overflow-hidden flex justify-center"
                    style={{ direction: 'ltr' }}
                  >
                    <div
                      style={{
                        width: `${794 * previewScale}px`,
                        height: `${1122 * previewScale}px`,
                        position: 'relative',
                      }}
                    >
                      <div
                        className="shadow-xl origin-top-left"
                        style={{
                          width: '794px',
                          height: '1122px',
                          transform: `scale(${previewScale})`,
                        }}
                      >
                        <A4PreviewSheet
                          mode={mode}
                          language={language}
                          templateId={templateId}
                          marriageData={marriageData}
                          jobData={jobData}
                          showWatermark={
                            mode === 'job' && proActive ? resumeWatermarkEnabled : !proActive
                          }
                          watermarkText={mode === 'job' && proActive ? 'SadhanBox' : undefined}
                          resumeCustomization={resumeCustomization}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AdSense Slot + How to Use + 5 FAQs for Biodata / Resume Maker */}
            <ToolSeoSection
              route={activeRoute}
              uiLang={uiLang}
              isPro={proActive}
              onOpenProModal={() => openProModal('monthly')}
            />
          </div>
        )}
      </main>

      {/* SadhanBox Footer & Legal Navigation + Quick FAQs */}
      <footer lang={uiLang} dir="ltr" className="border-t border-[#E2E8F0] bg-[#FFFFFF] mt-12">
        <SeoGuideFooter uiLang={uiLang} onNavigate={navigateTo} />
        <div className="border-t border-[#E2E8F0] max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-xs font-medium text-slate-600">
          © 2026 SadhanBox. All rights reserved.
        </div>
      </footer>

      {/* Offscreen Unscaled Capture Nodes for Crisp 1:1 A4 PDF Export */}
      {isBiodataOrResumeRoute && (
        <>
          <div
            ref={sampleCaptureRef}
            aria-hidden="true"
            style={{
              position: 'fixed',
              left: '-10000px',
              top: 0,
              width: '794px',
              height: '1122px',
              overflow: 'hidden',
              pointerEvents: 'none',
              opacity: 1,
            }}
          >
            <A4PreviewSheet
              mode={mode}
              language={language}
              templateId={templateId}
              marriageData={marriageData}
              jobData={jobData}
              showWatermark={mode === 'job' && proActive ? resumeWatermarkEnabled : true}
              watermarkText={mode === 'job' && proActive ? 'SadhanBox' : undefined}
              resumeCustomization={resumeCustomization}
            />
          </div>
          <div
            ref={hdCaptureRef}
            aria-hidden="true"
            style={{
              position: 'fixed',
              left: '-10000px',
              top: 0,
              width: '794px',
              height: '1122px',
              overflow: 'hidden',
              pointerEvents: 'none',
              opacity: 1,
            }}
          >
            <A4PreviewSheet
              mode={mode}
              language={language}
              templateId={templateId}
              marriageData={marriageData}
              jobData={jobData}
              showWatermark={mode === 'job' && proActive ? resumeWatermarkEnabled : false}
              watermarkText={mode === 'job' && proActive ? 'SadhanBox' : undefined}
              resumeCustomization={resumeCustomization}
            />
          </div>
        </>
      )}

      {/* Promo Code Popup for HD PDF Download */}
      <PromoCodeModal
        isOpen={isPromoModalOpen}
        isExporting={isExportingHd}
        language={language}
        uiLang={uiLang}
        templateName={activeTemplateName}
        modeLabel={modeLabel}
        onClose={() => setIsPromoModalOpen(false)}
        onVerifyAndDownload={(method) => handleDownloadHd(method ?? 'promo_code')}
        onSwitchToProUpgrade={() => {
          setIsPromoModalOpen(false);
          openProModal(isTemplatePro(templateId) ? 'monthly' : 'single');
        }}
      />

      {/* Pro Pricing & Checkout Modal (₹0 Free, ₹19 Single, ₹49/mo or ₹199/yr Pro Pass) */}
      <ProPricingModal
        isOpen={isProModalOpen}
        uiLang={uiLang}
        proState={proState}
        initialPlan={proModalInitialPlan}
        onClose={() => setIsProModalOpen(false)}
        onProStateChange={setProState}
      />
    </div>
  );
}
