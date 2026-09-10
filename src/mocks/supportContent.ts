export interface FAQItem {
  id: string;
  category: 'AI Consultation' | 'Reports' | 'Appointments' | 'Pharmacy' | 'Account';
  question: string;
  questionHi?: string;
  answer: string;
  answerHi?: string;
}

export interface UserGuideSection {
  id: string;
  title: string;
  titleHi?: string;
  description: string;
  steps: string[];
  iconName: string;
}

export interface VideoTutorial {
  id: string;
  title: string;
  duration: string;
  thumbnailUrl: string;
  category: string;
  description: string;
}

export const mockFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'AI Consultation',
    question: 'Does the AI Assistant provide a final medical diagnosis or prescription?',
    questionHi: 'क्या AI सहायक कोई अंतिम चिकित्सीय निदान या दवा पर्चा (प्रिस्क्रिप्शन) देता है?',
    answer: 'No. The AI Assistant strictly collects clinical case history and prepares a structured report for your doctor. Only qualified physicians make diagnoses and prescribe treatments.',
    answerHi: 'नहीं। AI सहायक केवल आपकी बीमारी का इतिहास व्यवस्थित करता है और डॉक्टर के लिए रिपोर्ट तैयार करता है। अंतिम निदान और उपचार केवल योग्य चिकित्सक ही करते हैं।',
  },
  {
    id: 'faq-2',
    category: 'AI Consultation',
    question: 'Can I speak in Hindi during the consultation?',
    questionHi: 'क्या मैं परामर्श के दौरान हिंदी में बात कर सकता हूँ?',
    answer: 'Yes! Our voice assistant fully supports both Hindi and English. You can switch between voice and text anytime.',
    answerHi: 'हाँ! हमारा वॉइस असिस्टेंट हिंदी और अंग्रेजी दोनों भाषाओं का पूर्ण समर्थन करता है। आप कभी भी आवाज़ या टेक्स्ट में बात कर सकते हैं।',
  },
  {
    id: 'faq-3',
    category: 'Reports',
    question: 'Can I edit the consultation summary before confirming my report?',
    questionHi: 'क्या मैं अपनी रिपोर्ट की पुष्टि करने से पहले सारांश में संशोधन कर सकता हूँ?',
    answer: 'Yes. After completing your voice consultation, the system presents an editable review summary where you can correct or add any missing health details.',
    answerHi: 'हाँ। वॉइस परामर्श पूरा होने के बाद, आपको एक समीक्षा पृष्ठ मिलता है जहाँ आप किसी भी जानकारी को सुधार सकते हैं।',
  },
  {
    id: 'faq-4',
    category: 'Appointments',
    question: 'How do I cancel or reschedule a booked appointment?',
    questionHi: 'मैं बुक किए गए अपॉइंटमेंट को कैसे रद्द या पुनर्निर्धारित करूँ?',
    answer: 'You can visit Hospital Services → Doctor Appointments or check the notification alert to request a rescheduling or cancellation.',
    answerHi: 'आप अस्पताल सेवाएँ → डॉक्टर अपॉइंटमेंट में जाकर या सूचना अलर्ट के माध्यम से समय बदल सकते हैं।',
  },
  {
    id: 'faq-5',
    category: 'Pharmacy',
    question: 'Why do certain medicines require a doctor prescription?',
    questionHi: 'कुछ दवाओं के लिए डॉक्टर के पर्चे की आवश्यकता क्यों होती है?',
    answer: 'Prescription-only medications (Schedule H / Ayurvedic specialized formulations) require physician oversight for patient safety as mandated by Ministry guidelines.',
    answerHi: 'मरीजों की सुरक्षा और सरकारी नियमों के तहत विशेष दवाओं के लिए अधिकृत डॉक्टर का पर्चा अनिवार्य होता है।',
  },
];

export const mockUserGuides: UserGuideSection[] = [
  {
    id: 'guide-1',
    title: 'How to Complete AI Voice Consultation',
    titleHi: 'AI वॉइस परामर्श कैसे पूरा करें',
    description: 'A simple step-by-step guide to explaining your symptoms naturally to the AI Case-Taking Assistant.',
    iconName: 'Mic',
    steps: [
      'Click on "Start AI Consultation" from your dashboard.',
      'Select your preferred consultation language (Hindi or English).',
      'Tap the large blue microphone button and speak clearly into your device.',
      'Answer dynamic follow-up questions regarding duration, severity, and previous medications.',
      'Optionally upload previous prescriptions or lab tests for automatic OCR data extraction.',
      'Review the structured draft, edit any inaccuracies, and confirm to generate your official physician-ready PDF report.',
    ],
  },
  {
    id: 'guide-2',
    title: 'Uploading Medical Documents (OCR)',
    titleHi: 'मेडिकल दस्तावेज़ अपलोड और ओसीआर',
    description: 'Learn how to scan or upload prior prescriptions and diagnostic reports.',
    iconName: 'FileText',
    steps: [
      'During AI Consultation or via Hospital Services, click "Upload Medical Document".',
      'Supported file types: PDF, JPG, PNG up to 10 MB.',
      'Ensure the document is well-lit and all text is clearly readable.',
      'The OCR engine automatically extracts previous diagnoses, medications, and laboratory values.',
    ],
  },
  {
    id: 'guide-3',
    title: 'Booking Doctor Appointments',
    titleHi: 'डॉक्टर अपॉइंटमेंट बुक करना',
    description: 'Find specialized doctors across departments and reserve convenient time slots.',
    iconName: 'Calendar',
    steps: [
      'Navigate to Hospital Services → Doctor Appointments.',
      'Choose the appropriate Department (e.g. Kayachikitsa, Panchakarma, Surgery).',
      'Browse available specialists, view their OPD schedules, and select your preferred date.',
      'Pick an available time slot and review appointment summary.',
      'Confirm booking to receive instant notification and calendar reminder.',
    ],
  },
];

export const mockVideoTutorials: VideoTutorial[] = [
  {
    id: 'vid-1',
    title: 'Getting Started with Patient Case-Taking Software',
    duration: '3:45 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400',
    category: 'General Overview',
    description: 'Tour of patient registration, voice consultation, and how your doctor receives your report.',
  },
  {
    id: 'vid-2',
    title: 'Voice Case-Taking Demo (Hindi & English)',
    duration: '4:10 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400',
    category: 'AI Consultation',
    description: 'Watch a simulated patient explain fever and cough, and how the AI asks dynamic questions.',
  },
  {
    id: 'vid-3',
    title: 'Emergency Ambulance & Casualty Services',
    duration: '2:15 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&q=80&w=400',
    category: 'Emergency Services',
    description: 'How to dispatch an ambulance in an emergency without completing consultations first.',
  },
];
