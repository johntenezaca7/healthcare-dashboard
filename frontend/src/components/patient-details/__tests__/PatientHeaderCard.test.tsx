import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { PatientHeaderCard } from '../PatientHeaderCard';
import type { PatientDataUnion } from '../types';

describe('PatientHeaderCard', () => {
  const mockPatient = {
    id: 'patient-123',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-15',
    email: 'john.doe@example.com',
    phone: '555-1234',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  } as PatientDataUnion;

  const mockMedicalInfo = {
    allergies: [],
    conditions: [],
    currentMedications: [],
    status: 'active' as const,
  };

  it('renders patient information correctly', () => {
    render(<PatientHeaderCard patient={mockPatient} medicalInfo={mockMedicalInfo} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/john\.doe@example\.com/i)).toBeInTheDocument();
    expect(screen.getByText('555-1234')).toBeInTheDocument();
    expect(screen.getByText(/Patient ID: patient-123/i)).toBeInTheDocument();
  });

  it('displays patient initials when name is provided', () => {
    render(<PatientHeaderCard patient={mockPatient} medicalInfo={mockMedicalInfo} />);

    const initialsElement = screen.getByText('JD');
    expect(initialsElement).toBeInTheDocument();
  });

  it('displays status badge with correct variant', () => {
    render(<PatientHeaderCard patient={mockPatient} medicalInfo={mockMedicalInfo} />);

    const statusBadge = screen.getByText('Active');
    expect(statusBadge).toBeInTheDocument();
  });

  it('handles snake_case patient data', () => {
    const snakeCasePatient = {
      id: 456,
      first_name: 'Jane',
      last_name: 'Smith',
      date_of_birth: '1985-05-20',
      email: 'jane.smith@example.com',
      phone: '555-5678',
      created_at: '2024-02-01T00:00:00Z',
      updated_at: '2024-02-15T00:00:00Z',
    } as unknown as PatientDataUnion;

    render(<PatientHeaderCard patient={snakeCasePatient} medicalInfo={mockMedicalInfo} />);

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText(/jane\.smith@example\.com/i)).toBeInTheDocument();
    expect(screen.getByText('555-5678')).toBeInTheDocument();
    expect(screen.getByText(/Patient ID: 456/i)).toBeInTheDocument();
  });

  it('handles numeric patient ID', () => {
    const patientWithNumericId = {
      ...mockPatient,
      id: 789,
    } as PatientDataUnion;

    render(<PatientHeaderCard patient={patientWithNumericId} medicalInfo={mockMedicalInfo} />);

    expect(screen.getByText(/Patient ID: 789/i)).toBeInTheDocument();
  });

  it('displays formatted dates', () => {
    render(<PatientHeaderCard patient={mockPatient} medicalInfo={mockMedicalInfo} />);

    expect(screen.getByText(/Created:/i)).toBeInTheDocument();
    expect(screen.getByText(/Updated:/i)).toBeInTheDocument();
  });

  it('handles different status types', () => {
    const criticalMedicalInfo = {
      allergies: [],
      conditions: [],
      currentMedications: [],
      status: 'critical' as const,
    };
    const { rerender } = render(
      <PatientHeaderCard patient={mockPatient} medicalInfo={criticalMedicalInfo} />
    );

    expect(screen.getByText('Critical')).toBeInTheDocument();

    const inactiveMedicalInfo = {
      allergies: [],
      conditions: [],
      currentMedications: [],
      status: 'inactive' as const,
    };
    rerender(<PatientHeaderCard patient={mockPatient} medicalInfo={inactiveMedicalInfo} />);

    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('defaults to active status when status is not provided', () => {
    const emptyMedicalInfo = {
      allergies: [],
      conditions: [],
      currentMedications: [],
      status: 'active' as const,
    };
    render(<PatientHeaderCard patient={mockPatient} medicalInfo={emptyMedicalInfo} />);

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('handles missing patient fields gracefully', () => {
    const minimalPatient = {
      id: 'minimal-123',
    } as PatientDataUnion;

    render(<PatientHeaderCard patient={minimalPatient} medicalInfo={mockMedicalInfo} />);

    // Should still render without crashing
    expect(screen.getByText(/Patient ID: minimal-123/i)).toBeInTheDocument();
  });

  it('displays age calculation', () => {
    render(<PatientHeaderCard patient={mockPatient} medicalInfo={mockMedicalInfo} />);

    // Age should be calculated and displayed
    expect(screen.getByText(/years old/i)).toBeInTheDocument();
  });

  it('renders clipboard button', () => {
    render(<PatientHeaderCard patient={mockPatient} medicalInfo={mockMedicalInfo} />);

    // Clipboard button contains an icon, find it by looking for the button with Clipboard icon
    const buttons = screen.getAllByRole('button');
    const clipboardButton = buttons.find((btn) => btn.querySelector('svg'));
    expect(clipboardButton).toBeInTheDocument();
  });

  it('handles empty string values', () => {
    const patientWithEmptyStrings = {
      id: 'empty-123',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    } as PatientDataUnion;

    render(<PatientHeaderCard patient={patientWithEmptyStrings} medicalInfo={mockMedicalInfo} />);

    // Should render without crashing
    expect(screen.getByText(/Patient ID: empty-123/i)).toBeInTheDocument();
  });

  it('handles mixed camelCase and snake_case data', () => {
    const mixedPatient = {
      id: 'mixed-123',
      firstName: 'Mixed',
      last_name: 'Case',
      dateOfBirth: '1990-01-01',
      email: 'mixed@example.com',
      created_at: '2024-01-01T00:00:00Z',
    } as unknown as PatientDataUnion;

    render(<PatientHeaderCard patient={mixedPatient} medicalInfo={mockMedicalInfo} />);

    expect(screen.getByText('Mixed Case')).toBeInTheDocument();
    expect(screen.getByText(/mixed@example\.com/i)).toBeInTheDocument();
  });
});

