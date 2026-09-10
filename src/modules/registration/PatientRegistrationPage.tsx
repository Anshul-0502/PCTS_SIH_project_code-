import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  HeartPulse, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Droplet, 
  Ruler, 
  Weight, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { patientService } from '../../services/patient.service';
import { useAuth } from '../../store/AuthContext';
import { PatientRegistrationFormValues, BloodGroup, Gender } from '../../types/patient';
import { EmergencyBanner } from '../../components/common/EmergencyBanner';

export const PatientRegistrationPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updateCurrentPatient } = useAuth();

  const [formData, setFormData] = useState<PatientRegistrationFormValues>({
    fullName: '',
    dob: '',
    gender: 'Male',
    mobile: '',
    email: '',
    address: '',
    bloodGroup: undefined,
    height: 170,
    weight: 65,
    existingDiseases: [],
    otherDiseaseDetails: '',
    agreeToTerms: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState<any | null>(null);

  const diseaseOptions = [
    { id: 'Diabetes', label: t('registration.diabetes') },
    { id: 'Hypertension', label: t('registration.hypertension') },
    { id: 'Asthma', label: t('registration.asthma') },
    { id: 'Thyroid Disorder', label: t('registration.thyroid') },
    { id: 'Heart Disease', label: t('registration.heartDisease') },
    { id: 'Other', label: t('registration.otherCondition') },
    { id: 'None', label: t('registration.none') },
  ];

  const handleDiseaseToggle = (diseaseId: string) => {
    if (diseaseId === 'None') {
      setFormData(prev => ({
        ...prev,
        existingDiseases: prev.existingDiseases.includes('None') ? [] : ['None'],
        otherDiseaseDetails: '',
      }));
      return;
    }

    setFormData(prev => {
      let updated = prev.existingDiseases.filter(d => d !== 'None');
      if (updated.includes(diseaseId)) {
        updated = updated.filter(d => d !== diseaseId);
      } else {
        updated.push(diseaseId);
      }
      return { ...prev, existingDiseases: updated };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters.';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required.';
    } else {
      const birth = new Date(formData.dob);
      if (birth > new Date()) {
        newErrors.dob = 'Date of birth cannot be in the future.';
      }
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile Number is required for OTP and clinical alerts.';
    } else if (!/^[0-9+ -]{10,14}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Residential Address is required.';
    }

    if (!formData.height || Number(formData.height) <= 30 || Number(formData.height) > 260) {
      newErrors.height = 'Please enter a valid height between 30 and 260 cm.';
    }

    if (!formData.weight || Number(formData.weight) <= 2 || Number(formData.weight) > 350) {
      newErrors.weight = 'Please enter a valid weight in kg.';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must accept the terms to proceed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const patient = await patientService.registerPatient(formData);
      updateCurrentPatient(patient);
      setRegisteredSuccess(patient);
    } catch {
      setErrors({ form: 'Registration failed. Please verify your details and try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Quick fill demo button
  const handlePrefillDemo = () => {
    setFormData({
      fullName: 'Ravi Kumar',
      dob: '1990-08-15',
      gender: 'Male',
      mobile: '+91 98765 43210',
      email: 'ravi.kumar@example.com',
      address: 'Flat 402, Shanti Kunj Apartments, Sector 12, Dwarka, New Delhi - 110078',
      bloodGroup: 'B+',
      height: 172,
      weight: 68,
      existingDiseases: ['Hypertension'],
      otherDiseaseDetails: '',
      agreeToTerms: true,
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <EmergencyBanner />

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2 text-slate-900 font-extrabold text-lg">
            <div className="w-8 h-8 rounded-lg bg-medical-600 text-white flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span>CarePlus • {t('registration.title')}</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrefillDemo}
              className="text-xs bg-medical-50 text-medical-700 hover:bg-medical-100 font-bold px-3 py-1.5 rounded-lg border border-medical-200 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-medical-600" />
              <span>Autofill Sample Data</span>
            </button>
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-600 hover:text-medical-600"
            >
              Already registered? Sign In
            </Link>
          </div>
        </div>

        {/* Success Modal / State */}
        {registeredSuccess ? (
          <div className="my-12 p-8 bg-white rounded-3xl border border-emerald-200 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900">
                {t('registration.successTitle')}
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {t('registration.successSubtitle')}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Patient ID:</span>
                <span className="font-mono font-bold text-slate-900">{registeredSuccess.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Full Name:</span>
                <span className="font-bold text-slate-900">{registeredSuccess.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Mobile Number:</span>
                <span className="font-semibold text-slate-900">{registeredSuccess.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Clinical Profile:</span>
                <span className="text-emerald-700 font-bold">Baseline Profile Active</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs rounded-xl shadow-md shadow-medical-600/25 flex items-center gap-2 transition-all"
                id="registration-go-to-dashboard-button"
              >
                <span>{t('registration.goToDashboard')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/consultation')}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/25 flex items-center gap-2 transition-all"
              >
                <span>Start AI Consultation Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="my-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-medical-700 bg-medical-50 px-2.5 py-1 rounded-full border border-medical-200">
                Module 1 • Patient Intake
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {t('registration.title')}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {t('registration.subtitle')}
              </p>
            </div>

            {errors.form && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" id="patient-registration-form">
              
              {/* Personal Details */}
              <div className="space-y-4">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
                  1. Personal Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('registration.fullName')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder={t('registration.fullNamePlaceholder')}
                        className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-900 focus:bg-white focus:ring-2 ${
                          errors.fullName ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-medical-500'
                        }`}
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                    {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('registration.dob')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={e => setFormData({ ...formData, dob: e.target.value })}
                        className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-900 focus:bg-white focus:ring-2 ${
                          errors.dob ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-medical-500'
                        }`}
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                    {errors.dob && <p className="text-[11px] text-red-600 mt-1">{errors.dob}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('registration.gender')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value as Gender })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-medical-500"
                    >
                      <option value="Male">{t('registration.male')}</option>
                      <option value="Female">{t('registration.female')}</option>
                      <option value="Other">{t('registration.other')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('registration.mobile')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="+91 98765 43210"
                        className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-900 focus:bg-white focus:ring-2 ${
                          errors.mobile ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-medical-500'
                        }`}
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                    {errors.mobile && <p className="text-[11px] text-red-600 mt-1">{errors.mobile}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('registration.email')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t('registration.emailPlaceholder')}
                        className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-900 focus:bg-white focus:ring-2 ${
                          errors.email ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-medical-500'
                        }`}
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                    {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('registration.address')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      rows={2}
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder={t('registration.addressPlaceholder')}
                      className={`w-full bg-slate-50 border rounded-xl p-3 pl-9 text-xs text-slate-900 focus:bg-white focus:ring-2 ${
                        errors.address ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-medical-500'
                      }`}
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                  {errors.address && <p className="text-[11px] text-red-600 mt-1">{errors.address}</p>}
                </div>
              </div>

              {/* Basic Health Vitals */}
              <div className="space-y-4">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
                  2. Basic Health Parameters
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('registration.bloodGroup')}
                    </label>
                    <div className="relative">
                      <select
                        value={formData.bloodGroup || ''}
                        onChange={e => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pl-9 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-medical-500"
                      >
                        <option value="">{t('registration.selectBloodGroup')}</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                      <Droplet className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('registration.height')} (cm) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="30"
                        max="260"
                        value={formData.height}
                        onChange={e => setFormData({ ...formData, height: Number(e.target.value) })}
                        className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-900 focus:bg-white focus:ring-2 ${
                          errors.height ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-medical-500'
                        }`}
                      />
                      <Ruler className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                    {errors.height && <p className="text-[11px] text-red-600 mt-1">{errors.height}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('registration.weight')} (kg) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="2"
                        max="350"
                        value={formData.weight}
                        onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
                        className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-900 focus:bg-white focus:ring-2 ${
                          errors.weight ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-medical-500'
                        }`}
                      />
                      <Weight className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                    {errors.weight && <p className="text-[11px] text-red-600 mt-1">{errors.weight}</p>}
                  </div>
                </div>
              </div>

              {/* Existing Diseases Selection Group */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    3. {t('registration.existingDiseases')}
                  </h2>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {t('registration.existingDiseasesHelp')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {diseaseOptions.map(opt => {
                    const isSelected = formData.existingDiseases.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleDiseaseToggle(opt.id)}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-medical-600 bg-medical-50 text-medical-800 shadow-2xs font-bold'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-medical-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {formData.existingDiseases.includes('Other') && (
                  <div className="pt-2 animate-in fade-in">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('registration.specifyOther')}
                    </label>
                    <input
                      type="text"
                      value={formData.otherDiseaseDetails}
                      onChange={e => setFormData({ ...formData, otherDiseaseDetails: e.target.value })}
                      placeholder="e.g. Chronic Migraine, Rheumatoid Arthritis, PCOD"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-medical-500"
                    />
                  </div>
                )}
              </div>

              {/* Notice that symptoms are NOT collected here */}
              <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-2xl flex items-start gap-3 text-xs text-sky-800">
                <ShieldCheck className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Clinical Intake Rule:</strong> Current active symptoms, detailed medicine history, and health complaints will be gathered naturally during your <strong>AI Consultation</strong> in Hindi or English.
                </p>
              </div>

              {/* Terms and Consent */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={e => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-medical-600 focus:ring-medical-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-600">
                    {t('registration.agreeTerms')}
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.agreeToTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                id="patient-register-submit-button"
                className="w-full py-3.5 bg-gradient-to-r from-medical-600 to-teal-600 hover:from-medical-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-medical-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                {loading ? 'Creating Patient Account...' : t('registration.registerButton')}
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>
        )}
      </div>
    </div>
  );
};
