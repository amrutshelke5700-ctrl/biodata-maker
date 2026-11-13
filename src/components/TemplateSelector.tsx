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
          const primaryTitle = tplCopy.name;
          const subLabel =
            tpl.recommendedFor === mode ? copy.recommendedLabel : tplCopy.description;

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
              {/* Miniature A4 Frame Swatch */}
              <div
                className="w-10 h-13 shrink-0 rounded-xs relative overflow-hidden border border-slate-200"
                style={{ backgroundColor: tpl.paperColor }}
                aria-hidden="true"
              >
                {tpl.id === 'royal-gold' && (
                  <>
                    <div
                      className="absolute inset-1 border-2"
                      style={{ borderColor: '#B8860B' }}
                    />
                    <div
                      className="absolute top-2.5 left-2 right-2 h-1"
                      style={{ backgroundColor: '#7C2D12' }}
                    />
                  </>
                )}
                {tpl.id === 'paithani' && (
                  <>
                    <div
                      className="absolute top-0.5 left-0.5 right-0.5 h-2"
                      style={{ backgroundColor: '#8E1A50', borderBottom: '1px solid #D4AF37' }}
                    />
                    <div
                      className="absolute bottom-0.5 left-0.5 right-0.5 h-2"
                      style={{ backgroundColor: '#8E1A50', borderTop: '1px solid #D4AF37' }}
                    />
                    <div
                      className="absolute top-2.5 bottom-2.5 left-0.5 w-1"
                      style={{ backgroundColor: '#0F5C53' }}
                    />
                    <div
                      className="absolute top-2.5 bottom-2.5 right-0.5 w-1"
                      style={{ backgroundColor: '#0F5C53' }}
                    />
                  </>
                )}
                {tpl.id === 'emerald-ivory' && (
                  <>
                    <div
                      className="absolute inset-1 border-2"
                      style={{ borderColor: '#064E3B' }}
                    />
                    <div
                      className="absolute inset-2 border"
                      style={{ borderColor: '#C59B27' }}
                    />
                  </>
                )}
                {tpl.id === 'kumkum-maroon' && (
                  <>
                    <div
                      className="absolute inset-1 border-2"
                      style={{ borderColor: '#7F1D1D' }}
                    />
                    <div
                      className="absolute top-2 left-2 right-2 h-1.5"
                      style={{ backgroundColor: '#D97706' }}
                    />
                  </>
                )}
                {tpl.id === 'lotus-rose' && (
                  <>
                    <div
                      className="absolute inset-1 border"
                      style={{ borderColor: '#BE185D' }}
                    />
                    <div
                      className="absolute top-1 left-1 w-2.5 h-2.5 rounded-br-full"
                      style={{ backgroundColor: '#FBCFE8' }}
                    />
                    <div
                      className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-tl-full"
                      style={{ backgroundColor: '#FBCFE8' }}
                    />
                  </>
                )}
                {tpl.id === 'saffron-maratha' && (
                  <>
                    <div
                      className="absolute top-0.5 left-0.5 right-0.5 h-2"
                      style={{ backgroundColor: '#9A3412', borderBottom: '1px solid #F59E0B' }}
                    />
                    <div
                      className="absolute bottom-0.5 left-0.5 right-0.5 h-2"
                      style={{ backgroundColor: '#9A3412', borderTop: '1px solid #F59E0B' }}
                    />
                    <div
                      className="absolute inset-1.5 border"
                      style={{ borderColor: '#D97706' }}
                    />
                  </>
                )}
                {tpl.id === 'modern-blue' && (
                  <>
                    <div
                      className="absolute top-0 left-0 right-0 h-3.5"
                      style={{ backgroundColor: '#1E3A8A' }}
                    />
                    <div
                      className="absolute inset-0.5 border"
                      style={{ borderColor: '#BFDBFE' }}
                    />
                  </>
                )}
                {tpl.id === 'charcoal-exec' && (
                  <>
                    <div
                      className="absolute top-0 left-0 right-0 h-3.5"
                      style={{ backgroundColor: '#0F172A' }}
                    />
                    <div
                      className="absolute top-0 bottom-0 left-0 w-1.5"
                      style={{ backgroundColor: '#334155' }}
                    />
                  </>
                )}
                {tpl.id === 'teal-modern' && (
                  <>
                    <div
                      className="absolute top-0 left-0 right-0 h-3.5"
                      style={{ backgroundColor: '#0F766E' }}
                    />
                    <div
                      className="absolute inset-0.5 border"
                      style={{ borderColor: '#99F6E4' }}
                    />
                  </>
                )}
                {tpl.id === 'minimalist' && (
                  <div
                    className="absolute inset-1 border"
                    style={{ borderColor: '#374151' }}
                  />
                )}
              </div>

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
