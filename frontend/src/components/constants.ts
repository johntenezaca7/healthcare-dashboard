export const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const statuses = ['active', 'inactive', 'critical'];
export const statusesDisplay = ['Active', 'Inactive', 'Critical'];
export const statusValues: Record<string, string> = {
  Active: 'active',
  Inactive: 'inactive',
  Critical: 'critical',
};

export const insuranceProviders = [
  'Aetna',
  'Blue Cross Blue Shield',
  'Cigna',
  'UnitedHealthcare',
  'Humana',
  'Kaiser Permanente',
  'Medicare',
  'Medicaid',
  'Other',
];

export const commonAllergies = [
  'Latex',
  'Pollen',
  'Peanuts',
  'Tree Nuts',
  'Shellfish',
  'Dairy',
  'Eggs',
  'Soy',
  'Wheat',
  'Penicillin',
  'Aspirin',
  'Ibuprofen',
];

export const commonMedications = [
  'Levothyroxine',
  'Acetaminophen',
  'Ibuprofen',
  'Metformin',
  'Amlodipine',
  'Lisinopril',
  'Atorvastatin',
  'Albuterol',
  'Omeprazole',
  'Metoprolol',
];

export const commonConditions = [
  'Hypertension',
  'Diabetes',
  'Asthma',
  'Arthritis',
  'Heart Disease',
  'High Cholesterol',
  'Depression',
  'Anxiety',
  'COPD',
  'Obesity',
];

export const lastVisitOptions = [
  'Last Week',
  'Last Month',
  'Last 3 Months',
  'Last 6 Months',
  'Last Year',
  'Over a Year Ago',
];

export const lastVisitValues: Record<string, string> = {
  'Last Week': 'last_week',
  'Last Month': 'last_month',
  'Last 3 Months': 'last_3_months',
  'Last 6 Months': 'last_6_months',
  'Last Year': 'last_year',
  'Over a Year Ago': 'over_year',
};

export const filter = {
  InsuranceProvider: 'insuranceProvider',
  Allergies: 'allergies',
  CurrentMedications: 'currentMedications',
  Conditions: 'conditions',
  BloodType: 'bloodType',
  LastVisit: 'lastVisit',
  Status: 'status',
} as const;

export const placeholder = {
  Insurance: 'Insurance',
  Allergies: 'Allergies',
  Medications: 'Medications',
  Conditions: 'Conditions',
  BloodType: 'Blood Type',
  LastVisit: 'Last Visit',
  Status: 'Status',
} as const;

export const defaultNA = 'N/A';
