import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/utils';
import { useForm } from '@tanstack/react-form';
import { EmergencyContactForm } from '../EmergencyContactForm';
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

describe('EmergencyContactForm', () => {
  const defaultFormValues = {
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: undefined as string | undefined,
    },
  };

  it('renders all form fields', () => {
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <EmergencyContactForm form={form} />}
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
          emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '555-5678',
            email: 'jane@example.com',
          },
        }}
      >
        {(form) => <EmergencyContactForm form={form} />}
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
          <div>
            <EmergencyContactForm form={form} />
            <button onClick={() => form.handleSubmit()}>Submit</button>
          </div>
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
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('validates relationship is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <div>
            <EmergencyContactForm form={form} />
            <button onClick={() => form.handleSubmit()}>Submit</button>
          </div>
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
    });
  });

  it('validates phone is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <div>
            <EmergencyContactForm form={form} />
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

  it('validates email format when provided', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <EmergencyContactForm form={form} />}
      </FormWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('allows email to be optional', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <EmergencyContactForm form={form} />}
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
        {(form) => <EmergencyContactForm form={form} />}
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
          <div>
            <EmergencyContactForm form={form} />
            <button onClick={() => form.handleSubmit()}>Submit</button>
          </div>
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
    });
  });
});

