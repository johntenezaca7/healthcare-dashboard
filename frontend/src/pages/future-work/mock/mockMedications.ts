export interface Medication {
  id: string;
  patientName: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
  endDate: string | null;
  status: 'active' | 'completed' | 'discontinued';
}

export const mockMedications: Medication[] = [
  {
    id: '1',
    patientName: 'John Doe',
    medicationName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    prescribedBy: 'Dr. Sarah Smith',
    startDate: '2024-01-01',
    endDate: null,
    status: 'active',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    medicationName: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    prescribedBy: 'Dr. Michael Johnson',
    startDate: '2023-12-15',
    endDate: null,
    status: 'active',
  },
  {
    id: '3',
    patientName: 'Robert Brown',
    medicationName: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    prescribedBy: 'Dr. Sarah Smith',
    startDate: '2023-11-20',
    endDate: '2024-01-10',
    status: 'completed',
  },
  {
    id: '4',
    patientName: 'Emily Davis',
    medicationName: 'Amlodipine',
    dosage: '5mg',
    frequency: 'Once daily',
    prescribedBy: 'Dr. Michael Johnson',
    startDate: '2024-01-05',
    endDate: null,
    status: 'active',
  },
  {
    id: '5',
    patientName: 'James Wilson',
    medicationName: 'Omeprazole',
    dosage: '20mg',
    frequency: 'Once daily',
    prescribedBy: 'Dr. Sarah Smith',
    startDate: '2023-10-01',
    endDate: '2024-01-12',
    status: 'discontinued',
  },
  {
    id: '6',
    patientName: 'Lisa Anderson',
    medicationName: 'Levothyroxine',
    dosage: '75mcg',
    frequency: 'Once daily',
    prescribedBy: 'Dr. Michael Johnson',
    startDate: '2023-09-15',
    endDate: null,
    status: 'active',
  },
  {
    id: '7',
    patientName: 'David Martinez',
    medicationName: 'Gabapentin',
    dosage: '300mg',
    frequency: 'Three times daily',
    prescribedBy: 'Dr. Sarah Smith',
    startDate: '2024-01-08',
    endDate: null,
    status: 'active',
  },
  {
    id: '8',
    patientName: 'Maria Garcia',
    medicationName: 'Sertraline',
    dosage: '50mg',
    frequency: 'Once daily',
    prescribedBy: 'Dr. Michael Johnson',
    startDate: '2023-12-01',
    endDate: null,
    status: 'active',
  },
];
