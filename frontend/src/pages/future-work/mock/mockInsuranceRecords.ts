export interface InsuranceRecord {
  id: string;
  patientName: string;
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string | null;
  effectiveDate: string;
  expirationDate: string | null;
  copay: number;
  deductible: number;
  status: 'active' | 'expired' | 'pending';
}

export const mockInsuranceRecords: InsuranceRecord[] = [
  {
    id: '1',
    patientName: 'John Doe',
    insuranceProvider: 'Blue Cross Blue Shield',
    policyNumber: 'BC123456789',
    groupNumber: 'GRP001',
    effectiveDate: '2023-01-01',
    expirationDate: '2024-12-31',
    copay: 25.0,
    deductible: 1000.0,
    status: 'active',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    insuranceProvider: 'Aetna',
    policyNumber: 'AET987654321',
    groupNumber: 'GRP002',
    effectiveDate: '2023-06-01',
    expirationDate: '2024-05-31',
    copay: 30.0,
    deductible: 1500.0,
    status: 'active',
  },
  {
    id: '3',
    patientName: 'Robert Brown',
    insuranceProvider: 'UnitedHealthcare',
    policyNumber: 'UHC456789123',
    groupNumber: null,
    effectiveDate: '2022-01-01',
    expirationDate: '2023-12-31',
    copay: 20.0,
    deductible: 2000.0,
    status: 'expired',
  },
  {
    id: '4',
    patientName: 'Emily Davis',
    insuranceProvider: 'Cigna',
    policyNumber: 'CIG789123456',
    groupNumber: 'GRP003',
    effectiveDate: '2024-01-01',
    expirationDate: null,
    copay: 35.0,
    deductible: 1200.0,
    status: 'active',
  },
  {
    id: '5',
    patientName: 'James Wilson',
    insuranceProvider: 'Humana',
    policyNumber: 'HUM321654987',
    groupNumber: 'GRP004',
    effectiveDate: '2024-02-01',
    expirationDate: null,
    copay: 40.0,
    deductible: 800.0,
    status: 'pending',
  },
  {
    id: '6',
    patientName: 'Lisa Anderson',
    insuranceProvider: 'Medicare',
    policyNumber: 'MED123456789',
    groupNumber: null,
    effectiveDate: '2023-01-01',
    expirationDate: null,
    copay: 0.0,
    deductible: 0.0,
    status: 'active',
  },
  {
    id: '7',
    patientName: 'David Martinez',
    insuranceProvider: 'Kaiser Permanente',
    policyNumber: 'KP987654321',
    groupNumber: 'GRP005',
    effectiveDate: '2023-09-01',
    expirationDate: '2024-08-31',
    copay: 25.0,
    deductible: 1500.0,
    status: 'active',
  },
  {
    id: '8',
    patientName: 'Maria Garcia',
    insuranceProvider: 'Medicaid',
    policyNumber: 'MDC456789123',
    groupNumber: null,
    effectiveDate: '2023-01-01',
    expirationDate: null,
    copay: 0.0,
    deductible: 0.0,
    status: 'active',
  },
];
