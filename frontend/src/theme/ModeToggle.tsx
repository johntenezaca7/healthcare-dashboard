import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui';
import { useTheme } from '@/theme';

const ModeToggle = () => {
  const { toggleTheme } = useTheme();

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {/* Show Moon icon in light mode (to switch to dark) */}
      <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
      {/* Show Sun icon in dark mode (to switch to light) */}
      <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export { ModeToggle };
