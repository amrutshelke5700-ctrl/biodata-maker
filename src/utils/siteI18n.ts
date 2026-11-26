export type UiLang = 'en' | 'mr' | 'hi';

export const UI_LANG_STORAGE_KEY = 'sadhanbox_ui_lang_v1';

export function getInitialUiLang(): UiLang {
  try {
    const saved = localStorage.getItem(UI_LANG_STORAGE_KEY);
    if (saved === 'en' || saved === 'mr' || saved === 'hi') {
      return saved;
    }
  } catch {
    // Ignore storage errors
  }
  return 'en';
}

export function saveUiLang(lang: UiLang): void {
  try {
    localStorage.setItem(UI_LANG_STORAGE_KEY, lang);
  } catch {
    // Ignore storage errors
  }
}

export interface SiteStrings {
  brandName: string;
  brandTaglineShort: string;
  navHome: string;
  navAllTools: string;
  navAllToolsSubheading: string;
  goProHeaderBtn: string;
  proActiveHeaderBadge: string;
  backToHome: string;
  privacyBadge: string;
  // Home Page
  heroTrustPrivacy: string;
  heroTrustNoUpload: string;
  heroTrustDownloadsSuffix: string;
  heroTitle: string;
  heroTagline: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroSuiteTitle: string;
  heroSuiteSubtitle: string;
  heroLiveDownloadsLabel: string;
  heroPrivacyStatVal: string;
  heroPrivacyStatLabel: string;
  heroNoSignupNote: string;
  toolsGridHeading: string;
  toolsGridSubheading: string;
  toolsGridCount: string;
  openToolCta: string;
  // Donation / Support
  supportHeading: string;
  supportDesc: string;
  supportAmountLabel: string;
  supportCustomAmt: string;
  supportCopyBtn: string;
  supportCopiedBtn: string;
  supportUpiAppBtn: string;
  supportScanLabel: string;
  supportSuggestedAmtPrefix: string;
  supportAnyAmt: string;
  // Footer & Legal
  footerTagline: string;
  footerPrivacyNote: string;
  footerAbout: string;
  footerPrivacy: string;
  footerTerms: string;
  footerContact: string;
  // AdSense slot
  adLabel: string;
  adPlaceholderTitle: string;
  adRemoveAdsLink: string;
  // Cross-Promotion
  crossPromoTitle: string;
  crossPromoUseBiodata: string;
  crossPromoUseResume: string;
  // Background Remover
  bgUploadTitle: string;
  bgUploadHint: string;
  bgUploadBtn: string;
  bgRemoveBtn: string;
  bgProcessingBtn: string;
  bgChooseAnotherBtn: string;
  bgDownloadPngBtn: string;
  bgLoadingModel: string;
  bgDownloadingModel: string;
  bgRemovingProgress: string;
  bgDoneStatus: string;
  bgErrorGeneric: string;
  bgFileTypeError: string;
  bgSelectBgLabel: string;
  bgTransparentLabel: string;
  bgWhiteLabel: string;
  bgBlueLabel: string;
  bgOriginalLabel: string;
  bgResultLabel: string;
  bgEmptyResultHint: string;
  bgHdModeLabel: string;
  bgBatchProLabel: string;
  bgBatchAddMore: string;
  bgBatchDownloadAll: string;
  // PDF Tools
  pdfTabMerge: string;
  pdfTabSplit: string;
  pdfTabImages: string;
  pdfOnlyError: string;
  pdfLoadError: string;
  pdfMergeMinError: string;
  pdfMergeSuccess: string;
  pdfMergeFailed: string;
  pdfMergeTitle: string;
  pdfMergeHint: string;
  pdfMergeAddBtn: string;
  pdfMergePagesUnit: string;
  pdfMergeActionBtn: string;
  pdfMergeWorkingBtn: string;
  pdfSplitTitle: string;
  pdfSplitSelectedTitle: string;
  pdfSplitHint: string;
  pdfSplitTotalPages: string;
  pdfSplitSelectBtn: string;
  pdfSplitChangeBtn: string;
  pdfSplitRangeLabel: string;
  pdfSplitRangeRequired: string;
  pdfSplitInvalidRange: string;
  pdfSplitSuccess: string;
  pdfSplitFailed: string;
  pdfSplitActionBtn: string;
  pdfSplitWorkingBtn: string;
  pdfImgSelectError: string;
  pdfImgMinError: string;
  pdfImgTitle: string;
  pdfImgHint: string;
  pdfImgAddBtn: string;
  pdfImgPageSizeLabel: string;
  pdfImgLayoutA4: string;
  pdfImgLayoutFit: string;
  pdfImgActionBtn: string;
  pdfImgWorkingBtn: string;
  pdfImgSuccess: string;
  pdfImgFailed: string;
  // Image Compressor
  compUploadTitle: string;
  compUploadHint: string;
  compUploadBtn: string;
  compFileTypeError: string;
  compTargetLabel: string;
  compFormatLabel: string;
  compFormatJpg: string;
  compFormatWebp: string;
  compFormatPng: string;
  compActionBtn: string;
  compWorkingBtn: string;
  compRangeError: string;
  compErrorGeneric: string;
  compOriginalLabel: string;
  compResultLabel: string;
  compWaitingLabel: string;
  compDownloadBtn: string;
  compEmptyHint: string;
  compBatchAddMore: string;
  compBatchProHint: string;
  compBatchCompressAll: string;
  compPngNote: string;
  // QR Generator
  qrTabUrl: string;
  qrTabText: string;
  qrTabWhatsapp: string;
  qrTabUpi: string;
  qrUrlLabel: string;
  qrUrlRequired: string;
  qrTextLabel: string;
  qrTextPlaceholder: string;
  qrTextRequired: string;
  qrWaCodeLabel: string;
  qrWaPhoneLabel: string;
  qrWaPhoneRequired: string;
  qrWaMsgLabel: string;
  qrWaDefaultMsg: string;
  qrUpiIdLabel: string;
  qrUpiIdRequired: string;
  qrUpiNameLabel: string;
  qrUpiNamePlaceholder: string;
  qrUpiAmtLabel: string;
  qrUpiAmtPlaceholder: string;
  qrUpiNoteLabel: string;
  qrUpiNotePlaceholder: string;
  qrColorLabel: string;
  qrResLabel: string;
  qrCopyBtn: string;
  qrCopiedBtn: string;
  qrDownloadBtn: string;
  qrEmptyHint: string;
  qrGenError: string;
  // Age Calculator
  ageDobLabel: string;
  ageAsOfLabel: string;
  ageUseTodayBtn: string;
  ageInvalidError: string;
  ageDobAfterError: string;
  ageExactTitle: string;
  ageBornWeekdayPrefix: string;
  ageYearsLabel: string;
  ageMonthsLabel: string;
  ageDaysLabel: string;
  ageNextBdayTitle: string;
  ageTodayBdayMsg: string;
  ageDaysLeftSuffix: string;
  ageNextBdayDetailPrefix: string;
  ageNextBdayTurning: string;
  ageSummaryTitle: string;
  ageTotalMonthsLabel: string;
  ageTotalWeeksLabel: string;
  ageTotalDaysLabel: string;
  ageTotalHoursLabel: string;
  ageMonthsUnit: string;
  ageWeeksUnit: string;
  ageDaysUnit: string;
  ageHoursUnit: string;
  ageWeekdays: string[];
  // Pricing / Pro Modal
  proModalTitle: string;
  proModalSubtitle: string;
  proFreeName: string;
  proFreeAudience: string;
  proFreePrice: string;
  proFreeFeatures: string[];
  proFreeCurrentBtn: string;
  proSingleName: string;
  proSingleAudience: string;
  proSinglePrice: string;
  proSingleFeatures: string[];
  proSingleSelectBtn: string;
  proPassName: string;
  proPassAudience: string;
  proPassBadge: string;
  proPassMonthlyLabel: string;
  proPassYearlyLabel: string;
  proPassFeatures: string[];
  proPassSelectBtn: string;
  proCheckoutHeading: string;
  proPayRazorpayBtn: string;
  proPayUpiTab: string;
  proPayCodeTab: string;
  proRazorpayMissingNote: string;
  proUpiScanHint: string;
  proUpiOpenAppBtn: string;
  proUtrLabel: string;
  proUtrPlaceholder: string;
  proUtrVerifyBtn: string;
  proCodeLabel: string;
  proCodePlaceholder: string;
  proCodeVerifyBtn: string;
  proCodeError: string;
  proSuccessUnlocked: string;
  proActiveBanner: string;
  // Template Pro Badge & Upgrade Prompt
  tplProBadge: string;
  tplFreeBadge: string;
  tplProBannerTitle: string;
  tplProBannerDesc: string;
  tplProBannerCta: string;
  // Promo Modal
  promoTitle: string;
  promoLabel: string;
  promoPlaceholder: string;
  promoVerifyBtn: string;
  promoGeneratingBtn: string;
  promoInvalidError: string;
  promoSuccessMsg: string;
  promoSocialNote: string;
  promoPayAlternative: string;
}

const EN_STRINGS: SiteStrings = {
  brandName: 'SadhanBox',
  brandTaglineShort: '100% Free & Private Online Tools',
  navHome: 'Home',
  navAllTools: 'All Tools',
  navAllToolsSubheading: '7 Client-Side Utility Tools',
  goProHeaderBtn: 'Go Pro (₹49)',
  proActiveHeaderBadge: 'Pro Pass Active',
  backToHome: 'Back to Home',
  privacyBadge: '100% Browser-Based · No data uploaded to any server',
  heroTrustPrivacy: '100% Browser-Based Privacy',
  heroTrustNoUpload: 'Zero Server Uploads',
  heroTrustDownloadsSuffix: 'Downloads Completed',
  heroTitle: 'SadhanBox',
  heroTagline: '100% Free & Secure Online Tools for Your Everyday Work',
  heroSubtitle:
    'Marriage Biodata Maker, Resume Maker, Background Remover, PDF Merge & Split, Image Compressor for MPSC/UPSC forms, QR Code Generator, and Age Calculator — all running directly inside your browser.',
  heroPrimaryCta: 'Create Marriage Biodata',
  heroSecondaryCta: 'Explore All 7 Tools',
  heroSuiteTitle: 'SadhanBox Suite',
  heroSuiteSubtitle: '7 Everyday Client-Side Tools',
  heroLiveDownloadsLabel: 'Live Downloads',
  heroPrivacyStatVal: '100%',
  heroPrivacyStatLabel: 'Browser Privacy',
  heroNoSignupNote: 'No login or sign-up needed — pick a tool and start immediately.',
  toolsGridHeading: 'Everyday Utility Tools',
  toolsGridSubheading:
    'Choose any tool below — every file is processed locally on your device.',
  toolsGridCount: '7 Tools Available',
  openToolCta: 'Open Tool',
  supportHeading: 'Support SadhanBox (Voluntary Donation)',
  supportDesc:
    'Help keep SadhanBox fast, free, and accessible for everyone. You can send any small contribution via UPI.',
  supportAmountLabel: 'Select Amount (Optional):',
  supportCustomAmt: 'Custom Amount',
  supportCopyBtn: 'Copy',
  supportCopiedBtn: 'Copied',
  supportUpiAppBtn: 'Pay via UPI App',
  supportScanLabel: 'Scan with GPay · PhonePe · Paytm · BHIM',
  supportSuggestedAmtPrefix: 'Suggested amount: ₹',
  supportAnyAmt: 'Enter any amount of your choice',
  footerTagline: 'SadhanBox — 100% Free & Secure Browser-Based Utility Tools',
  footerPrivacyNote: '100% Client-Side · Zero Server File Uploads',
  footerAbout: 'About Us',
  footerPrivacy: 'Privacy Policy',
  footerTerms: 'Terms & Conditions',
  footerContact: 'Contact Us',
  adLabel: 'Advertisement',
  adPlaceholderTitle: 'Responsive Google AdSense Slot — Automatically hidden for Pro Pass users',
  adRemoveAdsLink: 'Remove all ads with Pro Pass (₹49)',
  crossPromoTitle: 'Ready to use this photo? Use this photo to create your Marriage Biodata or Resume:',
  crossPromoUseBiodata: 'Use in Marriage Biodata Maker',
  crossPromoUseResume: 'Use in Resume Maker',
  // Background Remover
  bgUploadTitle: 'Upload or drag a photo here',
  bgUploadHint: 'Supports JPG, PNG, or WEBP · Ideal for passport photos, biodata portraits, and products',
  bgUploadBtn: 'Upload Photo',
  bgRemoveBtn: 'Remove Background',
  bgProcessingBtn: 'Processing...',
  bgChooseAnotherBtn: 'Change Photo',
  bgDownloadPngBtn: 'Download PNG',
  bgLoadingModel: 'Loading AI model in your browser (first run may take a few seconds)...',
  bgDownloadingModel: 'Downloading AI model',
  bgRemovingProgress: 'Removing background',
  bgDoneStatus: 'Background removed successfully!',
  bgErrorGeneric: 'Unable to remove background. Please check your internet connection and try again.',
  bgFileTypeError: 'Please choose a valid JPG, PNG, or WEBP image.',
  bgSelectBgLabel: 'Select Output Background:',
  bgTransparentLabel: 'Transparent',
  bgWhiteLabel: 'White',
  bgBlueLabel: 'Blue',
  bgOriginalLabel: 'Original Photo',
  bgResultLabel: 'Background Removed Result',
  bgEmptyResultHint: 'Click "Remove Background" above to generate your cutout PNG here.',
  bgHdModeLabel: 'HD Model (Pro)',
  bgBatchProLabel: 'Batch Processing (Pro)',
  bgBatchAddMore: 'Add More Photos (Batch)',
  bgBatchDownloadAll: 'Download All PNGs',
  // PDF Tools
  pdfTabMerge: 'Merge PDF',
  pdfTabSplit: 'Split PDF',
  pdfTabImages: 'Images to PDF',
  pdfOnlyError: 'Please select valid PDF files only.',
  pdfLoadError: 'Could not read PDF file:',
  pdfMergeMinError: 'Please add at least 2 PDF files to merge.',
  pdfMergeSuccess: 'Merged and downloaded successfully:',
  pdfMergeFailed: 'Unable to merge PDFs. Please ensure files are not password-protected.',
  pdfMergeTitle: 'Select PDF files to merge',
  pdfMergeHint: 'Choose multiple PDF files and reorder them up or down before merging',
  pdfMergeAddBtn: 'Add PDF Files',
  pdfMergePagesUnit: 'pages',
  pdfMergeActionBtn: 'Merge & Download PDF',
  pdfMergeWorkingBtn: 'Merging PDF...',
  pdfSplitTitle: 'Select a PDF file to split',
  pdfSplitSelectedTitle: 'Selected PDF',
  pdfSplitHint: 'Extract specific pages or page ranges into a clean new PDF',
  pdfSplitTotalPages: 'Total pages:',
  pdfSplitSelectBtn: 'Select PDF',
  pdfSplitChangeBtn: 'Choose Another PDF',
  pdfSplitRangeLabel: 'Enter page numbers or ranges (e.g. 1-3, 5):',
  pdfSplitRangeRequired: 'Please enter at least one page number or range (e.g. 1-3, 5).',
  pdfSplitInvalidRange: 'Invalid page number or range. Allowed range:',
  pdfSplitSuccess: 'Extracted selected pages into a new PDF.',
  pdfSplitFailed: 'Failed to split PDF pages.',
  pdfSplitActionBtn: 'Extract Pages & Download PDF',
  pdfSplitWorkingBtn: 'Splitting PDF...',
  pdfImgSelectError: 'Please choose JPG, PNG, or WEBP images.',
  pdfImgMinError: 'Please add at least one image.',
  pdfImgTitle: 'Select photos to convert to PDF',
  pdfImgHint: 'Choose JPG, PNG, or WEBP images — ideal for marksheets, IDs, and documents',
  pdfImgAddBtn: 'Add Images',
  pdfImgPageSizeLabel: 'Page Size:',
  pdfImgLayoutA4: 'Fit on A4 (Recommended)',
  pdfImgLayoutFit: 'Original Image Size',
  pdfImgActionBtn: 'Create & Download PDF',
  pdfImgWorkingBtn: 'Creating PDF...',
  pdfImgSuccess: 'Images converted to PDF and downloaded.',
  pdfImgFailed: 'Could not create PDF from images. Please try again.',
  // Image Compressor
  compUploadTitle: 'Upload or drag a photo here',
  compUploadHint: 'Supports JPG, PNG, or WEBP · Perfect for MPSC, UPSC, and government application forms',
  compUploadBtn: 'Upload Image',
  compFileTypeError: 'Please select a valid JPG, PNG, or WEBP image.',
  compTargetLabel: 'Target Size (in KB)',
  compFormatLabel: 'Output Format',
  compFormatJpg: 'JPG / JPEG (Best for forms)',
  compFormatWebp: 'WEBP (Small & crisp)',
  compFormatPng: 'PNG',
  compActionBtn: 'Compress',
  compWorkingBtn: 'Compressing...',
  compRangeError: 'Please enter a valid target size between 5 KB and 10,240 KB.',
  compErrorGeneric: 'Compression failed. Please try another image.',
  compOriginalLabel: 'Original Image',
  compResultLabel: 'Compressed Image',
  compWaitingLabel: 'Waiting',
  compDownloadBtn: 'Download',
  compEmptyHint: 'Click "Compress" above to fit your image under your chosen KB target.',
  compBatchAddMore: 'Add Batch Images',
  compBatchProHint: 'Upgrade to Pro Pass for multi-image Batch Compression',
  compBatchCompressAll: 'Compress All',
  compPngNote: 'Switched to high-quality JPEG so your file stays cleanly within the small KB limit.',
  // QR Generator
  qrTabUrl: 'Website Link',
  qrTabText: 'Plain Text',
  qrTabWhatsapp: 'WhatsApp Number',
  qrTabUpi: 'UPI Payment',
  qrUrlLabel: 'Website or Social Media Link (URL)',
  qrUrlRequired: 'Please enter a website URL.',
  qrTextLabel: 'Text or Message',
  qrTextPlaceholder: 'Enter text for your QR Code...',
  qrTextRequired: 'Please enter text for your QR Code.',
  qrWaCodeLabel: 'Country Code',
  qrWaPhoneLabel: 'WhatsApp Mobile Number',
  qrWaPhoneRequired: 'Please enter a valid WhatsApp phone number.',
  qrWaMsgLabel: 'Pre-filled Message (Optional)',
  qrWaDefaultMsg: 'Hello, I would like more information.',
  qrUpiIdLabel: 'UPI ID (VPA) *',
  qrUpiIdRequired: 'Please enter a valid UPI ID (e.g. name@okhdfcbank).',
  qrUpiNameLabel: 'Payee Name',
  qrUpiNamePlaceholder: 'e.g. Ganesh Stores',
  qrUpiAmtLabel: 'Fixed Amount ₹ (Optional)',
  qrUpiAmtPlaceholder: 'Leave empty or enter amount',
  qrUpiNoteLabel: 'Payment Note (Optional)',
  qrUpiNotePlaceholder: 'Bill payment',
  qrColorLabel: 'QR Code Color',
  qrResLabel: 'PNG Resolution',
  qrCopyBtn: 'Copy Link',
  qrCopiedBtn: 'Copied',
  qrDownloadBtn: 'Download QR Code PNG',
  qrEmptyHint: 'Fill in the details on the left to preview your QR Code here.',
  qrGenError: 'Unable to generate QR Code. Please shorten the text and try again.',
  // Age Calculator
  ageDobLabel: 'Date of Birth',
  ageAsOfLabel: 'Calculate Age on Date',
  ageUseTodayBtn: 'Use Today',
  ageInvalidError: 'Please choose valid Date of Birth and Target Date values.',
  ageDobAfterError: 'Date of Birth cannot be later than the selected Target Date.',
  ageExactTitle: 'Your Exact Age',
  ageBornWeekdayPrefix: 'Born on:',
  ageYearsLabel: 'Years',
  ageMonthsLabel: 'Months',
  ageDaysLabel: 'Days',
  ageNextBdayTitle: 'Next Birthday Countdown',
  ageTodayBdayMsg: 'Happy Birthday! Today is your birthday.',
  ageDaysLeftSuffix: 'Days Left',
  ageNextBdayDetailPrefix: 'Remaining:',
  ageNextBdayTurning: 'Turning age',
  ageSummaryTitle: 'Complete Age Summary',
  ageTotalMonthsLabel: 'Total Months',
  ageTotalWeeksLabel: 'Total Weeks',
  ageTotalDaysLabel: 'Total Days',
  ageTotalHoursLabel: 'Total Hours',
  ageMonthsUnit: 'months',
  ageWeeksUnit: 'weeks',
  ageDaysUnit: 'days',
  ageHoursUnit: 'hours',
  ageWeekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  // Pro Pricing Modal
  proModalTitle: 'Upgrade Your SadhanBox Experience',
  proModalSubtitle: 'Choose a plan to unlock Royal Biodata templates, HD Background Removal, Batch Tools & Ad-Free experience.',
  proFreeName: 'Free Plan',
  proFreeAudience: 'For daily personal tasks',
  proFreePrice: '₹0',
  proFreeFeatures: [
    'Daily access to all 7 browser tools',
    '4-5 clean Free Biodata & Resume templates',
    '1-by-1 file processing',
    'Standard PNG, PDF & KB compression downloads',
  ],
  proFreeCurrentBtn: 'Active Free Plan',
  proSingleName: 'Single Pro Download',
  proSingleAudience: 'For one urgent premium document',
  proSinglePrice: '₹19',
  proSingleFeatures: [
    'One-time download of any Royal/Golden Pro template',
    'Watermark-free A4 PDF or HD photo download',
    'Instant browser unlock via Razorpay, UPI, or Code',
    'No recurring subscription required',
  ],
  proSingleSelectBtn: 'Get Single Download (₹19)',
  proPassName: 'All-Tools Pro Pass',
  proPassAudience: 'For power users & families',
  proPassBadge: 'Best Value',
  proPassMonthlyLabel: '₹49 / month',
  proPassYearlyLabel: '₹199 / year',
  proPassFeatures: [
    '100% Ad-Free across all 7 SadhanBox tools',
    'All Royal & Golden Biodata + Resume templates unlocked',
    'Watermark-free A4 PDF downloads anytime',
    'HD Background Removal & Multi-file Batch Processing',
  ],
  proPassSelectBtn: 'Unlock All-Tools Pro Pass',
  proCheckoutHeading: 'Complete Payment / Instant Browser Unlock',
  proPayRazorpayBtn: 'Pay Online via Razorpay',
  proPayUpiTab: 'Merchant UPI QR',
  proPayCodeTab: 'Unlock / Promo Code',
  proRazorpayMissingNote:
    'Razorpay Checkout is ready once VITE_RAZORPAY_KEY_ID is configured, or complete payment instantly using the Merchant UPI QR tab.',
  proUpiScanHint: 'Scan with Google Pay, PhonePe, Paytm, or BHIM and enter the 12-digit UTR below:',
  proUpiOpenAppBtn: 'Open UPI App',
  proUtrLabel: '12-Digit UPI Transaction / UTR Number',
  proUtrPlaceholder: 'Enter 12-digit UTR (e.g. 432198765432)',
  proUtrVerifyBtn: 'Verify Payment & Unlock Now',
  proCodeLabel: 'Enter Unlock / Promo Code',
  proCodePlaceholder: 'Enter code (e.g. FREE100 or SADHANPRO49)',
  proCodeVerifyBtn: 'Verify & Unlock',
  proCodeError: 'Invalid unlock code. Please check your code and try again.',
  proSuccessUnlocked: 'Unlocked successfully! Pro features are now active in your browser.',
  proActiveBanner: 'All-Tools Pro Pass is Active — Ad-Free, Royal Templates & Batch Mode Unlocked',
  tplProBadge: 'PRO',
  tplFreeBadge: 'Free',
  tplProBannerTitle: 'Royal & Golden Design Selected',
  tplProBannerDesc: 'Unlock watermark-free HD PDF with Single Download (₹19) or All-Tools Pro Pass (₹49).',
  tplProBannerCta: 'Unlock Pro Templates',
  promoTitle: 'Enter Promo Code or Unlock Pro HD PDF',
  promoLabel: 'Promo / Unlock Code',
  promoPlaceholder: 'Enter Promo Code (e.g. FREE100)',
  promoVerifyBtn: 'Verify & Download HD PDF',
  promoGeneratingBtn: 'Generating HD PDF...',
  promoInvalidError: 'Invalid promo code. Please enter a valid code.',
  promoSuccessMsg: 'HD PDF downloaded successfully!',
  promoSocialNote: 'Comment "BIODATA" on our Instagram or Facebook post to receive a promo code, or upgrade via Single Download (₹19) / Pro Pass (₹49).',
  promoPayAlternative: 'No code? Unlock via UPI / Razorpay (₹19 / ₹49)',
};

const MR_STRINGS: SiteStrings = {
  brandName: 'SadhanBox',
  brandTaglineShort: '१००% मोफत व सुरक्षित साधने',
  navHome: 'होम',
  navAllTools: 'सर्व साधने',
  navAllToolsSubheading: '७ ब्राउझर-आधारित साधने',
  goProHeaderBtn: 'Go Pro (₹49)',
  proActiveHeaderBadge: 'Pro पास सक्रिय',
  backToHome: 'मुख्य पानावर जा',
  privacyBadge: '१००% ब्राउझर-आधारित · सर्व्हरवर कोणताही डेटा अपलोड होत नाही',
  heroTrustPrivacy: '१००% ब्राउझर गोपनीयता',
  heroTrustNoUpload: 'सर्व्हर अपलोड नाही',
  heroTrustDownloadsSuffix: 'डाउनलोड्स पूर्ण',
  heroTitle: 'SadhanBox (साधनबॉक्स)',
  heroTagline: 'तुमच्या दैनंदिन कामांसाठी १००% मोफत आणि सुरक्षित ऑनलाइन साधने',
  heroSubtitle:
    'लग्न बायोडाटा मेकर, रेझ्युमे मेकर, बॅकग्राउंड रिमूव्हर, PDF Merge व Split, MPSC/UPSC साठी इमेज कॉम्प्रेसर, QR Code जनरेटर आणि वय कॅल्क्युलेटर — सर्व साधने थेट तुमच्या ब्राउझरमध्ये चालतात.',
  heroPrimaryCta: 'लग्नाचा बायोडाटा बनवा',
  heroSecondaryCta: 'सर्व ७ साधने पहा',
  heroSuiteTitle: 'SadhanBox सूट',
  heroSuiteSubtitle: '७ उपयुक्त ऑनलाइन साधने',
  heroLiveDownloadsLabel: 'लाइव्ह डाउनलोड्स',
  heroPrivacyStatVal: '१००%',
  heroPrivacyStatLabel: 'ब्राउझर सुरक्षितता',
  heroNoSignupNote: 'लॉगिन किंवा साइन-अपची गरज नाही — टूल निवडा आणि त्वरित वापर करा.',
  toolsGridHeading: 'तुमच्या दैनंदिन कामांसाठी सर्व साधने',
  toolsGridSubheading: 'खालीलपैकी टूल निवडा — सर्व प्रक्रिया थेट तुमच्या डिव्हाइसवर होते.',
  toolsGridCount: '७ साधने उपलब्ध',
  openToolCta: 'टूल उघडा',
  supportHeading: 'SadhanBox उपक्रमाला पाठिंबा द्या',
  supportDesc:
    'SadhanBox वरील सर्व साधने मोफत व वेगवान राहण्यासाठी तुम्ही स्वेच्छेने UPI द्वारे मदत करू शकता.',
  supportAmountLabel: 'रक्कम निवडा (ऐच्छिक):',
  supportCustomAmt: 'इतर रक्कम',
  supportCopyBtn: 'कॉपी',
  supportCopiedBtn: 'कॉपी झाले',
  supportUpiAppBtn: 'UPI अ‍ॅपने पाठिंबा द्या',
  supportScanLabel: 'GPay · PhonePe · Paytm · BHIM ने स्कॅन करा',
  supportSuggestedAmtPrefix: 'सुचवलेली रक्कम: ₹',
  supportAnyAmt: 'तुमच्या पसंतीची कोणतीही रक्कम',
  footerTagline: 'SadhanBox (साधनबॉक्स) — तुमच्या दैनंदिन कामांसाठी १००% मोफत आणि सुरक्षित साधने',
  footerPrivacyNote: '१००% ब्राउझर-आधारित · कोणताही डेटा सर्व्हरवर अपलोड होत नाही',
  footerAbout: 'आमच्याबद्दल',
  footerPrivacy: 'गोपनीयता धोरण',
  footerTerms: 'अटी व शर्ती',
  footerContact: 'संपर्क साधा',
  adLabel: 'जाहिरात',
  adPlaceholderTitle: 'Google AdSense जागा — Pro पास युझर्ससाठी सर्व जाहिराती आपोआप लपतील',
  adRemoveAdsLink: 'Pro पास (₹49) सह जाहिराती कायमच्या बंद करा',
  crossPromoTitle: 'फोटो तयार आहे! हाच फोटो वापरून तुमचा लग्नाचा बायोडाटा किंवा नोकरीचा रेझ्युमे बनवा:',
  crossPromoUseBiodata: 'लग्न बायोडाटा मेकरमध्ये वापरा',
  crossPromoUseResume: 'रेझ्युमे मेकरमध्ये वापरा',
  // Background Remover
  bgUploadTitle: 'फोटो अपलोड करा किंवा येथे ड्रॅग करा',
  bgUploadHint: 'JPG, PNG किंवा WEBP सपोर्ट · पासपोर्ट फोटो, बायोडाटा व प्रॉडक्ट फोटोंसाठी उपयुक्त',
  bgUploadBtn: 'फोटो निवडा',
  bgRemoveBtn: 'बॅकग्राउंड काढा',
  bgProcessingBtn: 'प्रक्रिया सुरू आहे...',
  bgChooseAnotherBtn: 'दुसरा फोटो निवडा',
  bgDownloadPngBtn: 'PNG डाउनलोड करा',
  bgLoadingModel: 'AI मॉडेल ब्राउझरमध्ये लोड होत आहे (पहिल्या वेळी काही सेकंद लागू शकतात)...',
  bgDownloadingModel: 'AI मॉडेल डाउनलोड होत आहे',
  bgRemovingProgress: 'फोटोचे बॅकग्राउंड काढले जात आहे',
  bgDoneStatus: 'बॅकग्राउंड यशस्वीरीत्या काढले आहे!',
  bgErrorGeneric: 'बॅकग्राउंड काढताना अडचण आली. कृपया इंटरनेट कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.',
  bgFileTypeError: 'कृपया JPG, PNG किंवा WEBP फोटो निवडा.',
  bgSelectBgLabel: 'बॅकग्राउंड रंग निवडा:',
  bgTransparentLabel: 'Transparent',
  bgWhiteLabel: 'पांढरा',
  bgBlueLabel: 'निळा',
  bgOriginalLabel: 'मूळ फोटो',
  bgResultLabel: 'तयार फोटो',
  bgEmptyResultHint: 'वरील "बॅकग्राउंड काढा" बटणावर क्लिक करा; तयार झालेला PNG फोटो येथे दिसेल.',
  bgHdModeLabel: 'HD मॉडेल (Pro)',
  bgBatchProLabel: 'एकाच वेळी अनेक फोटो (Pro)',
  bgBatchAddMore: 'अधिक फोटो जोडा',
  bgBatchDownloadAll: 'सर्व PNG डाउनलोड करा',
  // PDF Tools
  pdfTabMerge: 'Merge PDF',
  pdfTabSplit: 'Split PDF',
  pdfTabImages: 'फोटोंची PDF',
  pdfOnlyError: 'कृपया फक्त PDF फाईल्स निवडा.',
  pdfLoadError: 'ही PDF वाचता आली नाही:',
  pdfMergeMinError: 'एकत्र करण्यासाठी किमान २ PDF फाईल्स जोडा.',
  pdfMergeSuccess: 'PDF फाईल्स एकत्र करून डाउनलोड केल्या आहेत.',
  pdfMergeFailed: 'PDF एकत्र करताना त्रुटी आली. कृपया फाईल्स पासवर्ड-लॉक्ड नाहीत याची खात्री करा.',
  pdfMergeTitle: 'एकत्र करण्यासाठी PDF फाईल्स निवडा',
  pdfMergeHint: 'एकापेक्षा जास्त PDF फाईल्स निवडा व वर-खाली करून क्रम ठरवा',
  pdfMergeAddBtn: 'PDF फाईल्स जोडा',
  pdfMergePagesUnit: 'पाने',
  pdfMergeActionBtn: 'PDF एकत्र करून डाउनलोड करा',
  pdfMergeWorkingBtn: 'PDF तयार होत आहे...',
  pdfSplitTitle: 'वेगळी करायची PDF फाईल निवडा',
  pdfSplitSelectedTitle: 'निवडलेली PDF',
  pdfSplitHint: 'PDF मधील ठराविक पाने किंवा पान रेंज वेगळी करून नवीन PDF बनवा',
  pdfSplitTotalPages: 'एकूण पाने:',
  pdfSplitSelectBtn: 'PDF निवडा',
  pdfSplitChangeBtn: 'दुसरी PDF निवडा',
  pdfSplitRangeLabel: 'हवी असलेली पाने टाका (उदा. 1-3, 5):',
  pdfSplitRangeRequired: 'कृपया किमान एक पान क्रमांक किंवा रेंज (उदा. 1-3, 5) टाका.',
  pdfSplitInvalidRange: 'अवैध पान क्रमांक. वैध मर्यादा:',
  pdfSplitSuccess: 'निवडलेली पाने वेगळी करून PDF डाउनलोड केली आहे.',
  pdfSplitFailed: 'PDF पाने वेगळी करताना त्रुटी आली.',
  pdfSplitActionBtn: 'निवडलेली पाने PDF मध्ये डाउनलोड करा',
  pdfSplitWorkingBtn: 'वेगळी होत आहे...',
  pdfImgSelectError: 'कृपया JPG, PNG किंवा WEBP फोटो निवडा.',
  pdfImgMinError: 'कृपया किमान एक फोटो निवडा.',
  pdfImgTitle: 'PDF बनवण्यासाठी फोटो निवडा',
  pdfImgHint: 'JPG, PNG किंवा WEBP फोटो निवडा — कागदपत्रे व नोट्स PDF मध्ये रूपांतरित करा',
  pdfImgAddBtn: 'फोटो जोडा',
  pdfImgPageSizeLabel: 'पान आकार:',
  pdfImgLayoutA4: 'A4 फिट',
  pdfImgLayoutFit: 'मूळ फोटो आकार',
  pdfImgActionBtn: 'फोटोंची PDF डाउनलोड करा',
  pdfImgWorkingBtn: 'PDF तयार होत आहे...',
  pdfImgSuccess: 'फोटोंची PDF यशस्वीरीत्या डाउनलोड केली आहे.',
  pdfImgFailed: 'फोटोंची PDF बनवताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
  // Image Compressor
  compUploadTitle: 'फोटो अपलोड करा किंवा येथे ड्रॅग करा',
  compUploadHint: 'JPG, PNG किंवा WEBP सपोर्ट · MPSC, UPSC व सरकारी फॉर्मसाठी उपयुक्त',
  compUploadBtn: 'फोटो निवडा',
  compFileTypeError: 'कृपया JPG, PNG किंवा WEBP फोटो निवडा.',
  compTargetLabel: 'हवी असलेली साईज निवडा (KB मध्ये)',
  compFormatLabel: 'आउटपुट फॉरमॅट',
  compFormatJpg: 'JPG / JPEG (फॉर्मसाठी सर्वोत्तम)',
  compFormatWebp: 'WEBP (लहान व स्पष्ट)',
  compFormatPng: 'PNG',
  compActionBtn: 'कॉम्प्रेस करा',
  compWorkingBtn: 'सुरू आहे...',
  compRangeError: 'कृपया ५ KB ते १०,२४० KB दरम्यान योग्य साईज टाका.',
  compErrorGeneric: 'फोटो कॉम्प्रेस करताना त्रुटी आली. कृपया दुसरा फोटो वापरून पहा.',
  compOriginalLabel: 'मूळ फोटो',
  compResultLabel: 'कॉम्प्रेस केलेला फोटो',
  compWaitingLabel: 'प्रतीक्षेत',
  compDownloadBtn: 'डाउनलोड करा',
  compEmptyHint: 'वरील "कॉम्प्रेस करा" बटणावर क्लिक करा; तयार झालेला फोटो येथे दिसेल.',
  compBatchAddMore: 'अधिक फोटो जोडा',
  compBatchProHint: 'एकाच वेळी अनेक फोटो कॉम्प्रेस करण्यासाठी Pro पास घ्या',
  compBatchCompressAll: 'सर्व कॉम्प्रेस करा',
  compPngNote: 'अचूक KB साईज गाठण्यासाठी आउटपुट फॉरमॅट JPEG केला आहे.',
  // QR Generator
  qrTabUrl: 'वेबसाइट लिंक',
  qrTabText: 'मजकूर',
  qrTabWhatsapp: 'WhatsApp नंबर',
  qrTabUpi: 'UPI पेमेंट',
  qrUrlLabel: 'वेबसाइट किंवा सोशल मीडिया लिंक',
  qrUrlRequired: 'कृपया वेबसाइट लिंक टाका.',
  qrTextLabel: 'मजकूर किंवा माहिती',
  qrTextPlaceholder: 'येथे मजकूर लिहा...',
  qrTextRequired: 'कृपया QR Code साठी मजकूर लिहा.',
  qrWaCodeLabel: 'देश कोड',
  qrWaPhoneLabel: 'WhatsApp मोबाईल नंबर',
  qrWaPhoneRequired: 'कृपया वैध WhatsApp मोबाईल क्रमांक टाका.',
  qrWaMsgLabel: 'प्री-फिल्ड मेसेज (ऐच्छिक)',
  qrWaDefaultMsg: 'नमस्कार, मला अधिक माहिती हवी आहे.',
  qrUpiIdLabel: 'UPI आयडी *',
  qrUpiIdRequired: 'कृपया वैध UPI आयडी टाका (उदा. name@okhdfcbank).',
  qrUpiNameLabel: 'प्राप्तकर्त्याचे नाव',
  qrUpiNamePlaceholder: 'उदा. श्री गणेश स्टोअर्स',
  qrUpiAmtLabel: 'ठराविक रक्कम ₹ (ऐच्छिक)',
  qrUpiAmtPlaceholder: 'रिकामे ठेवा किंवा रक्कम लिहा',
  qrUpiNoteLabel: 'पेमेंट टीप (ऐच्छिक)',
  qrUpiNotePlaceholder: 'बिल पेमेंट',
  qrColorLabel: 'QR Code रंग',
  qrResLabel: 'PNG गुणवत्ता',
  qrCopyBtn: 'लिंक कॉपी',
  qrCopiedBtn: 'कॉपी झाले',
  qrDownloadBtn: 'QR Code PNG डाउनलोड करा',
  qrEmptyHint: 'डाव्या बाजूला माहिती भरा, येथे QR Code दिसेल.',
  qrGenError: 'QR Code तयार करताना त्रुटी आली. कृपया मजकूर थोडा लहान करा.',
  // Age Calculator
  ageDobLabel: 'जन्मतारीख',
  ageAsOfLabel: 'कोणत्या तारखेपर्यंत वय मोजायचे?',
  ageUseTodayBtn: 'आजची तारीख निवडा',
  ageInvalidError: 'कृपया वैध जन्मतारीख आणि संदर्भ तारीख निवडा.',
  ageDobAfterError: 'जन्मतारीख निवडलेल्या तारखेपेक्षा मोठी असू शकत नाही.',
  ageExactTitle: 'तुमचे अचूक वय',
  ageBornWeekdayPrefix: 'जन्मवार:',
  ageYearsLabel: 'वर्षे',
  ageMonthsLabel: 'महिने',
  ageDaysLabel: 'दिवस',
  ageNextBdayTitle: 'पुढील वाढदिवस',
  ageTodayBdayMsg: 'वाढदिवसाच्या हार्दिक शुभेच्छा! आज तुमचा वाढदिवस आहे.',
  ageDaysLeftSuffix: 'दिवस उरले',
  ageNextBdayDetailPrefix: 'बाकी कालावधी:',
  ageNextBdayTurning: 'पूर्ण होणारे वय',
  ageSummaryTitle: 'संपूर्ण कालावधी तपशील',
  ageTotalMonthsLabel: 'एकूण महिने',
  ageTotalWeeksLabel: 'एकूण आठवडे',
  ageTotalDaysLabel: 'एकूण दिवस',
  ageTotalHoursLabel: 'एकूण तास',
  ageMonthsUnit: 'महिने',
  ageWeeksUnit: 'आठवडे',
  ageDaysUnit: 'दिवस',
  ageHoursUnit: 'तास',
  ageWeekdays: ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
  // Pro Pricing Modal
  proModalTitle: 'SadhanBox Pro प्लॅन निवडा',
  proModalSubtitle:
    'सर्व रॉयल बायोडाटा डिझाईन्स, जाहिरातमुक्त अनुभव, HD बॅकग्राउंड रिमूव्हल आणि एकाच वेळी अनेक फाईल्स प्रोसेसिंग अनलॉक करा.',
  proFreeName: 'मोफत प्लॅन',
  proFreeAudience: 'दैनंदिन वापरासाठी',
  proFreePrice: '₹0',
  proFreeFeatures: [
    'सर्व ७ टूल्सचा मोफत दैनंदिन वापर',
    '४-५ साधी मोफत बायोडाटा व रेझ्युमे टेम्प्लेट्स',
    '१-१ फाईल प्रोसेसिंग सुविधा',
    'मानक PNG, PDF व KB कॉम्प्रेशन डाउनलोड',
  ],
  proFreeCurrentBtn: 'सध्याचा मोफत प्लॅन',
  proSingleName: 'सिंगल Pro डाउनलोड',
  proSingleAudience: 'एका प्रीमियम डिझाईनसाठी',
  proSinglePrice: '₹19',
  proSingleFeatures: [
    'कोणत्याही एका रॉयल/गोल्डन बायोडाटा किंवा रेझ्युमेचा डाउनलोड',
    'वॉटरमार्कशिवाय A4 PDF किंवा HD फोटो डाउनलोड',
    'Razorpay, UPI किंवा अनलॉक कोडद्वारे त्वरित अनलॉक',
    'कोणत्याही मासिक शुल्काशिवाय एक-वेळ पेमेंट',
  ],
  proSingleSelectBtn: 'सिंगल डाउनलोड घ्या (₹19)',
  proPassName: 'All-Tools Pro Pass',
  proPassAudience: 'संपूर्ण कुटुंबासाठी व नियमित वापरासाठी',
  proPassBadge: 'सर्वोत्तम मूल्य',
  proPassMonthlyLabel: '₹49 / महिना',
  proPassYearlyLabel: '₹199 / वर्ष',
  proPassFeatures: [
    'सर्व ७ टूल्समध्ये १००% जाहिरातमुक्त अनुभव',
    'सर्व रॉयल आणि गोल्डन बायोडाटा व रेझ्युमे टेम्प्लेट्स अनलॉक',
    'वॉटरमार्कशिवाय अमर्यादित A4 PDF डाउनलोड्स',
    'HD बॅकग्राउंड रिमूव्हल आणि एकाच वेळी अनेक फाईल्स प्रोसेसिंग',
  ],
  proPassSelectBtn: 'All-Tools Pro Pass सक्रिय करा',
  proCheckoutHeading: 'पेमेंट किंवा त्वरित अनलॉक करा',
  proPayRazorpayBtn: 'Razorpay ने ऑनलाइन पेमेंट करा',
  proPayUpiTab: 'UPI QR Code',
  proPayCodeTab: 'अनलॉक / प्रोमो कोड',
  proRazorpayMissingNote:
    'Razorpay साठी VITE_RAZORPAY_KEY_ID कॉन्फिगर करा किंवा शेजारच्या UPI QR Code द्वारे त्वरित पेमेंट करून अनलॉक करा.',
  proUpiScanHint: 'GPay, PhonePe, Paytm किंवा BHIM ने स्कॅन करा आणि खाली १२-अंकी UTR क्रमांक टाका:',
  proUpiOpenAppBtn: 'UPI अ‍ॅप उघडा',
  proUtrLabel: '१२-अंकी UPI व्यवहार / UTR क्रमांक',
  proUtrPlaceholder: '१२-अंकी UTR टाका (उदा. 432198765432)',
  proUtrVerifyBtn: 'पेमेंट तपासा व लगेच अनलॉक करा',
  proCodeLabel: 'अनलॉक / प्रोमो कोड टाका',
  proCodePlaceholder: 'कोड टाका (उदा. FREE100 किंवा SADHANPRO49)',
  proCodeVerifyBtn: 'कोड तपासा व अनलॉक करा',
  proCodeError: 'अवैध कोड! कृपया योग्य अनलॉक कोड टाका.',
  proSuccessUnlocked: 'यशस्वीरीत्या अनलॉक झाले! सर्व निवडलेल्या Pro सुविधा आता सुरू आहेत.',
  proActiveBanner: 'All-Tools Pro Pass सक्रिय — जाहिरातमुक्त, रॉयल टेम्प्लेट्स व बॅच प्रोसेसिंग सुरू',
  tplProBadge: 'PRO',
  tplFreeBadge: 'मोफत',
  tplProBannerTitle: 'रॉयल व गोल्डन डिझाईन निवडले आहे',
  tplProBannerDesc: 'वॉटरमार्कशिवाय PDF डाउनलोडसाठी सिंगल डाउनलोड (₹19) किंवा Pro पास (₹49) निवडा.',
  tplProBannerCta: 'Pro टेम्प्लेट्स अनलॉक करा',
  promoTitle: 'प्रोमो कोड टाका किंवा Pro अनलॉक करा',
  promoLabel: 'प्रोमो / अनलॉक कोड',
  promoPlaceholder: 'प्रोमो कोड टाका',
  promoVerifyBtn: 'कोड तपासा व PDF डाउनलोड करा',
  promoGeneratingBtn: 'PDF तयार होत आहे...',
  promoInvalidError: 'अवैध प्रोमो कोड! कृपया योग्य कोड टाका.',
  promoSuccessMsg: 'वॉटरमार्कशिवाय PDF डाउनलोड झाली!',
  promoSocialNote: 'प्रोमो कोडसाठी Instagram किंवा Facebook पोस्टवर BIODATA कमेंट करा किंवा ₹19 / ₹49 मध्ये त्वरित अनलॉक करा.',
  promoPayAlternative: 'कोड नाही? UPI किंवा Razorpay ने अनलॉक करा (₹19 / ₹49)',
};

const HI_STRINGS: SiteStrings = {
  brandName: 'SadhanBox',
  brandTaglineShort: '१००% मुफ्त और सुरक्षित टूल्स',
  navHome: 'होम',
  navAllTools: 'सभी टूल्स',
  navAllToolsSubheading: '७ ब्राउज़र-आधारित ऑनलाइन टूल्स',
  goProHeaderBtn: 'Go Pro (₹49)',
  proActiveHeaderBadge: 'Pro पास सक्रिय',
  backToHome: 'मुख्य पृष्ठ पर जाएं',
  privacyBadge: '१००% ब्राउज़र-आधारित · सर्वर पर कोई डेटा अपलोड नहीं होता',
  heroTrustPrivacy: '१००% ब्राउज़र गोपनीयता',
  heroTrustNoUpload: 'कोई सर्वर अपलोड नहीं',
  heroTrustDownloadsSuffix: 'डाउनलोड पूर्ण',
  heroTitle: 'SadhanBox (साधनबॉक्स)',
  heroTagline: 'आपके दैनिक कार्यों के लिए १००% मुफ्त और सुरक्षित ऑनलाइन टूल्स',
  heroSubtitle:
    'मैरिज बायोडाटा मेकर, रिज्यूमे मेकर, बैकग्राउंड रिमूवर, PDF Merge व Split, MPSC/UPSC फॉर्म के लिए इमेज कंप्रेसर, QR Code जनरेटर और आयु कैलकुलेटर — सभी टूल्स सीधे आपके ब्राउज़र में चलते हैं।',
  heroPrimaryCta: 'शादी का बायोडाटा बनाएं',
  heroSecondaryCta: 'सभी ७ टूल्स देखें',
  heroSuiteTitle: 'SadhanBox सूट',
  heroSuiteSubtitle: '७ उपयोगी ऑनलाइन टूल्स',
  heroLiveDownloadsLabel: 'लाइव डाउनलोड',
  heroPrivacyStatVal: '१००%',
  heroPrivacyStatLabel: 'ब्राउज़र सुरक्षा',
  heroNoSignupNote: 'लॉगिन या साइन-अप की जरूरत नहीं — टूल चुनें और तुरंत उपयोग शुरू करें।',
  toolsGridHeading: 'आपके दैनिक कार्यों के लिए सभी टूल्स',
  toolsGridSubheading: 'नीचे से कोई भी टूल चुनें — सभी फाइलें आपके डिवाइस पर ही प्रोसेस होती हैं।',
  toolsGridCount: '७ टूल्स उपलब्ध',
  openToolCta: 'टूल खोलें',
  supportHeading: 'SadhanBox को सपोर्ट करें',
  supportDesc:
    'SadhanBox के सभी टूल्स को मुफ्त और तेज बनाए रखने के लिए आप स्वेच्छा से UPI द्वारा छोटा योगदान दे सकते हैं।',
  supportAmountLabel: 'राशि चुनें (वैकल्पिक):',
  supportCustomAmt: 'अन्य राशि',
  supportCopyBtn: 'कॉपी',
  supportCopiedBtn: 'कॉपी हुआ',
  supportUpiAppBtn: 'UPI ऐप से भुगतान करें',
  supportScanLabel: 'GPay · PhonePe · Paytm · BHIM से स्कैन करें',
  supportSuggestedAmtPrefix: 'सुझाई गई राशि: ₹',
  supportAnyAmt: 'अपनी पसंद की कोई भी राशि दर्ज करें',
  footerTagline: 'SadhanBox — आपके दैनिक कार्यों के लिए १००% मुफ्त और सुरक्षित ऑनलाइन टूल्स',
  footerPrivacyNote: '१००% ब्राउज़र-आधारित · कोई भी डेटा सर्वर पर अपलोड नहीं होता',
  footerAbout: 'हमारे बारे में',
  footerPrivacy: 'गोपनीयता नीति',
  footerTerms: 'नियम व शर्तें',
  footerContact: 'संपर्क करें',
  adLabel: 'विज्ञापन',
  adPlaceholderTitle: 'Google AdSense स्थान — Pro पास यूजर्स के लिए सभी विज्ञापन अपने आप छिप जाएंगे',
  adRemoveAdsLink: 'Pro पास (₹49) के साथ सभी विज्ञापन हटाएं',
  crossPromoTitle: 'फोटो तैयार है! इसी फोटो से अपना मैरिज बायोडाटा या जॉब रिज्यूमे बनाएं:',
  crossPromoUseBiodata: 'मैरिज बायोडाटा मेकर में उपयोग करें',
  crossPromoUseResume: 'रिज्यूमे मेकर में उपयोग करें',
  // Background Remover
  bgUploadTitle: 'फोटो अपलोड करें या यहाँ ड्रैग करें',
  bgUploadHint: 'JPG, PNG या WEBP सपोर्ट · पासपोर्ट फोटो, बायोडाटा और प्रोडक्ट फोटो के लिए उपयुक्त',
  bgUploadBtn: 'फोटो चुनें',
  bgRemoveBtn: 'बैकग्राउंड हटाएं',
  bgProcessingBtn: 'प्रोसेसिंग जारी है...',
  bgChooseAnotherBtn: 'दूसरा फोटो चुनें',
  bgDownloadPngBtn: 'PNG डाउनलोड करें',
  bgLoadingModel: 'AI मॉडल आपके ब्राउज़र में लोड हो रहा है (पहली बार कुछ सेकंड लग सकते हैं)...',
  bgDownloadingModel: 'AI मॉडल डाउनलोड हो रहा है',
  bgRemovingProgress: 'बैकग्राउंड हटाया जा रहा है',
  bgDoneStatus: 'बैकग्राउंड सफलतापूर्वक हटा दिया गया है!',
  bgErrorGeneric: 'बैकग्राउंड हटाने में समस्या आई। कृपया इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।',
  bgFileTypeError: 'कृपया JPG, PNG या WEBP इमेज चुनें।',
  bgSelectBgLabel: 'बैकग्राउंड रंग चुनें:',
  bgTransparentLabel: 'Transparent',
  bgWhiteLabel: 'सफेद',
  bgBlueLabel: 'नीला',
  bgOriginalLabel: 'मूल फोटो',
  bgResultLabel: 'तैयार फोटो',
  bgEmptyResultHint: 'ऊपर "बैकग्राउंड हटाएं" बटन पर क्लिक करें; तैयार PNG फोटो यहाँ दिखेगा।',
  bgHdModeLabel: 'HD मॉडल (Pro)',
  bgBatchProLabel: 'एक साथ कई फोटो (Pro)',
  bgBatchAddMore: 'और फोटो जोड़ें',
  bgBatchDownloadAll: 'सभी PNG डाउनलोड करें',
  // PDF Tools
  pdfTabMerge: 'Merge PDF',
  pdfTabSplit: 'Split PDF',
  pdfTabImages: 'फोटो से PDF',
  pdfOnlyError: 'कृपया केवल PDF फाइलें चुनें।',
  pdfLoadError: 'यह PDF पढ़ी नहीं जा सकी:',
  pdfMergeMinError: 'मर्ज करने के लिए कम से कम २ PDF फाइलें जोड़ें।',
  pdfMergeSuccess: 'PDF फाइलें जोड़कर डाउनलोड कर दी गई हैं।',
  pdfMergeFailed: 'PDF मर्ज करने में त्रुटि आई। कृपया सुनिश्चित करें कि फाइलें पासवर्ड-लॉक्ड नहीं हैं।',
  pdfMergeTitle: 'जोड़ने के लिए PDF फाइलें चुनें',
  pdfMergeHint: 'एक से अधिक PDF चुनें और ऊपर-नीचे करके क्रम तय करें',
  pdfMergeAddBtn: 'PDF फाइलें जोड़ें',
  pdfMergePagesUnit: 'पेज',
  pdfMergeActionBtn: 'PDF जोड़कर डाउनलोड करें',
  pdfMergeWorkingBtn: 'PDF बन रही है...',
  pdfSplitTitle: 'अलग करने के लिए PDF फाइल चुनें',
  pdfSplitSelectedTitle: 'चुनी गई PDF',
  pdfSplitHint: 'PDF से मनचाहे पेज या पेज रेंज निकालकर नई PDF बनाएं',
  pdfSplitTotalPages: 'कुल पेज:',
  pdfSplitSelectBtn: 'PDF चुनें',
  pdfSplitChangeBtn: 'दूसरी PDF चुनें',
  pdfSplitRangeLabel: 'मनचाहे पेज नंबर डालें (उदा. 1-3, 5):',
  pdfSplitRangeRequired: 'कृपया कम से कम एक पेज नंबर या रेंज (उदा. 1-3, 5) दर्ज करें।',
  pdfSplitInvalidRange: 'अमान्य पेज नंबर। मान्य सीमा:',
  pdfSplitSuccess: 'चुने गए पेज अलग करके PDF डाउनलोड कर दी गई है।',
  pdfSplitFailed: 'PDF पेज अलग करने में त्रुटि आई।',
  pdfSplitActionBtn: 'चुने गए पेज PDF में डाउनलोड करें',
  pdfSplitWorkingBtn: 'अलग हो रहा है...',
  pdfImgSelectError: 'कृपया JPG, PNG या WEBP फोटो चुनें।',
  pdfImgMinError: 'कृपया कम से कम एक फोटो चुनें।',
  pdfImgTitle: 'PDF बनाने के लिए फोटो चुनें',
  pdfImgHint: 'JPG, PNG या WEBP फोटो चुनें — डॉक्यूमेंट्स व नोट्स को PDF में बदलें',
  pdfImgAddBtn: 'फोटो जोड़ें',
  pdfImgPageSizeLabel: 'पेज आकार:',
  pdfImgLayoutA4: 'A4 फिट',
  pdfImgLayoutFit: 'मूल फोटो आकार',
  pdfImgActionBtn: 'फोटो से PDF डाउनलोड करें',
  pdfImgWorkingBtn: 'PDF बन रही है...',
  pdfImgSuccess: 'फोटो की PDF सफलतापूर्वक डाउनलोड हो गई है।',
  pdfImgFailed: 'फोटो से PDF बनाने में त्रुटि आई। कृपया पुनः प्रयास करें।',
  // Image Compressor
  compUploadTitle: 'फोटो अपलोड करें या यहाँ ड्रैग करें',
  compUploadHint: 'JPG, PNG या WEBP सपोर्ट · MPSC, UPSC और सरकारी फॉर्म के लिए उपयोगी',
  compUploadBtn: 'फोटो चुनें',
  compFileTypeError: 'कृपया JPG, PNG या WEBP फोटो चुनें।',
  compTargetLabel: 'वांछित साइज चुनें (KB में)',
  compFormatLabel: 'आउटपुट फॉर्मेट',
  compFormatJpg: 'JPG / JPEG (फॉर्म के लिए सर्वश्रेष्ठ)',
  compFormatWebp: 'WEBP (छोटा और स्पष्ट)',
  compFormatPng: 'PNG',
  compActionBtn: 'कंप्रेस करें',
  compWorkingBtn: 'जारी है...',
  compRangeError: 'कृपया ५ KB से १०,२४० KB के बीच सही साइज दर्ज करें।',
  compErrorGeneric: 'फोटो कंप्रेस करने में त्रुटि आई। कृपया दूसरा फोटो आजमाएं।',
  compOriginalLabel: 'मूल फोटो',
  compResultLabel: 'कंप्रेस किया गया फोटो',
  compWaitingLabel: 'प्रतीक्षारत',
  compDownloadBtn: 'डाउनलोड करें',
  compEmptyHint: 'ऊपर "कंप्रेस करें" बटन पर क्लिक करें; तैयार फोटो यहाँ दिखेगा।',
  compBatchAddMore: 'और फोटो जोड़ें',
  compBatchProHint: 'एक साथ कई फोटो कंप्रेस करने के लिए Pro पास लें',
  compBatchCompressAll: 'सभी कंप्रेस करें',
  compPngNote: 'सटीक KB साइज पाने के लिए आउटपुट फॉर्मेट JPEG चुना गया है।',
  // QR Generator
  qrTabUrl: 'वेबसाइट लिंक',
  qrTabText: 'टेक्स्ट',
  qrTabWhatsapp: 'WhatsApp नंबर',
  qrTabUpi: 'UPI पेमेंट',
  qrUrlLabel: 'वेबसाइट या सोशल मीडिया लिंक',
  qrUrlRequired: 'कृपया वेबसाइट लिंक दर्ज करें।',
  qrTextLabel: 'टेक्स्ट या संदेश',
  qrTextPlaceholder: 'यहाँ टेक्स्ट लिखें...',
  qrTextRequired: 'कृपया QR Code के लिए टेक्स्ट लिखें।',
  qrWaCodeLabel: 'देश कोड',
  qrWaPhoneLabel: 'WhatsApp मोबाइल नंबर',
  qrWaPhoneRequired: 'कृपया सही WhatsApp मोबाइल नंबर दर्ज करें।',
  qrWaMsgLabel: 'प्री-फिल्ड संदेश (वैकल्पिक)',
  qrWaDefaultMsg: 'नमस्ते, मुझे अधिक जानकारी चाहिए।',
  qrUpiIdLabel: 'UPI आईडी *',
  qrUpiIdRequired: 'कृपया सही UPI आईडी दर्ज करें (उदा. name@okhdfcbank)।',
  qrUpiNameLabel: 'प्राप्तकर्ता का नाम',
  qrUpiNamePlaceholder: 'उदा. श्री गणेश स्टोर्स',
  qrUpiAmtLabel: 'निश्चित राशि ₹ (वैकल्पिक)',
  qrUpiAmtPlaceholder: 'खाली छोड़ें या राशि लिखें',
  qrUpiNoteLabel: 'पेमेंट नोट (वैकल्पिक)',
  qrUpiNotePlaceholder: 'बिल भुगतान',
  qrColorLabel: 'QR Code रंग',
  qrResLabel: 'PNG गुणवत्ता',
  qrCopyBtn: 'लिंक कॉपी',
  qrCopiedBtn: 'कॉपी हुआ',
  qrDownloadBtn: 'QR Code PNG डाउनलोड करें',
  qrEmptyHint: 'बाईं ओर जानकारी भरें, यहाँ QR Code दिखेगा।',
  qrGenError: 'QR Code बनाने में त्रुटि आई। कृपया टेक्स्ट थोड़ा छोटा करें।',
  // Age Calculator
  ageDobLabel: 'जन्मतिथि',
  ageAsOfLabel: 'किस तारीख तक उम्र गिननी है?',
  ageUseTodayBtn: 'आज की तारीख चुनें',
  ageInvalidError: 'कृपया सही जन्मतिथि और संदर्भ तारीख चुनें।',
  ageDobAfterError: 'जन्मतिथि चुनी गई तारीख से बड़ी नहीं हो सकती।',
  ageExactTitle: 'आपकी सटीक उम्र',
  ageBornWeekdayPrefix: 'जन्म दिन:',
  ageYearsLabel: 'वर्ष',
  ageMonthsLabel: 'महीने',
  ageDaysLabel: 'दिन',
  ageNextBdayTitle: 'अगला जन्मदिन',
  ageTodayBdayMsg: 'जन्मदिन की हार्दिक शुभकामनाएं! आज आपका जन्मदिन है।',
  ageDaysLeftSuffix: 'दिन बाकी',
  ageNextBdayDetailPrefix: 'शेष समय:',
  ageNextBdayTurning: 'पूर्ण होने वाली उम्र',
  ageSummaryTitle: 'पूर्ण अवधि विवरण',
  ageTotalMonthsLabel: 'कुल महीने',
  ageTotalWeeksLabel: 'कुल सप्ताह',
  ageTotalDaysLabel: 'कुल दिन',
  ageTotalHoursLabel: 'कुल घंटे',
  ageMonthsUnit: 'महीने',
  ageWeeksUnit: 'सप्ताह',
  ageDaysUnit: 'दिन',
  ageHoursUnit: 'घंटे',
  ageWeekdays: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
  // Pro Pricing Modal
  proModalTitle: 'SadhanBox Pro प्लान चुनें',
  proModalSubtitle:
    'सभी रॉयल बायोडाटा डिज़ाइन, विज्ञापन-मुक्त अनुभव, HD बैकग्राउंड रिमूवल और बैच प्रोसेसिंग अनलॉक करें।',
  proFreeName: 'मुफ्त प्लान',
  proFreeAudience: 'दैनिक उपयोग के लिए',
  proFreePrice: '₹0',
  proFreeFeatures: [
    'सभी ७ टूल्स का मुफ्त दैनिक उपयोग',
    '४-५ सरल मुफ्त बायोडाटा और रिज्यूमे टेम्प्लेट्स',
    '१-१ फाइल प्रोसेसिंग सुविधा',
    'सामान्य PNG, PDF और KB कंप्रेशन डाउनलोड',
  ],
  proFreeCurrentBtn: 'वर्तमान मुफ्त प्लान',
  proSingleName: 'सिंगल Pro डाउनलोड',
  proSingleAudience: 'किसी एक प्रीमियम डिज़ाइन के लिए',
  proSinglePrice: '₹19',
  proSingleFeatures: [
    'किसी भी एक रॉयल/गोल्डन बायोडाटा या रिज्यूमे का डाउनलोड',
    'बिना वॉटरमार्क A4 PDF या HD फोटो डाउनलोड',
    'Razorpay, UPI या अनलॉक कोड से तुरंत अनलॉक',
    'बिना किसी मासिक शुल्क के एक बार भुगतान',
  ],
  proSingleSelectBtn: 'सिंगल डाउनलोड लें (₹19)',
  proPassName: 'All-Tools Pro Pass',
  proPassAudience: 'नियमित उपयोगकर्ताओं और परिवारों के लिए',
  proPassBadge: 'सबसे किफायती',
  proPassMonthlyLabel: '₹49 / महीना',
  proPassYearlyLabel: '₹199 / वर्ष',
  proPassFeatures: [
    'सभी ७ टूल्स में १००% विज्ञापन-मुक्त अनुभव',
    'सभी रॉयल व गोल्डन बायोडाटा और रिज्यूमे टेम्प्लेट्स अनलॉक',
    'बिना वॉटरमार्क असीमित A4 PDF डाउनलोड',
    'HD बैकग्राउंड रिमूवल और एक साथ कई फाइलें प्रोसेस करने की सुविधा',
  ],
  proPassSelectBtn: 'All-Tools Pro Pass सक्रिय करें',
  proCheckoutHeading: 'भुगतान करें या तुरंत अनलॉक करें',
  proPayRazorpayBtn: 'Razorpay से ऑनलाइन भुगतान करें',
  proPayUpiTab: 'UPI QR Code',
  proPayCodeTab: 'अनलॉक / प्रोमो कोड',
  proRazorpayMissingNote:
    'Razorpay के लिए VITE_RAZORPAY_KEY_ID सेट करें या बगल के UPI QR Code टैब से तुरंत भुगतान कर अनलॉक करें।',
  proUpiScanHint: 'GPay, PhonePe, Paytm या BHIM से स्कैन करें और नीचे १२-अंकों का UTR दर्ज करें:',
  proUpiOpenAppBtn: 'UPI ऐप खोलें',
  proUtrLabel: '१२-अंकों का UPI ट्रांजेक्शन / UTR नंबर',
  proUtrPlaceholder: '१२-अंकों का UTR दर्ज करें (उदा. 432198765432)',
  proUtrVerifyBtn: 'भुगतान सत्यापित करें व अनलॉक करें',
  proCodeLabel: 'अनलॉक / प्रोमो कोड दर्ज करें',
  proCodePlaceholder: 'कोड दर्ज करें (उदा. FREE100 या SADHANPRO49)',
  proCodeVerifyBtn: 'सत्यापित करें व अनलॉक करें',
  proCodeError: 'अमान्य कोड! कृपया सही अनलॉक कोड दर्ज करें।',
  proSuccessUnlocked: 'सफलतापूर्वक अनलॉक हुआ! सभी चयनित Pro सुविधाएं अब सक्रिय हैं।',
  proActiveBanner: 'All-Tools Pro Pass सक्रिय — विज्ञापन-मुक्त, रॉयल टेम्प्लेट्स व बैच मोड चालू',
  tplProBadge: 'PRO',
  tplFreeBadge: 'मुफ्त',
  tplProBannerTitle: 'रॉयल व गोल्डन डिज़ाइन चुना गया है',
  tplProBannerDesc: 'बिना वॉटरमार्क PDF डाउनलोड के लिए सिंगल डाउनलोड (₹19) या Pro पास (₹49) चुनें।',
  tplProBannerCta: 'Pro टेम्प्लेट्स अनलॉक करें',
  promoTitle: 'प्रोमो कोड दर्ज करें या Pro अनलॉक करें',
  promoLabel: 'प्रोमो / अनलॉक कोड',
  promoPlaceholder: 'प्रोमो कोड दर्ज करें',
  promoVerifyBtn: 'सत्यापित करें व PDF डाउनलोड करें',
  promoGeneratingBtn: 'PDF तैयार हो रही है...',
  promoInvalidError: 'अमान्य प्रोमो कोड! कृपया सही कोड दर्ज करें।',
  promoSuccessMsg: 'बिना वॉटरमार्क PDF डाउनलोड हो गई!',
  promoSocialNote: 'प्रोमो कोड के लिए Instagram या Facebook पोस्ट पर BIODATA कमेंट करें या ₹19 / ₹49 में तुरंत अनलॉक करें।',
  promoPayAlternative: 'कोड नहीं है? UPI या Razorpay से अनलॉक करें (₹19 / ₹49)',
};

export const SITE_STRINGS: Record<UiLang, SiteStrings> = {
  en: EN_STRINGS,
  mr: MR_STRINGS,
  hi: HI_STRINGS,
};

export function getSiteStrings(lang: UiLang): SiteStrings {
  return SITE_STRINGS[lang] || EN_STRINGS;
}
