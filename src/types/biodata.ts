export type AppLanguage =
  | 'mr'
  | 'hi'
  | 'gu'
  | 'bn'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or'
  | 'ur'
  | 'en';

export type BiodataMode = 'marriage' | 'job';

export type TemplateId =
  | 'royal-gold'
  | 'paithani'
  | 'emerald-ivory'
  | 'kumkum-maroon'
  | 'lotus-rose'
  | 'saffron-maratha'
  | 'modern-blue'
  | 'charcoal-exec'
  | 'teal-modern'
  | 'minimalist';

export type PhotoShape = 'circle' | 'square';

export type ReligionType =
  | 'hindu'
  | 'buddhist'
  | 'jain'
  | 'muslim'
  | 'christian'
  | 'sikh'
  | 'parsi'
  | 'secular';

export interface MarriageBiodata {
  religion: ReligionType;
  headerTitle: string;
  photoDataUrl: string;
  photoShape: PhotoShape;
  // वैयक्तिक / Personal
  fullName: string;
  birthDate: string;
  showAge: boolean;
  birthTime: string;
  birthPlace: string;
  height: string;
  bloodGroup: string;
  // धर्मनिहाय माहिती / Religion-Specific Fields
  rashi: string;
  nakshatra: string;
  gotra: string;
  kuldaivat: string;
  nativePlace: string;
  ceremonyType: string;
  sect: string;
  community: string;
  churchParish: string;
  gurudwaraSect: string;
  // शिक्षण व नोकरी / Education & Career
  education: string;
  occupation: string;
  annualIncome: string;
  // कौटुंबिक / Family
  fatherNameOccupation: string;
  motherName: string;
  brothers: string;
  sisters: string;
  mamaNameVillage: string;
  expectations: string;
  // संपर्क / Contact
  address: string;
  mobile: string;
}

export interface JobEducationItem {
  id: string;
  degree: string;
  institute: string;
  year: string;
  score: string;
}

export interface JobExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  details: string;
}

export interface JobBiodata {
  photoDataUrl: string;
  photoShape: PhotoShape;
  fullName: string;
  designation: string;
  mobile: string;
  email: string;
  address: string;
  careerObjective: string;
  educationList: JobEducationItem[];
  experienceList: JobExperienceItem[];
  skills: string;
  languages: string;
}

export interface TemplateConfig {
  id: TemplateId;
  nameMarathi: string;
  nameEnglish: string;
  descriptionMarathi: string;
  descriptionEnglish: string;
  recommendedFor: BiodataMode;
  primaryColor: string;
  secondaryColor: string;
  paperColor: string;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'royal-gold',
    nameMarathi: 'शाही पेशवाई सोनेरी बॉर्डर',
    nameEnglish: 'Royal Gold',
    descriptionMarathi: 'पारंपरिक सोनेरी महिरप व शाही किनार',
    descriptionEnglish: 'Traditional ornate gold border & emblem',
    recommendedFor: 'marriage',
    primaryColor: '#7C2D12',
    secondaryColor: '#C59B27',
    paperColor: '#FFFDF7',
  },
  {
    id: 'paithani',
    nameMarathi: 'पारंपरिक पैठणी नक्षी बॉर्डर',
    nameEnglish: 'Traditional Paithani',
    descriptionMarathi: 'राणी-मोरपंखी पैठणी काठ व जरीच्या नक्षीसह',
    descriptionEnglish: 'Classic Paithani silk border with zari motifs',
    recommendedFor: 'marriage',
    primaryColor: '#8E1A50',
    secondaryColor: '#0F5C53',
    paperColor: '#FFFBF6',
  },
  {
    id: 'emerald-ivory',
    nameMarathi: 'पाचू हिरवी शाही किनार',
    nameEnglish: 'Emerald & Gold',
    descriptionMarathi: 'गडद पाचू हिरवी व सोनेरी कोपऱ्यांची मांडणी',
    descriptionEnglish: 'Deep emerald green frame with antique gold corners',
    recommendedFor: 'marriage',
    primaryColor: '#064E3B',
    secondaryColor: '#C59B27',
    paperColor: '#FAFDF9',
  },
  {
    id: 'kumkum-maroon',
    nameMarathi: 'मंगलाष्टक कुंकू बॉर्डर',
    nameEnglish: 'Royal Kumkum Maroon',
    descriptionMarathi: 'मंगल कुंकू लाल व भगव्या सोनेरी सजावटीसह',
    descriptionEnglish: 'Auspicious maroon frame with golden temple corners',
    recommendedFor: 'marriage',
    primaryColor: '#7F1D1D',
    secondaryColor: '#D97706',
    paperColor: '#FFFDF9',
  },
  {
    id: 'lotus-rose',
    nameMarathi: 'कमळ गुलाबी नक्षी बॉर्डर',
    nameEnglish: 'Blush Lotus Floral',
    descriptionMarathi: 'सौम्य गुलाबी हस्तिदंती व कमळ पाकळी बॉर्डर',
    descriptionEnglish: 'Elegant rosewood & blush ivory floral corners',
    recommendedFor: 'marriage',
    primaryColor: '#9D174D',
    secondaryColor: '#BE185D',
    paperColor: '#FFF9FB',
  },
  {
    id: 'saffron-maratha',
    nameMarathi: 'भगवा मराठा मानचिन्ह',
    nameEnglish: 'Royal Saffron Maratha',
    descriptionMarathi: 'मराठा परंपरेची भगवी व सुवर्ण महिरप किनार',
    descriptionEnglish: 'Heritage saffron top-band & Peshwai arch corners',
    recommendedFor: 'marriage',
    primaryColor: '#9A3412',
    secondaryColor: '#D97706',
    paperColor: '#FFFDF5',
  },
  {
    id: 'modern-blue',
    nameMarathi: 'आधुनिक कॉर्पोरेट निळी बॉर्डर',
    nameEnglish: 'Modern Blue',
    descriptionMarathi: 'नोकरी बायोडाटा व आधुनिक मांडणीसाठी प्रभावी',
    descriptionEnglish: 'Clean corporate navy header ideal for resumes',
    recommendedFor: 'job',
    primaryColor: '#1E3A8A',
    secondaryColor: '#2563EB',
    paperColor: '#FFFFFF',
  },
  {
    id: 'charcoal-exec',
    nameMarathi: 'कार्यकारी स्लेट गडद',
    nameEnglish: 'Executive Charcoal',
    descriptionMarathi: 'प्रभावी गडद स्लेट पट्टीसह व्यावसायिक रेझ्युमे',
    descriptionEnglish: 'Sleek executive charcoal bar for corporate profiles',
    recommendedFor: 'job',
    primaryColor: '#0F172A',
    secondaryColor: '#475569',
    paperColor: '#FFFFFF',
  },
  {
    id: 'teal-modern',
    nameMarathi: 'आधुनिक मोरपंखी कॉर्पोरेट',
    nameEnglish: 'Modern Teal Accent',
    descriptionMarathi: 'ताजेतवाने मोरपंखी शीर्षक व सुस्पष्ट मांडणी',
    descriptionEnglish: 'Contemporary deep teal banner with clean grid',
    recommendedFor: 'job',
    primaryColor: '#0F766E',
    secondaryColor: '#0D9488',
    paperColor: '#FFFFFF',
  },
  {
    id: 'minimalist',
    nameMarathi: 'साधी स्वच्छ पांढरी बॉर्डर',
    nameEnglish: 'Minimalist Classic',
    descriptionMarathi: 'सुटसुटीत, वाचण्यास सोपी व क्लासिक दुहेरी किनार',
    descriptionEnglish: 'Crisp double-hairline border with timeless typography',
    recommendedFor: 'job',
    primaryColor: '#1F2937',
    secondaryColor: '#64748B',
    paperColor: '#FFFFFF',
  },
];

export const MARRIAGE_TITLE_PRESETS = [
  '॥ श्री गणेशाय नमः ॥',
  '॥ नमो बुद्धाय ॥',
  '॥ जय जिनेंद्र ॥',
  'बिस्मिल्लाहिर रहमानिर रहीम',
  'प्रभूची स्तुती असो',
  '॥ ੴ सतनाम श्री वाहेगुरु ॥',
  '॥ अहुर माझदा प्रसन्न ॥',
  'वैयक्तिक परिचय पत्र',
];

export const MARRIAGE_TITLE_PRESETS_EN = [
  'Shree Ganeshay Namah',
  'Namo Buddhaya',
  'Jai Jinendra',
  'In the name of Allah',
  'Praise the Lord',
  'Ik Onkar Satnam Sri Waheguru',
  'In the name of Ahura Mazda',
  'Personal Marriage Biodata',
];

export const DEFAULT_MARRIAGE_DATA: MarriageBiodata = {
  religion: 'hindu',
  headerTitle: '॥ श्री गणेशाय नमः ॥',
  photoDataUrl: '',
  photoShape: 'square',
  fullName: 'चि. आदित्य राजेश कुलकर्णी',
  birthDate: '1997-08-14',
  showAge: true,
  birthTime: 'सकाळी ०७:३५ वाजता',
  birthPlace: 'पुणे',
  height: '५ फूट १० इंच',
  bloodGroup: 'O+',
  rashi: 'धनु',
  nakshatra: 'पूर्वाषाढा',
  gotra: 'काश्यप',
  kuldaivat: 'श्री खंडोबा (जेजुरी)',
  nativePlace: '',
  ceremonyType: '',
  sect: '',
  community: '',
  churchParish: '',
  gurudwaraSect: '',
  education: 'बी.ई. (संगणक अभियांत्रिकी), पुणे विद्यापीठ',
  occupation: 'सॉफ्टवेअर अभियंता (इन्फोसिस लि., हिंजवडी, पुणे)',
  annualIncome: '१४,५०,००० रुपये प्रति वर्ष',
  fatherNameOccupation: 'श्री. राजेश प्रभाकर कुलकर्णी (निवृत्त शासकीय अधिकारी)',
  motherName: 'सौ. सुवर्णा राजेश कुलकर्णी (गृहिणी)',
  brothers: '१ भाऊ (अविवाहित - एम.बी.ए. शिक्षण सुरू)',
  sisters: '१ बहीण (विवाहित - डॉ. प्रियांका जोशी, नाशिक)',
  mamaNameVillage: 'श्री. संजय देशपांडे (सातारा)',
  expectations: 'सुशिक्षित, समजूतदार, कौटुंबिक संस्कार जपणारी आणि करिअरला प्राधान्य देणारी जीवनसाथी.',
  address: 'सदनिका क्र. ३०४, सह्याद्री निवास, कोथरूड, पुणे - ४११०३८',
  mobile: '९८२३० ४५६७८ / ९४२२१ १२३४५',
};

export const DEFAULT_MARRIAGE_DATA_EN: MarriageBiodata = {
  religion: 'hindu',
  headerTitle: 'Shree Ganeshay Namah',
  photoDataUrl: '',
  photoShape: 'square',
  fullName: 'Aditya Rajesh Kulkarni',
  birthDate: '1997-08-14',
  showAge: true,
  birthTime: '07:35 AM',
  birthPlace: 'Pune',
  height: '5 ft 10 in (5\'10")',
  bloodGroup: 'O+',
  rashi: 'Sagittarius',
  nakshatra: 'Purvashadha',
  gotra: 'Kashyap',
  kuldaivat: 'Shree Khandoba (Jejuri)',
  nativePlace: '',
  ceremonyType: '',
  sect: '',
  community: '',
  churchParish: '',
  gurudwaraSect: '',
  education: 'B.E. (Computer Science), Savitribai Phule Pune University',
  occupation: 'Software Engineer (Infosys Ltd., Hinjawadi, Pune)',
  annualIncome: '₹14,50,000 Per Annum',
  fatherNameOccupation: 'Mr. Rajesh Prabhakar Kulkarni (Retd. Govt. Officer)',
  motherName: 'Mrs. Suvarna Rajesh Kulkarni (Homemaker)',
  brothers: '1 Brother (Unmarried - Pursuing MBA)',
  sisters: '1 Sister (Married - Dr. Priyanka Joshi, Nashik)',
  mamaNameVillage: 'Mr. Sanjay Deshpande (Satara)',
  expectations: 'Well-educated, understanding, family-oriented life partner who values mutual respect.',
  address: 'Flat No. 304, Sahyadri Apartment, Kothrud, Pune - 411038',
  mobile: '+91 98230 45678 / +91 94221 12345',
};

export const EMPTY_MARRIAGE_DATA: MarriageBiodata = {
  religion: 'hindu',
  headerTitle: '॥ श्री गणेशाय नमः ॥',
  photoDataUrl: '',
  photoShape: 'square',
  fullName: '',
  birthDate: '',
  showAge: true,
  birthTime: '',
  birthPlace: '',
  height: '',
  bloodGroup: '',
  rashi: '',
  nakshatra: '',
  gotra: '',
  kuldaivat: '',
  nativePlace: '',
  ceremonyType: '',
  sect: '',
  community: '',
  churchParish: '',
  gurudwaraSect: '',
  education: '',
  occupation: '',
  annualIncome: '',
  fatherNameOccupation: '',
  motherName: '',
  brothers: '',
  sisters: '',
  mamaNameVillage: '',
  expectations: '',
  address: '',
  mobile: '',
};

export const DEFAULT_JOB_DATA: JobBiodata = {
  photoDataUrl: '',
  photoShape: 'circle',
  fullName: 'अनिकेत संदीप पाटील',
  designation: 'वरिष्ठ लेखा व वित्त अधिकारी',
  mobile: '+९१ ९८२३५ ६७८९०',
  email: 'अनिकेत.पाटील@उदाहरण.कॉम',
  address: 'सिद्धेश्वर नगर, शिवाजी पेठ, कोल्हापूर - ४१६०१२',
  careerObjective:
    'प्रगतीशील संस्थेमध्ये माझ्या लेखापरीक्षण, जीएसटी अनुपालन आणि आर्थिक विश्लेषणातील ५+ वर्षांच्या अनुभवाचा वापर करून संस्थेच्या आर्थिक कामकाजात अचूकता आणि कार्यक्षमता वाढवणे.',
  educationList: [
    {
      id: 'edu-1',
      degree: 'एम.कॉम. (प्रगत लेखाशास्त्र)',
      institute: 'शिवाजी विद्यापीठ, कोल्हापूर',
      year: '२०१९',
      score: '७४.६०%',
    },
    {
      id: 'edu-2',
      degree: 'बी.कॉम. (वाणिज्य शाखा)',
      institute: 'विवेकानंद महाविद्यालय, कोल्हापूर',
      year: '२०१७',
      score: '७१.२०%',
    },
    {
      id: 'edu-3',
      degree: 'बारावी (वाणिज्य)',
      institute: 'महाराष्ट्र राज्य मंडळ',
      year: '२०१४',
      score: '७८.४०%',
    },
  ],
  experienceList: [
    {
      id: 'exp-1',
      role: 'वरिष्ठ लेखापाल',
      company: 'सह्याद्री कृषी उद्योग प्रा. लि., पुणे',
      duration: 'एप्रिल २०२२ – आजतागायत',
      details:
        'मासिक जीएसटी विवरणपत्रे, टीडीएस कपात व नोंदणी, बँक ताळेबंद आणि वार्षिक लेखापरीक्षण दस्तऐवज हाताळणे.',
    },
    {
      id: 'exp-2',
      role: 'कनिष्ठ लेखा सहाय्यक',
      company: 'देशमुख आणि असोसिएट्स (सनदी लेखापाल संस्था), कोल्हापूर',
      duration: 'जुलै २०१९ – मार्च २०२२',
      details:
        'टॅली प्राईममध्ये दैनंदिन लेजर नोंदी, देयक निर्मिती, ताळेबंद तयारी आणि प्राप्तिकर विवरणपत्र सहाय्य.',
    },
  ],
  skills: 'टॅली प्राईम, जीएसटी व टीडीएस कामकाज, एमएस एक्सेल, आर्थिक अहवाल, सॅप फायनान्स, साठा व्यवस्थापन',
  languages: 'मराठी (मातृभाषा — वाचन, लेखन व संभाषण), हिंदी (उत्कृष्ट), इंग्रजी (व्यावसायिक)',
};

export const DEFAULT_JOB_DATA_EN: JobBiodata = {
  photoDataUrl: '',
  photoShape: 'circle',
  fullName: 'Aniket Sandeep Patil',
  designation: 'Senior Accounts & Finance Executive',
  mobile: '+91 98235 67890',
  email: 'aniket.patil@example.com',
  address: 'Siddheshwar Nagar, Shivaji Peth, Kolhapur - 416012',
  careerObjective:
    'Seeking a Senior Accounts role in a growth-oriented organization to leverage 5+ years of experience in GST compliance, financial reporting, and audit management to drive accuracy and efficiency.',
  educationList: [
    {
      id: 'edu-1',
      degree: 'M.Com. (Advanced Accountancy)',
      institute: 'Shivaji University, Kolhapur',
      year: '2019',
      score: '74.60%',
    },
    {
      id: 'edu-2',
      degree: 'B.Com. (Commerce)',
      institute: 'Vivekanand College, Kolhapur',
      year: '2017',
      score: '71.20%',
    },
    {
      id: 'edu-3',
      degree: 'H.S.C. (12th Commerce)',
      institute: 'Maharashtra State Board',
      year: '2014',
      score: '78.40%',
    },
  ],
  experienceList: [
    {
      id: 'exp-1',
      role: 'Senior Accountant',
      company: 'Sahyadri Agro Industries Pvt. Ltd., Pune',
      duration: 'April 2022 – Present',
      details:
        'Handled monthly GST returns (GSTR-1, GSTR-3B), TDS filings, bank reconciliations, and statutory audit documentation.',
    },
    {
      id: 'exp-2',
      role: 'Junior Accounts Assistant',
      company: 'Deshmukh & Associates (CA Firm), Kolhapur',
      duration: 'July 2019 – March 2022',
      details:
        'Managed daily ledger entries in Tally Prime, invoicing, balance sheet preparation, and client income tax return filings.',
    },
  ],
  skills: 'Tally Prime, GST & TDS Filing, MS Excel (VLOOKUP, Pivot Tables), Financial Reporting, SAP FICO (Basic), Inventory Management',
  languages: 'Marathi (Native), Hindi (Fluent), English (Professional)',
};

export const EMPTY_JOB_DATA: JobBiodata = {
  photoDataUrl: '',
  photoShape: 'circle',
  fullName: '',
  designation: '',
  mobile: '',
  email: '',
  address: '',
  careerObjective: '',
  educationList: [
    {
      id: 'edu-empty-1',
      degree: '',
      institute: '',
      year: '',
      score: '',
    },
  ],
  experienceList: [
    {
      id: 'exp-empty-1',
      role: '',
      company: '',
      duration: '',
      details: '',
    },
  ],
  skills: '',
  languages: '',
};

export interface BiodataSampleBundle {
  marriage: MarriageBiodata;
  job: JobBiodata;
}

export const sampleDataMarathi: BiodataSampleBundle = {
  marriage: DEFAULT_MARRIAGE_DATA,
  job: DEFAULT_JOB_DATA,
};

export const sampleDataEnglish: BiodataSampleBundle = {
  marriage: DEFAULT_MARRIAGE_DATA_EN,
  job: DEFAULT_JOB_DATA_EN,
};
