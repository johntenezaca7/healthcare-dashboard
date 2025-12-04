export interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  provider: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Doe',
    date: '2024-01-15',
    time: '09:00 AM',
    provider: 'Dr. Sarah Smith',
    type: 'Follow-up',
    status: 'scheduled',
    notes: 'Annual checkup',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    date: '2024-01-15',
    time: '10:30 AM',
    provider: 'Dr. Michael Johnson',
    type: 'Consultation',
    status: 'scheduled',
  },
  {
    id: '3',
    patientName: 'Robert Brown',
    date: '2024-01-15',
    time: '02:00 PM',
    provider: 'Dr. Sarah Smith',
    type: 'Follow-up',
    status: 'completed',
    notes: 'Prescription refill',
  },
  {
    id: '4',
    patientName: 'Emily Davis',
    date: '2024-01-16',
    time: '09:00 AM',
    provider: 'Dr. Michael Johnson',
    type: 'New Patient',
    status: 'scheduled',
  },
  {
    id: '5',
    patientName: 'James Wilson',
    date: '2024-01-16',
    time: '11:00 AM',
    provider: 'Dr. Sarah Smith',
    type: 'Consultation',
    status: 'cancelled',
    notes: 'Patient cancelled',
  },
  {
    id: '6',
    patientName: 'Lisa Anderson',
    date: '2024-01-16',
    time: '03:30 PM',
    provider: 'Dr. Michael Johnson',
    type: 'Follow-up',
    status: 'scheduled',
  },
  {
    id: '7',
    patientName: 'David Martinez',
    date: '2024-01-17',
    time: '10:00 AM',
    provider: 'Dr. Sarah Smith',
    type: 'New Patient',
    status: 'scheduled',
  },
  {
    id: '8',
    patientName: 'Maria Garcia',
    date: '2024-01-17',
    time: '01:00 PM',
    provider: 'Dr. Michael Johnson',
    type: 'Follow-up',
    status: 'no-show',
  },
];
