import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { Home } from '../future-work/Home';
import { useAuth } from '@/context/auth';

vi.mock('@/context/auth');

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders welcome banner with user name', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'John Doe', role: 'admin', email: 'john@example.com' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshCredentials: vi.fn(),
      isAuthenticated: true,
      sessionExpired: false,
      setSessionExpired: vi.fn(),
    });

    render(<Home />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it('renders metrics cards', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'John Doe', role: 'admin', email: 'john@example.com' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshCredentials: vi.fn(),
      isAuthenticated: true,
      sessionExpired: false,
      setSessionExpired: vi.fn(),
    });

    render(<Home />);
    expect(screen.getByText(/avg\. consultation time/i)).toBeInTheDocument();
    expect(screen.getByText(/patient avg\. stay/i)).toBeInTheDocument();
    expect(screen.getByText(/pending reports/i)).toBeInTheDocument();
    expect(screen.getByText(/overdue tasks/i)).toBeInTheDocument();
  });

  it('hides pending reports for nurses', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Jane Nurse', role: 'nurse', email: 'jane@example.com' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshCredentials: vi.fn(),
      isAuthenticated: true,
      sessionExpired: false,
      setSessionExpired: vi.fn(),
    });

    render(<Home />);
    expect(screen.queryByText(/pending reports/i)).not.toBeInTheDocument();
    expect(screen.getByText(/overdue tasks/i)).toBeInTheDocument();
  });

  it('renders quick actions', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'John Doe', role: 'admin', email: 'john@example.com' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshCredentials: vi.fn(),
      isAuthenticated: true,
      sessionExpired: false,
      setSessionExpired: vi.fn(),
    });

    render(<Home />);
    // Check for specific quick action buttons/text
    expect(screen.getByText('View Patients')).toBeInTheDocument();
    expect(screen.getByText('View Reports')).toBeInTheDocument();
    expect(screen.getByText('View Tasks')).toBeInTheDocument();
  });

  it('hides reports quick action for nurses', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Jane Nurse', role: 'nurse', email: 'jane@example.com' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshCredentials: vi.fn(),
      isAuthenticated: true,
      sessionExpired: false,
      setSessionExpired: vi.fn(),
    });

    render(<Home />);
    expect(screen.queryByText('View Reports')).not.toBeInTheDocument();
    expect(screen.getByText('View Patients')).toBeInTheDocument();
    expect(screen.getByText('View Tasks')).toBeInTheDocument();
  });

  it('renders dashboard charts', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'John Doe', role: 'admin', email: 'john@example.com' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshCredentials: vi.fn(),
      isAuthenticated: true,
      sessionExpired: false,
      setSessionExpired: vi.fn(),
    });

    render(<Home />);
    expect(screen.getByText(/monthly patient admissions/i)).toBeInTheDocument();
  });
});
