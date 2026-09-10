import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Calendar, 
  FileText, 
  Pill, 
  FlaskConical, 
  PhoneCall, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Activity
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useNotifications } from '../../store/NotificationContext';
import { reportService } from '../../services/reports.service';
import { hospitalService } from '../../services/hospital.service';
import { AIPatientReport } from '../../types/report';
import { AppointmentBooking } from '../../types/hospital';

export const PatientDashboardPage: React.FC = () => {
  const { patient } = useAuth();
  const { notifications } = useNotifications();

  const [recentReports, setRecentReports] = useState<AIPatientReport[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentBooking[]>([]);

  useEffect(() => {
    reportService.getReports(patient?.id).then(list => setRecentReports(list.slice(0, 2)));
    hospitalService.getAppointments(patient?.id).then(list => {
      setUpcomingAppointments(list.filter(a => a.status === 'Confirmed').slice(0, 1));
    });
  }, [patient]);

  // Calculate BMI if height and weight available
  const heightM = (patient?.height || 170) / 100;
  const weightKg = patient?.weight || 68;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);

  const activeReminders = notifications.filter(n => n.category === 'medicine' && !n.isRead);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-medical-600 via-medical-700 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-medical-600/15 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-full backdrop-blur-xs">
                AIIA Patient Portal
              </span>
              <span className="text-medical-200 text-xs font-semibold">ID: {patient?.id || 'PAT-2025-0892'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Hello, {patient?.fullName || 'Ravi Kumar'}!
            </h1>
            <p className="text-medical-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Welcome to your personal health hub. Prepare for doctor consultations with our voice-led AI assistant, view your reports, and access digital hospital facilities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/consultation"
              className="bg-white hover:bg-slate-50 text-medical-800 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition-transform active:scale-95 flex items-center gap-2 whitespace-nowrap"
              id="dashboard-start-consultation-cta"
            >
              <Bot className="w-5 h-5 text-medical-600" />
              <span>Start AI Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Active Medicine Alert (if present) */}
      {activeReminders.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">{activeReminders[0].title}</p>
              <p className="text-xs text-amber-700">{activeReminders[0].message}</p>
            </div>
          </div>
          <Link
            to="/notifications"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
          >
            Mark Taken
          </Link>
        </div>
      )}

      {/* Primary Services Grid (Matching images/1bc36694) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
            Quick Health Actions
          </h2>
          <span className="text-xs text-slate-400">All India Institute of Ayurveda</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: AI Consultation */}
          <Link
            to="/consultation"
            className="group p-5 bg-gradient-to-b from-sky-50 to-white rounded-2xl border border-sky-200 hover:border-medical-400 hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-medical-600 text-white flex items-center justify-center shadow-md shadow-medical-500/25 group-hover:scale-105 transition-transform mb-3">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-medical-600 transition-colors">
              AI Consultation
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Describe your symptoms with voice in Hindi or English.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-medical-600">
              <span>Start Now</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Book Appointment */}
          <Link
            to="/hospital-services?tab=appointments"
            className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Book Appointment
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Select department and reserve doctor time slots.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600">
              <span>Find Doctor</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Lab Tests */}
          <Link
            to="/hospital-services?tab=labs"
            className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform mb-3">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Lab Tests
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Schedule diagnostic blood tests and view results.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-600">
              <span>Book Tests</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Hospital Pharmacy */}
          <Link
            to="/hospital-services?tab=pharmacy"
            className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform mb-3">
              <Pill className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Pharmacy Store
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Check medicine stock and order permitted drugs.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-600">
              <span>Browse Medicines</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </div>

      {/* Two Column Layout: Vitals / Profile + Recent Reports & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Patient Demographics & Baseline Vitals */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Your Health Vitals</h3>
              <Link to="/profile" className="text-xs text-medical-600 font-bold hover:underline">
                Edit
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Height</span>
                <p className="text-base font-extrabold text-slate-800 mt-0.5">{patient?.height || 172} cm</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Weight</span>
                <p className="text-base font-extrabold text-slate-800 mt-0.5">{patient?.weight || 68} kg</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Blood Group</span>
                <p className="text-base font-extrabold text-slate-800 mt-0.5">{patient?.bloodGroup || 'B+'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">BMI</span>
                <p className="text-base font-extrabold text-teal-700 mt-0.5">{bmi} (Normal)</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Existing Conditions</span>
              <div className="flex flex-wrap gap-1.5">
                {patient?.existingDiseases && patient.existingDiseases.length > 0 ? (
                  patient.existingDiseases.map((d, i) => (
                    <span key={i} className="bg-medical-50 text-medical-800 font-bold text-xs px-2.5 py-1 rounded-lg border border-medical-200">
                      {d}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">None reported</span>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Ambulance Card */}
          <div className="bg-gradient-to-tr from-red-600 to-rose-700 rounded-3xl p-6 text-white shadow-md shadow-red-600/20 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm">
              <PhoneCall className="w-5 h-5 text-red-200" />
              <span>Need Immediate Ambulance?</span>
            </div>
            <p className="text-xs text-red-100 leading-relaxed">
              Direct emergency dispatch without waiting for consultation or triage forms.
            </p>
            <Link
              to="/hospital-services?tab=ambulance"
              className="mt-2 w-full block text-center bg-white hover:bg-red-50 text-red-700 font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors"
            >
              1-Click Ambulance Dispatch
            </Link>
          </div>
        </div>

        {/* Right Column: Upcoming Schedule & Recent Reports */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Upcoming Appointment */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Next Scheduled Appointment</h3>
              </div>
              <Link to="/hospital-services?tab=appointments" className="text-xs text-emerald-600 font-bold hover:underline">
                View All
              </Link>
            </div>

            {upcomingAppointments.length > 0 ? (
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {upcomingAppointments[0].departmentName}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{upcomingAppointments[0].doctorName}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{upcomingAppointments[0].appointmentDate} at {upcomingAppointments[0].timeSlot}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/consultation"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap"
                  >
                    Prepare with AI Case-Taking
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No active appointments scheduled. <Link to="/hospital-services?tab=appointments" className="text-medical-600 font-bold hover:underline">Book an appointment</Link>
              </div>
            )}
          </div>

          {/* Recent Reports Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-medical-600" />
                <h3 className="font-bold text-slate-900 text-sm">Recent Clinical Reports</h3>
              </div>
              <Link to="/reports" className="text-xs text-medical-600 font-bold hover:underline">
                View Full History
              </Link>
            </div>

            <div className="space-y-3">
              {recentReports.map(report => (
                <div
                  key={report.id}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-800">{report.reportNumber}</span>
                      <span className="text-[10px] bg-medical-100 text-medical-800 font-semibold px-2 py-0.5 rounded-full">
                        {report.reportType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">{report.chiefComplaint}</p>
                    <p className="text-[10px] text-slate-400">{report.consultationDate} • Status: {report.status}</p>
                  </div>

                  <Link
                    to="/reports"
                    className="flex items-center gap-1 text-xs font-bold text-medical-600 hover:text-medical-700 whitespace-nowrap"
                  >
                    <span>View Report</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
