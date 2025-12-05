import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui';

import { useAuth } from '@/context/auth';
import { useLogin } from '@/hooks';
import { ERROR_MESSAGES, getErrorMessage } from '@/utils/errorMessages';

import { ROUTES } from '@/utils/constants';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const loginMutation = useLogin();

  const from = (location.state as { from?: Location })?.from?.pathname || ROUTES.HOME;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await loginMutation.mutateAsync({ email, password });
      await login(response.access_token);
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by loginMutation.error and displayed in the UI
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the Healthcare Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                aria-required="true"
                aria-invalid={loginMutation.error ? 'true' : 'false'}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                aria-required="true"
                aria-invalid={loginMutation.error ? 'true' : 'false'}
              />
            </div>
            {loginMutation.error && (
              <div
                className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                role="alert"
                aria-live="polite"
              >
                {getErrorMessage(loginMutation.error, ERROR_MESSAGES.LOGIN_FAILED)}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
            <div className="mt-4 rounded-md bg-muted p-3 text-xs text-muted-foreground">
              <p className="font-semibold mb-1">Demo Credentials:</p>
              <p>admin@example.com / admin123</p>
              <p>doctor@example.com / doctor123</p>
              <p>nurse@example.com / nurse123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export { Login };
