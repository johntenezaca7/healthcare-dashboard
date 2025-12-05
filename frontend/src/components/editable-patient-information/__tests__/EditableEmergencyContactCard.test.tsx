import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as hooks from '@/hooks';

import { EditableEmergencyContactCard } from '../EditableEmergencyContactCard';

import { render } from '@/test/utils';

vi.mock('@/hooks', () => ({
  useUpdatePatientEmergencyContact: vi.fn(),
}));

const mockOnUpdate = vi.fn();

const defaultProps = {
  patientId: 'patient-1',
  name: 'Jane Doe',
  relationship: 'Spouse',
  phone: '555-5678',
  email: 'jane.doe@example.com',
  onUpdate: mockOnUpdate,
};

describe('EditableEmergencyContactCard', () => {
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
    vi.mocked(hooks.useUpdatePatientEmergencyContact).mockReturnValue(mockMutation as any);
  });

  it('renders in view mode with contact information', () => {
    render(<EditableEmergencyContactCard {...defaultProps} />);

    expect(screen.getByText('Emergency Contact')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Spouse')).toBeInTheDocument();
    expect(screen.getByText('555-5678')).toBeInTheDocument();
    expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument();
  });

  it('shows edit button in view mode', () => {
    render(<EditableEmergencyContactCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    expect(editButton).toBeDefined();
  });

  it('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<EditableEmergencyContactCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/relationship/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it('displays form fields with current values in edit mode', async () => {
    const user = userEvent.setup();
    render(<EditableEmergencyContactCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const relationshipInput = screen.getByLabelText(/relationship/i) as HTMLInputElement;
    const phoneInput = screen.getByLabelText(/phone/i) as HTMLInputElement;

    expect(nameInput.value).toBe('Jane Doe');
    expect(relationshipInput.value).toBe('Spouse');
    expect(phoneInput.value).toBe('555-5678');
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<EditableEmergencyContactCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<EditableEmergencyContactCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const emailInput = screen.getByLabelText(/email/i);
    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('allows empty email field', async () => {
    const user = userEvent.setup();
    render(<EditableEmergencyContactCard {...defaultProps} email={null} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(emailInput.value).toBe('');
  });

  it('cancels editing and resets form', async () => {
    const user = userEvent.setup();
    render(<EditableEmergencyContactCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'John Smith');

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
  });

  it('submits form with updated data', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({});
    render(<EditableEmergencyContactCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'John Smith');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 'patient-1',
        data: expect.objectContaining({
          name: 'John Smith',
          relationship: 'Spouse',
          phone: '555-5678',
        }),
      });
    });
  });

  it('calls onUpdate after successful submission', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({});
    render(<EditableEmergencyContactCard {...defaultProps} />);

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
    vi.mocked(hooks.useUpdatePatientEmergencyContact).mockReturnValue(errorMutation as any);

    render(<EditableEmergencyContactCard {...defaultProps} />);

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
    vi.mocked(hooks.useUpdatePatientEmergencyContact).mockReturnValue(pendingMutation as any);

    render(<EditableEmergencyContactCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeDisabled();
  });

  it('handles missing contact information', () => {
    render(
      <EditableEmergencyContactCard
        patientId="patient-1"
        name=""
        relationship=""
        phone=""
        email={null}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText(/no emergency contact information available/i)).toBeInTheDocument();
  });
});
