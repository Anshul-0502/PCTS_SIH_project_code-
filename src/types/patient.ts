export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Not Known';

export interface PatientProfile {
  id: string;
  fullName: string;
  dob: string; // YYYY-MM-DD
  age?: number;
  gender: Gender;
  mobile: string;
  email: string;
  address: string;
  bloodGroup?: BloodGroup;
  height: number; // in cm
  weight: number; // in kg
  existingDiseases: string[];
  otherDiseaseDetails?: string;
  avatarUrl?: string;
  registeredAt: string;
  city?: string;
  state?: string;
  bloodPressure?: string;
  pulse?: number;
  weightKg?: number;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
}

export interface PatientRegistrationFormValues {
  fullName: string;
  dob: string;
  gender: Gender;
  mobile: string;
  email: string;
  address: string;
  bloodGroup?: BloodGroup;
  height: number;
  weight: number;
  existingDiseases: string[];
  otherDiseaseDetails?: string;
  agreeToTerms: boolean;
}
