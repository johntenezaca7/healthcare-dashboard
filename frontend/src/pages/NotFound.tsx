import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

import { ROUTES } from '@/utils/constants';

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <span className="text-4xl font-bold">404</span>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link to={ROUTES.HOME}>
            <Button className="w-full gap-2">
              <Home className="h-4 w-4" />
              Go to Home
            </Button>
          </Link>
          <Link to={ROUTES.PATIENTS}>
            <Button variant="outline" className="w-full">
              View Patients
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export { NotFound };
