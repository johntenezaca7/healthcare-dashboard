import {
  WelcomeBanner,
  MetricsCards,
  DashboardCharts,
  QuickActions,
} from '@/components/home-dashboard';
import { useAuth } from '@/context/auth';

const metrics = {
  avgConsultationTime: 64,
  avgConsultationTimeChange: 24,
  patientAvgStay: 4.3,
  patientAvgStayChange: -54,
  pendingReports: 54,
  pendingReportsChange: 79,
  overdueTasks: 7,
  overdueTasksChange: 32,
};

const patientStatusData = [
  { name: 'Active', value: 1200, color: '#10b981' },
  { name: 'Inactive', value: 250, color: '#6b7280' },
  { name: 'Critical', value: 50, color: '#ef4444' },
];

const patientAgeData = [
  { age: '0-18', count: 120 },
  { age: '19-35', count: 450 },
  { age: '36-50', count: 380 },
  { age: '51-65', count: 320 },
  { age: '65+', count: 230 },
];

const monthlyAdmissionsData = [
  { month: 'Jan', admissions: 45 },
  { month: 'Feb', admissions: 52 },
  { month: 'Mar', admissions: 48 },
  { month: 'Apr', admissions: 61 },
  { month: 'May', admissions: 55 },
  { month: 'Jun', admissions: 58 },
];

const Home = () => {
  const { user } = useAuth();
  const userName = user?.name?.split(' ')[0] || 'User';
  const userRole = user?.role || '';

  return (
    <div className="space-y-6">
      <WelcomeBanner userName={userName} />
      <MetricsCards metrics={metrics} userRole={userRole} />
      <DashboardCharts
        patientStatusData={patientStatusData}
        patientAgeData={patientAgeData}
        monthlyAdmissionsData={monthlyAdmissionsData}
      />
      <QuickActions userRole={userRole} />
    </div>
  );
};

export { Home };
