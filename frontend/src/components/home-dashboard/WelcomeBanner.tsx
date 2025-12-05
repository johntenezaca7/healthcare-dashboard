import { Link } from 'react-router-dom';
import { ChevronDown, Plus } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';

import { ROUTES } from '@/utils/constants';

interface WelcomeBannerProps {
  userName: string;
}

const WelcomeBanner = ({ userName }: WelcomeBannerProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          Welcome {userName}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Manage your patients and their account permissions here.
        </p>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#D4C1FF] text-[#262626] hover:bg-[#D4C1FF]/90 w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Record
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={ROUTES.PATIENT_CREATE}>New Patient</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>New Appointment</DropdownMenuItem>
            <DropdownMenuItem>New Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export { WelcomeBanner };
