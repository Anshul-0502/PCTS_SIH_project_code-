import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, Phone, ArrowRight, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { EmergencyBanner } from '../../components/common/EmergencyBanner';

export const PatientLoginPage: React.FC = () => {
  const { loginAsPatient } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('+91 7505801661');
  const [step, setStep] = useState<'identifier' | 'otp'>('identifier');
  const [otp, setOtp] = useState(['4', '8', '2', '9', '1', '6']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your registered mobile number or email.');
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 500);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginAsPatient(identifier);
      navigate('/dashboard');
    } catch {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    await loginAsPatient('+91 7505801661');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <EmergencyBanner />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-8 space-y-6">
          
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-medical-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-medical-500/20 mx-auto">
              <HeartPulse className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Patient Account Access
            </h1>
            <p className="text-xs text-slate-500">
              Sign in to manage consultations, reports, and hospital appointments
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {error}
            </div>
          )}

          {step === 'identifier' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Registered Mobile Number or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-medical-500 focus:border-medical-500 font-medium"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs rounded-xl shadow-md shadow-medical-600/20 flex items-center justify-center gap-2 transition-all"
                id="patient-login-send-otp-button"
              >
                {loading ? 'Sending OTP...' : 'Send 6-Digit OTP'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400 bg-white px-2">
                  Or Quick Access
                </div>
              </div>

              {/* Demo Sign In Button for Hackathon Reviewers */}
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 bg-medical-50 hover:bg-medical-100 text-medical-800 border border-medical-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-medical-600" />
                <span>Instant Demo Login (Ravi Kumar)</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-800">
                  Enter 6-Digit Verification Code
                </p>
                <p className="text-[11px] text-slate-500">
                  Sent to <span className="font-semibold text-slate-800">{identifier}</span>
                </p>
              </div>

              <div className="flex justify-center gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => {
                      const val = e.target.value;
                      const next = [...otp];
                      next[idx] = val;
                      setOtp(next);
                    }}
                    className="w-11 h-12 text-center font-bold text-base bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs rounded-xl shadow-md shadow-medical-600/20 flex items-center justify-center gap-2 transition-all"
                id="patient-login-verify-otp-button"
              >
                {loading ? 'Verifying...' : 'Verify OTP & Enter Dashboard'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('identifier')}
                  className="text-xs text-medical-600 hover:text-medical-700 font-semibold"
                >
                  Change Mobile Number
                </button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-600">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-medical-600 font-bold hover:underline">
                Register as New Patient
              </Link>
            </p>
            <div className="pt-1">
              <Link to="/admin/login" className="text-[11px] text-slate-400 hover:text-indigo-600 transition-colors">
                Hospital Staff / Administration Portal Sign In →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
