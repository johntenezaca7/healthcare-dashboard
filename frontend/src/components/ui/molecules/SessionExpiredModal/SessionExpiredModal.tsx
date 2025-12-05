import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui';
import { Button } from '@/components/ui';

import { useAuth } from '@/context/auth';

import { ROUTES } from '@/utils/constants';

interface SessionExpiredModalProps {
  open: boolean;
  onClose: () => void;
}

const SessionExpiredModal = ({ open, onClose }: SessionExpiredModalProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogin = () => {
    logout();
    onClose();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1 space-y-2">
              <DialogTitle className="text-xl">Session Expired</DialogTitle>
              <DialogDescription className="text-base">
                Your session has expired. Please log in again to continue.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-6 sm:mt-4 justify-center">
          <Button onClick={handleLogin} className="w-full sm:w-auto">
            Go to Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { SessionExpiredModal };
