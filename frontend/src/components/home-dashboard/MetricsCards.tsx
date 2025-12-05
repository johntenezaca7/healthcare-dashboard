import { CheckSquare, Clock, FileText, TrendingDown, TrendingUp, User } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface Metric {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface MetricsCardsProps {
  metrics: {
    avgConsultationTime: number;
    avgConsultationTimeChange: number;
    patientAvgStay: number;
    patientAvgStayChange: number;
    pendingReports: number;
    pendingReportsChange: number;
    overdueTasks: number;
    overdueTasksChange: number;
  };
  userRole?: string;
}

const MetricsCards = ({ metrics, userRole }: MetricsCardsProps) => {
  const normalizedRole = userRole?.toLowerCase() || '';
  const isNurse = normalizedRole === 'nurse';

  const allMetricCards: Metric[] = [
    {
      title: 'Avg. Consultation Time',
      value: `${metrics.avgConsultationTime} mins`,
      change: metrics.avgConsultationTimeChange,
      icon: Clock,
    },
    {
      title: 'Patient Avg. Stay',
      value: `${metrics.patientAvgStay} days`,
      change: metrics.patientAvgStayChange,
      icon: User,
    },
    {
      title: 'Pending Reports',
      value: metrics.pendingReports,
      change: metrics.pendingReportsChange,
      icon: FileText,
    },
    {
      title: 'Overdue Tasks',
      value: metrics.overdueTasks,
      change: metrics.overdueTasksChange,
      icon: CheckSquare,
    },
  ];

  const metricCards = isNurse
    ? allMetricCards.filter(metric => metric.title !== 'Pending Reports')
    : allMetricCards;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricCards.map(metric => {
        const Icon = metric.icon;
        const isPositive = metric.change > 0;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {isPositive ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(metric.change)}% vs. last month
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export { MetricsCards };
