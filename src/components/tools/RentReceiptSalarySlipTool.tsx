import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Download,
  Loader2,
  ReceiptText,
  RotateCcw,
  Wallet,
} from 'lucide-react';
import { ToolShell } from './ToolShell';
import { WhatsAppShareBar } from './WhatsAppShareBar';
import { pushDataLayerEvent } from '../../utils/gtm';
import { exportA4Pdf } from '../../utils/pdfExport';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang, getSiteStrings } from '../../utils/siteI18n';

interface RentReceiptSalarySlipToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
  onToolDownload: () => void;
}

type DocTab = 'rent' | 'salary';
type ReceiptCount = 1 | 2 | 3;

interface RentData {
  tenantName: string;
  landlordName: string;
  landlordPan: string;
  monthlyRent: string;
  address: string;
  startMonth: string; // YYYY-MM
  receiptCount: ReceiptCount;
  paymentMode: string;
  startReceiptNo: string;
  includeRevenueStamp: boolean;
}

interface SalaryData {
  companyName: string;
  companyAddress: string;
  salaryMonth: string; // YYYY-MM
  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
  panUan: string;
  paidDays: string;
  basic: string;
  hra: string;
  allowance: string;
  bonus: string;
  pf: string;
  pt: string;
  tds: string;
  otherDed: string;
}

const DEFAULT_RENT_DATA: RentData = {
  tenantName: 'Rohan Deshmukh',
  landlordName: 'Suresh Kulkarni',
  landlordPan: 'ABCDE1234F',
  monthlyRent: '15000',
  address: 'Flat 302, Shanti Residency, Kothrud, Pune - 411038',
  startMonth: new Date().toISOString().slice(0, 7),
  receiptCount: 3,
  paymentMode: 'UPI / Bank Transfer',
  startReceiptNo: '101',
  includeRevenueStamp: true,
};

const DEFAULT_SALARY_DATA: SalaryData = {
  companyName: 'Sahyadri Tech Solutions Pvt. Ltd.',
  companyAddress: 'Plot 14, Rajiv Gandhi Infotech Park, Hinjawadi, Pune - 411057',
  salaryMonth: new Date().toISOString().slice(0, 7),
  employeeName: 'Sneha Joshi',
  employeeId: 'EMP-2048',
  designation: 'Senior Software Executive',
  department: 'Engineering',
  panUan: 'FGHIJ5678K / 100987654321',
  paidDays: '30 / 30',
  basic: '30000',
  hra: '12000',
  allowance: '8000',
  bonus: '2000',
  pf: '1800',
  pt: '200',
  tds: '1500',
  otherDed: '0',
};

const ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const TENS = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

function twoDigitWords(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES[n];
  return `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ''}`;
}

function numberToIndianWords(raw: number): string {
  const n = Math.max(0, Math.round(raw));
  if (n === 0) return 'Rupees Zero Only';

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = Math.floor((n % 1000) / 100);
  const rem = n % 100;

  const parts: string[] = [];
  if (crore > 0) parts.push(`${twoDigitWords(crore % 100)} Crore`);
  if (lakh > 0) parts.push(`${twoDigitWords(lakh)} Lakh`);
  if (thousand > 0) parts.push(`${twoDigitWords(thousand)} Thousand`);
  if (hundred > 0) parts.push(`${ONES[hundred]} Hundred`);
  if (rem > 0) parts.push(twoDigitWords(rem));

  return `Rupees ${parts.join(' ')} Only`;
}

function formatInr(val: number): string {
  return `₹ ${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function getMonthPeriodInfo(baseYm: string, offsetMonths: number): {
  label: string;
  startStr: string;
  endStr: string;
  receiptDateStr: string;
} {
  const match = baseYm.match(/^(\d{4})-(\d{2})$/);
  const baseYear = match ? Number(match[1]) : new Date().getFullYear();
  const baseMonthIdx = match ? Number(match[2]) - 1 : new Date().getMonth();

  const totalMonths = baseYear * 12 + baseMonthIdx + offsetMonths;
  const year = Math.floor(totalMonths / 12);
  const monthIdx = ((totalMonths % 12) + 12) % 12;
  const lastDay = new Date(year, monthIdx + 1, 0).getDate();

  const mon = MONTH_SHORT[monthIdx];
  return {
    label: `${mon} ${year}`,
    startStr: `01 ${mon} ${year}`,
    endStr: `${String(lastDay).padStart(2, '0')} ${mon} ${year}`,
    receiptDateStr: `${String(lastDay).padStart(2, '0')} ${mon} ${year}`,
  };
}

interface RentSheetProps {
  data: RentData;
  uiLang: UiLang;
}

const RentReceiptA4Sheet: React.FC<RentSheetProps> = ({ data, uiLang }) => {
  const rentAmount = Math.max(0, Number(data.monthlyRent) || 0);
  const amountWords = numberToIndianWords(rentAmount);
  const baseNum = parseInt(data.startReceiptNo, 10);
  const receipts = Array.from({ length: data.receiptCount }, (_, i) => {
    const period = getMonthPeriodInfo(data.startMonth, i);
    const receiptNo = Number.isFinite(baseNum) ? `#${baseNum + i}` : `${data.startReceiptNo || 'RR'}-${i + 1}`;
    return { period, receiptNo };
  });

  const headingText =
    uiLang === 'mr'
      ? 'घरभाडे पावती / RENT RECEIPT'
      : uiLang === 'hi'
        ? 'किराया रसीद / RENT RECEIPT'
        : 'RENT RECEIPT (HRA)';

  const subNote =
    uiLang === 'mr'
      ? '(आयकर कलम 10(13A) अंतर्गत HRA सूटसाठी वैध पावती)'
      : uiLang === 'hi'
        ? '(आयकर धारा 10(13A) के अंतर्गत HRA क्लेम हेतु वैध रसीद)'
        : '(Valid under Section 10(13A) of the Income Tax Act for HRA Exemption)';

  return (
    <div
      className="a4-paper-root"
      style={{
        width: '794px',
        height: '1122px',
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
        padding: '32px 36px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: data.receiptCount === 1 ? 'flex-start' : 'space-between',
        gap: '18px',
        fontFamily: "'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif",
      }}
    >
      {receipts.map((item, idx) => (
        <div
          key={idx}
          style={{
            border: '1.5px solid #1E40AF',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            padding: '20px 24px',
            boxSizing: 'border-box',
            flex: data.receiptCount === 3 ? '1 1 0' : '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid #CBD5E1',
              paddingBottom: '10px',
              marginBottom: '12px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#1E40AF',
                  letterSpacing: '0.3px',
                }}
              >
                {headingText}
              </div>
              <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{subNote}</div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '12px', lineHeight: 1.5 }}>
              <div>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Receipt No: </span>
                <strong style={{ color: '#0F172A' }}>{item.receiptNo}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Date: </span>
                <strong style={{ color: '#0F172A' }}>{item.period.receiptDateStr}</strong>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div style={{ fontSize: '13.5px', lineHeight: 1.65, color: '#1E293B' }}>
            <div>
              Received with thanks from{' '}
              <strong style={{ color: '#0F172A', textDecoration: 'underline' }}>
                {data.tenantName || '________________'}
              </strong>{' '}
              a sum of{' '}
              <strong style={{ color: '#1E40AF', fontSize: '14.5px' }}>
                {formatInr(rentAmount)}
              </strong>{' '}
              (<em>{amountWords}</em>) towards house rent for the period from{' '}
              <strong>{item.period.startStr}</strong> to <strong>{item.period.endStr}</strong> via{' '}
              <strong>{data.paymentMode || 'Bank Transfer'}</strong>.
            </div>

            <div
              style={{
                marginTop: '10px',
                padding: '8px 12px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                fontSize: '12.5px',
              }}
            >
              <strong style={{ color: '#334155' }}>Rented Property Address: </strong>
              <span>{data.address || '________________________________________________'}</span>
            </div>
          </div>

          {/* Footer / Landlord & Stamp Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '16px',
              paddingTop: '10px',
              borderTop: '1px dashed #CBD5E1',
            }}
          >
            <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
              <div>
                <span style={{ color: '#64748B' }}>Landlord Name: </span>
                <strong style={{ color: '#0F172A' }}>
                  {data.landlordName || '________________'}
                </strong>
              </div>
              {data.landlordPan.trim() && (
                <div>
                  <span style={{ color: '#64748B' }}>Landlord PAN: </span>
                  <strong style={{ color: '#0F172A', letterSpacing: '0.5px' }}>
                    {data.landlordPan.trim().toUpperCase()}
                  </strong>
                </div>
              )}
              <div
                style={{
                  marginTop: '4px',
                  display: 'inline-block',
                  padding: '3px 10px',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '4px',
                  fontWeight: 700,
                  color: '#1E40AF',
                  fontSize: '13px',
                }}
              >
                Amount: {formatInr(rentAmount)}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
              {data.includeRevenueStamp && (
                <div
                  style={{
                    width: '66px',
                    height: '66px',
                    border: '1px dashed #64748B',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontSize: '9.5px',
                    color: '#64748B',
                    padding: '4px',
                    boxSizing: 'border-box',
                    backgroundColor: '#F8FAFC',
                  }}
                >
                  Affix ₹1 Revenue Stamp
                </div>
              )}
              <div style={{ textAlign: 'center', minWidth: '145px' }}>
                <div
                  style={{
                    height: '38px',
                    borderBottom: '1px solid #334155',
                    marginBottom: '4px',
                  }}
                />
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                  Signature of Landlord
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface SalarySheetProps {
  data: SalaryData;
}

const SalarySlipA4Sheet: React.FC<SalarySheetProps> = ({ data }) => {
  const basic = Math.max(0, Number(data.basic) || 0);
  const hra = Math.max(0, Number(data.hra) || 0);
  const allowance = Math.max(0, Number(data.allowance) || 0);
  const bonus = Math.max(0, Number(data.bonus) || 0);

  const pf = Math.max(0, Number(data.pf) || 0);
  const pt = Math.max(0, Number(data.pt) || 0);
  const tds = Math.max(0, Number(data.tds) || 0);
  const otherDed = Math.max(0, Number(data.otherDed) || 0);

  const gross = basic + hra + allowance + bonus;
  const totalDed = pf + pt + tds + otherDed;
  const netPay = Math.max(0, gross - totalDed);
  const monthLabel = getMonthPeriodInfo(data.salaryMonth, 0).label;

  return (
    <div
      className="a4-paper-root"
      style={{
        width: '794px',
        height: '1122px',
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
        padding: '44px 44px',
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {/* Company Header */}
        <div
          style={{
            borderBottom: '2.5px solid #1E40AF',
            paddingBottom: '16px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ maxWidth: '500px' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#1E40AF' }}>
              {data.companyName || 'Company Name'}
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px', lineHeight: 1.5 }}>
              {data.companyAddress}
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              padding: '8px 14px',
              textAlign: 'right',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', letterSpacing: '0.5px' }}>
              SALARY SLIP / PAYSLIP
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
              {monthLabel}
            </div>
          </div>
        </div>

        {/* Employee Information Grid */}
        <div
          style={{
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '22px',
          }}
        >
          <div
            style={{
              backgroundColor: '#F1F5F9',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#1E40AF',
              borderBottom: '1px solid #CBD5E1',
            }}
          >
            EMPLOYEE DETAILS
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              fontSize: '12.5px',
              lineHeight: 1.7,
              padding: '12px 16px',
              columnGap: '24px',
              rowGap: '6px',
            }}
          >
            <div>
              <span style={{ color: '#64748B' }}>Employee Name: </span>
              <strong>{data.employeeName || '-'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Employee ID: </span>
              <strong>{data.employeeId || '-'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Designation: </span>
              <strong>{data.designation || '-'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Department: </span>
              <strong>{data.department || '-'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>PAN / UAN: </span>
              <strong>{data.panUan || '-'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Paid Days: </span>
              <strong>{data.paidDays || '30 / 30'}</strong>
            </div>
          </div>
        </div>

        {/* Earnings & Deductions Table */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '22px',
          }}
        >
          {/* Earnings Column */}
          <div style={{ borderRight: '1px solid #CBD5E1' }}>
            <div
              style={{
                backgroundColor: '#1E40AF',
                color: '#FFFFFF',
                padding: '9px 14px',
                fontSize: '12.5px',
                fontWeight: 700,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>EARNINGS</span>
              <span>AMOUNT</span>
            </div>
            <div style={{ padding: '10px 14px', fontSize: '13px', lineHeight: 2.1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Basic Salary</span>
                <strong>{formatInr(basic)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>House Rent Allowance (HRA)</span>
                <strong>{formatInr(hra)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Conveyance & Special Allowance</span>
                <strong>{formatInr(allowance)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Bonus / Incentive</span>
                <strong>{formatInr(bonus)}</strong>
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderTop: '1px solid #CBD5E1',
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 800,
                display: 'flex',
                justifyContent: 'space-between',
                color: '#0F172A',
              }}
            >
              <span>Gross Earnings (A)</span>
              <span>{formatInr(gross)}</span>
            </div>
          </div>

          {/* Deductions Column */}
          <div>
            <div
              style={{
                backgroundColor: '#334155',
                color: '#FFFFFF',
                padding: '9px 14px',
                fontSize: '12.5px',
                fontWeight: 700,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>DEDUCTIONS</span>
              <span>AMOUNT</span>
            </div>
            <div style={{ padding: '10px 14px', fontSize: '13px', lineHeight: 2.1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Provident Fund (EPF)</span>
                <strong>{formatInr(pf)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Professional Tax (PT)</span>
                <strong>{formatInr(pt)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Income Tax (TDS)</span>
                <strong>{formatInr(tds)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Other Deductions</span>
                <strong>{formatInr(otherDed)}</strong>
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderTop: '1px solid #CBD5E1',
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 800,
                display: 'flex',
                justifyContent: 'space-between',
                color: '#0F172A',
              }}
            >
              <span>Total Deductions (B)</span>
              <span>{formatInr(totalDed)}</span>
            </div>
          </div>
        </div>

        {/* Net Payable Summary Box */}
        <div
          style={{
            backgroundColor: '#F0FDF4',
            border: '1.5px solid #16A34A',
            borderRadius: '10px',
            padding: '16px 20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#15803D' }}>
                NET PAYABLE SALARY (A - B)
              </div>
              <div style={{ fontSize: '12.5px', color: '#1E293B', marginTop: '4px' }}>
                <em>In Words: {numberToIndianWords(netPay)}</em>
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#16A34A' }}>
              {formatInr(netPay)}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Signature Note */}
      <div
        style={{
          borderTop: '1px solid #CBD5E1',
          paddingTop: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: '11px',
          color: '#64748B',
        }}
      >
        <div>
          This is a computer-generated payslip and does not require a physical signature.
        </div>
        <div style={{ textAlign: 'right', fontWeight: 700, color: '#334155' }}>
          Authorized Signatory ({data.companyName || 'Employer'})
        </div>
      </div>
    </div>
  );
};

export const RentReceiptSalarySlipTool: React.FC<RentReceiptSalarySlipToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
  onToolDownload,
}) => {
  const s = getSiteStrings(uiLang);
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/rent-receipt-generator')!;

  const [activeTab, setActiveTab] = useState<DocTab>('rent');
  const [rentData, setRentData] = useState<RentData>(DEFAULT_RENT_DATA);
  const [salaryData, setSalaryData] = useState<SalaryData>(DEFAULT_SALARY_DATA);

  const previewWrapRef = useRef<HTMLDivElement | null>(null);
  const captureRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState<number>(0.62);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [hasDownloaded, setHasDownloaded] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string>('');

  useEffect(() => {
    const el = previewWrapRef.current;
    if (!el) return;
    const updateScale = () => {
      const w = el.clientWidth;
      if (w > 0) setPreviewScale(Math.min(0.85, w / 794));
    };
    updateScale();
    const obs = new ResizeObserver(updateScale);
    obs.observe(el);
    window.addEventListener('resize', updateScale);
    return () => {
      obs.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [activeTab]);

  const grossSalary =
    (Number(salaryData.basic) || 0) +
    (Number(salaryData.hra) || 0) +
    (Number(salaryData.allowance) || 0) +
    (Number(salaryData.bonus) || 0);
  const totalDeductions =
    (Number(salaryData.pf) || 0) +
    (Number(salaryData.pt) || 0) +
    (Number(salaryData.tds) || 0) +
    (Number(salaryData.otherDed) || 0);
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  const handleDownloadPdf = async () => {
    if (!captureRef.current || isExporting) return;
    setExportError('');
    setIsExporting(true);
    try {
      const filename =
        activeTab === 'rent'
          ? `sadhanbox-rent-receipt-${rentData.startMonth}.pdf`
          : `sadhanbox-salary-slip-${salaryData.salaryMonth}.pdf`;
      await exportA4Pdf({
        element: captureRef.current,
        filename,
        language: uiLang,
      });
      pushDataLayerEvent('file_download', {
        document_type: activeTab === 'rent' ? 'rent_receipt_pdf' : 'salary_slip_pdf',
        file_extension: 'pdf',
      });
      onToolDownload();
      setHasDownloaded(true);
    } catch {
      setExportError(s.pdfImgFailed);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ToolShell
      route="/rent-receipt-generator"
      title={toolMeta.title[uiLang]}
      subtitle={toolMeta.shortDesc[uiLang]}
      uiLang={uiLang}
      isPro={isPro}
      onBackHome={onBackHome}
      onOpenProModal={onOpenProModal}
    >
      <div className="space-y-6">
        {/* Top Mode Tabs */}
        <div
          role="tablist"
          className="inline-flex p-1 bg-slate-100 border border-[#E2E8F0] rounded-xl w-full sm:w-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'rent'}
            onClick={() => setActiveTab('rent')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'rent'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'text-slate-700 hover:text-[#1E40AF]'
            }`}
          >
            <ReceiptText className="w-4 h-4 shrink-0" />
            <span>{s.rentTabReceipt}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'salary'}
            onClick={() => setActiveTab('salary')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'salary'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'text-slate-700 hover:text-[#1E40AF]'
            }`}
          >
            <Wallet className="w-4 h-4 shrink-0" />
            <span>{s.rentTabSalary}</span>
          </button>
        </div>

        {/* 2-Column Editor & Live A4 Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form Column */}
          <div className="lg:col-span-5 bg-slate-50 border border-[#E2E8F0] rounded-xl p-4 sm:p-5 space-y-4">
            {activeTab === 'rent' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {s.rentTenantNameLabel}
                    </label>
                    <input
                      type="text"
                      value={rentData.tenantName}
                      onChange={(e) =>
                        setRentData((p) => ({ ...p, tenantName: e.target.value }))
                      }
                      placeholder={s.rentTenantPlaceholder}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {s.rentLandlordNameLabel}
                    </label>
                    <input
                      type="text"
                      value={rentData.landlordName}
                      onChange={(e) =>
                        setRentData((p) => ({ ...p, landlordName: e.target.value }))
                      }
                      placeholder={s.rentLandlordPlaceholder}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {s.rentMonthlyAmountLabel}
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={rentData.monthlyRent}
                      onChange={(e) =>
                        setRentData((p) => ({ ...p, monthlyRent: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs sm:text-sm font-bold bg-white border border-slate-300 rounded-lg text-[#0F172A] tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {s.rentStartMonthLabel}
                    </label>
                    <input
                      type="month"
                      value={rentData.startMonth}
                      onChange={(e) =>
                        setRentData((p) => ({ ...p, startMonth: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {s.rentLandlordPanLabel}
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={rentData.landlordPan}
                    onChange={(e) =>
                      setRentData((p) => ({
                        ...p,
                        landlordPan: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder={s.rentLandlordPanPlaceholder}
                    className="w-full px-3 py-2 text-xs sm:text-sm uppercase bg-white border border-slate-300 rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {s.rentAddressLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={rentData.address}
                    onChange={(e) =>
                      setRentData((p) => ({ ...p, address: e.target.value }))
                    }
                    placeholder={s.rentAddressPlaceholder}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-700 mb-1.5">
                    {s.rentCountLabel}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {([1, 2, 3] as const).map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setRentData((p) => ({ ...p, receiptCount: cnt }))}
                        className={`px-2.5 py-2 text-xs font-bold rounded-lg border cursor-pointer transition-colors ${
                          rentData.receiptCount === cnt
                            ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                            : 'bg-white text-[#0F172A] border-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {cnt === 1 ? s.rentCount1 : cnt === 2 ? s.rentCount2 : s.rentCount3}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {s.rentPayModeLabel}
                    </label>
                    <select
                      value={rentData.paymentMode}
                      onChange={(e) =>
                        setRentData((p) => ({ ...p, paymentMode: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-[#0F172A]"
                    >
                      {s.rentPayModes.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {s.rentReceiptNoLabel}
                    </label>
                    <input
                      type="text"
                      value={rentData.startReceiptNo}
                      onChange={(e) =>
                        setRentData((p) => ({ ...p, startReceiptNo: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#0F172A] tabular-nums"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rentData.includeRevenueStamp}
                    onChange={(e) =>
                      setRentData((p) => ({ ...p, includeRevenueStamp: e.target.checked }))
                    }
                    className="w-4 h-4 rounded accent-[#1E40AF] cursor-pointer"
                  />
                  <span>{s.rentIncludeStampLabel}</span>
                </label>

                <button
                  type="button"
                  onClick={() => setRentData(DEFAULT_RENT_DATA)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1E40AF] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{s.rentSampleFillBtn}</span>
                </button>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {s.salCompanyLabel}
                    </label>
                    <input
                      type="text"
                      value={salaryData.companyName}
                      onChange={(e) =>
                        setSalaryData((p) => ({ ...p, companyName: e.target.value }))
                      }
                      placeholder={s.salCompanyPlaceholder}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#0F172A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {s.salCompanyAddrLabel}
                    </label>
                    <input
                      type="text"
                      value={salaryData.companyAddress}
                      onChange={(e) =>
                        setSalaryData((p) => ({ ...p, companyAddress: e.target.value }))
                      }
                      placeholder={s.salCompanyAddrPlaceholder}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#0F172A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {s.salEmpNameLabel}
                    </label>
                    <input
                      type="text"
                      value={salaryData.employeeName}
                      onChange={(e) =>
                        setSalaryData((p) => ({ ...p, employeeName: e.target.value }))
                      }
                      placeholder={s.salEmpNamePlaceholder}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#0F172A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {s.salMonthLabel}
                    </label>
                    <input
                      type="month"
                      value={salaryData.salaryMonth}
                      onChange={(e) =>
                        setSalaryData((p) => ({ ...p, salaryMonth: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#0F172A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {s.salEmpIdLabel}
                    </label>
                    <input
                      type="text"
                      value={salaryData.employeeId}
                      onChange={(e) =>
                        setSalaryData((p) => ({ ...p, employeeId: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#0F172A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {s.salDesignationLabel}
                    </label>
                    <input
                      type="text"
                      value={salaryData.designation}
                      onChange={(e) =>
                        setSalaryData((p) => ({ ...p, designation: e.target.value }))
                      }
                      placeholder={s.salDesignationPlaceholder}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#0F172A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {s.salDepartmentLabel}
                    </label>
                    <input
                      type="text"
                      value={salaryData.department}
                      onChange={(e) =>
                        setSalaryData((p) => ({ ...p, department: e.target.value }))
                      }
                      placeholder={s.salDepartmentPlaceholder}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#0F172A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {s.salPaidDaysLabel}
                    </label>
                    <input
                      type="text"
                      value={salaryData.paidDays}
                      onChange={(e) =>
                        setSalaryData((p) => ({ ...p, paidDays: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#0F172A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {s.salPanUanLabel}
                  </label>
                  <input
                    type="text"
                    value={salaryData.panUan}
                    onChange={(e) =>
                      setSalaryData((p) => ({ ...p, panUan: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#0F172A]"
                  />
                </div>

                {/* Earnings Inputs */}
                <div className="pt-2 border-t border-slate-200 space-y-2.5">
                  <div className="text-xs font-bold text-[#1E40AF]">{s.salEarningsTitle}</div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {s.salBasicLabel}
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={salaryData.basic}
                        onChange={(e) =>
                          setSalaryData((p) => ({ ...p, basic: e.target.value }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {s.salHraLabel}
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={salaryData.hra}
                        onChange={(e) =>
                          setSalaryData((p) => ({ ...p, hra: e.target.value }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {s.salAllowanceLabel}
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={salaryData.allowance}
                        onChange={(e) =>
                          setSalaryData((p) => ({ ...p, allowance: e.target.value }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {s.salBonusLabel}
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={salaryData.bonus}
                        onChange={(e) =>
                          setSalaryData((p) => ({ ...p, bonus: e.target.value }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg tabular-nums"
                      />
                    </div>
                  </div>
                </div>

                {/* Deductions Inputs */}
                <div className="pt-2 border-t border-slate-200 space-y-2.5">
                  <div className="text-xs font-bold text-slate-700">{s.salDeductionsTitle}</div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {s.salPfLabel}
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={salaryData.pf}
                        onChange={(e) =>
                          setSalaryData((p) => ({ ...p, pf: e.target.value }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {s.salPtLabel}
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={salaryData.pt}
                        onChange={(e) =>
                          setSalaryData((p) => ({ ...p, pt: e.target.value }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {s.salTdsLabel}
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={salaryData.tds}
                        onChange={(e) =>
                          setSalaryData((p) => ({ ...p, tds: e.target.value }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {s.salOtherDedLabel}
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={salaryData.otherDed}
                        onChange={(e) =>
                          setSalaryData((p) => ({ ...p, otherDed: e.target.value }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg tabular-nums"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Salary Summary Pill Strip */}
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[10px] font-semibold text-slate-500">{s.salGrossLabel}</div>
                    <div className="text-xs font-extrabold text-[#1E40AF] tabular-nums">
                      {formatInr(grossSalary)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-500">{s.salTotalDedLabel}</div>
                    <div className="text-xs font-extrabold text-slate-700 tabular-nums">
                      {formatInr(totalDeductions)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-500">{s.salNetPayLabel}</div>
                    <div className="text-xs font-extrabold text-[#16A34A] tabular-nums">
                      {formatInr(netSalary)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSalaryData(DEFAULT_SALARY_DATA)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1E40AF] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{s.rentSampleFillBtn}</span>
                </button>
              </>
            )}
          </div>

          {/* Right Live A4 Preview & Download Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#0F172A]">{s.rentPreviewTitle}</h2>
                <p className="text-xs text-slate-500">A4 (210 × 297 mm)</p>
              </div>
              <button
                type="button"
                onClick={() => void handleDownloadPdf()}
                disabled={isExporting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-60"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{s.rentDownloadingBtn}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{s.rentDownloadPdfBtn}</span>
                  </>
                )}
              </button>
            </div>

            {hasDownloaded && (
              <WhatsAppShareBar
                uiLang={uiLang}
                route="/rent-receipt-generator"
                toolTitle={toolMeta.title[uiLang]}
                compact
              />
            )}

            {exportError && (
              <div
                role="alert"
                className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{exportError}</span>
              </div>
            )}

            <div className="bg-slate-200/75 border border-slate-300 rounded-xl p-3 sm:p-5">
              <div ref={previewWrapRef} className="w-full overflow-hidden flex justify-center">
                <div
                  style={{
                    width: `${794 * previewScale}px`,
                    height: `${1122 * previewScale}px`,
                    position: 'relative',
                  }}
                >
                  <div
                    className="shadow-lg origin-top-left"
                    style={{
                      width: '794px',
                      height: '1122px',
                      transform: `scale(${previewScale})`,
                    }}
                  >
                    {activeTab === 'rent' ? (
                      <RentReceiptA4Sheet data={rentData} uiLang={uiLang} />
                    ) : (
                      <SalarySlipA4Sheet data={salaryData} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offscreen 1:1 Unscaled A4 Sheet for High-DPI PDF Export */}
      <div
        ref={captureRef}
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
        {activeTab === 'rent' ? (
          <RentReceiptA4Sheet data={rentData} uiLang={uiLang} />
        ) : (
          <SalarySlipA4Sheet data={salaryData} />
        )}
      </div>
    </ToolShell>
  );
};
