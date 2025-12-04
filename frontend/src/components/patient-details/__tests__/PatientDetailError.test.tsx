import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { PatientDetailError } from '../PatientDetailError';

describe('PatientDetailError', () => {
  it('renders error message when error is provided', () => {
    const error = new Error('Patient not found');
    render(<PatientDetailError error={error} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Patient not found')).toBeInTheDocument();
  });

  it('renders default message when error is null', () => {
    render(<PatientDetailError error={null} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Patient not found')).toBeInTheDocument();
  });

  it('renders default message when error is undefined', () => {
    render(<PatientDetailError error={undefined} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Patient not found')).toBeInTheDocument();
  });

  it('renders back to patients link', () => {
    render(<PatientDetailError error={null} />);

    const backLink = screen.getByRole('link', { name: /back to patients/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/patients');
  });

  it('displays custom error message', () => {
    const customError = new Error('Failed to load patient data');
    render(<PatientDetailError error={customError} />);

    expect(screen.getByText('Failed to load patient data')).toBeInTheDocument();
  });

  it('renders arrow icon in back button', () => {
    render(<PatientDetailError error={null} />);

    const backButton = screen.getByRole('link', { name: /back to patients/i });
    expect(backButton).toBeInTheDocument();
  });
});

