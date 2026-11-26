export type TypingPadLang = 'en' | 'mr' | 'hi';

const COMMON_WORD_OVERRIDES: Record<string, { mr: string; hi: string; alts?: string[] }> = {
  namaskar: { mr: 'नमस्कार', hi: 'नमस्कार' },
  namaste: { mr: 'नमस्ते', hi: 'नमस्ते' },
  maharashtra: { mr: 'महाराष्ट्र', hi: 'महाराष्ट्र' },
  marathi: { mr: 'मराठी', hi: 'मराठी' },
  hindi: { mr: 'हिंदी', hi: 'हिंदी', alts: ['हिन्दी'] },
  bharat: { mr: 'भारत', hi: 'भारत' },
  india: { mr: 'इंडिया', hi: 'इंडिया' },
  pune: { mr: 'पुणे', hi: 'पुणे' },
  mumbai: { mr: 'मुंबई', hi: 'मुंबई' },
  nagpur: { mr: 'नागपूर', hi: 'नागपुर' },
  nashik: { mr: 'नाशिक', hi: 'नासिक' },
  kolhapur: { mr: 'कोल्हापूर', hi: 'कोल्हापुर' },
  satara: { mr: 'सातारा', hi: 'सातारा' },
  sangli: { mr: 'सांगली', hi: 'सांगली' },
  solapur: { mr: 'सोलापूर', hi: 'सोलापुर' },
  thane: { mr: 'ठाणे', hi: 'ठाणे' },
  delhi: { mr: 'दिल्ली', hi: 'दिल्ली' },
  dilli: { mr: 'दिल्ली', hi: 'दिल्ली' },
  dhanyawad: { mr: 'धन्यवाद', hi: 'धन्यवाद' },
  dhanyavad: { mr: 'धन्यवाद', hi: 'धन्यवाद' },
  shubhechha: { mr: 'शुभेच्छा', hi: 'शुभेच्छा' },
  abhinandan: { mr: 'अभिनंदन', hi: 'अभिनंदन' },
  swagat: { mr: 'स्वागत', hi: 'स्वागत' },
  krupaya: { mr: 'कृपया', hi: 'कृपया' },
  kripya: { mr: 'कृपया', hi: 'कृपया' },
  shree: { mr: 'श्री', hi: 'श्री' },
  shri: { mr: 'श्री', hi: 'श्री' },
  sri: { mr: 'श्री', hi: 'श्री' },
  ganesh: { mr: 'गणेश', hi: 'गणेश' },
  ganpati: { mr: 'गणपती', hi: 'गणपति' },
  shiva: { mr: 'शिवा', hi: 'शिवा' },
  shivaji: { mr: 'शिवाजी', hi: 'शिवाजी' },
  lagna: { mr: 'लग्न', hi: 'लग्न' },
  vivah: { mr: 'विवाह', hi: 'विवाह' },
  patrika: { mr: 'पत्रिका', hi: 'पत्रिका' },
  parivar: { mr: 'परिवार', hi: 'परिवार' },
  kutumb: { mr: 'कुटुंब', hi: 'कुटुंब' },
  aai: { mr: 'आई', hi: 'आई' },
  baba: { mr: 'बाबा', hi: 'बाबा' },
  vadil: { mr: 'वडील', hi: 'वडील' },
  pita: { mr: 'पिता', hi: 'पिता' },
  mata: { mr: 'माता', hi: 'माता' },
  bhau: { mr: 'भाऊ', hi: 'भाऊ' },
  bhai: { mr: 'भाई', hi: 'भाई' },
  bahin: { mr: 'बहीण', hi: 'बहन' },
  behan: { mr: 'बहन', hi: 'बहन' },
  mitra: { mr: 'मित्र', hi: 'मित्र' },
  dost: { mr: 'दोस्त', hi: 'दोस्त' },
  mi: { mr: 'मी', hi: 'मी' },
  me: { mr: 'मी', hi: 'मैं', alts: ['मे'] },
  main: { mr: 'मैं', hi: 'मैं' },
  tumhi: { mr: 'तुम्ही', hi: 'तुमही' },
  tum: { mr: 'तुम', hi: 'तुम' },
  tu: { mr: 'तू', hi: 'तू' },
  aap: { mr: 'आप', hi: 'आप' },
  aapan: { mr: 'आपण', hi: 'आपन' },
  amhi: { mr: 'आम्ही', hi: 'हम' },
  hum: { mr: 'हम', hi: 'हम' },
  ahe: { mr: 'आहे', hi: 'आहे' },
  aahe: { mr: 'आहे', hi: 'आहे' },
  ahet: { mr: 'आहेत', hi: 'आहेत' },
  aahet: { mr: 'आहेत', hi: 'आहेत' },
  hai: { mr: 'है', hi: 'है' },
  hain: { mr: 'हैं', hi: 'हैं' },
  ho: { mr: 'हो', hi: 'हो' },
  hoy: { mr: 'होय', hi: 'होय' },
  nahi: { mr: 'नाही', hi: 'नहीं', alts: ['नाही'] },
  naahi: { mr: 'नाही', hi: 'नहीं' },
  nahin: { mr: 'नहीं', hi: 'नहीं' },
  ani: { mr: 'आणि', hi: 'और' },
  aani: { mr: 'आणि', hi: 'आणि' },
  aur: { mr: 'और', hi: 'और' },
  pan: { mr: 'पण', hi: 'पर', alts: ['पन', 'पान'] },
  parantu: { mr: 'परंतु', hi: 'परंतु' },
  kasa: { mr: 'कसा', hi: 'कसा' },
  kashi: { mr: 'कशी', hi: 'कशी' },
  kase: { mr: 'कसे', hi: 'कसे' },
  kaise: { mr: 'कैसे', hi: 'कैसे' },
  kaisa: { mr: 'कैसा', hi: 'कैसा' },
  kya: { mr: 'क्या', hi: 'क्या' },
  kay: { mr: 'काय', hi: 'काय' },
  kaay: { mr: 'काय', hi: 'काय' },
  kyon: { mr: 'क्यों', hi: 'क्यों' },
  kyunki: { mr: 'क्योंकि', hi: 'क्योंकि' },
  karan: { mr: 'कारण', hi: 'कारण' },
  chhan: { mr: 'छान', hi: 'छान' },
  sundar: { mr: 'सुंदर', hi: 'सुंदर' },
  uttam: { mr: 'उत्तम', hi: 'उत्तम' },
  mast: { mr: 'मस्त', hi: 'मस्त' },
  accha: { mr: 'अच्छा', hi: 'अच्छा' },
  achha: { mr: 'अच्छा', hi: 'अच्छा' },
  bahut: { mr: 'बहुत', hi: 'बहुत' },
  khup: { mr: 'खूप', hi: 'खूप' },
  khoop: { mr: 'खूप', hi: 'खूप' },
  aaj: { mr: 'आज', hi: 'आज' },
  udya: { mr: 'उद्या', hi: 'उद्या' },
  kal: { mr: 'काल', hi: 'कल', alts: ['काल'] },
  kaal: { mr: 'काल', hi: 'काल' },
  sakal: { mr: 'सकाळ', hi: 'सकाळ' },
  subah: { mr: 'सुबह', hi: 'सुबह' },
  ratra: { mr: 'रात्र', hi: 'रात्र' },
  raat: { mr: 'रात', hi: 'रात' },
  varsh: { mr: 'वर्ष', hi: 'वर्ष' },
  mahina: { mr: 'महिना', hi: 'महीना' },
  divas: { mr: 'दिवस', hi: 'दिवस' },
  din: { mr: 'दिन', hi: 'दिन' },
  vel: { mr: 'वेळ', hi: 'वेळ' },
  samay: { mr: 'समय', hi: 'समय' },
  nav: { mr: 'नाव', hi: 'नाव' },
  naam: { mr: 'नाम', hi: 'नाम' },
  gav: { mr: 'गाव', hi: 'गाव' },
  gaon: { mr: 'गाँव', hi: 'गाँव' },
  shahar: { mr: 'शहर', hi: 'शहर' },
  jilha: { mr: 'जिल्हा', hi: 'जिला' },
  jila: { mr: 'जिला', hi: 'जिला' },
  taluka: { mr: 'तालुका', hi: 'तालुका' },
  rajya: { mr: 'राज्य', hi: 'राज्य' },
  desh: { mr: 'देश', hi: 'देश' },
  ghar: { mr: 'घर', hi: 'घर' },
  patta: { mr: 'पत्ता', hi: 'पत्ता' },
  pata: { mr: 'पता', hi: 'पता' },
  mahiti: { mr: 'माहिती', hi: 'माहिती' },
  jankari: { mr: 'जानकारी', hi: 'जानकारी' },
  vidyarthi: { mr: 'विद्यार्थी', hi: 'विद्यार्थी' },
  shikshan: { mr: 'शिक्षण', hi: 'शिक्षण' },
  shikshak: { mr: 'शिक्षक', hi: 'शिक्षक' },
  nokri: { mr: 'नोकरी', hi: 'नौकरी' },
  naukri: { mr: 'नौकरी', hi: 'नौकरी' },
  vyavsay: { mr: 'व्यवसाय', hi: 'व्यवसाय' },
  kaam: { mr: 'काम', hi: 'काम' },
  kam: { mr: 'काम', hi: 'कम', alts: ['काम'] },
  seva: { mr: 'सेवा', hi: 'सेवा' },
  madat: { mr: 'मदत', hi: 'मदद' },
  madad: { mr: 'मदद', hi: 'मदद' },
  paisa: { mr: 'पैसा', hi: 'पैसा' },
  paise: { mr: 'पैसे', hi: 'पैसे' },
  rupaye: { mr: 'रुपये', hi: 'रुपये' },
  bhasha: { mr: 'भाषा', hi: 'भाषा' },
  shabd: { mr: 'शब्द', hi: 'शब्द' },
  pustak: { mr: 'पुस्तक', hi: 'पुस्तक' },
  patra: { mr: 'पत्र', hi: 'पत्र' },
  sandesh: { mr: 'संदेश', hi: 'संदेश' },
  prem: { mr: 'प्रेम', hi: 'प्रेम' },
  anand: { mr: 'आनंद', hi: 'आनंद' },
  aanand: { mr: 'आनंद', hi: 'आनंद' },
  shanti: { mr: 'शांती', hi: 'शांति' },
  sukh: { mr: 'सुख', hi: 'सुख' },
  yash: { mr: 'यश', hi: 'यश' },
  vijay: { mr: 'विजय', hi: 'विजय' },
  jay: { mr: 'जय', hi: 'जय' },
  jai: { mr: 'जय', hi: 'जय' },
  prarthana: { mr: 'प्रार्थना', hi: 'प्रार्थना' },
  mangal: { mr: 'मंगल', hi: 'मंगल' },
  sadhanbox: { mr: 'साधनबॉक्स', hi: 'साधनबॉक्स' },
  bhavishya: { mr: 'भविष्य', hi: 'भविष्य' },
  swasth: { mr: 'स्वस्थ', hi: 'स्वस्थ' },
  aapla: { mr: 'आपला', hi: 'आपला' },
  aapli: { mr: 'आपली', hi: 'आपली' },
  aaple: { mr: 'आपले', hi: 'आपले' },
  majha: { mr: 'माझा', hi: 'माझा' },
  majhi: { mr: 'माझी', hi: 'माझी' },
  majhe: { mr: 'माझे', hi: 'माझे' },
  tumcha: { mr: 'तुमचा', hi: 'तुमचा' },
  tumchi: { mr: 'तुमची', hi: 'तुमची' },
  tumche: { mr: 'तुमचे', hi: 'तुमचे' },
  mera: { mr: 'मेरा', hi: 'मेरा' },
  meri: { mr: 'मेरी', hi: 'मेरी' },
  mere: { mr: 'मेरे', hi: 'मेरे' },
  tumhara: { mr: 'तुम्हारा', hi: 'तुम्हारा' },
  aapka: { mr: 'आपका', hi: 'आपका' },
  aapki: { mr: 'आपकी', hi: 'आपकी' },
  hamara: { mr: 'हमारा', hi: 'हमारा' },
  sahayya: { mr: 'सहाय्य', hi: 'सहायता' },
  samarambh: { mr: 'समारंभ', hi: 'समारोह' },
  nimantran: { mr: 'निमंत्रण', hi: 'निमंत्रण' },
  shukriya: { mr: 'शुक्रिया', hi: 'शुक्रिया' },
  krishna: { mr: 'कृष्ण', hi: 'कृष्ण' },
  rama: { mr: 'रामा', hi: 'रामा' },
  ram: { mr: 'राम', hi: 'राम' },
  sita: { mr: 'सीता', hi: 'सीता' },
  lakshmi: { mr: 'लक्ष्मी', hi: 'लक्ष्मी' },
  saraswati: { mr: 'सरस्वती', hi: 'सरस्वती' },
  om: { mr: 'ॐ', hi: 'ॐ' },
};

interface ConsonantDef {
  roman: string;
  dev: string;
}

interface VowelDef {
  roman: string;
  indep: string;
  matra: string;
}

// Ordered longest-first for greedy matching
const CONSONANTS: ConsonantDef[] = [
  { roman: 'dny', dev: 'ज्ञ' },
  { roman: 'gya', dev: 'ज्ञ' },
  { roman: 'ksh', dev: 'क्ष' },
  { roman: 'shr', dev: 'श्र' },
  { roman: 'chh', dev: 'छ' },
  { roman: 'jny', dev: 'ज्ञ' },
  { roman: 'kh', dev: 'ख' },
  { roman: 'gh', dev: 'घ' },
  { roman: 'ch', dev: 'च' },
  { roman: 'jh', dev: 'झ' },
  { roman: 'Th', dev: 'ठ' },
  { roman: 'Dh', dev: 'ढ' },
  { roman: 'th', dev: 'थ' },
  { roman: 'dh', dev: 'ध' },
  { roman: 'ph', dev: 'फ' },
  { roman: 'bh', dev: 'भ' },
  { roman: 'sh', dev: 'श' },
  { roman: 'lh', dev: 'ळ' },
  { roman: 'zh', dev: 'झ' },
  { roman: 'ny', dev: 'ञ' },
  { roman: 'ng', dev: 'ङ' },
  { roman: 'k', dev: 'क' },
  { roman: 'q', dev: 'क' },
  { roman: 'g', dev: 'ग' },
  { roman: 'c', dev: 'क' },
  { roman: 'j', dev: 'ज' },
  { roman: 'z', dev: 'झ' },
  { roman: 'T', dev: 'ट' },
  { roman: 'D', dev: 'ड' },
  { roman: 'N', dev: 'ण' },
  { roman: 't', dev: 'त' },
  { roman: 'd', dev: 'द' },
  { roman: 'n', dev: 'न' },
  { roman: 'p', dev: 'प' },
  { roman: 'f', dev: 'फ' },
  { roman: 'b', dev: 'ब' },
  { roman: 'm', dev: 'म' },
  { roman: 'y', dev: 'य' },
  { roman: 'r', dev: 'र' },
  { roman: 'l', dev: 'ल' },
  { roman: 'L', dev: 'ळ' },
  { roman: 'v', dev: 'व' },
  { roman: 'w', dev: 'व' },
  { roman: 'S', dev: 'ष' },
  { roman: 's', dev: 'स' },
  { roman: 'h', dev: 'ह' },
];

// Ordered longest-first for greedy matching
const VOWELS: VowelDef[] = [
  { roman: 'aa', indep: 'आ', matra: 'ा' },
  { roman: 'ai', indep: 'ऐ', matra: 'ै' },
  { roman: 'au', indep: 'औ', matra: 'ौ' },
  { roman: 'ou', indep: 'औ', matra: 'ौ' },
  { roman: 'ee', indep: 'ई', matra: 'ी' },
  { roman: 'ii', indep: 'ई', matra: 'ी' },
  { roman: 'oo', indep: 'ऊ', matra: 'ू' },
  { roman: 'uu', indep: 'ऊ', matra: 'ू' },
  { roman: 'ri', indep: 'ऋ', matra: 'ृ' },
  { roman: 'R', indep: 'ऋ', matra: 'ृ' },
  { roman: 'A', indep: 'आ', matra: 'ा' },
  { roman: 'I', indep: 'ई', matra: 'ी' },
  { roman: 'U', indep: 'ऊ', matra: 'ू' },
  { roman: 'E', indep: 'ॲ', matra: 'ॅ' },
  { roman: 'O', indep: 'ऑ', matra: 'ॉ' },
  { roman: 'a', indep: 'अ', matra: '' },
  { roman: 'i', indep: 'इ', matra: 'ि' },
  { roman: 'u', indep: 'उ', matra: 'ु' },
  { roman: 'e', indep: 'ए', matra: 'े' },
  { roman: 'o', indep: 'ओ', matra: 'ो' },
];

const SPECIAL_MARKS: Record<string, string> = {
  M: 'ं',
  H: 'ः',
  '^': 'ँ',
};

const DEV_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

function matchConsonant(input: string, idx: number): ConsonantDef | null {
  for (const c of CONSONANTS) {
    if (input.startsWith(c.roman, idx)) {
      return c;
    }
  }
  // Fallback case-insensitive check for common lowercase/uppercase starts
  const lowerSlice = input.slice(idx).toLowerCase();
  for (const c of CONSONANTS) {
    if (lowerSlice.startsWith(c.roman.toLowerCase())) {
      return c;
    }
  }
  return null;
}

function matchVowel(input: string, idx: number): VowelDef | null {
  for (const v of VOWELS) {
    if (input.startsWith(v.roman, idx)) {
      return v;
    }
  }
  return null;
}

export function transliterateWordRuleBased(word: string, lang: 'mr' | 'hi'): string {
  if (!word) return '';
  const trimmed = word.trim();
  if (!trimmed) return word;

  const lowerKey = trimmed.toLowerCase();
  const dictHit = COMMON_WORD_OVERRIDES[lowerKey];
  if (dictHit) {
    return lang === 'mr' ? dictHit.mr : dictHit.hi;
  }

  let out = '';
  let i = 0;
  const len = word.length;
  let lastWasConsonant = false;

  while (i < len) {
    const ch = word[i];

    // Preserve Devanagari or non-ASCII characters directly
    if (ch.charCodeAt(0) > 127) {
      out += ch;
      lastWasConsonant = false;
      i += 1;
      continue;
    }

    // Special marks (anusvara / visarga / chandrabindu)
    if (SPECIAL_MARKS[ch]) {
      out += SPECIAL_MARKS[ch];
      lastWasConsonant = false;
      i += 1;
      continue;
    }

    // Check vowel first if at word start or after vowel/other, or if after consonant
    const vMatch = matchVowel(word, i);
    const cMatch = matchConsonant(word, i);

    // Handle 'ri' carefully: if at start or after consonant as 'ri' vowel vs 'r' + 'i'
    if (vMatch && (vMatch.roman !== 'ri' || !lastWasConsonant)) {
      if (lastWasConsonant) {
        out += vMatch.matra;
      } else {
        out += vMatch.indep;
      }
      lastWasConsonant = false;
      i += vMatch.roman.length;
      continue;
    }

    if (cMatch) {
      // Handle nasal 'n' or 'm' directly before another consonant smoothly as anusvara in common words
      if (
        (cMatch.roman === 'n' || cMatch.roman === 'm') &&
        lastWasConsonant === false &&
        i > 0
      ) {
        const nextC = matchConsonant(word, i + 1);
        const nextV = matchVowel(word, i + 1);
        if (nextC && !nextV && nextC.roman !== cMatch.roman) {
          out += 'ं';
          lastWasConsonant = false;
          i += 1;
          continue;
        }
      }

      if (lastWasConsonant) {
        out += '्';
      }
      out += cMatch.dev;
      lastWasConsonant = true;
      i += cMatch.roman.length;
      continue;
    }

    // Digits remain standard Arabic by default for practical forms/messages
    out += ch;
    lastWasConsonant = false;
    i += 1;
  }

  return out;
}

export function getTransliterationSuggestions(word: string, lang: 'mr' | 'hi'): string[] {
  const clean = word.trim();
  if (!clean || !/[a-zA-Z]/.test(clean)) return [];

  const primary = transliterateWordRuleBased(clean, lang);
  const candidates = new Set<string>([primary]);

  const override = COMMON_WORD_OVERRIDES[clean.toLowerCase()];
  if (override) {
    candidates.add(override.mr);
    candidates.add(override.hi);
    override.alts?.forEach((a) => candidates.add(a));
  }

  // Useful alternate vowel/nasal variations
  if (primary.endsWith('न') || primary.endsWith('म')) {
    candidates.add(primary.slice(0, -1) + 'ं');
  }
  if (primary.includes('ि')) {
    candidates.add(primary.replace(/ि/g, 'ी'));
  } else if (primary.includes('ी')) {
    candidates.add(primary.replace(/ी/g, 'ि'));
  }
  if (primary.includes('ल')) {
    candidates.add(primary.replace(/ल/g, 'ळ'));
  }
  if (primary.includes('ा') && clean.toLowerCase().endsWith('a')) {
    candidates.add(primary.slice(0, -1));
  }

  return Array.from(candidates).filter(Boolean).slice(0, 4);
}

export function transliterateFullText(text: string, lang: TypingPadLang): string {
  if (lang === 'en') return text;
  return text.replace(/[A-Za-z^~]+/g, (token) => transliterateWordRuleBased(token, lang));
}

export function toDevanagariDigits(text: string): string {
  return text.replace(/[0-9]/g, (d) => DEV_DIGITS[Number(d)] || d);
}
