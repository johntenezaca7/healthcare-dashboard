import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

interface DashboardChartsProps {
  patientStatusData: Array<{ name: string; value: number; color: string }>;
  patientAgeData: Array<{ age: string; count: number }>;
  monthlyAdmissionsData: Array<{ month: string; admissions: number }>;
}

const DashboardCharts = ({ monthlyAdmissionsData }: DashboardChartsProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Patient Admissions</CardTitle>
          <CardDescription>Patient admissions trend over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyAdmissionsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="admissions" fill="#D4C1FF" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};

export { DashboardCharts };
