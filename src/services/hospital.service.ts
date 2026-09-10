import { 
  Doctor, 
  Department, 
  AppointmentBooking, 
  MedicineItem, 
  LabTestItem, 
  LabTestBooking, 
  AmbulanceRequest, 
  HospitalFacilityInfo 
} from '../types/hospital';
import { mockDoctors } from '../mocks/doctors';
import { mockDepartments } from '../mocks/departments';
import { mockAppointmentsList } from '../mocks/appointments';
import { mockMedicinesList } from '../mocks/medicines';
import { mockLabTestsList, mockLabBookingsList } from '../mocks/labTests';
import { mockAmbulanceRequests } from '../mocks/ambulance';
import { mockHospitalInfo } from '../mocks/hospitalInfo';
import { notificationService } from './notification.service';

class HospitalService {
  private doctors: Doctor[] = [...mockDoctors];
  private departments: Department[] = [...mockDepartments];
  private appointments: AppointmentBooking[] = [...mockAppointmentsList];
  private medicines: MedicineItem[] = [...mockMedicinesList];
  private labTests: LabTestItem[] = [...mockLabTestsList];
  private labBookings: LabTestBooking[] = [...mockLabBookingsList];
  private ambulanceRequests: AmbulanceRequest[] = [...mockAmbulanceRequests];
  private hospitalInfo: HospitalFacilityInfo = { ...mockHospitalInfo };

  // 1. Departments & Services
  async getDepartments(): Promise<Department[]> {
    await new Promise(r => setTimeout(r, 200));
    return [...this.departments];
  }

  // 2. Doctors & Directory
  async getDoctors(departmentId?: string, query?: string): Promise<Doctor[]> {
    await new Promise(r => setTimeout(r, 250));
    let list = [...this.doctors];

    if (departmentId && departmentId !== 'all') {
      list = list.filter(d => d.departmentId === departmentId);
    }

    if (query && query.trim() !== '') {
      const q = query.toLowerCase();
      list = list.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q) ||
          d.departmentName.toLowerCase().includes(q)
      );
    }

    return list;
  }

  async getDoctorById(id: string): Promise<Doctor | null> {
    await new Promise(r => setTimeout(r, 150));
    return this.doctors.find(d => d.id === id) || null;
  }

  // 3. Appointments
  async getAppointments(patientId?: string): Promise<AppointmentBooking[]> {
    await new Promise(r => setTimeout(r, 250));
    if (patientId) {
      return this.appointments.filter(a => a.patientId === patientId || a.patientId === 'PAT-2025-0892');
    }
    return [...this.appointments];
  }

  async bookAppointment(booking: Omit<AppointmentBooking, 'id' | 'createdAt' | 'status'>): Promise<AppointmentBooking> {
    await new Promise(r => setTimeout(r, 500));
    const newApt: AppointmentBooking = {
      id: `APT-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      ...booking,
    };
    this.appointments.unshift(newApt);

    // Notify patient
    await notificationService.addNotification({
      category: 'appointment',
      title: 'Appointment Confirmed',
      message: `Your appointment with ${newApt.doctorName} is booked for ${newApt.appointmentDate} at ${newApt.timeSlot}.`,
      priority: 'high',
      actionLabel: 'View Details',
      actionUrl: '/hospital-services',
      metadata: {
        appointmentId: newApt.id,
        doctorName: newApt.doctorName,
        appointmentDate: `${newApt.appointmentDate}, ${newApt.timeSlot}`,
      },
    });

    return newApt;
  }

  // 4. Hospital Pharmacy
  async getMedicines(query?: string, category?: string): Promise<MedicineItem[]> {
    await new Promise(r => setTimeout(r, 250));
    let list = [...this.medicines];

    if (category && category !== 'all') {
      list = list.filter(m => m.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (query && query.trim() !== '') {
      const q = query.toLowerCase();
      list = list.filter(
        m =>
          m.name.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
      );
    }

    return list;
  }

  // 5. Lab Tests
  async getLabTests(query?: string, category?: string): Promise<LabTestItem[]> {
    await new Promise(r => setTimeout(r, 250));
    let list = [...this.labTests];

    if (category && category !== 'all') {
      list = list.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    if (query && query.trim() !== '') {
      const q = query.toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }

    return list;
  }

  async getLabBookings(patientId?: string): Promise<LabTestBooking[]> {
    await new Promise(r => setTimeout(r, 200));
    if (patientId) {
      return this.labBookings.filter(b => b.patientId === patientId || b.patientId === 'PAT-2025-0892');
    }
    return [...this.labBookings];
  }

  async bookLabTest(booking: Omit<LabTestBooking, 'id' | 'createdAt' | 'status'>): Promise<LabTestBooking> {
    await new Promise(r => setTimeout(r, 400));
    const newBooking: LabTestBooking = {
      id: `LBO-2025-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
      ...booking,
    };
    this.labBookings.unshift(newBooking);

    await notificationService.addNotification({
      category: 'report',
      title: 'Lab Test Booked',
      message: `Your booking for ${newBooking.testName} on ${newBooking.bookingDate} (${newBooking.timeSlot}) is scheduled.`,
      priority: 'normal',
      actionLabel: 'View Schedule',
      actionUrl: '/hospital-services',
    });

    return newBooking;
  }

  // 6. Ambulance Requests
  async getAmbulanceRequests(): Promise<AmbulanceRequest[]> {
    await new Promise(r => setTimeout(r, 200));
    return [...this.ambulanceRequests];
  }

  async requestAmbulance(request: Omit<AmbulanceRequest, 'id' | 'requestedAt' | 'status' | 'estimatedArrivalMinutes'>): Promise<AmbulanceRequest> {
    await new Promise(r => setTimeout(r, 400));
    const newReq: AmbulanceRequest = {
      id: `AMB-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Dispatched',
      vehicleNumber: 'DL 1T 7788 (Emergency Support)',
      driverName: 'Rameshwar Yadav',
      driverPhone: '+91 98110 55441',
      requestedAt: new Date().toISOString(),
      estimatedArrivalMinutes: 10,
      ...request,
    };
    this.ambulanceRequests.unshift(newReq);
    return newReq;
  }

  // 7. Hospital Info
  getHospitalInfo(): HospitalFacilityInfo {
    return this.hospitalInfo;
  }
}

export const hospitalService = new HospitalService();
