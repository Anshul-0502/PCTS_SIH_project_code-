import { PatientProfile } from './patient';
import { UploadedDocument } from './consultation';

export type ReportType = 'AI Consultation' | 'Lab Report' | 'Prescription' | 'Discharge Summary' | 'Diagnostic Report';

export type ReportStatus = 'Draft' | 'Under Review' | 'Finalized';

export interface AIPatientReport {
  id: string;
  reportNumber: string; // e.g. "CPR-2025-0312-001"
  patientId: string;
  patientSnapshot: {
    fullName: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    bloodGroup?: string;
    mobile: string;
  };
  consultationDate: string;
  generatedDate: string;
  finalizedDate?: string;
  status: ReportStatus;
  reportType: ReportType;
  chiefComplaint: string;
  historyOfPresentIllness: {
    duration: string;
    severity: string;
    progression: string;
    associatedSymptoms: string[];
    detailedNarrative: string;
  };
  existingConditions: string[];
  medicationHistory: {
    medicinesTaken: string[];
    patientReportedResponse: string;
  };
  extractedFromDocuments: Array<{
    sourceDocument: string;
    documentType: string;
    findings: string[];
  }>;
  physicianReadySummary: string;
  doctorNotes?: string;
  reviewedByDoctor?: string;
  fileSize?: string;
  pageCount?: number;
  uploadedDocuments?: UploadedDocument[];
}
