import React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { ToolRoute } from '../../utils/routes';
import { UiLang } from '../../utils/siteI18n';
import { TOOL_SEO_CONTENT } from '../../utils/toolSeoContent';
import { AdSlot } from '../AdSlot';

interface ToolSeoSectionProps {
  route: ToolRoute;
  uiLang: UiLang;
  isPro: boolean;
  onOpenProModal: () => void;
}

export const ToolSeoSection: React.FC<ToolSeoSectionProps> = ({
  route,
  uiLang,
  isPro,
  onOpenProModal,
}) => {
  const seoBlock = TOOL_SEO_CONTENT[route]?.[uiLang] || TOOL_SEO_CONTENT[route]?.en;
  if (!seoBlock) return null;

  return (
    <div lang={uiLang} dir="ltr" className="space-y-6 mt-6">
      {/* AdSense Slot (Automatically hidden for Pro users) */}
      <AdSlot
        slotId={`sadhanbox-${route.replace('/', '')}`}
        isPro={isPro}
        uiLang={uiLang}
        onOpenProModal={onOpenProModal}
      />

      {/* How to Use + 5 FAQs */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-bold text-slate-900">{seoBlock.howToTitle}</h2>
          <ol className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed list-decimal list-inside">
            {seoBlock.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
            <h2 className="text-base font-bold text-slate-900">{seoBlock.faqTitle}</h2>
          </div>

          <div className="space-y-2">
            {seoBlock.faqs.map((item, idx) => (
              <details
                key={idx}
                open={idx === 0}
                className="group bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
              >
                <summary className="flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-slate-800 cursor-pointer list-none">
                  <span>{item.q}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
