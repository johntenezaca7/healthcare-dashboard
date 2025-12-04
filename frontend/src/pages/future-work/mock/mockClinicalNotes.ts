export interface ClinicalNote {
  id: string;
  patientName: string;
  date: string;
  provider: string;
  noteType: string;
  chiefComplaint: string;
  status: 'draft' | 'finalized' | 'signed';
}

export const mockClinicalNotes: ClinicalNote[] = [
  {
    id: '1',
    patientName: 'John Doe',
    date: '2024-01-15',
    provider: 'Dr. Sarah Smith',
    noteType: 'Progress Note',
    chiefComplaint: 'Follow-up for hypertension',
    status: 'finalized',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    date: '2024-01-15',
    provider: 'Dr. Michael Johnson',
    noteType: 'Consultation',
    chiefComplaint: 'Annual physical examination',
    status: 'signed',
  },
  {
    id: '3',
    patientName: 'Robert Brown',
    date: '2024-01-14',
    provider: 'Dr. Sarah Smith',
    noteType: 'Progress Note',
    chiefComplaint: 'Diabetes management',
    status: 'draft',
  },
  {
    id: '4',
    patientName: 'Emily Davis',
    date: '2024-01-14',
    provider: 'Dr. Michael Johnson',
    noteType: 'Initial Visit',
    chiefComplaint: 'Chest pain evaluation',
    status: 'finalized',
  },
  {
    id: '5',
    patientName: 'James Wilson',
    date: '2024-01-13',
    provider: 'Dr. Sarah Smith',
    noteType: 'Progress Note',
    chiefComplaint: 'Medication review',
    status: 'signed',
  },
  {
    id: '6',
    patientName: 'Lisa Anderson',
    date: '2024-01-13',
    provider: 'Dr. Michael Johnson',
    noteType: 'Consultation',
    chiefComplaint: 'Routine checkup',
    status: 'finalized',
  },
  {
    id: '7',
    patientName: 'David Martinez',
    date: '2024-01-12',
    provider: 'Dr. Sarah Smith',
    noteType: 'Progress Note',
    chiefComplaint: 'Post-operative follow-up',
    status: 'draft',
  },
  {
    id: '8',
    patientName: 'Maria Garcia',
    date: '2024-01-12',
    provider: 'Dr. Michael Johnson',
    noteType: 'Initial Visit',
    chiefComplaint: 'New patient consultation',
    status: 'finalized',
  },
];
