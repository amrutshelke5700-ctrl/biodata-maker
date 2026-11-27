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
  '/passport-photo-maker': {
    en: {
      howToTitle: 'How to Use Passport Photo Maker',
      steps: [
        'Upload a clear, front-facing portrait photo in JPG, PNG, or WEBP format.',
        'Choose Original, White, or Light Blue background — click Auto-Replace Background with AI if needed.',
        'Enter your Name and Photo Taken Date (DOP) if required for MPSC, UPSC, SSC, or exam forms.',
        'Adjust zoom and vertical position, then choose 8 Photos or 12 Photos per A4 sheet.',
        'Download the 300 DPI printable A4 PDF, A4 JPG, or a single 3.5×4.5 cm JPG right in your browser.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Is printing Name and Date on passport photos supported for MPSC and UPSC?',
          a: 'Yes! You can add your Name and Date of Photo (DOP) on a crisp white strip at the bottom of each 3.5×4.5 cm photo.',
        },
        {
          q: 'Can I change my photo background to White or Light Blue?',
          a: 'Yes! Select White or Light Blue and the built-in browser AI cutout cleanly replaces the old background without uploading your photo.',
        },
        {
          q: 'How many photos fit on the A4 printable sheet?',
          a: 'You can switch between 8 photos (4×2 layout) or 12 photos (4×3 layout) sized accurately to 3.5 × 4.5 cm on standard A4 paper.',
        },
        {
          q: 'Can I download both PDF and JPG for printing?',
          a: 'Yes, download an exact A4 PDF for photo lab or home printing, an A4 JPG sheet, or a single passport photo JPG for online form upload.',
        },
        {
          q: 'Is my portrait photo uploaded to any server?',
          a: 'No. Background replacement, caption rendering, and A4 PDF generation all happen 100% locally inside your browser.',
        },
      ],
    },
    mr: {
      howToTitle: 'पासपोर्ट फोटो मेकर कसा वापरावा?',
      steps: [
        'सरळ समोर पाहणारा स्पष्ट फोटो JPG, PNG किंवा WEBP फॉरमॅटमध्ये अपलोड करा.',
        'मूळ, पांढरा किंवा हलका निळा बॅकग्राउंड निवडा — आवश्यक असल्यास AI ने जुने बॅकग्राउंड बदला.',
        'MPSC, UPSC किंवा परीक्षा फॉर्मसाठी फोटोखाली हवे असल्यास तुमचे नाव व फोटो काढल्याची तारीख (DOP) लिहा.',
        'झूम व वर-खाली पोझिशन सेट करून A4 शीटवर ८ फोटो किंवा १२ फोटो पर्याय निवडा.',
        'तयार झालेली प्रिंट-रेडी A4 PDF, A4 JPG शीट किंवा सिंगल 3.5×4.5 सेमी JPG लगेच डाउनलोड करा.',
      ],
      faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
      faqs: [
        {
          q: 'MPSC व UPSC फॉर्मसाठी फोटोखाली नाव आणि तारीख छापता येते का?',
          a: 'होय! प्रत्येक 3.5×4.5 सेमी फोटोच्या खालच्या पांढऱ्या पट्टीवर तुमचे नाव आणि फोटोची तारीख (DOP) स्पष्ट प्रिंट होते.',
        },
        {
          q: 'फोटोचे बॅकग्राउंड पांढरे किंवा हलके निळे करता येते का?',
          a: 'होय! पांढरा किंवा हलका निळा रंग निवडल्यावर ब्राउझरमधील AI जुने बॅकग्राउंड काढून स्टुडिओसारखे स्वच्छ बॅकग्राउंड लावते.',
        },
        {
          q: 'A4 शीटवर किती पासपोर्ट फोटो बसतात?',
          a: 'तुम्ही एका क्लिकवर मानक A4 पानावर ८ फोटो (४×२) किंवा १२ फोटो (४×३) अशी मांडणी निवडू शकता.',
        },
        {
          q: 'शीट PDF आणि JPG दोन्ही स्वरूपात डाउनलोड होते का?',
          a: 'होय, तुम्ही प्रिंटिंगसाठी A4 PDF किंवा A4 JPG तसेच ऑनलाइन फॉर्मसाठी सिंगल फोटो JPG डाउनलोड करू शकता.',
        },
        {
          q: 'माझा फोटो कोणत्याही सर्व्हरवर अपलोड होतो का?',
          a: 'नाही. बॅकग्राउंड बदलणे, नाव-तारीख जोडणे आणि A4 PDF तयार करणे ही सर्व कामे १००% तुमच्या ब्राउझरमध्ये होतात.',
        },
      ],
    },
    hi: {
      howToTitle: 'पासपोर्ट फोटो मेकर का उपयोग कैसे करें?',
      steps: [
        'सीधे सामने देखती हुई स्पष्ट पोर्ट्रेट फोटो JPG, PNG या WEBP में अपलोड करें।',
        'मूल, सफेद या हल्का नीला बैकग्राउंड चुनें — जरूरत होने पर AI से पुराना बैकग्राउंड बदलें।',
        'MPSC, UPSC या परीक्षा फॉर्म के लिए फोटो के नीचे अपना नाम और तारीख (DOP) दर्ज करें।',
        'ज़ूम व स्थिति सेट करें और A4 शीट के लिए ८ फोटो या १२ फोटो लेआउट चुनें।',
        'प्रिंट-रेडी A4 PDF, A4 JPG शीट या सिंगल 3.5×4.5 सेमी JPG सीधे ब्राउज़र से डाउनलोड करें।',
      ],
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqs: [
        {
          q: 'क्या MPSC व UPSC फॉर्म के लिए फोटो के नीचे नाम और तारीख प्रिंट होती है?',
          a: 'हां! प्रत्येक 3.5×4.5 सेमी पासपोर्ट फोटो की निचली सफेद पट्टी पर नाम और फोटो की तारीख (DOP) साफ प्रिंट होती है।',
        },
        {
          q: 'क्या मैं फोटो का बैकग्राउंड सफेद या हल्का नीला कर सकता हूं?',
          a: 'हां! सफेद या हल्का नीला रंग चुनने पर ब्राउज़र का AI पुराना बैकग्राउंड हटाकर नया स्टूडियो बैकग्राउंड लगा देता है।',
        },
        {
          q: 'A4 शीट पर कितने पासपोर्ट फोटो तैयार होते हैं?',
          a: 'आप स्टैंडर्ड A4 पेपर पर ८ फोटो (४×२) या १२ फोटो (४×३) का प्रिंट लेआउट चुन सकते हैं।',
        },
        {
          q: 'क्या A4 शीट PDF और JPG दोनों में डाउनलोड की जा सकती है?',
          a: 'जी हां, प्रिंटिंग के लिए A4 PDF व A4 JPG और ऑनलाइन आवेदन के लिए सिंगल फोटो JPG भी डाउनलोड कर सकते हैं।',
        },
        {
          q: 'क्या मेरी फोटो किसी सर्वर पर अपलोड होती है?',
          a: 'नहीं। बैकग्राउंड बदलाव, नाम-तारीख और A4 PDF जनरेशन सब कुछ १००% आपके ब्राउज़र में होता है।',
        },
      ],
    },
  },
  '/signature-resize': {
    en: {
      howToTitle: 'How to Use Signature & Thumb Resize Tool',
      steps: [
        'Upload a photo or scan of your handwritten signature or thumb impression.',
        'Pick a government form preset (140×60 px Signature, 240×240 px Thumb) or set Custom dimensions.',
        'Keep Auto-Crop enabled to trim extra white paper margins around your signature automatically.',
        'Optionally enable Clean White Paper to turn gray camera backgrounds pure white (#FFFFFF).',
        'Click Resize & Compress and download your exact-pixel JPG strictly between 10 KB and 20 KB.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Which pixel sizes work for MPSC, UPSC, SSC, and IBPS signature & thumb uploads?',
          a: 'Most Indian portals require 140×60 px for Signatures and 240×240 px for Left Thumb Impressions within 10 KB to 20 KB JPG.',
        },
        {
          q: 'How does Auto-Crop work on a phone photo of a signature?',
          a: 'It scans your image inside the browser to locate the ink or thumb ridges, removes blank borders, and centers your mark without stretching.',
        },
        {
          q: 'What if a tiny 140×60 px JPG compresses smaller than 10 KB?',
          a: 'Government portals reject files under 10 KB as well as over 20 KB. This tool ensures your valid JPG stays strictly inside your chosen Min–Max KB range (e.g. 10–20 KB).',
        },
        {
          q: 'Can I enter custom width, height, and KB limits?',
          a: 'Yes! Select Custom Size (px) to specify any pixel width, height, minimum KB, and maximum KB required by your exam portal.',
        },
        {
          q: 'Are my signature and thumb impression kept private?',
          a: 'Yes. All cropping, ink cleanup, and JPEG encoding happen 100% inside your browser without uploading files anywhere.',
        },
      ],
    },
    mr: {
      howToTitle: 'सही आणि अंगठा रिसाईझ टूल कसे वापरावे?',
      steps: [
        'तुमच्या सहीचा किंवा अंगठ्याच्या ठशाचा फोटो किंवा स्कॅन अपलोड करा.',
        'सरकारी फॉर्मनुसार प्रीसेट निवडा (सही 140×60 px, अंगठा 240×240 px) किंवा कस्टम साईझ टाका.',
        'सहीभोवतीचा अतिरिक्त कोरा कागद कापण्यासाठी Auto-Crop पर्याय चालू ठेवा.',
        'फोटोतील करडा कागद शुद्ध पांढरा करण्यासाठी "कागद पांढरा करा" पर्याय निवडा.',
        '"रिसाईझ आणि कॉम्प्रेस करा" वर क्लिक करून अचूक 10KB ते 20KB मधील JPG डाउनलोड करा.',
      ],
      faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
      faqs: [
        {
          q: 'MPSC, UPSC, SSC व IBPS फॉर्मसाठी सही व अंगठ्याची साईझ किती लागते?',
          a: 'बहुतांश सरकारी फॉर्मसाठी सही 140×60 px आणि डाव्या अंगठ्याचा ठसा 240×240 px व 10KB ते 20KB JPG स्वरूपात लागतो.',
        },
        {
          q: 'मोबाईलने काढलेल्या फोटोमधून सही आपोआप कशी क्रॉप होते?',
          a: 'ब्राउझरमधील Auto-Crop तंत्रज्ञान कागदावरील शाई किंवा अंगठ्याच्या रेषा ओळखून आजूबाजूची रिकामी जागा आपोआप कापते.',
        },
        {
          q: '140×60 px इमेज 10KB पेक्षा कमी झाली तर फॉर्म स्वीकारत नाही, यावर उपाय काय?',
          a: 'सरकारी पोर्टलवर किमान 10KB व कमाल 20KB मर्यादा असते. हे टूल तुमचा वैध JPG अचूक 10KB ते 20KB च्या दरम्यानच तयार करते.',
        },
        {
          q: 'मी स्वतःचे कस्टम पिक्सेल आणि KB मर्यादा देऊ शकतो का?',
          a: 'होय! Custom Size पर्याय निवडून तुम्ही हवी ती रुंदी, उंची आणि किमान-कमाल KB साईझ सेट करू शकता.',
        },
        {
          q: 'माझी सही आणि अंगठ्याचा ठसा सुरक्षित राहतो का?',
          a: 'होय, क्रॉपिंग व कॉम्प्रेशनची संपूर्ण प्रक्रिया १००% तुमच्या ब्राउझरमध्ये होते; कोणताही डेटा सर्व्हरवर जात नाही.',
        },
      ],
    },
    hi: {
      howToTitle: 'सिग्नेचर व थंब रिसाइज़ टूल का उपयोग कैसे करें?',
      steps: [
        'अपने हस्ताक्षर (Signature) या अंगूठे के निशान की फोटो या स्कैन अपलोड करें।',
        'सरकारी फॉर्म के अनुसार प्रीसेट चुनें (सिग्नेचर 140×60 px, थंब 240×240 px) या कस्टम साइज डालें।',
        'सही के चारों ओर का अतिरिक्त खाली कागज काटने के लिए Auto-Crop चालू रखें।',
        'हल्के ग्रे कागज को शुद्ध सफेद बनाने के लिए "कागज सफेद करें" विकल्प का उपयोग करें।',
        '"रिसाइज़ और कंप्रेस करें" पर क्लिक करें और 10KB से 20KB के बीच सटीक JPG डाउनलोड करें।',
      ],
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqs: [
        {
          q: 'MPSC, UPSC, SSC और IBPS में सिग्नेचर व अंगूठे का साइज कितना मांगा जाता है?',
          a: 'अधिकतर सरकारी परीक्षाओं में सिग्नेचर 140×60 px और बाएं अंगूठे का निशान 240×240 px व 10KB से 20KB JPG में मांगा जाता है।',
        },
        {
          q: 'मोबाइल से खींचे फोटो में Auto-Crop कैसे काम करता है?',
          a: 'यह ब्राउज़र में स्याही और अंगूठे के निशान की सीमाएं पहचानकर चारों तरफ के खाली सफेद हिस्से को अपने आप काट देता है।',
        },
        {
          q: 'यदि 140×60 px फोटो 10KB से छोटा बने तो क्या वह मान्य होगा?',
          a: 'कई सरकारी पोर्टल 10KB से कम और 20KB से अधिक की फाइल अस्वीकार करते हैं। यह टूल आपकी वैध JPG फाइल को ठीक 10KB–20KB के बीच तैयार करता है।',
        },
        {
          q: 'क्या मैं अपनी जरूरत के अनुसार कस्टम पिक्सेल और KB सीमा चुन सकता हूं?',
          a: 'जी हां! Custom Size चुनकर आप कोई भी पिक्सेल चौड़ाई, ऊंचाई और न्यूनतम-अधिकतम KB सीमा सेट कर सकते हैं।',
        },
        {
          q: 'क्या मेरा सिग्नेचर और अंगूठे का निशान सुरक्षित रहता है?',
          a: 'हां। क्रॉपिंग और कंप्रेशन १००% आपके ब्राउज़र में ही होता है, कोई भी इमेज सर्वर पर अपलोड नहीं होती।',
        },
      ],
    },
  },
  '/rent-receipt-generator': {
    en: {
      howToTitle: 'How to Use Rent Receipt & Salary Slip Generator',
      steps: [
        'Choose either the Rent Receipt (HRA) tab or the Salary Slip tab at the top.',
        'For HRA Rent Receipts, enter tenant name, landlord name, optional landlord PAN, monthly rent, and property address.',
        'Pick 1, 2, or 3 monthly receipts per A4 sheet and verify the live A4 printable preview.',
        'For Salary Slips, enter employer details, employee info, earnings (Basic, HRA, Allowances), and deductions (PF, PT, TDS).',
        'Click "Download A4 PDF" to save a clean printable PDF directly inside your browser.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Are these Rent Receipts valid for HRA Income Tax exemption?',
          a: 'Yes! Each receipt includes receipt number, payment period, tenant & landlord names, property address, amount in words, optional landlord PAN, and a ₹1 Revenue Stamp signature box.',
        },
        {
          q: 'When is Landlord PAN mandatory on a Rent Receipt?',
          a: 'Under Indian Income Tax rules, if your total annual rent exceeds ₹1,00,000 (over ₹8,333/month), providing the landlord PAN is required when claiming HRA.',
        },
        {
          q: 'Can I print 3 monthly receipts (quarterly) on a single A4 sheet?',
          a: 'Yes! Select "3 Months (Quarterly)" to fit three sequential monthly rent receipts neatly on one A4 page.',
        },
        {
          q: 'Does the Salary Slip calculate Gross Earnings and Net Pay automatically?',
          a: 'Yes, entering Basic, HRA, Allowances, PF, PT, and TDS updates Gross Pay, Total Deductions, Net Payable Salary, and Amount in Words automatically.',
        },
        {
          q: 'Are my salary, PAN, or rent details uploaded to any server?',
          a: 'No. All form entries and A4 PDF rendering run 100% locally in your browser.',
        },
      ],
    },
    mr: {
      howToTitle: 'घरभाडे पावती व पगार स्लिप जनरेटर कसे वापरावे?',
      steps: [
        'वरच्या बाजूने "घरभाडे पावती (HRA)" किंवा "पगार स्लिप" यापैकी हवे असलेले टॅब निवडा.',
        'घरभाडे पावतीसाठी भाडेकरूचे नाव, घरमालकाचे नाव, ऐच्छिक PAN, मासिक भाडे आणि घराचा पत्ता भरा.',
        'एका A4 पानावर १, २ किंवा ३ महिन्यांच्या पावत्या निवडून लाइव्ह प्रिव्ह्यू तपासा.',
        'पगार स्लिपसाठी कंपनी, कर्मचारी माहिती, Basic/HRA उत्पन्न आणि PF/PT/TDS कपात भरा.',
        '"A4 PDF डाउनलोड करा" बटणावर क्लिक करून प्रिंट-रेडी PDF सेव्ह करा.',
      ],
      faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
      faqs: [
        {
          q: 'ही घरभाडे पावती आयकर (HRA) बचतीसाठी वैध असते का?',
          a: 'होय! या पावतीवर पावती क्रमांक, महिना, भाडेकरू व घरमालकाचे नाव, पत्ता, अक्षरी रक्कम, ऐच्छिक PAN आणि ₹1 रेव्हेन्यू स्टॅम्प सही बॉक्स असतो.',
        },
        {
          q: 'घरभाडे पावतीवर घरमालकाचा PAN केव्हा आवश्यक असतो?',
          a: 'वार्षिक घरभाडे ₹1,00,000 पेक्षा जास्त (दरमहा ₹8,333 पेक्षा जास्त) असल्यास HRA सूट मिळवण्यासाठी घरमालकाचा PAN देणे आवश्यक असते.',
        },
        {
          q: 'एकाच A4 पानावर ३ महिन्यांच्या (तिमाही) पावत्या मिळतात का?',
          a: 'होय! "३ महिने (तिमाही)" पर्याय निवडून तुम्ही एकाच A4 पानावर सलग ३ महिन्यांच्या पावत्या प्रिंट करू शकता.',
        },
        {
          q: 'पगार स्लिपमध्ये एकूण पगार आणि निव्वळ पगार आपोआप मोजला जातो का?',
          a: 'होय, Basic, HRA, भत्ते आणि PF, PT, TDS टाकताच Gross Pay, एकूण कपात व Net Pay आपोआप मोजला जातो.',
        },
        {
          q: 'माझी पगार किंवा PAN माहिती सर्व्हरवर सेव्ह होते का?',
          a: 'नाही. सर्व माहिती आणि PDF निर्मिती पूर्णपणे तुमच्याच ब्राउझरमध्ये होते.',
        },
      ],
    },
    hi: {
      howToTitle: 'रेंट रसीद व सैलरी स्लिप जनरेटर का उपयोग कैसे करें?',
      steps: [
        'ऊपर दिए गए टैब में से "रेंट रसीद (HRA)" या "सैलरी स्लिप" चुनें।',
        'रेंट रसीद के लिए किरायेदार का नाम, मकान मालिक का नाम, वैकल्पिक PAN, मासिक किराया और पता भरें।',
        'एक A4 पेज पर १, २ या ३ महीने की रसीदें चुनें और लाइव प्रिव्यू जांचें।',
        'सैलरी स्लिप के लिए कंपनी, कर्मचारी विवरण, Basic/HRA आय और PF/PT/TDS कटौती दर्ज करें।',
        '"A4 PDF डाउनलोड करें" बटन दबाकर तुरंत प्रिंट-रेडी PDF सेव करें।',
      ],
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqs: [
        {
          q: 'क्या ये रेंट रसीदें इनकम टैक्स (HRA) क्लेम के लिए मान्य हैं?',
          a: 'हां! प्रत्येक रसीद में रसीद संख्या, अवधि, किरायेदार व मकान मालिक का नाम, पता, शब्दों में राशि, वैकल्पिक PAN और ₹1 रेवेन्यू स्टैम्प बॉक्स शामिल है।',
        },
        {
          q: 'रेंट रसीद पर मकान मालिक का PAN कब जरूरी होता है?',
          a: 'यदि आपका सालाना किराया ₹1,00,000 से अधिक (मासिक ₹8,333 से ऊपर) है, तो HRA छूट के लिए मकान मालिक का PAN अनिवार्य होता है।',
        },
        {
          q: 'क्या एक ही A4 पेज पर ३ महीने (तिमाही) की रसीदें बन सकती हैं?',
          a: 'हां! "३ महीने (तिमाही)" चुनकर आप एक A4 पेज पर लगातार ३ महीनों की रसीदें तैयार कर सकते हैं।',
        },
        {
          q: 'क्या सैलरी स्लिप में कुल वेतन व नेट पे अपने आप निकलता है?',
          a: 'जी हां, Basic, HRA, भत्ते और PF/PT/TDS भरते ही Gross Salary, कुल कटौती और Net Pay अपने आप कैलकुलेट हो जाते हैं।',
        },
        {
          q: 'क्या मेरी सैलरी या PAN जानकारी किसी सर्वर पर अपलोड होती है?',
          a: 'नहीं। सभी विवरण और A4 PDF जनरेशन १००% आपके ब्राउज़र में ही होते हैं।',
        },
      ],
    },
  },
  '/gst-emi-calculator': {
    en: {
      howToTitle: 'How to Use GST & EMI Calculator',
      steps: [
        'Switch between the "GST Calculator" tab and the "Loan EMI Calculator" tab.',
        'In GST Calculator, enter the amount, pick a GST slab (3%, 5%, 12%, 18%, 28%) or custom %, and select Exclusive or Inclusive.',
        'Toggle Intra-State (CGST + SGST) or Inter-State (IGST) to inspect exact tax splits.',
        'In EMI Calculator, choose Home Loan, Vehicle Loan, or Personal Loan presets, then adjust Amount, Interest Rate, and Tenure.',
        'Check your Monthly EMI, Total Interest Payable, and Year-by-Year Repayment Schedule instantly.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'What is the difference between GST Exclusive and GST Inclusive?',
          a: 'GST Exclusive adds GST on top of your base price (Base × Rate%), while GST Inclusive extracts the embedded GST from a GST-included MRP or bill amount.',
        },
        {
          q: 'Which GST tax slabs are supported?',
          a: 'All standard Indian GST slabs — 3% (gold/jewellery), 5%, 12%, 18%, and 28% — plus any custom percentage.',
        },
        {
          q: 'How is CGST + SGST vs IGST calculated?',
          a: 'For Intra-State sales, GST splits equally into 50% CGST and 50% SGST. For Inter-State sales, 100% applies as IGST.',
        },
        {
          q: 'How is Monthly Loan EMI calculated?',
          a: 'It uses the standard reducing-balance banking formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1), matching Indian bank Home and Car loans.',
        },
        {
          q: 'Can I view a year-by-year principal and interest breakup?',
          a: 'Yes! The EMI tab automatically generates a complete year-by-year repayment schedule showing Principal Paid, Interest Paid, and Closing Balance.',
        },
      ],
    },
    mr: {
      howToTitle: 'GST व EMI कॅल्क्युलेटर कसे वापरावे?',
      steps: [
        'वरच्या बाजूला "GST कॅल्क्युलेटर" किंवा "कर्ज EMI कॅल्क्युलेटर" टॅब निवडा.',
        'GST मध्ये रक्कम टाका, 3%, 5%, 12%, 18%, 28% दर निवडा आणि Exclusive किंवा Inclusive पर्याय निवडा.',
        'CGST + SGST किंवा IGST मधील अचूक कर विभागणी लगेच पहा.',
        'EMI टॅबमध्ये गृहकर्ज, वाहन कर्ज किंवा वैयक्तिक कर्ज निवडून रक्कम, व्याजदर व कालावधी सेट करा.',
        'मासिक हप्ता (EMI), एकूण व्याज आणि वार्षिक कर्ज परतफेड तक्ता त्वरित तपासा.',
      ],
      faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
      faqs: [
        {
          q: 'GST Exclusive आणि GST Inclusive मध्ये काय फरक आहे?',
          a: 'GST Exclusive मध्ये मूळ किमतीवर GST जोडला जातो, तर GST Inclusive मध्ये आधीच GST समाविष्ट असलेल्या एकूण बिलातून मूळ रक्कम व GST वेगळा काढला जातो.',
        },
        {
          q: 'यामध्ये कोणते GST दर उपलब्ध आहेत?',
          a: 'सोन्यासाठी 3% तसेच 5%, 12%, 18%, 28% हे सर्व भारतीय GST दर आणि कस्टम टक्केवारी उपलब्ध आहे.',
        },
        {
          q: 'CGST + SGST आणि IGST कसे मोजले जातात?',
          a: 'राज्यांतर्गत व्यवहारात एकूण GST चे समसमान ५०% CGST व ५०% SGST होतात, तर आंतरराज्य व्यवहारात १००% IGST लागतो.',
        },
        {
          q: 'कर्जाचा मासिक हप्ता (EMI) कोणत्या सूत्राने मोजला जातो?',
          a: 'हा कॅल्क्युलेटर भारतीय बँकांच्या मानक Reducing-Balance EMI सूत्रानुसार अचूक मासिक हप्ता व व्याज मोजतो.',
        },
        {
          q: 'दरवर्षी किती मुद्दल व व्याज भरले जाईल हे पाहता येते का?',
          a: 'होय! EMI टॅबमध्ये खाली संपूर्ण वार्षिक परतफेड तक्ता (Amortization Schedule) आपोआप तयार होतो.',
        },
      ],
    },
    hi: {
      howToTitle: 'GST व EMI कैलकुलेटर का उपयोग कैसे करें?',
      steps: [
        'ऊपर दिए गए टैब से "GST कैलकुलेटर" या "लोन EMI कैलकुलेटर" चुनें।',
        'GST कैलकुलेटर में राशि दर्ज करें, 3%, 5%, 12%, 18%, 28% स्लैब चुनें और Exclusive या Inclusive विकल्प चुनें।',
        'CGST + SGST या IGST का सटीक टैक्स विभाजन तुरंत देखें।',
        'EMI टैब में होम लोन, वाहन लोन या पर्सनल लोन चुनकर राशि, ब्याज दर और अवधि सेट करें।',
        'मासिक किस्त (EMI), कुल ब्याज और वार्षिक लोन भुगतान तालिका तुरंत जांचें।',
      ],
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqs: [
        {
          q: 'GST Exclusive और GST Inclusive में क्या अंतर है?',
          a: 'GST Exclusive में मूल कीमत के ऊपर GST जोड़ा जाता है, जबकि GST Inclusive में GST सहित कुल बिल राशि से मूल मूल्य और GST अलग किया जाता है।',
        },
        {
          q: 'इसमें कौन-कौन से GST टैक्स स्लैब मिलते हैं?',
          a: 'इसमें 3% (सोना/ज्वेलरी), 5%, 12%, 18%, और 28% सभी भारतीय GST दरें व कस्टम % की सुविधा है।',
        },
        {
          q: 'CGST + SGST और IGST कैसे अलग होते हैं?',
          a: 'राज्य के भीतर बिक्री पर GST बराबर ५०% CGST और ५०% SGST में बंटता है, जबकि अंतरराज्यीय बिक्री पर १००% IGST लगता है।',
        },
        {
          q: 'लोन की मासिक EMI किस फॉर्मूले से निकलती है?',
          a: 'यह भारतीय बैंकों के मानक Reducing Balance EMI फॉर्मूले से होम लोन, कार लोन और पर्सनल लोन की सटीक किस्त गिनता है।',
        },
        {
          q: 'क्या हर साल के मूलधन और ब्याज का विवरण दिखता है?',
          a: 'हां! EMI टैब में नीचे पूरा वार्षिक भुगतान शेड्यूल (Principal Paid, Interest Paid और Balance) अपने आप दिखता है।',
        },
      ],
    },
  },
  '/image-converter': {
    en: {
      howToTitle: 'How to Use Image Format Converter',
      steps: [
        'Upload or drag any PNG, WebP, JPG, or BMP image from your mobile phone or computer.',
        'Choose your desired output format: JPG, PNG, or WebP.',
        'Adjust the quality slider (or pick a background color if converting transparent PNG/WebP to JPG).',
        'Click "Convert Format" to process the file locally inside your browser in high resolution.',
        'Preview the converted file size and download your JPG, PNG, or WebP image immediately.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Which image formats can I convert on SadhanBox?',
          a: 'You can upload PNG, WebP, JPG/JPEG, BMP, or GIF files and convert them cleanly into high-quality JPG, PNG, or WebP.',
        },
        {
          q: 'Why should I convert WebP or PNG photos to JPG?',
          a: 'Many government portals, job sites, and mobile apps only accept JPG files. Converting WebP or PNG to JPG ensures universal compatibility.',
        },
        {
          q: 'What happens to transparent backgrounds when converting PNG to JPG?',
          a: 'Since JPG does not support transparency, our tool lets you choose a clean White, Black, or Light Gray backdrop automatically.',
        },
        {
          q: 'Does converting reduce image resolution?',
          a: 'No! Your image retains its full original pixel width and height while giving you control over output compression quality.',
        },
        {
          q: 'Are my photos uploaded to any server during conversion?',
          a: 'No. Image decoding and format conversion run 100% client-side using HTML5 Canvas inside your browser.',
        },
      ],
    },
    mr: {
      howToTitle: 'इमेज फॉरमॅट कन्व्हर्टर कसे वापरावे?',
      steps: [
        'तुमच्या मोबाईल किंवा संगणकातून कोणताही PNG, WebP, JPG किंवा BMP फोटो अपलोड करा.',
        'हवा असलेला आउटपुट फॉरमॅट निवडा — JPG, PNG किंवा WebP.',
        'गुणवत्ता (Quality) स्लायडर सेट करा (पारदर्शक फोटो JPG मध्ये बदलताना पांढरा किंवा काळा बॅकग्राउंड निवडा).',
        '"फॉरमॅट बदला (Convert)" बटणावर क्लिक करा आणि काही सेकंदांत फोटो तयार करा.',
        'नवीन फाईल साईज तपासून झटपट डाउनलोड करा.',
      ],
      faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
      faqs: [
        {
          q: 'येथे कोणकोणते फोटो फॉरमॅट कन्व्हर्ट करता येतात?',
          a: 'तुम्ही PNG, WebP, JPG/JPEG, BMP किंवा GIF फोटो उच्च गुणवत्तेच्या JPG, PNG किंवा WebP मध्ये बदलू शकता.',
        },
        {
          q: 'WebP किंवा PNG फोटोचे JPG मध्ये रूपांतर का करावे लागते?',
          a: 'बऱ्याच सरकारी परीक्षा फॉर्म, नोकरी पोर्टल आणि मोबाईल अ‍ॅप्सवर फक्त JPG फॉरमॅट स्वीकारला जातो. त्यामुळे WebP/PNG ते JPG रूपांतर खूप उपयोगी ठरते.',
        },
        {
          q: 'पारदर्शक (Transparent) PNG फोटो JPG मध्ये बदलल्यास बॅकग्राउंड कसा दिसेल?',
          a: 'JPG मध्ये पारदर्शकता नसते, त्यामुळे तुम्ही पांढरा, काळा किंवा हलका करडा बॅकग्राउंड रंग निवडून स्वच्छ फोटो तयार करू शकता.',
        },
        {
          q: 'फॉरमॅट बदलताना फोटोची मूळ साईझ (Resolution) कमी होते का?',
          a: 'नाही! फोटोची मूळ रुंदी व उंची कायम राहते आणि तुम्ही ९०%–१००% उच्च गुणवत्ता निवडू शकता.',
        },
        {
          q: 'फोटो कन्व्हर्ट करण्यासाठी सर्व्हरवर पाठवले जातात का?',
          a: 'नाही. संपूर्ण प्रक्रिया १००% तुमच्याच ब्राउझरमध्ये होते; कोणताही फोटो सर्व्हरवर अपलोड होत नाही.',
        },
      ],
    },
    hi: {
      howToTitle: 'इमेज फॉर्मेट कन्वर्टर का उपयोग कैसे करें?',
      steps: [
        'अपने मोबाइल या कंप्यूटर से कोई भी PNG, WebP, JPG या BMP फोटो अपलोड करें।',
        'अपना वांछित आउटपुट फॉर्मेट चुनें: JPG, PNG या WebP।',
        'गुणवत्ता (Quality) स्लाइडर सेट करें (पारदर्शी PNG/WebP को JPG में बदलते समय बैकग्राउंड रंग चुनें)।',
        '"फॉर्मेट बदलें (Convert)" बटन पर क्लिक करें और ब्राउज़र में तुरंत रूपांतरण करें।',
        'नई फाइल साइज जांचें और तुरंत डाउनलोड करें।',
      ],
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqs: [
        {
          q: 'यहाँ कौन-से इमेज फॉर्मेट कन्वर्ट किए जा सकते हैं?',
          a: 'आप PNG, WebP, JPG/JPEG, BMP या GIF फोटो को उच्च गुणवत्ता वाले JPG, PNG या WebP फॉर्मेट में बदल सकते हैं।',
        },
        {
          q: 'WebP या PNG को JPG में बदलने की जरूरत क्यों पड़ती है?',
          a: 'कई सरकारी परीक्षा फॉर्म और वेबसाइट केवल JPG फॉर्मेट स्वीकार करते हैं। यह टूल किसी भी WebP या स्क्रीनशॉट को तुरंत JPG में बदल देता है।',
        },
        {
          q: 'पारदर्शी PNG को JPG में बदलने पर बैकग्राउंड कैसा दिखेगा?',
          a: 'चूंकि JPG में पारदर्शिता नहीं होती, आप सफेद, काला या हल्का ग्रे बैकग्राउंड चुनकर साफ JPG बना सकते हैं।',
        },
        {
          q: 'क्या फॉर्मेट बदलने से फोटो की क्वालिटी या पिक्सेल कम होते हैं?',
          a: 'नहीं, मूल पिक्सेल आकार सुरक्षित रहता है और आप Quality स्लाइडर से १००% तक गुणवत्ता रख सकते हैं।',
        },
        {
          q: 'क्या मेरी फोटो किसी सर्वर पर अपलोड की जाती है?',
          a: 'नहीं। इमेज कन्वर्जन १००% आपके ब्राउज़र के भीतर होता है और कोई भी फाइल डिवाइस से बाहर नहीं जाती।',
        },
      ],
    },
  },
  '/word-counter-typing': {
    en: {
      howToTitle: 'How to Use Word Counter & Marathi/Hindi Typing Pad',
      steps: [
        'Select your typing mode: English (Direct), Marathi (English → मराठी), or Hindi (English → हिंदी).',
        'Type or paste text inside the editor to see live Words, Characters (with & without spaces), Sentences, and Paragraphs.',
        'In Marathi or Hindi mode, type phonetically using English letters (like "namaskar maharashtra") and press Space to convert.',
        'Click any suggestion chip above the pad or use quick Devanagari characters (ळ, क्ष, ज्ञ, ।) when needed.',
        'Click "Copy Text" to copy your text for WhatsApp, email, or documents, or download it as a .TXT file.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'How does English to Marathi and Hindi transliteration work?',
          a: 'Simply type Marathi or Hindi words using English letters (e.g., "namaskar" or "dhanyawad") and press Space or Enter. It converts phonetically into Devanagari script right inside your browser.',
        },
        {
          q: 'Does Word Counter count Marathi and Hindi words and sentences accurately?',
          a: 'Yes! It accurately counts Devanagari and English words, characters with/without spaces, paragraphs, and sentences ending with ".", "!", "?", or Devanagari "।".',
        },
        {
          q: 'How do I type special Marathi letters like ळ, क्ष, ज्ञ?',
          a: 'Type "L" for ळ, "ksh" for क्ष, "dny" or "gya" for ज्ञ, or simply tap the Quick Insert Devanagari character buttons above the pad.',
        },
        {
          q: 'Can I convert an entire pasted English-script paragraph at once?',
          a: 'Yes! Paste Roman Marathi/Hindi text and click "Convert English Text" to transliterate the full paragraph in one click.',
        },
        {
          q: 'Is my typed text saved or sent to any server?',
          a: 'No. Everything runs offline inside your browser and nothing is transmitted to any external server.',
        },
      ],
    },
    mr: {
      howToTitle: 'वर्ड काउंटर व मराठी/हिंदी टायपिंग पॅड कसे वापरावे?',
      steps: [
        'वरच्या बाजूने English, मराठी (English → मराठी) किंवा हिंदी (English → हिंदी) यापैकी मोड निवडा.',
        'मजकूर टाईप किंवा पेस्ट करताच वरच्या बॉक्समध्ये शब्द, अक्षरे (स्पेससह/विना), वाक्ये व परिच्छेद संख्या दिसेल.',
        'मराठी किंवा हिंदी मोडमध्ये इंग्रजी अक्षरांत टाईप करा (उदा. "namaskar maharashtra") आणि Space दाबा — शब्द आपोआप देवनागरीत बदलेल.',
        'गरज असल्यास ळ, क्ष, ज्ञ, । या झटपट अक्षर बटणांचा किंवा सूचना शब्दांचा वापर करा.',
        'तयार मजकूर WhatsApp किंवा कागदपत्रासाठी "मजकूर कॉपी करा" बटणाने कॉपी करा किंवा .TXT म्हणून डाउनलोड करा.',
      ],
      faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
      faqs: [
        {
          q: 'इंग्रजीतून मराठी आणि हिंदी टायपिंग (Transliteration) कशी चालते?',
          a: 'तुम्ही जसे वाचता तसे इंग्रजीत टाईप करा (उदा. "namaskar", "pune", "dhanyawad") आणि Space दाबा; लगेच त्याचे अचूक मराठी किंवा हिंदी शब्दांत रूपांतर होते.',
        },
        {
          q: 'हे टूल मराठी आणि हिंदी मजकुरातील शब्द व वाक्ये अचूक मोजते का?',
          a: 'होय! हे टूल मराठी, हिंदी व इंग्रजी शब्द, अक्षरे, परिच्छेद आणि पूर्णविराम (। किंवा .) असलेली वाक्ये अचूक मोजते.',
        },
        {
          q: 'मराठीतील ळ, क्ष, ज्ञ ही अक्षरे कशी टाईप करायची?',
          a: 'ळ साठी "L", क्ष साठी "ksh", ज्ञ साठी "dny" टाईप करा किंवा टायपिंग बॉक्सच्या वर दिलेली झटपट अक्षरांची बटणे वापरा.',
        },
        {
          q: 'संपूर्ण इंग्रजी-स्क्रिप्ट मजकूर एका क्लिकवर मराठीत बदलता येतो का?',
          a: 'होय! तुम्ही रोमन मराठीत लिहिलेला मजकूर पेस्ट करून "पूर्ण इंग्रजी मजकूर बदला" बटणावर क्लिक करून एका क्षणात देवनागरीत बदलू शकता.',
        },
        {
          q: 'मी टाईप केलेला मजकूर सर्व्हरवर सेव्ह होतो का?',
          a: 'नाही. संपूर्ण टायपिंग व शब्द मोजणी तुमच्याच ब्राउझरमध्ये होते; कोणताही मजकूर सर्व्हरवर जात नाही.',
        },
      ],
    },
    hi: {
      howToTitle: 'वर्ड काउंटर व मराठी/हिंदी टाइपिंग पैड का उपयोग कैसे करें?',
      steps: [
        'ऊपर से English, मराठी (English → मराठी) या हिंदी (English → हिंदी) मोड चुनें।',
        'बॉक्स में टेक्स्ट लिखें या पेस्ट करें और ऊपर रियल-टाइम शब्द, अक्षर, वाक्य और पैराग्राफ की संख्या देखें।',
        'मराठी या हिंदी मोड में अंग्रेजी अक्षरों से लिखें (जैसे "namaste bharat") और Space दबाएं — यह तुरंत देवनागरी में बदल जाएगा।',
        'आवश्यकतानुसार ऊपर दिए गए सुझाव या त्वरित देवनागरी अक्षर बटन (ळ, क्ष, ज्ञ, ।) का उपयोग करें।',
        'तैयार टेक्स्ट को "टेक्स्ट कॉपी करें" से कॉपी करें या .TXT फाइल के रूप में डाउनलोड करें।',
      ],
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqs: [
        {
          q: 'अंग्रेजी से हिंदी और मराठी टाइपिंग (Transliteration) कैसे काम करती है?',
          a: 'आप बस बोलचाल की तरह अंग्रेजी अक्षरों में लिखें (जैसे "namaste", "bharat", "dhanyawad") और Space दबाएं, टूल उसे तुरंत शुद्ध देवनागरी में बदल देता है।',
        },
        {
          q: 'क्या वर्ड काउंटर हिंदी व मराठी के शब्द और वाक्य सही गिनता है?',
          a: 'हां! यह हिंदी, मराठी और अंग्रेजी शब्दों के साथ-साथ पूर्णविराम (।) और (.) से समाप्त होने वाले वाक्यों को भी सटीक गिनता है।',
        },
        {
          q: 'क्ष, ज्ञ, श्र और ळ जैसे अक्षर कैसे टाइप करें?',
          a: 'क्ष के लिए "ksh", ज्ञ के लिए "dny" या "gya", श्र के लिए "shr", और ळ के लिए "L" लिखें या ऊपर दिए गए त्वरित अक्षर बटनों पर क्लिक करें।',
        },
        {
          q: 'क्या पेस्ट किए गए पूरे पैराग्राफ को एक साथ हिंदी/मराठी में बदला जा सकता है?',
          a: 'जी हां! अंग्रेजी लिपि में लिखा पैराग्राफ पेस्ट करके "पूरा अंग्रेजी टेक्स्ट बदलें" पर क्लिक करें।',
        },
        {
          q: 'क्या मेरा लिखा हुआ टेक्स्ट किसी सर्वर पर भेजा जाता है?',
          a: 'नहीं। यह टूल १००% आपके ब्राउज़र के भीतर चलता है और आपका कोई भी डेटा कहीं अपलोड नहीं होता।',
        },
      ],
    },
  },
  '/watermark-adder': {
    en: {
      howToTitle: 'How to Add a Watermark on Image, PDF & Video',
      steps: [
        'Choose Image, PDF, or Video mode at the top of the Watermark Adder workspace.',
        'Upload your photo (JPG, PNG, WebP), multi-page PDF document, or video file (MP4, WebM, MOV).',
        'Select Custom Text or upload a transparent Logo watermark, then adjust placement, size, opacity, rotation, and color.',
        'Inspect the live watermark preview on the right to verify alignment and contrast.',
        'Unlock SadhanBox Pro Pass and click Apply Watermark & Download to save your protected file.',
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Is Watermark Adder a paid Pro tool?',
          a: 'Yes, Watermark Adder is part of SadhanBox Pro Pass (₹49/month or ₹199/year). You can preview watermarks freely and unlock Pro anytime to export watermarked images, PDFs, and videos.',
        },
        {
          q: 'Are my photos, PDFs, or videos uploaded to any server?',
          a: 'No. All image, PDF, and video watermarking happens 100% locally inside your browser so your private files never leave your device.',
        },
        {
          q: 'Can I add Marathi or Hindi text watermarks to a PDF?',
          a: 'Yes! You can type custom watermarks in English, Marathi, Hindi, or any Unicode script and apply them cleanly across every page of your PDF.',
        },
        {
          q: 'Can I use my own brand logo as a watermark?',
          a: 'Yes, switch to Logo / Image mode, upload a PNG or JPG logo, and adjust its scale, opacity, rotation, and placement.',
        },
        {
          q: 'How does video watermarking work in the browser?',
          a: 'The tool composites your custom watermark over every frame of the uploaded video using HTML5 Canvas and exports a downloadable video file directly on your device.',
        },
      ],
    },
    mr: {
      howToTitle: 'फोटो, PDF आणि व्हिडिओवर वॉटरमार्क कसा लावावा?',
      steps: [
        'वरच्या टॅबमधून Image, PDF किंवा Video पर्याय निवडा.',
        'तुमचा फोटो (JPG/PNG/WebP), PDF दस्तऐवज किंवा व्हिडिओ फाईल (MP4/WebM/MOV) अपलोड करा.',
        'कस्टम मजकूर किंवा तुमचा लोगो निवडा आणि स्थान, आकार, पारदर्शकता (Opacity), कोन आणि रंग सेट करा.',
        'उजव्या बाजूच्या लाइव्ह प्रिव्ह्यूमध्ये वॉटरमार्क कसा दिसतो ते तपासा.',
        'SadhanBox Pro अनलॉक करून "वॉटरमार्क लावा व डाउनलोड करा" बटणावर क्लिक करा.',
      ],
      faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
      faqs: [
        {
          q: 'वॉटरमार्क ॲडर हे पेड (Pro) टूल आहे का?',
          a: 'होय, हे टूल SadhanBox Pro Pass (₹49/महिना किंवा ₹199/वर्ष) अंतर्गत उपलब्ध आहे. तुम्ही प्रिव्ह्यू तपासू शकता आणि Pro अनलॉक करून डाउनलोड करू शकता.',
        },
        {
          q: 'माझे फोटो, PDF किंवा व्हिडिओ सर्व्हरवर अपलोड होतात का?',
          a: 'नाही. संपूर्ण प्रक्रिया १००% तुमच्याच ब्राउझरमध्ये होते, त्यामुळे तुमच्या खाजगी फाईल्स सुरक्षित राहतात.',
        },
        {
          q: 'PDF वर मराठी किंवा हिंदी भाषेत वॉटरमार्क टाकता येतो का?',
          a: 'होय! तुम्ही मराठी, हिंदी किंवा इंग्रजीमध्ये हवा तो मजकूर लिहून सर्व PDF पानांवर वॉटरमार्क लावू शकता.',
        },
        {
          q: 'मी स्वतःचा लोगो वॉटरमार्क म्हणून वापरू शकतो का?',
          a: 'होय, "लोगो / फोटो" पर्याय निवडून तुमचा PNG किंवा JPG लोगो अपलोड करा आणि त्याचा आकार व पारदर्शकता सेट करा.',
        },
        {
          q: 'ब्राउझरमध्ये व्हिडिओवर वॉटरमार्क कसा लागतो?',
          a: 'ब्राउझरमधील Canvas आणि मीडिया एक्सपोर्ट तंत्रज्ञानाद्वारे प्रत्येक व्हिडिओ फ्रेमवर वॉटरमार्क लावून नवीन व्हिडिओ फाईल तयार केली जाते.',
        },
      ],
    },
    hi: {
      howToTitle: 'इमेज, PDF और वीडियो पर वॉटरमार्क कैसे लगाएं?',
      steps: [
        'ऊपर दिए गए टैब में से Image, PDF या Video विकल्प चुनें।',
        'अपनी फोटो (JPG/PNG/WebP), PDF फाइल या वीडियो फाइल (MP4/WebM/MOV) अपलोड करें।',
        'कस्टम टेक्स्ट या अपना लोगो चुनें और प्लेसमेंट, आकार, पारदर्शिता (Opacity), रोटेशन व रंग सेट करें।',
        'दाईं ओर लाइव प्रीव्यू में अपना वॉटरमार्क जांचें।',
        'SadhanBox Pro अनलॉक करके "वॉटरमार्क लगाएं और डाउनलोड करें" पर क्लिक करें।',
      ],
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqs: [
        {
          q: 'क्या वॉटरमार्क ऐडर एक पेड (Pro) टूल है?',
          a: 'जी हां, यह SadhanBox Pro Pass (₹49/माह या ₹199/वर्ष) का हिस्सा है। आप लाइव प्रीव्यू देख सकते हैं और Pro अनलॉक करके फाइल डाउनलोड कर सकते हैं।',
        },
        {
          q: 'क्या मेरी फोटो, PDF या वीडियो किसी सर्वर पर अपलोड होते हैं?',
          a: 'नहीं। पूरी प्रक्रिया १००% आपके ब्राउज़र में चलती है और आपकी कोई भी फाइल आपके डिवाइस से बाहर नहीं जाती।',
        },
        {
          q: 'क्या PDF पर हिंदी या मराठी में वॉटरमार्क लगाया जा सकता है?',
          a: 'हां! आप हिंदी, मराठी या अंग्रेजी में किसी भी टेक्स्ट का वॉटरमार्क अपनी PDF के सभी पेजों पर लगा सकते हैं।',
        },
        {
          q: 'क्या मैं अपने ब्रांड का लोगो वॉटरमार्क के रूप में इस्तेमाल कर सकता हूं?',
          a: 'जी हां, "लोगो / इमेज" मोड चुनकर अपना PNG या JPG लोगो अपलोड करें और उसका आकार व पारदर्शिता सेट करें।',
        },
        {
          q: 'ब्राउज़र में वीडियो पर वॉटरमार्क कैसे जुड़ता है?',
          a: 'यह टूल ब्राउज़र के अंदर ही वीडियो के हर फ्रेम पर आपका वॉटरमार्क जोड़कर डाउनलोड करने योग्य वीडियो फाइल तैयार करता है।',
        },
      ],
    },
  },
};
