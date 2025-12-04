export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
  lastLogin: string | null;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@example.com',
    role: 'doctor',
    department: 'Cardiology',
    lastLogin: '2024-01-15T10:30:00Z',
    status: 'active',
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'Dr. Michael Johnson',
    email: 'michael.johnson@example.com',
    role: 'doctor',
    department: 'Internal Medicine',
    lastLogin: '2024-01-15T09:15:00Z',
    status: 'active',
    createdAt: '2023-02-20',
  },
  {
    id: '3',
    name: 'Nurse Jane Williams',
    email: 'jane.williams@example.com',
    role: 'nurse',
    department: 'Emergency',
    lastLogin: '2024-01-14T16:45:00Z',
    status: 'active',
    createdAt: '2023-03-10',
  },
  {
    id: '4',
    name: 'Admin Robert Brown',
    email: 'robert.brown@example.com',
    role: 'admin',
    department: 'Administration',
    lastLogin: '2024-01-15T08:00:00Z',
    status: 'active',
    createdAt: '2022-11-05',
  },
  {
    id: '5',
    name: 'Nurse Lisa Anderson',
    email: 'lisa.anderson@example.com',
    role: 'nurse',
    department: 'Pediatrics',
    lastLogin: '2024-01-13T14:20:00Z',
    status: 'active',
    createdAt: '2023-04-22',
  },
  {
    id: '6',
    name: 'System Admin David Martinez',
    email: 'david.martinez@example.com',
    role: 'system_admin',
    department: 'IT',
    lastLogin: '2024-01-15T11:00:00Z',
    status: 'active',
    createdAt: '2022-06-01',
  },
  {
    id: '7',
    name: 'Dr. Emily Davis',
    email: 'emily.davis@example.com',
    role: 'doctor',
    department: 'Orthopedics',
    lastLogin: '2024-01-10T12:30:00Z',
    status: 'inactive',
    createdAt: '2023-05-15',
  },
  {
    id: '8',
    name: 'Admin Maria Garcia',
    email: 'maria.garcia@example.com',
    role: 'admin',
    department: 'Billing',
    lastLogin: '2024-01-12T15:45:00Z',
    status: 'suspended',
    createdAt: '2023-07-20',
  },
];
