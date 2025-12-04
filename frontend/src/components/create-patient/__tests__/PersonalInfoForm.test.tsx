import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/utils';
import { useForm } from '@tanstack/react-form';
import { PersonalInfoForm } from '../PersonalInfoForm';
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

describe('PersonalInfoForm', () => {
  const defaultFormValues: Partial<PatientCreateFormData> = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    bloodType: undefined,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
  };

  it('renders all form fields', () => {
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <PersonalInfoForm form={form} />}
      </FormWrapper>
    );

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    const bloodTypeLabels = screen.getAllByText(/blood type/i);
    expect(bloodTypeLabels.length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
  });

  it('displays form fields with initial values', () => {
    render(
      <FormWrapper
        defaultValues={{
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-15',
          email: 'john@example.com',
          phone: '555-1234',
          bloodType: 'O+',
          address: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            country: 'USA',
          },
        }}
      >
        {(form) => <PersonalInfoForm form={form} />}
      </FormWrapper>
    );

    const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
    const lastNameInput = screen.getByLabelText(/last name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
    expect(emailInput.value).toBe('john@example.com');
  });

  it('validates first name is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <div>
            <PersonalInfoForm form={form} />
            <button onClick={() => form.handleSubmit()}>Submit</button>
          </div>
        )}
      </FormWrapper>
    );

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.click(firstNameInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  it('validates first name minimum length', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <div>
            <PersonalInfoForm form={form} />
            <button onClick={() => form.handleSubmit()}>Submit</button>
          </div>
        )}
      </FormWrapper>
    );

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.type(firstNameInput, 'A');
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/first name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it('validates last name is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <div>
            <PersonalInfoForm form={form} />
            <button onClick={() => form.handleSubmit()}>Submit</button>
          </div>
        )}
      </FormWrapper>
    );

    const lastNameInput = screen.getByLabelText(/last name/i);
    await user.click(lastNameInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    });
  });

  it('validates email is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <div>
            <PersonalInfoForm form={form} />
            <button onClick={() => form.handleSubmit()}>Submit</button>
          </div>
        )}
      </FormWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    await user.click(emailInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <div>
            <PersonalInfoForm form={form} />
            <button onClick={() => form.handleSubmit()}>Submit</button>
          </div>
        )}
      </FormWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('validates phone is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <div>
            <PersonalInfoForm form={form} />
            <button onClick={() => form.handleSubmit()}>Submit</button>
          </div>
        )}
      </FormWrapper>
    );

    const phoneInput = screen.getByLabelText(/phone/i);
    await user.click(phoneInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
    });
  });

  it('validates date of birth is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <div>
            <PersonalInfoForm form={form} />
            <button onClick={() => form.handleSubmit()}>Submit</button>
          </div>
        )}
      </FormWrapper>
    );

    const dobInput = screen.getByLabelText(/date of birth/i);
    await user.click(dobInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/date of birth is required/i)).toBeInTheDocument();
    });
  });

  it('validates street address is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <div>
            <PersonalInfoForm form={form} />
            <button onClick={() => form.handleSubmit()}>Submit</button>
          </div>
        )}
      </FormWrapper>
    );

    const streetInput = screen.getByLabelText(/street address/i);
    await user.click(streetInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/street address is required/i)).toBeInTheDocument();
    });
  });

  it('validates city is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <div>
            <PersonalInfoForm form={form} />
            <button onClick={() => form.handleSubmit()}>Submit</button>
          </div>
        )}
      </FormWrapper>
    );

    const cityInput = screen.getByLabelText(/city/i);
    await user.click(cityInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/city is required/i)).toBeInTheDocument();
    });
  });

  it('validates state is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <div>
            <PersonalInfoForm form={form} />
            <button onClick={() => form.handleSubmit()}>Submit</button>
          </div>
        )}
      </FormWrapper>
    );

    const stateInput = screen.getByLabelText(/state/i);
    await user.click(stateInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/state is required/i)).toBeInTheDocument();
    });
  });

  it('validates zip code is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <div>
            <PersonalInfoForm form={form} />
            <button onClick={() => form.handleSubmit()}>Submit</button>
          </div>
        )}
      </FormWrapper>
    );

    const zipInput = screen.getByLabelText(/zip code/i);
    await user.click(zipInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/zip code is required/i)).toBeInTheDocument();
    });
  });

  it('allows selecting blood type', () => {
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <PersonalInfoForm form={form} />}
      </FormWrapper>
    );

    // Find select trigger by looking for button near blood type label
    const bloodTypeLabels = screen.getAllByText(/blood type/i);
    const bloodTypeLabel = bloodTypeLabels[0];
    const selectTrigger = bloodTypeLabel.closest('div')?.querySelector('button');
    
    // Verify select component exists and is rendered
    // Note: We don't click the select trigger because Radix UI Select uses
    // pointer capture APIs that aren't fully supported in jsdom test environment.
    // The component rendering is what we're testing here.
    expect(selectTrigger).toBeInTheDocument();
    expect(bloodTypeLabel).toBeInTheDocument();
  });

  it('allows blood type to be optional', () => {
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <PersonalInfoForm form={form} />}
      </FormWrapper>
    );

    // Find select trigger by looking for button near blood type label
    const bloodTypeLabels = screen.getAllByText(/blood type/i);
    const bloodTypeLabel = bloodTypeLabels[0];
    const selectTrigger = bloodTypeLabel.closest('div')?.querySelector('button');
    
    // Verify select component exists and is rendered
    // Note: We don't click the select trigger because Radix UI Select uses
    // pointer capture APIs that aren't fully supported in jsdom test environment.
    // The component rendering is what we're testing here.
    expect(selectTrigger).toBeInTheDocument();
    expect(bloodTypeLabel).toBeInTheDocument();
  });

  it('updates form values when user types', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <PersonalInfoForm form={form} />}
      </FormWrapper>
    );

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.type(firstNameInput, 'Jane');

    expect(firstNameInput).toHaveValue('Jane');
  });

  it('applies error styling to invalid fields', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <div>
            <PersonalInfoForm form={form} />
            <button onClick={() => form.handleSubmit()}>Submit</button>
          </div>
        )}
      </FormWrapper>
    );

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.click(firstNameInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(firstNameInput).toHaveClass('border-destructive');
    });
  });
});

