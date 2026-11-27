import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  AlertCircle,
  Check,
  Crown,
  Download,
  FileText,
  Film,
  Image as ImageIcon,
  ImagePlus,
  Loader2,
  Lock,
  RotateCw,
  Stamp,
  Trash2,
  Type,
  Upload,
} from 'lucide-react';
import { ToolShell } from './ToolShell';
import { WhatsAppShareBar } from './WhatsAppShareBar';
import { pushDataLayerEvent } from '../../utils/gtm';
import { TOOL_CATALOG } from '../../utils/routes';
import { UiLang } from '../../utils/siteI18n';

interface WatermarkAdderToolProps {
  uiLang: UiLang;
  isPro: boolean;
  singleCredits?: number;
  onConsumeSingleCredit?: () => void;
  onBackHome: () => void;
  onOpenProModal: () => void;
  onToolDownload: () => void;
}

type MediaKind = 'image' | 'pdf' | 'video';
type WatermarkKind = 'text' | 'logo';
type PlacementMode =
  | 'tiled'
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface WatermarkConfig {
  kind: WatermarkKind;
  text: string;
  fontSize: number; // px relative to 800px base width
  color: string;
  opacity: number; // 10 - 95
  rotation: number; // -60 to 60 deg
  placement: PlacementMode;
  logoScale: number; // 10 - 55 % of canvas min side
}

interface CopyPack {
  paidBadge: string;
  paidGateTitle: string;
  paidGateDesc: string;
  paidGateCta: string;
  proUnlockedBanner: string;
  singleCreditBanner: string;
  tabImage: string;
  tabPdf: string;
  tabVideo: string;
  uploadTitleImage: string;
  uploadTitlePdf: string;
  uploadTitleVideo: string;
  uploadHintImage: string;
  uploadHintPdf: string;
  uploadHintVideo: string;
  chooseFileBtn: string;
  changeFileBtn: string;
  settingsHeading: string;
  wmTypeLabel: string;
  wmTypeText: string;
  wmTypeLogo: string;
  wmTextLabel: string;
  wmTextPlaceholder: string;
  wmLogoLabel: string;
  wmLogoChooseBtn: string;
  wmLogoChangeBtn: string;
  wmPlacementLabel: string;
  placeTiled: string;
  placeCenter: string;
  placeTopLeft: string;
  placeTopRight: string;
  placeBottomLeft: string;
  placeBottomRight: string;
  wmSizeLabel: string;
  wmLogoScaleLabel: string;
  wmOpacityLabel: string;
  wmRotationLabel: string;
  wmColorLabel: string;
  outputFormatLabel: string;
  previewHeading: string;
  previewEmptyHint: string;
  pdfPagesBadge: string;
  applyDownloadBtn: string;
  unlockToDownloadBtn: string;
  processingBtn: string;
  cancelBtn: string;
  doneImageMsg: string;
  donePdfMsg: string;
  doneVideoMsg: string;
  errFileTypeImage: string;
  errFileTypePdf: string;
  errFileTypeVideo: string;
  errLogoType: string;
  errWatermarkEmpty: string;
  errProcessing: string;
  errVideoUnsupported: string;
  videoExportNote: string;
}

const COPY: Record<UiLang, CopyPack> = {
  en: {
    paidBadge: 'Pro Tool · Paid',
    paidGateTitle: 'Watermark Adder is a SadhanBox Pro Tool',
    paidGateDesc:
      'Customize and preview watermarks on your Images, PDFs, and Videos here. Upgrade to All-Tools Pro Pass (₹49/mo) to export watermarked files without limits.',
    paidGateCta: 'Unlock Pro (₹49)',
    proUnlockedBanner: 'Pro Pass Active — Unlimited Image, PDF & Video Watermarking Unlocked',
    singleCreditBanner: 'Single Pro Download Credit Active — Click below to export your watermarked file',
    tabImage: 'Image',
    tabPdf: 'PDF',
    tabVideo: 'Video',
    uploadTitleImage: 'Upload Photo / Image',
    uploadTitlePdf: 'Upload PDF Document',
    uploadTitleVideo: 'Upload Video File',
    uploadHintImage: 'Supports JPG, PNG, WebP (100% processed in your browser)',
    uploadHintPdf: 'Supports multi-page PDF documents (every page gets watermarked)',
    uploadHintVideo: 'Supports MP4, WebM, MOV (rendered directly in your browser)',
    chooseFileBtn: 'Select File',
    changeFileBtn: 'Change File',
    settingsHeading: 'Watermark Customization',
    wmTypeLabel: 'Watermark Type',
    wmTypeText: 'Custom Text',
    wmTypeLogo: 'Logo / Image',
    wmTextLabel: 'Watermark Text',
    wmTextPlaceholder: 'e.g. CONFIDENTIAL or © Your Brand',
    wmLogoLabel: 'Watermark Logo (PNG / JPG)',
    wmLogoChooseBtn: 'Upload Logo',
    wmLogoChangeBtn: 'Change Logo',
    wmPlacementLabel: 'Placement',
    placeTiled: 'Diagonal Grid',
    placeCenter: 'Center',
    placeTopLeft: 'Top Left',
    placeTopRight: 'Top Right',
    placeBottomLeft: 'Bottom Left',
    placeBottomRight: 'Bottom Right',
    wmSizeLabel: 'Font Size',
    wmLogoScaleLabel: 'Logo Size',
    wmOpacityLabel: 'Opacity',
    wmRotationLabel: 'Rotation',
    wmColorLabel: 'Text Color',
    outputFormatLabel: 'Output Format',
    previewHeading: 'Live Watermark Preview',
    previewEmptyHint: 'Upload an image, PDF, or video on the left to preview your watermark live.',
    pdfPagesBadge: 'pages',
    applyDownloadBtn: 'Apply Watermark & Download',
    unlockToDownloadBtn: 'Unlock Pro to Download',
    processingBtn: 'Applying Watermark...',
    cancelBtn: 'Cancel',
    doneImageMsg: 'Watermarked image downloaded successfully!',
    donePdfMsg: 'Watermarked PDF downloaded successfully!',
    doneVideoMsg: 'Watermarked video exported and downloaded successfully!',
    errFileTypeImage: 'Please select a valid image file (JPG, PNG, or WebP).',
    errFileTypePdf: 'Please select a valid PDF file (.pdf).',
    errFileTypeVideo: 'Please select a valid video file (MP4, WebM, MOV).',
    errLogoType: 'Please select a valid logo image (PNG, JPG, or WebP).',
    errWatermarkEmpty: 'Please enter watermark text or upload a logo image.',
    errProcessing: 'Could not process the file. Please check the file and try again.',
    errVideoUnsupported:
      'Your browser does not support video recording/export. Please try Chrome or Edge on desktop/Android.',
    videoExportNote:
      'Video watermarking plays frames locally in your browser to encode the output file. Keep this tab open until export completes.',
  },
  mr: {
    paidBadge: 'Pro टूल · पेड',
    paidGateTitle: 'वॉटरमार्क ॲडर हे SadhanBox Pro (पेड) टूल आहे',
    paidGateDesc:
      'तुम्ही तुमचा फोटो, PDF किंवा व्हिडिओ अपलोड करून येथे लाइव्ह प्रिव्ह्यू तपासू शकता. वॉटरमार्क लावलेली फाईल डाउनलोड करण्यासाठी ₹49 Pro पास अनलॉक करा.',
    paidGateCta: 'Pro अनलॉक करा (₹49)',
    proUnlockedBanner: 'Pro पास सक्रिय — इमेज, PDF आणि व्हिडिओ वॉटरमार्किंग अमर्याद उपलब्ध',
    singleCreditBanner: '१ सिंगल डाउनलोड क्रेडिट सक्रिय — खालील बटनावर क्लिक करून डाउनलोड करा',
    tabImage: 'फोटो / इमेज',
    tabPdf: 'PDF दस्तऐवज',
    tabVideo: 'व्हिडिओ',
    uploadTitleImage: 'फोटो / इमेज अपलोड करा',
    uploadTitlePdf: 'PDF फाईल अपलोड करा',
    uploadTitleVideo: 'व्हिडिओ फाईल अपलोड करा',
    uploadHintImage: 'JPG, PNG, WebP सपोर्ट (तुमच्याच ब्राउझरमध्ये सुरक्षित प्रक्रिया)',
    uploadHintPdf: 'सर्व पानांवर वॉटरमार्क लावला जाईल (१००% ब्राउझरमध्ये प्रक्रिया)',
    uploadHintVideo: 'MP4, WebM, MOV सपोर्ट (तुमच्याच डिव्हाइसवर एक्सपोर्ट)',
    chooseFileBtn: 'फाईल निवडा',
    changeFileBtn: 'फाईल बदला',
    settingsHeading: 'वॉटरमार्क सेटिंग्ज',
    wmTypeLabel: 'वॉटरमार्क प्रकार',
    wmTypeText: 'मजकूर (Text)',
    wmTypeLogo: 'लोगो / फोटो',
    wmTextLabel: 'वॉटरमार्क मजकूर',
    wmTextPlaceholder: 'उदा. CONFIDENTIAL किंवा तुमचे नाव / ब्रँड',
    wmLogoLabel: 'वॉटरमार्क लोगो (PNG / JPG)',
    wmLogoChooseBtn: 'लोगो अपलोड करा',
    wmLogoChangeBtn: 'लोगो बदला',
    wmPlacementLabel: 'स्थान (Placement)',
    placeTiled: 'तिरका ग्रिड',
    placeCenter: 'मध्यभागी',
    placeTopLeft: 'वर डावीकडे',
    placeTopRight: 'वर उजवीकडे',
    placeBottomLeft: 'खाली डावीकडे',
    placeBottomRight: 'खाली उजवीकडे',
    wmSizeLabel: 'फॉन्ट आकार',
    wmLogoScaleLabel: 'लोगो आकार',
    wmOpacityLabel: 'पारदर्शकता (Opacity)',
    wmRotationLabel: 'कोन (Rotation)',
    wmColorLabel: 'रंग',
    outputFormatLabel: 'आउटपुट फॉरमॅट',
    previewHeading: 'लाइव्ह वॉटरमार्क प्रिव्ह्यू',
    previewEmptyHint: 'वॉटरमार्क तपासण्यासाठी डाव्या बाजूला फोटो, PDF किंवा व्हिडिओ निवडा.',
    pdfPagesBadge: 'पाने',
    applyDownloadBtn: 'वॉटरमार्क लावा व डाउनलोड करा',
    unlockToDownloadBtn: 'डाउनलोडसाठी Pro अनलॉक करा',
    processingBtn: 'वॉटरमार्क लागत आहे...',
    cancelBtn: 'रद्द करा',
    doneImageMsg: 'वॉटरमार्कसह इमेज यशस्वीरित्या डाउनलोड झाली!',
    donePdfMsg: 'वॉटरमार्कसह PDF यशस्वीरित्या डाउनलोड झाली!',
    doneVideoMsg: 'वॉटरमार्कसह व्हिडिओ एक्सपोर्ट व डाउनलोड झाला!',
    errFileTypeImage: 'कृपया वैध इमेज फाईल (JPG, PNG, WebP) निवडा.',
    errFileTypePdf: 'कृपया वैध PDF फाईल (.pdf) निवडा.',
    errFileTypeVideo: 'कृपया वैध व्हिडिओ फाईल (MP4, WebM, MOV) निवडा.',
    errLogoType: 'कृपया वैध लोगो इमेज (PNG, JPG, WebP) निवडा.',
    errWatermarkEmpty: 'कृपया वॉटरमार्क मजकूर टाका किंवा लोगो अपलोड करा.',
    errProcessing: 'फाईलवर प्रक्रिया करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
    errVideoUnsupported:
      'तुमच्या ब्राउझरमध्ये व्हिडिओ रेकॉर्डिंग सपोर्ट उपलब्ध नाही. कृपया Chrome किंवा Edge वापरा.',
    videoExportNote:
      'व्हिडिओ वॉटरमार्किंगसाठी फ्रेम्स तुमच्या ब्राउझरमध्ये रेंडर होतात. प्रक्रिया पूर्ण होईपर्यंत हा टॅब उघडा ठेवा.',
  },
  hi: {
    paidBadge: 'Pro टूल · पेड',
    paidGateTitle: 'वॉटरमार्क ऐडर एक SadhanBox Pro (पेड) टूल है',
    paidGateDesc:
      'आप अपनी फोटो, PDF और वीडियो अपलोड करके लाइव प्रीव्यू देख सकते हैं। वॉटरमार्क लगी फाइल डाउनलोड करने के लिए ₹49 Pro पास अनलॉक करें।',
    paidGateCta: 'Pro अनलॉक करें (₹49)',
    proUnlockedBanner: 'Pro पास सक्रिय — इमेज, PDF और वीडियो वॉटरमार्किंग अनलिमिटेड उपलब्ध',
    singleCreditBanner: '१ सिंगल डाउनलोड क्रेडिट सक्रिय — नीचे क्लिक करके वॉटरमार्क फाइल डाउनलोड करें',
    tabImage: 'इमेज / फोटो',
    tabPdf: 'PDF दस्तावेज़',
    tabVideo: 'वीडियो',
    uploadTitleImage: 'फोटो / इमेज अपलोड करें',
    uploadTitlePdf: 'PDF फाइल अपलोड करें',
    uploadTitleVideo: 'वीडियो फाइल अपलोड करें',
    uploadHintImage: 'JPG, PNG, WebP सपोर्ट (आपके ब्राउज़र में सुरक्षित प्रोसेसिंग)',
    uploadHintPdf: 'सभी पेजों पर वॉटरमार्क लगेगा (१००% ब्राउज़र में प्रोसेसिंग)',
    uploadHintVideo: 'MP4, WebM, MOV सपोर्ट (सीधे ब्राउज़र में एक्सपोर्ट)',
    chooseFileBtn: 'फाइल चुनें',
    changeFileBtn: 'फाइल बदलें',
    settingsHeading: 'वॉटरमार्क कस्टमाइज़ेशन',
    wmTypeLabel: 'वॉटरमार्क प्रकार',
    wmTypeText: 'कस्टम टेक्स्ट',
    wmTypeLogo: 'लोगो / इमेज',
    wmTextLabel: 'वॉटरमार्क टेक्स्ट',
    wmTextPlaceholder: 'जैसे CONFIDENTIAL या आपका ब्रांड नाम',
    wmLogoLabel: 'वॉटरमार्क लोगो (PNG / JPG)',
    wmLogoChooseBtn: 'लोगो अपलोड करें',
    wmLogoChangeBtn: 'लोगो बदलें',
    wmPlacementLabel: 'स्थिति (Placement)',
    placeTiled: 'तिरछा ग्रिड',
    placeCenter: 'बीच में',
    placeTopLeft: 'ऊपर बाएं',
    placeTopRight: 'ऊपर दाएं',
    placeBottomLeft: 'नीचे बाएं',
    placeBottomRight: 'नीचे दाएं',
    wmSizeLabel: 'फ़ॉन्ट आकार',
    wmLogoScaleLabel: 'लोगो आकार',
    wmOpacityLabel: 'पारदर्शिता (Opacity)',
    wmRotationLabel: 'घुमाव (Rotation)',
    wmColorLabel: 'रंग',
    outputFormatLabel: 'आउटपुट फॉर्मेट',
    previewHeading: 'लाइव वॉटरमार्क प्रीव्यू',
    previewEmptyHint: 'लाइव प्रीव्यू देखने के लिए बाईं ओर फोटो, PDF या वीडियो अपलोड करें।',
    pdfPagesBadge: 'पेज',
    applyDownloadBtn: 'वॉटरमार्क लगाएं और डाउनलोड करें',
    unlockToDownloadBtn: 'डाउनलोड के लिए Pro अनलॉक करें',
    processingBtn: 'वॉटरमार्क लग रहा है...',
    cancelBtn: 'रद्द करें',
    doneImageMsg: 'वॉटरमार्क वाली इमेज सफलतापूर्वक डाउनलोड हो गई!',
    donePdfMsg: 'वॉटरमार्क वाली PDF सफलतापूर्वक डाउनलोड हो गई!',
    doneVideoMsg: 'वॉटरमार्क वाला वीडियो एक्सपोर्ट और डाउनलोड हो गया!',
    errFileTypeImage: 'कृपया एक मान्य इमेज फाइल (JPG, PNG, WebP) चुनें।',
    errFileTypePdf: 'कृपया एक मान्य PDF फाइल (.pdf) चुनें।',
    errFileTypeVideo: 'कृपया एक मान्य वीडियो फाइल (MP4, WebM, MOV) चुनें।',
    errLogoType: 'कृपया एक मान्य लोगो इमेज (PNG, JPG, WebP) चुनें।',
    errWatermarkEmpty: 'कृपया वॉटरमार्क टेक्स्ट दर्ज करें या लोगो अपलोड करें।',
    errProcessing: 'फाइल प्रोसेस नहीं हो सकी। कृपया दूसरी फाइल आज़माएं।',
    errVideoUnsupported:
      'आपका ब्राउज़र वीडियो रिकॉर्डिंग एक्सपोर्ट को सपोर्ट नहीं करता। कृपया Chrome या Edge उपयोग करें।',
    videoExportNote:
      'वीडियो वॉटरमार्किंग के लिए फ्रेम आपके ब्राउज़र में रेंडर होते हैं। एक्सपोर्ट पूरा होने तक यह टैब खुला रखें।',
  },
};

const COLOR_PRESETS = ['#FFFFFF', '#0F172A', '#1E40AF', '#DC2626', '#D97706'];

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function drawWatermarkOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: WatermarkConfig,
  logoImg: HTMLImageElement | null
) {
  const trimmedText = config.text.trim();
  if (config.kind === 'text' && !trimmedText) return;
  if (config.kind === 'logo' && !logoImg) return;

  const baseScale = Math.max(0.45, Math.min(width, height) / 720);
  const angleRad = (config.rotation * Math.PI) / 180;
  const scaledFontSize = Math.max(12, Math.round(config.fontSize * baseScale));

  let stampWidth = 0;
  let stampHeight = 0;

  ctx.save();
  ctx.globalAlpha = Math.min(1, Math.max(0.05, config.opacity / 100));

  if (config.kind === 'text') {
    ctx.font = `700 ${scaledFontSize}px "Plus Jakarta Sans", "Noto Sans Devanagari", system-ui, sans-serif`;
    ctx.fillStyle = config.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const metrics = ctx.measureText(trimmedText);
    stampWidth = Math.max(40, metrics.width);
    stampHeight = scaledFontSize * 1.2;
  } else if (logoImg) {
    const targetMax = Math.max(28, (Math.min(width, height) * config.logoScale) / 100);
    const ratio = (logoImg.naturalWidth || 1) / (logoImg.naturalHeight || 1);
    if (ratio >= 1) {
      stampWidth = targetMax;
      stampHeight = targetMax / ratio;
    } else {
      stampHeight = targetMax;
      stampWidth = targetMax * ratio;
    }
  }

  const drawSingleAt = (cx: number, cy: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angleRad);
    if (config.kind === 'text') {
      ctx.shadowColor = config.color.toLowerCase() === '#ffffff' ? 'rgba(15,23,42,0.35)' : 'rgba(255,255,255,0.2)';
      ctx.shadowBlur = Math.max(2, scaledFontSize * 0.08);
      ctx.fillText(trimmedText, 0, 0);
    } else if (logoImg) {
      ctx.drawImage(logoImg, -stampWidth / 2, -stampHeight / 2, stampWidth, stampHeight);
    }
    ctx.restore();
  };

  if (config.placement === 'tiled') {
    const stepX = Math.max(stampWidth + Math.round(80 * baseScale), Math.round(width / 3.1));
    const stepY = Math.max(stampHeight + Math.round(90 * baseScale), Math.round(height / 4.2));
    for (let y = -height * 0.25, row = 0; y <= height * 1.25; y += stepY, row++) {
      const rowOffset = row % 2 === 1 ? stepX * 0.5 : 0;
      for (let x = -width * 0.25 + rowOffset; x <= width * 1.25; x += stepX) {
        drawSingleAt(x, y);
      }
    }
  } else {
    const marginX = Math.max(24, Math.round(width * 0.05) + stampWidth / 2);
    const marginY = Math.max(24, Math.round(height * 0.05) + stampHeight / 2);
    let cx = width / 2;
    let cy = height / 2;
    if (config.placement === 'top-left') {
      cx = Math.min(width / 2, marginX);
      cy = Math.min(height / 2, marginY);
    } else if (config.placement === 'top-right') {
      cx = Math.max(width / 2, width - marginX);
      cy = Math.min(height / 2, marginY);
    } else if (config.placement === 'bottom-left') {
      cx = Math.min(width / 2, marginX);
      cy = Math.max(height / 2, height - marginY);
    } else if (config.placement === 'bottom-right') {
      cx = Math.max(width / 2, width - marginX);
      cy = Math.max(height / 2, height - marginY);
    }
    drawSingleAt(cx, cy);
  }

  ctx.restore();
}

export const WatermarkAdderTool: React.FC<WatermarkAdderToolProps> = ({
  uiLang,
  isPro,
  singleCredits = 0,
  onConsumeSingleCredit,
  onBackHome,
  onOpenProModal,
  onToolDownload,
}) => {
  const c = COPY[uiLang] || COPY.en;
  const toolMeta = TOOL_CATALOG.find((t) => t.route === '/watermark-adder')!;
  const canExport = isPro || singleCredits > 0;

  const [mediaKind, setMediaKind] = useState<MediaKind>('image');
  const [config, setConfig] = useState<WatermarkConfig>({
    kind: 'text',
    text: 'CONFIDENTIAL',
    fontSize: 38,
    color: '#FFFFFF',
    opacity: 35,
    rotation: -30,
    placement: 'tiled',
    logoScale: 24,
  });

  // Logo watermark state
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [logoElement, setLogoElement] = useState<HTMLImageElement | null>(null);

  // Image state
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [imageExportFormat, setImageExportFormat] = useState<'image/png' | 'image/jpeg'>('image/png');
  const imagePreviewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // PDF state
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPageCount, setPdfPageCount] = useState<number>(0);
  const [pdfFirstPageSize, setPdfFirstPageSize] = useState<{ width: number; height: number }>({
    width: 595,
    height: 842,
  });
  const pdfPreviewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Video state
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);
  const videoOverlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number }>({
    width: 1280,
    height: 720,
  });
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const cancelVideoRef = useRef<boolean>(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const pendingDownloadAfterUnlockRef = useRef<boolean>(false);

  // Cleanup object URLs on unmount
  const urlsRef = useRef<{ logo: string; img: string; vid: string }>({ logo: '', img: '', vid: '' });
  urlsRef.current = { logo: logoUrl, img: imageUrl, vid: videoUrl };
  useEffect(() => {
    return () => {
      if (urlsRef.current.logo) URL.revokeObjectURL(urlsRef.current.logo);
      if (urlsRef.current.img) URL.revokeObjectURL(urlsRef.current.img);
      if (urlsRef.current.vid) URL.revokeObjectURL(urlsRef.current.vid);
      cancelVideoRef.current = true;
    };
  }, []);

  const clearFeedback = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Handle logo upload
  const handleLogoSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
      setErrorMsg(c.errLogoType);
      return;
    }
    clearFeedback();
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    const nextUrl = URL.createObjectURL(file);
    setLogoUrl(nextUrl);

    const img = new Image();
    img.onload = () => setLogoElement(img);
    img.onerror = () => setErrorMsg(c.errLogoType);
    img.src = nextUrl;
  };

  // Handle target media upload
  const handleMediaSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    clearFeedback();

    if (mediaKind === 'image') {
      if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
        setErrorMsg(c.errFileTypeImage);
        return;
      }
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      const nextUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImageUrl(nextUrl);
      setImageExportFormat(file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png');
      const img = new Image();
      img.onload = () => setImageElement(img);
      img.onerror = () => setErrorMsg(c.errFileTypeImage);
      img.src = nextUrl;
      return;
    }

    if (mediaKind === 'pdf') {
      if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
        setErrorMsg(c.errFileTypePdf);
        return;
      }
      try {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = doc.getPages();
        const first = pages[0];
        const size = first ? first.getSize() : { width: 595, height: 842 };
        setPdfFile(file);
        setPdfPageCount(pages.length);
        setPdfFirstPageSize({ width: size.width, height: size.height });
      } catch {
        setErrorMsg(c.errFileTypePdf);
      }
      return;
    }

    if (mediaKind === 'video') {
      if (!file.type.startsWith('video/') && !/\.(mp4|webm|mov|m4v)$/i.test(file.name)) {
        setErrorMsg(c.errFileTypeVideo);
        return;
      }
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      const nextUrl = URL.createObjectURL(file);
      setVideoFile(file);
      setVideoUrl(nextUrl);
    }
  };

  // Render live Image preview canvas
  useEffect(() => {
    if (mediaKind !== 'image' || !imageElement || !imagePreviewCanvasRef.current) return;
    const canvas = imagePreviewCanvasRef.current;
    const maxPreview = 900;
    const natW = imageElement.naturalWidth || 800;
    const natH = imageElement.naturalHeight || 600;
    const scale = Math.min(1, maxPreview / Math.max(natW, natH));
    canvas.width = Math.max(1, Math.round(natW * scale));
    canvas.height = Math.max(1, Math.round(natH * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    drawWatermarkOnCanvas(ctx, canvas.width, canvas.height, config, logoElement);
  }, [mediaKind, imageElement, config, logoElement]);

  // Render live PDF preview canvas
  useEffect(() => {
    if (mediaKind !== 'pdf' || !pdfFile || !pdfPreviewCanvasRef.current) return;
    const canvas = pdfPreviewCanvasRef.current;
    const maxPreview = 640;
    const ratio = pdfFirstPageSize.width / Math.max(1, pdfFirstPageSize.height);
    const w = ratio >= 1 ? maxPreview : Math.round(maxPreview * ratio);
    const h = ratio >= 1 ? Math.round(maxPreview / ratio) : maxPreview;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // Subtle simulated document lines for visual reference
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(w * 0.1, h * 0.1, w * 0.45, Math.max(8, h * 0.025));
    ctx.fillStyle = '#F1F5F9';
    for (let i = 0; i < 9; i++) {
      const lineW = i % 3 === 2 ? w * 0.58 : w * 0.8;
      ctx.fillRect(w * 0.1, h * (0.18 + i * 0.065), lineW, Math.max(5, h * 0.015));
    }

    drawWatermarkOnCanvas(ctx, w, h, config, logoElement);
  }, [mediaKind, pdfFile, pdfFirstPageSize, config, logoElement]);

  // Render live Video watermark overlay canvas
  const syncVideoOverlay = useCallback(() => {
    if (mediaKind !== 'video' || !videoFile || !videoOverlayCanvasRef.current) return;
    const canvas = videoOverlayCanvasRef.current;
    const w = Math.max(320, videoDimensions.width);
    const h = Math.max(180, videoDimensions.height);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    drawWatermarkOnCanvas(ctx, w, h, config, logoElement);
  }, [mediaKind, videoFile, videoDimensions, config, logoElement]);

  useEffect(() => {
    syncVideoOverlay();
  }, [syncVideoOverlay]);

  const validateWatermarkReady = (): boolean => {
    if (config.kind === 'text' && !config.text.trim()) {
      setErrorMsg(c.errWatermarkEmpty);
      return false;
    }
    if (config.kind === 'logo' && !logoElement) {
      setErrorMsg(c.errWatermarkEmpty);
      return false;
    }
    return true;
  };

  const handleExportImage = async () => {
    if (!imageElement || !imageFile) return;
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.naturalWidth || imageElement.width;
    canvas.height = imageElement.naturalHeight || imageElement.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');

    if (imageExportFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    drawWatermarkOnCanvas(ctx, canvas.width, canvas.height, config, logoElement);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Image export failed'))),
        imageExportFormat,
        0.95
      );
    });
    const baseName = imageFile.name.replace(/\.[^.]+$/, '') || 'sadhanbox-image';
    const ext = imageExportFormat === 'image/jpeg' ? 'jpg' : 'png';
    triggerDownload(blob, `${baseName}-watermarked.${ext}`);
    setSuccessMsg(c.doneImageMsg);
  };

  const handleExportPdf = async () => {
    if (!pdfFile) return;
    const bytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const stampCache = new Map<string, Awaited<ReturnType<typeof pdfDoc.embedPng>>>();

    for (const page of pages) {
      const { width, height } = page.getSize();
      const key = `${Math.round(width)}x${Math.round(height)}`;
      let embeddedStamp = stampCache.get(key);

      if (!embeddedStamp) {
        const scale = Math.min(2, 1800 / Math.max(width, height));
        const stampCanvas = document.createElement('canvas');
        stampCanvas.width = Math.max(1, Math.round(width * scale));
        stampCanvas.height = Math.max(1, Math.round(height * scale));
        const ctx = stampCanvas.getContext('2d');
        if (!ctx) throw new Error('Canvas unavailable');
        ctx.clearRect(0, 0, stampCanvas.width, stampCanvas.height);
        drawWatermarkOnCanvas(
          ctx,
          stampCanvas.width,
          stampCanvas.height,
          config,
          logoElement
        );
        const pngBlob = await new Promise<Blob>((resolve, reject) => {
          stampCanvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('PDF stamp failed'))),
            'image/png',
            1
          );
        });
        embeddedStamp = await pdfDoc.embedPng(await pngBlob.arrayBuffer());
        stampCache.set(key, embeddedStamp);
      }

      page.drawImage(embeddedStamp, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }

    const outBytes = await pdfDoc.save();
    const safeBuffer = new Uint8Array(outBytes).buffer;
    const blob = new Blob([safeBuffer], { type: 'application/pdf' });
    const baseName = pdfFile.name.replace(/\.[^.]+$/, '') || 'sadhanbox-document';
    triggerDownload(blob, `${baseName}-watermarked.pdf`);
    setSuccessMsg(c.donePdfMsg);
  };

  const handleExportVideo = async () => {
    if (!videoFile || !videoUrl) return;
    if (typeof MediaRecorder === 'undefined') {
      setErrorMsg(c.errVideoUnsupported);
      return;
    }

    cancelVideoRef.current = false;
    setVideoProgress(1);

    const hiddenVideo = document.createElement('video');
    hiddenVideo.playsInline = true;
    hiddenVideo.muted = true;
    hiddenVideo.preload = 'auto';
    hiddenVideo.style.cssText =
      'position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0.01;pointer-events:none;';
    document.body.appendChild(hiddenVideo);

    let combinedStream: MediaStream | null = null;

    try {
      await new Promise<void>((resolve, reject) => {
        hiddenVideo.onloadedmetadata = () => resolve();
        hiddenVideo.onerror = () => reject(new Error('Video load failed'));
        hiddenVideo.src = videoUrl;
        hiddenVideo.load();
      });

      const natW = hiddenVideo.videoWidth || 1280;
      const natH = hiddenVideo.videoHeight || 720;
      const maxDim = 1280;
      const scale = Math.min(1, maxDim / Math.max(natW, natH));
      const outW = Math.max(2, Math.round((natW * scale) / 2) * 2);
      const outH = Math.max(2, Math.round((natH * scale) / 2) * 2);

      const compCanvas = document.createElement('canvas');
      compCanvas.width = outW;
      compCanvas.height = outH;
      const ctx = compCanvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');

      const canvasStream = compCanvas.captureStream(30);
      const videoOnlyStream = new MediaStream([...canvasStream.getVideoTracks()]);
      const tracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];

      try {
        const capFn =
          (hiddenVideo as HTMLVideoElement & { captureStream?: () => MediaStream }).captureStream ||
          (hiddenVideo as HTMLVideoElement & { mozCaptureStream?: () => MediaStream })
            .mozCaptureStream;
        if (typeof capFn === 'function') {
          const mediaStream = capFn.call(hiddenVideo);
          for (const audioTrack of mediaStream.getAudioTracks()) {
            tracks.push(audioTrack);
          }
        }
      } catch {
        // Proceed with video stream cleanly if audio capture is unavailable
      }

      combinedStream = new MediaStream(tracks);
      const mimeCandidates = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4;codecs=avc1',
        'video/mp4',
      ];

      let chosenMime = '';
      let recorder: MediaRecorder | null = null;

      for (const candidate of mimeCandidates) {
        if (!MediaRecorder.isTypeSupported(candidate)) continue;
        try {
          recorder = new MediaRecorder(combinedStream, {
            mimeType: candidate,
            videoBitsPerSecond: 4_000_000,
          });
          chosenMime = candidate;
          break;
        } catch {
          // Try next codec or fallback stream
        }
      }

      if (!recorder) {
        try {
          recorder = new MediaRecorder(combinedStream);
          chosenMime = recorder.mimeType || 'video/webm';
        } catch {
          combinedStream = videoOnlyStream;
          recorder = new MediaRecorder(videoOnlyStream);
          chosenMime = recorder.mimeType || 'video/webm';
        }
      }

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunks.push(ev.data);
      };

      const recordedPromise = new Promise<Blob>((resolve) => {
        recorder!.onstop = () => {
          resolve(new Blob(chunks, { type: chosenMime || 'video/webm' }));
        };
      });

      hiddenVideo.currentTime = 0;
      recorder.start(250);

      let rafId = 0;
      const drawFrame = () => {
        if (cancelVideoRef.current) {
          hiddenVideo.pause();
          if (recorder && recorder.state !== 'inactive') recorder.stop();
          return;
        }
        ctx.drawImage(hiddenVideo, 0, 0, outW, outH);
        drawWatermarkOnCanvas(ctx, outW, outH, config, logoElement);
        if (hiddenVideo.duration > 0) {
          setVideoProgress(
            Math.min(
              99,
              Math.max(1, Math.round((hiddenVideo.currentTime / hiddenVideo.duration) * 100))
            )
          );
        }
        if (!hiddenVideo.ended && !hiddenVideo.paused) {
          rafId = requestAnimationFrame(drawFrame);
        }
      };

      await hiddenVideo.play();
      rafId = requestAnimationFrame(drawFrame);

      await new Promise<void>((resolve) => {
        const checkCancel = window.setInterval(() => {
          if (cancelVideoRef.current) {
            window.clearInterval(checkCancel);
            resolve();
          }
        }, 150);
        hiddenVideo.onended = () => {
          window.clearInterval(checkCancel);
          resolve();
        };
      });

      cancelAnimationFrame(rafId);
      if (recorder.state !== 'inactive') {
        recorder.stop();
      }

      const outBlob = await recordedPromise;

      if (cancelVideoRef.current) {
        setVideoProgress(0);
        return;
      }

      setVideoProgress(100);
      const baseName = videoFile.name.replace(/\.[^.]+$/, '') || 'sadhanbox-video';
      const ext = chosenMime.includes('mp4') ? 'mp4' : 'webm';
      triggerDownload(outBlob, `${baseName}-watermarked.${ext}`);
      setSuccessMsg(c.doneVideoMsg);
    } finally {
      if (combinedStream) {
        combinedStream.getTracks().forEach((t) => t.stop());
      }
      if (hiddenVideo.parentNode) {
        hiddenVideo.parentNode.removeChild(hiddenVideo);
      }
    }
  };

  const runWatermarkExport = async () => {
    clearFeedback();
    const mediaReady =
      (mediaKind === 'image' && Boolean(imageElement)) ||
      (mediaKind === 'pdf' && Boolean(pdfFile)) ||
      (mediaKind === 'video' && Boolean(videoFile));
    if (!mediaReady) return;
    if (!validateWatermarkReady()) return;

    setIsProcessing(true);
    try {
      if (mediaKind === 'image') {
        await handleExportImage();
      } else if (mediaKind === 'pdf') {
        await handleExportPdf();
      } else {
        await handleExportVideo();
      }
      if (!cancelVideoRef.current) {
        if (!isPro && singleCredits > 0) {
          onConsumeSingleCredit?.();
        }
        pushDataLayerEvent('file_download', {
          document_type: `watermarked_${mediaKind}`,
          watermark_kind: config.kind,
          watermark_placement: config.placement,
        });
        onToolDownload();
      }
    } catch {
      setErrorMsg(c.errProcessing);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (canExport && pendingDownloadAfterUnlockRef.current && !isProcessing) {
      pendingDownloadAfterUnlockRef.current = false;
      void runWatermarkExport();
    }
  });

  const handleApplyAndDownload = async () => {
    clearFeedback();
    if (!validateWatermarkReady()) return;
    if (!canExport) {
      pendingDownloadAfterUnlockRef.current = true;
      onOpenProModal();
      return;
    }
    await runWatermarkExport();
  };

  const hasCurrentMedia =
    (mediaKind === 'image' && Boolean(imageElement)) ||
    (mediaKind === 'pdf' && Boolean(pdfFile)) ||
    (mediaKind === 'video' && Boolean(videoFile));

  const currentFileName =
    mediaKind === 'image'
      ? imageFile?.name
      : mediaKind === 'pdf'
      ? pdfFile?.name
      : videoFile?.name;

  return (
    <ToolShell
      route="/watermark-adder"
      title={toolMeta.title[uiLang]}
      subtitle={toolMeta.shortDesc[uiLang]}
      uiLang={uiLang}
      isPro={isPro}
      onBackHome={onBackHome}
      onOpenProModal={onOpenProModal}
    >
      <div className="space-y-5">
        {/* Paid / Pro Status Banner */}
        {!canExport ? (
          <div className="bg-amber-50 border border-[#F59E0B]/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4 text-[#D97706]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                    {c.paidGateTitle}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-amber-200/80 border border-[#F59E0B]/40 px-1.5 py-0.5 text-[10px] font-extrabold text-[#B45309]">
                    <Crown className="w-2.5 h-2.5 text-[#D97706]" />
                    {c.paidBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-0.5">{c.paidGateDesc}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenProModal}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:brightness-105 rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{c.paidGateCta}</span>
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Crown className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{isPro ? c.proUnlockedBanner : c.singleCreditBanner}</span>
          </div>
        )}

        {/* Media Type Tabs: Image | PDF | Video */}
        <div
          role="tablist"
          aria-label="Watermark Media Type"
          className="inline-flex flex-wrap p-1 bg-slate-100 border border-slate-200 rounded-xl gap-1"
        >
          {(
            [
              { id: 'image', label: c.tabImage, icon: <ImageIcon className="w-4 h-4" /> },
              { id: 'pdf', label: c.tabPdf, icon: <FileText className="w-4 h-4" /> },
              { id: 'video', label: c.tabVideo, icon: <Film className="w-4 h-4" /> },
            ] as const
          ).map((tab) => {
            const active = mediaKind === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  clearFeedback();
                  setMediaKind(tab.id);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  active
                    ? 'bg-white text-[#1E40AF] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            void handleMediaSelected(e.target.files);
            e.target.value = '';
          }}
          className="hidden"
        />
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={(e) => {
            void handleMediaSelected(e.target.files);
            e.target.value = '';
          }}
          className="hidden"
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/*"
          onChange={(e) => {
            void handleMediaSelected(e.target.files);
            e.target.value = '';
          }}
          className="hidden"
        />
        <input
          ref={logoInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            handleLogoSelected(e.target.files);
            e.target.value = '';
          }}
          className="hidden"
        />

        {/* Main 2-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Upload & Watermark Controls */}
          <div className="lg:col-span-5 space-y-4">
            {/* Target File Upload Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                  {mediaKind === 'image'
                    ? c.uploadTitleImage
                    : mediaKind === 'pdf'
                    ? c.uploadTitlePdf
                    : c.uploadTitleVideo}
                </h2>
                {hasCurrentMedia && (
                  <button
                    type="button"
                    onClick={() => {
                      if (mediaKind === 'image') imageInputRef.current?.click();
                      else if (mediaKind === 'pdf') pdfInputRef.current?.click();
                      else videoInputRef.current?.click();
                    }}
                    className="text-xs font-semibold text-[#1E40AF] hover:underline cursor-pointer"
                  >
                    {c.changeFileBtn}
                  </button>
                )}
              </div>

              {!hasCurrentMedia ? (
                <div className="border-2 border-dashed border-slate-300 bg-white rounded-xl p-5 text-center space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-600">
                    {mediaKind === 'image'
                      ? c.uploadHintImage
                      : mediaKind === 'pdf'
                      ? c.uploadHintPdf
                      : c.uploadHintVideo}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (mediaKind === 'image') imageInputRef.current?.click();
                      else if (mediaKind === 'pdf') pdfInputRef.current?.click();
                      else videoInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#1E40AF] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{c.chooseFileBtn}</span>
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {currentFileName}
                    </div>
                    {mediaKind === 'pdf' && pdfPageCount > 0 && (
                      <div className="text-[11px] text-slate-500 tabular-nums">
                        {pdfPageCount} {c.pdfPagesBadge}
                      </div>
                    )}
                    {mediaKind === 'image' && imageElement && (
                      <div className="text-[11px] text-slate-500 tabular-nums">
                        {imageElement.naturalWidth} × {imageElement.naturalHeight} px
                      </div>
                    )}
                    {mediaKind === 'video' && (
                      <div className="text-[11px] text-slate-500 tabular-nums">
                        {videoDimensions.width} × {videoDimensions.height} px
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      clearFeedback();
                      if (mediaKind === 'image') {
                        if (imageUrl) URL.revokeObjectURL(imageUrl);
                        setImageFile(null);
                        setImageUrl('');
                        setImageElement(null);
                      } else if (mediaKind === 'pdf') {
                        setPdfFile(null);
                        setPdfPageCount(0);
                      } else {
                        if (videoUrl) URL.revokeObjectURL(videoUrl);
                        setVideoFile(null);
                        setVideoUrl('');
                      }
                    }}
                    aria-label="Remove file"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Watermark Settings Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900">
                <Stamp className="w-4 h-4 text-amber-600" />
                <span>{c.settingsHeading}</span>
              </div>

              {/* Watermark Type: Text vs Logo */}
              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-slate-700">{c.wmTypeLabel}</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, kind: 'text' }))}
                    className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                      config.kind === 'text'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>{c.wmTypeText}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, kind: 'logo' }))}
                    className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                      config.kind === 'logo'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <ImagePlus className="w-3.5 h-3.5" />
                    <span>{c.wmTypeLogo}</span>
                  </button>
                </div>
              </div>

              {/* Text Input OR Logo Upload */}
              {config.kind === 'text' ? (
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="wm-adder-text-input"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      {c.wmTextLabel}
                    </label>
                    <input
                      id="wm-adder-text-input"
                      type="text"
                      maxLength={60}
                      value={config.text}
                      onChange={(e) => setConfig((prev) => ({ ...prev, text: e.target.value }))}
                      placeholder={c.wmTextPlaceholder}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>

                  {/* Color Picker */}
                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {c.wmColorLabel}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {COLOR_PRESETS.map((hex) => {
                        const active = config.color.toLowerCase() === hex.toLowerCase();
                        return (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => setConfig((prev) => ({ ...prev, color: hex }))}
                            aria-label={`Color ${hex}`}
                            className={`w-7 h-7 rounded-lg border cursor-pointer transition-transform ${
                              active
                                ? 'ring-2 ring-slate-900 ring-offset-1 scale-105 border-slate-900'
                                : 'border-slate-300'
                            }`}
                            style={{ backgroundColor: hex }}
                          />
                        );
                      })}
                      <input
                        type="color"
                        value={config.color}
                        onChange={(e) => setConfig((prev) => ({ ...prev, color: e.target.value }))}
                        aria-label={c.wmColorLabel}
                        className="w-8 h-7 rounded-lg border border-slate-300 cursor-pointer bg-white p-0.5"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-slate-700">
                    {c.wmLogoLabel}
                  </span>
                  <div className="flex items-center gap-3">
                    {logoUrl && (
                      <img
                        src={logoUrl}
                        alt="Watermark Logo"
                        className="w-12 h-12 rounded-lg border border-slate-200 object-contain bg-slate-50 p-1 shrink-0"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      <ImagePlus className="w-3.5 h-3.5" />
                      <span>{logoUrl ? c.wmLogoChangeBtn : c.wmLogoChooseBtn}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Placement Options */}
              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-slate-700">
                  {c.wmPlacementLabel}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: 'tiled', label: c.placeTiled },
                      { id: 'center', label: c.placeCenter },
                      { id: 'top-left', label: c.placeTopLeft },
                      { id: 'top-right', label: c.placeTopRight },
                      { id: 'bottom-left', label: c.placeBottomLeft },
                      { id: 'bottom-right', label: c.placeBottomRight },
                    ] as const
                  ).map((item) => {
                    const active = config.placement === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, placement: item.id }))}
                        className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliders: Size, Opacity, Rotation */}
              <div className="space-y-3 pt-1">
                {config.kind === 'text' ? (
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>{c.wmSizeLabel}</span>
                      <span className="tabular-nums text-slate-900">{config.fontSize} px</span>
                    </div>
                    <input
                      type="range"
                      min={14}
                      max={96}
                      step={2}
                      value={config.fontSize}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, fontSize: Number(e.target.value) }))
                      }
                      className="w-full accent-[#1E40AF] cursor-pointer"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>{c.wmLogoScaleLabel}</span>
                      <span className="tabular-nums text-slate-900">{config.logoScale}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={55}
                      step={1}
                      value={config.logoScale}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, logoScale: Number(e.target.value) }))
                      }
                      className="w-full accent-[#1E40AF] cursor-pointer"
                    />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{c.wmOpacityLabel}</span>
                    <span className="tabular-nums text-slate-900">{config.opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={95}
                    step={5}
                    value={config.opacity}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, opacity: Number(e.target.value) }))
                    }
                    className="w-full accent-[#1E40AF] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span className="inline-flex items-center gap-1">
                      <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>{c.wmRotationLabel}</span>
                    </span>
                    <span className="tabular-nums text-slate-900">{config.rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min={-60}
                    max={60}
                    step={5}
                    value={config.rotation}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, rotation: Number(e.target.value) }))
                    }
                    className="w-full accent-[#1E40AF] cursor-pointer"
                  />
                </div>
              </div>

              {/* Image Output Format */}
              {mediaKind === 'image' && (
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700">
                    {c.outputFormatLabel}
                  </span>
                  <div className="inline-flex p-0.5 bg-slate-100 rounded-lg">
                    {(
                      [
                        { id: 'image/png', label: 'PNG' },
                        { id: 'image/jpeg', label: 'JPG' },
                      ] as const
                    ).map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setImageExportFormat(fmt.id)}
                        className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer transition-colors ${
                          imageExportFormat === fmt.id
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-600'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Encoding Note */}
              {mediaKind === 'video' && (
                <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
                  {c.videoExportNote}
                </p>
              )}

              {/* Feedback Messages */}
              {errorMsg && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2.5 text-xs font-medium text-rose-800"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-xs font-medium text-emerald-800">
                    <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <span>{successMsg}</span>
                  </div>
                  <WhatsAppShareBar
                    uiLang={uiLang}
                    route="/watermark-adder"
                    toolTitle={toolMeta.title[uiLang]}
                    compact
                  />
                </div>
              )}

              {/* Video Export Progress */}
              {isProcessing && mediaKind === 'video' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{c.processingBtn}</span>
                    <span className="tabular-nums">{videoProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1E40AF] transition-all"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Primary Apply & Download CTA (Gated by Pro or Single Credit) */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={!hasCurrentMedia || isProcessing}
                  onClick={() => void handleApplyAndDownload()}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    canExport
                      ? 'text-white bg-[#16A34A] hover:bg-[#15803D] shadow-xs'
                      : 'text-white bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:brightness-105 shadow-xs'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      <span>{c.processingBtn}</span>
                    </>
                  ) : canExport ? (
                    <>
                      <Download className="w-4 h-4 shrink-0" />
                      <span>{c.applyDownloadBtn}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>{c.unlockToDownloadBtn}</span>
                    </>
                  )}
                </button>

                {isProcessing && mediaKind === 'video' && (
                  <button
                    type="button"
                    onClick={() => {
                      cancelVideoRef.current = true;
                    }}
                    className="px-3.5 py-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    {c.cancelBtn}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Preview Area */}
          <div className="lg:col-span-7 bg-slate-100 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">{c.previewHeading}</h2>
              {!canExport && (
                <span className="inline-flex items-center gap-1 rounded bg-amber-100 border border-[#F59E0B]/40 px-2 py-0.5 text-[10px] font-extrabold text-[#B45309]">
                  <Crown className="w-3 h-3 text-[#D97706]" />
                  {c.paidBadge}
                </span>
              )}
            </div>

            {!hasCurrentMedia ? (
              <div className="min-h-[340px] bg-white border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8 text-center text-xs text-slate-500">
                <Stamp className="w-8 h-8 text-slate-300 mb-2" />
                <p className="max-w-xs">{c.previewEmptyHint}</p>
              </div>
            ) : mediaKind === 'image' ? (
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-center overflow-hidden">
                <canvas
                  ref={imagePreviewCanvasRef}
                  className="max-w-full max-h-[520px] w-auto h-auto rounded-lg block"
                />
              </div>
            ) : mediaKind === 'pdf' ? (
              <div className="bg-slate-200/70 border border-slate-200 rounded-xl p-4 flex items-center justify-center overflow-hidden">
                <canvas
                  ref={pdfPreviewCanvasRef}
                  className="max-w-full max-h-[520px] w-auto h-auto rounded-lg shadow-md block bg-white"
                />
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-200 rounded-xl p-2 flex items-center justify-center overflow-hidden">
                <div className="relative inline-block max-w-full">
                  <video
                    ref={videoPlayerRef}
                    src={videoUrl}
                    controls
                    playsInline
                    onLoadedMetadata={(e) => {
                      const v = e.currentTarget;
                      if (v.videoWidth && v.videoHeight) {
                        setVideoDimensions({ width: v.videoWidth, height: v.videoHeight });
                      }
                    }}
                    className="max-w-full max-h-[480px] rounded-lg block"
                  />
                  <canvas
                    ref={videoOverlayCanvasRef}
                    className="pointer-events-none absolute inset-0 w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
};
