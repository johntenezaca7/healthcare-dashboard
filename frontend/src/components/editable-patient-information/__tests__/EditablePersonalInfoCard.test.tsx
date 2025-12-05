import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as hooks from '@/hooks';

import { EditablePersonalInfoCard } from '../EditablePersonalInfoCard';

import { render } from '@/test/utils';

vi.mock('@/hooks', () => ({
  useUpdatePatientPersonalInfo: vi.fn(),
}));

const mockOnUpdate = vi.fn();

const defaultProps = {
  patientId: 'patient-1',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-15',
  email: 'john.doe@example.com',
  phone: '555-1234',
  bloodType: 'O+',
  address: {
    street: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    country: 'USA',
  },
  onUpdate: mockOnUpdate,
};

describe('EditablePersonalInfoCard', () => {
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
    vi.mocked(hooks.useUpdatePatientPersonalInfo).mockReturnValue(mockMutation as any);
  });

  it('renders in view mode with patient information', () => {
    render(<EditablePersonalInfoCard {...defaultProps} />);

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText(/john/i)).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('555-1234')).toBeInTheDocument();
    expect(screen.getByText('O+')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
  });

  it('shows edit button in view mode', () => {
    render(<EditablePersonalInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    expect(editButton).toBeInTheDocument();
  });

  it('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<EditablePersonalInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    expect(editButton).toBeDefined();
    if (editButton) await user.click(editButton);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it('displays form fields with current values in edit mode', async () => {
    const user = userEvent.setup();
    render(<EditablePersonalInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
    const lastNameInput = screen.getByLabelText(/last name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
    expect(emailInput.value).toBe('john.doe@example.com');
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<EditablePersonalInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.clear(firstNameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<EditablePersonalInfoCard {...defaultProps} />);

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

  it('cancels editing and resets form', async () => {
    const user = userEvent.setup();
    render(<EditablePersonalInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jane');

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(screen.getByText(/john/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument();
  });

  it('submits form with updated data', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({});
    render(<EditablePersonalInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jane');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 'patient-1',
        data: expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Doe',
        }),
      });
    });
  });

  it('calls onUpdate after successful submission', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({});
    render(<EditablePersonalInfoCard {...defaultProps} />);

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
    vi.mocked(hooks.useUpdatePatientPersonalInfo).mockReturnValue(errorMutation as any);

    render(<EditablePersonalInfoCard {...defaultProps} />);

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
    vi.mocked(hooks.useUpdatePatientPersonalInfo).mockReturnValue(pendingMutation as any);

    render(<EditablePersonalInfoCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => btn.querySelector('svg'));
    if (editButton) await user.click(editButton);

    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeDisabled();
  });

  it('handles missing optional fields', () => {
    render(<EditablePersonalInfoCard {...defaultProps} bloodType={null} address={undefined} />);

    expect(screen.getByText(/n\/a/i)).toBeInTheDocument();
  });

  it('handles address with zip_code instead of zipCode', () => {
    render(
      <EditablePersonalInfoCard
        {...defaultProps}
        address={{
          ...defaultProps.address!,
          zip_code: '62701',
          zipCode: undefined,
        }}
      />
    );

    // The zip code is displayed as part of the address string
    const addressSection = screen.getByText(/springfield/i).closest('div');
    expect(addressSection?.textContent).toContain('62701');
  });
});
