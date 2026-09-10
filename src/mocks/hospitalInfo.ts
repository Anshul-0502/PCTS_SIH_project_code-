import { HospitalFacilityInfo } from '../types/hospital';

export const mockHospitalInfo: HospitalFacilityInfo = {
  name: 'All India Institute of Ayurveda (AIIA)',
  tagline: 'Apex Institute for Ayurvedic Education, Research & Patient Care',
  parentOrg: 'Ministry of Ayush, Government of India',
  department: 'All India Institute of Ayurveda',
  problemStatementId: 'SIH PS-26047',
  address: 'Mathura Road, Gautampuri, Sarita Vihar, New Delhi, Delhi 110076, India',
  mainPhone: '+91 11 2695 0401 / 0402',
  emergencyHotline: '+91 11 2695 0499 (24x7 Emergency Casualty)',
  ambulanceHelpline: '108 / +91 11 2695 0400 (Toll Free / Rapid Dispatch)',
  email: 'director@aiia.gov.in / helpdesk@aiia.gov.in',
  opdTimings: {
    weekdays: '08:00 AM - 02:00 PM (Registration: 07:30 AM - 11:30 AM)',
    saturday: '08:00 AM - 01:00 PM (Registration: 07:30 AM - 11:00 AM)',
    sunday: 'Emergency & Casualty Only (24 Hours Open)',
  },
  visitingHours: '04:00 PM - 06:00 PM Daily',
  coordinates: {
    lat: 28.5283,
    lng: 77.3039,
  },
};
