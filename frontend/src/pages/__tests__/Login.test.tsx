import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/utils';
import { Login } from '../Login';
import { useAuth } from '@/context/auth';
import { useLogin } from '@/hooks';

vi.mock('@/context/auth');
vi.mock('@/hooks', () => ({
  useLogin: vi.fn(),
}));

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
    });
    vi.mocked(useLogin).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({ access_token: 'test-token' }),
      isPending: false,
      isError: false,
      error: null,
      reset: vi.fn(),
    });
  });

  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows demo credentials', () => {
    render(<Login />);
    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@example.com/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInvalid();
  });

  it('submits form with valid credentials', async () => {
    const user = userEvent.setup();
    const mockMutateAsync = vi.fn().mockResolvedValue({ access_token: 'test-token' });
    vi.mocked(useLogin).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      error: null,
      reset: vi.fn(),
    });

    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('displays error message on login failure', () => {
    vi.mocked(useLogin).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      isError: true,
      error: new Error('Invalid credentials'),
      reset: vi.fn(),
    });

    render(<Login />);
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('shows loading state during login', () => {
    vi.mocked(useLogin).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
      isError: false,
      error: null,
      reset: vi.fn(),
    });

    render(<Login />);
    expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
