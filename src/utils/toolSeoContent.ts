import { ToolRoute } from './routes';
import { UiLang } from './siteI18n';

export interface ToolSeoBlock {
  howToTitle: string;
  steps: string[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
}

type ToolSeoMap = Record<ToolRoute, Record<UiLang, ToolSeoBlock>>;

export const TOOL_SEO_CONTENT: ToolSeoMap = {
  '/biodata-maker': {
    en: {
      howToTitle: 'How to Use Marriage Biodata Maker',
      steps: [
        'Choose your preferred biodata template from 110 free and Royal Pro designs above.',
        'Select your religion or community section and enter personal, education, career, and family details.',
        'Upload and crop your portrait photo cleanly inside a square or circular frame.',
        'Verify every line inside the live A4 preview sheet on the right.',
        'Download a free sample PDF or unlock a watermark-free A4 PDF with Pro Pass or Single Download.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Is my marriage biodata data uploaded to any server?',
          a: 'No. All biodata details and photos stay strictly inside your browser storage and are never sent to any external server.',
        },
        {
          q: 'Which details should be included in a marriage biodata?',
          a: 'Include your full name, date and time of birth, birthplace, height, blood group, education, occupation, income, parents and siblings details, maternal uncle details, partner expectations, and contact info.',
        },
        {
          q: 'Can I create my marriage biodata in Marathi, Hindi, or English?',
          a: 'Yes! You can switch the form and preview across 12 Indian languages including English, Marathi, Hindi, Gujarati, and more.',
        },
        {
          q: 'What is the difference between Free and Pro templates?',
          a: 'Free templates let you build and download clean biodatas at zero cost, while Royal and Golden Pro templates include ornate heritage borders and watermark-free HD PDF exports.',
        },
        {
          q: 'Can I edit my biodata later?',
          a: 'Yes, your latest entries are saved automatically in your browser so you can return anytime and update details before downloading a new PDF.',
        },
      ],
    },
    mr: {
      howToTitle: 'लग्न बायोडाटा मेकर कसा वापरावा?',
      steps: [
        'वर दिलेल्या ११० मोफत व रॉयल Pro टेम्प्लेट्समधून आवडीचे डिझाईन निवडा.',
        'धर्म किंवा समाज विभाग निवडून वैयक्तिक, शिक्षण, नोकरी आणि कौटुंबिक माहिती भरा.',
        'तुमचा फोटो अपलोड करून चौकोनी किंवा गोलाकार फ्रेममध्ये व्यवस्थित क्रॉप करा.',
        'उजव्या बाजूच्या लाइव्ह A4 प्रिव्ह्यूमध्ये सर्व माहिती अचूक असल्याची खात्री करा.',
        'मोफत नमुना PDF किंवा Pro पास / सिंगल डाउनलोडद्वारे वॉटरमार्कशिवाय A4 PDF सेव्ह करा.',
      ],
      faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
      faqs: [
        {
          q: 'माझा बायोडाटा आणि फोटो सर्व्हरवर सेव्ह होतो का?',
          a: 'नाही. तुमची सर्व माहिती व फोटो केवळ तुमच्याच ब्राउझरमध्ये राहतात आणि कोणत्याही सर्व्हरवर अपलोड केले जात नाहीत.',
        },
        {
          q: 'लग्नाच्या बायोडाटामध्ये कोणती माहिती असावी?',
          a: 'संपूर्ण नाव, जन्मतारीख, जन्मवेळ, जन्मठिकाण, उंची, रक्तगट, शिक्षण, नोकरी व उत्पन्न, आई-वडील व भावंडांची माहिती, मामाचे नाव व गाव, अपेक्षा आणि संपर्क क्रमांक असावा.',
        },
        {
          q: 'मराठी, हिंदी आणि इंग्रजी भाषेत बायोडाटा बनवता येतो का?',
          a: 'होय! तुम्ही एका क्लिकवर १२ भारतीय भाषांमध्ये फॉर्म आणि बायोडाटा तयार करू शकता.',
        },
        {
          q: 'मोफत आणि Pro टेम्प्लेट्समध्ये काय फरक आहे?',
          a: 'मोफत टेम्प्लेट्सवर तुम्ही साधा बायोडाटा बनवू शकता, तर रॉयल व गोल्डन Pro टेम्प्लेट्समध्ये आकर्षक शाही बॉर्डर आणि वॉटरमार्कशिवाय PDF मिळते.',
        },
        {
          q: 'भरलेली माहिती नंतर बदलता येते का?',
          a: 'होय, तुमचा डेटा तुमच्या ब्राउझरमध्ये सेव्ह राहतो, त्यामुळे तुम्ही कधीही परत येऊन बदल करू शकता.',
        },
      ],
    },
    hi: {
      howToTitle: 'मैरिज बायोडाटा मेकर का उपयोग कैसे करें?',
      steps: [
        'ऊपर दिए गए ११० मुफ्त और रॉयल Pro टेम्प्लेट्स में से अपनी पसंद का डिज़ाइन चुनें।',
        'अपना धर्म या समुदाय अनुभाग चुनें और व्यक्तिगत, शिक्षा, नौकरी व परिवार की जानकारी भरें।',
        'अपनी फोटो अपलोड करें और चौकोर या गोल फ्रेम में सही से क्रॉप करें।',
        'दाईं ओर लाइव A4 प्रिव्यू में सभी विवरणों की जांच करें।',
        'मुफ्त सैंपल PDF या Pro पास / सिंगल डाउनलोड से बिना वॉटरमार्क A4 PDF डाउनलोड करें।',
      ],
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqs: [
        {
          q: 'क्या मेरा बायोडाटा डेटा किसी सर्वर पर अपलोड होता है?',
          a: 'नहीं। आपकी सभी जानकारी और फोटो केवल आपके ब्राउज़र में सुरक्षित रहती है और किसी बाहरी सर्वर पर नहीं भेजी जाती।',
        },
        {
          q: 'शादी के बायोडाटा में कौन-सी जानकारी होनी चाहिए?',
          a: 'पूरा नाम, जन्मतिथि, जन्म समय, जन्म स्थान, लंबाई, ब्लड ग्रुप, शिक्षा, नौकरी और आय, माता-पिता व भाई-बहनों का विवरण, मामा का नाम व शहर, और संपर्क नंबर शामिल होना चाहिए।',
        },
        {
          q: 'क्या मैं हिंदी, मराठी या अंग्रेजी में बायोडाटा बना सकता हूं?',
          a: 'जी हां! आप १२ भारतीय भाषाओं में आसानी से बायोडाटा तैयार कर सकते हैं।',
        },
        {
          q: 'मुफ्त और Pro टेम्प्लेट्स में क्या अंतर है?',
          a: 'मुफ्त टेम्प्लेट्स में सरल डिज़ाइन मिलते हैं, जबकि रॉयल व गोल्डन Pro टेम्प्लेट्स में शाही बॉर्डर और बिना वॉटरमार्क PDF एक्सपोर्ट मिलता है।',
        },
        {
          q: 'क्या मैं बाद में बायोडाटा में बदलाव कर सकता हूं?',
          a: 'हां, आपकी भरी हुई जानकारी आपके ब्राउज़र में सेव रहती है, जिसे आप कभी भी अपडेट कर सकते हैं।',
        },
      ],
    },
  },
  '/resume-maker': {
    en: {
      howToTitle: 'How to Use Resume Maker',
      steps: [
        'Pick a corporate free or Pro executive layout from the template gallery.',
        'Fill in your full name, target job title, phone, email, and career objective.',
        'Add your educational qualifications and work experience entries in chronological order.',
        'List your key technical skills and languages known.',
        'Review the live A4 sheet and export a crisp printable PDF immediately.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Does Resume Maker export a standard A4 PDF?',
          a: 'Yes, your resume is formatted strictly to standard A4 dimensions (210 × 297 mm) ready for email applications and printing.',
        },
        {
          q: 'Can freshers without work experience use this tool?',
          a: 'Yes! You can leave or remove experience rows and highlight your academic scores, skills, and career objective.',
        },
        {
          q: 'Should I include a photo on my resume?',
          a: 'Photo upload is optional. If required for your job role, upload and crop a formal passport photo cleanly.',
        },
        {
          q: 'Are my resume details stored privately?',
          a: 'Yes, everything runs 100% locally in your browser without sending your personal contact details to any server.',
        },
        {
          q: 'How do I unlock premium executive templates without a watermark?',
          a: 'Use either a ₹19 Single Download or the ₹49 All-Tools Pro Pass to unlock all templates without watermarks.',
        },
      ],
    },
    mr: {
      howToTitle: 'रेझ्युमे मेकर कसा वापरावा?',
      steps: [
        'वर दिलेल्या मोफत किंवा Pro कॉर्पोरेट टेम्प्लेट्समधून व्यावसायिक डिझाईन निवडा.',
        'तुमचे नाव, पदनाम, मोबाईल, ईमेल आणि करिअर उद्दिष्ट (Career Objective) भरा.',
        'तुमची शैक्षणिक पात्रता आणि कामाचा अनुभव क्रमवार जोडा.',
        'तुमची प्रमुख कौशल्ये (Skills) आणि अवगत असलेल्या भाषा लिहा.',
        'लाइव्ह A4 प्रिव्ह्यू तपासून त्वरित प्रिंट-रेडी PDF डाउनलोड करा.',
      ],
      faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
      faqs: [
        {
          q: 'रेझ्युमे मानक A4 आकारात डाउनलोड होतो का?',
          a: 'होय, तुमचा रेझ्युमे थेट A4 आकारात (२१० × २९७ मिमी) तयार होतो, जो नोकरी अर्ज व प्रिंटिंगसाठी योग्य असतो.',
        },
        {
          q: 'नवीन उमेदवार (Freshers) हा रेझ्युमे वापरू शकतात का?',
          a: 'होय! अनुभव नसल्यास तुम्ही अनुभव विभाग रिकामा ठेवू शकता आणि शिक्षण व कौशल्यांवर भर देऊ शकता.',
        },
        {
          q: 'रेझ्युमेवर फोटो लावणे आवश्यक आहे का?',
          a: 'फोटो लावणे ऐच्छिक आहे. आवश्यक असल्यास तुम्ही औपचारिक पासपोर्ट फोटो अपलोड व क्रॉप करू शकता.',
        },
        {
          q: 'माझी वैयक्तिक माहिती सुरक्षित राहते का?',
          a: 'होय, सर्व माहिती तुमच्याच ब्राउझरमध्ये राहते व कोणत्याही सर्व्हरवर पाठवली जात नाही.',
        },
        {
          q: 'वॉटरमार्कशिवाय प्रीमियम रेझ्युमे कसा मिळवावा?',
          a: 'फक्त ₹19 सिंगल डाउनलोड किंवा ₹49 All-Tools Pro Pass वापरून सर्व प्रीमियम टेम्प्लेट्स अनलॉक करा.',
        },
      ],
    },
    hi: {
      howToTitle: 'रिज्यूमे मेकर का उपयोग कैसे करें?',
      steps: [
        'टेम्प्लेट गैलरी से अपनी पसंद का मुफ्त या Pro कॉर्पोरेट डिज़ाइन चुनें।',
        'अपना पूरा नाम, पदनाम, मोबाइल नंबर, ईमेल और करियर उद्देश्य भरें।',
        'अपनी शैक्षणिक योग्यता और कार्य अनुभव का विवरण क्रम से जोड़ें।',
        'अपने मुख्य कौशल (Skills) और भाषाओं की जानकारी दर्ज करें।',
        'लाइव A4 प्रिव्यू जांचें और तुरंत प्रिंट-रेडी PDF डाउनलोड करें।',
      ],
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqs: [
        {
          q: 'क्या रिज्यूमे स्टैंडर्ड A4 साइज में डाउनलोड होता है?',
          a: 'हां, यह टूल मानक A4 आकार (२१० × २९७ मिमी) में साफ PDF तैयार करता है।',
        },
        {
          q: 'क्या फ्रेशर्स (बिना अनुभव वाले) यह रिज्यूमे बना सकते हैं?',
          a: 'जी हां! आप अनुभव अनुभाग को हटाकर अपनी शिक्षा, प्रतिशत और कौशल को प्रमुखता से दिखा सकते हैं।',
        },
        {
          q: 'क्या रिज्यूमे में फोटो लगाना जरूरी है?',
          a: 'फोटो लगाना वैकल्पिक है। यदि जरूरी हो तो आप पासपोर्ट फोटो अपलोड और क्रॉप कर सकते हैं।',
        },
        {
          q: 'क्या मेरा रिज्यूमे डेटा सुरक्षित रहता है?',
          a: 'हां, सभी विवरण १००% आपके ब्राउज़र में रहते हैं और किसी सर्वर पर अपलोड नहीं होते।',
        },
        {
          q: 'बिना वॉटरमार्क प्रीमियम रिज्यूमे कैसे डाउनलोड करें?',
          a: 'आप ₹19 सिंगल डाउनलोड या ₹49 All-Tools Pro Pass से सभी प्रीमियम टेम्प्लेट्स अनलॉक कर सकते हैं।',
        },
      ],
    },
  },
  '/background-remover': {
    en: {
      howToTitle: 'How to Use Background Remover',
      steps: [
        'Upload or drag and drop any JPG, PNG, or WEBP photo from your device.',
        'Click "Remove Background" and watch the local browser AI model process your photo.',
        'Once finished, select Transparent, White, or Blue as your output background color.',
        'Preview the clean cutout side-by-side with your original image.',
        'Click "Download PNG" or click the shortcut below to use the photo directly in your Biodata or Resume.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Are my photos sent to a cloud server for background removal?',
          a: 'No. The AI segmentation model runs directly inside your web browser so your photos never leave your device.',
        },
        {
          q: 'Why does the first run take a few extra seconds?',
          a: 'On your first use, your browser downloads and caches the AI weights locally. Subsequent photos process much faster.',
        },
        {
          q: 'Can I make a White or Blue background passport photo?',
          a: 'Yes! After removing the background, simply select White or Blue and download the crisp PNG.',
        },
        {
          q: 'What does Pro unlock in Background Remover?',
          a: 'Pro Pass unlocks high-precision HD model processing and multi-photo batch background removal at once.',
        },
        {
          q: 'Can I use the edited photo directly in my Marriage Biodata?',
          a: 'Yes! After removing the background, click the Biodata or Resume link right below the download button to apply it automatically.',
        },
      ],
    },
    mr: {
      howToTitle: 'बॅकग्राउंड रिमूव्हर कसा वापरावा?',
      steps: [
        'तुमच्या डिव्हाइसवरून कोणताही JPG, PNG किंवा WEBP फोटो अपलोड करा.',
        '"बॅकग्राउंड काढा" बटणावर क्लिक करा आणि प्रोग्रेस बार पूर्ण होईपर्यंत प्रतीक्षा करा.',
        'बॅकग्राउंड निघाल्यावर Transparent, पांढरा किंवा निळा रंग निवडा.',
        'मूळ फोटो आणि तयार फोटो यांची समोरासमोर तुलना करून तपासा.',
        '"PNG डाउनलोड करा" वर क्लिक करा किंवा खालील लिंकने थेट बायोडाटा / रेझ्युमेमध्ये वापरा.',
      ],
      faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
      faqs: [
        {
          q: 'माझा फोटो बॅकग्राउंड काढण्यासाठी सर्व्हरवर अपलोड होतो का?',
          a: 'नाही. AI मॉडेल थेट तुमच्या ब्राउझरमध्ये चालते, त्यामुळे तुमचा फोटो तुमच्या डिव्हाइसबाहेर जात नाही.',
        },
        {
          q: 'पहिल्या वेळी प्रक्रिया थोडी वेळ का घेते?',
          a: 'पहिल्या वापरावेळी ब्राउझरमध्ये AI मॉडेल एकदाच लोड होते; त्यानंतरचे सर्व फोटो खूप वेगाने तयार होतात.',
        },
        {
          q: 'पासपोर्ट फोटोसाठी पांढरे किंवा निळे बॅकग्राउंड लावता येते का?',
          a: 'होय! बॅकग्राउंड काढल्यानंतर पांढरा किंवा निळा रंग निवडून हाय-क्वालिटी PNG डाउनलोड करता येतो.',
        },
        {
          q: 'Pro पासमध्ये कोणते अतिरिक्त फायदे मिळतात?',
          a: 'Pro पासमुळे HD क्वालिटी मॉडेल आणि एकाच वेळी अनेक फोटोंचे बॅकग्राउंड काढण्याची (Batch) सुविधा मिळते.',
        },
        {
          q: 'तयार फोटो थेट लग्नाच्या बायोडाटात वापरता येतो का?',
          a: 'होय! डाउनलोड बटणाखालील लिंकवर क्लिक करताच हा फोटो थेट बायोडाटा किंवा रेझ्युमे मेकरमध्ये सेट होतो.',
        },
      ],
    },
    hi: {
      howToTitle: 'बैकग्राउंड रिमूवर का उपयोग कैसे करें?',
      steps: [
        'अपने डिवाइस से कोई भी JPG, PNG या WEBP फोटो अपलोड करें।',
        '"बैकग्राउंड हटाएं" पर क्लिक करें और ब्राउज़र में AI प्रोसेसिंग पूरी होने दें।',
        'बैकग्राउंड हटने के बाद Transparent, सफेद या नीला बैकग्राउंड रंग चुनें।',
        'मूल और तैयार फोटो का लाइव प्रिव्यू जांचें।',
        '"PNG डाउनलोड करें" पर क्लिक करें या नीचे दिए लिंक से सीधे बायोडाटा/रिज्यूमे में उपयोग करें।',
      ],
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqs: [
        {
          q: 'क्या मेरा फोटो किसी सर्वर पर अपलोड होता है?',
          a: 'नहीं। AI मॉडल सीधे आपके ब्राउज़र के भीतर चलता है, इसलिए आपका फोटो आपके डिवाइस से बाहर नहीं जाता।',
        },
        {
          q: 'पहली बार में कुछ सेकंड अधिक क्यों लगते हैं?',
          a: 'पहली बार उपयोग करने पर ब्राउज़र AI मॉडल को लोकल कैश में लोड करता है; इसके बाद के फोटो काफी तेज प्रोसेस होते हैं।',
        },
        {
          q: 'क्या पासपोर्ट फोटो के लिए सफेद या नीला बैकग्राउंड मिल सकता है?',
          a: 'हां! बैकग्राउंड हटाने के बाद सफेद या नीला रंग चुनकर तुरंत PNG डाउनलोड करें।',
        },
        {
          q: 'Pro पास में क्या अतिरिक्त सुविधाएं मिलती हैं?',
          a: 'Pro पास से HD मॉडल और एक साथ कई फोटो प्रोसेस करने (Batch) की सुविधा अनलॉक होती है।',
        },
        {
          q: 'क्या मैं इस फोटो को सीधे शादी के बायोडाटा में लगा सकता हूं?',
          a: 'हां! डाउनलोड बटन के नीचे दिए लिंक पर क्लिक करके आप सीधे बायोडाटा या रिज्यूमे में फोटो लगा सकते हैं।',
        },
      ],
    },
  },
  '/pdf-tools': {
    en: {
      howToTitle: 'How to Use PDF Tools',
      steps: [
        'Select one of the three tabs: Merge PDF, Split PDF, or Images to PDF.',
        'For Merge PDF, upload 2 or more PDFs, arrange their order with arrow buttons, and click Merge.',
        'For Split PDF, upload a PDF and enter page ranges like 1-3, 5 to extract only those pages.',
        'For Images to PDF, select JPG, PNG, or WEBP photos, choose A4 or Original size, and convert.',
        'Your generated PDF downloads directly in seconds with zero server uploads.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Is there any limit on file privacy when merging or splitting PDFs?',
          a: 'All PDF processing runs locally using pdf-lib inside your browser. Confidential marksheets, IDs, and documents stay private.',
        },
        {
          q: 'Can I reorder pages or files before merging PDFs?',
          a: 'Yes, use the Up and Down arrow buttons beside each uploaded file or photo to control the exact sequence.',
        },
        {
          q: 'How do I format page ranges in Split PDF?',
          a: 'Enter comma-separated page numbers or ranges such as "1-3, 5, 8-10" based on the total page count shown.',
        },
        {
          q: 'Which image formats work in Images to PDF?',
          a: 'JPG, JPEG, PNG, and WEBP images are all supported and can be scaled automatically to A4 pages.',
        },
        {
          q: 'Does Merge PDF work with password-protected files?',
          a: 'Unprotected PDFs merge seamlessly. If a file is strictly encrypted with an owner/user password, unlock it before merging.',
        },
      ],
    },
    mr: {
      howToTitle: 'PDF टूल्स कसे वापरावे?',
      steps: [
        'वरून Merge PDF, Split PDF किंवा फोटोंची PDF यापैकी हवा असलेला पर्याय निवडा.',
        'Merge PDF साठी २ किंवा अधिक PDF जोडून बाणांनी त्यांचा क्रम ठरवा.',
        'Split PDF साठी PDF निवडा आणि हवे असलेले पान क्रमांक (उदा. 1-3, 5) टाका.',
        'फोटोंची PDF साठी JPG, PNG किंवा WEBP फोटो निवडून A4 आकार निवडा.',
        'तयार झालेली PDF थेट तुमच्या डिव्हाइसवर डाउनलोड होते.',
      ],
      faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
      faqs: [
        {
          q: 'माझी PDF कागदपत्रे सर्व्हरवर अपलोड होतात का?',
          a: 'नाही. सर्व PDF प्रक्रिया थेट तुमच्या ब्राउझरमध्ये होते, त्यामुळे आधार, मार्कशीट व वैयक्तिक कागदपत्रे सुरक्षित राहतात.',
        },
        {
          q: 'PDF एकत्र करण्यापूर्वी त्यांचा क्रम बदलता येतो का?',
          a: 'होय, प्रत्येक फाईलजवळील वर व खाली बाणांच्या बटणाने तुम्ही योग्य क्रम लावू शकता.',
        },
        {
          q: 'Split PDF मध्ये पान क्रमांक कसे लिहावेत?',
          a: 'स्वल्पविराम आणि डॅश वापरून पान रेंज लिहा, उदाहरणार्थ "1-3, 5, 8-10".',
        },
        {
          q: 'फोटोंची PDF करताना कोणते फोटो चालतात?',
          a: 'JPG, JPEG, PNG आणि WEBP हे सर्व फोटो चालतात व ते आपोआप A4 पानावर बसतात.',
        },
        {
          q: 'पासवर्ड-लॉक्ड PDF एकत्र करता येते का?',
          a: 'साध्या PDF सहज एकत्र होतात; जर फाईलला कडक पासवर्ड असेल तर आधी पासवर्ड काढून अपलोड करा.',
        },
      ],
    },
    hi: {
      howToTitle: 'PDF टूल्स का उपयोग कैसे करें?',
      steps: [
        'ऊपर दिए गए Merge PDF, Split PDF या फोटो से PDF में से अपनी जरूरत का टैब चुनें।',
        'Merge PDF के लिए २ या अधिक PDF अपलोड करें और ऊपर-नीचे के बटन से क्रम तय करें।',
        'Split PDF के लिए PDF चुनें और मनचाहे पेज नंबर (जैसे 1-3, 5) दर्ज करें।',
        'फोटो से PDF के लिए JPG, PNG या WEBP इमेज चुनें और A4 साइज सेलेक्ट करें।',
        'तैयार PDF बिना किसी सर्वर अपलोड के तुरंत डाउनलोड हो जाती है।',
      ],
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqs: [
        {
          q: 'क्या मेरी PDF फाइलें किसी सर्वर पर भेजी जाती हैं?',
          a: 'नहीं। सभी PDF काम सीधे आपके ब्राउज़र के भीतर होते हैं, जिससे आपके महत्वपूर्ण दस्तावेज पूरी तरह सुरक्षित रहते हैं।',
        },
        {
          q: 'क्या मर्ज करने से पहले फाइलों का क्रम बदला जा सकता है?',
          a: 'हां, प्रत्येक फाइल के पास दिए गए ऊपर/नीचे तीर बटन से आप आसानी से क्रम बदल सकते हैं।',
        },
        {
          q: 'Split PDF में पेज रेंज कैसे लिखें?',
          a: 'आप कॉमा और डैश का उपयोग करके पेज लिख सकते हैं, जैसे "1-3, 5, 8-10"।',
        },
        {
          q: 'फोटो से PDF में कौन-से इमेज फॉर्मेट चलते हैं?',
          a: 'JPG, JPEG, PNG और WEBP सभी इमेज फॉर्मेट सपोर्ट किए जाते हैं।',
        },
        {
          q: 'क्या पासवर्ड वाली PDF मर्ज की जा सकती है?',
          a: 'सामान्य PDF आसानी से मर्ज हो जाती हैं; पासवर्ड से लॉक फाइलों को पहले अनलॉक करके अपलोड करें।',
        },
      ],
    },
  },
  '/image-compressor': {
    en: {
      howToTitle: 'How to Use Image Compressor',
      steps: [
        'Upload your photo, scanned document, or signature in JPG, PNG, or WEBP format.',
        'Pick a preset size (20 KB, 50 KB, 100 KB, 200 KB) or type any custom KB limit.',
        'Select your preferred output format (JPG is recommended for MPSC, UPSC, and government portals).',
        'Click "Compress" to optimize the image accurately below your target KB size.',
        'Download the compressed file or send it straight into Biodata / Resume Maker.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Can I compress photos to exact 20KB or 50KB for MPSC and UPSC forms?',
          a: 'Yes! Our precision binary-search compressor ensures the output file stays strictly under your selected KB limit while preserving clarity.',
        },
        {
          q: 'Why does a tiny KB target switch PNG to JPEG?',
          a: 'Lossless PNG cannot fit large photos under 20KB-50KB, so JPEG is used automatically when required to meet strict portal KB limits.',
        },
        {
          q: 'Can I compress multiple images together?',
          a: 'Free users can compress images 1-by-1, while All-Tools Pro Pass unlocks batch compression for multiple photos at once.',
        },
        {
          q: 'Are my documents and signatures uploaded anywhere?',
          a: 'No. Everything is compressed locally using HTML5 Canvas inside your browser.',
        },
        {
          q: 'Can I compress my photo and use it in my Biodata right away?',
          a: 'Yes, click the cross-promotion button below the Download button to apply the compressed image directly.',
        },
      ],
    },
    mr: {
      howToTitle: 'इमेज कॉम्प्रेसर कसा वापरावा?',
      steps: [
        'JPG, PNG किंवा WEBP स्वरूपातील फोटो, कागदपत्र किंवा सही (Signature) अपलोड करा.',
        '20 KB, 50 KB, 100 KB, 200 KB पैकी बटण निवडा किंवा स्वतः हवी ती KB संख्या टाका.',
        'आउटपुट फॉरमॅट निवडा (MPSC/UPSC फॉर्मसाठी JPG फॉरमॅट सर्वोत्तम ठरतो).',
        '"कॉम्प्रेस करा" वर क्लिक करून काही सेकंदांत फोटो लक्ष्यित KB मध्ये तयार करा.',
        'तयार फोटो डाउनलोड करा किंवा थेट बायोडाटा / रेझ्युमेमध्ये वापरा.',
      ],
      faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
      faqs: [
        {
          q: 'MPSC आणि UPSC फॉर्मसाठी फोटो अचूक 20KB किंवा 50KB मध्ये होतो का?',
          a: 'होय! आमचे प्रिसिजन कॉम्प्रेशन तंत्रज्ञान फोटोची स्पष्टता टिकवून साईज अचूक निवडलेल्या KB मर्यादेत आणते.',
        },
        {
          q: 'लहान KB साईज निवडल्यास PNG चे रूपांतर JPG मध्ये का होते?',
          a: '20KB-50KB सारख्या लहान मर्यादेत PNG फाईल बसत नाही, त्यामुळे सरकारी पोर्टलसाठी अचूक साईज मिळवण्याकरिता JPG वापरले जाते.',
        },
        {
          q: 'एकाच वेळी अनेक फोटो कॉम्प्रेस करता येतात का?',
          a: 'मोफत प्लॅनमध्ये १-१ फोटो कॉम्प्रेस करता येतो, तर Pro पासमध्ये एकाच वेळी अनेक फोटो (Batch) कॉम्प्रेस करण्याची सुविधा मिळते.',
        },
        {
          q: 'माझे फोटो आणि सही सुरक्षित राहतात का?',
          a: 'होय, संपूर्ण प्रक्रिया तुमच्याच ब्राउझरमध्ये होते; कोणताही फोटो सर्व्हरवर जात नाही.',
        },
        {
          q: 'कॉम्प्रेस केलेला फोटो बायोडाटामध्ये वापरता येतो का?',
          a: 'होय, डाउनलोड बटणाखालील लिंकवरून तुम्ही हा फोटो थेट बायोडाटा किंवा रेझ्युमेमध्ये जोडू शकता.',
        },
      ],
    },
    hi: {
      howToTitle: 'इमेज कंप्रेसर का उपयोग कैसे करें?',
      steps: [
        'अपना फोटो, दस्तावेज या सिग्नेचर JPG, PNG या WEBP फॉर्मेट में अपलोड करें।',
        '20 KB, 50 KB, 100 KB, 200 KB चुनें या अपनी जरूरत के अनुसार कस्टम KB साइज लिखें।',
        'आउटपुट फॉर्मेट चुनें (MPSC/UPSC और सरकारी फॉर्म के लिए JPG सबसे बेहतर है)।',
        '"कंप्रेस करें" बटन पर क्लिक करें और लक्ष्य KB के अनुसार फोटो तैयार करें।',
        'तैयार फोटो डाउनलोड करें या सीधे बायोडाटा/रिज्यूमे मेकर में उपयोग करें।',
      ],
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqs: [
        {
          q: 'क्या MPSC/UPSC फॉर्म के लिए फोटो सटीक 20KB या 50KB में बन जाता है?',
          a: 'हां! हमारा टूल स्पष्टता बनाए रखते हुए फोटो की साइज को तय KB सीमा के भीतर रखता है।',
        },
        {
          q: 'कम KB चुनने पर PNG से JPEG में बदलाव क्यों होता है?',
          a: '20KB-50KB जैसी छोटी सीमा में PNG फिट नहीं हो पाता, इसलिए सही साइज पाने के लिए JPEG फॉर्मेट का उपयोग किया जाता है।',
        },
        {
          q: 'क्या एक साथ कई फोटो कंप्रेस कर सकते हैं?',
          a: 'मुफ्त प्लान में एक-एक फोटो कंप्रेस होता है, जबकि Pro पास में एक साथ कई फोटो (Batch) प्रोसेस किए जा सकते हैं।',
        },
        {
          q: 'क्या मेरे फोटो व हस्ताक्षर सुरक्षित रहते हैं?',
          a: 'हां, पूरी प्रक्रिया आपके ब्राउज़र के भीतर होती है और कोई फाइल सर्वर पर नहीं जाती।',
        },
        {
          q: 'क्या मैं कंप्रेस किए फोटो को सीधे बायोडाटा में लगा सकता हूं?',
          a: 'हां, डाउनलोड बटन के नीचे दी गई लिंक पर क्लिक करके आप इसे तुरंत बायोडाटा या रिज्यूमे में जोड़ सकते हैं।',
        },
      ],
    },
  },
  '/qr-generator': {
    en: {
      howToTitle: 'How to Use QR Code Generator',
      steps: [
        'Choose your QR Code type: Website Link, Plain Text, WhatsApp Number, or UPI Payment.',
        'Fill in your URL, message, phone number, or UPI ID and payee details.',
        'Pick your preferred QR Code color and output PNG resolution (512px or 1024px).',
        'Verify your live QR Code preview instantly on the right side.',
        'Click "Download QR Code PNG" to save the crisp high-resolution image.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Do SadhanBox QR Codes expire over time?',
          a: 'No! All generated QR Codes are static and work permanently without any scan limits or expiry.',
        },
        {
          q: 'Can I create a UPI payment QR Code for my shop or business?',
          a: 'Yes! Switch to the UPI tab, enter your UPI ID and shop name (plus optional fixed amount), and download the PNG for printing.',
        },
        {
          q: 'How does the WhatsApp QR Code work?',
          a: 'When anyone scans it with their phone camera, it opens WhatsApp chat directly with your number and pre-filled message.',
        },
        {
          q: 'Which resolution should I download for printing?',
          a: 'Select 1024×1024 px for posters, visiting cards, or shop counter stands.',
        },
        {
          q: 'Is my UPI ID or phone number saved on any server?',
          a: 'No. Your QR Code is generated completely inside your browser and never stored externally.',
        },
      ],
    },
    mr: {
      howToTitle: 'QR Code जनरेटर कसा वापरावा?',
      steps: [
        'वरच्या टॅबमधून वेबसाइट लिंक, मजकूर, WhatsApp नंबर किंवा UPI पेमेंट निवडा.',
        'संबंधित लिंक, नंबर, मेसेज किंवा UPI आयडी अचूक भरा.',
        'QR Code साठी आवडता रंग आणि 512px किंवा 1024px गुणवत्ता निवडा.',
        'उजव्या बाजूला तयार झालेला लाइव्ह QR Code तपासा.',
        '"QR Code PNG डाउनलोड करा" बटणावर क्लिक करून फाईल सेव्ह करा.',
      ],
      faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
      faqs: [
        {
          q: 'येथे तयार केलेले QR Code नंतर बंद (Expire) होतात का?',
          a: 'नाही! हे स्टॅटिक QR Code कायमस्वरूपी मोफत काम करतात आणि स्कॅनची कोणतीही मर्यादा नसते.',
        },
        {
          q: 'दुकानासाठी UPI पेमेंट QR Code बनवता येतो का?',
          a: 'होय! UPI टॅबमध्ये तुमचा UPI आयडी आणि नाव टाकून प्रिंट-रेडी PNG त्वरित डाउनलोड करा.',
        },
        {
          q: 'WhatsApp QR Code कसा काम करतो?',
          a: 'हा QR Code स्कॅन करताच समोरच्या व्यक्तीच्या फोनवर थेट तुमच्या नंबरची WhatsApp चॅट प्री-फिल्ड मेसेजसह उघडते.',
        },
        {
          q: 'प्रिंटिंगसाठी कोणती PNG गुणवत्ता निवडावी?',
          a: 'व्हिजिटिंग कार्ड, बॅनर किंवा दुकानाच्या काऊंटरवर लावण्यासाठी 1024×1024 px निवडा.',
        },
        {
          q: 'माझा UPI आयडी किंवा नंबर कुठे सेव्ह होतो का?',
          a: 'नाही. संपूर्ण QR Code निर्मिती थेट तुमच्या ब्राउझरमध्ये होते.',
        },
      ],
    },
    hi: {
      howToTitle: 'QR Code जनरेटर का उपयोग कैसे करें?',
      steps: [
        'ऊपर दिए टैब में से वेबसाइट लिंक, टेक्स्ट, WhatsApp नंबर या UPI पेमेंट चुनें।',
        'अपना लिंक, संदेश, फोन नंबर या UPI आईडी सही से भरें।',
        'QR Code का रंग और PNG क्वालिटी (512px या 1024px) चुनें।',
        'दाईं ओर तुरंत लाइव QR Code प्रिव्यू जांचें।',
        '"QR Code PNG डाउनलोड करें" बटन दबाकर इमेज सेव करें।',
      ],
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqs: [
        {
          q: 'क्या यहाँ बनाए गए QR Code कभी एक्सपायर होते हैं?',
          a: 'नहीं! ये स्टैटिक QR Code हैं जो बिना किसी स्कैन सीमा के हमेशा काम करते हैं।',
        },
        {
          q: 'क्या मैं अपनी दुकान के लिए UPI पेमेंट QR Code बना सकता हूं?',
          a: 'हां! UPI टैब में अपनी UPI आईडी और नाम दर्ज करके तुरंत प्रिंट-रेडी PNG डाउनलोड करें।',
        },
        {
          q: 'WhatsApp QR Code कैसे काम करता है?',
          a: 'इसे स्कैन करने पर ग्राहक के फोन में सीधे आपके नंबर की WhatsApp चैट पहले से लिखे संदेश के साथ खुलती है।',
        },
        {
          q: 'प्रिंटिंग के लिए कौन-सा रिजॉल्यूशन चुनें?',
          a: 'पोस्टर, विजिटिंग कार्ड या काउंटर स्टैंड के लिए 1024×1024 px चुनें।',
        },
        {
          q: 'क्या मेरी UPI आईडी या नंबर किसी सर्वर पर सेव होता है?',
          a: 'नहीं। QR Code सीधे आपके ब्राउज़र में बनता है और कहीं स्टोर नहीं होता।',
        },
      ],
    },
  },
  '/age-calculator': {
    en: {
      howToTitle: 'How to Use Age Calculator',
      steps: [
        'Select your Date of Birth using the calendar date picker.',
        'Keep the target date as Today, or select any past or future reference date (useful for exam eligibility).',
        'View your exact age broken down into Years, Months, and Days immediately.',
        'Check total months, weeks, days, and hours lived in the summary table.',
        'See how many days remain until your next birthday and which weekday it falls on.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Does Age Calculator account for leap years and varying month lengths?',
          a: 'Yes! It computes exact calendar differences accounting for 28/29-day Februaries and 30/31-day months.',
        },
        {
          q: 'Can I calculate my age for MPSC, UPSC, or bank exam cutoff dates?',
          a: 'Yes! Change the "Calculate Age on Date" field to the exam notification cutoff date to check exact eligibility.',
        },
        {
          q: 'What if someone was born on February 29?',
          a: 'The calculator handles February 29 birthdates accurately across leap and non-leap years.',
        },
        {
          q: 'Does it show the weekday of my birth?',
          a: 'Yes, it automatically displays the exact day of the week you were born on as well as your upcoming birthday weekday.',
        },
        {
          q: 'Is my date of birth saved or tracked anywhere?',
          a: 'No. All calculations happen instantaneously in your browser memory only.',
        },
      ],
    },
    mr: {
      howToTitle: 'वय कॅल्क्युलेटर कसा वापरावा?',
      steps: [
        'कॅलेंडरमधून तुमची अचूक जन्मतारीख निवडा.',
        'संदर्भ तारीख आजची ठेवा किंवा सरकारी परीक्षेच्या निकषाप्रमाणे कोणतीही तारीख निवडा.',
        'तुमचे वय अचूक वर्षे, महिने आणि दिवसांमध्ये लगेच पहा.',
        'खालील तक्त्यामध्ये एकूण महिने, आठवडे, दिवस आणि तास तपासा.',
        'तुमच्या पुढील वाढदिवसाला किती दिवस बाकी आहेत आणि तो कोणत्या वारी येतो ते पहा.',
      ],
      faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
      faqs: [
        {
          q: 'हा कॅल्क्युलेटर लीप वर्षे आणि ३०/३१ दिवसांचे महिने अचूक मोजतो का?',
          a: 'होय! फेब्रुवारीचे २८/२९ दिवस व सर्व महिन्यांची अचूक संख्या लक्षात घेऊन अचूक वय मोजले जाते.',
        },
        {
          q: 'MPSC, UPSC किंवा भरती परीक्षेच्या ठराविक तारखेनुसार वय मोजता येते का?',
          a: 'होय! "कोणत्या तारखेपर्यंत वय मोजायचे?" या रकान्यात भरती जाहिरातीची कट-ऑफ तारीख निवडून तपासा.',
        },
        {
          q: '२९ फेब्रुवारीला जन्मलेल्या व्यक्तीचे वय अचूक मोजले जाते का?',
          a: 'होय, लीप वर्षातील २९ फेब्रुवारीच्या तारखांची गणना देखील अचूकपणे हाताळली जाते.',
        },
        {
          q: 'यामध्ये जन्मवार आणि पुढील वाढदिवसाचा वार समजतो का?',
          a: 'होय, तुम्हाला तुमचा जन्मवार व पुढील वाढदिवसाचा वार दोन्ही स्पष्ट दिसतात.',
        },
        {
          q: 'माझी जन्मतारीख कुठे सेव्ह होते का?',
          a: 'नाही. ही गणना पूर्णपणे तुमच्या ब्राउझरमध्येच होते.',
        },
      ],
    },
    hi: {
      howToTitle: 'आयु कैलकुलेटर का उपयोग कैसे करें?',
      steps: [
        'कैलेंडर से अपनी सही जन्मतिथि चुनें।',
        'संदर्भ तारीख आज की रखें या सरकारी परीक्षा की कट-ऑफ के अनुसार कोई भी तारीख चुनें।',
        'तुरंत अपनी सटीक उम्र वर्ष, महीने और दिनों में देखें।',
        'नीचे दिए गए विवरण में कुल महीने, सप्ताह, दिन और घंटे जांचें।',
        'अपने अगले जन्मदिन में बाकी दिन और उसका वार देखें।',
      ],
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqs: [
        {
          q: 'क्या यह कैलकुलेटर लीप वर्ष और ३०/३१ दिनों के महीनों को सही से गिनता है?',
          a: 'हां! यह २८/२९ दिन के फरवरी और ३०/३१ दिनों वाले महीनों के हिसाब से सटीक गणना करता है।',
        },
        {
          q: 'क्या मैं MPSC, UPSC या किसी परीक्षा की कट-ऑफ तारीख के अनुसार उम्र देख सकता हूं?',
          a: 'हां! "किस तारीख तक उम्र गिननी है" में परीक्षा की कट-ऑफ तारीख चुनकर अपनी पात्रता जांचें।',
        },
        {
          q: 'क्या २९ फरवरी को जन्मे लोगों की उम्र भी सही निकलती है?',
          a: 'हां, लीप वर्ष की २९ फरवरी जन्मतिथि की गणना भी सटीक होती है।',
        },
        {
          q: 'क्या इससे जन्म का दिन (वार) भी पता चलता है?',
          a: 'हां, यह आपका जन्म दिन और अगले जन्मदिन का दिन दोनों दिखाता है।',
        },
        {
          q: 'क्या मेरी जन्मतिथि कहीं सेव होती है?',
          a: 'नहीं। यह पूरी गणना केवल आपके ब्राउज़र में होती है।',
        },
      ],
    },
  },
};
