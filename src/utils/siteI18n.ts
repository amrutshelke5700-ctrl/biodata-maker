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
  // Passport Photo Maker
  passUploadTitle: string;
  passUploadHint: string;
  passUploadBtn: string;
  passChangePhotoBtn: string;
  passFileTypeError: string;
  passNameLabel: string;
  passNamePlaceholder: string;
  passDateLabel: string;
  passClearDateBtn: string;
  passBgLabel: string;
  passBgOriginal: string;
  passBgWhite: string;
  passBgLightBlue: string;
  passAiBgBtn: string;
  passAiBgWorking: string;
  passAiBgReady: string;
  passAiBgError: string;
  passSheetCountLabel: string;
  passCount8: string;
  passCount12: string;
  passZoomLabel: string;
  passOffsetYLabel: string;
  passCutBorderLabel: string;
  passSinglePreviewTitle: string;
  passSheetPreviewTitle: string;
  passDownloadPdfBtn: string;
  passDownloadJpgBtn: string;
  passDownloadSingleBtn: string;
  passPdfGenerating: string;
  passDatePrefix: string;
  // Signature & Thumb Resize Tool
  sigUploadTitle: string;
  sigUploadHint: string;
  sigUploadBtn: string;
  sigChangeBtn: string;
  sigFileTypeError: string;
  sigPresetLabel: string;
  sigPreset140: string;
  sigPreset240: string;
  sigPreset300: string;
  sigPresetCustom: string;
  sigWidthLabel: string;
  sigHeightLabel: string;
  sigMinKbLabel: string;
  sigMaxKbLabel: string;
  sigAutoCropLabel: string;
  sigAutoCropHint: string;
  sigCleanPaperLabel: string;
  sigCleanPaperHint: string;
  sigProcessBtn: string;
  sigProcessingBtn: string;
  sigOriginalLabel: string;
  sigResultLabel: string;
  sigRangeError: string;
  sigErrorGeneric: string;
  sigDownloadJpgBtn: string;
  sigReadyBadge: string;
  // Rent Receipt & Salary Slip Generator
  rentTabReceipt: string;
  rentTabSalary: string;
  rentTenantNameLabel: string;
  rentTenantPlaceholder: string;
  rentLandlordNameLabel: string;
  rentLandlordPlaceholder: string;
  rentLandlordPanLabel: string;
  rentLandlordPanPlaceholder: string;
  rentMonthlyAmountLabel: string;
  rentAddressLabel: string;
  rentAddressPlaceholder: string;
  rentStartMonthLabel: string;
  rentCountLabel: string;
  rentCount1: string;
  rentCount2: string;
  rentCount3: string;
  rentPayModeLabel: string;
  rentPayModes: string[];
  rentReceiptNoLabel: string;
  rentIncludeStampLabel: string;
  rentDownloadPdfBtn: string;
  rentDownloadingBtn: string;
  rentSampleFillBtn: string;
  rentPreviewTitle: string;
  salCompanyLabel: string;
  salCompanyPlaceholder: string;
  salCompanyAddrLabel: string;
  salCompanyAddrPlaceholder: string;
  salMonthLabel: string;
  salEmpNameLabel: string;
  salEmpNamePlaceholder: string;
  salEmpIdLabel: string;
  salDesignationLabel: string;
  salDesignationPlaceholder: string;
  salDepartmentLabel: string;
  salDepartmentPlaceholder: string;
  salPanUanLabel: string;
  salPaidDaysLabel: string;
  salEarningsTitle: string;
  salBasicLabel: string;
  salHraLabel: string;
  salAllowanceLabel: string;
  salBonusLabel: string;
  salDeductionsTitle: string;
  salPfLabel: string;
  salPtLabel: string;
  salTdsLabel: string;
  salOtherDedLabel: string;
  salGrossLabel: string;
  salTotalDedLabel: string;
  salNetPayLabel: string;
  // GST & EMI Calculator
  finTabGst: string;
  finTabEmi: string;
  gstAmountLabel: string;
  gstRateLabel: string;
  gstCustomRateLabel: string;
  gstModeLabel: string;
  gstExclusiveBtn: string;
  gstInclusiveBtn: string;
  gstSupplyTypeLabel: string;
  gstIntraBtn: string;
  gstInterBtn: string;
  gstBaseAmountLabel: string;
  gstTaxAmountLabel: string;
  gstCgstLabel: string;
  gstSgstLabel: string;
  gstIgstLabel: string;
  gstTotalAmountLabel: string;
  gstCopyBtn: string;
  gstCopiedBtn: string;
  emiPresetHome: string;
  emiPresetVehicle: string;
  emiPresetPersonal: string;
  emiLoanAmountLabel: string;
  emiInterestRateLabel: string;
  emiTenureLabel: string;
  emiYearsUnit: string;
  emiMonthsUnit: string;
  emiMonthlyTitle: string;
  emiPrincipalLabel: string;
  emiTotalInterestLabel: string;
  emiTotalPayableLabel: string;
  emiScheduleTitle: string;
  emiYearCol: string;
  emiPrincipalCol: string;
  emiInterestCol: string;
  emiBalanceCol: string;
  // Image Format Converter
  convUploadTitle: string;
  convUploadHint: string;
  convUploadBtn: string;
  convFileTypeError: string;
  convFormatLabel: string;
  convQualityLabel: string;
  convPngLosslessHint: string;
  convBgFillLabel: string;
  convBgWhite: string;
  convBgBlack: string;
  convBgSoft: string;
  convConvertBtn: string;
  convConvertingBtn: string;
  convOriginalLabel: string;
  convOutputLabel: string;
  convDownloadBtn: string;
  convDownloadAllBtn: string;
  convAddMoreBtn: string;
  convClearBtn: string;
  convBatchProHint: string;
  convErrorGeneric: string;
  convWaitingLabel: string;
  // Word Counter & Typing Pad
  wordModeLabel: string;
  wordModeEn: string;
  wordModeMr: string;
  wordModeHi: string;
  wordCountLabel: string;
  wordCharsWithSpaceLabel: string;
  wordCharsNoSpaceLabel: string;
  wordSentencesLabel: string;
  wordParagraphsLabel: string;
  wordReadTimeLabel: string;
  wordMinUnit: string;
  wordLiveHintPrefix: string;
  wordLiveHintSpace: string;
  wordConvertNowBtn: string;
  wordConvertAllBtn: string;
  wordSampleBtn: string;
  wordCopyBtn: string;
  wordCopiedBtn: string;
  wordDownloadTxtBtn: string;
  wordClearBtn: string;
  wordCleanSpacesBtn: string;
  wordPlaceholderEn: string;
  wordPlaceholderMr: string;
  wordPlaceholderHi: string;
  wordQuickCharsLabel: string;
  wordExamplesTitle: string;
}

const EN_STRINGS: SiteStrings = {
  brandName: 'SadhanBox',
  brandTaglineShort: '100% Free & Private Online Tools',
  navHome: 'Home',
  navAllTools: 'All Tools',
  navAllToolsSubheading: '19 Client-Side Utility Tools',
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
    'Biodata & Resume Maker, Passport Photo, ID Card A4 Print, PDF Compressor, PDF to JPG & Scan Cleaner, GST Invoice & Quotation, Digital Invitation Cards, Signature Resize, Rent Receipt & Salary Slip, GST & EMI Calculator, Image Converter, Marathi/Hindi Typing, Background Remover, PDF Merge/Split, Image Compressor, QR, Age Calculator & Watermark Adder — all inside your browser.',
  heroPrimaryCta: 'Create Marriage Biodata',
  heroSecondaryCta: 'Explore All 19 Tools',
  heroSuiteTitle: 'SadhanBox Suite',
  heroSuiteSubtitle: '19 Everyday Client-Side Tools',
  heroLiveDownloadsLabel: 'Live Downloads',
  heroPrivacyStatVal: '100%',
  heroPrivacyStatLabel: 'Browser Privacy',
  heroNoSignupNote: 'No login or sign-up needed — pick a tool and start immediately.',
  toolsGridHeading: 'Everyday Utility Tools',
  toolsGridSubheading:
    'Choose any tool below — every file is processed locally on your device.',
  toolsGridCount: '19 Tools Available',
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
    'Daily access to all 18 free browser tools',
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
    '100% Ad-Free across all 19 SadhanBox tools',
    'All Royal & Golden Biodata + Resume templates unlocked',
    'Watermark-free A4 PDFs + Pro Image/PDF/Video Watermark Adder',
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
  // Passport Photo Maker
  passUploadTitle: 'Upload or drag a portrait photo here',
  passUploadHint: 'Supports JPG, PNG, or WEBP · Front-facing portrait works best for MPSC/UPSC & Passport A4 sheets',
  passUploadBtn: 'Upload Photo',
  passChangePhotoBtn: 'Change Photo',
  passFileTypeError: 'Please choose a valid JPG, PNG, or WEBP photo.',
  passNameLabel: 'Name on Photo (Optional)',
  passNamePlaceholder: 'e.g. RAHUL SHARMA',
  passDateLabel: 'Photo Taken Date (Optional)',
  passClearDateBtn: 'Clear',
  passBgLabel: 'Background Color',
  passBgOriginal: 'Original',
  passBgWhite: 'White',
  passBgLightBlue: 'Light Blue',
  passAiBgBtn: 'Auto-Replace Background with AI',
  passAiBgWorking: 'Removing old background...',
  passAiBgReady: 'Studio background applied cleanly',
  passAiBgError: 'Could not remove background automatically. Using original photo framing.',
  passSheetCountLabel: 'A4 Sheet Photos (MPSC / UPSC / Print)',
  passCount8: '8 Photos (4×2)',
  passCount12: '12 Photos (4×3)',
  passZoomLabel: 'Face Zoom',
  passOffsetYLabel: 'Vertical Position',
  passCutBorderLabel: 'Show light cutting border around each photo',
  passSinglePreviewTitle: 'Single Photo (3.5 × 4.5 cm)',
  passSheetPreviewTitle: 'A4 Printable Sheet Preview',
  passDownloadPdfBtn: 'Download A4 PDF',
  passDownloadJpgBtn: 'Download A4 JPG',
  passDownloadSingleBtn: 'Download Single JPG',
  passPdfGenerating: 'Creating A4 PDF...',
  passDatePrefix: 'DOP:',
  // Signature & Thumb Resize Tool
  sigUploadTitle: 'Upload Signature or Thumb Impression photo',
  sigUploadHint: 'Supports JPG, PNG, or WEBP · Ideal for MPSC, UPSC, SSC, IBPS, and bank portal uploads',
  sigUploadBtn: 'Upload Signature / Thumb',
  sigChangeBtn: 'Change Image',
  sigFileTypeError: 'Please select a valid JPG, PNG, or WEBP image.',
  sigPresetLabel: 'Government Form Preset',
  sigPreset140: 'Signature (140 × 60 px)',
  sigPreset240: 'Thumb Impression (240 × 240 px)',
  sigPreset300: 'Wide Signature (300 × 120 px)',
  sigPresetCustom: 'Custom Size (px)',
  sigWidthLabel: 'Width (px)',
  sigHeightLabel: 'Height (px)',
  sigMinKbLabel: 'Min Size (KB)',
  sigMaxKbLabel: 'Max Size (KB)',
  sigAutoCropLabel: 'Auto-Crop empty margins',
  sigAutoCropHint: 'Detects ink/thumb edges and trims blank white space automatically',
  sigCleanPaperLabel: 'Clean white paper & enhance ink',
  sigCleanPaperHint: 'Turns dull gray paper background into pure white (#FFFFFF)',
  sigProcessBtn: 'Resize & Compress',
  sigProcessingBtn: 'Processing...',
  sigOriginalLabel: 'Original Image',
  sigResultLabel: 'Resized Output (JPG)',
  sigRangeError: 'Enter valid dimensions (30–2000 px) and file size range (5–500 KB, Min ≤ Max).',
  sigErrorGeneric: 'Unable to process image. Please try another photo.',
  sigDownloadJpgBtn: 'Download JPG',
  sigReadyBadge: 'Exact pixels & KB range ready',
  // Rent Receipt & Salary Slip Generator
  rentTabReceipt: 'Rent Receipt (HRA)',
  rentTabSalary: 'Salary Slip',
  rentTenantNameLabel: 'Tenant / Employee Name',
  rentTenantPlaceholder: 'e.g. Rohan Deshmukh',
  rentLandlordNameLabel: 'Landlord / Owner Name',
  rentLandlordPlaceholder: 'e.g. Suresh Kulkarni',
  rentLandlordPanLabel: 'Landlord PAN (Optional — needed if annual rent > ₹1,00,000)',
  rentLandlordPanPlaceholder: 'e.g. ABCDE1234F',
  rentMonthlyAmountLabel: 'Monthly Rent Amount (₹)',
  rentAddressLabel: 'Rented Property Address',
  rentAddressPlaceholder: 'Flat 302, Shanti Residency, Kothrud, Pune - 411038',
  rentStartMonthLabel: 'Starting Month',
  rentCountLabel: 'Receipts on A4 Sheet',
  rentCount1: '1 Month',
  rentCount2: '2 Months',
  rentCount3: '3 Months (Quarterly)',
  rentPayModeLabel: 'Payment Mode',
  rentPayModes: ['UPI / Bank Transfer', 'NEFT / IMPS', 'Cheque', 'Cash'],
  rentReceiptNoLabel: 'Starting Receipt No.',
  rentIncludeStampLabel: 'Show ₹1 Revenue Stamp box for signing',
  rentDownloadPdfBtn: 'Download A4 PDF',
  rentDownloadingBtn: 'Generating A4 PDF...',
  rentSampleFillBtn: 'Reset Sample',
  rentPreviewTitle: 'Live A4 Printable Preview',
  salCompanyLabel: 'Company / Employer Name',
  salCompanyPlaceholder: 'e.g. Sahyadri Tech Solutions Pvt. Ltd.',
  salCompanyAddrLabel: 'Company Office Address',
  salCompanyAddrPlaceholder: 'Plot 14, Hinjawadi Phase 1, Pune - 411057',
  salMonthLabel: 'Salary Month & Year',
  salEmpNameLabel: 'Employee Name',
  salEmpNamePlaceholder: 'e.g. Sneha Joshi',
  salEmpIdLabel: 'Employee ID',
  salDesignationLabel: 'Designation',
  salDesignationPlaceholder: 'e.g. Senior Executive',
  salDepartmentLabel: 'Department',
  salDepartmentPlaceholder: 'e.g. Operations',
  salPanUanLabel: 'PAN / UAN Number (Optional)',
  salPaidDaysLabel: 'Paid Days (e.g. 30 / 30)',
  salEarningsTitle: 'Earnings (₹)',
  salBasicLabel: 'Basic Salary',
  salHraLabel: 'House Rent Allowance (HRA)',
  salAllowanceLabel: 'Conveyance & Special Allowance',
  salBonusLabel: 'Bonus / Incentive',
  salDeductionsTitle: 'Deductions (₹)',
  salPfLabel: 'Provident Fund (EPF)',
  salPtLabel: 'Professional Tax (PT)',
  salTdsLabel: 'Income Tax (TDS)',
  salOtherDedLabel: 'Other Deductions',
  salGrossLabel: 'Gross Earnings',
  salTotalDedLabel: 'Total Deductions',
  salNetPayLabel: 'Net Payable Salary',
  // GST & EMI Calculator
  finTabGst: 'GST Calculator',
  finTabEmi: 'Loan EMI Calculator',
  gstAmountLabel: 'Invoice / Item Amount (₹)',
  gstRateLabel: 'Select GST Slab (%)',
  gstCustomRateLabel: 'Custom %',
  gstModeLabel: 'Calculation Type',
  gstExclusiveBtn: 'GST Exclusive (+ Add GST)',
  gstInclusiveBtn: 'GST Inclusive (Remove GST)',
  gstSupplyTypeLabel: 'Tax Breakdown',
  gstIntraBtn: 'Intra-State (CGST + SGST)',
  gstInterBtn: 'Inter-State (IGST)',
  gstBaseAmountLabel: 'Net / Base Amount',
  gstTaxAmountLabel: 'Total GST Amount',
  gstCgstLabel: 'CGST',
  gstSgstLabel: 'SGST',
  gstIgstLabel: 'IGST',
  gstTotalAmountLabel: 'Final Invoice Total',
  gstCopyBtn: 'Copy Summary',
  gstCopiedBtn: 'Copied',
  emiPresetHome: 'Home Loan',
  emiPresetVehicle: 'Vehicle / Car Loan',
  emiPresetPersonal: 'Personal Loan',
  emiLoanAmountLabel: 'Loan Amount (₹)',
  emiInterestRateLabel: 'Annual Interest Rate (% p.a.)',
  emiTenureLabel: 'Loan Tenure',
  emiYearsUnit: 'Years',
  emiMonthsUnit: 'Months',
  emiMonthlyTitle: 'Monthly EMI',
  emiPrincipalLabel: 'Principal Amount',
  emiTotalInterestLabel: 'Total Interest Payable',
  emiTotalPayableLabel: 'Total Amount Payable',
  emiScheduleTitle: 'Year-by-Year Repayment Schedule',
  emiYearCol: 'Year',
  emiPrincipalCol: 'Principal Paid',
  emiInterestCol: 'Interest Paid',
  emiBalanceCol: 'Closing Balance',
  // Image Format Converter
  convUploadTitle: 'Upload or drag any photo (PNG, WebP, JPG, BMP)',
  convUploadHint: 'Convert mobile camera photos, screenshots, or WebP files to high-quality JPG, PNG, or WebP',
  convUploadBtn: 'Select Photo',
  convFileTypeError: 'Please choose a valid image file (PNG, JPG, WebP, BMP, or GIF).',
  convFormatLabel: 'Convert To Format',
  convQualityLabel: 'Output Quality',
  convPngLosslessHint: 'PNG uses lossless compression for crisp graphics & transparency.',
  convBgFillLabel: 'Transparent Background Fill (for JPG)',
  convBgWhite: 'White',
  convBgBlack: 'Black',
  convBgSoft: 'Light Gray',
  convConvertBtn: 'Convert Format',
  convConvertingBtn: 'Converting...',
  convOriginalLabel: 'Original File',
  convOutputLabel: 'Converted Output',
  convDownloadBtn: 'Download',
  convDownloadAllBtn: 'Download All',
  convAddMoreBtn: 'Choose Another Photo',
  convClearBtn: 'Clear',
  convBatchProHint: 'Upgrade to Pro Pass to batch convert multiple photos at once',
  convErrorGeneric: 'Unable to convert this image format. Please try another photo.',
  convWaitingLabel: 'Ready to convert',
  // Word Counter & Typing Pad
  wordModeLabel: 'Typing Script Mode',
  wordModeEn: 'English (Direct)',
  wordModeMr: 'मराठी (English → मराठी)',
  wordModeHi: 'हिंदी (English → हिंदी)',
  wordCountLabel: 'Words',
  wordCharsWithSpaceLabel: 'Characters (with spaces)',
  wordCharsNoSpaceLabel: 'Characters (no spaces)',
  wordSentencesLabel: 'Sentences',
  wordParagraphsLabel: 'Paragraphs',
  wordReadTimeLabel: 'Reading Time',
  wordMinUnit: 'min',
  wordLiveHintPrefix: 'Typing word:',
  wordLiveHintSpace: 'Press Space / Enter to convert, or click a suggestion:',
  wordConvertNowBtn: 'Convert Word',
  wordConvertAllBtn: 'Convert English Text',
  wordSampleBtn: 'Load Sample',
  wordCopyBtn: 'Copy Text',
  wordCopiedBtn: 'Copied!',
  wordDownloadTxtBtn: 'Download .TXT',
  wordClearBtn: 'Clear',
  wordCleanSpacesBtn: 'Clean Extra Spaces',
  wordPlaceholderEn: 'Start typing or paste any English, Marathi, or Hindi text here to count words, characters, and sentences...',
  wordPlaceholderMr: 'येथे इंग्रजीत टाईप करा (उदा. namaskar maharashtra) — स्पेस दाबताच मराठीत रूपांतर होईल...',
  wordPlaceholderHi: 'यहाँ अंग्रेजी में टाइप करें (जैसे namaste bharat) — स्पेस दबाते ही हिंदी में बदल जाएगा...',
  wordQuickCharsLabel: 'Quick Insert:',
  wordExamplesTitle: 'Quick Guide: Type "namaskar" + Space → नमस्कार | "maharashtra" → महाराष्ट्र | "L" → ळ | "dny" → ज्ञ',
};

const MR_STRINGS: SiteStrings = {
  brandName: 'SadhanBox',
  brandTaglineShort: '१००% मोफत व सुरक्षित साधने',
  navHome: 'होम',
  navAllTools: 'सर्व साधने',
  navAllToolsSubheading: '१९ ब्राउझर-आधारित साधने',
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
    'लग्न बायोडाटा व रेझ्युमे, पासपोर्ट फोटो, आधार/पॅन ID कार्ड प्रिंट, PDF कॉम्प्रेसर, PDF ते JPG व स्कॅन क्लीनर, GST बिल व कोटेशन, निमंत्रण व सण कार्ड्स, सही रिसाईझ, घरभाडे पावती व पगार स्लिप, GST व EMI कॅल्क्युलेटर, इमेज कन्व्हर्टर, मराठी/हिंदी टायपिंग, बॅकग्राउंड रिमूव्हर, PDF टूल्स, इमेज कॉम्प्रेसर, QR, वय कॅल्क्युलेटर व वॉटरमार्क ॲडर — सर्व साधने तुमच्या ब्राउझरमध्ये.',
  heroPrimaryCta: 'लग्नाचा बायोडाटा बनवा',
  heroSecondaryCta: 'सर्व १९ साधने पहा',
  heroSuiteTitle: 'SadhanBox सूट',
  heroSuiteSubtitle: '१९ उपयुक्त ऑनलाइन साधने',
  heroLiveDownloadsLabel: 'लाइव्ह डाउनलोड्स',
  heroPrivacyStatVal: '१००%',
  heroPrivacyStatLabel: 'ब्राउझर सुरक्षितता',
  heroNoSignupNote: 'लॉगिन किंवा साइन-अपची गरज नाही — टूल निवडा आणि त्वरित वापर करा.',
  toolsGridHeading: 'तुमच्या दैनंदिन कामांसाठी सर्व साधने',
  toolsGridSubheading: 'खालीलपैकी टूल निवडा — सर्व प्रक्रिया थेट तुमच्या डिव्हाइसवर होते.',
  toolsGridCount: '१९ साधने उपलब्ध',
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
    'सर्व १८ मोफत टूल्सचा दैनंदिन वापर',
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
    'सर्व १९ टूल्समध्ये १००% जाहिरातमुक्त अनुभव',
    'सर्व रॉयल आणि गोल्डन बायोडाटा व रेझ्युमे टेम्प्लेट्स अनलॉक',
    'वॉटरमार्कशिवाय PDF + Pro इमेज/PDF/व्हिडिओ वॉटरमार्क ॲडर',
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
  // Passport Photo Maker
  passUploadTitle: 'तुमचा फोटो अपलोड करा किंवा येथे ड्रॅग करा',
  passUploadHint: 'JPG, PNG किंवा WEBP सपोर्ट · MPSC/UPSC व पासपोर्ट A4 शीटसाठी सरळ चेहऱ्याचा फोटो वापरा',
  passUploadBtn: 'फोटो निवडा',
  passChangePhotoBtn: 'दुसरा फोटो निवडा',
  passFileTypeError: 'कृपया वैध JPG, PNG किंवा WEBP फोटो निवडा.',
  passNameLabel: 'फोटोवरील नाव (ऐच्छिक)',
  passNamePlaceholder: 'उदा. RAHUL SHARMA',
  passDateLabel: 'फोटो काढल्याची तारीख (ऐच्छिक)',
  passClearDateBtn: 'पुसा',
  passBgLabel: 'बॅकग्राउंड रंग',
  passBgOriginal: 'मूळ फोटो',
  passBgWhite: 'पांढरा',
  passBgLightBlue: 'हलका निळा',
  passAiBgBtn: 'AI ने बॅकग्राउंड बदला',
  passAiBgWorking: 'जुने बॅकग्राउंड काढले जात आहे...',
  passAiBgReady: 'नवीन बॅकग्राउंड अचूक लागू झाले',
  passAiBgError: 'बॅकग्राउंड आपोआप बदलता आले नाही. मूळ फोटो वापरला जात आहे.',
  passSheetCountLabel: 'A4 शीटवरील फोटो संख्या (MPSC / UPSC)',
  passCount8: '८ फोटो (४×२)',
  passCount12: '१२ फोटो (४×३)',
  passZoomLabel: 'फोटो झूम',
  passOffsetYLabel: 'वर-खाली सेटिंग',
  passCutBorderLabel: 'प्रत्येक फोटोभोवती कापण्यासाठी हलकी बॉर्डर दाखवा',
  passSinglePreviewTitle: 'सिंगल फोटो (3.5 × 4.5 सेमी)',
  passSheetPreviewTitle: 'A4 प्रिंट शीट प्रिव्ह्यू',
  passDownloadPdfBtn: 'A4 PDF डाउनलोड करा',
  passDownloadJpgBtn: 'A4 JPG डाउनलोड करा',
  passDownloadSingleBtn: 'सिंगल JPG डाउनलोड करा',
  passPdfGenerating: 'A4 PDF तयार होत आहे...',
  passDatePrefix: 'DOP:',
  // Signature & Thumb Resize Tool
  sigUploadTitle: 'सही किंवा अंगठ्याच्या ठशाचा फोटो अपलोड करा',
  sigUploadHint: 'JPG, PNG किंवा WEBP सपोर्ट · MPSC, UPSC, SSC, IBPS आणि बँक फॉर्मसाठी उपयुक्त',
  sigUploadBtn: 'सही / अंगठा निवडा',
  sigChangeBtn: 'दुसरा फोटो निवडा',
  sigFileTypeError: 'कृपया वैध JPG, PNG किंवा WEBP इमेज निवडा.',
  sigPresetLabel: 'सरकारी फॉर्मसाठी साईझ निवडा',
  sigPreset140: 'सही (140 × 60 px)',
  sigPreset240: 'अंगठ्याचा ठसा (240 × 240 px)',
  sigPreset300: 'रुंद सही (300 × 120 px)',
  sigPresetCustom: 'कस्टम साईझ (px)',
  sigWidthLabel: 'रुंदी (px)',
  sigHeightLabel: 'उंची (px)',
  sigMinKbLabel: 'किमान साईझ (KB)',
  sigMaxKbLabel: 'कमाल साईझ (KB)',
  sigAutoCropLabel: 'रिकाम्या कडा आपोआप क्रॉप करा (Auto-Crop)',
  sigAutoCropHint: 'सही किंवा अंगठ्याभोवतीची अनावश्यक पांढरी जागा आपोआप कापते',
  sigCleanPaperLabel: 'कागद पांढरा व सही गडद करा',
  sigCleanPaperHint: 'फोटोतील करडा कागद शुद्ध पांढऱ्या रंगात (#FFFFFF) बदलते',
  sigProcessBtn: 'रिसाईझ आणि कॉम्प्रेस करा',
  sigProcessingBtn: 'प्रक्रिया सुरू आहे...',
  sigOriginalLabel: 'मूळ इमेज',
  sigResultLabel: 'तयार इमेज (JPG)',
  sigRangeError: 'कृपया वैध पिक्सेल (30–2000 px) आणि KB मर्यादा (5–500 KB, किमान ≤ कमाल) टाका.',
  sigErrorGeneric: 'इमेज प्रक्रिया पूर्ण झाली नाही. कृपया दुसरा फोटो वापरून पहा.',
  sigDownloadJpgBtn: 'JPG डाउनलोड करा',
  sigReadyBadge: 'अचूक पिक्सेल आणि KB साईझ तयार आहे',
  // Rent Receipt & Salary Slip Generator
  rentTabReceipt: 'घरभाडे पावती (HRA)',
  rentTabSalary: 'पगार स्लिप (Salary Slip)',
  rentTenantNameLabel: 'भाडेकरू / कर्मचाऱ्याचे नाव',
  rentTenantPlaceholder: 'उदा. रोहन देशमुख',
  rentLandlordNameLabel: 'घरमालकाचे नाव',
  rentLandlordPlaceholder: 'उदा. सुरेश कुलकर्णी',
  rentLandlordPanLabel: 'घरमालकाचा PAN (ऐच्छिक — वार्षिक भाडे ₹1,00,000 पेक्षा जास्त असल्यास)',
  rentLandlordPanPlaceholder: 'उदा. ABCDE1234F',
  rentMonthlyAmountLabel: 'मासिक भाडे रक्कम (₹)',
  rentAddressLabel: 'भाड्याच्या घराचा पत्ता',
  rentAddressPlaceholder: 'फ्लॅट ३०२, शांती रेसिडेन्सी, कोथरूड, पुणे - ४११०३८',
  rentStartMonthLabel: 'सुरुवातीचा महिना',
  rentCountLabel: 'A4 पानावरील पावत्यांची संख्या',
  rentCount1: '१ महिना',
  rentCount2: '२ महिने',
  rentCount3: '३ महिने (तिमाही)',
  rentPayModeLabel: 'पेमेंटचा प्रकार',
  rentPayModes: ['UPI / बँक ट्रान्सफर', 'NEFT / IMPS', 'चेक (Cheque)', 'रोख (Cash)'],
  rentReceiptNoLabel: 'पावती क्रमांक (सुरुवात)',
  rentIncludeStampLabel: 'सहीसाठी ₹1 रेव्हेन्यू स्टॅम्प बॉक्स दाखवा',
  rentDownloadPdfBtn: 'A4 PDF डाउनलोड करा',
  rentDownloadingBtn: 'A4 PDF तयार होत आहे...',
  rentSampleFillBtn: 'नमुना माहिती भरा',
  rentPreviewTitle: 'लाइव्ह A4 प्रिंट प्रिव्ह्यू',
  salCompanyLabel: 'कंपनी / संस्थेचे नाव',
  salCompanyPlaceholder: 'उदा. सह्याद्री टेक सोल्युशन्स प्रा. लि.',
  salCompanyAddrLabel: 'कंपनीचा पत्ता',
  salCompanyAddrPlaceholder: 'प्लॉट १४, हिंजवडी फेज १, पुणे - ४११०५७',
  salMonthLabel: 'पगाराचा महिना व वर्ष',
  salEmpNameLabel: 'कर्मचाऱ्याचे नाव',
  salEmpNamePlaceholder: 'उदा. स्नेहा जोशी',
  salEmpIdLabel: 'कर्मचारी आयडी (ID)',
  salDesignationLabel: 'पदनाम (Designation)',
  salDesignationPlaceholder: 'उदा. सिनियर एक्झिक्युटिव्ह',
  salDepartmentLabel: 'विभाग (Department)',
  salDepartmentPlaceholder: 'उदा. ऑपरेशन्स',
  salPanUanLabel: 'PAN / UAN क्रमांक (ऐच्छिक)',
  salPaidDaysLabel: 'कामाचे दिवस (उदा. 30 / 30)',
  salEarningsTitle: 'उत्पन्न / भत्ते (₹)',
  salBasicLabel: 'मूळ पगार (Basic)',
  salHraLabel: 'घरभाडे भत्ता (HRA)',
  salAllowanceLabel: 'प्रवास व विशेष भत्ता',
  salBonusLabel: 'बोनस / इन्सेंटिव्ह',
  salDeductionsTitle: 'कपात (Deductions ₹)',
  salPfLabel: 'भविष्य निर्वाह निधी (PF)',
  salPtLabel: 'व्यवसाय कर (PT)',
  salTdsLabel: 'आयकर (TDS)',
  salOtherDedLabel: 'इतर कपात',
  salGrossLabel: 'एकूण पगार (Gross)',
  salTotalDedLabel: 'एकूण कपात',
  salNetPayLabel: 'निव्वळ पगार (Net Pay)',
  // GST & EMI Calculator
  finTabGst: 'GST कॅल्क्युलेटर',
  finTabEmi: 'कर्ज EMI कॅल्क्युलेटर',
  gstAmountLabel: 'मूळ किंवा बिलाची रक्कम (₹)',
  gstRateLabel: 'GST दर निवडा (%)',
  gstCustomRateLabel: 'इतर %',
  gstModeLabel: 'हिशोबाचा प्रकार',
  gstExclusiveBtn: 'GST Exclusive (+ GST जोडा)',
  gstInclusiveBtn: 'GST Inclusive (GST वेगळा करा)',
  gstSupplyTypeLabel: 'कर विभागणी',
  gstIntraBtn: 'राज्यांतर्गत (CGST + SGST)',
  gstInterBtn: 'आंतरराज्य (IGST)',
  gstBaseAmountLabel: 'मूळ करपात्र रक्कम',
  gstTaxAmountLabel: 'एकूण GST रक्कम',
  gstCgstLabel: 'CGST',
  gstSgstLabel: 'SGST',
  gstIgstLabel: 'IGST',
  gstTotalAmountLabel: 'अंतिम एकूण बिल (₹)',
  gstCopyBtn: 'तपशील कॉपी करा',
  gstCopiedBtn: 'कॉपी झाले',
  emiPresetHome: 'गृहकर्ज (Home)',
  emiPresetVehicle: 'वाहन कर्ज (Vehicle)',
  emiPresetPersonal: 'वैयक्तिक कर्ज',
  emiLoanAmountLabel: 'कर्जाची रक्कम (₹)',
  emiInterestRateLabel: 'वार्षिक व्याजदर (% p.a.)',
  emiTenureLabel: 'कर्जाचा कालावधी',
  emiYearsUnit: 'वर्षे',
  emiMonthsUnit: 'महिने',
  emiMonthlyTitle: 'मासिक हप्ता (EMI)',
  emiPrincipalLabel: 'मुद्दल रक्कम',
  emiTotalInterestLabel: 'एकूण व्याज',
  emiTotalPayableLabel: 'एकूण परतफेड रक्कम',
  emiScheduleTitle: 'वार्षिक कर्ज परतफेड तक्ता',
  emiYearCol: 'वर्ष',
  emiPrincipalCol: 'मुद्दल जमा',
  emiInterestCol: 'व्याज जमा',
  emiBalanceCol: 'शिल्लक मुद्दल',
  // Image Format Converter
  convUploadTitle: 'कोणताही फोटो अपलोड करा किंवा येथे ड्रॅग करा (PNG, WebP, JPG, BMP)',
  convUploadHint: 'मोबाईलमधील कोणताही फोटो किंवा स्क्रीनशॉट थेट उच्च गुणवत्तेच्या JPG, PNG किंवा WebP मध्ये बदला',
  convUploadBtn: 'फोटो निवडा',
  convFileTypeError: 'कृपया वैध इमेज फाईल निवडा (PNG, JPG, WebP, BMP किंवा GIF).',
  convFormatLabel: 'आउटपुट फॉरमॅट निवडा',
  convQualityLabel: 'गुणवत्ता (Quality)',
  convPngLosslessHint: 'PNG फॉरमॅट लॉसलेस गुणवत्तेत आणि पारदर्शक बॅकग्राउंडसह जतन होतो.',
  convBgFillLabel: 'JPG साठी बॅकग्राउंड रंग (पारदर्शक फोटो असल्यास)',
  convBgWhite: 'पांढरा',
  convBgBlack: 'काळा',
  convBgSoft: 'हलका करडा',
  convConvertBtn: 'फॉरमॅट बदला (Convert)',
  convConvertingBtn: 'रूपांतर सुरू आहे...',
  convOriginalLabel: 'मूळ फोटो',
  convOutputLabel: 'तयार झालेला फोटो',
  convDownloadBtn: 'डाउनलोड करा',
  convDownloadAllBtn: 'सर्व डाउनलोड करा',
  convAddMoreBtn: 'दुसरा फोटो निवडा',
  convClearBtn: 'साफ करा',
  convBatchProHint: 'एकाच वेळी अनेक फोटो कन्व्हर्ट करण्यासाठी Pro पास घ्या',
  convErrorGeneric: 'हा फोटो कन्व्हर्ट करताना त्रुटी आली. कृपया दुसरा फोटो वापरून पहा.',
  convWaitingLabel: 'कन्व्हर्ट करण्यासाठी तयार',
  // Word Counter & Typing Pad
  wordModeLabel: 'टायपिंग भाषा निवडा',
  wordModeEn: 'English (थेट)',
  wordModeMr: 'मराठी (English → मराठी)',
  wordModeHi: 'हिंदी (English → हिंदी)',
  wordCountLabel: 'शब्द (Words)',
  wordCharsWithSpaceLabel: 'अक्षरे (स्पेससह)',
  wordCharsNoSpaceLabel: 'अक्षरे (स्पेसशिवाय)',
  wordSentencesLabel: 'वाक्ये (Sentences)',
  wordParagraphsLabel: 'परिच्छेद (Paragraphs)',
  wordReadTimeLabel: 'वाचन वेळ',
  wordMinUnit: 'मिनिट',
  wordLiveHintPrefix: 'सध्याचा शब्द:',
  wordLiveHintSpace: 'रूपांतरासाठी Space / Enter दाबा किंवा शब्द निवडा:',
  wordConvertNowBtn: 'शब्द बदला',
  wordConvertAllBtn: 'पूर्ण इंग्रजी मजकूर बदला',
  wordSampleBtn: 'नमुना मजकूर',
  wordCopyBtn: 'मजकूर कॉपी करा',
  wordCopiedBtn: 'कॉपी झाले!',
  wordDownloadTxtBtn: '.TXT डाउनलोड',
  wordClearBtn: 'पुसा (Clear)',
  wordCleanSpacesBtn: 'अतिरिक्त स्पेस काढा',
  wordPlaceholderEn: 'शब्द, अक्षरे आणि वाक्ये मोजण्यासाठी येथे मजकूर टाईप करा किंवा पेस्ट करा...',
  wordPlaceholderMr: 'येथे इंग्रजी अक्षरांत टाईप करा (उदा. namaskar maharashtra) — Space दाबताच मराठीत रूपांतर होईल...',
  wordPlaceholderHi: 'येथे इंग्रजी अक्षरांत टाईप करा (उदा. namaste bharat) — Space दाबताच हिंदीत रूपांतर होईल...',
  wordQuickCharsLabel: 'झटपट अक्षरे:',
  wordExamplesTitle: 'सोपी टीप: "namaskar" + Space → नमस्कार | "maharashtra" → महाराष्ट्र | "L" → ळ | "dny" → ज्ञ',
};

const HI_STRINGS: SiteStrings = {
  brandName: 'SadhanBox',
  brandTaglineShort: '१००% मुफ्त और सुरक्षित टूल्स',
  navHome: 'होम',
  navAllTools: 'सभी टूल्स',
  navAllToolsSubheading: '१९ ब्राउज़र-आधारित ऑनलाइन टूल्स',
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
    'बायोडाटा व रिज्यूमे, पासपोर्ट फोटो, आधार/पैन ID कार्ड प्रिंट, PDF कंप्रेसर, PDF से JPG व स्कैन क्लीनर, GST बिल व कोटेशन, निमंत्रण व त्यौहार कार्ड, सिग्नेचर रिसाइज़, रेंट रसीद व सैलरी स्लिप, GST व EMI कैलकुलेटर, इमेज कन्वर्टर, मराठी/हिंदी टाइपिंग, बैकग्राउंड रिमूवर, PDF टूल्स, इमेज कंप्रेसर, QR, आयु कैलकुलेटर व वॉटरमार्क ऐडर — सभी आपके ब्राउज़र में।',
  heroPrimaryCta: 'शादी का बायोडाटा बनाएं',
  heroSecondaryCta: 'सभी १९ टूल्स देखें',
  heroSuiteTitle: 'SadhanBox सूट',
  heroSuiteSubtitle: '१९ उपयोगी ऑनलाइन टूल्स',
  heroLiveDownloadsLabel: 'लाइव डाउनलोड',
  heroPrivacyStatVal: '१००%',
  heroPrivacyStatLabel: 'ब्राउज़र सुरक्षा',
  heroNoSignupNote: 'लॉगिन या साइन-अप की जरूरत नहीं — टूल चुनें और तुरंत उपयोग शुरू करें।',
  toolsGridHeading: 'आपके दैनिक कार्यों के लिए सभी टूल्स',
  toolsGridSubheading: 'नीचे से कोई भी टूल चुनें — सभी फाइलें आपके डिवाइस पर ही प्रोसेस होती हैं।',
  toolsGridCount: '१९ टूल्स उपलब्ध',
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
    'सभी १८ मुफ्त टूल्स का दैनिक उपयोग',
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
    'सभी १९ टूल्स में १००% विज्ञापन-मुक्त अनुभव',
    'सभी रॉयल व गोल्डन बायोडाटा और रिज्यूमे टेम्प्लेट्स अनलॉक',
    'बिना वॉटरमार्क PDF + Pro इमेज/PDF/वीडियो वॉटरमार्क ऐडर',
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
  // Passport Photo Maker
  passUploadTitle: 'अपना फोटो अपलोड करें या यहाँ ड्रैग करें',
  passUploadHint: 'JPG, PNG या WEBP सपोर्ट · MPSC/UPSC और पासपोर्ट A4 शीट के लिए सीधा चेहरा वाला फोटो चुनें',
  passUploadBtn: 'फोटो चुनें',
  passChangePhotoBtn: 'दूसरा फोटो चुनें',
  passFileTypeError: 'कृपया सही JPG, PNG या WEBP फोटो चुनें।',
  passNameLabel: 'फोटो पर नाम (वैकल्पिक)',
  passNamePlaceholder: 'उदा. RAHUL SHARMA',
  passDateLabel: 'फोटो खींचने की तारीख (वैकल्पिक)',
  passClearDateBtn: 'हटाएं',
  passBgLabel: 'बैकग्राउंड रंग',
  passBgOriginal: 'मूल फोटो',
  passBgWhite: 'सफेद',
  passBgLightBlue: 'हल्का नीला',
  passAiBgBtn: 'AI से बैकग्राउंड बदलें',
  passAiBgWorking: 'पुराना बैकग्राउंड हटाया जा रहा है...',
  passAiBgReady: 'नया बैकग्राउंड सफलतापूर्वक लागू हुआ',
  passAiBgError: 'बैकग्राउंड ऑटोमैटिक हटाया नहीं जा सका। मूल फोटो का उपयोग किया जा रहा है।',
  passSheetCountLabel: 'A4 शीट पर फोटो संख्या (MPSC / UPSC)',
  passCount8: '८ फोटो (४×२)',
  passCount12: '१२ फोटो (४×३)',
  passZoomLabel: 'फोटो ज़ूम',
  passOffsetYLabel: 'ऊपर-नीचे स्थिति',
  passCutBorderLabel: 'काटने के लिए प्रत्येक फोटो के चारों ओर हल्की बॉर्डर दिखाएं',
  passSinglePreviewTitle: 'सिंगल फोटो (3.5 × 4.5 सेमी)',
  passSheetPreviewTitle: 'A4 प्रिंट शीट प्रिव्यू',
  passDownloadPdfBtn: 'A4 PDF डाउनलोड करें',
  passDownloadJpgBtn: 'A4 JPG डाउनलोड करें',
  passDownloadSingleBtn: 'सिंगल JPG डाउनलोड करें',
  passPdfGenerating: 'A4 PDF बन रही है...',
  passDatePrefix: 'DOP:',
  // Signature & Thumb Resize Tool
  sigUploadTitle: 'सिग्नेचर या अंगूठे के निशान का फोटो अपलोड करें',
  sigUploadHint: 'JPG, PNG या WEBP सपोर्ट · MPSC, UPSC, SSC, IBPS और सरकारी फॉर्म के लिए उपयुक्त',
  sigUploadBtn: 'सिग्नेचर / थंब चुनें',
  sigChangeBtn: 'दूसरा फोटो चुनें',
  sigFileTypeError: 'कृपया सही JPG, PNG या WEBP इमेज चुनें।',
  sigPresetLabel: 'सरकारी फॉर्म के अनुसार साइज चुनें',
  sigPreset140: 'सिग्नेचर (140 × 60 px)',
  sigPreset240: 'अंगूठे का निशान (240 × 240 px)',
  sigPreset300: 'चौड़ा सिग्नेचर (300 × 120 px)',
  sigPresetCustom: 'कस्टम साइज (px)',
  sigWidthLabel: 'चौड़ाई (px)',
  sigHeightLabel: 'ऊंचाई (px)',
  sigMinKbLabel: 'न्यूनतम साइज (KB)',
  sigMaxKbLabel: 'अधिकतम साइज (KB)',
  sigAutoCropLabel: 'खाली किनारों को ऑटो-क्रॉप करें (Auto-Crop)',
  sigAutoCropHint: 'हस्ताक्षर या अंगूठे के चारों ओर की खाली सफेद जगह को अपने आप काटता है',
  sigCleanPaperLabel: 'कागज सफेद और स्याही गहरी करें',
  sigCleanPaperHint: 'फोटो के हल्के ग्रे बैकग्राउंड को शुद्ध सफेद (#FFFFFF) बनाता है',
  sigProcessBtn: 'रिसाइज़ और कंप्रेस करें',
  sigProcessingBtn: 'प्रोसेसिंग जारी है...',
  sigOriginalLabel: 'मूल इमेज',
  sigResultLabel: 'तैयार इमेज (JPG)',
  sigRangeError: 'कृपया मान्य पिक्सेल (30–2000 px) और KB सीमा (5–500 KB, न्यूनतम ≤ अधिकतम) दर्ज करें।',
  sigErrorGeneric: 'इमेज प्रोसेस नहीं हो सकी। कृपया दूसरा फोटो आजमाएं।',
  sigDownloadJpgBtn: 'JPG डाउनलोड करें',
  sigReadyBadge: 'सटीक पिक्सेल और KB साइज तैयार है',
  // Rent Receipt & Salary Slip Generator
  rentTabReceipt: 'रेंट रसीद (HRA)',
  rentTabSalary: 'सैलरी स्लिप (Salary Slip)',
  rentTenantNameLabel: 'किरायेदार / कर्मचारी का नाम',
  rentTenantPlaceholder: 'उदा. रोहन देशमुख',
  rentLandlordNameLabel: 'मकान मालिक का नाम',
  rentLandlordPlaceholder: 'उदा. सुरेश कुलकर्णी',
  rentLandlordPanLabel: 'मकान मालिक का PAN (वैकल्पिक — सालाना किराया ₹1,00,000 से अधिक होने पर)',
  rentLandlordPanPlaceholder: 'उदा. ABCDE1234F',
  rentMonthlyAmountLabel: 'मासिक किराया राशि (₹)',
  rentAddressLabel: 'किराये के मकान का पता',
  rentAddressPlaceholder: 'फ्लैट ३०२, शांति रेजीडेंसी, कोथरूड, पुणे - ४११०३८',
  rentStartMonthLabel: 'प्रारंभिक महीना',
  rentCountLabel: 'A4 पेज पर रसीद संख्या',
  rentCount1: '१ महीना',
  rentCount2: '२ महीने',
  rentCount3: '३ महीने (तिमाही)',
  rentPayModeLabel: 'भुगतान का माध्यम',
  rentPayModes: ['UPI / बैंक ट्रांसफर', 'NEFT / IMPS', 'चेक (Cheque)', 'नकद (Cash)'],
  rentReceiptNoLabel: 'रसीद संख्या (प्रारंभ)',
  rentIncludeStampLabel: 'हस्ताक्षर के लिए ₹1 रेवेन्यू स्टैम्प बॉक्स दिखाएं',
  rentDownloadPdfBtn: 'A4 PDF डाउनलोड करें',
  rentDownloadingBtn: 'A4 PDF बन रही है...',
  rentSampleFillBtn: 'सैंपल जानकारी भरें',
  rentPreviewTitle: 'लाइव A4 प्रिंट प्रिव्यू',
  salCompanyLabel: 'कंपनी / नियोक्ता का नाम',
  salCompanyPlaceholder: 'उदा. सह्याद्री टेक सॉल्यूशंस प्रा. लि.',
  salCompanyAddrLabel: 'कंपनी का पता',
  salCompanyAddrPlaceholder: 'प्लॉट १४, हिंजवडी फेज १, पुणे - ४११०५७',
  salMonthLabel: 'वेतन महीना और वर्ष',
  salEmpNameLabel: 'कर्मचारी का नाम',
  salEmpNamePlaceholder: 'उदा. स्नेहा जोशी',
  salEmpIdLabel: 'कर्मचारी आईडी (ID)',
  salDesignationLabel: 'पदनाम (Designation)',
  salDesignationPlaceholder: 'उदा. सीनियर एग्जीक्यूटिव',
  salDepartmentLabel: 'विभाग (Department)',
  salDepartmentPlaceholder: 'उदा. ऑपरेशंस',
  salPanUanLabel: 'PAN / UAN नंबर (वैकल्पिक)',
  salPaidDaysLabel: 'कार्य दिवस (उदा. 30 / 30)',
  salEarningsTitle: 'आय / भत्ते (₹)',
  salBasicLabel: 'मूल वेतन (Basic)',
  salHraLabel: 'मकान किराया भत्ता (HRA)',
  salAllowanceLabel: 'यात्रा व विशेष भत्ता',
  salBonusLabel: 'बोनस / प्रोत्साहन',
  salDeductionsTitle: 'कटौती (Deductions ₹)',
  salPfLabel: 'भविष्य निधि (PF)',
  salPtLabel: 'प्रोफेशनल टैक्स (PT)',
  salTdsLabel: 'आयकर (TDS)',
  salOtherDedLabel: 'अन्य कटौती',
  salGrossLabel: 'कुल वेतन (Gross)',
  salTotalDedLabel: 'कुल कटौती',
  salNetPayLabel: 'शुद्ध वेतन (Net Pay)',
  // GST & EMI Calculator
  finTabGst: 'GST कैलकुलेटर',
  finTabEmi: 'लोन EMI कैलकुलेटर',
  gstAmountLabel: 'मूल या बिल राशि (₹)',
  gstRateLabel: 'GST दर चुनें (%)',
  gstCustomRateLabel: 'कस्टम %',
  gstModeLabel: 'गणना का प्रकार',
  gstExclusiveBtn: 'GST Exclusive (+ GST जोड़ें)',
  gstInclusiveBtn: 'GST Inclusive (GST अलग करें)',
  gstSupplyTypeLabel: 'टैक्स विभाजन',
  gstIntraBtn: 'राज्य के भीतर (CGST + SGST)',
  gstInterBtn: 'अंतरराज्यीय (IGST)',
  gstBaseAmountLabel: 'मूल कर योग्य राशि',
  gstTaxAmountLabel: 'कुल GST राशि',
  gstCgstLabel: 'CGST',
  gstSgstLabel: 'SGST',
  gstIgstLabel: 'IGST',
  gstTotalAmountLabel: 'अंतिम बिल राशि (₹)',
  gstCopyBtn: 'सारांश कॉपी करें',
  gstCopiedBtn: 'कॉपी हुआ',
  emiPresetHome: 'होम लोन',
  emiPresetVehicle: 'वाहन / कार लोन',
  emiPresetPersonal: 'पर्सनल लोन',
  emiLoanAmountLabel: 'लोन की राशि (₹)',
  emiInterestRateLabel: 'वार्षिक ब्याज दर (% p.a.)',
  emiTenureLabel: 'लोन अवधि',
  emiYearsUnit: 'वर्ष',
  emiMonthsUnit: 'महीने',
  emiMonthlyTitle: 'मासिक किस्त (EMI)',
  emiPrincipalLabel: 'मूलधन राशि',
  emiTotalInterestLabel: 'कुल ब्याज देय',
  emiTotalPayableLabel: 'कुल भुगतान राशि',
  emiScheduleTitle: 'वार्षिक लोन भुगतान तालिका',
  emiYearCol: 'वर्ष',
  emiPrincipalCol: 'मूलधन भुगतान',
  emiInterestCol: 'ब्याज भुगतान',
  emiBalanceCol: 'शेष राशि',
  // Image Format Converter
  convUploadTitle: 'कोई भी फोटो अपलोड करें या यहाँ ड्रैग करें (PNG, WebP, JPG, BMP)',
  convUploadHint: 'मोबाइल की कोई भी फोटो या स्क्रीनशॉट सीधे उच्च गुणवत्ता वाले JPG, PNG या WebP में बदलें',
  convUploadBtn: 'फोटो चुनें',
  convFileTypeError: 'कृपया सही इमेज फाइल चुनें (PNG, JPG, WebP, BMP या GIF)।',
  convFormatLabel: 'आउटपुट फॉर्मेट चुनें',
  convQualityLabel: 'आउटपुट गुणवत्ता (Quality)',
  convPngLosslessHint: 'PNG फॉर्मेट बिना गुणवत्ता खोए पारदर्शी बैकग्राउंड के साथ सेव होता है।',
  convBgFillLabel: 'JPG के लिए बैकग्राउंड रंग (पारदर्शी फोटो होने पर)',
  convBgWhite: 'सफेद',
  convBgBlack: 'काला',
  convBgSoft: 'हल्का ग्रे',
  convConvertBtn: 'फॉर्मेट बदलें (Convert)',
  convConvertingBtn: 'बदला जा रहा है...',
  convOriginalLabel: 'मूल फोटो',
  convOutputLabel: 'बदला हुआ फोटो',
  convDownloadBtn: 'डाउनलोड करें',
  convDownloadAllBtn: 'सभी डाउनलोड करें',
  convAddMoreBtn: 'दूसरा फोटो चुनें',
  convClearBtn: 'साफ करें',
  convBatchProHint: 'एक साथ कई फोटो कन्वर्ट करने के लिए Pro पास लें',
  convErrorGeneric: 'इस इमेज फॉर्मेट को बदला नहीं जा सका। कृपया दूसरा फोटो आजमाएं।',
  convWaitingLabel: 'कन्वर्ट करने के लिए तैयार',
  // Word Counter & Typing Pad
  wordModeLabel: 'टाइपिंग भाषा चुनें',
  wordModeEn: 'English (सीधे)',
  wordModeMr: 'मराठी (English → मराठी)',
  wordModeHi: 'हिंदी (English → हिंदी)',
  wordCountLabel: 'शब्द (Words)',
  wordCharsWithSpaceLabel: 'अक्षर (स्पेस सहित)',
  wordCharsNoSpaceLabel: 'अक्षर (बिना स्पेस)',
  wordSentencesLabel: 'वाक्य (Sentences)',
  wordParagraphsLabel: 'पैराग्राफ (Paragraphs)',
  wordReadTimeLabel: 'पढ़ने का समय',
  wordMinUnit: 'मिनट',
  wordLiveHintPrefix: 'मौजूदा शब्द:',
  wordLiveHintSpace: 'बदलने के लिए Space / Enter दबाएं या विकल्प चुनें:',
  wordConvertNowBtn: 'शब्द बदलें',
  wordConvertAllBtn: 'पूरा अंग्रेजी टेक्स्ट बदलें',
  wordSampleBtn: 'सैंपल टेक्स्ट',
  wordCopyBtn: 'टेक्स्ट कॉपी करें',
  wordCopiedBtn: 'कॉपी हुआ!',
  wordDownloadTxtBtn: '.TXT डाउनलोड',
  wordClearBtn: 'साफ करें',
  wordCleanSpacesBtn: 'अतिरिक्त स्पेस हटाएं',
  wordPlaceholderEn: 'शब्द, अक्षर और वाक्य गिनने के लिए यहाँ कोई भी अंग्रेजी, मराठी या हिंदी टेक्स्ट टाइप या पेस्ट करें...',
  wordPlaceholderMr: 'यहाँ अंग्रेजी में टाइप करें (जैसे namaskar maharashtra) — Space दबाते ही मराठी में बदल जाएगा...',
  wordPlaceholderHi: 'यहाँ अंग्रेजी में टाइप करें (जैसे namaste bharat) — Space दबाते ही हिंदी में बदल जाएगा...',
  wordQuickCharsLabel: 'त्वरित अक्षर:',
  wordExamplesTitle: 'त्वरित मदद: "namaste" + Space → नमस्ते | "bharat" → भारत | "L" → ळ | "dny" → ज्ञ',
};

export const SITE_STRINGS: Record<UiLang, SiteStrings> = {
  en: EN_STRINGS,
  mr: MR_STRINGS,
  hi: HI_STRINGS,
};

export function getSiteStrings(lang: UiLang): SiteStrings {
  return SITE_STRINGS[lang] || EN_STRINGS;
}
