import { 
  OperationalMetrics, 
  MonthlyAppointmentStat, 
  DepartmentUtilizationStat, 
  AuditLogEntry 
} from '../types/admin';
import { Doctor, AppointmentBooking, MedicineItem, LabTestBooking, AmbulanceRequest } from '../types/hospital';
import { PatientProfile } from '../types/patient';
import { 
  mockOperationalMetrics, 
  mockMonthlyAppointments, 
  mockDepartmentStats, 
  mockAuditLogs 
} from '../mocks/adminStats';
import { mockDoctors } from '../mocks/doctors';
import { mockPatientsList } from '../mocks/patients';
import { mockAppointmentsList } from '../mocks/appointments';
import { mockMedicinesList } from '../mocks/medicines';
import { mockLabBookingsList } from '../mocks/labTests';
import { mockAmbulanceRequests } from '../mocks/ambulance';
import { notificationService } from './notification.service';

class AdminService {
  private metrics: OperationalMetrics = { ...mockOperationalMetrics };
  private monthlyStats: MonthlyAppointmentStat[] = [...mockMonthlyAppointments];
  private deptStats: DepartmentUtilizationStat[] = [...mockDepartmentStats];
  private auditLogs: AuditLogEntry[] = [...mockAuditLogs];
  private doctors: Doctor[] = [...mockDoctors];
  private patients: PatientProfile[] = [...mockPatientsList];
  private appointments: AppointmentBooking[] = [...mockAppointmentsList];
  private medicines: MedicineItem[] = [...mockMedicinesList];
  private labBookings: LabTestBooking[] = [...mockLabBookingsList];
  private ambulanceRequests: AmbulanceRequest[] = [...mockAmbulanceRequests];

  // 10. Dashboard & Analytics
  async getOperationalMetrics(): Promise<OperationalMetrics> {
    await new Promise(r => setTimeout(r, 150));
    return {
      ...this.metrics,
      totalRegisteredPatients: this.patients.length + 1245,
      totalActiveDoctors: this.doctors.length + 30,
      totalAppointments: this.appointments.length + 840,
      activeAmbulanceRequests: this.ambulanceRequests.filter(a => a.status !== 'Completed').length,
    };
  }

  async getMonthlyStats(): Promise<MonthlyAppointmentStat[]> {
    await new Promise(r => setTimeout(r, 150));
    return [...this.monthlyStats];
  }

  async getDepartmentStats(): Promise<DepartmentUtilizationStat[]> {
    await new Promise(r => setTimeout(r, 150));
    return [...this.deptStats];
  }

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    await new Promise(r => setTimeout(r, 150));
    return [...this.auditLogs];
  }

  // 2. Patient Management
  async getPatients(query?: string): Promise<PatientProfile[]> {
    await new Promise(r => setTimeout(r, 200));
    if (query && query.trim() !== '') {
      const q = query.toLowerCase();
      return this.patients.filter(p => p.fullName.toLowerCase().includes(q) || p.mobile.includes(q) || p.id.toLowerCase().includes(q));
    }
    return [...this.patients];
  }

  // 3. Doctor Management
  async getDoctors(): Promise<Doctor[]> {
    await new Promise(r => setTimeout(r, 200));
    return [...this.doctors];
  }

  async addDoctor(doctor: Omit<Doctor, 'id'>): Promise<Doctor> {
    await new Promise(r => setTimeout(r, 300));
    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      ...doctor,
    };
    this.doctors.unshift(newDoc);
    this.logAction('Super Admin', 'Added Doctor', 'Doctor Management', `Added Dr. ${newDoc.name} to ${newDoc.departmentName}`);
    return newDoc;
  }

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor> {
    await new Promise(r => setTimeout(r, 250));
    const index = this.doctors.findIndex(d => d.id === id);
    if (index >= 0) {
      this.doctors[index] = { ...this.doctors[index], ...updates };
      this.logAction('Super Admin', 'Updated Doctor', 'Doctor Management', `Updated details for ${this.doctors[index].name}`);
      return this.doctors[index];
    }
    throw new Error('Doctor not found');
  }

  async deleteDoctor(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 250));
    const doc = this.doctors.find(d => d.id === id);
    this.doctors = this.doctors.filter(d => d.id !== id);
    if (doc) {
      this.logAction('Super Admin', 'Deleted Doctor', 'Doctor Management', `Deactivated record for ${doc.name}`);
    }
  }

  // 4. Appointment Management
  async getAppointments(): Promise<AppointmentBooking[]> {
    await new Promise(r => setTimeout(r, 200));
    return [...this.appointments];
  }

  async updateAppointmentStatus(id: string, status: AppointmentBooking['status']): Promise<AppointmentBooking> {
    await new Promise(r => setTimeout(r, 250));
    const apt = this.appointments.find(a => a.id === id);
    if (apt) {
      apt.status = status;
      this.logAction('Appointment Staff', `Updated Appointment Status to ${status}`, 'Appointment Management', `Appointment ${id}`);
      return apt;
    }
    throw new Error('Appointment not found');
  }

  // 5. Pharmacy Management
  async getPharmacyInventory(): Promise<MedicineItem[]> {
    await new Promise(r => setTimeout(r, 200));
    return [...this.medicines];
  }

  async updateMedicineStock(id: string, newStock: number): Promise<MedicineItem> {
    await new Promise(r => setTimeout(r, 250));
    const med = this.medicines.find(m => m.id === id);
    if (med) {
      med.stockCount = newStock;
      med.inStock = newStock > 0;
      this.logAction('Pharmacy Staff', 'Updated Stock Level', 'Pharmacy Management', `${med.name} stock set to ${newStock}`);
      return med;
    }
    throw new Error('Medicine not found');
  }

  async addMedicine(medicine: Omit<MedicineItem, 'id'>): Promise<MedicineItem> {
    await new Promise(r => setTimeout(r, 300));
    const newMed: MedicineItem = {
      id: `med-${Date.now()}`,
      ...medicine,
    };
    this.medicines.unshift(newMed);
    this.logAction('Pharmacy Staff', 'Added New Medicine', 'Pharmacy Management', `Registered ${newMed.name}`);
    return newMed;
  }

  // 6. Lab Management
  async getLabBookings(): Promise<LabTestBooking[]> {
    await new Promise(r => setTimeout(r, 200));
    return [...this.labBookings];
  }

  async updateLabStatus(id: string, status: LabTestBooking['status']): Promise<LabTestBooking> {
    await new Promise(r => setTimeout(r, 250));
    const booking = this.labBookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      this.logAction('Lab Staff', `Updated Lab Status to ${status}`, 'Lab Management', `Booking ${id} for ${booking.testName}`);
      return booking;
    }
    throw new Error('Booking not found');
  }

  // 8. Emergency / Ambulance Management
  async getAmbulanceRequests(): Promise<AmbulanceRequest[]> {
    await new Promise(r => setTimeout(r, 200));
    return [...this.ambulanceRequests];
  }

  async updateAmbulanceStatus(id: string, status: AmbulanceRequest['status'], vehicle?: string, driver?: string): Promise<AmbulanceRequest> {
    await new Promise(r => setTimeout(r, 250));
    const req = this.ambulanceRequests.find(a => a.id === id);
    if (req) {
      req.status = status;
      if (vehicle) req.vehicleNumber = vehicle;
      if (driver) req.driverName = driver;
      this.logAction('Emergency Staff', `Ambulance Status: ${status}`, 'Emergency Management', `Request ${id} assigned to ${req.vehicleNumber || 'unit'}`);
      return req;
    }
    throw new Error('Request not found');
  }

  // 9. Announcements & Broadcast
  async broadcastAnnouncement(title: string, message: string): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    await notificationService.addNotification({
      category: 'hospital',
      title,
      message,
      priority: 'high',
      actionLabel: 'View Announcement',
    });
    this.logAction('Super Admin', 'Broadcasted Announcement', 'Announcements', title);
  }

  private logAction(userName: string, action: string, module: string, details: string): void {
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      userName,
      userRole: 'Hospital Admin',
      action,
      module,
      details,
      status: 'Success',
    };
    this.auditLogs.unshift(entry);
  }
}

export const adminService = new AdminService();
