import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Download,
  FileCheck2,
  ImagePlus,
  Loader2,
  Plus,
  ReceiptText,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { ToolShell } from './ToolShell';
import { WhatsAppShareBar } from './WhatsAppShareBar';
import { pushDataLayerEvent } from '../../utils/gtm';
import { exportA4Pdf } from '../../utils/pdfExport';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang } from '../../utils/siteI18n';

interface GstInvoiceMakerToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
  onToolDownload: () => void;
}

type DocType = 'invoice' | 'quotation';
type TaxScheme = 'cgst-sgst' | 'igst' | 'none';

interface LineItem {
  id: string;
  description: string;
  hsn: string;
  qty: string;
  rate: string;
  gstRate: string;
}

interface InvoiceState {
  docType: DocType;
  taxScheme: TaxScheme;
  sellerName: string;
  sellerGstin: string;
  sellerPhone: string;
  sellerAddress: string;
  logoDataUrl: string;
  buyerName: string;
  buyerGstin: string;
  buyerPhone: string;
  buyerAddress: string;
  docNumber: string;
  docDate: string;
  dueDate: string;
  paymentNote: string;
  terms: string;
  items: LineItem[];
}

function getDefaultInvoiceState(): InvoiceState {
  const today = new Date().toISOString().slice(0, 10);
  return {
    docType: 'invoice',
    taxScheme: 'cgst-sgst',
    sellerName: 'Shri Ganesh Enterprises',
    sellerGstin: '27AABCU9603R1ZM',
    sellerPhone: '+91 98220 12345',
    sellerAddress: 'Shop 12, Market Yard, Pune - 411037, Maharashtra',
    logoDataUrl: '',
    buyerName: 'Sahyadri Traders',
    buyerGstin: '27AADCS1234F1Z5',
    buyerPhone: '+91 97650 54321',
    buyerAddress: 'Plot 8, MIDC Satara - 415004, Maharashtra',
    docNumber: 'INV-2026-001',
    docDate: today,
    dueDate: today,
    paymentNote: 'UPI ID: business@okhdfcbank | Bank: HDFC Bank, Pune',
    terms: 'Thank you for your business! Subject to local jurisdiction.',
    items: [
      { id: '1', description: 'Office Printer Toner Cartridge', hsn: '8443', qty: '2', rate: '1450', gstRate: '18' },
      { id: '2', description: 'A4 Printing Paper Ream (500 Sheets)', hsn: '4802', qty: '5', rate: '260', gstRate: '12' },
    ],
  };
}

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
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seven', 'Eighty', 'Ninety'];

function twoDigitsToWords(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  const tensWord = t === 7 ? 'Seventy' : TENS[t];
  return `${tensWord}${o ? ` ${ONES[o]}` : ''}`;
}

function amountToIndianWords(amount: number): string {
  const num = Math.round(Math.max(0, amount));
  if (num === 0) return 'Zero Rupees Only';
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = Math.floor((num % 1000) / 100);
  const rest = num % 100;

  const parts: string[] = [];
  if (crore > 0) parts.push(`${twoDigitsToWords(crore)} Crore`);
  if (lakh > 0) parts.push(`${twoDigitsToWords(lakh)} Lakh`);
  if (thousand > 0) parts.push(`${twoDigitsToWords(thousand)} Thousand`);
  if (hundred > 0) parts.push(`${ONES[hundred]} Hundred`);
  if (rest > 0) parts.push(twoDigitsToWords(rest));
  return `${parts.join(' ')} Rupees Only`;
}

function formatInr(num: number): string {
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const COPY: Record<
  UiLang,
  {
    tabInvoice: string;
    tabQuotation: string;
    taxSchemeLabel: string;
    taxCgstSgst: string;
    taxIgst: string;
    taxNone: string;
    sellerSection: string;
    sellerName: string;
    sellerGstin: string;
    sellerPhone: string;
    sellerAddress: string;
    logoBtn: string;
    removeLogoBtn: string;
    buyerSection: string;
    buyerName: string;
    buyerGstin: string;
    buyerPhone: string;
    buyerAddress: string;
    docMetaSection: string;
    docNumberLabel: string;
    docDateLabel: string;
    dueDateLabel: string;
    itemsSection: string;
    itemDesc: string;
    itemHsn: string;
    itemQty: string;
    itemRate: string;
    itemGst: string;
    addItemBtn: string;
    paymentNoteLabel: string;
    termsLabel: string;
    resetBtn: string;
    previewTitle: string;
    downloadPdfBtn: string;
    downloadingBtn: string;
    exportError: string;
  }
> = {
  en: {
    tabInvoice: 'Tax Invoice (GST Bill)',
    tabQuotation: 'Quotation / Estimate',
    taxSchemeLabel: 'Tax Type',
    taxCgstSgst: 'Intra-State (CGST + SGST)',
    taxIgst: 'Inter-State (IGST)',
    taxNone: 'No GST / Simple Bill',
    sellerSection: 'Your Business Details',
    sellerName: 'Business / Shop Name',
    sellerGstin: 'GSTIN (Optional)',
    sellerPhone: 'Phone',
    sellerAddress: 'Business Address',
    logoBtn: 'Add Logo',
    removeLogoBtn: 'Remove',
    buyerSection: 'Bill To / Customer Details',
    buyerName: 'Customer / Company Name',
    buyerGstin: 'Customer GSTIN (Optional)',
    buyerPhone: 'Customer Phone',
    buyerAddress: 'Billing Address',
    docMetaSection: 'Document Numbers & Dates',
    docNumberLabel: 'Invoice / Quote No.',
    docDateLabel: 'Date',
    dueDateLabel: 'Due / Valid Until',
    itemsSection: 'Items & Services',
    itemDesc: 'Item / Service Description',
    itemHsn: 'HSN',
    itemQty: 'Qty',
    itemRate: 'Rate (₹)',
    itemGst: 'GST %',
    addItemBtn: 'Add Line Item',
    paymentNoteLabel: 'Bank / UPI Payment Details',
    termsLabel: 'Terms & Notes',
    resetBtn: 'Reset Sample',
    previewTitle: 'Live A4 Printable Preview',
    downloadPdfBtn: 'Download A4 PDF',
    downloadingBtn: 'Generating A4 PDF...',
    exportError: 'Could not export PDF. Please try again.',
  },
  mr: {
    tabInvoice: 'GST टॅक्स बिल (Invoice)',
    tabQuotation: 'अंदाजपत्रक (Quotation)',
    taxSchemeLabel: 'GST कर प्रकार',
    taxCgstSgst: 'राज्यांतर्गत (CGST + SGST)',
    taxIgst: 'आंतरराज्य (IGST)',
    taxNone: 'विना-GST साधे बिल',
    sellerSection: 'तुमच्या व्यवसायाचा तपशील',
    sellerName: 'दुकान / कंपनीचे नाव',
    sellerGstin: 'GSTIN क्रमांक (ऐच्छिक)',
    sellerPhone: 'मोबाईल नंबर',
    sellerAddress: 'व्यवसायाचा पत्ता',
    logoBtn: 'लोगो जोडा',
    removeLogoBtn: 'काढा',
    buyerSection: 'ग्राहकाचा तपशील (Bill To)',
    buyerName: 'ग्राहकाचे / कंपनीचे नाव',
    buyerGstin: 'ग्राहक GSTIN (ऐच्छिक)',
    buyerPhone: 'ग्राहक मोबाईल',
    buyerAddress: 'ग्राहक पत्ता',
    docMetaSection: 'बिल क्रमांक व तारीख',
    docNumberLabel: 'बिल / कोटेशन क्र.',
    docDateLabel: 'तारीख',
    dueDateLabel: 'अंतिम तारीख',
    itemsSection: 'वस्तू व सेवा तपशील',
    itemDesc: 'वस्तू / सेवेचे नाव',
    itemHsn: 'HSN',
    itemQty: 'नग',
    itemRate: 'दर (₹)',
    itemGst: 'GST %',
    addItemBtn: 'नवीन ओळ जोडा',
    paymentNoteLabel: 'बँक / UPI पेमेंट माहिती',
    termsLabel: 'अटी व टीप',
    resetBtn: 'नमुना रीसेट',
    previewTitle: 'लाइव्ह A4 प्रिंट प्रिव्ह्यू',
    downloadPdfBtn: 'A4 PDF डाउनलोड करा',
    downloadingBtn: 'PDF तयार होत आहे...',
    exportError: 'PDF डाउनलोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
  },
  hi: {
    tabInvoice: 'GST टैक्स बिल (Invoice)',
    tabQuotation: 'कोटेशन / एस्टीमेट',
    taxSchemeLabel: 'GST टैक्स प्रकार',
    taxCgstSgst: 'राज्य के भीतर (CGST + SGST)',
    taxIgst: 'अंतर्राज्यीय (IGST)',
    taxNone: 'बिना GST सरल बिल',
    sellerSection: 'आपके व्यवसाय का विवरण',
    sellerName: 'दुकान / कंपनी का नाम',
    sellerGstin: 'GSTIN नंबर (वैकल्पिक)',
    sellerPhone: 'फोन नंबर',
    sellerAddress: 'व्यवसाय का पता',
    logoBtn: 'लोगो जोड़ें',
    removeLogoBtn: 'हटाएँ',
    buyerSection: 'ग्राहक का विवरण (Bill To)',
    buyerName: 'ग्राहक / कंपनी का नाम',
    buyerGstin: 'ग्राहक GSTIN (वैकल्पिक)',
    buyerPhone: 'ग्राहक फोन',
    buyerAddress: 'ग्राहक का पता',
    docMetaSection: 'बिल नंबर और तारीख',
    docNumberLabel: 'बिल / कोटेशन नं.',
    docDateLabel: 'तारीख',
    dueDateLabel: 'देय / वैध तिथि',
    itemsSection: 'वस्तुएं और सेवाएं',
    itemDesc: 'विवरण',
    itemHsn: 'HSN',
    itemQty: 'मात्रा',
    itemRate: 'दर (₹)',
    itemGst: 'GST %',
    addItemBtn: 'आइटम जोड़ें',
    paymentNoteLabel: 'बैंक / UPI भुगतान विवरण',
    termsLabel: 'नियम व नोट',
    resetBtn: 'सैंपल रीसेट',
    previewTitle: 'लाइव A4 प्रिंट प्रिव्यू',
    downloadPdfBtn: 'A4 PDF डाउनलोड करें',
    downloadingBtn: 'PDF बन रही है...',
    exportError: 'PDF बनाने में समस्या आई। कृपया दोबारा कोशिश करें।',
  },
};

export const GstInvoiceMakerTool: React.FC<GstInvoiceMakerToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
  onToolDownload,
}) => {
  const c = COPY[uiLang];
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/gst-invoice-maker')!;

  const [state, setState] = useState<InvoiceState>(getDefaultInvoiceState);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [hasDownloaded, setHasDownloaded] = useState<boolean>(false);
  const [previewScale, setPreviewScale] = useState<number>(0.65);

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const previewWrapRef = useRef<HTMLDivElement | null>(null);
  const captureRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = previewWrapRef.current;
    if (!el) return;
    const updateScale = () => {
      if (el.clientWidth > 0) {
        setPreviewScale(Math.min(1, el.clientWidth / 794));
      }
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const computedItems = state.items.map((item) => {
    const qty = Math.max(0, Number(item.qty) || 0);
    const rate = Math.max(0, Number(item.rate) || 0);
    const gstPct = state.taxScheme === 'none' ? 0 : Math.max(0, Number(item.gstRate) || 0);
    const taxable = qty * rate;
    const taxAmt = (taxable * gstPct) / 100;
    const lineTotal = taxable + taxAmt;
    return { ...item, qtyNum: qty, rateNum: rate, gstPct, taxable, taxAmt, lineTotal };
  });

  const totalTaxable = computedItems.reduce((sum, i) => sum + i.taxable, 0);
  const totalTax = computedItems.reduce((sum, i) => sum + i.taxAmt, 0);
  const grandTotal = totalTaxable + totalTax;

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));
  };

  const addItem = () => {
    setState((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `${Date.now()}-${Math.random()}`,
          description: '',
          hsn: '',
          qty: '1',
          rate: '0',
          gstRate: '18',
        },
      ],
    }));
  };

  const removeItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((it) => it.id !== id) : prev.items,
    }));
  };

  const handleLogoUpload = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setState((p) => ({ ...p, logoDataUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadPdf = async () => {
    if (!captureRef.current) return;
    setErrorMsg('');
    setIsExporting(true);
    try {
      const safeDocNo = (state.docNumber || state.docType).replace(/[^a-zA-Z0-9_-]/g, '-');
      await exportA4Pdf({
        element: captureRef.current,
        filename: `${safeDocNo}.pdf`,
        language: 'en',
      });
      setHasDownloaded(true);
      pushDataLayerEvent('file_download', {
        document_type: state.docType === 'invoice' ? 'gst_invoice' : 'quotation',
        file_extension: 'pdf',
      });
      onToolDownload();
    } catch {
      setErrorMsg(c.exportError);
    } finally {
      setIsExporting(false);
    }
  };

  const renderA4Document = () => {
    const headingTitle = state.docType === 'invoice' ? 'TAX INVOICE' : 'QUOTATION / ESTIMATE';
    return (
      <div
        style={{
          width: '794px',
          minHeight: '1122px',
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          padding: '40px 44px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div>
          {/* Top Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid #1E40AF',
              paddingBottom: '18px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', maxWidth: '460px' }}>
              {state.logoDataUrl && (
                <img
                  src={state.logoDataUrl}
                  alt="Logo"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                  }}
                />
              )}
              <div>
                <div style={{ fontSize: '21px', fontWeight: 800, color: '#0F172A' }}>
                  {state.sellerName || 'Business Name'}
                </div>
                {state.sellerGstin && (
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E40AF', marginTop: '3px' }}>
                    GSTIN: {state.sellerGstin}
                  </div>
                )}
                {state.sellerAddress && (
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px', lineHeight: 1.45 }}>
                    {state.sellerAddress}
                  </div>
                )}
                {state.sellerPhone && (
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                    Phone: {state.sellerPhone}
                  </div>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#1E40AF',
                  letterSpacing: '0.03em',
                }}
              >
                {headingTitle}
              </div>
              <div style={{ fontSize: '12px', color: '#334155', marginTop: '8px', lineHeight: 1.6 }}>
                <div>
                  <strong>No:</strong> {state.docNumber || '-'}
                </div>
                <div>
                  <strong>Date:</strong> {state.docDate || '-'}
                </div>
                {state.dueDate && (
                  <div>
                    <strong>{state.docType === 'invoice' ? 'Due Date:' : 'Valid Till:'}</strong> {state.dueDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>
              BILL TO / CUSTOMER
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
              {state.buyerName || 'Customer Name'}
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px', lineHeight: 1.45 }}>
              {state.buyerAddress}
              {state.buyerPhone ? ` · Phone: ${state.buyerPhone}` : ''}
              {state.buyerGstin ? ` · GSTIN: ${state.buyerGstin}` : ''}
            </div>
          </div>

          {/* Items Table */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '18px',
              fontSize: '12px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#1E40AF', color: '#FFFFFF' }}>
                <th style={{ padding: '9px 8px', textAlign: 'left', width: '34px' }}>#</th>
                <th style={{ padding: '9px 8px', textAlign: 'left' }}>Item / Description</th>
                <th style={{ padding: '9px 8px', textAlign: 'left', width: '68px' }}>HSN</th>
                <th style={{ padding: '9px 8px', textAlign: 'right', width: '54px' }}>Qty</th>
                <th style={{ padding: '9px 8px', textAlign: 'right', width: '86px' }}>Rate (₹)</th>
                {state.taxScheme !== 'none' && (
                  <th style={{ padding: '9px 8px', textAlign: 'right', width: '66px' }}>GST</th>
                )}
                <th style={{ padding: '9px 8px', textAlign: 'right', width: '104px' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {computedItems.map((it, idx) => (
                <tr key={it.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '9px 8px', color: '#64748B' }}>{idx + 1}</td>
                  <td style={{ padding: '9px 8px', fontWeight: 600, color: '#0F172A' }}>
                    {it.description || '-'}
                  </td>
                  <td style={{ padding: '9px 8px', color: '#475569' }}>{it.hsn || '-'}</td>
                  <td style={{ padding: '9px 8px', textAlign: 'right' }}>{it.qtyNum}</td>
                  <td style={{ padding: '9px 8px', textAlign: 'right' }}>{formatInr(it.rateNum)}</td>
                  {state.taxScheme !== 'none' && (
                    <td style={{ padding: '9px 8px', textAlign: 'right', color: '#475569' }}>
                      {it.gstPct}%
                    </td>
                  )}
                  <td style={{ padding: '9px 8px', textAlign: 'right', fontWeight: 700 }}>
                    {formatInr(it.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals & Amount in Words */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '12px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B' }}>
                  AMOUNT IN WORDS
                </div>
                <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>
                  {amountToIndianWords(grandTotal)}
                </div>
              </div>

              {state.paymentNote && (
                <div style={{ fontSize: '11.5px', color: '#334155', marginBottom: '8px', lineHeight: 1.5 }}>
                  <strong>Payment Info:</strong> {state.paymentNote}
                </div>
              )}
              {state.terms && (
                <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.5 }}>
                  <strong>Terms:</strong> {state.terms}
                </div>
              )}
            </div>

            <div
              style={{
                width: '270px',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                overflow: 'hidden',
                fontSize: '12.5px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid #E2E8F0' }}>
                <span style={{ color: '#475569' }}>Taxable Subtotal</span>
                <strong>₹ {formatInr(totalTaxable)}</strong>
              </div>
              {state.taxScheme === 'cgst-sgst' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 12px', borderBottom: '1px solid #E2E8F0' }}>
                    <span style={{ color: '#475569' }}>CGST</span>
                    <span>₹ {formatInr(totalTax / 2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 12px', borderBottom: '1px solid #E2E8F0' }}>
                    <span style={{ color: '#475569' }}>SGST</span>
                    <span>₹ {formatInr(totalTax / 2)}</span>
                  </div>
                </>
              )}
              {state.taxScheme === 'igst' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 12px', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#475569' }}>IGST</span>
                  <span>₹ {formatInr(totalTax)}</span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: '#1E40AF',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 800,
                }}
              >
                <span>Grand Total</span>
                <span>₹ {formatInr(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Signature Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid #E2E8F0',
            paddingTop: '18px',
            marginTop: '24px',
          }}
        >
          <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>
            {!isPro ? 'Generated free via SadhanBox' : 'Computer-generated document'}
          </div>
          <div style={{ textAlign: 'center', minWidth: '180px' }}>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A' }}>
              For {state.sellerName || 'Business'}
            </div>
            <div style={{ height: '36px' }} />
            <div style={{ borderTop: '1px solid #64748B', paddingTop: '4px', fontSize: '11px', color: '#475569' }}>
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ToolShell
      route="/gst-invoice-maker"
      title={toolMeta.title[uiLang]}
      subtitle={toolMeta.shortDesc[uiLang]}
      uiLang={uiLang}
      isPro={isPro}
      onBackHome={onBackHome}
      onOpenProModal={onOpenProModal}
    >
      {/* Top Mode & Tax Scheme Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1">
          <button
            type="button"
            onClick={() =>
              setState((p) => ({
                ...p,
                docType: 'invoice',
                docNumber: p.docNumber.startsWith('QT-') ? p.docNumber.replace('QT-', 'INV-') : p.docNumber,
              }))
            }
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer ${
              state.docType === 'invoice' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <ReceiptText className="w-4 h-4 text-blue-600" />
            <span>{c.tabInvoice}</span>
          </button>
          <button
            type="button"
            onClick={() =>
              setState((p) => ({
                ...p,
                docType: 'quotation',
                docNumber: p.docNumber.startsWith('INV-') ? p.docNumber.replace('INV-', 'QT-') : p.docNumber,
              }))
            }
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer ${
              state.docType === 'quotation' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>{c.tabQuotation}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setState(getDefaultInvoiceState())}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{c.resetBtn}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Form Editor */}
        <div className="lg:col-span-6 space-y-4">
          {/* Seller Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xs font-bold text-slate-800">{c.sellerSection}</h2>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  handleLogoUpload(e.target.files?.[0]);
                  e.target.value = '';
                }}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <ImagePlus className="w-3 h-3 text-[#1E40AF]" />
                  <span>{c.logoBtn}</span>
                </button>
                {state.logoDataUrl && (
                  <button
                    type="button"
                    onClick={() => setState((p) => ({ ...p, logoDataUrl: '' }))}
                    className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                  >
                    {c.removeLogoBtn}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder={c.sellerName}
                value={state.sellerName}
                onChange={(e) => setState((p) => ({ ...p, sellerName: e.target.value }))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900"
              />
              <input
                type="text"
                placeholder={c.sellerGstin}
                value={state.sellerGstin}
                onChange={(e) => setState((p) => ({ ...p, sellerGstin: e.target.value.toUpperCase() }))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900"
              />
              <input
                type="text"
                placeholder={c.sellerPhone}
                value={state.sellerPhone}
                onChange={(e) => setState((p) => ({ ...p, sellerPhone: e.target.value }))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900"
              />
              <input
                type="text"
                placeholder={c.sellerAddress}
                value={state.sellerAddress}
                onChange={(e) => setState((p) => ({ ...p, sellerAddress: e.target.value }))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Buyer Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h2 className="text-xs font-bold text-slate-800">{c.buyerSection}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder={c.buyerName}
                value={state.buyerName}
                onChange={(e) => setState((p) => ({ ...p, buyerName: e.target.value }))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900"
              />
              <input
                type="text"
                placeholder={c.buyerGstin}
                value={state.buyerGstin}
                onChange={(e) => setState((p) => ({ ...p, buyerGstin: e.target.value.toUpperCase() }))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900"
              />
              <input
                type="text"
                placeholder={c.buyerPhone}
                value={state.buyerPhone}
                onChange={(e) => setState((p) => ({ ...p, buyerPhone: e.target.value }))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900"
              />
              <input
                type="text"
                placeholder={c.buyerAddress}
                value={state.buyerAddress}
                onChange={(e) => setState((p) => ({ ...p, buyerAddress: e.target.value }))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Invoice Number, Dates & Tax Scheme */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h2 className="text-xs font-bold text-slate-800">{c.docMetaSection}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {c.docNumberLabel}
                </label>
                <input
                  type="text"
                  value={state.docNumber}
                  onChange={(e) => setState((p) => ({ ...p, docNumber: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {c.docDateLabel}
                </label>
                <input
                  type="date"
                  value={state.docDate}
                  onChange={(e) => setState((p) => ({ ...p, docDate: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {c.dueDateLabel}
                </label>
                <input
                  type="date"
                  value={state.dueDate}
                  onChange={(e) => setState((p) => ({ ...p, dueDate: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-600 mb-1.5">{c.taxSchemeLabel}</div>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: 'cgst-sgst', label: c.taxCgstSgst },
                    { id: 'igst', label: c.taxIgst },
                    { id: 'none', label: c.taxNone },
                  ] as Array<{ id: TaxScheme; label: string }>
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setState((p) => ({ ...p, taxScheme: opt.id }))}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                      state.taxScheme === opt.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800">{c.itemsSection}</h2>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{c.addItemBtn}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {state.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl p-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={c.itemDesc}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={state.items.length === 1}
                      aria-label="Remove item"
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">{c.itemHsn}</label>
                      <input
                        type="text"
                        value={item.hsn}
                        onChange={(e) => updateItem(item.id, { hsn: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-900 tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">{c.itemQty}</label>
                      <input
                        type="number"
                        min={0}
                        value={item.qty}
                        onChange={(e) => updateItem(item.id, { qty: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-900 tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">{c.itemRate}</label>
                      <input
                        type="number"
                        min={0}
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, { rate: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-900 tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">{c.itemGst}</label>
                      <select
                        value={item.gstRate}
                        disabled={state.taxScheme === 'none'}
                        onChange={(e) => updateItem(item.id, { gstRate: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-1.5 py-1.5 text-xs text-slate-900 bg-white disabled:opacity-50"
                      >
                        {['0', '5', '12', '18', '28'].map((r) => (
                          <option key={r} value={r}>
                            {r}%
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Note & Terms */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {c.paymentNoteLabel}
              </label>
              <input
                type="text"
                value={state.paymentNote}
                onChange={(e) => setState((p) => ({ ...p, paymentNote: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">{c.termsLabel}</label>
              <input
                type="text"
                value={state.terms}
                onChange={(e) => setState((p) => ({ ...p, terms: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              />
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="flex items-start gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm font-medium text-rose-700"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => void handleDownloadPdf()}
            disabled={isExporting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer disabled:opacity-60"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{c.downloadingBtn}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{c.downloadPdfBtn}</span>
              </>
            )}
          </button>

          {hasDownloaded && (
            <WhatsAppShareBar
              uiLang={uiLang}
              route="/gst-invoice-maker"
              toolTitle={toolMeta.title[uiLang]}
            />
          )}
        </div>

        {/* Right: Scaled Live A4 Preview */}
        <div className="lg:col-span-6 space-y-2.5 lg:sticky lg:top-20">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{c.previewTitle}</span>
            <span className="text-[11px] font-medium text-slate-500 tabular-nums">A4 · 210 × 297 mm</span>
          </div>

          <div className="bg-slate-200/80 border border-slate-300 rounded-xl p-3 sm:p-4">
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
                  {renderA4Document()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offscreen 1:1 Capture Node */}
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
        }}
      >
        {renderA4Document()}
      </div>
    </ToolShell>
  );
};
