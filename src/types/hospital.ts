export interface Department {
  id: string;
  name: string;
  nameHi?: string;
  description: string;
  iconName: string;
  headOfDepartment: string;
  availableDoctorsCount: number;
  location: string;
  services: string[];
}

export interface Doctor {
  id: string;
  name: string;
  nameHi?: string;
  departmentId: string;
  departmentName: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  rating: number;
  workingDays: string[];
  timing: string;
  availableSlotsToday: string[];
  isAvailable: boolean;
  consultationFee: number;
  avatarUrl: string;
  about: string;
  languages?: string[];
  roomNumber?: string;
  opdTimings?: string;
}

export interface AppointmentBooking {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  departmentName: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  status: 'Confirmed' | 'Pending' | 'Rescheduled' | 'Cancelled' | 'Completed';
  symptomsBrief?: string;
  createdAt: string;
  notes?: string;
  tokenNumber?: string;
  appointmentTime?: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  category: string; // e.g. 'Analgesic', 'Antibiotic', 'Ayurvedic Rasayana', 'Antihypertensive'
  strength: string; // e.g. '500mg'
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Ointment' | 'Churna' | 'Vati' | 'Oil' | 'Decoction';
  price: number;
  unitPrice?: number;
  inStock: boolean;
  stockCount: number;
  requiresPrescription: boolean;
  manufacturer: string;
  dosageInstructions: string;
  dosageInstruction?: string;
}

export interface LabTestItem {
  id: string;
  name: string;
  category: string; // e.g. 'Hematology', 'Biochemistry', 'Microbiology', 'Radiology'
  description: string;
  preparationInstructions: string;
  turnaroundTime: string;
  price: number;
  isAvailable: boolean;
  sampleType: string;
}

export interface LabTestBooking {
  id: string;
  patientId: string;
  patientName: string;
  testId: string;
  testName: string;
  bookingDate: string;
  timeSlot: string;
  status: 'Scheduled' | 'Sample Collected' | 'Report Processing' | 'Completed' | 'Cancelled';
  price: number;
  createdAt: string;
  reportId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  fastingRequired?: boolean;
}

export interface AmbulanceRequest {
  id: string;
  patientId?: string;
  patientName: string;
  contactNumber: string;
  contactPhone?: string;
  pickupLocation: string;
  pickupAddress?: string;
  landmark?: string;
  urgencyLevel: 'Emergency' | 'Critical' | 'Non-Emergency Transfer';
  priority?: string;
  optionalNote?: string;
  coordinates?: { lat: number; lng: number };
  status: 'Requested' | 'Assigned' | 'Dispatched' | 'En Route' | 'Arrived' | 'Completed';
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  requestedAt: string;
  estimatedArrivalMinutes?: number;
  estimatedMinutes?: number;
}

export type DepartmentInfo = Department;

export interface HospitalFacilityInfo {
  name: string;
  tagline: string;
  parentOrg: string;
  department: string;
  problemStatementId: string;
  address: string;
  mainPhone: string;
  emergencyHotline: string;
  ambulanceHelpline: string;
  email: string;
  opdTimings: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  visitingHours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
