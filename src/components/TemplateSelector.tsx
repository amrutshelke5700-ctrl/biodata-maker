import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Crown,
  Eye,
  GitCommitVertical,
  GraduationCap,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Type,
  X,
} from 'lucide-react';
import {
  AppLanguage,
  BiodataMode,
  JobBiodata,
  MarriageBiodata,
  ResumeCustomization,
  TEMPLATES,
  TemplateId,
} from '../types/biodata';
import { getModernTemplateSpec } from '../utils/modernTemplates';
import { isTemplatePro } from '../utils/proState';
import { getSampleBundle } from '../utils/sampleData';
import { UiLang, getSiteStrings } from '../utils/siteI18n';
import { getCopy } from '../utils/translations';
import { getLocalizedTemplateCopy } from '../utils/templateTranslations';
import { A4PreviewSheet } from './A4PreviewSheet';

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  mode: BiodataMode;
  language: AppLanguage;
  uiLang: UiLang;
  isPro: boolean;
  onSelectTemplate: (id: TemplateId) => void;
  onOpenProModal: () => void;
  resumeCustomization?: ResumeCustomization;
  onChangeResumeCustomization?: (next: ResumeCustomization) => void;
  marriageData?: MarriageBiodata;
  jobData?: JobBiodata;
}

type GalleryFilter = 'all' | 'modern' | 'traditional';

function getTemplatePreviewSvgUri(id: TemplateId, paperColor: string): string {
  const modernSpec = getModernTemplateSpec(id);
  let inner = '';

  if (modernSpec) {
    const { primary, accent, dividerColor, borderColor, sectionBg } = modernSpec.color;
    switch (modernSpec.style) {
      case 'top-bar':
        inner = `<rect x="2" y="2" width="36" height="48" fill="none" stroke="${dividerColor}" stroke-width="1"/><rect x="2" y="2" width="36" height="9" fill="${primary}"/><rect x="2" y="11" width="36" height="2" fill="${accent}"/>`;
        break;
      case 'left-sidebar':
        inner = `<rect x="2" y="2" width="36" height="48" fill="none" stroke="${dividerColor}" stroke-width="1"/><rect x="2" y="2" width="6" height="48" fill="${primary}"/><rect x="8" y="2" width="2" height="48" fill="${accent}"/>`;
        break;
      case 'split-card':
        inner = `<rect x="3" y="3" width="34" height="46" rx="3" fill="none" stroke="${borderColor}" stroke-width="1.5"/><rect x="6" y="6" width="28" height="8" rx="1.5" fill="${sectionBg}" stroke="${dividerColor}" stroke-width="0.8"/>`;
        break;
      case 'geometric-corner':
        inner = `<rect x="4" y="4" width="32" height="44" fill="none" stroke="${dividerColor}" stroke-width="0.8"/><path d="M3 11 V3 H11" fill="none" stroke="${primary}" stroke-width="2"/><path d="M29 3 H37 V11" fill="none" stroke="${accent}" stroke-width="2"/><path d="M3 41 V49 H11" fill="none" stroke="${accent}" stroke-width="2"/><path d="M29 49 H37 V41" fill="none" stroke="${primary}" stroke-width="2"/>`;
        break;
      case 'minimal-accent':
      default:
        inner = `<rect x="4" y="4" width="32" height="2.5" fill="${primary}"/><rect x="4" y="46" width="32" height="2" fill="${accent}"/><line x1="4" y1="7" x2="4" y2="46" stroke="${dividerColor}" stroke-width="0.8"/><line x1="36" y1="7" x2="36" y2="46" stroke="${dividerColor}" stroke-width="0.8"/>`;
        break;
    }
  } else {
    switch (id) {
      case 'royal-gold':
        inner = `<rect x="4" y="4" width="32" height="44" fill="none" stroke="#B8860B" stroke-width="2"/><rect x="8" y="10" width="24" height="4" fill="#7C2D12"/>`;
        break;
      case 'paithani':
        inner = `<rect x="2" y="2" width="36" height="8" fill="#8E1A50"/><line x1="2" y1="10" x2="38" y2="10" stroke="#D4AF37" stroke-width="1"/><rect x="2" y="42" width="36" height="8" fill="#8E1A50"/><line x1="2" y1="42" x2="38" y2="42" stroke="#D4AF37" stroke-width="1"/><rect x="2" y="10" width="4" height="32" fill="#0F5C53"/><rect x="34" y="10" width="4" height="32" fill="#0F5C53"/>`;
        break;
      case 'emerald-ivory':
        inner = `<rect x="4" y="4" width="32" height="44" fill="none" stroke="#064E3B" stroke-width="2"/><rect x="8" y="8" width="24" height="36" fill="none" stroke="#C59B27" stroke-width="1"/>`;
        break;
      case 'kumkum-maroon':
        inner = `<rect x="4" y="4" width="32" height="44" fill="none" stroke="#7F1D1D" stroke-width="2"/><rect x="8" y="8" width="24" height="6" fill="#D97706"/>`;
        break;
      case 'lotus-rose':
        inner = `<rect x="4" y="4" width="32" height="44" fill="none" stroke="#BE185D" stroke-width="1.5"/><path d="M4 4 H14 A10 10 0 0 1 4 14 Z" fill="#FBCFE8"/><path d="M36 48 H26 A10 10 0 0 1 36 38 Z" fill="#FBCFE8"/>`;
        break;
      case 'saffron-maratha':
        inner = `<rect x="2" y="2" width="36" height="8" fill="#9A3412"/><line x1="2" y1="10" x2="38" y2="10" stroke="#F59E0B" stroke-width="1"/><rect x="2" y="42" width="36" height="8" fill="#9A3412"/><line x1="2" y1="42" x2="38" y2="42" stroke="#F59E0B" stroke-width="1"/><rect x="6" y="6" width="28" height="40" fill="none" stroke="#D97706" stroke-width="1"/>`;
        break;
      case 'modern-blue':
        inner = `<rect x="0" y="0" width="40" height="14" fill="#1E3A8A"/><rect x="2" y="2" width="36" height="48" fill="none" stroke="#BFDBFE" stroke-width="1"/>`;
        break;
      case 'charcoal-exec':
        inner = `<rect x="0" y="0" width="40" height="14" fill="#0F172A"/><rect x="0" y="0" width="6" height="52" fill="#334155"/>`;
        break;
      case 'teal-modern':
        inner = `<rect x="0" y="0" width="40" height="14" fill="#0F766E"/><rect x="2" y="2" width="36" height="48" fill="none" stroke="#99F6E4" stroke-width="1"/>`;
        break;
      case 'minimalist':
      default:
        inner = `<rect x="4" y="4" width="32" height="44" fill="none" stroke="#374151" stroke-width="1.2"/>`;
        break;
    }
  }

  const lineOffset = modernSpec?.style === 'left-sidebar' ? 13 : 9;
  const lineWidth = modernSpec?.style === 'left-sidebar' ? 18 : 22;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 52" width="40" height="52"><rect width="40" height="52" fill="${paperColor}"/>${inner}<rect x="${lineOffset}" y="18" width="14" height="2" rx="1" fill="#CBD5E1"/><rect x="${lineOffset}" y="23" width="${lineWidth}" height="1.8" rx="0.9" fill="#E2E8F0"/><rect x="${lineOffset}" y="28" width="${lineWidth - 2}" height="1.8" rx="0.9" fill="#E2E8F0"/><rect x="${lineOffset}" y="33" width="${lineWidth - 5}" height="1.8" rx="0.9" fill="#E2E8F0"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  mode,
  language,
  uiLang,
  isPro,
  onSelectTemplate,
  onOpenProModal,
  resumeCustomization,
  onChangeResumeCustomization,
  marriageData,
  jobData,
}) => {
  const copy = getCopy(language);
  const s = getSiteStrings(uiLang);
  const [filter, setFilter] = useState<GalleryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [quickPreviewId, setQuickPreviewId] = useState<TemplateId | null>(null);
  const modalPreviewWrapperRef = useRef<HTMLDivElement | null>(null);
  const [modalPreviewScale, setModalPreviewScale] = useState<number>(0.72);

  const orderedTemplates = useMemo(() => {
    if (mode === 'job') {
      // Put job-friendly modern Free + Pro templates first so Resume mode surfaces 4-5 Free + 3-4 Pro cleanly
      const jobHighlightIds = new Set<string>([
        'modern-blue',
        'charcoal-exec',
        'teal-modern',
        'minimalist',
        'modern-indigo-top-bar',
        'modern-bronze-top-bar',
        'modern-obsidian-left-sidebar',
        'modern-sapphire-geometric-corner',
        'modern-bronze-split-card',
      ]);
      const highlighted = TEMPLATES.filter((t) => jobHighlightIds.has(t.id));
      const rest = TEMPLATES.filter((t) => !jobHighlightIds.has(t.id));
      return [...highlighted, ...rest];
    }
    return TEMPLATES;
  }, [mode]);

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orderedTemplates.filter((tpl) => {
      if (filter !== 'all' && tpl.category !== filter) {
        return false;
      }
      if (!q) return true;
      const localized = getLocalizedTemplateCopy(tpl.id, language);
      const enCopy = getLocalizedTemplateCopy(tpl.id, 'en');
      const mrCopy = getLocalizedTemplateCopy(tpl.id, 'mr');
      return (
        localized.name.toLowerCase().includes(q) ||
        localized.description.toLowerCase().includes(q) ||
        enCopy.name.toLowerCase().includes(q) ||
        mrCopy.name.toLowerCase().includes(q)
      );
    });
  }, [orderedTemplates, filter, searchQuery, language]);

  const showScrollableAll = isExpanded || filter === 'modern' || searchQuery.trim().length > 0;

  const visibleTemplates = useMemo(() => {
    if (showScrollableAll || filteredTemplates.length <= 10) {
      return filteredTemplates;
    }
    const baseSlice = filteredTemplates.slice(0, 10);
    if (baseSlice.some((t) => t.id === selectedTemplate)) {
      return baseSlice;
    }
    const selectedObj = filteredTemplates.find((t) => t.id === selectedTemplate);
    if (!selectedObj) return baseSlice;
    return [selectedObj, ...baseSlice.slice(0, 9)];
  }, [filteredTemplates, showScrollableAll, selectedTemplate]);

  const selectedIsPro = isTemplatePro(selectedTemplate);

  const sampleBundle = useMemo(() => getSampleBundle(language), [language]);
  const resolvedMarriageData = marriageData ?? sampleBundle.marriage;
  const resolvedJobData = jobData ?? sampleBundle.job;

  const quickPreviewTemplate = useMemo(
    () => (quickPreviewId ? TEMPLATES.find((t) => t.id === quickPreviewId) ?? null : null),
    [quickPreviewId]
  );

  const previewNavList = filteredTemplates.length > 0 ? filteredTemplates : orderedTemplates;
  const quickPreviewIndex = quickPreviewTemplate
    ? previewNavList.findIndex((t) => t.id === quickPreviewTemplate.id)
    : -1;

  useEffect(() => {
    if (!quickPreviewId) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setQuickPreviewId(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    const el = modalPreviewWrapperRef.current;
    const updateScale = () => {
      if (!el) return;
      const availableWidth = el.clientWidth;
      if (availableWidth > 0) {
        setModalPreviewScale(Math.min(0.85, Math.max(0.32, availableWidth / 794)));
      }
    };

    updateScale();
    const observer = el ? new ResizeObserver(updateScale) : null;
    if (el && observer) {
      observer.observe(el);
    }
    window.addEventListener('resize', updateScale);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      observer?.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [quickPreviewId]);

  return (
    <section id="templates-section" aria-label={copy.templatesHeading} className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold text-slate-900">{copy.templatesHeading}</h2>
        <span className="text-xs text-slate-500">
          {mode === 'job' ? copy.templatesHintJob : copy.templatesHintMarriage}
        </span>
      </div>

      {/* Category Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div
          className="inline-flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label={copy.templatesHeading}
        >
          {(
            [
              { id: 'all', label: copy.tplFilterAll },
              { id: 'modern', label: copy.tplFilterModern },
              { id: 'traditional', label: copy.tplFilterTraditional },
            ] as const
          ).map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={copy.tplSearchPlaceholder}
            className="w-full pl-8 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label={copy.closeAriaLabel}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Resume Template Customization Toggles */}
      {mode === 'job' && resumeCustomization && onChangeResumeCustomization && (
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span>{copy.resumeCustomizeTitle}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <button
              type="button"
              role="switch"
              aria-checked={resumeCustomization.showEducationalIcons}
              onClick={() =>
                onChangeResumeCustomization({
                  ...resumeCustomization,
                  showEducationalIcons: !resumeCustomization.showEducationalIcons,
                })
              }
              className="inline-flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer group"
            >
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>{copy.toggleEducationalIconsLabel}</span>
              </span>
              <span
                dir="ltr"
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                  resumeCustomization.showEducationalIcons ? 'bg-[#1E40AF]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                    resumeCustomization.showEducationalIcons ? 'translate-x-4.5' : 'translate-x-0.5'
                  }`}
                />
              </span>
            </button>

            <button
              type="button"
              role="switch"
              aria-checked={resumeCustomization.showExperienceTimeline}
              onClick={() =>
                onChangeResumeCustomization({
                  ...resumeCustomization,
                  showExperienceTimeline: !resumeCustomization.showExperienceTimeline,
                })
              }
              className="inline-flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer group"
            >
              <span className="inline-flex items-center gap-1.5">
                <GitCommitVertical className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>{copy.toggleExperienceTimelineLabel}</span>
              </span>
              <span
                dir="ltr"
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                  resumeCustomization.showExperienceTimeline ? 'bg-[#1E40AF]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                    resumeCustomization.showExperienceTimeline
                      ? 'translate-x-4.5'
                      : 'translate-x-0.5'
                  }`}
                />
              </span>
            </button>

            {/* Global Font Size Slider (85% - 115%) */}
            <div className="inline-flex items-center gap-2">
              <label
                htmlFor="resume-font-size-slider"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 whitespace-nowrap"
              >
                <Type className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>{copy.resumeFontSizeLabel}</span>
              </label>
              <input
                id="resume-font-size-slider"
                type="range"
                min={85}
                max={115}
                step={1}
                value={Math.min(115, Math.max(85, resumeCustomization.fontSizeScale ?? 100))}
                onChange={(e) =>
                  onChangeResumeCustomization({
                    ...resumeCustomization,
                    fontSizeScale: Number(e.target.value),
                  })
                }
                aria-label={copy.resumeFontSizeLabel}
                className="w-24 sm:w-28 accent-[#1E40AF] cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800 tabular-nums w-9 text-right">
                {Math.min(115, Math.max(85, resumeCustomization.fontSizeScale ?? 100))}%
              </span>
              {(resumeCustomization.fontSizeScale ?? 100) !== 100 && (
                <button
                  type="button"
                  onClick={() =>
                    onChangeResumeCustomization({
                      ...resumeCustomization,
                      fontSizeScale: 100,
                    })
                  }
                  title="Reset 100%"
                  aria-label="Reset font size to 100%"
                  className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Template Grid */}
      {visibleTemplates.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-xs text-slate-500">
          {copy.tplNoMatch}
        </div>
      ) : (
        <div className={showScrollableAll ? 'max-h-[390px] overflow-y-auto pr-1 rounded-xl' : ''}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {visibleTemplates.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;
              const isQuickPreviewed = quickPreviewId === tpl.id;
              const tplPro = isTemplatePro(tpl.id);
              const tplCopy = getLocalizedTemplateCopy(tpl.id, language);
              const primaryTitle = tplCopy.name;
              const subLabel =
                tpl.recommendedFor === mode ? copy.recommendedLabel : tplCopy.description;

              return (
                <div
                  key={tpl.id}
                  className={`rounded-xl border transition-all flex flex-col justify-between bg-white ${
                    isSelected
                      ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectTemplate(tpl.id)}
                    aria-pressed={isSelected}
                    className="group w-full text-left p-3 pb-2.5 flex items-start gap-2.5 cursor-pointer rounded-t-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                  >
                    <img
                      src={getTemplatePreviewSvgUri(tpl.id, tpl.paperColor)}
                      alt={primaryTitle}
                      width={40}
                      height={52}
                      loading="lazy"
                      className="w-10 h-13 shrink-0 rounded-xs border border-slate-200 block object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                          {primaryTitle}
                        </div>
                        {isSelected ? (
                          <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        ) : tplPro ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-[#B45309] bg-amber-100 border border-[#F59E0B]/40 px-1.5 py-0.5 rounded shrink-0">
                            <Crown className="w-2.5 h-2.5 text-[#D97706]" />
                            {s.tplProBadge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-[#16A34A] shrink-0">
                            {s.tplFreeBadge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 mt-0.5 line-clamp-1">
                        {subLabel}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setQuickPreviewId((prev) => (prev === tpl.id ? null : tpl.id))
                    }
                    aria-pressed={isQuickPreviewed}
                    aria-label={`${copy.tplQuickPreviewBtn}: ${primaryTitle}`}
                    className={`w-full border-t border-slate-100 px-3 py-1.5 inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold rounded-b-xl transition-colors cursor-pointer whitespace-nowrap ${
                      isQuickPreviewed
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{copy.tplQuickPreviewBtn}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Pro Template Banner for Free Users */}
      {selectedIsPro && !isPro && (
        <div
          lang={uiLang}
          dir="ltr"
          className="bg-amber-50 border border-[#F59E0B]/50 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start sm:items-center gap-2.5">
            <Crown className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5 sm:mt-0" />
            <div className="text-xs">
              <span className="font-bold text-[#0F172A]">{s.tplProBannerTitle}: </span>
              <span className="text-slate-700">{s.tplProBannerDesc}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenProModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:brightness-105 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-white" />
            <span>{s.tplProBannerCta}</span>
          </button>
        </div>
      )}

      {/* Expand / Collapse All 110 Templates Toggle */}
      {filter === 'all' && !searchQuery.trim() && filteredTemplates.length > 10 && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>{copy.tplShowLessBtn}</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>{copy.tplShowAllBtn}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* High-Fidelity Quick Preview Modal */}
      {quickPreviewTemplate && (() => {
        const previewCopy = getLocalizedTemplateCopy(quickPreviewTemplate.id, language);
        const previewIsPro = isTemplatePro(quickPreviewTemplate.id);
        const previewIsSelected = selectedTemplate === quickPreviewTemplate.id;
        const hasPrev = quickPreviewIndex > 0;
        const hasNext = quickPreviewIndex >= 0 && quickPreviewIndex < previewNavList.length - 1;

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-3 sm:p-5 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-preview-modal-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setQuickPreviewId(null);
            }}
          >
            <div className="w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-slate-200 bg-white shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={getTemplatePreviewSvgUri(
                      quickPreviewTemplate.id,
                      quickPreviewTemplate.paperColor
                    )}
                    alt={previewCopy.name}
                    width={32}
                    height={42}
                    className="w-8 h-10.5 shrink-0 rounded-xs border border-slate-200 block object-cover"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        id="quick-preview-modal-title"
                        className="text-sm sm:text-base font-bold text-slate-900 truncate"
                      >
                        {previewCopy.name}
                      </h3>
                      {previewIsPro ? (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-[#B45309] bg-amber-100 border border-[#F59E0B]/40 px-1.5 py-0.5 rounded shrink-0">
                          <Crown className="w-2.5 h-2.5 text-[#D97706]" />
                          {s.tplProBadge}
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-[#16A34A] shrink-0">
                          {s.tplFreeBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {previewCopy.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setQuickPreviewId(null)}
                  aria-label={copy.closeAriaLabel}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scaled High-Fidelity A4 Sheet Viewport */}
              <div className="flex-1 overflow-y-auto bg-slate-200/80 p-3 sm:p-6">
                <div
                  ref={modalPreviewWrapperRef}
                  className="w-full flex justify-center"
                  style={{ direction: 'ltr' }}
                >
                  <div
                    style={{
                      width: `${794 * modalPreviewScale}px`,
                      height: `${1122 * modalPreviewScale}px`,
                      position: 'relative',
                    }}
                  >
                    <div
                      className="shadow-2xl origin-top-left"
                      style={{
                        width: '794px',
                        height: '1122px',
                        transform: `scale(${modalPreviewScale})`,
                      }}
                    >
                      <A4PreviewSheet
                        mode={mode}
                        language={language}
                        templateId={quickPreviewTemplate.id}
                        marriageData={resolvedMarriageData}
                        jobData={resolvedJobData}
                        showWatermark={false}
                        resumeCustomization={resumeCustomization}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-t border-slate-200 bg-white shrink-0">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={!hasPrev}
                    onClick={() => {
                      if (hasPrev) setQuickPreviewId(previewNavList[quickPreviewIndex - 1].id);
                    }}
                    aria-label="Previous template"
                    className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {quickPreviewIndex >= 0 && (
                    <span className="text-xs font-semibold text-slate-500 tabular-nums px-1.5">
                      {quickPreviewIndex + 1} / {previewNavList.length}
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!hasNext}
                    onClick={() => {
                      if (hasNext) setQuickPreviewId(previewNavList[quickPreviewIndex + 1].id);
                    }}
                    aria-label="Next template"
                    className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {previewIsPro && !isPro && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuickPreviewId(null);
                        onOpenProModal();
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:brightness-105 rounded-xl transition-all whitespace-nowrap cursor-pointer"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>{s.tplProBannerCta}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setQuickPreviewId(null)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {copy.closeAriaLabel}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTemplate(quickPreviewTemplate.id);
                      setQuickPreviewId(null);
                    }}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                      previewIsSelected
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {previewIsSelected ? copy.tplAppliedBadge : copy.tplApplyTemplateBtn}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
};
