import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  Bell, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  CheckCircle2, 
  Mic, 
  FileText, 
  Lock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Ruler,
  Weight,
  Droplet
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/AuthContext';
import { patientService } from '../../services/patient.service';
import { PatientProfile, BloodGroup } from '../../types/patient';

export const ProfileSettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { patient, updateCurrentPatient } = useAuth();

  const [activeTab, setActiveTab] = useState<'info' | 'edit' | 'privacy' | 'preferences'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [editForm, setEditForm] = useState<Partial<PatientProfile>>({
    fullName: patient?.fullName || '',
    mobile: patient?.mobile || '',
    email: patient?.email || '',
    address: patient?.address || '',
    height: patient?.height || 172,
    weight: patient?.weight || 68,
    bloodGroup: patient?.bloodGroup || 'B+',
  });

  const [privacyToggles, setPrivacyToggles] = useState({
    shareWithConsultingDoctor: true,
    allowVoiceProcessing: true,
    anonymousResearchConsent: false,
    auditTrailEnabled: true,
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;

    try {
      const updated = await patientService.updatePatientProfile(patient.id, editForm);
      updateCurrentPatient(updated);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      alert('Error updating profile');
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newUrl = URL.createObjectURL(e.target.files[0]);
      if (patient) {
        const updated = { ...patient, avatarUrl: newUrl };
        updateCurrentPatient(updated);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-medical-700 bg-medical-50 px-2.5 py-0.5 rounded-full border border-medical-200">
            Module 5 • Patient Profile & Settings
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            My Profile & Settings
          </h1>
          <p className="text-xs text-slate-500">
            Manage your personal credentials, medical vitals, privacy permissions, and notification preferences
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Updated Successfully</span>
          </div>
        )}
      </div>

      {/* Profile Banner Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        
        {/* Avatar with Upload button */}
        <div className="relative group">
          <img
            src={patient?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
            alt={patient?.fullName}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-medical-50 shadow-md"
          />
          <label
            htmlFor="avatar-file-input"
            className="absolute bottom-1 right-1 p-2 bg-medical-600 hover:bg-medical-700 text-white rounded-xl shadow-md cursor-pointer transition-transform group-hover:scale-105"
            title="Upload profile photo"
          >
            <Camera className="w-3.5 h-3.5" />
            <input
              id="avatar-file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </label>
        </div>

        {/* Profile Details */}
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-black text-slate-900">{patient?.fullName || 'Ravi Kumar'}</h2>
            <span className="bg-medical-100 text-medical-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              ID: {patient?.id || 'PAT-2025-0892'}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">{patient?.email || 'ravi.kumar@example.com'}</p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600">
            <span>Age: <strong>{patient?.age || 34} Years</strong></span>
            <span>•</span>
            <span>Gender: <strong>{patient?.gender || 'Male'}</strong></span>
            <span>•</span>
            <span>Blood Group: <strong>{patient?.bloodGroup || 'B+'}</strong></span>
          </div>
        </div>

        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setActiveTab(isEditing ? 'info' : 'edit');
          }}
          className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        <button
          onClick={() => { setActiveTab('info'); setIsEditing(false); }}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'info'
              ? 'border-medical-600 text-medical-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Information</span>
        </button>

        <button
          onClick={() => { setActiveTab('privacy'); setIsEditing(false); }}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'privacy'
              ? 'border-medical-600 text-medical-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy & Permissions</span>
        </button>
      </div>

      {/* Tab 1: Personal Info View */}
      {activeTab === 'info' && !isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card: Contact Information */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Contact Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-medical-600 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Mobile Number</span>
                  <p className="font-semibold text-slate-800">{patient?.mobile}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-medical-600 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Email Address</span>
                  <p className="font-semibold text-slate-800">{patient?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-medical-600 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Residential Address</span>
                  <p className="font-semibold text-slate-800 leading-relaxed">{patient?.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Physical Vitals & Conditions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Clinical Vitals & History
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Height</span>
                <span className="text-sm font-extrabold text-slate-800">{patient?.height} cm</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Weight</span>
                <span className="text-sm font-extrabold text-slate-800">{patient?.weight} kg</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Blood Group</span>
                <span className="text-sm font-extrabold text-slate-800">{patient?.bloodGroup || 'Not Provided'}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">
                Existing Medical Conditions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {patient?.existingDiseases && patient.existingDiseases.length > 0 ? (
                  patient.existingDiseases.map((cond, i) => (
                    <span key={i} className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-lg">
                      {cond}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">None reported</span>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Edit Profile Form */}
      {(activeTab === 'edit' || isEditing) && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Update Permitted Profile Information</h3>
            <p className="text-xs text-slate-500">Historical finalized medical records will not be altered by profile changes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={editForm.fullName}
                onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-medical-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={editForm.mobile}
                onChange={e => setEditForm({ ...editForm, mobile: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-medical-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={editForm.email}
                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-medical-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
              <select
                value={editForm.bloodGroup || ''}
                onChange={e => setEditForm({ ...editForm, bloodGroup: e.target.value as BloodGroup })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-medical-500"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Height (cm)</label>
              <input
                type="number"
                value={editForm.height}
                onChange={e => setEditForm({ ...editForm, height: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-medical-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={editForm.weight}
                onChange={e => setEditForm({ ...editForm, weight: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-medical-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address</label>
            <textarea
              rows={2}
              value={editForm.address}
              onChange={e => setEditForm({ ...editForm, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-medical-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { setIsEditing(false); setActiveTab('info'); }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Privacy & Permissions */}
      {activeTab === 'privacy' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Patient Privacy & Clinical Data Consent</h3>
            <p className="text-xs text-slate-500">
              Control which doctors and hospital units can access your digitized case history.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {[
              {
                key: 'shareWithConsultingDoctor',
                title: 'Share Case History with Consulting Doctor',
                desc: 'Permits attending physician to review your AI structured case-taking summary prior to consultation.',
              },
              {
                key: 'allowVoiceProcessing',
                title: 'Microphone & Voice Processing Consent',
                desc: 'Permits the browser to capture voice audio during AI consultation for Speech-to-Text conversion.',
              },
              {
                key: 'anonymousResearchConsent',
                title: 'Ayush Research Data Contribution (De-identified)',
                desc: 'Allow anonymized health symptoms to be analyzed for Ayurvedic public health research.',
              },
              {
                key: 'auditTrailEnabled',
                title: 'Electronic Health Record Audit Logging',
                desc: 'Logs timestamps of whenever an authorized hospital staff member opens your clinical report.',
              },
            ].map(item => (
              <div key={item.key} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 text-xs sm:text-sm">{item.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={(privacyToggles as any)[item.key]}
                    onChange={() => setPrivacyToggles({
                      ...privacyToggles,
                      [item.key]: !(privacyToggles as any)[item.key],
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medical-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
