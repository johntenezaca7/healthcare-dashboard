import { Menu } from 'lucide-react';

import { Button } from './button';
import { ModeToggle } from '@/theme';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="ml-4 md:ml-0 flex items-center space-x-2 flex-1">
          <h1 className="text-xl font-bold">Healthcare Dashboard</h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};

export { Header };
