import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/utils';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EmergencyContactForm } from '../EmergencyContactForm';
import { patientCreateSchema } from '../schemas';
import type { PatientCreateFormData } from '../schemas';
import type { PatientCreateFormApi } from '../types';

const FormWrapper = ({ 
  defaultValues, 
  children 
}: { 
  defaultValues: Partial<PatientCreateFormData>; 
  children: (form: PatientCreateFormApi) => React.ReactNode;
}) => {
  const form = useForm<PatientCreateFormData>({
    resolver: yupResolver(patientCreateSchema),
    defaultValues: defaultValues as PatientCreateFormData,
    mode: 'onChange',
    criteriaMode: 'all',
  }) as PatientCreateFormApi;
  return <FormProvider {...form}>{children(form)}</FormProvider>;
};

describe('EmergencyContactForm', () => {
  const defaultFormValues = {
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: undefined as string | undefined,
    },
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
    insurance: {
      provider: '',
      policyNumber: '',
      groupNumber: undefined,
      effectiveDate: '',
      expirationDate: undefined,
      copay: 0,
      deductible: 0,
    },
    allergies: [],
    conditions: [],
    medications: [],
    status: 'active' as const,
  };

  it('renders all form fields', () => {
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <EmergencyContactForm control={form.control} />}
      </FormWrapper>
    );

    expect(screen.getByText('Emergency Contact')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/relationship/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('displays form fields with initial values', () => {
    render(
      <FormWrapper
        defaultValues={{
          ...defaultFormValues,
          emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '555-5678',
            email: 'jane@example.com',
          },
        }}
      >
        {(form) => <EmergencyContactForm control={form.control} />}
      </FormWrapper>
    );

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const relationshipInput = screen.getByLabelText(/relationship/i) as HTMLInputElement;
    const phoneInput = screen.getByLabelText(/phone/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

    expect(nameInput.value).toBe('Jane Doe');
    expect(relationshipInput.value).toBe('Spouse');
    expect(phoneInput.value).toBe('555-5678');
    expect(emailInput.value).toBe('jane@example.com');
  });

  it('validates emergency contact name is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <form onSubmit={form.handleSubmit(() => {})}>
            <EmergencyContactForm control={form.control} />
            <button type="submit">Submit</button>
          </form>
        )}
      </FormWrapper>
    );

    const nameInput = screen.getByLabelText(/name/i);
    await user.click(nameInput);
    await user.tab();

    // Trigger validation by attempting to submit
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/emergency contact name is required/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('validates relationship is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <form onSubmit={form.handleSubmit(() => {})}>
            <EmergencyContactForm control={form.control} />
            <button type="submit">Submit</button>
          </form>
        )}
      </FormWrapper>
    );

    const relationshipInput = screen.getByLabelText(/relationship/i);
    await user.click(relationshipInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/relationship is required/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('validates phone is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <form onSubmit={form.handleSubmit(() => {})}>
            <EmergencyContactForm control={form.control} />
            <button type="submit">Submit</button>
          </form>
        )}
      </FormWrapper>
    );

    const phoneInput = screen.getByLabelText(/phone/i);
    await user.click(phoneInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/emergency contact phone is required/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('validates email format when provided', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <EmergencyContactForm control={form.control} />}
      </FormWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('allows email to be optional', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <EmergencyContactForm control={form.control} />}
      </FormWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(emailInput.value).toBe('');

    // Should not show error if left empty
    await user.click(emailInput);
    await user.tab();

    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/required/i);
      const emailErrors = errorMessages.filter(msg => 
        msg.textContent?.toLowerCase().includes('email')
      );
      expect(emailErrors.length).toBe(0);
    });
  });

  it('updates form values when user types', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <EmergencyContactForm control={form.control} />}
      </FormWrapper>
    );

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, 'John Smith');

    expect(nameInput).toHaveValue('John Smith');
  });

  it('applies error styling to invalid fields', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <form onSubmit={form.handleSubmit(() => {})}>
            <EmergencyContactForm control={form.control} />
            <button type="submit">Submit</button>
          </form>
        )}
      </FormWrapper>
    );

    const nameInput = screen.getByLabelText(/name/i);
    await user.click(nameInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(nameInput).toHaveClass('border-destructive');
    }, { timeout: 3000 });
  });
});
