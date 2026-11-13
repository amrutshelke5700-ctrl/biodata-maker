import React, { useEffect, useRef, useState } from 'react';
import {
  Briefcase,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Heart,
  Languages,
  Loader2,
  QrCode,
} from 'lucide-react';
import { A4PreviewSheet } from './components/A4PreviewSheet';
import { BiodataForm } from './components/BiodataForm';
import { PaymentModal } from './components/PaymentModal';
import { TemplateSelector } from './components/TemplateSelector';
import {
  AppLanguage,
  BiodataMode,
  EMPTY_JOB_DATA,
  EMPTY_MARRIAGE_DATA,
  JobBiodata,
  MarriageBiodata,
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
import {
  getReligionConfig,
  isKnownReligionDefaultTitle,
  translateReligionSect,
} from './utils/religionConfig';
import { SAMPLE_DATA_BY_LANGUAGE, getSampleBundle } from './utils/sampleData';
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

function getInitialLanguage(): AppLanguage {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LANG) as AppLanguage | null;
    return saved && VALID_LANGUAGES.includes(saved) ? saved : 'mr';
  } catch {
    return 'mr';
  }
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

export default function App() {
  const [language, setLanguage] = useState<AppLanguage>(getInitialLanguage);
  const [mode, setMode] = useState<BiodataMode>('marriage');
  const [templateId, setTemplateId] = useState<TemplateId>('royal-gold');
  const [marriageData, setMarriageData] = useState<MarriageBiodata>(() => {
    const lang = getInitialLanguage();
    return loadSavedState(STORAGE_KEY_MARRIAGE, getSampleBundle(lang).marriage);
  });
  const [jobData, setJobData] = useState<JobBiodata>(() => {
    const lang = getInitialLanguage();
    return loadSavedState(STORAGE_KEY_JOB, getSampleBundle(lang).job);
  });

  const copy = getCopy(language);
  const langMeta = getLanguageMeta(language);

  // Mobile toggle between Editor and Live Preview
  const [mobilePane, setMobilePane] = useState<'editor' | 'preview'>('editor');

  // Responsive scale measurement for A4 Preview
  const previewWrapperRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState<number>(0.68);

  // Offscreen unscaled capture nodes for crisp 1:1 A4 PDF rendering
  const sampleCaptureRef = useRef<HTMLDivElement | null>(null);
  const hdCaptureRef = useRef<HTMLDivElement | null>(null);

  const [isExportingSample, setIsExportingSample] = useState(false);
  const [isExportingHd, setIsExportingHd] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [exportError, setExportError] = useState('');

  useEffect(() => {
    const meta = getLanguageMeta(language);
    const activeCopy = getCopy(language);
    document.documentElement.lang = language;
    document.documentElement.dir = meta.dir;
    document.body.style.fontFamily = meta.fontStack;
    document.title = activeCopy.pageTitle;
    void ensureLanguageFontLoaded(language);
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
  }, [mobilePane]);

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
      }));
    }
  };

  const handleModeSwitch = (nextMode: BiodataMode) => {
    setMode(nextMode);
    const activeTpl = TEMPLATES.find((t) => t.id === templateId);
    if (nextMode === 'job' && activeTpl?.recommendedFor === 'marriage') {
      setTemplateId('modern-blue');
    } else if (
      nextMode === 'marriage' &&
      (templateId === 'modern-blue' || templateId === 'charcoal-exec' || templateId === 'teal-modern')
    ) {
      setTemplateId('royal-gold');
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
    setExportError('');
    setIsExportingSample(true);
    try {
      await exportA4Pdf({
        element: sampleCaptureRef.current,
        filename: getPdfFilename(true),
        language,
      });
    } catch {
      setExportError(copy.exportErrorMsg);
    } finally {
      setIsExportingSample(false);
    }
  };

  const handleDownloadHd = async () => {
    if (!hdCaptureRef.current) return;
    setExportError('');
    setIsExportingHd(true);
    try {
      await exportA4Pdf({
        element: hdCaptureRef.current,
        filename: getPdfFilename(false),
        language,
      });
    } catch {
      setExportError(copy.exportErrorMsg);
    } finally {
      setIsExportingHd(false);
    }
  };

  const activeTemplate = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
  const activeTemplateName = getLocalizedTemplateCopy(activeTemplate.id, language).name;
  const modeLabel = mode === 'marriage' ? copy.marriageTab : copy.jobTab;

  return (
    <div
      dir={langMeta.dir}
      style={{ fontFamily: langMeta.fontStack }}
      className="min-h-screen flex flex-col bg-[#F8F9FB] text-slate-900"
    >
      {/* Clean 3-Zone Top Header with 12-Language Dropdown Selector */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4 sm:gap-8">
          <a
            href="#top"
            className={`text-base sm:text-lg font-bold text-slate-900 whitespace-nowrap shrink-0 ${
              language === 'en' ? 'tracking-tight' : ''
            }`}
          >
            {copy.brandTitle}
          </a>

          <nav
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600"
            aria-label={copy.navAriaLabel}
          >
            <a
              href="#mode-switcher"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {copy.navMode}
            </a>
            <a
              href="#templates-section"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {copy.navTemplates}
            </a>
            <a
              href="#biodata-workspace"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {copy.navForm}
            </a>
            <a
              href="#preview-panel"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {copy.navPreview}
            </a>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* 12-Language Dropdown Selector */}
            <div className="relative inline-flex items-center shrink-0">
              <Languages
                className={`w-4 h-4 text-slate-500 pointer-events-none absolute ${
                  langMeta.dir === 'rtl' ? 'right-2.5' : 'left-2.5'
                }`}
                aria-hidden="true"
              />
              <select
                id="app-language-select"
                aria-label={copy.langAriaLabel}
                value={language}
                onChange={(e) => handleLanguageSwitch(e.target.value as AppLanguage)}
                className={`appearance-none bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold rounded-lg py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/15 transition-colors whitespace-nowrap ${
                  langMeta.dir === 'rtl' ? 'pr-8 pl-7' : 'pl-8 pr-7'
                }`}
              >
                {LANGUAGE_LIST.map((langItem) => (
                  <option key={langItem.code} value={langItem.code}>
                    {langItem.nativeName}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 pointer-events-none absolute ${
                  langMeta.dir === 'rtl' ? 'left-2' : 'right-2'
                }`}
                aria-hidden="true"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {copy.headerDownloadCta}
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
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

        {/* 10 Premium Templates Selector */}
        <TemplateSelector
          selectedTemplate={templateId}
          mode={mode}
          language={language}
          onSelectTemplate={setTemplateId}
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
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
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
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <QrCode className="w-4 h-4 shrink-0" />
                  <span>{copy.hdPdfBtn}</span>
                </button>
              </div>

              {exportError && <p className="text-xs font-medium text-rose-600">{exportError}</p>}
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
                      showWatermark={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>{copy.footerLeft}</span>
          <span>{copy.footerRight}</span>
        </div>
      </footer>

      {/* Offscreen Unscaled Capture Nodes for Crisp 1:1 A4 html2pdf Export */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-10000px',
          top: 0,
          width: '794px',
          height: '1122px',
          pointerEvents: 'none',
          opacity: 1,
        }}
      >
        <div ref={sampleCaptureRef}>
          <A4PreviewSheet
            mode={mode}
            language={language}
            templateId={templateId}
            marriageData={marriageData}
            jobData={jobData}
            showWatermark={true}
          />
        </div>
        <div ref={hdCaptureRef}>
          <A4PreviewSheet
            mode={mode}
            language={language}
            templateId={templateId}
            marriageData={marriageData}
            jobData={jobData}
            showWatermark={false}
          />
        </div>
      </div>

      {/* ₹29 UPI Payment Popup with Dynamic QR, Direct UPI Link & Mandatory 12-Digit UTR */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        isExporting={isExportingHd}
        language={language}
        templateName={activeTemplateName}
        modeLabel={modeLabel}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirmPaymentAndDownload={handleDownloadHd}
      />
    </div>
  );
}
