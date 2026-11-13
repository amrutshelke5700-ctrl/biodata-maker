import { AppLanguage } from '../types/biodata';

export interface LocalizedOption {
  id: string;
  labels: Record<AppLanguage, string>;
}

const DIGIT_TABLES: Partial<Record<AppLanguage, string[]>> = {
  mr: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  hi: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  gu: ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'],
  bn: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
  pa: ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯'],
  or: ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'],
  ur: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
};

const ALL_REGIONAL_DIGIT_SETS: string[][] = [
  ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'],
  ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
  ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯'],
  ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'],
  ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
  ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'],
];

export function toLocalizedDigits(value: string | number, language: AppLanguage): string {
  const table = DIGIT_TABLES[language];
  const str = String(value);
  if (!table) return str;
  return str.replace(/\d/g, (d) => table[Number(d)] ?? d);
}

export function toDevanagariDigits(value: string | number): string {
  return toLocalizedDigits(value, 'mr');
}

export function toAsciiDigits(value: string): string {
  let out = value;
  for (const table of ALL_REGIONAL_DIGIT_SETS) {
    table.forEach((glyph, idx) => {
      if (out.includes(glyph)) {
        out = out.split(glyph).join(String(idx));
      }
    });
  }
  return out;
}

const HEIGHT_UNITS: Record<AppLanguage, { ft: string; in: string }> = {
  mr: { ft: 'फूट', in: 'इंच' },
  hi: { ft: 'फीट', in: 'इंच' },
  gu: { ft: 'ફૂટ', in: 'ઇંચ' },
  bn: { ft: 'ফুট', in: 'ইঞ্চি' },
  ta: { ft: 'அடி', in: 'அங்குலம்' },
  te: { ft: 'అడుగుల', in: 'అంగుళాలు' },
  kn: { ft: 'ಅಡಿ', in: 'ಇಂಚು' },
  ml: { ft: 'അടി', in: 'ഇഞ്ച്' },
  pa: { ft: 'ਫੁੱਟ', in: 'ਇੰਚ' },
  or: { ft: 'ଫୁଟ', in: 'ଇଞ୍ଚ' },
  ur: { ft: 'فٹ', in: 'انچ' },
  en: { ft: 'ft', in: 'in' },
};

/**
 * Height options from 4'5" to 6'6" in all 12 supported languages
 */
export const HEIGHT_OPTIONS: LocalizedOption[] = (() => {
  const list: LocalizedOption[] = [];
  const langs = Object.keys(HEIGHT_UNITS) as AppLanguage[];
  for (let feet = 4; feet <= 6; feet++) {
    const minInch = feet === 4 ? 5 : 0;
    const maxInch = feet === 6 ? 6 : 11;
    for (let inch = minInch; inch <= maxInch; inch++) {
      const labels = {} as Record<AppLanguage, string>;
      for (const lang of langs) {
        if (lang === 'en') {
          labels[lang] = `${feet} ft ${inch} in (${feet}'${inch}")`;
        } else {
          const u = HEIGHT_UNITS[lang];
          labels[lang] = `${toLocalizedDigits(feet, lang)} ${u.ft} ${toLocalizedDigits(inch, lang)} ${u.in}`;
        }
      }
      list.push({
        id: `${feet}'${inch}"`,
        labels,
      });
    }
  }
  return list;
})();

export const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const;

export const RASHI_OPTIONS: LocalizedOption[] = [
  {
    id: 'aries',
    labels: {
      mr: 'मेष',
      hi: 'मेष',
      gu: 'મેષ',
      bn: 'মেষ',
      ta: 'மேஷம்',
      te: 'మేషం',
      kn: 'ಮೇಷ',
      ml: 'മേടം',
      pa: 'ਮੇਖ',
      or: 'ମେଷ',
      ur: 'حمل',
      en: 'Aries',
    },
  },
  {
    id: 'taurus',
    labels: {
      mr: 'वृषभ',
      hi: 'वृषभ',
      gu: 'વૃષભ',
      bn: 'বৃষ',
      ta: 'ரிஷபம்',
      te: 'వృషభం',
      kn: 'ವೃಷಭ',
      ml: 'ഇടവം',
      pa: 'ਬ੍ਰਿਖ',
      or: 'ବୃଷ',
      ur: 'ثور',
      en: 'Taurus',
    },
  },
  {
    id: 'gemini',
    labels: {
      mr: 'मिथुन',
      hi: 'मिथुन',
      gu: 'મિથુન',
      bn: 'মিথুন',
      ta: 'மிதுனம்',
      te: 'మిథునం',
      kn: 'ಮಿಥುನ',
      ml: 'മിഥുനം',
      pa: 'ਮਿਥੁਨ',
      or: 'ମିଥୁନ',
      ur: 'جوزا',
      en: 'Gemini',
    },
  },
  {
    id: 'cancer',
    labels: {
      mr: 'कर्क',
      hi: 'कर्क',
      gu: 'કર્ક',
      bn: 'কর্কট',
      ta: 'கடகம்',
      te: 'కర్కాటకం',
      kn: 'ಕರ್ಕಾಟಕ',
      ml: 'കർക്കിടകം',
      pa: 'ਕਰਕ',
      or: 'କର୍କଟ',
      ur: 'سرطان',
      en: 'Cancer',
    },
  },
  {
    id: 'leo',
    labels: {
      mr: 'सिंह',
      hi: 'सिंह',
      gu: 'સિંહ',
      bn: 'সিংহ',
      ta: 'சிம்மம்',
      te: 'సింహం',
      kn: 'ಸಿಂಹ',
      ml: 'ചിങ്ങം',
      pa: 'ਸਿੰਘ',
      or: 'ସିଂହ',
      ur: 'اسد',
      en: 'Leo',
    },
  },
  {
    id: 'virgo',
    labels: {
      mr: 'कन्या',
      hi: 'कन्या',
      gu: 'કન્યા',
      bn: 'কন্যা',
      ta: 'கன்னி',
      te: 'కన్య',
      kn: 'ಕನ್ಯಾ',
      ml: 'കന്നി',
      pa: 'ਕੰਨਿਆ',
      or: 'କନ୍ୟା',
      ur: 'سنبلہ',
      en: 'Virgo',
    },
  },
  {
    id: 'libra',
    labels: {
      mr: 'तूळ',
      hi: 'तुला',
      gu: 'તુલા',
      bn: 'তুলা',
      ta: 'துலாம்',
      te: 'తుల',
      kn: 'ತುಲಾ',
      ml: 'തുലാം',
      pa: 'ਤੁਲਾ',
      or: 'ତୁଳା',
      ur: 'میزان',
      en: 'Libra',
    },
  },
  {
    id: 'scorpio',
    labels: {
      mr: 'वृश्चिक',
      hi: 'वृश्चिक',
      gu: 'વૃશ્ચિક',
      bn: 'বৃশ্চিক',
      ta: 'விருச்சிகம்',
      te: 'వృశ్చికం',
      kn: 'ವೃಶ್ಚಿಕ',
      ml: 'വൃശ്ചികം',
      pa: 'ਬ੍ਰਿਸ਼ਚਕ',
      or: 'ବିଛା',
      ur: 'عقرب',
      en: 'Scorpio',
    },
  },
  {
    id: 'sagittarius',
    labels: {
      mr: 'धनु',
      hi: 'धनु',
      gu: 'ધનુ',
      bn: 'ধনু',
      ta: 'தனுசு',
      te: 'ధనుస్సు',
      kn: 'ಧನು',
      ml: 'ധനു',
      pa: 'ਧਨੁ',
      or: 'ଧନୁ',
      ur: 'قوس',
      en: 'Sagittarius',
    },
  },
  {
    id: 'capricorn',
    labels: {
      mr: 'मकर',
      hi: 'मकर',
      gu: 'મકર',
      bn: 'মকর',
      ta: 'மகரம்',
      te: 'మకరం',
      kn: 'ಮಕರ',
      ml: 'മകരം',
      pa: 'ਮਕਰ',
      or: 'ମକର',
      ur: 'جدی',
      en: 'Capricorn',
    },
  },
  {
    id: 'aquarius',
    labels: {
      mr: 'कुंभ',
      hi: 'कुंभ',
      gu: 'કુંભ',
      bn: 'কুম্ভ',
      ta: 'கும்பம்',
      te: 'కుంభం',
      kn: 'ಕುಂಭ',
      ml: 'കുംഭം',
      pa: 'ਕੁੰਭ',
      or: 'କୁମ୍ଭ',
      ur: 'دلو',
      en: 'Aquarius',
    },
  },
  {
    id: 'pisces',
    labels: {
      mr: 'मीन',
      hi: 'मीन',
      gu: 'મીન',
      bn: 'মীন',
      ta: 'மீனம்',
      te: 'మీనం',
      kn: 'ಮೀನ',
      ml: 'മീനം',
      pa: 'ਮੀਨ',
      or: 'ମୀନ',
      ur: 'حوت',
      en: 'Pisces',
    },
  },
];

export const MAHARASHTRA_BIRTHPLACES: LocalizedOption[] = [
  {
    id: 'kolhapur',
    labels: {
      mr: 'कोल्हापूर',
      hi: 'कोल्हापुर',
      gu: 'કોલ્હાપુર',
      bn: 'কোলহাপুর',
      ta: 'கோலாப்பூர்',
      te: 'కొల్హాపూర్',
      kn: 'ಕೊಲ್ಹಾಪುರ',
      ml: 'കോലാപ്പൂർ',
      pa: 'ਕੋਲਹਾਪੁਰ',
      or: 'କୋହ୍ଲାପୁର',
      ur: 'کولہاپور',
      en: 'Kolhapur',
    },
  },
  {
    id: 'pune',
    labels: {
      mr: 'पुणे',
      hi: 'पुणे',
      gu: 'પુણે',
      bn: 'পুনে',
      ta: 'புனே',
      te: 'పుణె',
      kn: 'ಪುಣೆ',
      ml: 'പൂനെ',
      pa: 'ਪੁਣੇ',
      or: 'ପୁଣେ',
      ur: 'پونے',
      en: 'Pune',
    },
  },
  {
    id: 'mumbai',
    labels: {
      mr: 'मुंबई',
      hi: 'मुंबई',
      gu: 'મુંબઈ',
      bn: 'মুম্বই',
      ta: 'மும்பை',
      te: 'ముంబై',
      kn: 'ಮುಂಬೈ',
      ml: 'മുംബൈ',
      pa: 'ਮੁੰਬਈ',
      or: 'ମୁମ୍ବାଇ',
      ur: 'ممبئی',
      en: 'Mumbai',
    },
  },
  {
    id: 'satara',
    labels: {
      mr: 'सातारा',
      hi: 'सतारा',
      gu: 'સાતારા',
      bn: 'সাতারা',
      ta: 'சதாரா',
      te: 'సతారా',
      kn: 'ಸತಾರಾ',
      ml: 'സതാര',
      pa: 'ਸਤਾਰਾ',
      or: 'ସତାରା',
      ur: 'ستارا',
      en: 'Satara',
    },
  },
  {
    id: 'sangli',
    labels: {
      mr: 'सांगली',
      hi: 'सांगली',
      gu: 'સાંગલી',
      bn: 'সাংলি',
      ta: 'சாங்லி',
      te: 'సాంగ్లీ',
      kn: 'ಸಾಂಗ್ಲಿ',
      ml: 'സാംഗ്ലി',
      pa: 'ਸਾਂਗਲੀ',
      or: 'ସାଙ୍ଗଲି',
      ur: 'سانگلی',
      en: 'Sangli',
    },
  },
  {
    id: 'solapur',
    labels: {
      mr: 'सोलापूर',
      hi: 'सोलापुर',
      gu: 'સોલાપુર',
      bn: 'সোলাপুর',
      ta: 'சோலாப்பூர்',
      te: 'సోలాపూర్',
      kn: 'ಸೊಲ್ಲಾಪುರ',
      ml: 'സോലാപ്പൂർ',
      pa: 'ਸੋਲਾਪੁਰ',
      or: 'ସୋଲାପୁର',
      ur: 'سولاپور',
      en: 'Solapur',
    },
  },
  {
    id: 'nashik',
    labels: {
      mr: 'नाशिक',
      hi: 'नासिक',
      gu: 'નાશિક',
      bn: 'নাশিক',
      ta: 'நாசிக்',
      te: 'నాసిక్',
      kn: 'ನಾಸಿಕ್',
      ml: 'നാസിക്',
      pa: 'ਨਾਸਿਕ',
      or: 'ନାସିକ୍',
      ur: 'ناسک',
      en: 'Nashik',
    },
  },
  {
    id: 'sambhajinagar',
    labels: {
      mr: 'छत्रपती संभाजीनगर',
      hi: 'छत्रपति संभाजीनगर',
      gu: 'છત્રપતિ સંભાજીનગર',
      bn: 'ছত্রপতি সম্ভাজীনগর',
      ta: 'சத்ரபதி சம்பாஜிநகர்',
      te: 'ఛత్రపతి శంభాజీనగర్',
      kn: 'ಛತ್ರಪತಿ ಸಂಭಾಜಿನಗರ',
      ml: 'ഛത്രപതി സംഭാജിനഗർ',
      pa: 'ਛਤਰਪਤੀ ਸੰਭਾਜੀਨਗਰ',
      or: 'ଛତ୍ରପତି ସମ୍ଭାଜୀନଗର',
      ur: 'چھترپتی سمبھاجی نگر',
      en: 'Chhatrapati Sambhajinagar',
    },
  },
  {
    id: 'nagpur',
    labels: {
      mr: 'नागपूर',
      hi: 'नागपुर',
      gu: 'નાગપુર',
      bn: 'নাগপুর',
      ta: 'நாக்பூர்',
      te: 'నాగ్‌పూర్',
      kn: 'ನಾಗ್ಪುರ',
      ml: 'നാഗ്പൂർ',
      pa: 'ਨਾਗਪੁਰ',
      or: 'ନାଗପୁର',
      ur: 'ناگپور',
      en: 'Nagpur',
    },
  },
  {
    id: 'amravati',
    labels: {
      mr: 'अमरावती',
      hi: 'अमरावती',
      gu: 'અમરાવતી',
      bn: 'অমরাবতী',
      ta: 'அமராவதி',
      te: 'అమరావతి',
      kn: 'ಅಮರಾವತಿ',
      ml: 'അമരാവതി',
      pa: 'ਅਮਰਾਵਤੀ',
      or: 'ଅମରାବତୀ',
      ur: 'امراوتی',
      en: 'Amravati',
    },
  },
  {
    id: 'ahmednagar',
    labels: {
      mr: 'अहिल्यानगर (अहमदनगर)',
      hi: 'अहिल्यानगर (अहमदनगर)',
      gu: 'અહિલ્યાનગર (અહમદનગર)',
      bn: 'অহিল্যানগর (আহমেদনগর)',
      ta: 'அஹில்யாநகர் (அகமதுநகர்)',
      te: 'అహల్యానగర్ (అహ్మద్‌నగర్)',
      kn: 'ಅಹಲ್ಯಾನಗರ (ಅಹಮದ್‌ನಗರ)',
      ml: 'അഹല്യാനഗർ (അഹമ്മദ്‌നഗർ)',
      pa: 'ਅਹਿਲਿਆਨਗਰ (ਅਹਿਮਦਨਗਰ)',
      or: 'ଅହିଲ୍ୟାନଗର (ଅହମ୍ମଦନଗର)',
      ur: 'اہلیا نگر (احمد نگر)',
      en: 'Ahilyanagar (Ahmednagar)',
    },
  },
  {
    id: 'ratnagiri',
    labels: {
      mr: 'रत्नागिरी',
      hi: 'रत्नागिरी',
      gu: 'રત્નાગિરી',
      bn: 'রত্নাগিরি',
      ta: 'ரத்னகிரி',
      te: 'రత్నగిరి',
      kn: 'ರತ್ನಾಗಿರಿ',
      ml: 'രത്‌നഗിരി',
      pa: 'ਰਤਨਾਗਿਰੀ',
      or: 'ରତ୍ନଗିରି',
      ur: 'رتناگیری',
      en: 'Ratnagiri',
    },
  },
  {
    id: 'sindhudurg',
    labels: {
      mr: 'सिंधुदुर्ग',
      hi: 'सिंधुदुर्ग',
      gu: 'સિંધુદુર્ગ',
      bn: 'সিন্ধুদুর্গ',
      ta: 'சிந்துதுர்க்',
      te: 'సింధుదుర్గ్',
      kn: 'ಸಿಂಧುದುರ್ಗ',
      ml: 'സിന്ധുദുർഗ്',
      pa: 'ਸਿੰਧੂਦੁਰਗ',
      or: 'ସିନ୍ଧୁଦୁର୍ଗ',
      ur: 'سندھودرگ',
      en: 'Sindhudurg',
    },
  },
  {
    id: 'thane',
    labels: {
      mr: 'ठाणे',
      hi: 'ठाणे',
      gu: 'ઠાણે',
      bn: 'থানে',
      ta: 'தானே',
      te: 'థానే',
      kn: 'ಥಾಣೆ',
      ml: 'താനെ',
      pa: 'ਠਾਣੇ',
      or: 'ଠାଣେ',
      ur: 'تھانے',
      en: 'Thane',
    },
  },
  {
    id: 'raigad',
    labels: {
      mr: 'रायगड',
      hi: 'रायगढ़',
      gu: 'રાયગઢ',
      bn: 'রায়গড়',
      ta: 'ராய்கட்',
      te: 'రాయ్‌గఢ్',
      kn: 'ರಾಯಗಡ',
      ml: 'റായ്ഗഡ്',
      pa: 'ਰਾਏਗੜ੍ਹ',
      or: 'ରାୟଗଡ଼',
      ur: 'رائے گڑھ',
      en: 'Raigad',
    },
  },
  {
    id: 'palghar',
    labels: {
      mr: 'पालघर',
      hi: 'पालघर',
      gu: 'પાલઘર',
      bn: 'পালঘর',
      ta: 'பால்கர்',
      te: 'పాల్ఘర్',
      kn: 'ಪಾಲ್ಘರ್',
      ml: 'പാൽഘർ',
      pa: 'ਪਾਲਘਰ',
      or: 'ପାଲଘର',
      ur: 'پالگھر',
      en: 'Palghar',
    },
  },
  {
    id: 'dhule',
    labels: {
      mr: 'धुळे',
      hi: 'धुले',
      gu: 'ધુળે',
      bn: 'ধুলে',
      ta: 'துளே',
      te: 'ధూలే',
      kn: 'ಧುಳೆ',
      ml: 'ധൂലെ',
      pa: 'ਧੁਲੇ',
      or: 'ଧୁଲେ',
      ur: 'دھولے',
      en: 'Dhule',
    },
  },
  {
    id: 'jalgaon',
    labels: {
      mr: 'जळगाव',
      hi: 'जलगांव',
      gu: 'જળગાંવ',
      bn: 'জলগাঁও',
      ta: 'ஜல்கான்',
      te: 'జలగావ్',
      kn: 'ಜಲಗಾಂವ್',
      ml: 'ജൽഗാവ്',
      pa: 'ਜਲਗਾਉਂ',
      or: 'ଜଳଗାଓଁ',
      ur: 'جلگاؤں',
      en: 'Jalgaon',
    },
  },
  {
    id: 'nandurbar',
    labels: {
      mr: 'नंदुरबार',
      hi: 'नंदुरबार',
      gu: 'નંદુરબાર',
      bn: 'নন্দুরবার',
      ta: 'நந்துர்பார்',
      te: 'నందూర్బార్',
      kn: 'ನಂದುರ್ಬಾರ್',
      ml: 'നന്ദുർബാർ',
      pa: 'ਨੰਦੂਰਬਾਰ',
      or: 'ନନ୍ଦୁରବାର',
      ur: 'نندوربار',
      en: 'Nandurbar',
    },
  },
  {
    id: 'jalna',
    labels: {
      mr: 'जालना',
      hi: 'जालना',
      gu: 'જાલના',
      bn: 'জালনা',
      ta: 'ஜால்னா',
      te: 'జాల్నా',
      kn: 'ಜಾಲ್ನಾ',
      ml: 'ജൽന',
      pa: 'ਜਾਲਨਾ',
      or: 'ଜାଲନା',
      ur: 'جالنہ',
      en: 'Jalna',
    },
  },
  {
    id: 'parbhani',
    labels: {
      mr: 'परभणी',
      hi: 'परभणी',
      gu: 'પરભણી',
      bn: 'পরভনি',
      ta: 'பர்பானி',
      te: 'పర్భాని',
      kn: 'ಪರ್ಭಣಿ',
      ml: 'പർഭണി',
      pa: 'ਪਰਭਣੀ',
      or: 'ପରଭଣୀ',
      ur: 'پربھنی',
      en: 'Parbhani',
    },
  },
  {
    id: 'hingoli',
    labels: {
      mr: 'हिंगोली',
      hi: 'हिंगोली',
      gu: 'હિંગોલી',
      bn: 'হিঙ্গোলি',
      ta: 'ஹிங்கோலி',
      te: 'హింగోలి',
      kn: 'ಹಿಂಗೋಲಿ',
      ml: 'ഹിംഗോളി',
      pa: 'ਹਿੰਗੋਲੀ',
      or: 'ହିଙ୍ଗୋଲି',
      ur: 'ہنگولی',
      en: 'Hingoli',
    },
  },
  {
    id: 'beed',
    labels: {
      mr: 'बीड',
      hi: 'बीड',
      gu: 'બીડ',
      bn: 'বীড',
      ta: 'பீட்',
      te: 'బీడ్',
      kn: 'ಬೀಡ್',
      ml: 'ബീഡ്',
      pa: 'ਬੀਡ',
      or: 'ବୀଡ୍',
      ur: 'بیڑ',
      en: 'Beed',
    },
  },
  {
    id: 'nanded',
    labels: {
      mr: 'नांदेड',
      hi: 'नांदेड़',
      gu: 'નાંદેડ',
      bn: 'নান্দেদ',
      ta: 'நாந்தேட்',
      te: 'నాందేడ్',
      kn: 'ನಾಂದೇಡ್',
      ml: 'നാന്ദേഡ്',
      pa: 'ਨਾਂਦੇੜ',
      or: 'ନାନ୍ଦେଡ୍',
      ur: 'ناندیڑ',
      en: 'Nanded',
    },
  },
  {
    id: 'dharashiv',
    labels: {
      mr: 'धाराशिव',
      hi: 'धाराशिव',
      gu: 'ધારાશિવ',
      bn: 'ধারাশিব',
      ta: 'தாராசிவ்',
      te: 'ధారాశివ్',
      kn: 'ಧಾರಾಶಿವ',
      ml: 'ധാരാശിവ്',
      pa: 'ਧਾਰਾਸ਼ਿਵ',
      or: 'ଧାରାଶିବ',
      ur: 'دھاراشیو',
      en: 'Dharashiv',
    },
  },
  {
    id: 'latur',
    labels: {
      mr: 'लातूर',
      hi: 'लातूर',
      gu: 'લાતુર',
      bn: 'লাতুর',
      ta: 'லாதூர்',
      te: 'లాతూర్',
      kn: 'ಲಾತೂರ್',
      ml: 'ലാത്തൂർ',
      pa: 'ਲਾਤੂਰ',
      or: 'ଲାତୁର',
      ur: 'لاتور',
      en: 'Latur',
    },
  },
  {
    id: 'buldhana',
    labels: {
      mr: 'बुलढाणा',
      hi: 'बुलढाणा',
      gu: 'બુલઢાણા',
      bn: 'বুলধানা',
      ta: 'புல்தானா',
      te: 'బుల్ధానా',
      kn: 'ಬುಲ್ಧಾನಾ',
      ml: 'ബുൽധാന',
      pa: 'ਬੁਲਢਾਣਾ',
      or: 'ବୁଲଢାଣା',
      ur: 'بلڈھانہ',
      en: 'Buldhana',
    },
  },
  {
    id: 'akola',
    labels: {
      mr: 'अकोला',
      hi: 'अकोला',
      gu: 'અકોલા',
      bn: 'আকোলা',
      ta: 'அகோலா',
      te: 'అకోలా',
      kn: 'ಅಕೋಲಾ',
      ml: 'അകോല',
      pa: 'ਅਕੋਲਾ',
      or: 'ଅକୋଲା',
      ur: 'اکولہ',
      en: 'Akola',
    },
  },
  {
    id: 'washim',
    labels: {
      mr: 'वाशिम',
      hi: 'वाशिम',
      gu: 'વાશિમ',
      bn: 'ওয়াসিম',
      ta: 'வாஷிம்',
      te: 'వాషిమ్',
      kn: 'ವಾಶಿಂ',
      ml: 'വാഷിം',
      pa: 'ਵਾਸ਼ਿਮ',
      or: 'ୱାଶିମ',
      ur: 'واشم',
      en: 'Washim',
    },
  },
  {
    id: 'yavatmal',
    labels: {
      mr: 'यवतमाळ',
      hi: 'यवतमाल',
      gu: 'યવતમાળ',
      bn: 'যবতমাল',
      ta: 'யவத்மால்',
      te: 'యవత్మాల్',
      kn: 'ಯವತ್ಮಾಳ್',
      ml: 'യവത്മാൽ',
      pa: 'ਯਵਤਮਾਲ',
      or: 'ଯବତମାଳ',
      ur: 'یوتمال',
      en: 'Yavatmal',
    },
  },
  {
    id: 'wardha',
    labels: {
      mr: 'वर्धा',
      hi: 'वर्धा',
      gu: 'વર્ધા',
      bn: 'ওয়ার্ধা',
      ta: 'வர்தா',
      te: 'వార్ధా',
      kn: 'ವರ್ಧಾ',
      ml: 'വാർധ',
      pa: 'ਵਰਧਾ',
      or: 'ୱର୍ଦ୍ଧା',
      ur: 'وردھا',
      en: 'Wardha',
    },
  },
  {
    id: 'bhandara',
    labels: {
      mr: 'भंडारा',
      hi: 'भंडारा',
      gu: 'ભંડારા',
      bn: 'ভান্ডারা',
      ta: 'பண்டாரா',
      te: 'భండారా',
      kn: 'ಭಂಡಾರಾ',
      ml: 'ഭണ്ഡാര',
      pa: 'ਭੰਡਾਰਾ',
      or: 'ଭଣ୍ଡାରା',
      ur: 'بھنڈارا',
      en: 'Bhandara',
    },
  },
  {
    id: 'gondia',
    labels: {
      mr: 'गोंदिया',
      hi: 'गोंदिया',
      gu: 'ગોંદિયા',
      bn: 'গোন্দিয়া',
      ta: 'கோந்தியா',
      te: 'గోండియా',
      kn: 'ಗೊಂಡಿಯಾ',
      ml: 'ഗോന്ദിയ',
      pa: 'ਗੋਂਦੀਆ',
      or: 'ଗୋନ୍ଦିଆ',
      ur: 'گوندیا',
      en: 'Gondia',
    },
  },
  {
    id: 'chandrapur',
    labels: {
      mr: 'चंद्रपूर',
      hi: 'चंद्रपुर',
      gu: 'ચંદ્રપુર',
      bn: 'চন্দ্রপুর',
      ta: 'சந்திரபூர்',
      te: 'చంద్రపూర్',
      kn: 'ಚಂದ್ರಾಪುರ',
      ml: 'ചന്ദ്രാപൂർ',
      pa: 'ਚੰਦਰਪੁਰ',
      or: 'ଚନ୍ଦ୍ରପୁର',
      ur: 'چندرپور',
      en: 'Chandrapur',
    },
  },
  {
    id: 'gadchiroli',
    labels: {
      mr: 'गडचिरोली',
      hi: 'गढ़चिरौली',
      gu: 'ગઢચિરોલી',
      bn: 'গড়চিরোলি',
      ta: 'கட்சிரோலி',
      te: 'గడ్చిరోలి',
      kn: 'ಗಡ್‌ಚಿರೋಲಿ',
      ml: 'ഗഡ്ചിരോളി',
      pa: 'ਗੜ੍ਹਚਿਰੌਲੀ',
      or: 'ଗଡ଼ଚିରୋଲି',
      ur: 'گڈچرولی',
      en: 'Gadchiroli',
    },
  },
  {
    id: 'pimpri-chinchwad',
    labels: {
      mr: 'पिंपरी-चिंचवड',
      hi: 'पिंपरी-चिंचवड',
      gu: 'પિંપરી-ચિંચવડ',
      bn: 'পিম্পরি-চিঞ্চওয়াড়',
      ta: 'பிம்ப்ரி-சிஞ்ச்வாட்',
      te: 'పింప్రి-చించ్వాడ్',
      kn: 'ಪಿಂಪ್ರಿ-ಚಿಂಚ್‌ವಾಡ್',
      ml: 'പിംപ്രി-ചിഞ്ച്‌വാഡ്',
      pa: 'ਪਿੰਪਰੀ-ਚਿੰਚਵਾੜ',
      or: 'ପିମ୍ପରି-ଚିଞ୍ଚୱାଡ୍',
      ur: 'پمپری چنچوڑ',
      en: 'Pimpri-Chinchwad',
    },
  },
  {
    id: 'navi-mumbai',
    labels: {
      mr: 'नवी मुंबई',
      hi: 'नवी मुंबई',
      gu: 'નવી મુંબઈ',
      bn: 'নবি মুম্বই',
      ta: 'நவி மும்பை',
      te: 'నవీ ముంబై',
      kn: 'ನವಿ ಮುಂಬೈ',
      ml: 'നവി മുംബൈ',
      pa: 'ਨਵੀਂ ਮੁੰਬਈ',
      or: 'ନବୀ ମୁମ୍ବାଇ',
      ur: 'نوی ممبئی',
      en: 'Navi Mumbai',
    },
  },
  {
    id: 'kalyan-dombivli',
    labels: {
      mr: 'कल्याण-डोंबिवली',
      hi: 'कल्याण-डोंबिवली',
      gu: 'કલ્યાણ-ડોંબિવલી',
      bn: 'কল্যাণ-ডোম্বিভলি',
      ta: 'கல்யாண்-டோம்பிவிலி',
      te: 'కళ్యాణ్-డోంబివలి',
      kn: 'ಕಲ್ಯಾಣ್-ಡೊಂಬಿವಲಿ',
      ml: 'കല്യാൺ-ഡോംബിവ്‌ലി',
      pa: 'ਕਲਿਆਣ-ਡੋਂਬੀਵਲੀ',
      or: 'କଲ୍ୟାଣ-ଡୋମ୍ବିବଲୀ',
      ur: 'کلیان ڈومبیولی',
      en: 'Kalyan-Dombivli',
    },
  },
  {
    id: 'ichalkaranji',
    labels: {
      mr: 'इचलकरंजी',
      hi: 'इचलकरंजी',
      gu: 'ઇચલકરંજી',
      bn: 'ইচলকরঞ্জি',
      ta: 'இச்சல்கரஞ்சி',
      te: 'ఇచల్‌కరంజి',
      kn: 'ಇಚಲಕರಂಜಿ',
      ml: 'ഇച്ചൽകരഞ്ചി',
      pa: 'ਇਚਲਕਰੰਜੀ',
      or: 'ଇଚଲକରଞ୍ଜୀ',
      ur: 'اچل کرنجی',
      en: 'Ichalkaranji',
    },
  },
  {
    id: 'karad',
    labels: {
      mr: 'कराड',
      hi: 'कराड',
      gu: 'કરાડ',
      bn: 'করাড',
      ta: 'கராட்',
      te: 'కరాడ్',
      kn: 'ಕರಾಡ್',
      ml: 'കരാഡ്',
      pa: 'ਕਰਾਡ',
      or: 'କରାଡ୍',
      ur: 'کراڈ',
      en: 'Karad',
    },
  },
  {
    id: 'baramati',
    labels: {
      mr: 'बारामती',
      hi: 'बारामती',
      gu: 'બારામતી',
      bn: 'বারামতি',
      ta: 'பாராமதி',
      te: 'బారామతి',
      kn: 'ಬಾರಾಮತಿ',
      ml: 'ബാരാമതി',
      pa: 'ਬਾਰਾਮਤੀ',
      or: 'ବାରାମତୀ',
      ur: 'بارامتی',
      en: 'Baramati',
    },
  },
  {
    id: 'panvel',
    labels: {
      mr: 'पनवेल',
      hi: 'पनवेल',
      gu: 'પનવેલ',
      bn: 'পানভেল',
      ta: 'பன்வேல்',
      te: 'పన్వేల్',
      kn: 'ಪನ್ವೇಲ್',
      ml: 'പൻവേൽ',
      pa: 'ਪਨਵੇਲ',
      or: 'ପନଭେଲ୍',
      ur: 'پنویل',
      en: 'Panvel',
    },
  },
  {
    id: 'alibag',
    labels: {
      mr: 'अलिबाग',
      hi: 'अलीबाग',
      gu: 'અલીબાગ',
      bn: 'আলিবাগ',
      ta: 'அலிபாக்',
      te: 'అలీబాగ్',
      kn: 'ಅಲಿಬಾಗ್',
      ml: 'അലിബാഗ്',
      pa: 'ਅਲੀਬਾਗ',
      or: 'ଅଲିବାଗ୍',
      ur: 'علی باغ',
      en: 'Alibag',
    },
  },
  {
    id: 'malegaon',
    labels: {
      mr: 'मालेगाव',
      hi: 'मालेगांव',
      gu: 'માલેગાંવ',
      bn: 'মালেগাঁও',
      ta: 'மாலேகான்',
      te: 'మాలెగావ్',
      kn: 'ಮಾಲೆಗಾಂವ್',
      ml: 'മാലേഗാവ്',
      pa: 'ਮਾਲੇਗਾਉਂ',
      or: 'ମାଲେଗାଓଁ',
      ur: 'مالیگاؤں',
      en: 'Malegaon',
    },
  },
];

export const BIRTH_TIME_HOURS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, '0')
);

export const BIRTH_TIME_MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, '0')
);

export const BIRTH_TIME_PERIODS_BY_LANGUAGE: Record<AppLanguage, string[]> = {
  mr: ['सकाळी', 'दुपारी', 'सायंकाळी', 'रात्री'],
  hi: ['सुबह', 'दोपहर', 'शाम', 'रात'],
  gu: ['સવારે', 'બપોરે', 'સાંજે', 'રાત્રે'],
  bn: ['সকাল', 'দুপুর', 'বিকাল', 'রাত'],
  ta: ['காலை', 'மதியம்', 'மாலை', 'இரவு'],
  te: ['ఉదయం', 'మధ్యాహ్నం', 'సాయంత్రం', 'రాత్రి'],
  kn: ['ಬೆಳಿಗ್ಗೆ', 'ಮಧ್ಯಾಹ್ನ', 'ಸಂಜೆ', 'ರಾತ್ರಿ'],
  ml: ['രാവിലെ', 'ഉച്ചയ്ക്ക്', 'വൈകുന്നേരം', 'രാത്രി'],
  pa: ['ਸਵੇਰੇ', 'ਦੁਪਹਿਰ', 'ਸ਼ਾਮ', 'ਰਾਤ'],
  or: ['ସକାଳ', 'ମଧ୍ୟାହ୍ନ', 'ସନ୍ଧ୍ୟା', 'ରାତି'],
  ur: ['صبح', 'دوپہر', 'شام', 'رات'],
  en: ['AM', 'PM'],
};

const TIME_SUFFIX_BY_LANGUAGE: Record<AppLanguage, string> = {
  mr: 'वाजता',
  hi: 'बजे',
  gu: 'વાગ્યે',
  bn: 'টায়',
  ta: 'மணி',
  te: 'గంటలకు',
  kn: 'ಗಂಟೆಗೆ',
  ml: 'മണിക്ക്',
  pa: 'ਵਜੇ',
  or: 'ଟା',
  ur: 'بجے',
  en: '',
};

const AGE_FORMAT_BY_LANGUAGE: Record<AppLanguage, { label: string; unit: string }> = {
  mr: { label: 'वय', unit: 'वर्षे' },
  hi: { label: 'उम्र', unit: 'वर्ष' },
  gu: { label: 'ઉંમર', unit: 'વર્ષ' },
  bn: { label: 'বয়স', unit: 'বছর' },
  ta: { label: 'வயது', unit: 'ஆண்டுகள்' },
  te: { label: 'వయస్సు', unit: 'సంవత్సరాలు' },
  kn: { label: 'ವಯಸ್ಸು', unit: 'ವರ್ಷಗಳು' },
  ml: { label: 'വയസ്സ്', unit: 'വർഷം' },
  pa: { label: 'ਉਮਰ', unit: 'ਸਾਲ' },
  or: { label: 'ବୟସ', unit: 'ବର୍ଷ' },
  ur: { label: 'عمر', unit: 'سال' },
  en: { label: 'Age', unit: 'Years' },
};

export interface ParsedBirthTime {
  hour: string;
  minute: string;
  period: string;
}

export function getBirthTimePeriods(language: AppLanguage): string[] {
  return BIRTH_TIME_PERIODS_BY_LANGUAGE[language] || BIRTH_TIME_PERIODS_BY_LANGUAGE.mr;
}

function detectPeriodBucket(raw: string): 0 | 1 | 2 | 3 | -1 {
  if (/\bAM\b/i.test(raw)) return 0;
  if (/\bPM\b/i.test(raw)) return 2;
  for (const periods of Object.values(BIRTH_TIME_PERIODS_BY_LANGUAGE)) {
    for (let idx = 0; idx < periods.length; idx++) {
      if (periods[idx] !== 'AM' && periods[idx] !== 'PM' && raw.includes(periods[idx])) {
        return (idx as 0 | 1 | 2 | 3);
      }
    }
  }
  return -1;
}

export function parseBirthTime(raw: string, language: AppLanguage): ParsedBirthTime {
  if (!raw.trim()) {
    return { hour: '', minute: '', period: '' };
  }
  const normalized = toAsciiDigits(raw);
  const timeMatch = normalized.match(/(\d{1,2})\s*:\s*(\d{2})/);
  let hour = '';
  let minute = '';
  if (timeMatch) {
    const hNum = Math.min(12, Math.max(1, Number(timeMatch[1])));
    const mNum = Math.min(59, Math.max(0, Number(timeMatch[2])));
    hour = String(hNum).padStart(2, '0');
    minute = String(mNum).padStart(2, '0');
  }

  const bucket = detectPeriodBucket(raw);
  const targetPeriods = getBirthTimePeriods(language);
  let period = '';
  if (language === 'en') {
    if (bucket === 0) period = 'AM';
    else if (bucket >= 1) period = 'PM';
  } else if (bucket >= 0 && bucket < targetPeriods.length) {
    period = targetPeriods[bucket];
  }

  return { hour, minute, period };
}

export function formatBirthTimeValue(
  hour: string,
  minute: string,
  period: string,
  language: AppLanguage
): string {
  if (!hour && !minute && !period) return '';
  const safeHour = hour || '07';
  const safeMinute = minute || '00';
  const targetPeriods = getBirthTimePeriods(language);
  const safePeriod = period && targetPeriods.includes(period) ? period : targetPeriods[0];
  if (language === 'en') {
    return `${safeHour}:${safeMinute} ${safePeriod}`;
  }
  const localizedTime = `${toLocalizedDigits(safeHour, language)}:${toLocalizedDigits(safeMinute, language)}`;
  const suffix = TIME_SUFFIX_BY_LANGUAGE[language];
  return suffix ? `${safePeriod} ${localizedTime} ${suffix}` : `${safePeriod} ${localizedTime}`;
}

export function calculateAgeFromIso(isoDate: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
  const [y, m, d] = isoDate.split('-').map(Number);
  const birth = new Date(y, m - 1, d);
  if (
    Number.isNaN(birth.getTime()) ||
    birth.getFullYear() !== y ||
    birth.getMonth() !== m - 1 ||
    birth.getDate() !== d
  ) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 && age <= 120 ? age : null;
}

export function formatBirthDateForDisplay(
  rawDate: string,
  language: AppLanguage,
  showAge: boolean
): string {
  const trimmed = rawDate.trim();
  if (!trimmed) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split('-');
    const formatted = `${day}/${month}/${year}`;
    const localizedDate = toLocalizedDigits(formatted, language);
    const age = showAge ? calculateAgeFromIso(trimmed) : null;
    if (age === null) return localizedDate;

    const ageCfg = AGE_FORMAT_BY_LANGUAGE[language];
    const localizedAge = toLocalizedDigits(age, language);
    return `${localizedDate} (${ageCfg.label}: ${localizedAge} ${ageCfg.unit})`;
  }

  return trimmed;
}

export function resolveHeightOptionId(rawHeight: string): string {
  const trimmed = rawHeight.trim();
  if (!trimmed) return '';
  const direct = HEIGHT_OPTIONS.find(
    (opt) => opt.id === trimmed || Object.values(opt.labels).includes(trimmed)
  );
  if (direct) return direct.id;

  const ascii = toAsciiDigits(trimmed);
  const match = ascii.match(/(\d)\s*(?:ft|'|फूट|फीट|ફૂટ|ফুট|அடி|అడుగుల|ಅಡಿ|അടി|ਫੁੱਟ|ଫୁଟ|فٹ)\s*(\d{1,2})/i);
  if (match) {
    const candidate = `${match[1]}'${match[2]}"`;
    const found = HEIGHT_OPTIONS.find((opt) => opt.id === candidate);
    if (found) return found.id;
  }
  return '';
}

export function resolveRashiOptionId(rawRashi: string): string {
  const trimmed = rawRashi.trim();
  if (!trimmed) return '';
  const lower = trimmed.toLowerCase();
  const direct = RASHI_OPTIONS.find(
    (opt) =>
      opt.id === lower ||
      Object.values(opt.labels).some(
        (lbl) => lbl.toLowerCase() === lower || lower.startsWith(lbl.toLowerCase())
      )
  );
  return direct ? direct.id : '';
}

export function translateSmartFieldValue(
  options: LocalizedOption[],
  rawValue: string,
  targetLanguage: AppLanguage
): string {
  const trimmed = rawValue.trim();
  if (!trimmed) return rawValue;
  const lower = trimmed.toLowerCase();
  const match = options.find((opt) =>
    Object.values(opt.labels).some((lbl) => lbl.toLowerCase() === lower)
  );
  return match ? match.labels[targetLanguage] : rawValue;
}
