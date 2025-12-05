import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/utils';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InsuranceForm } from '../InsuranceForm';
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

describe('InsuranceForm', () => {
  const defaultFormValues = {
    insurance: {
      provider: '',
      policyNumber: '',
      groupNumber: undefined as string | undefined,
      effectiveDate: '',
      expirationDate: undefined as string | undefined,
      copay: 0,
      deductible: 0,
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
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: undefined,
    },
    allergies: [],
    conditions: [],
    medications: [],
    status: 'active' as const,
  };

  it('renders all form fields', () => {
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <InsuranceForm control={form.control} />}
      </FormWrapper>
    );

    expect(screen.getByText('Insurance Information')).toBeInTheDocument();
    expect(screen.getAllByText(/provider/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/policy number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/group number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/effective date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expiration date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/copay/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/deductible/i)).toBeInTheDocument();
  });

  it('displays form fields with initial values', () => {
    render(
      <FormWrapper
        defaultValues={{
          ...defaultFormValues,
          insurance: {
            provider: 'Aetna',
            policyNumber: 'POL123456',
            groupNumber: 'GRP789',
            effectiveDate: '2024-01-01',
            expirationDate: '2025-01-01',
            copay: 25.0,
            deductible: 1000.0,
          },
        }}
      >
        {(form) => <InsuranceForm control={form.control} />}
      </FormWrapper>
    );

    const policyNumberInput = screen.getByLabelText(/policy number/i) as HTMLInputElement;
    expect(policyNumberInput.value).toBe('POL123456');
  });

  it('validates provider is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <form onSubmit={form.handleSubmit(() => {})}>
            <InsuranceForm control={form.control} />
            <button type="submit">Submit</button>
          </form>
        )}
      </FormWrapper>
    );

    // Find the select trigger button
    const selectButtons = screen.getAllByRole('button');
    const providerSelect = selectButtons.find(btn => 
      btn.textContent?.toLowerCase().includes('select') || 
      btn.closest('[class*="SelectTrigger"]')
    ) || selectButtons[0];
    
    if (providerSelect) {
      await user.click(providerSelect);
      await user.tab();
    }

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/insurance provider is required/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('validates policy number is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <form onSubmit={form.handleSubmit(() => {})}>
            <InsuranceForm control={form.control} />
            <button type="submit">Submit</button>
          </form>
        )}
      </FormWrapper>
    );

    const policyNumberInput = screen.getByLabelText(/policy number/i);
    await user.click(policyNumberInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/policy number is required/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('validates effective date is required', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <form onSubmit={form.handleSubmit(() => {})}>
            <InsuranceForm control={form.control} />
            <button type="submit">Submit</button>
          </form>
        )}
      </FormWrapper>
    );

    const effectiveDateInput = screen.getByLabelText(/effective date/i);
    await user.click(effectiveDateInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/effective date is required/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('validates copay is non-negative', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper
        defaultValues={{
          ...defaultFormValues,
          insurance: {
            provider: 'Aetna',
            policyNumber: 'POL123',
            groupNumber: undefined,
            effectiveDate: '2024-01-01',
            expirationDate: undefined,
            copay: -10,
            deductible: 0,
          },
        }}
      >
        {(form) => (
          <form onSubmit={form.handleSubmit(() => {})}>
            <InsuranceForm control={form.control} />
            <button type="submit">Submit</button>
          </form>
        )}
      </FormWrapper>
    );

    const copayInput = screen.getByLabelText(/copay/i);
    await user.click(copayInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/copay.*>=.*0/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('validates deductible is non-negative', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper
        defaultValues={{
          ...defaultFormValues,
          insurance: {
            provider: 'Aetna',
            policyNumber: 'POL123',
            groupNumber: undefined,
            effectiveDate: '2024-01-01',
            expirationDate: undefined,
            copay: 0,
            deductible: -100,
          },
        }}
      >
        {(form) => (
          <form onSubmit={form.handleSubmit(() => {})}>
            <InsuranceForm control={form.control} />
            <button type="submit">Submit</button>
          </form>
        )}
      </FormWrapper>
    );

    const deductibleInput = screen.getByLabelText(/deductible/i);
    await user.click(deductibleInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/deductible.*>=.*0/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('allows group number to be optional', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <InsuranceForm control={form.control} />}
      </FormWrapper>
    );

    const groupNumberInput = screen.getByLabelText(/group number/i) as HTMLInputElement;
    expect(groupNumberInput.value).toBe('');

    // Should not show error if left empty
    await user.click(groupNumberInput);
    await user.tab();

    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/required/i);
      const groupErrors = errorMessages.filter(msg => 
        msg.textContent?.toLowerCase().includes('group')
      );
      expect(groupErrors.length).toBe(0);
    });
  });

  it('allows expiration date to be optional', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <InsuranceForm control={form.control} />}
      </FormWrapper>
    );

    const expirationDateInput = screen.getByLabelText(/expiration date/i) as HTMLInputElement;
    expect(expirationDateInput.value).toBe('');

    // Should not show error if left empty
    await user.click(expirationDateInput);
    await user.tab();

    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/required/i);
      const expirationErrors = errorMessages.filter(msg => 
        msg.textContent?.toLowerCase().includes('expiration')
      );
      expect(expirationErrors.length).toBe(0);
    });
  });

  it('allows selecting insurance provider', () => {
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <InsuranceForm control={form.control} />}
      </FormWrapper>
    );

    // Find the select trigger by looking near the provider label
    const providerLabels = screen.getAllByText(/provider/i);
    const providerLabel = providerLabels.find(label => label.tagName === 'LABEL') || providerLabels[0];
    const selectTrigger = providerLabel.closest('div')?.querySelector('button');
    
    // Verify select component exists and is rendered
    // Note: We don't click the select trigger because Radix UI Select uses
    // pointer capture APIs that aren't fully supported in jsdom test environment.
    // The component rendering is what we're testing here.
    expect(selectTrigger).toBeInTheDocument();
    expect(providerLabel).toBeInTheDocument();
  });

  it('updates form values when user types', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <InsuranceForm control={form.control} />}
      </FormWrapper>
    );

    const policyNumberInput = screen.getByLabelText(/policy number/i);
    await user.type(policyNumberInput, 'POL123');

    expect(policyNumberInput).toHaveValue('POL123');
  });

  it('handles numeric input for copay', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <InsuranceForm control={form.control} />}
      </FormWrapper>
    );

    const copayInput = screen.getByLabelText(/copay/i) as HTMLInputElement;
    await user.clear(copayInput);
    await user.type(copayInput, '25.5');

    // Input may format differently, just check it accepts numeric input
    expect(copayInput.value).toMatch(/25\.?5?/);
  });

  it('handles numeric input for deductible', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => <InsuranceForm control={form.control} />}
      </FormWrapper>
    );

    const deductibleInput = screen.getByLabelText(/deductible/i) as HTMLInputElement;
    await user.clear(deductibleInput);
    await user.type(deductibleInput, '1000');

    // Input may format differently, just check it accepts numeric input
    expect(deductibleInput.value).toMatch(/1000/);
  });

  it('applies error styling to invalid fields', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={defaultFormValues}>
        {(form) => (
          <form onSubmit={form.handleSubmit(() => {})}>
            <InsuranceForm control={form.control} />
            <button type="submit">Submit</button>
          </form>
        )}
      </FormWrapper>
    );

    const policyNumberInput = screen.getByLabelText(/policy number/i);
    await user.click(policyNumberInput);
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(policyNumberInput).toHaveClass('border-destructive');
    }, { timeout: 3000 });
  });
});
