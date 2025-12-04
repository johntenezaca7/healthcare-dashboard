import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/queryClient';
import { ThemeProvider } from '@/theme';
import { AuthProvider } from '@/context/auth';
import { AppRouter } from './AppRouter';

import './styles/globals.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
