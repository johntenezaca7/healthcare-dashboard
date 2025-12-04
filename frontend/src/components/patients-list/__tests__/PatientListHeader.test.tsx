import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { PatientListHeader } from '../PatientListHeader';

describe('PatientListHeader', () => {
  it('renders header with title', () => {
    render(<PatientListHeader total={0} />);

    expect(screen.getByText('Patients')).toBeInTheDocument();
  });

  it('displays total count when total > 0', () => {
    render(<PatientListHeader total={42} />);

    expect(screen.getByText(/view and manage patient records/i)).toBeInTheDocument();
    expect(screen.getByText(/\(42 total\)/i)).toBeInTheDocument();
  });

  it('does not display total count when total is 0', () => {
    render(<PatientListHeader total={0} />);

    expect(screen.getByText(/view and manage patient records/i)).toBeInTheDocument();
    expect(screen.queryByText(/\(0 total\)/i)).not.toBeInTheDocument();
  });

  it('renders New Patient button', () => {
    render(<PatientListHeader total={0} />);

    const newPatientButton = screen.getByRole('link', { name: /new patient/i });
    expect(newPatientButton).toBeInTheDocument();
  });

  it('New Patient button links to create patient route', () => {
    render(<PatientListHeader total={0} />);

    const newPatientButton = screen.getByRole('link', { name: /new patient/i });
    expect(newPatientButton).toHaveAttribute('href', '/patients/new');
  });

  it('displays correct total for different values', () => {
    const { rerender } = render(<PatientListHeader total={10} />);

    expect(screen.getByText(/\(10 total\)/i)).toBeInTheDocument();

    rerender(<PatientListHeader total={100} />);
    expect(screen.getByText(/\(100 total\)/i)).toBeInTheDocument();
  });

  it('renders Plus icon in New Patient button', () => {
    render(<PatientListHeader total={0} />);

    const newPatientButton = screen.getByRole('link', { name: /new patient/i });
    // Icon should be present (lucide-react icons render as SVGs)
    const icon = newPatientButton.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});

