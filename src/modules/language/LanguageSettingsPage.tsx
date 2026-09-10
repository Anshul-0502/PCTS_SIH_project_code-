import React from 'react';
import { Globe2, Mic, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage, AppLanguage } from '../../store/LanguageContext';

export const LanguageSettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { language, voiceLanguage, changeLanguage, changeVoiceLanguage } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-medical-700 bg-medical-50 px-2.5 py-0.5 rounded-full border border-medical-200">
          Module 6 • Multi-Language Support
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          {t('nav.multiLanguage')}
        </h1>
        <p className="text-xs text-slate-500">
          Configure interface translation and voice speech recognition languages for clinical consultations
        </p>
      </div>

      {/* Section 1: Interface UI Language Selection */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <Globe2 className="w-5 h-5 text-medical-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Interface Display Language</h3>
            <p className="text-xs text-slate-500">Choose the language used across menus, buttons, forms, and clinical notices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => changeLanguage('en')}
            className={`p-5 rounded-2xl border-2 text-left flex items-start justify-between transition-all ${
              language === 'en'
                ? 'border-medical-600 bg-medical-50/60 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="space-y-1">
              <span className="w-8 h-8 rounded-lg bg-medical-100 text-medical-800 font-extrabold text-sm flex items-center justify-center">
                A
              </span>
              <h4 className="font-bold text-slate-900 text-sm pt-2">English</h4>
              <p className="text-xs text-slate-500">Standard English UI terminology and clinical labels</p>
            </div>
            {language === 'en' && <CheckCircle2 className="w-5 h-5 text-medical-600" />}
          </button>

          <button
            onClick={() => changeLanguage('hi')}
            className={`p-5 rounded-2xl border-2 text-left flex items-start justify-between transition-all ${
              language === 'hi'
                ? 'border-medical-600 bg-medical-50/60 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="space-y-1">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-extrabold text-sm flex items-center justify-center">
                अ
              </span>
              <h4 className="font-bold text-slate-900 text-sm pt-2">हिंदी (Hindi)</h4>
              <p className="text-xs text-slate-500">पूर्ण हिंदी इंटरफ़ेस और सहज मार्गदर्शन</p>
            </div>
            {language === 'hi' && <CheckCircle2 className="w-5 h-5 text-medical-600" />}
          </button>
        </div>
      </div>

      {/* Section 2: AI Voice Consultation Speech Language */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <Mic className="w-5 h-5 text-teal-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">AI Voice Consultation Language</h3>
            <p className="text-xs text-slate-500">Preferred spoken language for natural voice interaction and AI question responses</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => changeVoiceLanguage('en')}
            className={`p-5 rounded-2xl border-2 text-left flex items-start justify-between transition-all ${
              voiceLanguage === 'en'
                ? 'border-teal-600 bg-teal-50/60 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">English Voice Engine</h4>
              <p className="text-xs text-slate-500">Faster-Whisper English speech recognition model</p>
            </div>
            {voiceLanguage === 'en' && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
          </button>

          <button
            onClick={() => changeVoiceLanguage('hi')}
            className={`p-5 rounded-2xl border-2 text-left flex items-start justify-between transition-all ${
              voiceLanguage === 'hi'
                ? 'border-teal-600 bg-teal-50/60 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">हिंदी वॉइस मॉडल (Hindi Voice Engine)</h4>
              <p className="text-xs text-slate-500">हिंदी भाषण पहचान एवं प्रामाणिक उच्चारण</p>
            </div>
            {voiceLanguage === 'hi' && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
          </button>
        </div>
      </div>

      {/* Section 3: Clinical Translation Rules & Accuracy Policy */}
      <div className="p-5 bg-sky-50 border border-sky-100 rounded-3xl space-y-2 text-xs text-sky-950">
        <div className="flex items-center gap-2 font-bold text-sky-900">
          <ShieldCheck className="w-5 h-5 text-sky-600" />
          <span>Medical Translation Preservation Standards</span>
        </div>
        <p className="text-sky-800 leading-relaxed text-xs">
          To guarantee clinical safety, standardized drug nomenclature (e.g., Telmisartan, Paracetamol), doctor credentials, laboratory reference units (e.g., mg/dL, g/dL), and hospital department IDs are strictly preserved without erroneous literal translations.
        </p>
      </div>

    </div>
  );
};
