import { 
  ConsultationLanguage, 
  ChatMessage, 
  UploadedDocument, 
  CaseTakingContext 
} from '../types/consultation';
import { AIPatientReport } from '../types/report';
import { PatientProfile } from '../types/patient';
import { reportService } from './reports.service';
import { notificationService } from './notification.service';

class ConsultationService {
  private activeContext: CaseTakingContext | null = null;

  initSession(patient: PatientProfile, language: ConsultationLanguage): CaseTakingContext {
    const welcomeEn = `Namaste ${patient.fullName}! I am your AI Clinical Case-Taking Assistant. I am here to help collect detailed information about your health problem before you see the doctor. What problem are you facing today?`;
    const welcomeHi = `नमस्ते ${patient.fullName}! मैं आपका AI क्लिनिकल केस-टेकिंग सहायक हूँ। डॉक्टर से मिलने से पहले आपके स्वास्थ्य संबंधी विवरण व्यवस्थित करने में मैं आपकी सहायता करूँगा। आज आप किस स्वास्थ्य समस्या का सामना कर रहे हैं?`;

    this.activeContext = {
      chiefComplaint: '',
      duration: '',
      symptomProgression: '',
      severity: 'Moderate',
      associatedSymptoms: [],
      medicinesTaken: [],
      medicineResponse: '',
      existingDiseases: patient.existingDiseases || [],
      previousRelevantHistory: '',
      uploadedReports: [],
      conversationTranscript: [
        {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          text: language === 'hi' ? welcomeHi : welcomeEn,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isVoice: true,
        },
      ],
      consultationLanguage: language,
      startedAt: new Date().toISOString(),
    };

    return this.activeContext;
  }

  getContext(): CaseTakingContext | null {
    return this.activeContext;
  }

  async processPatientSpeech(
    patientSpeechText: string,
    stepIndex: number
  ): Promise<{ aiReplyText: string; updatedContext: CaseTakingContext }> {
    await new Promise(r => setTimeout(r, 650)); // simulate AI reasoning latency

    if (!this.activeContext) {
      throw new Error('No active consultation session');
    }

    const lang = this.activeContext.consultationLanguage;
    const lower = patientSpeechText.toLowerCase();

    // Append patient message
    const patientMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'patient',
      text: patientSpeechText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoice: true,
    };
    this.activeContext.conversationTranscript.push(patientMsg);

    let aiReplyText = '';

    // Dynamic medical inquiry logic
    if (stepIndex === 0 || !this.activeContext.chiefComplaint) {
      this.activeContext.chiefComplaint = patientSpeechText;
      aiReplyText = lang === 'hi'
        ? `यह परेशानी आपको कितने दिनों से हो रही है? क्या यह अचानक शुरू हुई थी या धीरे-धीरे बढ़ी?`
        : `How long have you been experiencing this problem? Did it start suddenly or gradually worsen?`;
    } else if (stepIndex === 1 || !this.activeContext.duration) {
      this.activeContext.duration = patientSpeechText;
      aiReplyText = lang === 'hi'
        ? `लक्षणों की तीव्रता कैसी है (हल्की, मध्यम, या गंभीर)? क्या इसके साथ कोई अन्य परेशानी जैसे सिरदर्द, थकान या सांस लेने में कठिनाई भी है?`
        : `How would you describe the severity (mild, moderate, or severe)? Are you having any associated symptoms like headache, fatigue, or breathing difficulty?`;
    } else if (stepIndex === 2 || this.activeContext.associatedSymptoms.length === 0) {
      this.activeContext.symptomProgression = patientSpeechText;
      if (lower.includes('headache') || lower.includes('सिरदर्द')) this.activeContext.associatedSymptoms.push('Headache');
      if (lower.includes('cough') || lower.includes('खांसी')) this.activeContext.associatedSymptoms.push('Cough');
      if (lower.includes('body') || lower.includes('दर्द') || lower.includes('ache')) this.activeContext.associatedSymptoms.push('Myalgia / Body ache');
      if (this.activeContext.associatedSymptoms.length === 0) this.activeContext.associatedSymptoms.push('Generalized fatigue');

      aiReplyText = lang === 'hi'
        ? `क्या आपने इस समस्या के लिए कोई दवा ली है? यदि हाँ, तो कौन सी दवा ली और क्या उससे कोई आराम मिला?`
        : `Have you taken any medication for this problem? If yes, which medicine was taken and did you get any relief?`;
    } else if (stepIndex === 3 || this.activeContext.medicinesTaken.length === 0) {
      this.activeContext.medicineResponse = patientSpeechText;
      if (lower.includes('paracetamol') || lower.includes('पैरासिटामोल')) {
        this.activeContext.medicinesTaken.push('Paracetamol 650mg');
      } else if (lower.includes('no') || lower.includes('नहीं')) {
        this.activeContext.medicinesTaken.push('No self-medication');
      } else {
        this.activeContext.medicinesTaken.push(patientSpeechText);
      }

      aiReplyText = lang === 'hi'
        ? `धन्यवाद। मैंने आपके सभी विवरण नोट कर लिए हैं। यदि आपके पास कोई पुराना मेडिकल पर्चा या लैब रिपोर्ट है, तो आप अभी अपलोड कर सकते हैं, अन्यथा हम रिपोर्ट तैयार करने के लिए आगे बढ़ सकते हैं।`
        : `Thank you. I have captured all the necessary clinical details. If you have any previous prescription or diagnostic report, you can upload it now, or we can proceed to review your case report.`;
    } else {
      aiReplyText = lang === 'hi'
        ? `उत्कृष्ट। आपका क्लिनिकल इतिहास पूर्ण हो गया है। कृपया 'कंसल्टेशन सबमिट करें' पर क्लिक करें।`
        : `Excellent. Your clinical case-taking conversation is complete. Please click 'Submit Consultation' to generate your physician-ready case report.`;
    }

    // Append AI reply
    const aiMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'ai',
      text: aiReplyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoice: true,
    };
    this.activeContext.conversationTranscript.push(aiMsg);

    return {
      aiReplyText,
      updatedContext: { ...this.activeContext },
    };
  }

  async uploadAndProcessDocument(file: File, category: UploadedDocument['category']): Promise<UploadedDocument> {
    await new Promise(r => setTimeout(r, 1200)); // Simulate upload + OCR extraction latency

    const doc: UploadedDocument = {
      id: `doc-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.name.endsWith('.pdf') ? 'pdf' : 'png',
      category,
      uploadedAt: new Date().toISOString(),
      ocrStatus: 'completed',
      extractedData: {
        medicines: ['Telmisartan 40mg', 'Multivitamin Daily'],
        dosages: ['Once daily morning'],
        labValues: [
          { test: 'Hemoglobin', value: '13.8', unit: 'g/dL', status: 'normal' },
          { test: 'Blood Glucose (Fasting)', value: '98', unit: 'mg/dL', status: 'normal' },
        ],
        diagnosesMentioned: ['Essential Hypertension (Controlled)', 'Seasonal Rhinitis'],
        previousHistoryNotes: 'OCR successfully extracted prior clinical history and lab indices.',
      },
    };

    if (this.activeContext) {
      this.activeContext.uploadedReports.push(doc);
    }

    return doc;
  }

  generateReportDraft(patient: PatientProfile): AIPatientReport {
    const ctx = this.activeContext;
    const reportNum = `CPR-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;

    const draft: AIPatientReport = {
      id: `rep-${Date.now()}`,
      reportNumber: reportNum,
      patientId: patient.id,
      patientSnapshot: {
        fullName: patient.fullName,
        age: patient.age || 34,
        gender: patient.gender,
        height: patient.height,
        weight: patient.weight,
        bloodGroup: patient.bloodGroup,
        mobile: patient.mobile,
      },
      consultationDate: new Date().toISOString().split('T')[0],
      generatedDate: new Date().toLocaleString(),
      status: 'Draft',
      reportType: 'AI Consultation',
      chiefComplaint: ctx?.chiefComplaint || 'Episodic headache and generalized fatigue for 3 days.',
      historyOfPresentIllness: {
        duration: ctx?.duration || '3 days',
        severity: ctx?.severity || 'Moderate',
        progression: ctx?.symptomProgression || 'Symptoms began acutely and worsen with physical exertion.',
        associatedSymptoms: ctx?.associatedSymptoms.length ? ctx.associatedSymptoms : ['Headache', 'Mild feverish feeling'],
        detailedNarrative: `Patient reports active health complaint of ${ctx?.chiefComplaint || 'fever and malaise'}. Duration: ${ctx?.duration || '3 days'}. Symptoms reported as ${ctx?.severity || 'moderate'} in intensity. Associated with ${ctx?.associatedSymptoms.join(', ') || 'fatigue'}. Self-reported response to prior medicine: ${ctx?.medicineResponse || 'Partial improvement'}.`,
      },
      existingConditions: patient.existingDiseases || [],
      medicationHistory: {
        medicinesTaken: ctx?.medicinesTaken.length ? ctx.medicinesTaken : ['Paracetamol 650mg SOS'],
        patientReportedResponse: ctx?.medicineResponse || 'Temporary alleviation of fever and body pain.',
      },
      extractedFromDocuments: ctx?.uploadedReports.map(r => ({
        sourceDocument: r.fileName,
        documentType: r.category,
        findings: [
          ...(r.extractedData?.medicines || []).map(m => `Medication: ${m}`),
          ...(r.extractedData?.labValues || []).map(v => `${v.test}: ${v.value} ${v.unit || ''}`),
          ...(r.extractedData?.diagnosesMentioned || []).map(d => `Prior Diagnosis: ${d}`),
        ],
      })) || [],
      physicianReadySummary: `Structured clinical summary prepared by AI Case-Taking Assistant for attending physician review. Patient ${patient.fullName} (${patient.age || 34}y/${patient.gender}) presents with ${ctx?.chiefComplaint || 'health complaint'}. History collected via natural voice-based dialogue. No autonomous diagnostic inferences made. Prepared for physical examination and definitive diagnosis.`,
      fileSize: '1.2 MB',
      pageCount: 3,
      uploadedDocuments: ctx?.uploadedReports,
    };

    return draft;
  }

  async finalizeAndSaveReport(report: AIPatientReport): Promise<AIPatientReport> {
    await new Promise(r => setTimeout(r, 700));
    const finalized: AIPatientReport = {
      ...report,
      status: 'Finalized',
      finalizedDate: new Date().toLocaleString(),
    };

    // Save to report history
    await reportService.saveNewReport(finalized);

    // Trigger notification
    await notificationService.addNotification({
      category: 'report',
      title: 'AI Consultation Report Ready',
      message: `Your structured case report (${finalized.reportNumber}) has been generated and saved to your Report History.`,
      priority: 'high',
      actionLabel: 'View Report',
      actionUrl: '/reports',
      metadata: {
        reportId: finalized.id,
        reportType: 'AI Consultation',
      },
    });

    return finalized;
  }
}

export const consultationService = new ConsultationService();
