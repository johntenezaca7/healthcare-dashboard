import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { patientCreateSchema } from '@/schemas/patient';

import { MedicalInfoForm } from '../MedicalInfoForm';

import { createFormWithSubmit } from '@/test/form-test-utils';
import { render } from '@/test/utils';

const FormWithSubmit = createFormWithSubmit(patientCreateSchema);

describe('MedicalInfoForm', () => {
  const defaultFormValues = {
    lastVisit: undefined as string | undefined,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: undefined,
    },
    insurance: {
      provider: '',
      policyNumber: '',
      groupNumber: undefined,
      effectiveDate: '',
      expirationDate: undefined,
      copay: undefined as any,
      deductible: undefined as any,
    },
    allergies: [],
    conditions: [],
    medications: [],
    status: 'active' as const,
  };

  it('renders the form', () => {
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {form => <MedicalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    expect(screen.getByText('Medical Information')).toBeInTheDocument();
    expect(screen.getByLabelText(/last visit/i)).toBeInTheDocument();
  });

  it('displays form field with initial value', () => {
    render(
      <FormWithSubmit
        defaultValues={{
          ...defaultFormValues,
          lastVisit: '2024-01-15',
        }}
      >
        {form => <MedicalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    const lastVisitInput = screen.getByLabelText(/last visit/i) as HTMLInputElement;
    expect(lastVisitInput.value).toBe('2024-01-15');
  });

  it('allows last visit to be optional', () => {
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {form => <MedicalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    const lastVisitInput = screen.getByLabelText(/last visit/i) as HTMLInputElement;
    expect(lastVisitInput.value).toBe('');
  });

  it('updates form value when user selects date', async () => {
    const user = userEvent.setup();
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {form => <MedicalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    const lastVisitInput = screen.getByLabelText(/last visit/i) as HTMLInputElement;
    await user.type(lastVisitInput, '2024-01-15');

    expect(lastVisitInput.value).toBe('2024-01-15');
  });

  it('handles date input correctly', async () => {
    const user = userEvent.setup();
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {form => <MedicalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    const lastVisitInput = screen.getByLabelText(/last visit/i) as HTMLInputElement;
    await user.clear(lastVisitInput);
    await user.type(lastVisitInput, '2024-12-31');

    expect(lastVisitInput.value).toBe('2024-12-31');
  });

  it('allows clearing the date field', async () => {
    const user = userEvent.setup();
    render(
      <FormWithSubmit
        defaultValues={{
          ...defaultFormValues,
          lastVisit: '2024-01-15',
        }}
      >
        {form => <MedicalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    const lastVisitInput = screen.getByLabelText(/last visit/i) as HTMLInputElement;
    await user.clear(lastVisitInput);

    expect(lastVisitInput.value).toBe('');
  });
});
