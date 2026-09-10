import React from 'react';
import { AIPatientReport } from '../../types/report';
import { Download, Printer, Share2, Edit3, ShieldAlert, CheckCircle2, FileText, Activity } from 'lucide-react';
import { mockHospitalInfo } from '../../mocks/hospitalInfo';

interface ReportDocumentViewProps {
  report: AIPatientReport;
  onEdit?: () => void;
  onConfirm?: () => void;
  isDraft?: boolean;
}

export const ReportDocumentView: React.FC<ReportDocumentViewProps> = ({
  report,
  onEdit,
  onConfirm,
  isDraft = false,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Simulated PDF generation / download
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.reportNumber}_Clinical_Report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar (Non-printable) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">{report.reportNumber}</h3>
            <p className="text-[11px] text-slate-500">
              {report.reportType} • {report.generatedDate}
            </p>
          </div>
          <span
            className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              report.status === 'Finalized'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {report.status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-medical-600 hover:bg-medical-700 rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {isDraft && onConfirm && (
            <button
              onClick={onConfirm}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors ml-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm & Save Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Clinical Report Document Paper Container */}
      <div
        id="printable-report"
        className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 max-w-4xl mx-auto"
      >
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-medical-800 bg-medical-50 px-2 py-0.5 rounded border border-medical-200">
                Ministry of Ayush • Govt. of India
              </span>
              <span className="text-[11px] font-bold text-slate-400">SIH PS-26047</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {mockHospitalInfo.name}
            </h1>
            <p className="text-xs text-slate-600 font-medium">{mockHospitalInfo.address}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Emergency Casualty 24x7: {mockHospitalInfo.emergencyHotline}
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="inline-block bg-slate-100 text-slate-800 font-mono font-bold text-xs px-2.5 py-1 rounded-md border border-slate-300">
              {report.reportNumber}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">Date: {report.consultationDate}</p>
            <p className="text-[11px] text-slate-500">Status: {report.status}</p>
          </div>
        </div>

        {/* Title Bar */}
        <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-wide uppercase">
            Physician-Ready Clinical Case-Taking Report
          </h2>
          <p className="text-[11px] text-slate-500">
            Structured Patient Medical History Documentation • Prepared for Attending Physician
          </p>
        </div>

        {/* Section 1: Patient Demographics Snapshot */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Patient Demographics & Baseline Vitals
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50/70 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name</span>
              <span className="font-bold text-slate-800">{report.patientSnapshot.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Age / Gender</span>
              <span className="font-semibold text-slate-800">
                {report.patientSnapshot.age} Yrs / {report.patientSnapshot.gender}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Height / Weight</span>
              <span className="font-semibold text-slate-800">
                {report.patientSnapshot.height} cm / {report.patientSnapshot.weight} kg
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Group</span>
              <span className="font-semibold text-slate-800">
                {report.patientSnapshot.bloodGroup || 'Not Provided'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Chief Complaint */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            2. Chief Complaint (Patient Reported)
          </h3>
          <div className="p-4 bg-medical-50/50 rounded-xl border border-medical-200/70 text-sm font-semibold text-medical-950 leading-relaxed">
            "{report.chiefComplaint}"
          </div>
        </div>

        {/* Section 3: History of Present Illness */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            3. History of Present Problem / Illness (HPI)
          </h3>
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                <span className="font-bold text-slate-800">{report.historyOfPresentIllness.duration}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Severity</span>
                <span className="font-bold text-slate-800">{report.historyOfPresentIllness.severity}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Progression</span>
                <span className="font-bold text-slate-800">{report.historyOfPresentIllness.progression}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                Associated Symptoms
              </span>
              <div className="flex flex-wrap gap-1.5">
                {report.historyOfPresentIllness.associatedSymptoms.map((sym, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-xs border border-slate-200"
                  >
                    {sym}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                Clinical Narrative
              </span>
              <p className="text-slate-700 leading-relaxed">
                {report.historyOfPresentIllness.detailedNarrative}
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Existing Medical Conditions */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            4. Existing Medical Conditions / Past Illnesses
          </h3>
          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 text-xs">
            {report.existingConditions.length === 0 ? (
              <span className="text-slate-500 italic">No previous chronic medical conditions declared.</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {report.existingConditions.map((cond, idx) => (
                  <span
                    key={idx}
                    className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-semibold text-xs"
                  >
                    {cond}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 5: Current & Prior Medication */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            5. Medication History & Patient Response
          </h3>
          <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Medicines Taken</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                {report.medicationHistory.medicinesTaken.join(', ') || 'None reported'}
              </p>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Reported Efficacy / Response</span>
              <p className="text-slate-700 mt-0.5">
                {report.medicationHistory.patientReportedResponse || 'Not reported'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 6: Previous Reports / OCR Findings */}
        {report.extractedFromDocuments && report.extractedFromDocuments.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              6. OCR Extracted Medical Information (From Uploaded Records)
            </h3>
            <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 text-xs space-y-3">
              {report.extractedFromDocuments.map((doc, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-950">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{doc.sourceDocument} ({doc.documentType})</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-700 pl-2 space-y-0.5">
                    {doc.findings.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 7: AI Case-Taking Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            7. Structured Summary (Physician Overview)
          </h3>
          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs leading-relaxed space-y-2">
            <p>{report.physicianReadySummary}</p>
          </div>
        </div>

        {/* Doctor Examination & Signature Block */}
        <div className="pt-8 border-t-2 border-dashed border-slate-300 grid grid-cols-2 gap-8 text-xs">
          <div className="space-y-6">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Attending Doctor Notes</span>
              <div className="mt-1 h-16 border-b border-slate-300"></div>
            </div>
            <p className="text-[11px] text-slate-400">Doctor Signature & Registration No.</p>
          </div>

          <div className="space-y-4 text-right">
            <div className="inline-block p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Clinical Safety Notice</span>
              </div>
              <p className="text-slate-500 text-[10px] leading-tight">
                This document is a clinical case history collected via AI assistance. Final diagnosis, prescriptions, and medical interventions are solely the responsibility of the registered medical practitioner.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
