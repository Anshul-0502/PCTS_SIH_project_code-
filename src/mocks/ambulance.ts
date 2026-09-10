import { AmbulanceRequest } from '../types/hospital';

export const mockAmbulanceRequests: AmbulanceRequest[] = [
  {
    id: 'AMB-REQ-901',
    patientId: 'PAT-2025-0892',
    patientName: 'Ravi Kumar',
    contactNumber: '+91 98765 43210',
    pickupLocation: 'Flat 402, Shanti Kunj Apartments, Sector 12, Dwarka, New Delhi',
    landmark: 'Near Dwarka Sector 12 Metro Station',
    urgencyLevel: 'Emergency',
    optionalNote: 'Elderly relative experiencing acute shortness of breath and chest heaviness.',
    status: 'En Route',
    vehicleNumber: 'DL 1T 4492 (Advanced Cardiac Life Support)',
    driverName: 'Suresh Pal',
    driverPhone: '+91 98110 99882',
    requestedAt: '2025-04-24T10:14:00Z',
    estimatedArrivalMinutes: 8,
    coordinates: {
      lat: 28.5921,
      lng: 77.0460,
    },
  },
  {
    id: 'AMB-REQ-902',
    patientName: 'Devendra Nath',
    contactNumber: '+91 98777 66554',
    pickupLocation: 'Plot 18, Mathura Road, Badarpur, New Delhi',
    landmark: 'Opposite Badarpur Border Police Post',
    urgencyLevel: 'Critical',
    optionalNote: 'Suspected stroke, left-side numbness.',
    status: 'Dispatched',
    vehicleNumber: 'DL 1T 5580',
    driverName: 'Mohd. Imran',
    driverPhone: '+91 99100 12345',
    requestedAt: '2025-04-24T10:20:00Z',
    estimatedArrivalMinutes: 12,
  },
];
