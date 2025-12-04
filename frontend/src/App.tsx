import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/queryClient';
import { ThemeProvider } from '@/theme';
import { AuthProvider } from '@/context/auth';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppRouter } from './AppRouter';

import './styles/globals.css';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
