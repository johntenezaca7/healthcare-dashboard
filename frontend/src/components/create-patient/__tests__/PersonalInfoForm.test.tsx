import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/utils';
import { createFormWithSubmit } from '@/test/form-test-utils';
import { PersonalInfoForm } from '../PersonalInfoForm';
import { patientCreateSchema } from '@/schemas/patient';
import type { PatientCreateFormData } from '@/schemas/patient';
import type { UseFormReturn } from 'react-hook-form';

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
      copay: 0,
      deductible: 0,
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
    let formRef: UseFormReturn<PatientCreateFormData> | null = null;
    
    render(
      <FormWithSubmit defaultValues={defaultFormValues}>
        {(form) => {
          formRef = form;
          return <PersonalInfoForm control={form.control} />;
        }}
      </FormWithSubmit>
    );

    // Wait for form to be initialized and rendered
    await waitFor(() => {
      expect(formRef).not.toBeNull();
      // Verify the form is actually rendered by checking for the card title
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });

    // Step 1: Verify first name label and input are shown and visible
    await waitFor(() => {
      // Find input by ID since label uses htmlFor="firstName"
      const input = document.getElementById('firstName');
      expect(input).not.toBeNull();
      expect(input).toBeInstanceOf(HTMLInputElement);
      expect(input).toBeVisible();
    });

    // Get the input element
    const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
    expect(firstNameInput).not.toBeNull();

    // Step 2: Type in the input
    await user.type(firstNameInput, 'John');
    
    // Wait for the value to be set
    await waitFor(() => {
      expect(firstNameInput.value).toBe('John');
    });

    // Step 3: Clear the input
    await user.clear(firstNameInput);
    
    // Wait for the value to be cleared
    await waitFor(() => {
      expect(firstNameInput.value).toBe('');
    });

    // Step 4: Submit the form to trigger validation
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Step 5: Wait for form to be submitted and have errors
    await waitFor(
      () => {
        // Verify form is submitted
        expect(formRef?.formState.isSubmitted).toBe(true);
        // Verify form state has the error
        expect(formRef?.formState.errors.firstName).toBeDefined();
        expect(formRef?.formState.errors.firstName?.message).toBe('First name is required');
      },
      { timeout: 2000 }
    );

    // Step 6: Wait for UI to show the error message
    // The component should re-render when formState.errors changes
    await waitFor(
      () => {
        const errorElement = document.getElementById('firstName-error');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement?.textContent).toMatch(/first name is required/i);
      },
      { timeout: 2000 }
    );
  });
});
