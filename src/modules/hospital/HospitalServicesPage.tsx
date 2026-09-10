import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Pill, 
  FlaskConical, 
  Building2, 
  UserCheck, 
  Ambulance, 
  MapPin, 
  Phone, 
  Clock, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  ShoppingCart, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { hospitalService } from '../../services/hospital.service';
import { useAuth } from '../../store/AuthContext';
import { 
  Department, 
  Doctor, 
  MedicineItem, 
  LabTestItem, 
  AppointmentBooking, 
  AmbulanceRequest 
} from '../../types/hospital';
import { mockHospitalInfo } from '../../mocks/hospitalInfo';

type HospitalTab = 
  | 'appointments' 
  | 'pharmacy' 
  | 'labs' 
  | 'departments' 
  | 'directory' 
  | 'ambulance' 
  | 'contact';

export const HospitalServicesPage: React.FC = () => {
  const { t } = useTranslation();
  const { patient } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = (searchParams.get('tab') as HospitalTab) || 'appointments';
  const initialSearch = searchParams.get('search') || '';

  const [activeTab, setActiveTab] = useState<HospitalTab>(tabParam);

  // Data states
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [labTests, setLabTests] = useState<LabTestItem[]>([]);
  const [myAppointments, setMyAppointments] = useState<AppointmentBooking[]>([]);

  // Appointment Booking State
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dept-01');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [aptDate, setAptDate] = useState('2025-05-05');
  const [aptSlot, setAptSlot] = useState('10:00 AM');
  const [aptSuccess, setAptSuccess] = useState<AppointmentBooking | null>(null);

  // Pharmacy State
  const [pharmacySearch, setPharmacySearch] = useState('');
  const [cartItems, setCartItems] = useState<MedicineItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Lab Booking State
  const [selectedLabTest, setSelectedLabTest] = useState<LabTestItem | null>(null);
  const [labBookingSuccess, setLabBookingSuccess] = useState(false);

  // Ambulance State
  const [ambulanceContact, setAmbulanceContact] = useState(patient?.mobile || '+91 98765 43210');
  const [ambulanceLocation, setAmbulanceLocation] = useState(patient?.address || 'Sector 12, Dwarka, New Delhi');
  const [urgencyLevel, setUrgencyLevel] = useState<AmbulanceRequest['urgencyLevel']>('Emergency');
  const [activeAmbulanceRequest, setActiveAmbulanceRequest] = useState<AmbulanceRequest | null>(null);

  useEffect(() => {
    hospitalService.getDepartments().then(setDepartments);
    hospitalService.getDoctors().then(docs => {
      setDoctors(docs);
      if (docs.length > 0) setSelectedDoctor(docs[0]);
    });
    hospitalService.getMedicines().then(setMedicines);
    hospitalService.getLabTests().then(setLabTests);
    hospitalService.getAppointments(patient?.id).then(setMyAppointments);
  }, [patient]);

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (newTab: HospitalTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Confirm Appointment Booking
  const handleConfirmAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !patient) return;

    const apt = await hospitalService.bookAppointment({
      patientId: patient.id,
      patientName: patient.fullName,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      departmentName: selectedDoctor.departmentName,
      appointmentDate: aptDate,
      timeSlot: aptSlot,
      symptomsBrief: 'General outpatient consultation',
    });

    setAptSuccess(apt);
    setMyAppointments(prev => [apt, ...prev]);
  };

  // Submit Ambulance Request
  const handleAmbulanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const req = await hospitalService.requestAmbulance({
      patientId: patient?.id,
      patientName: patient?.fullName || 'Emergency Caller',
      contactNumber: ambulanceContact,
      pickupLocation: ambulanceLocation,
      urgencyLevel,
    });
    setActiveAmbulanceRequest(req);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-medical-700 bg-medical-50 px-2.5 py-0.5 rounded-full border border-medical-200">
          Module 8 • Integrated Hospital Services
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          {t('hospital.title')}
        </h1>
        <p className="text-xs text-slate-500">
          {t('hospital.subtitle')}
        </p>
      </div>

      {/* 7 Services Navigation Tabs (Matching images/6acad977) */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-xs font-bold pb-2">
        {[
          { id: 'appointments', label: '1. Doctor Appointments', icon: Calendar },
          { id: 'pharmacy', label: '2. Hospital Pharmacy', icon: Pill },
          { id: 'labs', label: '3. Lab Test Booking', icon: FlaskConical },
          { id: 'departments', label: '4. Departments', icon: Building2 },
          { id: 'directory', label: '5. Doctor Directory', icon: UserCheck },
          { id: 'ambulance', label: '6. Ambulance Request', icon: Ambulance, emergency: true },
          { id: 'contact', label: '7. Contact & Location', icon: MapPin },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as HospitalTab)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                tab.emergency && !isActive
                  ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-extrabold'
                  : isActive
                  ? tab.emergency
                    ? 'bg-red-600 text-white shadow-xs font-black'
                    : 'bg-medical-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. DOCTOR APPOINTMENT BOOKING */}
      {/* ========================================================================= */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          {aptSuccess ? (
            <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl max-w-xl mx-auto text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Appointment Confirmed!</h3>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Booking ID:</span>
                  <span className="font-mono font-bold text-slate-900">{aptSuccess.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Doctor:</span>
                  <span className="font-bold text-slate-900">{aptSuccess.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Department:</span>
                  <span className="font-semibold text-slate-800">{aptSuccess.departmentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Scheduled Slot:</span>
                  <span className="font-extrabold text-emerald-700">{aptSuccess.appointmentDate} at {aptSuccess.timeSlot}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setAptSuccess(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Book Another Appointment
                </button>
                <Link
                  to="/consultation"
                  className="px-5 py-2 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <span>Prepare Case-Taking with AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Booking Form */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm">Select Department & Doctor</h3>
                  <p className="text-xs text-slate-500">Choose from All India Institute of Ayurveda clinical departments</p>
                </div>

                {/* Step A: Select Department */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">1. Select Department</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {departments.map(dept => (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => {
                          setSelectedDeptId(dept.id);
                          const doc = doctors.find(d => d.departmentId === dept.id);
                          if (doc) setSelectedDoctor(doc);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedDeptId === dept.id
                            ? 'border-medical-600 bg-medical-50 text-medical-800 font-bold shadow-2xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700 text-xs'
                        }`}
                      >
                        <p className="font-bold text-xs">{dept.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{dept.location}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step B: Select Doctor */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">2. Select Specialist</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {doctors
                      .filter(d => d.departmentId === selectedDeptId)
                      .map(doc => (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDoctor(doc)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                            selectedDoctor?.id === doc.id
                              ? 'border-medical-600 bg-medical-50/70 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <img
                            src={doc.avatarUrl}
                            alt={doc.name}
                            className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                          />
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs">{doc.name}</h4>
                            <p className="text-[11px] text-slate-500 leading-tight line-clamp-1">{doc.specialization}</p>
                            <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400">
                              <span>⭐ {doc.rating}</span>
                              <span>•</span>
                              <span>{doc.experienceYears} yrs exp</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Step C: Date & Slot Picker */}
                {selectedDoctor && (
                  <form onSubmit={handleConfirmAppointment} className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Appointment Date</label>
                        <input
                          type="date"
                          value={aptDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => setAptDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Available OPD Slot</label>
                        <div className="flex flex-wrap gap-2">
                          {selectedDoctor.availableSlotsToday.map(slot => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setAptSlot(slot)}
                              className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                                aptSlot === slot
                                  ? 'bg-medical-600 text-white border-medical-600 shadow-xs'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Appointment Booking</span>
                    </button>
                  </form>
                )}

              </div>

              {/* Right Column: Scheduled Appointments */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">Your Appointments</h3>
                  
                  <div className="space-y-3">
                    {myAppointments.map(apt => (
                      <div key={apt.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{apt.doctorName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{apt.departmentName}</p>
                        <div className="pt-1 flex items-center gap-1.5 text-medical-700 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{apt.appointmentDate} at {apt.timeSlot}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HOSPITAL PHARMACY */}
      {/* ========================================================================= */}
      {activeTab === 'pharmacy' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">AIIA Pharmacy & Jan Aushadhi Dispensary</h3>
                <p className="text-xs text-slate-500">Certified Ayurvedic formulations, classical churnas, and essential modern medicines</p>
              </div>

              {/* Cart Counter */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
                  <ShoppingCart className="w-4 h-4 text-medical-600" />
                  <span>Cart: {cartItems.length} items</span>
                </div>
                {cartItems.length > 0 && (
                  <button
                    onClick={() => { setOrderPlaced(true); setCartItems([]); }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    Request Pickup
                  </button>
                )}
              </div>
            </div>

            {orderPlaced && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pharmacy Pickup Request Submitted! Order Token #RX-PHARM-8821. Ready at Counter 4.</span>
                </div>
                <button onClick={() => setOrderPlaced(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
            )}

            {/* Medicine Search */}
            <div className="relative">
              <input
                type="text"
                value={pharmacySearch}
                onChange={e => setPharmacySearch(e.target.value)}
                placeholder="Search medicine by brand or generic name (e.g. Giloy, Telmisartan, Avipattikar)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-medical-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            {/* Medicines Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {medicines
                .filter(m => m.name.toLowerCase().includes(pharmacySearch.toLowerCase()) || m.genericName.toLowerCase().includes(pharmacySearch.toLowerCase()))
                .map(med => (
                  <div key={med.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">{med.category}</span>
                        {med.requiresPrescription ? (
                          <span className="text-[9px] font-extrabold bg-red-50 text-red-700 px-2 py-0.5 rounded-md border border-red-200">
                            Prescription Req.
                          </span>
                        ) : (
                          <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                            OTC Available
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{med.name}</h4>
                      <p className="text-xs text-slate-500">{med.genericName} • {med.strength}</p>
                      <p className="text-[11px] text-slate-400 italic pt-1">{med.dosageInstructions}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-slate-900">₹{med.price}</span>
                      <button
                        onClick={() => setCartItems([...cartItems, med])}
                        className="px-3 py-1.5 bg-medical-50 hover:bg-medical-100 text-medical-800 font-bold text-xs rounded-xl border border-medical-200 transition-colors"
                      >
                        + Add to Request
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. LAB TEST BOOKING */}
      {/* ========================================================================= */}
      {activeTab === 'labs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">NABL Accredited Central Pathology & Biochemistry</h3>
              <p className="text-xs text-slate-500">Diagnostic blood tests, preparation instructions, and digital report delivery</p>
            </div>

            {labBookingSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center justify-between">
                <span>Lab Test Booked Successfully! Confirmation Token #LBO-2025-412. Report will be delivered in My Reports.</span>
                <button onClick={() => setLabBookingSuccess(false)} className="text-slate-400">✕</button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {labTests.map(test => (
                <div key={test.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {test.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{test.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{test.description}</p>
                    <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1">
                      <p><strong>Instructions:</strong> {test.preparationInstructions}</p>
                      <p><strong>Turnaround:</strong> {test.turnaroundTime}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">₹{test.price}</span>
                    <button
                      onClick={() => setLabBookingSuccess(true)}
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. HOSPITAL DEPARTMENTS & SERVICES */}
      {/* ========================================================================= */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map(dept => (
            <div key={dept.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{dept.name}</h3>
                  {dept.nameHi && <p className="text-xs text-slate-500 font-medium">{dept.nameHi}</p>}
                </div>
                <span className="bg-medical-50 text-medical-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-medical-200">
                  {dept.availableDoctorsCount} Specialists
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{dept.description}</p>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                <p><strong className="text-slate-700">Head of Dept:</strong> {dept.headOfDepartment}</p>
                <p><strong className="text-slate-700">Location:</strong> {dept.location}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase mb-1 block">Clinical Services</span>
                <div className="flex flex-wrap gap-1.5">
                  {dept.services.map((svc, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DOCTOR DIRECTORY */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map(doc => (
              <div key={doc.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="flex items-start gap-3.5">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-medical-50 shadow-xs"
                  />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-sm">{doc.name}</h4>
                    <p className="text-xs text-medical-700 font-semibold">{doc.departmentName}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{doc.specialization}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{doc.about}</p>

                <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1">
                  <p><strong>OPD Timings:</strong> {doc.timing}</p>
                  <p><strong>Days:</strong> {doc.workingDays.join(', ')}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Fee: <strong>₹{doc.consultationFee}</strong></span>
                  <button
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setSelectedDeptId(doc.departmentId);
                      setActiveTab('appointments');
                    }}
                    className="px-3 py-1.5 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. AMBULANCE REQUEST (FAST EMERGENCY ACCESS) */}
      {/* ========================================================================= */}
      {activeTab === 'ambulance' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-red-200 shadow-xl max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 border-b border-red-100 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-500/25">
              <Ambulance className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                Immediate Emergency Access
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">Emergency Ambulance Dispatch</h3>
              <p className="text-xs text-slate-500">No prior AI consultation required for emergency response</p>
            </div>
          </div>

          {activeAmbulanceRequest ? (
            <div className="p-6 bg-red-50/80 border border-red-200 rounded-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="bg-red-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full animate-pulse">
                  STATUS: {activeAmbulanceRequest.status.toUpperCase()}
                </span>
                <span className="font-mono text-xs font-bold text-slate-700">{activeAmbulanceRequest.id}</span>
              </div>

              <div className="space-y-1 text-xs text-slate-800">
                <p><strong>Assigned Vehicle:</strong> {activeAmbulanceRequest.vehicleNumber}</p>
                <p><strong>Pilot/Driver:</strong> {activeAmbulanceRequest.driverName} ({activeAmbulanceRequest.driverPhone})</p>
                <p><strong>Pickup Location:</strong> {activeAmbulanceRequest.pickupLocation}</p>
                <p><strong>Estimated Arrival:</strong> <span className="text-red-700 font-extrabold text-sm">{activeAmbulanceRequest.estimatedArrivalMinutes} Minutes</span></p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-red-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Need immediate casualty physician advice?</span>
                <a
                  href={`tel:${mockHospitalInfo.emergencyHotline}`}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg font-bold text-xs flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Casualty Hotline</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAmbulanceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Urgency Level</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['Emergency', 'Critical', 'Non-Emergency Transfer'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgencyLevel(lvl as any)}
                      className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                        urgencyLevel === lvl
                          ? 'border-red-600 bg-red-50 text-red-700 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number</label>
                <input
                  type="tel"
                  required
                  value={ambulanceContact}
                  onChange={e => setAmbulanceContact(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Location / Landmark</label>
                <textarea
                  rows={2}
                  required
                  value={ambulanceLocation}
                  onChange={e => setAmbulanceLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                id="ambulance-dispatch-submit-button"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Dispatch Ambulance Immediately</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. HOSPITAL CONTACT & LOCATION */}
      {/* ========================================================================= */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xl font-black text-slate-900">{mockHospitalInfo.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{mockHospitalInfo.parentOrg}</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-medical-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Campus Address</span>
                  <p className="font-semibold text-slate-800 leading-relaxed">{mockHospitalInfo.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-medical-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Main Exchange</span>
                  <p className="font-semibold text-slate-800">{mockHospitalInfo.mainPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-red-500 font-bold block text-[10px] uppercase">24x7 Emergency Casualty</span>
                  <p className="font-extrabold text-red-700 text-sm">{mockHospitalInfo.emergencyHotline}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-medical-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">OPD Visiting Hours</span>
                  <p className="font-semibold text-slate-800">{mockHospitalInfo.opdTimings.weekdays}</p>
                  <p className="text-[11px] text-slate-500">{mockHospitalInfo.opdTimings.saturday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Visual Mockup */}
          <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-between space-y-4 shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                Sarita Vihar, New Delhi
              </span>
              <h4 className="font-bold text-base">Campus Geographic Location</h4>
              <p className="text-xs text-slate-300">
                Coordinates: {mockHospitalInfo.coordinates.lat}° N, {mockHospitalInfo.coordinates.lng}° E
              </p>
            </div>

            {/* Simulated Map Visual */}
            <div className="w-full h-48 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col items-center justify-center p-4 text-center space-y-2 relative">
              <MapPin className="w-8 h-8 text-red-500 animate-bounce" />
              <p className="text-xs font-bold text-white">All India Institute of Ayurveda Campus</p>
              <p className="text-[10px] text-slate-400">Near Sarita Vihar Metro Station & Mathura Road</p>
            </div>

            <a
              href="https://maps.google.com/?q=All+India+Institute+of+Ayurveda+New+Delhi"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open in Google Maps / Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
