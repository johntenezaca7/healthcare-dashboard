import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/utils';
import { createFormWithSubmit } from '@/test/form-test-utils';
import { PersonalInfoForm } from '../PersonalInfoForm';
import { patientCreateSchema } from '@/schemas/patient';
import type { PatientCreateFormData } from '@/schemas/patient';

const FormWithSubmit = createFormWithSubmit(patientCreateSchema);

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
    status: 'active',
  };

  it('renders first name label and input', () => {
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <PersonalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    // Verify the first name label is shown
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
  });

  it('validates first name is required after clearing input', async () => {
    const user = userEvent.setup();
    
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <PersonalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    await waitFor(() => {
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });

    const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;

    await user.type(firstNameInput, 'John');
    await waitFor(() => {
      expect(firstNameInput.value).toBe('John');
    });

    await user.clear(firstNameInput);
    await waitFor(() => {
      expect(firstNameInput.value).toBe('');
    });

    await user.tab();

    await waitFor(
      () => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
        expect(firstNameInput).toHaveClass('border-destructive');
      }
    );
  });

  it('renders all form fields', () => {
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <PersonalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
    expect(screen.getByText(/blood type/i)).toBeInTheDocument();
  });

  it('validates last name is required after clearing input', async () => {
    const user = userEvent.setup();
    
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <PersonalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    const lastNameInput = screen.getByLabelText(/last name/i) as HTMLInputElement;

    await user.type(lastNameInput, 'Doe');
    await waitFor(() => {
      expect(lastNameInput.value).toBe('Doe');
    });

    await user.clear(lastNameInput);
    await user.tab();

    await waitFor(
      () => {
        expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
        expect(lastNameInput).toHaveClass('border-destructive');
      }
    );
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <PersonalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(
      () => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
        expect(emailInput).toHaveClass('border-destructive');
      }
    );
  });

  it('validates date of birth is required', async () => {
    const user = userEvent.setup();
    
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <PersonalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    const dobInput = screen.getByLabelText(/date of birth/i) as HTMLInputElement;

    await user.type(dobInput, '1990-01-01');
    await waitFor(() => {
      expect(dobInput.value).toBe('1990-01-01');
    });

    await user.clear(dobInput);
    await user.tab();

    await waitFor(
      () => {
        expect(screen.getByText(/date of birth is required/i)).toBeInTheDocument();
        expect(dobInput).toHaveClass('border-destructive');
      }
    );
  });

  it('validates phone is required', async () => {
    const user = userEvent.setup();
    
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <PersonalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    const phoneInput = screen.getByLabelText(/phone/i) as HTMLInputElement;

    await user.type(phoneInput, '555-1234');
    await waitFor(() => {
      expect(phoneInput.value).toBe('555-1234');
    });

    await user.clear(phoneInput);
    await user.tab();

    await waitFor(
      () => {
        expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
        expect(phoneInput).toHaveClass('border-destructive');
      }
    );
  });

  it('validates address fields are required', async () => {
    const user = userEvent.setup();
    
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <PersonalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    const streetInput = screen.getByLabelText(/street address/i) as HTMLInputElement;
    const cityInput = screen.getByLabelText(/city/i) as HTMLInputElement;
    const stateInput = screen.getByLabelText(/state/i) as HTMLInputElement;
    const zipInput = screen.getByLabelText(/zip code/i) as HTMLInputElement;

    // Test street address
    await user.type(streetInput, '123 Main St');
    await user.clear(streetInput);
    await user.tab();

    await waitFor(
      () => {
        expect(screen.getByText(/street address is required/i)).toBeInTheDocument();
      }
    );

    // Test city
    await user.type(cityInput, 'New York');
    await user.clear(cityInput);
    await user.tab();

    await waitFor(
      () => {
        expect(screen.getByText(/city is required/i)).toBeInTheDocument();
      }
    );

    // Test state
    await user.type(stateInput, 'NY');
    await user.clear(stateInput);
    await user.tab();

    await waitFor(
      () => {
        expect(screen.getByText(/state is required/i)).toBeInTheDocument();
      }
    );

    // Test zip code
    await user.type(zipInput, '10001');
    await user.clear(zipInput);
    await user.tab();

    await waitFor(
      () => {
        expect(screen.getByText(/zip code is required/i)).toBeInTheDocument();
      }
    );
  });

  it('updates form values when user types', async () => {
    const user = userEvent.setup();
    
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <PersonalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
    const lastNameInput = screen.getByLabelText(/last name/i) as HTMLInputElement;

    await user.type(firstNameInput, 'Jane');
    await user.type(lastNameInput, 'Smith');

    await waitFor(() => {
      expect(firstNameInput.value).toBe('Jane');
      expect(lastNameInput.value).toBe('Smith');
    });
  });

  it('allows blood type to be optional', () => {
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <PersonalInfoForm control={form.control} />}
      </FormWithSubmit>
    );

    // Blood type should not show as required
    const bloodTypeLabel = screen.getByText(/blood type/i);
    expect(bloodTypeLabel).toBeInTheDocument();
    expect(bloodTypeLabel.textContent).not.toContain('*');
  });
});
