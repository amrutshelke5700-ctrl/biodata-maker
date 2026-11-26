import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { ToolRoute } from '../../utils/routes';
import { UiLang, getSiteStrings } from '../../utils/siteI18n';
import { ToolSeoSection } from './ToolSeoSection';

interface ToolShellProps {
  route: ToolRoute;
  title: string;
  subtitle: string;
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
  children: React.ReactNode;
}

export const ToolShell: React.FC<ToolShellProps> = ({
  route,
  title,
  subtitle,
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
  children,
}) => {
  const s = getSiteStrings(uiLang);

  return (
    <div lang={uiLang} dir="ltr" className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>{s.backToHome}</span>
        </button>

        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#16A34A]">
          <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" aria-hidden="true" />
          <span>{s.privacyBadge}</span>
        </div>
      </div>

      <section className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-5 sm:p-6">
        <div className="pb-4 border-b border-slate-100">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E40AF] text-balance">{title}</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">{subtitle}</p>
        </div>

        <div className="mt-5">{children}</div>
      </section>

      <ToolSeoSection
        route={route}
        uiLang={uiLang}
        isPro={isPro}
        onOpenProModal={onOpenProModal}
      />
    </div>
  );
};
