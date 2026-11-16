import React from 'react';
import { Check } from 'lucide-react';
import { AppLanguage, BiodataMode, TEMPLATES, TemplateId } from '../types/biodata';
import { getCopy } from '../utils/translations';
import { getLocalizedTemplateCopy } from '../utils/templateTranslations';

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  mode: BiodataMode;
  language: AppLanguage;
  onSelectTemplate: (id: TemplateId) => void;
}

function getTemplatePreviewSvgUri(id: TemplateId, paperColor: string): string {
  let inner = '';

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

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 52" width="40" height="52"><rect width="40" height="52" fill="${paperColor}"/>${inner}<rect x="9" y="18" width="14" height="2" rx="1" fill="#CBD5E1"/><rect x="9" y="23" width="22" height="1.8" rx="0.9" fill="#E2E8F0"/><rect x="9" y="28" width="20" height="1.8" rx="0.9" fill="#E2E8F0"/><rect x="9" y="33" width="17" height="1.8" rx="0.9" fill="#E2E8F0"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  mode,
  language,
  onSelectTemplate,
}) => {
  const copy = getCopy(language);

  return (
    <section id="templates-section" aria-label={copy.templatesHeading}>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-sm font-bold text-slate-900">
          {copy.templatesHeading}
        </h2>
        <span className="text-xs text-slate-500">
          {mode === 'job' ? copy.templatesHintJob : copy.templatesHintMarriage}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {TEMPLATES.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;
          const tplCopy = getLocalizedTemplateCopy(tpl.id, language);
          const mrCopy = getLocalizedTemplateCopy(tpl.id, 'mr');
          const enCopy = getLocalizedTemplateCopy(tpl.id, 'en');
          const primaryTitle = tplCopy.name;
          const subLabel =
            tpl.recommendedFor === mode ? copy.recommendedLabel : tplCopy.description;
          const previewAlt = `${mrCopy.name} (${enCopy.name}) — ${mrCopy.description} | ${enCopy.description}`;

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelectTemplate(tpl.id)}
              aria-pressed={isSelected}
              className={`group text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                isSelected
                  ? 'bg-white border-slate-900 ring-2 ring-slate-900/10 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Miniature A4 Frame Preview Image with Descriptive Marathi & English Alt */}
              <img
                src={getTemplatePreviewSvgUri(tpl.id, tpl.paperColor)}
                alt={previewAlt}
                width={40}
                height={52}
                className="w-10 h-13 shrink-0 rounded-xs border border-slate-200 block object-cover"
              />

              {/* Label & Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <div className="text-xs font-bold text-slate-900 leading-snug">
                    {primaryTitle}
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-medium text-slate-500 mt-0.5 line-clamp-1">
                  {subLabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
