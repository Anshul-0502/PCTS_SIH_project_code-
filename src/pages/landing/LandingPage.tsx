import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  Bot, 
  FileText, 
  Calendar, 
  Pill, 
  FlaskConical, 
  PhoneCall, 
  ShieldCheck, 
  ArrowRight, 
  Globe2, 
  Building2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EmergencyBanner } from '../../components/common/EmergencyBanner';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { mockHospitalInfo } from '../../mocks/hospitalInfo';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <EmergencyBanner />

      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-medical-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-medical-500/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">CarePlus</span>
                <span className="text-[10px] bg-medical-50 text-medical-700 font-bold px-1.5 py-0.5 rounded border border-medical-200">
                  AIIA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                Ministry of Ayush • Govt. of India
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <Link
              to="/login"
              className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-medical-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 text-xs font-bold text-white bg-medical-600 hover:bg-medical-700 rounded-xl shadow-xs transition-colors"
            >
              Register Now
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-medical-50/60 via-white to-slate-50 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-medical-100/70 border border-medical-200 text-medical-800 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-medical-600" />
                <span>Smart India Hackathon • Problem Statement 26047</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Better Healthcare <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-medical-600 to-teal-600 bg-clip-text text-transparent">
                  Starts with You.
                </span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                An AI-assisted clinical case-taking system that collects patient medical history in Hindi or English, digitizes prior reports, and delivers a structured physician-ready report to optimize clinical care at the <strong>All India Institute of Ayurveda</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="px-6 py-3.5 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold text-sm shadow-md shadow-medical-500/25 flex items-center gap-2 transition-transform active:scale-95"
                  id="landing-register-cta"
                >
                  <span>New Patient Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/dashboard"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-2xs flex items-center gap-2 transition-colors"
                >
                  <span>Open Patient Dashboard</span>
                </Link>

                <Link
                  to="/admin/login"
                  className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Hospital Admin Sign In</span>
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Voice-First AI Case-Taking</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Hindi & English Consultation</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Doctor Remains in Control</span>
                </div>
              </div>
            </div>

            {/* Right Card Mockup Graphic */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-medical-50 text-medical-600 flex items-center justify-center font-bold text-xs">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">AI Consultation Assistant</p>
                      <p className="text-[10px] text-slate-500">Live Clinical Case-Taking</p>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Voice Active
                  </span>
                </div>

                <div className="p-3 bg-medical-50/60 rounded-xl border border-medical-100 space-y-1.5">
                  <p className="text-[11px] font-bold text-medical-900">AI Assistant:</p>
                  <p className="text-xs text-slate-700">
                    "Hello! What health problem are you facing today?"
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 ml-4">
                  <p className="text-[11px] font-bold text-slate-900">Patient (Voice Response):</p>
                  <p className="text-xs text-slate-700">
                    "I have had intermittent fever and mild cough for the last 3 days."
                  </p>
                </div>

                <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 space-y-1.5">
                  <p className="text-[11px] font-bold text-teal-900">Dynamic AI Follow-Up:</p>
                  <p className="text-xs text-slate-700">
                    "When did the fever first peak, and did you experience any breathlessness?"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Physician-Ready Summary</span>
                  <span className="text-medical-600 font-bold">Auto-Structured PDF</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9 Approved Modules Overview Grid */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Complete 9-Module Healthcare Architecture
            </h2>
            <p className="text-slate-600 text-sm">
              Approved Smart India Hackathon system design connecting patients, clinical case-taking, hospital departments, and administration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: '1', title: 'Module 1: Patient Registration', desc: 'Demographic and baseline vitals profiling matching standard OPD intake format.', icon: HeartPulse, link: '/register' },
              { id: '2', title: 'Module 2: AI Consultation (Core)', desc: 'Adaptive voice assistant dynamically collecting symptoms in Hindi & English.', icon: Bot, link: '/consultation', core: true },
              { id: '3', title: 'Module 3: My Report History', desc: 'Secure repository for immutable physician-ready PDF reports, search, and sharing.', icon: FileText, link: '/reports' },
              { id: '4', title: 'Module 4: Notification Center', desc: 'Real-time alerts for appointments, medicine reminders, reports, and hospital news.', icon: HeartPulse, link: '/notifications' },
              { id: '5', title: 'Module 5: My Profile & Settings', desc: 'Manage health vitals, emergency contacts, profile photo, and privacy consents.', icon: ShieldCheck, link: '/profile' },
              { id: '6', title: 'Module 6: Multi-Language Support', desc: 'Native Hindi and English UI translation and voice recognition infrastructure.', icon: Globe2, link: '/language' },
              { id: '7', title: 'Module 7: Help & Support', desc: 'Searchable FAQ accordion, step-by-step guides, feedback, and issue reporting.', icon: ShieldCheck, link: '/help' },
              { id: '8', title: 'Module 8: Hospital Services', desc: '7 integrated services: Appointments, Pharmacy, Lab Tests, Ambulance & Directory.', icon: Calendar, link: '/hospital-services' },
              { id: '9', title: 'Module 9: Hospital Admin Portal', desc: 'Operational dashboard for patient records, doctor scheduling, and inventory CRUD.', icon: Building2, link: '/admin/dashboard' },
            ].map(mod => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.id}
                  to={mod.link}
                  className={`p-6 rounded-2xl border transition-all hover:shadow-md ${
                    mod.core
                      ? 'border-medical-400 bg-gradient-to-b from-medical-50/50 to-white shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      mod.core ? 'bg-medical-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {mod.core && (
                      <span className="text-[10px] uppercase tracking-wider font-extrabold bg-medical-100 text-medical-800 px-2 py-0.5 rounded-full">
                        Core Module
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{mod.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{mod.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-bold text-sm">Patient Case-Taking Software (CarePlus)</p>
            <p className="text-slate-400 text-xs mt-0.5">
              Ministry of Ayush • All India Institute of Ayurveda (AIIA) • Problem Statement 26047
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/help" className="hover:text-white transition-colors">Help & FAQ</Link>
            <span>•</span>
            <Link to="/hospital-services?tab=contact" className="hover:text-white transition-colors">Contact & Location</Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-white transition-colors">Staff Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
