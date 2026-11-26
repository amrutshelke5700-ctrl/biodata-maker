import React, { useMemo, useState } from 'react';
import {
  Calculator,
  Car,
  Check,
  Copy,
  Home,
  Percent,
  Wallet,
} from 'lucide-react';
import { ToolShell } from './ToolShell';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang, getSiteStrings } from '../../utils/siteI18n';

interface GstEmiCalculatorToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
}

type CalcTab = 'gst' | 'emi';
type GstMode = 'exclusive' | 'inclusive';
type SupplyType = 'intra' | 'inter';
type TenureUnit = 'years' | 'months';
type LoanPreset = 'home' | 'vehicle' | 'personal';

const GST_SLABS = [3, 5, 12, 18, 28];

function formatMoneyInr(value: number): string {
  return `₹ ${value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatMoneyRound(value: number): string {
  return `₹ ${Math.round(value).toLocaleString('en-IN')}`;
}

export const GstEmiCalculatorTool: React.FC<GstEmiCalculatorToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
}) => {
  const s = getSiteStrings(uiLang);
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/gst-emi-calculator')!;

  const [activeTab, setActiveTab] = useState<CalcTab>('gst');

  // GST Calculator State
  const [gstAmountInput, setGstAmountInput] = useState<string>('10000');
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstCustomRate, setGstCustomRate] = useState<string>('18');
  const [gstMode, setGstMode] = useState<GstMode>('exclusive');
  const [supplyType, setSupplyType] = useState<SupplyType>('intra');
  const [copiedGst, setCopiedGst] = useState(false);

  // EMI Calculator State
  const [loanPreset, setLoanPreset] = useState<LoanPreset>('home');
  const [loanAmount, setLoanAmount] = useState<number>(2500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureVal, setTenureVal] = useState<number>(20);
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>('years');

  const gstResult = useMemo(() => {
    const rawAmount = Math.max(0, Number(gstAmountInput) || 0);
    const rate = Math.max(0, Math.min(100, Number(gstCustomRate) || gstRate));

    if (gstMode === 'exclusive') {
      const base = rawAmount;
      const tax = (base * rate) / 100;
      const total = base + tax;
      return {
        rate,
        base,
        tax,
        cgst: tax / 2,
        sgst: tax / 2,
        igst: tax,
        total,
      };
    }

    const total = rawAmount;
    const base = total / (1 + rate / 100);
    const tax = total - base;
    return {
      rate,
      base,
      tax,
      cgst: tax / 2,
      sgst: tax / 2,
      igst: tax,
      total,
    };
  }, [gstAmountInput, gstCustomRate, gstRate, gstMode]);

  const gstTaxSharePct =
    gstResult.total > 0 ? Math.min(100, (gstResult.tax / gstResult.total) * 100) : 0;

  const handleSelectGstSlab = (slab: number) => {
    setGstRate(slab);
    setGstCustomRate(String(slab));
  };

  const handleCopyGstSummary = async () => {
    const lines = [
      `${s.gstBaseAmountLabel}: ${formatMoneyInr(gstResult.base)}`,
      supplyType === 'intra'
        ? `${s.gstCgstLabel} (${(gstResult.rate / 2).toFixed(2)}%): ${formatMoneyInr(gstResult.cgst)} | ${s.gstSgstLabel} (${(gstResult.rate / 2).toFixed(2)}%): ${formatMoneyInr(gstResult.sgst)}`
        : `${s.gstIgstLabel} (${gstResult.rate}%): ${formatMoneyInr(gstResult.igst)}`,
      `${s.gstTaxAmountLabel}: ${formatMoneyInr(gstResult.tax)}`,
      `${s.gstTotalAmountLabel}: ${formatMoneyInr(gstResult.total)}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(lines);
      setCopiedGst(true);
      window.setTimeout(() => setCopiedGst(false), 1800);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  const applyLoanPreset = (preset: LoanPreset) => {
    setLoanPreset(preset);
    setTenureUnit('years');
    if (preset === 'home') {
      setLoanAmount(2500000);
      setInterestRate(8.5);
      setTenureVal(20);
    } else if (preset === 'vehicle') {
      setLoanAmount(800000);
      setInterestRate(9.2);
      setTenureVal(5);
    } else {
      setLoanAmount(300000);
      setInterestRate(11.5);
      setTenureVal(3);
    }
  };

  const emiResult = useMemo(() => {
    const principal = Math.max(0, loanAmount || 0);
    const annualRate = Math.max(0, interestRate || 0);
    const totalMonths = Math.max(
      1,
      Math.round(tenureUnit === 'years' ? tenureVal * 12 : tenureVal)
    );

    const monthlyRate = annualRate / 12 / 100;
    let monthlyEmi = 0;

    if (monthlyRate === 0) {
      monthlyEmi = principal / totalMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      monthlyEmi = (principal * monthlyRate * factor) / (factor - 1);
    }

    const totalPayable = monthlyEmi * totalMonths;
    const totalInterest = Math.max(0, totalPayable - principal);

    // Year-by-year schedule
    const yearlyRows: {
      year: number;
      principalPaid: number;
      interestPaid: number;
      closingBalance: number;
    }[] = [];

    let balance = principal;
    let yearPrincipal = 0;
    let yearInterest = 0;

    for (let m = 1; m <= totalMonths; m++) {
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = Math.min(balance, monthlyEmi - interestForMonth);
      balance = Math.max(0, balance - principalForMonth);
      yearPrincipal += principalForMonth;
      yearInterest += interestForMonth;

      if (m % 12 === 0 || m === totalMonths) {
        yearlyRows.push({
          year: Math.ceil(m / 12),
          principalPaid: yearPrincipal,
          interestPaid: yearInterest,
          closingBalance: balance,
        });
        yearPrincipal = 0;
        yearInterest = 0;
      }
    }

    return {
      principal,
      totalMonths,
      monthlyEmi,
      totalInterest,
      totalPayable,
      yearlyRows,
    };
  }, [loanAmount, interestRate, tenureVal, tenureUnit]);

  const emiPrincipalPct =
    emiResult.totalPayable > 0
      ? Math.min(100, (emiResult.principal / emiResult.totalPayable) * 100)
      : 100;

  return (
    <ToolShell
      route="/gst-emi-calculator"
      title={toolMeta.title[uiLang]}
      subtitle={toolMeta.shortDesc[uiLang]}
      uiLang={uiLang}
      isPro={isPro}
      onBackHome={onBackHome}
      onOpenProModal={onOpenProModal}
    >
      <div className="space-y-6">
        {/* Top Two-Tab Bar */}
        <div
          role="tablist"
          className="inline-flex p-1 bg-slate-100 border border-[#E2E8F0] rounded-xl w-full sm:w-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'gst'}
            onClick={() => setActiveTab('gst')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'gst'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'text-slate-700 hover:text-[#1E40AF]'
            }`}
          >
            <Percent className="w-4 h-4 shrink-0" />
            <span>{s.finTabGst}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'emi'}
            onClick={() => setActiveTab('emi')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'emi'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'text-slate-700 hover:text-[#1E40AF]'
            }`}
          >
            <Calculator className="w-4 h-4 shrink-0" />
            <span>{s.finTabEmi}</span>
          </button>
        </div>

        {/* TAB 1: GST CALCULATOR */}
        {activeTab === 'gst' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* GST Controls */}
            <div className="lg:col-span-6 bg-slate-50 border border-[#E2E8F0] rounded-xl p-4 sm:p-5 space-y-5">
              <div>
                <label
                  htmlFor="gst-amount-input"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  {s.gstAmountLabel}
                </label>
                <input
                  id="gst-amount-input"
                  type="number"
                  min={0}
                  value={gstAmountInput}
                  onChange={(e) => setGstAmountInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-base font-extrabold bg-white border border-slate-300 rounded-xl text-[#0F172A] tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">{s.gstRateLabel}</div>
                <div className="flex flex-wrap items-center gap-2">
                  {GST_SLABS.map((slab) => {
                    const active = Number(gstCustomRate) === slab;
                    return (
                      <button
                        key={slab}
                        type="button"
                        onClick={() => handleSelectGstSlab(slab)}
                        className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl border tabular-nums transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                            : 'bg-white text-[#0F172A] border-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {slab}%
                      </button>
                    );
                  })}

                  <div className="inline-flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.5}
                      value={gstCustomRate}
                      aria-label={s.gstCustomRateLabel}
                      onChange={(e) => setGstCustomRate(e.target.value)}
                      className="w-16 px-2.5 py-2 text-xs sm:text-sm font-bold text-[#0F172A] focus:outline-none tabular-nums"
                    />
                    <span className="px-2.5 py-2 text-xs font-bold text-slate-500 bg-slate-100 border-l border-slate-200">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Calculation Type */}
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">{s.gstModeLabel}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGstMode('exclusive')}
                    className={`px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      gstMode === 'exclusive'
                        ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                        : 'bg-white text-[#0F172A] border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {s.gstExclusiveBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGstMode('inclusive')}
                    className={`px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      gstMode === 'inclusive'
                        ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                        : 'bg-white text-[#0F172A] border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {s.gstInclusiveBtn}
                  </button>
                </div>
              </div>

              {/* Tax Breakdown Type */}
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">
                  {s.gstSupplyTypeLabel}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSupplyType('intra')}
                    className={`px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      supplyType === 'intra'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-[#0F172A] border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {s.gstIntraBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSupplyType('inter')}
                    className={`px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      supplyType === 'inter'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-[#0F172A] border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {s.gstInterBtn}
                  </button>
                </div>
              </div>
            </div>

            {/* GST Results Panel */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">
                      {s.gstTotalAmountLabel}
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#1E40AF] tabular-nums mt-0.5">
                      {formatMoneyInr(gstResult.total)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleCopyGstSummary()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#0F172A] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    {copiedGst ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span>{s.gstCopiedBtn}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{s.gstCopyBtn}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Proportional Bar */}
                <div className="space-y-1.5">
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-[#1E40AF] transition-all duration-200"
                      style={{ width: `${Math.max(0, 100 - gstTaxSharePct)}%` }}
                    />
                    <div
                      className="h-full bg-[#F59E0B] transition-all duration-200"
                      style={{ width: `${gstTaxSharePct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 tabular-nums">
                    <span>
                      {s.gstBaseAmountLabel}: {(100 - gstTaxSharePct).toFixed(1)}%
                    </span>
                    <span>
                      GST: {gstTaxSharePct.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Detailed Breakdown Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-3.5">
                    <div className="text-xs font-semibold text-slate-500">
                      {s.gstBaseAmountLabel}
                    </div>
                    <div className="text-lg font-extrabold text-[#0F172A] tabular-nums mt-1">
                      {formatMoneyInr(gstResult.base)}
                    </div>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5">
                    <div className="text-xs font-semibold text-amber-800">
                      {s.gstTaxAmountLabel} ({gstResult.rate}%)
                    </div>
                    <div className="text-lg font-extrabold text-[#D97706] tabular-nums mt-1">
                      {formatMoneyInr(gstResult.tax)}
                    </div>
                  </div>

                  {supplyType === 'intra' ? (
                    <>
                      <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3.5">
                        <div className="text-xs font-semibold text-blue-800">
                          {s.gstCgstLabel} ({(gstResult.rate / 2).toFixed(2).replace(/\.00$/, '')}%)
                        </div>
                        <div className="text-base font-bold text-[#1E40AF] tabular-nums mt-1">
                          {formatMoneyInr(gstResult.cgst)}
                        </div>
                      </div>

                      <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3.5">
                        <div className="text-xs font-semibold text-blue-800">
                          {s.gstSgstLabel} ({(gstResult.rate / 2).toFixed(2).replace(/\.00$/, '')}%)
                        </div>
                        <div className="text-base font-bold text-[#1E40AF] tabular-nums mt-1">
                          {formatMoneyInr(gstResult.sgst)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="sm:col-span-2 bg-blue-50/60 border border-blue-200 rounded-xl p-3.5">
                      <div className="text-xs font-semibold text-blue-800">
                        {s.gstIgstLabel} ({gstResult.rate}%)
                      </div>
                      <div className="text-base font-bold text-[#1E40AF] tabular-nums mt-1">
                        {formatMoneyInr(gstResult.igst)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LOAN EMI CALCULATOR */}
        {activeTab === 'emi' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* EMI Inputs */}
              <div className="lg:col-span-6 bg-slate-50 border border-[#E2E8F0] rounded-xl p-4 sm:p-5 space-y-5">
                {/* Quick Loan Presets */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyLoanPreset('home')}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      loanPreset === 'home'
                        ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                        : 'bg-white text-[#0F172A] border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>{s.emiPresetHome}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyLoanPreset('vehicle')}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      loanPreset === 'vehicle'
                        ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                        : 'bg-white text-[#0F172A] border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>{s.emiPresetVehicle}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyLoanPreset('personal')}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      loanPreset === 'personal'
                        ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                        : 'bg-white text-[#0F172A] border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>{s.emiPresetPersonal}</span>
                  </button>
                </div>

                {/* Loan Amount */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="emi-loan-amount"
                      className="text-xs font-bold text-slate-700"
                    >
                      {s.emiLoanAmountLabel}
                    </label>
                    <input
                      id="emi-loan-amount"
                      type="number"
                      min={10000}
                      max={100000000}
                      step={10000}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                      className="w-36 px-3 py-1.5 text-xs sm:text-sm font-extrabold text-right bg-white border border-slate-300 rounded-lg text-[#0F172A] tabular-nums"
                    />
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={15000000}
                    step={50000}
                    value={Math.min(15000000, loanAmount)}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-[#1E40AF] cursor-pointer"
                  />
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="emi-interest-rate"
                      className="text-xs font-bold text-slate-700"
                    >
                      {s.emiInterestRateLabel}
                    </label>
                    <input
                      id="emi-interest-rate"
                      type="number"
                      min={1}
                      max={36}
                      step={0.1}
                      value={interestRate}
                      onChange={(e) =>
                        setInterestRate(Math.max(0, Math.min(40, Number(e.target.value))))
                      }
                      className="w-24 px-3 py-1.5 text-xs sm:text-sm font-extrabold text-right bg-white border border-slate-300 rounded-lg text-[#0F172A] tabular-nums"
                    />
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={24}
                    step={0.1}
                    value={Math.min(24, Math.max(4, interestRate))}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-[#1E40AF] cursor-pointer"
                  />
                </div>

                {/* Loan Tenure */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <label htmlFor="emi-tenure" className="text-xs font-bold text-slate-700">
                      {s.emiTenureLabel}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="emi-tenure"
                        type="number"
                        min={1}
                        max={tenureUnit === 'years' ? 40 : 480}
                        value={tenureVal}
                        onChange={(e) => setTenureVal(Math.max(1, Number(e.target.value)))}
                        className="w-20 px-2.5 py-1.5 text-xs sm:text-sm font-extrabold text-right bg-white border border-slate-300 rounded-lg text-[#0F172A] tabular-nums"
                      />
                      <div className="inline-flex bg-white border border-slate-300 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (tenureUnit === 'months') {
                              setTenureUnit('years');
                              setTenureVal(Math.max(1, Math.round(tenureVal / 12)));
                            }
                          }}
                          className={`px-2.5 py-1 text-xs font-bold rounded-md cursor-pointer ${
                            tenureUnit === 'years'
                              ? 'bg-[#1E40AF] text-white'
                              : 'text-slate-600'
                          }`}
                        >
                          {s.emiYearsUnit}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (tenureUnit === 'years') {
                              setTenureUnit('months');
                              setTenureVal(Math.max(1, Math.round(tenureVal * 12)));
                            }
                          }}
                          className={`px-2.5 py-1 text-xs font-bold rounded-md cursor-pointer ${
                            tenureUnit === 'months'
                              ? 'bg-[#1E40AF] text-white'
                              : 'text-slate-600'
                          }`}
                        >
                          {s.emiMonthsUnit}
                        </button>
                      </div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={tenureUnit === 'years' ? 30 : 360}
                    step={1}
                    value={Math.min(tenureUnit === 'years' ? 30 : 360, tenureVal)}
                    onChange={(e) => setTenureVal(Number(e.target.value))}
                    className="w-full accent-[#1E40AF] cursor-pointer"
                  />
                </div>
              </div>

              {/* EMI Result Card */}
              <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-5">
                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-center">
                  <div className="text-xs font-bold text-[#2563EB]">{s.emiMonthlyTitle}</div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#1E40AF] tabular-nums mt-1">
                    {formatMoneyRound(emiResult.monthlyEmi)}
                  </div>
                </div>

                {/* Principal vs Interest Ratio Bar */}
                <div className="space-y-1.5">
                  <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-[#16A34A] transition-all duration-200"
                      style={{ width: `${emiPrincipalPct}%` }}
                    />
                    <div
                      className="h-full bg-[#F59E0B] transition-all duration-200"
                      style={{ width: `${Math.max(0, 100 - emiPrincipalPct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 tabular-nums">
                    <span className="text-[#16A34A]">
                      {s.emiPrincipalLabel}: {emiPrincipalPct.toFixed(1)}%
                    </span>
                    <span className="text-[#D97706]">
                      {s.emiTotalInterestLabel}: {(100 - emiPrincipalPct).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-3.5">
                    <div className="text-[11px] font-semibold text-slate-500">
                      {s.emiPrincipalLabel}
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-[#0F172A] tabular-nums mt-1">
                      {formatMoneyRound(emiResult.principal)}
                    </div>
                  </div>
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5">
                    <div className="text-[11px] font-semibold text-amber-800">
                      {s.emiTotalInterestLabel}
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-[#D97706] tabular-nums mt-1">
                      {formatMoneyRound(emiResult.totalInterest)}
                    </div>
                  </div>
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5">
                    <div className="text-[11px] font-semibold text-emerald-800">
                      {s.emiTotalPayableLabel}
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-[#16A34A] tabular-nums mt-1">
                      {formatMoneyRound(emiResult.totalPayable)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Year-by-Year Amortization Table */}
            {emiResult.yearlyRows.length > 0 && (
              <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E2E8F0] bg-slate-50 text-xs sm:text-sm font-bold text-[#0F172A]">
                  {s.emiScheduleTitle}
                </div>
                <div className="overflow-x-auto max-h-80 overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 sticky top-0 border-b border-[#E2E8F0] text-slate-600 font-bold">
                      <tr>
                        <th className="px-4 py-2.5">{s.emiYearCol}</th>
                        <th className="px-4 py-2.5">{s.emiPrincipalCol}</th>
                        <th className="px-4 py-2.5">{s.emiInterestCol}</th>
                        <th className="px-4 py-2.5">{s.emiBalanceCol}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 tabular-nums">
                      {emiResult.yearlyRows.map((row) => (
                        <tr key={row.year} className="hover:bg-slate-50/80">
                          <td className="px-4 py-2 font-bold text-[#0F172A]">{row.year}</td>
                          <td className="px-4 py-2 text-[#16A34A] font-semibold">
                            {formatMoneyRound(row.principalPaid)}
                          </td>
                          <td className="px-4 py-2 text-[#D97706] font-semibold">
                            {formatMoneyRound(row.interestPaid)}
                          </td>
                          <td className="px-4 py-2 text-slate-700 font-semibold">
                            {formatMoneyRound(row.closingBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
};
