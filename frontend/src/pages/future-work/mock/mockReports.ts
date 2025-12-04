export interface Report {
  id: string;
  reportName: string;
  reportType: string;
  generatedBy: string;
  generatedDate: string;
  status: 'completed' | 'pending' | 'failed';
  fileSize: string;
}

export const mockReports: Report[] = [
  {
    id: '1',
    reportName: 'Monthly Patient Summary',
    reportType: 'Patient Statistics',
    generatedBy: 'Dr. Sarah Smith',
    generatedDate: '2024-01-15T10:30:00Z',
    status: 'completed',
    fileSize: '2.5 MB',
  },
  {
    id: '2',
    reportName: 'Billing Report - January 2024',
    reportType: 'Financial',
    generatedBy: 'Admin Robert Brown',
    generatedDate: '2024-01-14T14:20:00Z',
    status: 'completed',
    fileSize: '1.8 MB',
  },
  {
    id: '3',
    reportName: 'Lab Results Summary',
    reportType: 'Clinical',
    generatedBy: 'Dr. Michael Johnson',
    generatedDate: '2024-01-15T09:15:00Z',
    status: 'pending',
    fileSize: '-',
  },
  {
    id: '4',
    reportName: 'Appointment Analytics',
    reportType: 'Operational',
    generatedBy: 'Admin Maria Garcia',
    generatedDate: '2024-01-13T16:45:00Z',
    status: 'completed',
    fileSize: '950 KB',
  },
  {
    id: '5',
    reportName: 'Medication Compliance Report',
    reportType: 'Clinical',
    generatedBy: 'Dr. Sarah Smith',
    generatedDate: '2024-01-12T11:00:00Z',
    status: 'completed',
    fileSize: '3.2 MB',
  },
  {
    id: '6',
    reportName: 'Insurance Claims Report',
    reportType: 'Financial',
    generatedBy: 'Admin Robert Brown',
    generatedDate: '2024-01-11T13:30:00Z',
    status: 'failed',
    fileSize: '-',
  },
  {
    id: '7',
    reportName: 'Patient Demographics Report',
    reportType: 'Patient Statistics',
    generatedBy: 'System Admin David Martinez',
    generatedDate: '2024-01-10T08:00:00Z',
    status: 'completed',
    fileSize: '1.5 MB',
  },
  {
    id: '8',
    reportName: 'Monthly Revenue Report',
    reportType: 'Financial',
    generatedBy: 'Admin Maria Garcia',
    generatedDate: '2024-01-09T15:20:00Z',
    status: 'completed',
    fileSize: '2.1 MB',
  },
];
