export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  createdAt: string;
}

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review patient lab results',
    description: 'Review and sign off on pending lab results for 5 patients',
    assignedTo: 'Dr. Sarah Smith',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-16',
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: '2',
    title: 'Update patient insurance information',
    description: 'Verify and update insurance details for new patients',
    assignedTo: 'Admin Robert Brown',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2024-01-17',
    createdAt: '2024-01-14T10:30:00Z',
  },
  {
    id: '3',
    title: 'Complete monthly billing report',
    description: 'Generate and review monthly billing report for January',
    assignedTo: 'Admin Maria Garcia',
    priority: 'high',
    status: 'completed',
    dueDate: '2024-01-15',
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: '4',
    title: 'Schedule follow-up appointments',
    description: 'Contact patients to schedule follow-up appointments',
    assignedTo: 'Nurse Jane Williams',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2024-01-18',
    createdAt: '2024-01-13T14:20:00Z',
  },
  {
    id: '5',
    title: 'Review medication prescriptions',
    description: 'Review and approve pending medication prescriptions',
    assignedTo: 'Dr. Michael Johnson',
    priority: 'high',
    status: 'overdue',
    dueDate: '2024-01-14',
    createdAt: '2024-01-12T11:15:00Z',
  },
  {
    id: '6',
    title: 'Update patient records',
    description: 'Update patient demographic information in system',
    assignedTo: 'Admin Robert Brown',
    priority: 'low',
    status: 'pending',
    dueDate: '2024-01-20',
    createdAt: '2024-01-15T13:45:00Z',
  },
  {
    id: '7',
    title: 'Conduct staff training session',
    description: 'Organize and conduct training on new system features',
    assignedTo: 'System Admin David Martinez',
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-01-22',
    createdAt: '2024-01-11T16:00:00Z',
  },
  {
    id: '8',
    title: 'Audit patient files',
    description: 'Complete quarterly audit of patient files',
    assignedTo: 'Admin Maria Garcia',
    priority: 'low',
    status: 'completed',
    dueDate: '2024-01-15',
    createdAt: '2024-01-08T09:30:00Z',
  },
];
