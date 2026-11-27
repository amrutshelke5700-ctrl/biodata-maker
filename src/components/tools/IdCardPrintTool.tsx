import React, { useEffect, useRef, useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import {
  AlertCircle,
  Crop,
  Download,
  FileImage,
  IdCard,
  ImagePlus,
  Loader2,
  RotateCw,
  Trash2,
} from 'lucide-react';
import { PdfImageCropModal } from './PdfImageCropModal';
import { ToolShell } from './ToolShell';
import { WhatsAppShareBar } from './WhatsAppShareBar';
import { rotateImageFile } from '../../utils/cropImage';
import { pushDataLayerEvent } from '../../utils/gtm';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang } from '../../utils/siteI18n';

interface IdCardPrintToolProps {
  uiLang: UiLang;
  isPro: boolean;
  onBackHome: () => void;
  onOpenProModal: () => void;
  onToolDownload: () => void;
}

interface CardSide {
  file: File;
  previewUrl: string;
}

type LayoutDirection = 'side-by-side' | 'stacked';
type CopyCount = 1 | 2 | 4;

const COPY: Record<
  UiLang,
  {
    frontLabel: string;
    backLabel: string;
    uploadFrontBtn: string;
    uploadBackBtn: string;
    replaceBtn: string;
    cropBtn: string;
    rotateBtn: string;
    removeBtn: string;
    layoutLabel: string;
    sideBySide: string;
    stacked: string;
    copiesLabel: string;
    copyUnit: string;
    copiesUnit: string;
    cutBorderLabel: string;
    enhanceLabel: string;
    enhanceHint: string;
    previewTitle: string;
    emptyPreviewHint: string;
    downloadPdfBtn: string;
    downloadJpgBtn: string;
    workingBtn: string;
    minOneSideError: string;
    invalidImgError: string;
    exportError: string;
  }
> = {
  en: {
    frontLabel: 'Front Side (e.g. Aadhaar / PAN Front)',
    backLabel: 'Back Side (Optional — e.g. Address Side)',
    uploadFrontBtn: 'Upload Front Image',
    uploadBackBtn: 'Upload Back Image',
    replaceBtn: 'Change',
    cropBtn: 'Crop',
    rotateBtn: 'Rotate 90°',
    removeBtn: 'Remove',
    layoutLabel: 'Arrangement on A4 Sheet',
    sideBySide: 'Side-by-Side (Front | Back)',
    stacked: 'Top & Bottom',
    copiesLabel: 'Copies on A4 Page',
    copyUnit: 'Copy',
    copiesUnit: 'Copies',
    cutBorderLabel: 'Show light cutting border around cards',
    enhanceLabel: 'Boost text sharpness & contrast',
    enhanceHint: 'Improves readability on dark mobile photos of Aadhaar / PAN cards',
    previewTitle: 'Live A4 Printable Sheet Preview',
    emptyPreviewHint: 'Upload your ID card Front (and Back) photo to see the A4 print sheet.',
    downloadPdfBtn: 'Download A4 PDF',
    downloadJpgBtn: 'Download A4 JPG',
    workingBtn: 'Generating...',
    minOneSideError: 'Please upload at least the Front side image of your ID card.',
    invalidImgError: 'Please select a valid JPG, PNG, or WEBP image.',
    exportError: 'Could not generate A4 sheet. Please try again.',
  },
  mr: {
    frontLabel: 'पुढची बाजू (उदा. आधार / पॅन कार्ड फ्रंट)',
    backLabel: 'मागची बाजू (ऐच्छिक — पत्त्याची बाजू)',
    uploadFrontBtn: 'पुढचा फोटो निवडा',
    uploadBackBtn: 'मागचा फोटो निवडा',
    replaceBtn: 'बदला',
    cropBtn: 'क्रॉप',
    rotateBtn: '९०° फिरवा',
    removeBtn: 'काढा',
    layoutLabel: 'A4 पानावरील मांडणी',
    sideBySide: 'शेजारी-शेजारी (Front | Back)',
    stacked: 'वर-खाली',
    copiesLabel: 'A4 पानावरील प्रती (Copies)',
    copyUnit: 'प्रत',
    copiesUnit: 'प्रती',
    cutBorderLabel: 'कार्डभोवती कटिंगसाठी हलकी बॉर्डर दाखवा',
    enhanceLabel: 'मजकूर अधिक स्पष्ट व ठळक करा',
    enhanceHint: 'मोबाईलने काढलेल्या आधार / पॅन कार्ड फोटोंवरील अक्षरे स्पष्ट करते',
    previewTitle: 'लाइव्ह A4 प्रिंट शीट प्रिव्ह्यू',
    emptyPreviewHint: 'A4 प्रिंट शीट पाहण्यासाठी कार्डचा पुढचा (आणि मागचा) फोटो अपलोड करा.',
    downloadPdfBtn: 'A4 PDF डाउनलोड करा',
    downloadJpgBtn: 'A4 JPG डाउनलोड करा',
    workingBtn: 'तयार होत आहे...',
    minOneSideError: 'कृपया किमान कार्डची पुढची बाजू अपलोड करा.',
    invalidImgError: 'कृपया वैध JPG, PNG किंवा WEBP फोटो निवडा.',
    exportError: 'A4 शीट तयार करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
  },
  hi: {
    frontLabel: 'आगे का हिस्सा (उदा. आधार / पैन कार्ड फ्रंट)',
    backLabel: 'पीछे का हिस्सा (वैकल्पिक — पता वाला भाग)',
    uploadFrontBtn: 'आगे की फोटो चुनें',
    uploadBackBtn: 'पीछे की फोटो चुनें',
    replaceBtn: 'बदलें',
    cropBtn: 'क्रॉप',
    rotateBtn: '90° घुमाएँ',
    removeBtn: 'हटाएँ',
    layoutLabel: 'A4 पेज पर लेआउट',
    sideBySide: 'अगल-बगल (Front | Back)',
    stacked: 'ऊपर-नीचे',
    copiesLabel: 'A4 पेज पर कॉपियां',
    copyUnit: 'कॉपी',
    copiesUnit: 'कॉपियां',
    cutBorderLabel: 'कार्ड के चारों ओर कटिंग बॉर्डर दिखाएं',
    enhanceLabel: 'टेक्स्ट और स्पष्ट करें (Contrast Boost)',
    enhanceHint: 'मोबाइल से ली गई आधार / पैन फोटो के अक्षर साफ दिखाता है',
    previewTitle: 'लाइव A4 प्रिंट शीट प्रिव्यू',
    emptyPreviewHint: 'A4 प्रिंट शीट देखने के लिए कार्ड की आगे (और पीछे) की फोटो अपलोड करें।',
    downloadPdfBtn: 'A4 PDF डाउनलोड करें',
    downloadJpgBtn: 'A4 JPG डाउनलोड करें',
    workingBtn: 'तैयार हो रहा है...',
    minOneSideError: 'कृपया कम से कम कार्ड के आगे के हिस्से की फोटो अपलोड करें।',
    invalidImgError: 'कृपया एक मान्य JPG, PNG या WEBP फोटो चुनें।',
    exportError: 'A4 शीट बनाने में समस्या आई। कृपया दोबारा कोशिश करें।',
  },
};

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load error'));
    img.src = src;
  });
}

async function renderCardJpegBytes(file: File, enhance: boolean): Promise<Uint8Array> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadHtmlImage(url);
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    if (enhance) {
      ctx.filter = 'contrast(1.18) brightness(1.06) saturate(1.05)';
    }
    ctx.drawImage(img, 0, 0, w, h);
    ctx.filter = 'none';

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Encode failed'))), 'image/jpeg', 0.94);
    });
    return new Uint8Array(await blob.arrayBuffer());
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const IdCardPrintTool: React.FC<IdCardPrintToolProps> = ({
  uiLang,
  isPro,
  onBackHome,
  onOpenProModal,
  onToolDownload,
}) => {
  const c = COPY[uiLang];
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/id-card-print')!;

  const frontInputRef = useRef<HTMLInputElement | null>(null);
  const backInputRef = useRef<HTMLInputElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [front, setFront] = useState<CardSide | null>(null);
  const [back, setBack] = useState<CardSide | null>(null);
  const [layout, setLayout] = useState<LayoutDirection>('side-by-side');
  const [copies, setCopies] = useState<CopyCount>(1);
  const [showCutBorder, setShowCutBorder] = useState<boolean>(true);
  const [enhanceText, setEnhanceText] = useState<boolean>(true);
  const [editingSide, setEditingSide] = useState<'front' | 'back' | null>(null);
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [hasDownloaded, setHasDownloaded] = useState<boolean>(false);

  const urlsRef = useRef<{ front?: string; back?: string }>({});
  urlsRef.current = { front: front?.previewUrl, back: back?.previewUrl };

  useEffect(() => {
    return () => {
      if (urlsRef.current.front) URL.revokeObjectURL(urlsRef.current.front);
      if (urlsRef.current.back) URL.revokeObjectURL(urlsRef.current.back);
    };
  }, []);

  const updateSideFile = (side: 'front' | 'back', file: File) => {
    const url = URL.createObjectURL(file);
    if (side === 'front') {
      setFront((prev) => {
        if (prev) URL.revokeObjectURL(prev.previewUrl);
        return { file, previewUrl: url };
      });
    } else {
      setBack((prev) => {
        if (prev) URL.revokeObjectURL(prev.previewUrl);
        return { file, previewUrl: url };
      });
    }
  };

  const handleSelectSideFile = (side: 'front' | 'back', file: File | undefined) => {
    if (!file) return;
    setErrorMsg('');
    const isValid = file.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(file.name);
    if (!isValid) {
      setErrorMsg(c.invalidImgError);
      return;
    }
    updateSideFile(side, file);
  };

  const handleQuickRotate = async (side: 'front' | 'back') => {
    const target = side === 'front' ? front : back;
    if (!target) return;
    try {
      const rotated = await rotateImageFile(target.file, 90);
      updateSideFile(side, rotated);
    } catch {
      setErrorMsg(c.exportError);
    }
  };

  const removeSide = (side: 'front' | 'back') => {
    if (side === 'front') {
      if (front) URL.revokeObjectURL(front.previewUrl);
      setFront(null);
    } else {
      if (back) URL.revokeObjectURL(back.previewUrl);
      setBack(null);
    }
  };

  // Render live A4 canvas preview
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;

    const drawPreview = async () => {
      // A4 proportion at 150 DPI preview: 1240 x 1754
      const pageW = 1240;
      const pageH = 1754;
      canvas.width = pageW;
      canvas.height = pageH;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageW, pageH);

      if (!front && !back) return;

      const frontImg = front ? await loadHtmlImage(front.previewUrl).catch(() => null) : null;
      const backImg = back ? await loadHtmlImage(back.previewUrl).catch(() => null) : null;
      if (cancelled) return;

      // CR80 standard card: ~85.6mm x 54mm -> at 1240px per 210mm (~5.905 px/mm): 505 x 319 px
      // Slightly generous printable size: 525 x 332 px
      const cardW = layout === 'side-by-side' ? 525 : 540;
      const cardH = layout === 'side-by-side' ? 332 : 342;
      const gapX = 48;
      const gapY = 44;
      const topMargin = 84;

      const drawCardSlot = (img: HTMLImageElement | null, x: number, y: number) => {
        if (!img) return;
        ctx.save();
        if (enhanceText) {
          ctx.filter = 'contrast(1.18) brightness(1.06) saturate(1.05)';
        }
        ctx.drawImage(img, x, y, cardW, cardH);
        ctx.restore();

        if (showCutBorder) {
          ctx.save();
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 6]);
          ctx.strokeRect(x, y, cardW, cardH);
          ctx.restore();
        }
      };

      const hasBoth = Boolean(frontImg && backImg);

      if (layout === 'side-by-side') {
        const rowW = hasBoth ? cardW * 2 + gapX : cardW;
        const startX = (pageW - rowW) / 2;
        const maxRows = Math.min(copies, 4);
        for (let r = 0; r < maxRows; r++) {
          const y = topMargin + r * (cardH + gapY);
          if (frontImg) {
            drawCardSlot(frontImg, startX, y);
          }
          if (backImg) {
            drawCardSlot(backImg, hasBoth ? startX + cardW + gapX : startX, y);
          }
        }
      } else {
        // Stacked: 1 or 2 columns depending on copy count
        const cols = copies === 4 ? 2 : 1;
        const pairGap = 24;
        const blockH = hasBoth ? cardH * 2 + pairGap : cardH;
        const totalW = cols === 2 ? cardW * 2 + gapX : cardW;
        const startX = (pageW - totalW) / 2;

        for (let idx = 0; idx < copies; idx++) {
          const col = cols === 2 ? idx % 2 : 0;
          const row = cols === 2 ? Math.floor(idx / 2) : idx;
          const x = startX + col * (cardW + gapX);
          const y = topMargin + row * (blockH + gapY + 12);
          if (y + blockH > pageH - 40) break;

          if (frontImg) {
            drawCardSlot(frontImg, x, y);
          }
          if (backImg) {
            drawCardSlot(backImg, x, hasBoth ? y + cardH + pairGap : y);
          }
        }
      }
    };

    void drawPreview();
    return () => {
      cancelled = true;
    };
  }, [front, back, layout, copies, showCutBorder, enhanceText]);

  const handleDownloadPdf = async () => {
    if (!front && !back) {
      setErrorMsg(c.minOneSideError);
      return;
    }
    setErrorMsg('');
    setIsWorking(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const a4W = 595.28; // 210mm in pt
      const a4H = 841.89; // 297mm in pt
      const page = pdfDoc.addPage([a4W, a4H]);

      const frontEmbedded = front ? await pdfDoc.embedJpg(await renderCardJpegBytes(front.file, enhanceText)) : null;
      const backEmbedded = back ? await pdfDoc.embedJpg(await renderCardJpegBytes(back.file, enhanceText)) : null;

      // CR80 standard physical size ~88mm x 56mm (~250pt x 159pt)
      const cardW = layout === 'side-by-side' ? 252 : 258;
      const cardH = layout === 'side-by-side' ? 160 : 164;
      const gapX = 22;
      const gapY = 20;
      const topMargin = 40;
      const hasBoth = Boolean(frontEmbedded && backEmbedded);

      const drawPdfSlot = (img: NonNullable<typeof frontEmbedded> | null, x: number, yTop: number) => {
        if (!img) return;
        const yBottom = a4H - yTop - cardH;
        page.drawImage(img, {
          x,
          y: yBottom,
          width: cardW,
          height: cardH,
        });
        if (showCutBorder) {
          page.drawRectangle({
            x,
            y: yBottom,
            width: cardW,
            height: cardH,
            borderWidth: 0.75,
            borderColor: rgb(0.58, 0.64, 0.72),
            borderDashArray: [4, 3],
          });
        }
      };

      if (layout === 'side-by-side') {
        const rowW = hasBoth ? cardW * 2 + gapX : cardW;
        const startX = (a4W - rowW) / 2;
        for (let r = 0; r < copies; r++) {
          const yTop = topMargin + r * (cardH + gapY);
          drawPdfSlot(frontEmbedded, startX, yTop);
          drawPdfSlot(backEmbedded, hasBoth ? startX + cardW + gapX : startX, yTop);
        }
      } else {
        const cols = copies === 4 ? 2 : 1;
        const pairGap = 12;
        const blockH = hasBoth ? cardH * 2 + pairGap : cardH;
        const totalW = cols === 2 ? cardW * 2 + gapX : cardW;
        const startX = (a4W - totalW) / 2;

        for (let idx = 0; idx < copies; idx++) {
          const col = cols === 2 ? idx % 2 : 0;
          const row = cols === 2 ? Math.floor(idx / 2) : idx;
          const x = startX + col * (cardW + gapX);
          const yTop = topMargin + row * (blockH + gapY + 6);
          if (yTop + blockH > a4H - 20) break;

          drawPdfSlot(frontEmbedded, x, yTop);
          drawPdfSlot(backEmbedded, x, hasBoth ? yTop + cardH + pairGap : yTop);
        }
      }

      const bytes = await pdfDoc.save();
      const safeBuffer = new Uint8Array(bytes).buffer;
      const blob = new Blob([safeBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sadhanbox-id-card-a4.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);

      setHasDownloaded(true);
      pushDataLayerEvent('file_download', {
        document_type: 'id_card_a4_pdf',
        file_extension: 'pdf',
      });
      onToolDownload();
    } catch {
      setErrorMsg(c.exportError);
    } finally {
      setIsWorking(false);
    }
  };

  const handleDownloadJpg = () => {
    if (!front && !back) {
      setErrorMsg(c.minOneSideError);
      return;
    }
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setErrorMsg(c.exportError);
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sadhanbox-id-card-a4.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);

        setHasDownloaded(true);
        pushDataLayerEvent('file_download', {
          document_type: 'id_card_a4_jpg',
          file_extension: 'jpg',
        });
        onToolDownload();
      },
      'image/jpeg',
      0.95
    );
  };

  const renderSideUploader = (
    side: 'front' | 'back',
    label: string,
    btnText: string,
    data: CardSide | null,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
      <div className="text-xs font-bold text-slate-800">{label}</div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => {
          handleSelectSideFile(side, e.target.files?.[0]);
          e.target.value = '';
        }}
        className="hidden"
      />

      {!data ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full py-6 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl bg-white text-xs font-semibold text-slate-700 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <ImagePlus className="w-5 h-5 text-[#1E40AF]" />
          <span>{btnText}</span>
        </button>
      ) : (
        <div className="space-y-2.5">
          <div className="w-full h-32 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-1.5">
            <img
              src={data.previewUrl}
              alt={label}
              className="w-full h-full object-contain"
              style={
                enhanceText
                  ? { filter: 'contrast(1.18) brightness(1.06) saturate(1.05)' }
                  : undefined
              }
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setEditingSide(side)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Crop className="w-3 h-3" />
              <span>{c.cropBtn}</span>
            </button>
            <button
              type="button"
              onClick={() => void handleQuickRotate(side)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
              <span>{c.rotateBtn}</span>
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              {c.replaceBtn}
            </button>
            <button
              type="button"
              onClick={() => removeSide(side)}
              aria-label={c.removeBtn}
              className="ml-auto p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const editingTarget = editingSide === 'front' ? front : editingSide === 'back' ? back : null;

  return (
    <ToolShell
      route="/id-card-print"
      title={toolMeta.title[uiLang]}
      subtitle={toolMeta.shortDesc[uiLang]}
      uiLang={uiLang}
      isPro={isPro}
      onBackHome={onBackHome}
      onOpenProModal={onOpenProModal}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Uploads & Print Controls */}
        <div className="lg:col-span-6 space-y-4">
          {renderSideUploader('front', c.frontLabel, c.uploadFrontBtn, front, frontInputRef)}
          {renderSideUploader('back', c.backLabel, c.uploadBackBtn, back, backInputRef)}

          {/* Arrangement & Copies */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-800">{c.layoutLabel}</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLayout('side-by-side')}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    layout === 'side-by-side'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.sideBySide}
                </button>
                <button
                  type="button"
                  onClick={() => setLayout('stacked')}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    layout === 'stacked'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.stacked}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-800">{c.copiesLabel}</div>
              <div className="grid grid-cols-3 gap-2">
                {([1, 2, 4] as CopyCount[]).map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setCopies(cnt)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border tabular-nums transition-colors cursor-pointer ${
                      copies === cnt
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cnt} {cnt === 1 ? c.copyUnit : c.copiesUnit}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCutBorder}
                  onChange={(e) => setShowCutBorder(e.target.checked)}
                  className="rounded border-slate-300 accent-slate-900"
                />
                <span>{c.cutBorderLabel}</span>
              </label>

              <label className="flex items-start gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enhanceText}
                  onChange={(e) => setEnhanceText(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 accent-slate-900"
                />
                <span>
                  <span className="block">{c.enhanceLabel}</span>
                  <span className="block text-[11px] font-normal text-slate-500">{c.enhanceHint}</span>
                </span>
              </label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => void handleDownloadPdf()}
              disabled={isWorking || (!front && !back)}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {isWorking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{c.workingBtn}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{c.downloadPdfBtn}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadJpg}
              disabled={isWorking || (!front && !back)}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              <FileImage className="w-4 h-4" />
              <span>{c.downloadJpgBtn}</span>
            </button>
          </div>

          {hasDownloaded && (
            <WhatsAppShareBar
              uiLang={uiLang}
              route="/id-card-print"
              toolTitle={toolMeta.title[uiLang]}
            />
          )}
        </div>

        {/* Right: Live A4 Sheet Preview */}
        <div className="lg:col-span-6 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{c.previewTitle}</span>
            <span className="text-[11px] font-medium text-slate-500 tabular-nums">A4 · 210 × 297 mm</span>
          </div>

          <div className="bg-slate-200/80 border border-slate-300 rounded-xl p-4 flex items-center justify-center min-h-[380px]">
            {!front && !back ? (
              <div className="text-center space-y-2 max-w-xs py-10">
                <IdCard className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500 leading-relaxed">{c.emptyPreviewHint}</p>
              </div>
            ) : (
              <canvas
                ref={previewCanvasRef}
                className="w-full max-w-[420px] h-auto bg-white shadow-lg rounded-sm border border-slate-200"
              />
            )}
          </div>
        </div>
      </div>

      <PdfImageCropModal
        isOpen={Boolean(editingSide && editingTarget)}
        imageSrc={editingTarget?.previewUrl || ''}
        file={editingTarget?.file || null}
        uiLang={uiLang}
        onClose={() => setEditingSide(null)}
        onApply={(updatedFile) => {
          if (editingSide) {
            updateSideFile(editingSide, updatedFile);
          }
        }}
      />
    </ToolShell>
  );
};
