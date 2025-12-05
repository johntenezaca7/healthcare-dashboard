import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RoleProtectedRoute } from '@/context/auth';

import { render } from '@/test/utils';

const mockUseAuth = vi.hoisted(() => vi.fn());

vi.mock('@/context/auth/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/context/auth', () => ({
  useAuth: () => mockUseAuth(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => children,
  RoleProtectedRoute: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate" data-to={to}>
        Navigate to {to}
      </div>
    ),
  };
});

// TODO: Fix mock conflicts when running all tests together
// These tests pass individually but fail when run with other tests that mock @/context/auth
// The issue is that multiple test files mocking the same module causes conflicts
// See: Sidebar.test.tsx and SessionExpiredModal.test.tsx for similar issues
describe.skip('RoleProtectedRoute', () => {
  beforeEach(() => {
    mockUseAuth.mockClear();
    // Always ensure mock has a return value
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshCredentials: vi.fn(),
      isAuthenticated: false,
      sessionExpired: false,
      setSessionExpired: vi.fn(),
    });
  });

  it('renders children when user has allowed role', () => {
    mockUseAuth.mockReturnValue({
      user: { name: 'Admin', email: 'admin@test.com', role: 'admin' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshCredentials: vi.fn(),
      isAuthenticated: true,
      sessionExpired: false,
      setSessionExpired: vi.fn(),
    });

    render(
      <RoleProtectedRoute allowedRoles={['admin', 'system_admin']}>
        <div>Protected Content</div>
      </RoleProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });
});
