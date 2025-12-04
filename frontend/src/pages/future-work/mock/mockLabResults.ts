export interface LabResult {
  id: string;
  patientName: string;
  testName: string;
  orderDate: string;
  resultDate: string | null;
  orderedBy: string;
  status: 'pending' | 'completed' | 'cancelled';
  result: string | null;
}

export const mockLabResults: LabResult[] = [
  {
    id: '1',
    patientName: 'John Doe',
    testName: 'Complete Blood Count (CBC)',
    orderDate: '2024-01-15',
    resultDate: '2024-01-16',
    orderedBy: 'Dr. Sarah Smith',
    status: 'completed',
    result: 'Normal',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    testName: 'Lipid Panel',
    orderDate: '2024-01-15',
    resultDate: null,
    orderedBy: 'Dr. Michael Johnson',
    status: 'pending',
    result: null,
  },
  {
    id: '3',
    patientName: 'Robert Brown',
    testName: 'Hemoglobin A1C',
    orderDate: '2024-01-14',
    resultDate: '2024-01-15',
    orderedBy: 'Dr. Sarah Smith',
    status: 'completed',
    result: '7.2% (Elevated)',
  },
  {
    id: '4',
    patientName: 'Emily Davis',
    testName: 'Comprehensive Metabolic Panel',
    orderDate: '2024-01-14',
    resultDate: null,
    orderedBy: 'Dr. Michael Johnson',
    status: 'pending',
    result: null,
  },
  {
    id: '5',
    patientName: 'James Wilson',
    testName: 'Thyroid Stimulating Hormone (TSH)',
    orderDate: '2024-01-13',
    resultDate: '2024-01-14',
    orderedBy: 'Dr. Sarah Smith',
    status: 'completed',
    result: 'Normal',
  },
  {
    id: '6',
    patientName: 'Lisa Anderson',
    testName: 'Urinalysis',
    orderDate: '2024-01-13',
    resultDate: '2024-01-13',
    orderedBy: 'Dr. Michael Johnson',
    status: 'completed',
    result: 'Normal',
  },
  {
    id: '7',
    patientName: 'David Martinez',
    testName: 'Liver Function Tests',
    orderDate: '2024-01-12',
    resultDate: null,
    orderedBy: 'Dr. Sarah Smith',
    status: 'cancelled',
    result: null,
  },
  {
    id: '8',
    patientName: 'Maria Garcia',
    testName: 'Vitamin D Level',
    orderDate: '2024-01-12',
    resultDate: '2024-01-13',
    orderedBy: 'Dr. Michael Johnson',
    status: 'completed',
    result: 'Low (15 ng/mL)',
  },
];
