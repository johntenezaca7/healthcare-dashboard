import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as hooks from '@/hooks';

import { EditableCurrentMedicationsCard } from '../EditableCurrentMedicationsCard';

import { render } from '@/test/utils';

vi.mock('@/hooks', () => ({
  useUpdatePatientMedications: vi.fn(),
}));

const mockOnUpdate = vi.fn();

const defaultMedications = [
  {
    id: 'med-1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    prescribedBy: 'Dr. Smith',
    startDate: '2024-01-01',
    endDate: null,
    isActive: true,
  },
  {
    id: 'med-2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    prescribedBy: 'Dr. Jones',
    startDate: '2024-02-01',
    endDate: '2024-12-31',
    isActive: true,
  },
];

const defaultProps = {
  patientId: 'patient-1',
  medications: defaultMedications,
  onUpdate: mockOnUpdate,
};

describe('EditableCurrentMedicationsCard', () => {
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
    vi.mocked(hooks.useUpdatePatientMedications).mockReturnValue(mockMutation as any);
  });

  it('renders in view mode with medications', () => {
    render(<EditableCurrentMedicationsCard {...defaultProps} />);

    expect(screen.getByText('Current Medications')).toBeInTheDocument();
    expect(screen.getByText('Lisinopril')).toBeInTheDocument();
    expect(screen.getByText('Metformin')).toBeInTheDocument();
    expect(screen.getByText(/10mg - Once daily/i)).toBeInTheDocument();
    expect(screen.getByText(/500mg - Twice daily/i)).toBeInTheDocument();
  });

  it('shows edit button in view mode', () => {
    render(<EditableCurrentMedicationsCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    expect(editButton).toBeDefined();
  });

  it('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<EditableCurrentMedicationsCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    expect(screen.getByText(/medication 1/i)).toBeInTheDocument();
    expect(screen.getByText(/medication 2/i)).toBeInTheDocument();
  });

  it('displays form fields with current medication values in edit mode', async () => {
    const user = userEvent.setup();
    render(<EditableCurrentMedicationsCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const nameInputs = screen.getAllByLabelText(/name/i);
    expect(nameInputs[0]).toHaveValue('Lisinopril');
    expect(nameInputs[1]).toHaveValue('Metformin');
  });

  it('validates required medication fields', async () => {
    const user = userEvent.setup();
    render(<EditableCurrentMedicationsCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const nameInputs = screen.getAllByLabelText(/name/i);
    await user.clear(nameInputs[0]);
    await user.tab();

    // Try to submit to trigger validation
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(
      () => {
        // Form validation should show error - check for required message
        const errorMessages = screen.queryAllByText(/required/i);
        expect(errorMessages.length).toBeGreaterThan(0);
      },
      { timeout: 2000 }
    );
  });

  it('allows adding new medication', async () => {
    const user = userEvent.setup();
    render(<EditableCurrentMedicationsCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const addButton = screen.getByRole('button', { name: /add medication/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/medication 3/i)).toBeInTheDocument();
    });
  });

  it('allows removing medication', async () => {
    const user = userEvent.setup();
    render(<EditableCurrentMedicationsCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    // Find remove buttons (trash icon buttons within medication cards)
    const allButtons = screen.getAllByRole('button');
    const removeButtons = allButtons.filter(btn => {
      const svg = btn.querySelector('svg');
      const isInCard = btn.closest('[class*="border"]');
      return svg && isInCard;
    });

    if (removeButtons.length > 0) {
      const initialMedCount = screen.getAllByText(/medication \d+/i).length;
      await user.click(removeButtons[0]);
      await waitFor(() => {
        const newMedCount = screen.getAllByText(/medication \d+/i).length;
        expect(newMedCount).toBeLessThan(initialMedCount);
      });
    }
  });

  it('cancels editing and resets form', async () => {
    const user = userEvent.setup();
    render(<EditableCurrentMedicationsCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const addButton = screen.getByRole('button', { name: /add medication/i });
    await user.click(addButton);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(screen.queryByText(/medication 3/i)).not.toBeInTheDocument();
    expect(screen.getByText('Lisinopril')).toBeInTheDocument();
  });

  it('submits form with updated medications', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({});
    render(<EditableCurrentMedicationsCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const nameInputs = screen.getAllByLabelText(/name/i);
    await user.clear(nameInputs[0]);
    await user.type(nameInputs[0], 'Amlodipine');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 'patient-1',
        data: expect.objectContaining({
          medications: expect.arrayContaining([
            expect.objectContaining({
              name: 'Amlodipine',
            }),
          ]),
        }),
      });
    });
  });

  it('calls onUpdate after successful submission', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({});
    render(<EditableCurrentMedicationsCard {...defaultProps} />);

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
    vi.mocked(hooks.useUpdatePatientMedications).mockReturnValue(errorMutation as any);

    render(<EditableCurrentMedicationsCard {...defaultProps} />);

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
    vi.mocked(hooks.useUpdatePatientMedications).mockReturnValue(pendingMutation as any);

    render(<EditableCurrentMedicationsCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeDisabled();
  });

  it('handles empty medications list', () => {
    render(
      <EditableCurrentMedicationsCard
        patientId="patient-1"
        medications={[]}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText(/no current medications/i)).toBeInTheDocument();
  });

  it('handles medication with snake_case fields', () => {
    const medicationWithSnakeCase: Array<{
      id: string;
      name: string;
      dosage: string;
      frequency: string;
      prescribedBy: string;
      prescribed_by?: string;
      startDate: string;
      start_date?: string | null;
      endDate?: string | null;
      end_date?: string | null;
      isActive: boolean;
      is_active?: boolean;
    }> = [
      {
        id: 'med-1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        prescribedBy: 'Dr. Smith',
        prescribed_by: 'Dr. Smith',
        startDate: '2024-01-01',
        start_date: '2024-01-01',
        endDate: null,
        end_date: null,
        isActive: true,
        is_active: true,
      },
    ];

    render(
      <EditableCurrentMedicationsCard
        patientId="patient-1"
        medications={medicationWithSnakeCase as any}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Lisinopril')).toBeInTheDocument();
    expect(screen.getByText(/dr\. smith/i)).toBeInTheDocument();
  });
});
