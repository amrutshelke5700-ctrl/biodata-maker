import React, { useMemo, useState } from 'react';
import { Cake, Calendar, Clock, Sparkles } from 'lucide-react';
import { ToolShell } from './ToolShell';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang, getSiteStrings } from '../../utils/siteI18n';

interface AgeCalculatorToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
}

function toInputDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseLocalDate(str: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  const [y, m, d] = str.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
    return null;
  }
  return dt;
}

function daysInMonth(year: number, monthIndexZeroBased: number): number {
  return new Date(year, monthIndexZeroBased + 1, 0).getDate();
}

function calculateCalendarDiff(start: Date, end: Date) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthYear = end.getMonth() === 0 ? end.getFullYear() - 1 : end.getFullYear();
    const prevMonthIdx = end.getMonth() === 0 ? 11 : end.getMonth() - 1;
    days += daysInMonth(prevMonthYear, prevMonthIdx);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

function getNextBirthdayDate(dob: Date, refDate: Date): Date {
  const birthMonth = dob.getMonth();
  const birthDay = dob.getDate();

  const makeForYear = (yr: number) => {
    const maxDay = daysInMonth(yr, birthMonth);
    return new Date(yr, birthMonth, Math.min(birthDay, maxDay));
  };

  let candidate = makeForYear(refDate.getFullYear());
  if (candidate.getTime() < refDate.getTime()) {
    candidate = makeForYear(refDate.getFullYear() + 1);
  }
  return candidate;
}

export const AgeCalculatorTool: React.FC<AgeCalculatorToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
}) => {
  const s = getSiteStrings(uiLang);
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/age-calculator')!;
  const todayStr = useMemo(() => toInputDateString(new Date()), []);
  const [dobStr, setDobStr] = useState('1998-05-15');
  const [asOfStr, setAsOfStr] = useState(todayStr);

  const calculation = useMemo(() => {
    const dob = parseLocalDate(dobStr);
    const asOf = parseLocalDate(asOfStr);
    if (!dob || !asOf) {
      return { error: s.ageInvalidError };
    }
    if (dob.getTime() > asOf.getTime()) {
      return { error: s.ageDobAfterError };
    }

    const exact = calculateCalendarDiff(dob, asOf);
    const msPerDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.round((asOf.getTime() - dob.getTime()) / msPerDay);
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDaysAfterWeeks = totalDays % 7;
    const totalMonths = exact.years * 12 + exact.months;
    const totalHours = totalDays * 24;

    const nextBday = getNextBirthdayDate(dob, asOf);
    const nextBdayDiff = calculateCalendarDiff(asOf, nextBday);
    const daysUntilNextBday = Math.round((nextBday.getTime() - asOf.getTime()) / msPerDay);
    const nextBdayWeekday = s.ageWeekdays[nextBday.getDay()];
    const birthWeekday = s.ageWeekdays[dob.getDay()];

    return {
      error: '',
      exact,
      totalDays,
      totalWeeks,
      remainingDaysAfterWeeks,
      totalMonths,
      totalHours,
      nextBdayDiff,
      daysUntilNextBday,
      nextBdayWeekday,
      birthWeekday,
      isBirthdayToday: daysUntilNextBday === 0,
      upcomingAge: nextBday.getFullYear() - dob.getFullYear(),
    };
  }, [dobStr, asOfStr, s]);

  return (
    <ToolShell
      route="/age-calculator"
      title={toolMeta.title[uiLang]}
      subtitle={toolMeta.shortDesc[uiLang]}
      uiLang={uiLang}
      isPro={isPro}
      onBackHome={onBackHome}
      onOpenProModal={onOpenProModal}
    >
      {/* Date Inputs */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="age-dob-input" className="block text-xs font-bold text-slate-700">
            {s.ageDobLabel}
          </label>
          <input
            id="age-dob-input"
            type="date"
            value={dobStr}
            max={asOfStr}
            onChange={(e) => setDobStr(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 tabular-nums"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="age-asof-input" className="block text-xs font-bold text-slate-700">
              {s.ageAsOfLabel}
            </label>
            <button
              type="button"
              onClick={() => setAsOfStr(todayStr)}
              className="text-[11px] font-semibold text-indigo-700 hover:underline cursor-pointer"
            >
              {s.ageUseTodayBtn}
            </button>
          </div>
          <input
            id="age-asof-input"
            type="date"
            value={asOfStr}
            onChange={(e) => setAsOfStr(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 tabular-nums"
          />
        </div>
      </div>

      {calculation.error ? (
        <div className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm font-medium text-rose-700">
          {calculation.error}
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {/* Primary Exact Age & Next Birthday Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-7 bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-800">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {s.ageExactTitle}
                </span>
                <span>
                  {s.ageBornWeekdayPrefix} {calculation.birthWeekday}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                    {calculation.exact!.years}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.ageYearsLabel}</div>
                </div>
                <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                    {calculation.exact!.months}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.ageMonthsLabel}</div>
                </div>
                <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                    {calculation.exact!.days}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.ageDaysLabel}</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 bg-amber-50/70 border border-amber-200 rounded-2xl p-5 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="inline-flex items-center gap-1.5">
                  <Cake className="w-4 h-4" />
                  {s.ageNextBdayTitle}
                </span>
                <span>{calculation.nextBdayWeekday}</span>
              </div>

              {calculation.isBirthdayToday ? (
                <div className="bg-white border border-amber-200 rounded-xl p-3.5 flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-sm font-bold text-amber-900">{s.ageTodayBdayMsg}</p>
                </div>
              ) : (
                <div className="bg-white border border-amber-100 rounded-xl p-3.5 space-y-1">
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
                    {(calculation.daysUntilNextBday ?? 0).toLocaleString('en-IN')} {s.ageDaysLeftSuffix}
                  </div>
                  <p className="text-xs text-slate-600 tabular-nums">
                    {s.ageNextBdayDetailPrefix} {calculation.nextBdayDiff!.months} {s.ageMonthsUnit},{' '}
                    {calculation.nextBdayDiff!.days} {s.ageDaysUnit} · {s.ageNextBdayTurning}{' '}
                    {calculation.upcomingAge}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Summary Breakdown */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2 text-xs font-bold text-slate-800">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{s.ageSummaryTitle}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <div className="p-4">
                <div className="text-xs text-slate-500">{s.ageTotalMonthsLabel}</div>
                <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">
                  {calculation.totalMonths!.toLocaleString('en-IN')} {s.ageMonthsUnit},{' '}
                  {calculation.exact!.days} {s.ageDaysUnit}
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-slate-500">{s.ageTotalWeeksLabel}</div>
                <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">
                  {calculation.totalWeeks!.toLocaleString('en-IN')} {s.ageWeeksUnit},{' '}
                  {calculation.remainingDaysAfterWeeks} {s.ageDaysUnit}
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-slate-500">{s.ageTotalDaysLabel}</div>
                <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">
                  {calculation.totalDays!.toLocaleString('en-IN')} {s.ageDaysUnit}
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-slate-500">{s.ageTotalHoursLabel}</div>
                <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">
                  {calculation.totalHours!.toLocaleString('en-IN')} {s.ageHoursUnit}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolShell>
  );
};
