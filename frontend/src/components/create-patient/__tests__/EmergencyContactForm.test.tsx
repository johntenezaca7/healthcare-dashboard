import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/utils';
import { createFormWithSubmit } from '@/test/form-test-utils';
import { EmergencyContactForm } from '../EmergencyContactForm';
import { patientCreateSchema } from '@/schemas/patient';

const FormWithSubmit = createFormWithSubmit(patientCreateSchema);

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
      copay: undefined as any,
      deductible: undefined as any,
    },
    allergies: [],
    conditions: [],
    medications: [],
    status: 'active' as const,
  };

  it('renders all form fields', () => {
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <EmergencyContactForm control={form.control} />}
      </FormWithSubmit>
    );

    expect(screen.getByText('Emergency Contact')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/relationship/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('displays form fields with initial values', () => {
    render(
      <FormWithSubmit
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
      </FormWithSubmit>
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
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <EmergencyContactForm control={form.control} />}
      </FormWithSubmit>
    );

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    await user.type(nameInput, 'John');
    await waitFor(() => {
      expect(nameInput.value).toBe('John');
    });

    await user.clear(nameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/emergency contact name is required/i)).toBeInTheDocument();
      expect(nameInput).toHaveClass('border-destructive');
    });
  });

  it('validates relationship is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <EmergencyContactForm control={form.control} />}
      </FormWithSubmit>
    );

    const relationshipInput = screen.getByLabelText(/relationship/i) as HTMLInputElement;
    await user.type(relationshipInput, 'Spouse');
    await waitFor(() => {
      expect(relationshipInput.value).toBe('Spouse');
    });

    await user.clear(relationshipInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/relationship is required/i)).toBeInTheDocument();
      expect(relationshipInput).toHaveClass('border-destructive');
    });
  });

  it('validates phone is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <EmergencyContactForm control={form.control} />}
      </FormWithSubmit>
    );

    const phoneInput = screen.getByLabelText(/phone/i) as HTMLInputElement;
    await user.type(phoneInput, '555-1234');
    await waitFor(() => {
      expect(phoneInput.value).toBe('555-1234');
    });

    await user.clear(phoneInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/emergency contact phone is required/i)).toBeInTheDocument();
      expect(phoneInput).toHaveClass('border-destructive');
    });
  });

  it('validates email format when provided', async () => {
    const user = userEvent.setup();
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <EmergencyContactForm control={form.control} />}
      </FormWithSubmit>
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
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <EmergencyContactForm control={form.control} />}
      </FormWithSubmit>
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
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <EmergencyContactForm control={form.control} />}
      </FormWithSubmit>
    );

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, 'John Smith');

    expect(nameInput).toHaveValue('John Smith');
  });

  it('applies error styling to invalid fields', async () => {
    const user = userEvent.setup();
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => <EmergencyContactForm control={form.control} />}
      </FormWithSubmit>
    );

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    await user.type(nameInput, 'John');
    await user.clear(nameInput);
    await user.tab();

    await waitFor(() => {
      expect(nameInput).toHaveClass('border-destructive');
    });
  });
});
