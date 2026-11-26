import React from 'react';
import { Crown } from 'lucide-react';
import { UiLang, getSiteStrings } from '../utils/siteI18n';

interface AdSlotProps {
  slotId: string;
  isPro: boolean;
  uiLang: UiLang;
  onOpenProModal: () => void;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId,
  isPro,
  uiLang,
  onOpenProModal,
  className = '',
}) => {
  // Automatically hide all ads for Pro Pass users
  if (isPro) return null;

  const s = getSiteStrings(uiLang);

  return (
    <aside
      aria-label={s.adLabel}
      data-ad-slot={slotId}
      className={`w-full bg-slate-50 border border-dashed border-slate-300 rounded-xl px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left ${className}`}
    >
      <div className="space-y-0.5 min-w-0">
        <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
          {s.adLabel}
        </div>
        <p className="text-xs font-medium text-slate-500">{s.adPlaceholderTitle}</p>
      </div>
      <button
        type="button"
        onClick={onOpenProModal}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200/80 border border-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Crown className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        <span>{s.adRemoveAdsLink}</span>
      </button>
    </aside>
  );
};
