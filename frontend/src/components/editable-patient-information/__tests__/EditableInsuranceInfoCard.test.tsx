import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as hooks from '@/hooks';

import { EditableInsuranceInfoCard } from '../EditableInsuranceInfoCard';

import { render } from '@/test/utils';

vi.mock('@/hooks', () => ({
  useUpdatePatientInsuranceInfo: vi.fn(),
}));

const mockOnUpdate = vi.fn();

const defaultProps = {
  patientId: 'patient-1',
  provider: 'Aetna',
  policyNumber: 'POL123456',
  groupNumber: 'GRP789',
  effectiveDate: '2024-01-01',
  expirationDate: '2025-01-01',
  copay: 25.0,
  deductible: 1000.0,
  onUpdate: mockOnUpdate,
};

describe('EditableInsuranceInfoCard', () => {
  const mockMutateAsync = vi.fn();
  const mockMutation = {
    mutateAsync: mockMutateAsync,
    isPending: false,
    isError: false,
    error: null,
    reset: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(hooks.useUpdatePatientInsuranceInfo).mockReturnValue(mockMutation as any);
  });

  it('renders in view mode with insurance information', () => {
    render(<EditableInsuranceInfoCard {...defaultProps} />);

    expect(screen.getByText('Insurance Information')).toBeInTheDocument();
    expect(screen.getByText('Aetna')).toBeInTheDocument();
    expect(screen.getByText('POL123456')).toBeInTheDocument();
    expect(screen.getByText('GRP789')).toBeInTheDocument();
    expect(screen.getByText('$25.00')).toBeInTheDocument();
    expect(screen.getByText('$1000.00')).toBeInTheDocument();
  });

  it('shows edit button in view mode', () => {
    render(<EditableInsuranceInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    expect(editButton).toBeDefined();
  });

  it('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<EditableInsuranceInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    expect(screen.getByLabelText(/provider/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/policy number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/copay/i)).toBeInTheDocument();
  });

  it('displays form fields with current values in edit mode', async () => {
    const user = userEvent.setup();
    render(<EditableInsuranceInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const policyNumberInput = screen.getByLabelText(/policy number/i) as HTMLInputElement;
    expect(policyNumberInput.value).toBe('POL123456');
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<EditableInsuranceInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const policyNumberInput = screen.getByLabelText(/policy number/i);
    await user.clear(policyNumberInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/policy number is required/i)).toBeInTheDocument();
    });
  });

  it('validates copay is non-negative', async () => {
    const user = userEvent.setup();
    render(<EditableInsuranceInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const copayInput = screen.getByLabelText(/copay/i);
    await user.clear(copayInput);
    await user.type(copayInput, '-10');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/copay.*>=.*0/i)).toBeInTheDocument();
    });
  });

  it('allows optional group number', async () => {
    const user = userEvent.setup();
    render(<EditableInsuranceInfoCard {...defaultProps} groupNumber={null} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const groupNumberInput = screen.getByLabelText(/group number/i) as HTMLInputElement;
    expect(groupNumberInput.value).toBe('');
  });

  it('cancels editing and resets form', async () => {
    const user = userEvent.setup();
    render(<EditableInsuranceInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const policyNumberInput = screen.getByLabelText(/policy number/i);
    await user.clear(policyNumberInput);
    await user.type(policyNumberInput, 'NEW123');

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(screen.getByText('POL123456')).toBeInTheDocument();
    expect(screen.queryByLabelText(/policy number/i)).not.toBeInTheDocument();
  });

  it('submits form with updated data', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({});
    render(<EditableInsuranceInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const policyNumberInput = screen.getByLabelText(/policy number/i);
    await user.clear(policyNumberInput);
    await user.type(policyNumberInput, 'NEW123');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 'patient-1',
        data: expect.objectContaining({
          provider: 'Aetna',
          policyNumber: 'NEW123',
        }),
      });
    });
  });

  it('calls onUpdate after successful submission', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({});
    render(<EditableInsuranceInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it('displays error message when mutation fails', async () => {
    const user = userEvent.setup();
    const errorMutation = {
      ...mockMutation,
      isError: true,
      error: new Error('Update failed'),
    };
    vi.mocked(hooks.useUpdatePatientInsuranceInfo).mockReturnValue(errorMutation as any);

    render(<EditableInsuranceInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    expect(screen.getByText('Update failed')).toBeInTheDocument();
  });

  it('disables save button while mutation is pending', async () => {
    const user = userEvent.setup();
    const pendingMutation = {
      ...mockMutation,
      isPending: true,
    };
    vi.mocked(hooks.useUpdatePatientInsuranceInfo).mockReturnValue(pendingMutation as any);

    render(<EditableInsuranceInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeDisabled();
  });

  it('handles missing insurance information', () => {
    render(
      <EditableInsuranceInfoCard
        patientId="patient-1"
        provider=""
        policyNumber=""
        groupNumber={null}
        effectiveDate="2024-01-01"
        expirationDate={null}
        copay={0}
        deductible={0}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText(/no insurance information available/i)).toBeInTheDocument();
  });
});
