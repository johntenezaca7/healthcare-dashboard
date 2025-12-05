import { Link } from 'react-router-dom';
import { ArrowRight, CheckSquare, FileText, Users } from 'lucide-react';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

import { ROUTES } from '@/utils/constants';

interface QuickActionsProps {
  userRole?: string;
}

const QuickActions = ({ userRole }: QuickActionsProps) => {
  const normalizedRole = userRole?.toLowerCase() || '';
  const isNurse = normalizedRole === 'nurse';

  return (
    <div className={`grid gap-4 ${isNurse ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Patients</CardTitle>
          </div>
          <CardDescription>View and manage patient records</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to={ROUTES.PATIENTS}>
            <Button variant="outline" className="w-full">
              View Patients
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {!isNurse && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Reports</CardTitle>
            </div>
            <CardDescription>View pending and completed reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to={ROUTES.REPORTS}>
              <Button variant="outline" className="w-full">
                View Reports
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            <CardTitle>Tasks</CardTitle>
          </div>
          <CardDescription>Manage your tasks and assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to={ROUTES.TASKS}>
            <Button variant="outline" className="w-full">
              View Tasks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export { QuickActions };
