import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Users,
  UserCheck,
  Calendar,
  Pill,
  FlaskConical,
  Network,
  Ambulance,
  Megaphone,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Trash2,
  Edit2,
  Send,
  Download,
  ShieldCheck,
  Activity,
  Phone,
  MapPin,
  FileText,
  User,
  HeartPulse,
  TrendingUp,
  SlidersHorizontal,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

import { useAuth } from '../../store/AuthContext';
import { adminService } from '../../services/admin.service';
import { hospitalService } from '../../services/hospital.service';
import {
  OperationalMetrics,
  MonthlyAppointmentStat,
  DepartmentUtilizationStat,
  AuditLogEntry
} from '../../types/admin';
import { Doctor, AppointmentBooking, MedicineItem, LabTestBooking, AmbulanceRequest, DepartmentInfo } from '../../types/hospital';
import { PatientProfile } from '../../types/patient';

type AdminSection = 
  | 'dashboard' 
  | 'patients' 
  | 'doctors' 
  | 'appointments' 
  | 'pharmacy' 
  | 'labs' 
  | 'departments' 
  | 'emergency' 
  | 'notifications' 
  | 'analytics';

export const AdminPortalPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin } = useAuth();

  // Determine section from path
  const getSectionFromPath = (): AdminSection => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/admin/patients')) return 'patients';
    if (path.includes('/admin/doctors')) return 'doctors';
    if (path.includes('/admin/appointments')) return 'appointments';
    if (path.includes('/admin/pharmacy')) return 'pharmacy';
    if (path.includes('/admin/labs')) return 'labs';
    if (path.includes('/admin/departments')) return 'departments';
    if (path.includes('/admin/emergency')) return 'emergency';
    if (path.includes('/admin/notifications')) return 'notifications';
    if (path.includes('/admin/analytics')) return 'analytics';
    return 'dashboard';
  };

  const activeSection = getSectionFromPath();

  const handleTabChange = (section: AdminSection) => {
    navigate(`/admin/${section === 'dashboard' ? 'dashboard' : section}`);
  };

  // State for all 10 areas
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<OperationalMetrics | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyAppointmentStat[]>([]);
  const [deptStats, setDeptStats] = useState<DepartmentUtilizationStat[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<AppointmentBooking[]>([]);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [labs, setLabs] = useState<LabTestBooking[]>([]);
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [ambulances, setAmbulances] = useState<AmbulanceRequest[]>([]);

  // Search & Filter states
  const [patientSearch, setPatientSearch] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorDeptFilter, setDoctorDeptFilter] = useState('All');
  const [appointmentFilter, setAppointmentFilter] = useState<string>('All');
  const [medicineSearch, setMedicineSearch] = useState('');
  const [medicineCategory, setMedicineCategory] = useState('All');
  const [labFilter, setLabFilter] = useState('All');

  // Modals
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [dispatchModalReq, setDispatchModalReq] = useState<AmbulanceRequest | null>(null);
  const [dispatchVehicle, setDispatchVehicle] = useState('DL-01-AY-8822');
  const [dispatchDriver, setDispatchDriver] = useState('Rajesh Sharma');

  // Broadcast Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // New Doctor Form
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    departmentName: 'Kayachikitsa (Internal Medicine)',
    specialization: 'Ayurvedic Physician',
    qualification: 'BAMS, MD (Ayu)',
    experienceYears: 5,
    consultationFee: 300,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    opdTimings: '09:00 AM - 02:00 PM',
    roomNumber: 'OPD-105',
    languages: ['Hindi', 'English'],
    rating: 4.8,
    isAvailable: true,
  });

  // New Medicine Form
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    category: 'Classical Ayurvedic',
    form: 'Tablet' as const,
    stockCount: 100,
    unitPrice: 150,
    dosageInstruction: '1 tablet twice daily with warm water',
    inStock: true,
    requiresPrescription: false,
  });

  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        m,
        ms,
        ds,
        al,
        pts,
        docs,
        apts,
        meds,
        lbs,
        depts,
        ambs
      ] = await Promise.all([
        adminService.getOperationalMetrics(),
        adminService.getMonthlyStats(),
        adminService.getDepartmentStats(),
        adminService.getAuditLogs(),
        adminService.getPatients(),
        adminService.getDoctors(),
        adminService.getAppointments(),
        adminService.getPharmacyInventory(),
        adminService.getLabBookings(),
        hospitalService.getDepartments(),
        adminService.getAmbulanceRequests(),
      ]);

      setMetrics(m);
      setMonthlyStats(ms);
      setDeptStats(ds);
      setAuditLogs(al);
      setPatients(pts);
      setDoctors(docs);
      setAppointments(apts);
      setMedicines(meds);
      setLabs(lbs);
      setDepartments(depts);
      setAmbulances(ambs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // CRUD Handlers
  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor.name.trim()) return;
    try {
      const doctorToSave: Omit<Doctor, 'id'> = {
        name: newDoctor.name,
        departmentId: 'dept-1',
        departmentName: newDoctor.departmentName,
        specialization: newDoctor.specialization,
        qualifications: newDoctor.qualification,
        experienceYears: newDoctor.experienceYears,
        rating: newDoctor.rating,
        workingDays: newDoctor.availableDays,
        timing: newDoctor.opdTimings,
        availableSlotsToday: ['10:00 AM', '11:30 AM', '02:00 PM'],
        isAvailable: newDoctor.isAvailable,
        consultationFee: newDoctor.consultationFee,
        avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
        about: `Consultant in ${newDoctor.departmentName} with ${newDoctor.experienceYears} years of clinical experience.`,
        languages: newDoctor.languages,
        roomNumber: newDoctor.roomNumber,
        opdTimings: newDoctor.opdTimings,
      };
      const added = await adminService.addDoctor(doctorToSave);
      setDoctors(prev => [added, ...prev]);
      setShowAddDoctorModal(false);
      showNotification(`Dr. ${added.name} successfully registered to ${added.departmentName}`);
      setNewDoctor({
        name: '',
        departmentName: 'Kayachikitsa (Internal Medicine)',
        specialization: 'Ayurvedic Physician',
        qualification: 'BAMS, MD (Ayu)',
        experienceYears: 5,
        consultationFee: 300,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        opdTimings: '09:00 AM - 02:00 PM',
        roomNumber: 'OPD-105',
        languages: ['Hindi', 'English'],
        rating: 4.8,
        isAvailable: true,
      });
    } catch (err) {
      alert('Error adding doctor');
    }
  };

  const handleDeleteDoctor = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to deactivate Dr. ${name}?`)) return;
    try {
      await adminService.deleteDoctor(id);
      setDoctors(prev => prev.filter(d => d.id !== id));
      showNotification(`Dr. ${name} deactivated from roster`);
    } catch (err) {
      alert('Error deactivating doctor');
    }
  };

  const handleToggleDoctorAvailability = async (doc: Doctor) => {
    const updated = await adminService.updateDoctor(doc.id, { isAvailable: !doc.isAvailable });
    setDoctors(prev => prev.map(d => (d.id === doc.id ? updated : d)));
    showNotification(`Dr. ${doc.name} status updated to ${updated.isAvailable ? 'Available' : 'Off-Duty'}`);
  };

  const handleUpdateAppointmentStatus = async (id: string, status: AppointmentBooking['status']) => {
    try {
      const updated = await adminService.updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => (a.id === id ? updated : a)));
      showNotification(`Appointment ${id} status marked as "${status}"`);
    } catch (err) {
      alert('Error updating appointment status');
    }
  };

  const handleStockAdjust = async (id: string, currentStock: number, delta: number) => {
    const nextStock = Math.max(0, currentStock + delta);
    try {
      const updated = await adminService.updateMedicineStock(id, nextStock);
      setMedicines(prev => prev.map(m => (m.id === id ? updated : m)));
      showNotification(`${updated.name} stock updated to ${updated.stockCount} units`);
    } catch (err) {
      alert('Error updating stock');
    }
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedicine.name.trim()) return;
    try {
      const medToSave: Omit<MedicineItem, 'id'> = {
        name: newMedicine.name,
        genericName: newMedicine.name,
        category: newMedicine.category,
        strength: '500mg',
        form: newMedicine.form,
        price: newMedicine.unitPrice,
        unitPrice: newMedicine.unitPrice,
        stockCount: newMedicine.stockCount,
        inStock: newMedicine.stockCount > 0,
        requiresPrescription: newMedicine.requiresPrescription,
        manufacturer: 'AIIA Ayurvedic Pharmacy',
        dosageInstructions: newMedicine.dosageInstruction,
        dosageInstruction: newMedicine.dosageInstruction,
      };
      const added = await adminService.addMedicine(medToSave);
      setMedicines(prev => [added, ...prev]);
      setShowAddMedicineModal(false);
      showNotification(`${added.name} successfully cataloged in Pharmacy`);
      setNewMedicine({
        name: '',
        category: 'Classical Ayurvedic',
        form: 'Tablet',
        stockCount: 100,
        unitPrice: 150,
        dosageInstruction: '1 tablet twice daily with warm water',
        inStock: true,
        requiresPrescription: false,
      });
    } catch (err) {
      alert('Error adding medicine');
    }
  };

  const handleUpdateLabStatus = async (id: string, status: LabTestBooking['status']) => {
    try {
      const updated = await adminService.updateLabStatus(id, status);
      setLabs(prev => prev.map(l => (l.id === id ? updated : l)));
      showNotification(`Diagnostic booking ${id} status updated to "${status}"`);
    } catch (err) {
      alert('Error updating lab status');
    }
  };

  const handleDispatchAmbulance = async () => {
    if (!dispatchModalReq) return;
    try {
      const updated = await adminService.updateAmbulanceStatus(
        dispatchModalReq.id,
        'Dispatched',
        dispatchVehicle,
        dispatchDriver
      );
      setAmbulances(prev => prev.map(a => (a.id === dispatchModalReq.id ? updated : a)));
      setDispatchModalReq(null);
      showNotification(`Ambulance ${dispatchVehicle} dispatched with Driver ${dispatchDriver}`);
    } catch (err) {
      alert('Error dispatching ambulance');
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    try {
      await adminService.broadcastAnnouncement(broadcastTitle, broadcastMessage);
      setBroadcastSent(true);
      showNotification('Announcement broadcasted across patient and hospital portals');
      setTimeout(() => {
        setBroadcastTitle('');
        setBroadcastMessage('');
        setBroadcastSent(false);
      }, 2500);
    } catch (err) {
      alert('Error broadcasting announcement');
    }
  };

  // Filtered lists
  const filteredPatients = patients.filter(p => {
    if (!patientSearch) return true;
    const q = patientSearch.toLowerCase();
    const cityMatch = p.city ? p.city.toLowerCase().includes(q) : false;
    return p.fullName.toLowerCase().includes(q) || p.mobile.includes(q) || p.id.toLowerCase().includes(q) || cityMatch;
  });

  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = !doctorSearch || d.name.toLowerCase().includes(doctorSearch.toLowerCase()) || d.specialization.toLowerCase().includes(doctorSearch.toLowerCase());
    const matchesDept = doctorDeptFilter === 'All' || d.departmentName === doctorDeptFilter;
    return matchesSearch && matchesDept;
  });

  const filteredAppointments = appointments.filter(a => {
    if (appointmentFilter === 'All') return true;
    return a.status === appointmentFilter;
  });

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = !medicineSearch || m.name.toLowerCase().includes(medicineSearch.toLowerCase());
    const matchesCat = medicineCategory === 'All' || m.category === medicineCategory;
    return matchesSearch && matchesCat;
  });

  const filteredLabs = labs.filter(l => {
    if (labFilter === 'All') return true;
    return l.status === labFilter;
  });

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-400 text-sm">Loading AIIA Hospital Operational Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast notification banner */}
      {actionNotice && (
        <div className="fixed top-16 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-indigo-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-bold">{actionNotice}</span>
        </div>
      )}

      {/* Admin Subheader & Tab Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Module 9: Hospital Operations
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Systems Online
            </span>
          </div>
          <h1 className="text-2xl font-black text-white capitalize mt-1">
            {activeSection === 'dashboard' ? 'Operational Command Center' : activeSection.replace('-', ' ')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Logged in as: <strong className="text-slate-200">{admin?.name || 'Administrator'}</strong> ({admin?.role || 'Super Admin'}) &bull; All India Institute of Ayurveda
          </p>
        </div>

        {/* Section Quick Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'dashboard'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleTabChange('patients')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'patients'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Patients ({patients.length})
          </button>
          <button
            onClick={() => handleTabChange('doctors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'doctors'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Doctors ({doctors.length})
          </button>
          <button
            onClick={() => handleTabChange('appointments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'appointments'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => handleTabChange('pharmacy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'pharmacy'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Pharmacy
          </button>
          <button
            onClick={() => handleTabChange('labs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'labs'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Diagnostics
          </button>
          <button
            onClick={() => handleTabChange('departments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'departments'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Departments
          </button>
          <button
            onClick={() => handleTabChange('emergency')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'emergency'
                ? 'bg-red-600 text-white shadow'
                : 'bg-slate-800/80 text-red-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Ambulance ({ambulances.filter(a => a.status !== 'Completed').length})
          </button>
          <button
            onClick={() => handleTabChange('notifications')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'notifications'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Broadcast
          </button>
          <button
            onClick={() => handleTabChange('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'analytics'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Analytics & Logs
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. DASHBOARD OVERVIEW SECTION */}
      {/* ======================================================== */}
      {activeSection === 'dashboard' && (
        <div className="space-y-6">
          {/* Key KPI Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold">Registered Patients</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-2xl font-black text-white">{metrics?.totalRegisteredPatients || 1248}</p>
              <p className="text-[10px] text-emerald-400 font-semibold">+14 today</p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold">Active Doctors</span>
                <UserCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white">{metrics?.totalActiveDoctors || 38}</p>
              <p className="text-[10px] text-slate-400 font-semibold">Across 7 Depts</p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold">Today's OPD Slots</span>
                <Calendar className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white">{metrics?.todayAppointments || 42}</p>
              <p className="text-[10px] text-indigo-400 font-semibold">{appointments.length} Total active</p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold">AI Consultations</span>
                <HeartPulse className="w-4 h-4 text-pink-400" />
              </div>
              <p className="text-2xl font-black text-white">{metrics?.totalAIConsultations || 610}</p>
              <p className="text-[10px] text-emerald-400 font-semibold">100% Doctor Reviewed</p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold">Ambulance Calls</span>
                <Ambulance className="w-4 h-4 text-red-400" />
              </div>
              <p className="text-2xl font-black text-red-400">{metrics?.activeAmbulanceRequests || 1}</p>
              <p className="text-[10px] text-red-400 font-semibold">Avg ETA 7 mins</p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold">Pharmacy Alert</span>
                <Pill className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-amber-400">{metrics?.pharmacyLowStockAlerts || 3}</p>
              <p className="text-[10px] text-amber-400 font-semibold">Restock Needed</p>
            </div>
          </div>

          {/* Quick Command Banner */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-800/50 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black text-white">Ayush Hospital Administrative Console</h3>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl">
                Real-time synchronization between the Patient Case-Taking client portal, Department OPD queues, and Central AIIA Clinical Database.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setShowAddDoctorModal(true);
                  handleTabChange('doctors');
                }}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Doctor</span>
              </button>
              <button
                onClick={() => handleTabChange('notifications')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Megaphone className="w-4 h-4 text-amber-400" />
                <span>Broadcast Alert</span>
              </button>
              <button
                onClick={() => handleTabChange('emergency')}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-colors"
              >
                <Ambulance className="w-4 h-4" />
                <span>Emergency Unit</span>
              </button>
            </div>
          </div>

          {/* Recharts Graphical Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Trend Bar Chart */}
            <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    Monthly OPD & AI Consultation Volume (2026)
                  </h3>
                  <p className="text-[11px] text-slate-400">Comparing Doctor In-Person visits vs Pre-OPD AI Case Taking</p>
                </div>
                <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-800/50">
                  Total YTD: 2,420
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="appointments" name="Doctor OPD Visits" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="consultations" name="AI Case Taking Done" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Utilization Pie / Breakdown */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Department Patient Volume
                </h3>
                <p className="text-[11px] text-slate-400">Current active OPD load by Department</p>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deptStats}
                      dataKey="patients"
                      nameKey="department"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={4}
                    >
                      {deptStats.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-700/60 max-h-36 overflow-y-auto">
                {deptStats.map((stat, idx) => (
                  <div key={stat.department} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                      <span className="text-slate-300 font-medium truncate max-w-[140px]">{stat.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{stat.patients}</span>
                      <span className="text-[10px] text-slate-400">({stat.capacityPercent}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Operations Table: Today's Pending Appointments & Live Ambulances */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Appointments */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  Live OPD Queue
                </h3>
                <button
                  onClick={() => handleTabChange('appointments')}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                >
                  Manage All &rarr;
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {appointments.slice(0, 4).map(apt => (
                  <div key={apt.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{apt.patientName}</span>
                        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950 px-1.5 py-0.5 rounded">
                          {apt.tokenNumber || apt.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">Dr. {apt.doctorName} &bull; {apt.appointmentDate} at {apt.appointmentTime}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      apt.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                      apt.status === 'Completed' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live System Activity Feed */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Recent Administrative Audit Log
                </h3>
                <button
                  onClick={() => handleTabChange('analytics')}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                >
                  Full Log &rarr;
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {auditLogs.slice(0, 4).map(log => (
                  <div key={log.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{log.action}</span>
                        <span className="text-[10px] text-slate-400">&bull; {log.userName}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{log.details}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. PATIENT MANAGEMENT SECTION */}
      {/* ======================================================== */}
      {activeSection === 'patients' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={patientSearch}
                onChange={e => setPatientSearch(e.target.value)}
                placeholder="Search patient by full name, phone number, city, or ID..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Showing {filteredPatients.length} of {patients.length} registered patients</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Patient ID</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Age / Gender</th>
                    <th className="py-3 px-4">Contact & Location</th>
                    <th className="py-3 px-4">Blood Group</th>
                    <th className="py-3 px-4">Vitals Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {filteredPatients.map(p => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-300">{p.id}</td>
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 text-xs font-black">
                          {p.fullName.charAt(0)}
                        </div>
                        <span>{p.fullName}</span>
                      </td>
                      <td className="py-3 px-4">{p.age} yrs &bull; {p.gender}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-slate-200">{p.mobile}</span>
                          <span className="text-[11px] text-slate-400">{p.city}, {p.state}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-red-950/60 text-red-300 border border-red-800/40 font-bold text-[10px]">
                          {p.bloodGroup || 'O+'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[11px]">
                          <span className="text-slate-300">BP: {p.bloodPressure || '120/80'}</span> &bull;{' '}
                          <span className="text-slate-300">Pulse: {p.pulse || 72}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedPatient(p)}
                          className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg font-bold text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. DOCTOR MANAGEMENT SECTION */}
      {/* ======================================================== */}
      {activeSection === 'doctors' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={doctorSearch}
                  onChange={e => setDoctorSearch(e.target.value)}
                  placeholder="Search doctor by name, qualification..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={doctorDeptFilter}
                onChange={e => setDoctorDeptFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Doctor</span>
            </button>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map(doc => (
              <div key={doc.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
                        alt={doc.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
                      />
                      <div>
                        <h4 className="font-bold text-white text-sm">Dr. {doc.name}</h4>
                        <p className="text-xs text-indigo-400 font-semibold">{doc.specialization}</p>
                        <p className="text-[11px] text-slate-400">{doc.qualifications}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleDoctorAvailability(doc)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                        doc.isAvailable
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-slate-700 text-slate-400 border-slate-600'
                      }`}
                      title="Click to toggle availability"
                    >
                      {doc.isAvailable ? 'Available' : 'Off-Duty'}
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-700/60 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Department:</span>
                      <span className="font-semibold">{doc.departmentName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">OPD Timings:</span>
                      <span className="font-semibold">{doc.timing || doc.opdTimings || '09:00 AM - 02:00 PM'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Room / Clinic:</span>
                      <span className="font-semibold">{doc.roomNumber || 'OPD-102'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Consultation Fee:</span>
                      <span className="font-bold text-emerald-400">₹{doc.consultationFee}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-700/60">
                  <span className="text-[11px] text-slate-400">
                    Languages: {doc.languages ? doc.languages.join(', ') : 'Hindi, English'}
                  </span>
                  <button
                    onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                    title="Deactivate doctor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. APPOINTMENT MANAGEMENT SECTION */}
      {/* ======================================================== */}
      {activeSection === 'appointments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">Filter Status:</span>
              {['All', 'Confirmed', 'Completed', 'Cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setAppointmentFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    appointmentFilter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400">
              {filteredAppointments.length} Appointments Found
            </span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Token & ID</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Assigned Doctor</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Date & Slot</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {filteredAppointments.map(a => (
                    <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded">
                          {a.tokenNumber || a.id}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white">{a.patientName}</td>
                      <td className="py-3 px-4 font-semibold text-slate-200">Dr. {a.doctorName}</td>
                      <td className="py-3 px-4 text-slate-300">{a.departmentName}</td>
                      <td className="py-3 px-4">
                        <div className="text-[11px]">
                          <span className="text-white font-medium">{a.appointmentDate}</span>
                          <span className="text-slate-400 block">{a.appointmentTime}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          a.status === 'Confirmed'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : a.status === 'Completed'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                            : 'bg-red-500/20 text-red-400 border-red-500/40'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {a.status !== 'Completed' && (
                            <button
                              onClick={() => handleUpdateAppointmentStatus(a.id, 'Completed')}
                              className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded font-bold text-[10px] transition-colors"
                            >
                              Complete
                            </button>
                          )}
                          {a.status !== 'Confirmed' && (
                            <button
                              onClick={() => handleUpdateAppointmentStatus(a.id, 'Confirmed')}
                              className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded font-bold text-[10px] transition-colors"
                            >
                              Confirm
                            </button>
                          )}
                          {a.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleUpdateAppointmentStatus(a.id, 'Cancelled')}
                              className="px-2 py-1 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded font-bold text-[10px] transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. PHARMACY MANAGEMENT SECTION */}
      {/* ======================================================== */}
      {activeSection === 'pharmacy' && (
        <div className="space-y-4">
          {/* Low Stock Warning Header */}
          {medicines.some(m => m.stockCount < 20) && (
            <div className="bg-amber-950/40 border border-amber-800/60 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-200">Aushadhi Inventory Replenishment Alert</h4>
                  <p className="text-[11px] text-amber-300/80">
                    Several classical Ayurvedic formulations are currently below the hospital reorder threshold (&lt;20 units).
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-900/60 text-amber-300 border border-amber-700">
                Action Required
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={medicineSearch}
                  onChange={e => setMedicineSearch(e.target.value)}
                  placeholder="Search medicine name, formulation..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={medicineCategory}
                onChange={e => setMedicineCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Categories</option>
                <option value="Classical Ayurvedic">Classical Ayurvedic</option>
                <option value="Proprietary Ayurvedic">Proprietary Ayurvedic</option>
                <option value="Modern Emergency Medicine">Modern Emergency</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddMedicineModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Medicine</span>
            </button>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Medicine Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Form</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Unit Price</th>
                    <th className="py-3 px-4">Prescription Required</th>
                    <th className="py-3 px-4 text-right">Quick Stock Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {filteredMedicines.map(m => (
                    <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{m.name}</td>
                      <td className="py-3 px-4">
                        <span className="text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded text-[10px] font-semibold border border-indigo-800/40">
                          {m.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{m.form}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                          m.stockCount === 0
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : m.stockCount < 20
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          {m.stockCount} units
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-200">₹{m.unitPrice}</td>
                      <td className="py-3 px-4">
                        {m.requiresPrescription ? (
                          <span className="text-amber-400 font-semibold text-[10px]">Yes (Rx)</span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">No (OTC)</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleStockAdjust(m.id, m.stockCount, -10)}
                            className="w-7 h-7 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold flex items-center justify-center text-xs transition-colors"
                            title="Decrease 10 units"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => handleStockAdjust(m.id, m.stockCount, 25)}
                            className="px-2.5 h-7 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded font-bold flex items-center justify-center text-xs transition-colors"
                            title="Restock 25 units"
                          >
                            +25
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. LAB TEST MANAGEMENT SECTION */}
      {/* ======================================================== */}
      {activeSection === 'labs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">Diagnostic Status:</span>
              {['All', 'Scheduled', 'Sample Collected', 'Completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setLabFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    labFilter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400">
              {filteredLabs.length} Diagnostic Bookings
            </span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Test Name</th>
                    <th className="py-3 px-4">Schedule Date & Slot</th>
                    <th className="py-3 px-4">Fasting Required</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Update Workflow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {filteredLabs.map(l => (
                    <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-300">{l.id}</td>
                      <td className="py-3 px-4 font-bold text-white">{l.patientName}</td>
                      <td className="py-3 px-4 font-semibold text-slate-200">{l.testName}</td>
                      <td className="py-3 px-4">
                        <span className="text-white">{l.scheduledDate}</span> &bull;{' '}
                        <span className="text-slate-400">{l.scheduledTime}</span>
                      </td>
                      <td className="py-3 px-4">
                        {l.fastingRequired ? (
                          <span className="text-amber-400 font-bold text-[10px]">10-12 hrs Fasting</span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          l.status === 'Completed'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                            : l.status === 'Sample Collected'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {l.status !== 'Sample Collected' && l.status !== 'Completed' && (
                            <button
                              onClick={() => handleUpdateLabStatus(l.id, 'Sample Collected')}
                              className="px-2 py-1 bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white rounded font-bold text-[10px] transition-colors"
                            >
                              Sample Collected
                            </button>
                          )}
                          {l.status !== 'Completed' && (
                            <button
                              onClick={() => handleUpdateLabStatus(l.id, 'Completed')}
                              className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded font-bold text-[10px] transition-colors"
                            >
                              Mark Completed
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. DEPARTMENTS & SERVICES SECTION */}
      {/* ======================================================== */}
      {activeSection === 'departments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map(dept => (
              <div key={dept.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                    <Network className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    Active Unit
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-base">{dept.name}</h4>
                  <p className="text-xs text-indigo-400 font-semibold">{dept.nameHi || 'आयुर्वेद विभाग'}</p>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">{dept.description}</p>

                <div className="space-y-1.5 pt-2 border-t border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Head of Dept:</span>
                    <span className="font-semibold text-white">{dept.headOfDepartment}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Location / Floor:</span>
                    <span className="font-semibold">{dept.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Key Services:</span>
                    <span className="font-semibold truncate max-w-[160px]">{dept.services.slice(0, 2).join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Active Doctors:</span>
                    <span className="font-bold text-indigo-300">{dept.availableDoctorsCount} Doctors</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. EMERGENCY & AMBULANCE TRACKING SECTION */}
      {/* ======================================================== */}
      {activeSection === 'emergency' && (
        <div className="space-y-4">
          <div className="bg-red-950/40 border border-red-800/60 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 flex-shrink-0 animate-pulse">
                <Ambulance className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">AIIA Casualty & Emergency Response Fleet</h3>
                <p className="text-xs text-red-200/80">
                  Direct dispatch terminal for Critical Patient Transport & Emergency Case Intake
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="tel:102"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Hotline (102)</span>
              </a>
            </div>
          </div>

          {/* Ambulances List */}
          <div className="space-y-3">
            {ambulances.map(amb => (
              <div key={amb.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-red-400 text-xs">{amb.id}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="font-bold text-white text-sm">{amb.patientName}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      amb.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : amb.status === 'Dispatched'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
                        : 'bg-red-500/20 text-red-400 border-red-500/40'
                    }`}>
                      {amb.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Pickup: <strong className="text-white">{amb.pickupAddress}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Contact: <strong className="text-white">{amb.contactPhone}</strong> &bull; Priority: <strong className="text-red-400">{amb.priority}</strong></span>
                    </p>
                    {amb.vehicleNumber && (
                      <p className="text-[11px] text-indigo-300">
                        Assigned Unit: <strong>{amb.vehicleNumber}</strong> &bull; Driver: <strong>{amb.driverName}</strong> (ETA {amb.estimatedMinutes} mins)
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {amb.status === 'Requested' && (
                    <button
                      onClick={() => setDispatchModalReq(amb)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-colors"
                    >
                      <Ambulance className="w-4 h-4" />
                      <span>Dispatch Unit Now</span>
                    </button>
                  )}
                  {amb.status === 'Dispatched' && (
                    <button
                      onClick={async () => {
                        const updated = await adminService.updateAmbulanceStatus(amb.id, 'Completed');
                        setAmbulances(prev => prev.map(a => a.id === amb.id ? updated : a));
                        showNotification(`Ambulance run ${amb.id} marked as Completed`);
                      }}
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. BROADCAST ANNOUNCEMENTS SECTION */}
      {/* ======================================================== */}
      {activeSection === 'notifications' && (
        <div className="space-y-4 max-w-2xl">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-5">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-400" />
                Broadcast Hospital Announcement
              </h3>
              <p className="text-xs text-slate-400">
                Instantly broadcast institutional updates, free health camp notices, or emergency advisories across all patient notification panels (Module 4).
              </p>
            </div>

            {broadcastSent && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-700 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Notice broadcasted successfully across the AIIA network!</span>
              </div>
            )}

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Announcement Headline
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  placeholder="e.g., Free Ayurveda Health Checkup Camp on Sunday"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Detailed Advisory Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  placeholder="Write clear instructions, eligibility, timings, and OPD location..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500">
                    <option value="high">High Priority</option>
                    <option value="medium">General Information</option>
                    <option value="emergency">Emergency Alert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Audience
                  </label>
                  <select className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500">
                    <option value="all">All Registered Patients</option>
                    <option value="opd">Today's OPD Visitors</option>
                    <option value="staff">Hospital Medical Staff</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast Alert to All Users</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 10. ANALYTICS & AUDIT TRAIL SECTION */}
      {/* ======================================================== */}
      {activeSection === 'analytics' && (
        <div className="space-y-6">
          {/* Recharts Analytics Panel */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  Electronic Health Record (EHR) & Consultation Metrics
                </h3>
                <p className="text-[11px] text-slate-400">Institutional utilization metrics for AIIA accreditation compliance</p>
              </div>
              <button
                onClick={() => alert('Simulating PDF/CSV Export of Health Records Report...')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit CSV</span>
              </button>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="appointments" name="Hospital OPD Visits" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="consultations" name="AI Case Taking Done" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-lg space-y-3 p-5">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                AIIA IT Security & Clinical Audit Log
              </h3>
              <p className="text-[11px] text-slate-400">Immutable ledger of administrative actions for data privacy compliance</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Log ID</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Operator Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Module</th>
                    <th className="py-3 px-4">Action & Details</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">{log.id}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-300">{log.timestamp}</td>
                      <td className="py-3 px-4 font-bold text-white">{log.userName}</td>
                      <td className="py-3 px-4 text-slate-300">{log.userRole}</td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {log.module}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{log.action}</span>
                        <span className="text-[11px] text-slate-400">{log.details}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'Success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VIEW PATIENT DETAILS */}
      {/* ======================================================== */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black">
                  {selectedPatient.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedPatient.fullName}</h3>
                  <p className="text-xs text-slate-400">ID: {selectedPatient.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Age & Gender:</span>
                  <span className="font-bold text-white">{selectedPatient.age} yrs, {selectedPatient.gender}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Blood Group:</span>
                  <span className="font-bold text-red-400">{selectedPatient.bloodGroup || 'O+'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Mobile Phone:</span>
                  <span className="font-bold text-white font-mono">{selectedPatient.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location:</span>
                  <span className="font-bold text-white">{selectedPatient.city}, {selectedPatient.state}</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-indigo-300 text-xs flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5" />
                  Recorded Baseline Vitals
                </h4>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <span className="text-slate-500 block">Blood Pressure:</span>
                    <span className="font-bold text-white">{selectedPatient.bloodPressure || '120/80 mmHg'}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <span className="text-slate-500 block">Pulse Rate:</span>
                    <span className="font-bold text-white">{selectedPatient.pulse || 72} bpm</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <span className="text-slate-500 block">Weight:</span>
                    <span className="font-bold text-white">{selectedPatient.weightKg || 68} kg</span>
                  </div>
                </div>
              </div>

              {selectedPatient.emergencyContact && (
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Emergency Contact:</span>
                  <span className="font-bold text-white">
                    {selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.relation}) &bull;{' '}
                    <span className="font-mono text-emerald-400">{selectedPatient.emergencyContact.phone}</span>
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedPatient(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD NEW DOCTOR */}
      {/* ======================================================== */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-400" />
                Register New Doctor to Roster
              </h3>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Doctor Full Name</label>
                <input
                  type="text"
                  required
                  value={newDoctor.name}
                  onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra Tripathi"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={newDoctor.departmentName}
                    onChange={e => setNewDoctor({ ...newDoctor, departmentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Specialization</label>
                  <input
                    type="text"
                    required
                    value={newDoctor.specialization}
                    onChange={e => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                    placeholder="e.g. Panchakarma Specialist"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Qualifications</label>
                  <input
                    type="text"
                    required
                    value={newDoctor.qualification}
                    onChange={e => setNewDoctor({ ...newDoctor, qualification: e.target.value })}
                    placeholder="BAMS, MD (Ayu)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={newDoctor.consultationFee}
                    onChange={e => setNewDoctor({ ...newDoctor, consultationFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Room / OPD Clinic</label>
                  <input
                    type="text"
                    required
                    value={newDoctor.roomNumber}
                    onChange={e => setNewDoctor({ ...newDoctor, roomNumber: e.target.value })}
                    placeholder="OPD-204"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">OPD Timings</label>
                  <input
                    type="text"
                    required
                    value={newDoctor.opdTimings}
                    onChange={e => setNewDoctor({ ...newDoctor, opdTimings: e.target.value })}
                    placeholder="09:00 AM - 02:00 PM"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD NEW MEDICINE */}
      {/* ======================================================== */}
      {showAddMedicineModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-indigo-400" />
                Add Medicine to Hospital Pharmacy
              </h3>
              <button
                onClick={() => setShowAddMedicineModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Medicine Name</label>
                <input
                  type="text"
                  required
                  value={newMedicine.name}
                  onChange={e => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  placeholder="e.g. Maha Sudarshan Vati"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newMedicine.category}
                    onChange={e => setNewMedicine({ ...newMedicine, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Classical Ayurvedic">Classical Ayurvedic</option>
                    <option value="Proprietary Ayurvedic">Proprietary Ayurvedic</option>
                    <option value="Modern Emergency Medicine">Modern Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Form</label>
                  <select
                    value={newMedicine.form}
                    onChange={e => setNewMedicine({ ...newMedicine, form: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Churna">Churna (Powder)</option>
                    <option value="Oil">Taila (Oil)</option>
                    <option value="Decoction">Kashayam / Kwath</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    required
                    value={newMedicine.stockCount}
                    onChange={e => setNewMedicine({ ...newMedicine, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newMedicine.unitPrice}
                    onChange={e => setNewMedicine({ ...newMedicine, unitPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Standard Dosage Instruction</label>
                <input
                  type="text"
                  value={newMedicine.dosageInstruction}
                  onChange={e => setNewMedicine({ ...newMedicine, dosageInstruction: e.target.value })}
                  placeholder="e.g. 1 tablet twice daily after meals"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddMedicineModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30"
                >
                  Catalog Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DISPATCH AMBULANCE */}
      {/* ======================================================== */}
      {dispatchModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Ambulance className="w-5 h-5 text-red-500" />
                Dispatch Emergency Unit
              </h3>
              <button
                onClick={() => setDispatchModalReq(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl space-y-1">
                <p className="text-slate-300">Patient: <strong className="text-white">{dispatchModalReq.patientName}</strong></p>
                <p className="text-slate-300">Pickup: <strong className="text-white">{dispatchModalReq.pickupAddress}</strong></p>
                <p className="text-slate-300">Caller: <strong className="text-white">{dispatchModalReq.contactPhone}</strong></p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assign Ambulance Vehicle No.</label>
                <input
                  type="text"
                  value={dispatchVehicle}
                  onChange={e => setDispatchVehicle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assign Emergency Driver</label>
                <input
                  type="text"
                  value={dispatchDriver}
                  onChange={e => setDispatchDriver(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDispatchModalReq(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDispatchAmbulance}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/30"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
