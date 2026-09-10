import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Bot, 
  Mic, 
  Volume2, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Send, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/AuthContext';
import { useLanguage } from '../../store/LanguageContext';
import { consultationService } from '../../services/consultation.service';
import { 
  VoiceSessionState, 
  ChatMessage, 
  ConsultationLanguage, 
  UploadedDocument, 
  CaseTakingContext 
} from '../../types/consultation';
import { AIPatientReport } from '../../types/report';
import { VoiceWaveform } from '../../components/medical/VoiceWaveform';
import { AudioMicButton } from '../../components/medical/AudioMicButton';
import { DocumentUploadModal } from '../../components/medical/DocumentUploadModal';
import { ReportDocumentView } from '../../components/medical/ReportDocumentView';

type ConsultationStep = 
  | 'intro' 
  | 'language' 
  | 'session' 
  | 'upload_optional' 
  | 'review_summary' 
  | 'report_preview' 
  | 'confirmation';

export const AIConsultationPage: React.FC = () => {
  const { t } = useTranslation();
  const { patient } = useAuth();
  const { language: appLang } = useLanguage();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<ConsultationStep>('intro');
  const [selectedLanguage, setSelectedLanguage] = useState<ConsultationLanguage>(appLang === 'hi' ? 'hi' : 'en');
  
  // Voice & Chat State
  const [voiceState, setVoiceState] = useState<VoiceSessionState>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typedInput, setTypedInput] = useState('');
  const [showTypeInput, setShowTypeInput] = useState(false);
  const [stepQuestionIndex, setStepQuestionIndex] = useState(0);

  // Upload modal & documents
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [attachedDocs, setAttachedDocs] = useState<UploadedDocument[]>([]);

  // Review & Report
  const [contextData, setContextData] = useState<CaseTakingContext | null>(null);
  const [reportDraft, setReportDraft] = useState<AIPatientReport | null>(null);
  const [finalizedReport, setFinalizedReport] = useState<AIPatientReport | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, voiceState]);

  // Step 1: Start Session
  const handleStartSession = () => {
    if (!patient) return;
    const ctx = consultationService.initSession(patient, selectedLanguage);
    setContextData(ctx);
    setMessages(ctx.conversationTranscript);
    setStepQuestionIndex(0);
    setCurrentStep('session');
    setVoiceState('ai_speaking');

    // Simulate AI finishing speech after 2s
    setTimeout(() => {
      setVoiceState('idle');
    }, 2200);
  };

  // Trigger Microphone simulation
  const handleMicClick = () => {
    if (voiceState === 'listening') {
      // User tapped stop -> simulate speech recognized
      setVoiceState('processing');
      simulateSpeechRecognition();
    } else {
      // User tapped start -> listen
      setVoiceState('listening');
    }
  };

  // Simulate speech recognition based on conversation step
  const simulateSpeechRecognition = async () => {
    const sampleResponsesEn = [
      "I have had a bad headache and fever for the last 3 days.",
      "The fever comes and goes, and my head throbs especially in the mornings.",
      "I feel mild nausea, eye strain, and general body weakness.",
      "Yes, I took one Paracetamol 650mg tablet yesterday with mild relief.",
    ];

    const sampleResponsesHi = [
      "मुझे पिछले तीन दिनों से बुखार और सिरदर्द हो रहा है।",
      "बुखार कभी कम होता है कभी बढ़ जाता है, और सुबह सिर में तेज दर्द रहता है।",
      "इसके साथ हल्की कमजोरी, आंखों में थकान और बदन दर्द भी है।",
      "हाँ, मैंने कल एक पैरासिटामोल 650mg गोली ली थी जिससे थोड़ी देर आराम मिला।",
    ];

    const responses = selectedLanguage === 'hi' ? sampleResponsesHi : sampleResponsesEn;
    const patientText = responses[stepQuestionIndex % responses.length];

    try {
      const result = await consultationService.processPatientSpeech(patientText, stepQuestionIndex);
      setContextData(result.updatedContext);
      setMessages([...result.updatedContext.conversationTranscript]);
      setStepQuestionIndex(prev => prev + 1);
      setVoiceState('ai_speaking');

      setTimeout(() => {
        setVoiceState('idle');
      }, 2500);
    } catch {
      setVoiceState('error');
    }
  };

  // Text submit fallback
  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;

    const text = typedInput.trim();
    setTypedInput('');
    setVoiceState('processing');

    try {
      const result = await consultationService.processPatientSpeech(text, stepQuestionIndex);
      setContextData(result.updatedContext);
      setMessages([...result.updatedContext.conversationTranscript]);
      setStepQuestionIndex(prev => prev + 1);
      setVoiceState('ai_speaking');

      setTimeout(() => {
        setVoiceState('idle');
      }, 2000);
    } catch {
      setVoiceState('error');
    }
  };

  // Move to Review Summary & Draft
  const handleProceedToSummary = () => {
    if (!patient) return;
    const draft = consultationService.generateReportDraft(patient);
    setReportDraft(draft);
    setCurrentStep('review_summary');
  };

  // Move to Formal Report Preview
  const handleProceedToReportPreview = () => {
    setCurrentStep('report_preview');
  };

  // Finalize & Save Report
  const handleConfirmAndSaveReport = async () => {
    if (!reportDraft) return;
    const finalized = await consultationService.finalizeAndSaveReport(reportDraft);
    setFinalizedReport(finalized);
    setCurrentStep('confirmation');

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Step 1: Intro / Guide Screen */}
      {currentStep === 'intro' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center space-y-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-medical-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-medical-500/25">
            <Bot className="w-12 h-12" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-medical-700 bg-medical-50 px-3 py-1 rounded-full border border-medical-200">
              Module 2 • AI Case-Taking Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('consultation.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('consultation.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
            {[
              { title: 'Natural Voice', desc: t('consultation.step1'), icon: Mic },
              { title: 'Adaptive Questions', desc: t('consultation.step2'), icon: Sparkles },
              { title: 'Document OCR', desc: t('consultation.step3'), icon: UploadCloud },
              { title: 'Physician Report', desc: t('consultation.step4'), icon: FileText },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-medical-100 text-medical-700 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs">{feature.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Clinical Safety Notice */}
          <div className="max-w-2xl mx-auto p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-3 text-left">
            <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Clinical Case-Taking & Safety Architecture</p>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                The AI collects symptom history before doctor consultation. It does not provide autonomous diagnosis or prescribe medicines. Your registered physician remains responsible for examination, diagnosis, and prescription.
              </p>
            </div>
          </div>

          <div>
            <button
              onClick={() => setCurrentStep('language')}
              className="px-8 py-3.5 bg-gradient-to-r from-medical-600 to-teal-600 hover:from-medical-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-medical-500/25 flex items-center gap-2 mx-auto transition-transform active:scale-95"
              id="ai-consultation-start-button"
            >
              <span>{t('consultation.startConsultation')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Language Selection (Matching images/ae386904 Step 2) */}
      {currentStep === 'language' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center space-y-8 max-w-xl mx-auto">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('consultation.chooseLanguage')}
            </h2>
            <p className="text-xs text-slate-500">
              Select the language you feel most comfortable speaking during the voice session
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`p-6 rounded-2xl border-2 text-center transition-all ${
                selectedLanguage === 'en'
                  ? 'border-medical-600 bg-medical-50/60 shadow-md shadow-medical-600/15'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <span className="text-4xl font-black text-medical-600 block mb-2">A</span>
              <span className="text-sm font-bold text-slate-800 block">English</span>
              <span className="text-[11px] text-slate-400">English Voice Mode</span>
            </button>

            <button
              onClick={() => setSelectedLanguage('hi')}
              className={`p-6 rounded-2xl border-2 text-center transition-all ${
                selectedLanguage === 'hi'
                  ? 'border-medical-600 bg-medical-50/60 shadow-md shadow-medical-600/15'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <span className="text-4xl font-black text-teal-600 block mb-2">अ</span>
              <span className="text-sm font-bold text-slate-800 block">हिंदी (Hindi)</span>
              <span className="text-[11px] text-slate-400">हिंदी वॉइस मोड</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep('intro')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {t('common.back')}
            </button>

            <button
              onClick={handleStartSession}
              className="px-6 py-2.5 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              id="ai-language-continue-button"
            >
              <span>{t('common.continue')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Interactive Voice Case-Taking Session (Matching images/ae386904 Step 3 & 4) */}
      {currentStep === 'session' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Voice Interface & Audio Visualizer */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between items-center text-center space-y-6">
            
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800">
                  {selectedLanguage === 'hi' ? 'हिंदी वॉइस सेशन' : 'English Voice Session'}
                </span>
              </div>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="text-xs text-medical-600 hover:text-medical-700 font-semibold flex items-center gap-1 bg-medical-50 px-2.5 py-1 rounded-lg border border-medical-200"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Report</span>
              </button>
            </div>

            {/* Mascot Avatar */}
            <div className="space-y-3">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-medical-500 via-teal-400 to-sky-400 p-1 mx-auto shadow-lg shadow-medical-500/20">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-medical-600">
                  <Bot className="w-12 h-12" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">CarePlus AI Assistant</h3>
                <p className="text-[11px] text-slate-400">Clinical Case-Taking in Progress</p>
              </div>
            </div>

            {/* Realtime Waveform Visualization */}
            <div className="w-full py-2 bg-slate-50/70 rounded-2xl border border-slate-100">
              <VoiceWaveform isActive={voiceState === 'listening' || voiceState === 'ai_speaking'} />
            </div>

            {/* Large Microphone Interaction Button */}
            <div className="py-2">
              <AudioMicButton
                state={voiceState}
                onClick={handleMicClick}
              />
            </div>

            {/* Bottom Actions */}
            <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => setShowTypeInput(!showTypeInput)}
                className="text-slate-500 hover:text-slate-800 font-semibold underline"
              >
                {showTypeInput ? 'Hide Keyboard' : 'Type instead'}
              </button>

              <button
                onClick={handleProceedToSummary}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                id="submit-consultation-button"
              >
                Submit Consultation →
              </button>
            </div>
          </div>

          {/* Right Column: Live Transcript Stream */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[560px]">
            
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-medical-600" />
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Conversation Transcript</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Step {Math.min(stepQuestionIndex + 1, 4)} of 4
              </span>
            </div>

            {/* Transcript Message Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-medical-50 text-medical-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'patient'
                        ? 'bg-medical-600 text-white rounded-tr-xs'
                        : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`block text-[10px] mt-1 text-right ${
                        msg.sender === 'patient' ? 'text-medical-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {voiceState === 'processing' && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic pl-10">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping"></span>
                  AI is analyzing your clinical response...
                </div>
              )}

              <div ref={transcriptEndRef} />
            </div>

            {/* Attached Documents strip */}
            {attachedDocs.length > 0 && (
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
                <span className="text-slate-400 font-bold text-[10px] uppercase">Attached:</span>
                {attachedDocs.map(doc => (
                  <span key={doc.id} className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold text-[11px] whitespace-nowrap">
                    {doc.fileName}
                  </span>
                ))}
              </div>
            )}

            {/* Optional Typed Message Input */}
            {showTypeInput && (
              <form onSubmit={handleTextSubmit} className="p-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={typedInput}
                  onChange={e => setTypedInput(e.target.value)}
                  placeholder="Type your medical complaint or reply here..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-medical-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-medical-600 text-white hover:bg-medical-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>

        </div>
      )}

      {/* Step 4: Review Summary (Matching images/ae386904 Step 6) */}
      {currentStep === 'review_summary' && reportDraft && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Review & Edit
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                {t('consultation.reviewSummary')}
              </h2>
              <p className="text-xs text-slate-500">
                Verify the symptoms and details captured by AI before generating the formal report
              </p>
            </div>

            <button
              onClick={() => setIsEditingDraft(!isEditingDraft)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingDraft ? 'Done Editing' : 'Edit Information'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Chief Complaint & HPI */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">Symptoms & History</h3>

              <div>
                <span className="text-slate-400 font-bold block">Chief Complaint</span>
                {isEditingDraft ? (
                  <input
                    type="text"
                    value={reportDraft.chiefComplaint}
                    onChange={e => setReportDraft({ ...reportDraft, chiefComplaint: e.target.value })}
                    className="mt-1 w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                  />
                ) : (
                  <p className="font-bold text-slate-900 mt-0.5">{reportDraft.chiefComplaint}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-bold block">Duration</span>
                  {isEditingDraft ? (
                    <input
                      type="text"
                      value={reportDraft.historyOfPresentIllness.duration}
                      onChange={e => setReportDraft({
                        ...reportDraft,
                        historyOfPresentIllness: { ...reportDraft.historyOfPresentIllness, duration: e.target.value }
                      })}
                      className="mt-1 w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                    />
                  ) : (
                    <p className="font-semibold text-slate-800 mt-0.5">{reportDraft.historyOfPresentIllness.duration}</p>
                  )}
                </div>

                <div>
                  <span className="text-slate-400 font-bold block">Severity</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{reportDraft.historyOfPresentIllness.severity}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold block">Associated Symptoms</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {reportDraft.historyOfPresentIllness.associatedSymptoms.join(', ')}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-bold block">Medicines Already Taken</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {reportDraft.medicationHistory.medicinesTaken.join(', ')}
                </p>
              </div>
            </div>

            {/* Extracted Document Information & Vitals */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-800 text-sm">Patient Snapshot</h3>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <p><span className="text-slate-400">Name:</span> {reportDraft.patientSnapshot.fullName}</p>
                  <p><span className="text-slate-400">Age/Gender:</span> {reportDraft.patientSnapshot.age}y / {reportDraft.patientSnapshot.gender}</p>
                  <p><span className="text-slate-400">Height:</span> {reportDraft.patientSnapshot.height} cm</p>
                  <p><span className="text-slate-400">Weight:</span> {reportDraft.patientSnapshot.weight} kg</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-emerald-950 text-xs">Attached Medical Documents</h3>
                  <button
                    onClick={() => setUploadModalOpen(true)}
                    className="text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    + Add Document
                  </button>
                </div>
                {attachedDocs.length === 0 ? (
                  <p className="text-slate-500 italic text-[11px]">No prior records attached.</p>
                ) : (
                  <div className="space-y-1">
                    {attachedDocs.map(doc => (
                      <div key={doc.id} className="p-2 bg-white rounded-lg border border-emerald-100 flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{doc.fileName}</span>
                        <span className="text-emerald-700 font-bold text-[10px]">{doc.category}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep('session')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Back to Conversation
            </button>

            <button
              onClick={handleProceedToReportPreview}
              className="px-6 py-2.5 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <span>View Generated Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Report Document Preview & Confirmation */}
      {currentStep === 'report_preview' && reportDraft && (
        <div className="space-y-4">
          <ReportDocumentView
            report={reportDraft}
            isDraft={true}
            onEdit={() => setCurrentStep('review_summary')}
            onConfirm={handleConfirmAndSaveReport}
          />
        </div>
      )}

      {/* Step 6: Confirmation & Success Screen (Matching images/ae386904 Step 8) */}
      {currentStep === 'confirmation' && (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-xl text-center space-y-6 max-w-lg mx-auto animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">
              {t('consultation.reportSavedTitle')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('consultation.reportSavedSubtitle')}
            </p>
          </div>

          {finalizedReport && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Report Number:</span>
                <span className="font-mono font-bold text-slate-800">{finalizedReport.reportNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Consultation Date:</span>
                <span className="font-semibold text-slate-800">{finalizedReport.consultationDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Format:</span>
                <span className="font-semibold text-slate-800">Physician-Ready PDF</span>
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => navigate('/reports')}
              className="px-6 py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs rounded-xl shadow-md shadow-medical-600/20 flex items-center justify-center gap-2"
              id="view-saved-report-cta"
            >
              <span>{t('consultation.viewReport')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCurrentStep('intro');
                setMessages([]);
                setReportDraft(null);
              }}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
            >
              <span>{t('consultation.startNew')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Document Upload Modal Component */}
      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onDocumentAdded={doc => {
          setAttachedDocs(prev => [...prev, doc]);
        }}
      />

    </div>
  );
};
