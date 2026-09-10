import { PatientProfile, PatientRegistrationFormValues } from '../types/patient';
import { mockDefaultPatient, mockPatientsList } from '../mocks/patients';

class PatientService {
  private patients: PatientProfile[] = [...mockPatientsList];

  async registerPatient(data: PatientRegistrationFormValues): Promise<PatientProfile> {
    await new Promise(r => setTimeout(r, 600));
    
    // Calculate age from DOB
    const birthDate = new Date(data.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const newPatient: PatientProfile = {
      id: `PAT-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: data.fullName,
      dob: data.dob,
      age: Math.max(1, age),
      gender: data.gender,
      mobile: data.mobile,
      email: data.email,
      address: data.address,
      bloodGroup: data.bloodGroup,
      height: Number(data.height),
      weight: Number(data.weight),
      existingDiseases: data.existingDiseases,
      otherDiseaseDetails: data.otherDiseaseDetails,
      registeredAt: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.fullName)}`,
    };

    this.patients.unshift(newPatient);
    return newPatient;
  }

  async getPatientProfile(patientId?: string): Promise<PatientProfile> {
    await new Promise(r => setTimeout(r, 300));
    const found = this.patients.find(p => p.id === patientId) || mockDefaultPatient;
    return found;
  }

  async updatePatientProfile(patientId: string, updates: Partial<PatientProfile>): Promise<PatientProfile> {
    await new Promise(r => setTimeout(r, 400));
    const index = this.patients.findIndex(p => p.id === patientId);
    if (index >= 0) {
      this.patients[index] = { ...this.patients[index], ...updates };
      return this.patients[index];
    }
    const updated = { ...mockDefaultPatient, ...updates };
    return updated;
  }

  async getAllPatients(): Promise<PatientProfile[]> {
    await new Promise(r => setTimeout(r, 300));
    return [...this.patients];
  }
}

export const patientService = new PatientService();
