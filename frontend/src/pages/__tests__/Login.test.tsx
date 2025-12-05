import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/context/auth';
import { useLogin } from '@/hooks';

import { Login } from '../Login';

import { render } from '@/test/utils';

vi.mock('@/context/auth');
vi.mock('@/hooks', () => ({
  useLogin: vi.fn(),
}));

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshCredentials: vi.fn(),
      isAuthenticated: false,
      sessionExpired: false,
      setSessionExpired: vi.fn(),
    });
    vi.mocked(useLogin).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({ access_token: 'test-token' }),
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
      reset: vi.fn(),
      data: undefined,
      variables: undefined,
      isIdle: true,
      isSuccess: false,
      isPaused: false,
      status: 'idle',
      failureCount: 0,
      failureReason: null,
      submittedAt: 0,
      context: undefined,
    } as any);
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
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
      reset: vi.fn(),
      data: undefined,
      variables: undefined,
      isIdle: true,
      isSuccess: false,
      isPaused: false,
      status: 'idle',
      failureCount: 0,
      failureReason: null,
      submittedAt: 0,
      context: undefined,
    } as any);

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
      mutate: vi.fn(),
      isPending: false,
      isError: true,
      error: new Error('Invalid credentials'),
      reset: vi.fn(),
      data: undefined,
      variables: undefined,
      isIdle: false,
      isSuccess: false,
      isPaused: false,
      status: 'error',
      failureCount: 1,
      failureReason: new Error('Invalid credentials'),
      submittedAt: 0,
      context: undefined,
    } as any);

    render(<Login />);
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('shows loading state during login', () => {
    vi.mocked(useLogin).mockReturnValue({
      mutateAsync: vi.fn(),
      mutate: vi.fn(),
      isPending: true,
      isError: false,
      error: null,
      reset: vi.fn(),
      data: undefined,
      variables: undefined,
      isIdle: false,
      isSuccess: false,
      isPaused: false,
      status: 'pending',
      failureCount: 0,
      failureReason: null,
      submittedAt: Date.now(),
      context: undefined,
    } as any);

    render(<Login />);
    expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
