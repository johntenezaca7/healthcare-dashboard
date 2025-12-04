import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/utils';
import { useForm } from '@tanstack/react-form';
import { MedicalInfoForm } from '../MedicalInfoForm';
import type { PatientCreateFormData } from '../schemas';
import type { PatientCreateFormApi } from '../types';

const FormWrapper = ({ 
  defaultValues, 
  children 
}: { 
  defaultValues: Partial<PatientCreateFormData>; 
  children: (form: PatientCreateFormApi) => React.ReactNode;
}) => {
  const form = useForm({
    defaultValues: defaultValues as PatientCreateFormData,
    onSubmit: async () => {},
  }) as PatientCreateFormApi;
  return <>{children(form)}</>;
};

describe('MedicalInfoForm', () => {
  const defaultFormValues = {
    lastVisit: undefined as string | undefined,
  };

  it('renders the form', () => {
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <MedicalInfoForm form={form} />}
      </FormWrapper>
    );

    expect(screen.getByText('Medical Information')).toBeInTheDocument();
    expect(screen.getByLabelText(/last visit/i)).toBeInTheDocument();
  });

  it('displays form field with initial value', () => {
    render(
      <FormWrapper
        defaultValues={{
          lastVisit: '2024-01-15',
        }}
      >
        {(form) => <MedicalInfoForm form={form} />}
      </FormWrapper>
    );

    const lastVisitInput = screen.getByLabelText(/last visit/i) as HTMLInputElement;
    expect(lastVisitInput.value).toBe('2024-01-15');
  });

  it('allows last visit to be optional', () => {
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <MedicalInfoForm form={form} />}
      </FormWrapper>
    );

    const lastVisitInput = screen.getByLabelText(/last visit/i) as HTMLInputElement;
    expect(lastVisitInput.value).toBe('');
  });

  it('updates form value when user selects date', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <MedicalInfoForm form={form} />}
      </FormWrapper>
    );

    const lastVisitInput = screen.getByLabelText(/last visit/i) as HTMLInputElement;
    await user.type(lastVisitInput, '2024-01-15');

    expect(lastVisitInput.value).toBe('2024-01-15');
  });

  it('handles date input correctly', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <MedicalInfoForm form={form} />}
      </FormWrapper>
    );

    const lastVisitInput = screen.getByLabelText(/last visit/i) as HTMLInputElement;
    await user.clear(lastVisitInput);
    await user.type(lastVisitInput, '2024-12-31');

    expect(lastVisitInput.value).toBe('2024-12-31');
  });

  it('allows clearing the date field', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper
        defaultValues={{
          lastVisit: '2024-01-15',
        }}
      >
        {(form) => <MedicalInfoForm form={form} />}
      </FormWrapper>
    );

    const lastVisitInput = screen.getByLabelText(/last visit/i) as HTMLInputElement;
    await user.clear(lastVisitInput);

    expect(lastVisitInput.value).toBe('');
  });
});

