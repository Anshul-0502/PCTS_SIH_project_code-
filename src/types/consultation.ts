export type ConsultationLanguage = 'en' | 'hi';

export type VoiceSessionState = 
  | 'idle' 
  | 'requesting_permission' 
  | 'listening' 
  | 'processing' 
  | 'ai_speaking' 
  | 'paused' 
  | 'completed' 
  | 'error';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'patient';
  text: string;
  timestamp: string;
  audioDuration?: number;
  isVoice?: boolean;
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: 'pdf' | 'jpg' | 'jpeg' | 'png';
  category: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Previous Consultation Report' | 'Diagnostic Report';
  uploadedAt: string;
  ocrStatus: 'idle' | 'uploading' | 'processing_ocr' | 'completed' | 'failed';
  extractedData?: {
    medicines?: string[];
    dosages?: string[];
    labValues?: Array<{ test: string; value: string; unit?: string; status?: 'normal' | 'abnormal' }>;
    diagnosesMentioned?: string[];
    previousHistoryNotes?: string;
  };
}

export interface CaseTakingContext {
  chiefComplaint: string;
  duration: string;
  symptomProgression: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  associatedSymptoms: string[];
  medicinesTaken: string[];
  medicineResponse: string;
  existingDiseases: string[];
  previousRelevantHistory: string;
  additionalNotes?: string;
  uploadedReports: UploadedDocument[];
  conversationTranscript: ChatMessage[];
  consultationLanguage: ConsultationLanguage;
  startedAt: string;
  completedAt?: string;
}
