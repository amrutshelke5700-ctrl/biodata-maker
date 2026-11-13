import { AppLanguage } from '../types/biodata';

export interface LanguageFontMeta {
  code: AppLanguage;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  primaryFont: string;
  fontStack: string;
  serifFontStack: string;
  probeText: string;
}

const UNIVERSAL_FALLBACK =
  "'Noto Sans Devanagari', 'Noto Sans Gujarati', 'Noto Sans Bengali', 'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Kannada', 'Noto Sans Malayalam', 'Noto Sans Gurmukhi', 'Noto Sans Oriya', 'Noto Sans Arabic', 'Plus Jakarta Sans', system-ui, sans-serif";

export const LANGUAGE_LIST: LanguageFontMeta[] = [
  {
    code: 'mr',
    nativeName: 'मराठी',
    dir: 'ltr',
    primaryFont: 'Noto Sans Devanagari',
    fontStack: `'Noto Sans Devanagari', ${UNIVERSAL_FALLBACK}`,
    serifFontStack: `'Noto Serif Devanagari', 'Noto Sans Devanagari', ${UNIVERSAL_FALLBACK}`,
    probeText: 'मराठी विवाह बायोडाटा',
  },
  {
    code: 'hi',
    nativeName: 'हिन्दी',
    dir: 'ltr',
    primaryFont: 'Noto Sans Devanagari',
    fontStack: `'Noto Sans Devanagari', ${UNIVERSAL_FALLBACK}`,
    serifFontStack: `'Noto Serif Devanagari', 'Noto Sans Devanagari', ${UNIVERSAL_FALLBACK}`,
    probeText: 'हिन्दी विवाह परिचय',
  },
  {
    code: 'gu',
    nativeName: 'ગુજરાતી',
    dir: 'ltr',
    primaryFont: 'Noto Sans Gujarati',
    fontStack: `'Noto Sans Gujarati', ${UNIVERSAL_FALLBACK}`,
    serifFontStack: `'Noto Sans Gujarati', ${UNIVERSAL_FALLBACK}`,
    probeText: 'ગુજરાતી લગ્ન બાયોડેટા',
  },
  {
    code: 'bn',
    nativeName: 'বাংলা',
    dir: 'ltr',
    primaryFont: 'Noto Sans Bengali',
    fontStack: `'Noto Sans Bengali', ${UNIVERSAL_FALLBACK}`,
    serifFontStack: `'Noto Sans Bengali', ${UNIVERSAL_FALLBACK}`,
    probeText: 'বাংলা বিবাহ বায়োডাটা',
  },
  {
    code: 'ta',
    nativeName: 'தமிழ்',
    dir: 'ltr',
    primaryFont: 'Noto Sans Tamil',
    fontStack: `'Noto Sans Tamil', ${UNIVERSAL_FALLBACK}`,
    serifFontStack: `'Noto Sans Tamil', ${UNIVERSAL_FALLBACK}`,
    probeText: 'தமிழ் திருமண விவரம்',
  },
  {
    code: 'te',
    nativeName: 'తెలుగు',
    dir: 'ltr',
    primaryFont: 'Noto Sans Telugu',
    fontStack: `'Noto Sans Telugu', ${UNIVERSAL_FALLBACK}`,
    serifFontStack: `'Noto Sans Telugu', ${UNIVERSAL_FALLBACK}`,
    probeText: 'తెలుగు వివాహ బయోడేటా',
  },
  {
    code: 'kn',
    nativeName: 'ಕನ್ನಡ',
    dir: 'ltr',
    primaryFont: 'Noto Sans Kannada',
    fontStack: `'Noto Sans Kannada', ${UNIVERSAL_FALLBACK}`,
    serifFontStack: `'Noto Sans Kannada', ${UNIVERSAL_FALLBACK}`,
    probeText: 'ಕನ್ನಡ ವಿವಾಹ ಪರಿಚಯ',
  },
  {
    code: 'ml',
    nativeName: 'മലയാളം',
    dir: 'ltr',
    primaryFont: 'Noto Sans Malayalam',
    fontStack: `'Noto Sans Malayalam', ${UNIVERSAL_FALLBACK}`,
    serifFontStack: `'Noto Sans Malayalam', ${UNIVERSAL_FALLBACK}`,
    probeText: 'മലയാളം വിവാഹ ബയോഡാറ്റ',
  },
  {
    code: 'pa',
    nativeName: 'ਪੰਜਾਬੀ',
    dir: 'ltr',
    primaryFont: 'Noto Sans Gurmukhi',
    fontStack: `'Noto Sans Gurmukhi', ${UNIVERSAL_FALLBACK}`,
    serifFontStack: `'Noto Sans Gurmukhi', ${UNIVERSAL_FALLBACK}`,
    probeText: 'ਪੰਜਾਬੀ ਵਿਆਹ ਬਾਇਓਡਾਟਾ',
  },
  {
    code: 'or',
    nativeName: 'ଓଡ଼ିଆ',
    dir: 'ltr',
    primaryFont: 'Noto Sans Oriya',
    fontStack: `'Noto Sans Oriya', ${UNIVERSAL_FALLBACK}`,
    serifFontStack: `'Noto Sans Oriya', ${UNIVERSAL_FALLBACK}`,
    probeText: 'ଓଡ଼ିଆ ବିବାହ ବାୟୋଡାଟା',
  },
  {
    code: 'ur',
    nativeName: 'اردو',
    dir: 'rtl',
    primaryFont: 'Noto Sans Arabic',
    fontStack: `'Noto Sans Arabic', 'Noto Nastaliq Urdu', ${UNIVERSAL_FALLBACK}`,
    serifFontStack: `'Noto Sans Arabic', 'Noto Nastaliq Urdu', ${UNIVERSAL_FALLBACK}`,
    probeText: 'اردو شادی بائیوڈیٹا',
  },
  {
    code: 'en',
    nativeName: 'English',
    dir: 'ltr',
    primaryFont: 'Plus Jakarta Sans',
    fontStack: `'Plus Jakarta Sans', ${UNIVERSAL_FALLBACK}`,
    serifFontStack: `'Plus Jakarta Sans', Georgia, serif`,
    probeText: 'Marriage Biodata Resume',
  },
];

export const VALID_LANGUAGES: AppLanguage[] = LANGUAGE_LIST.map((item) => item.code);

export function getLanguageMeta(language: AppLanguage): LanguageFontMeta {
  return LANGUAGE_LIST.find((item) => item.code === language) || LANGUAGE_LIST[0];
}

export async function ensureLanguageFontLoaded(language: AppLanguage): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;
  const meta = getLanguageMeta(language);

  try {
    await Promise.allSettled([
      document.fonts.load(`400 16px "${meta.primaryFont}"`, meta.probeText),
      document.fonts.load(`600 16px "${meta.primaryFont}"`, meta.probeText),
      document.fonts.load(`700 16px "${meta.primaryFont}"`, meta.probeText),
      ...(language === 'mr' || language === 'hi'
        ? [document.fonts.load('700 18px "Noto Serif Devanagari"', meta.probeText)]
        : []),
      ...(language === 'ur'
        ? [document.fonts.load('400 16px "Noto Nastaliq Urdu"', meta.probeText)]
        : []),
    ]);
    await document.fonts.ready;
  } catch {
    // Ignore font preloading errors and proceed with ready fonts
  }
}
