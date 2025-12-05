import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage system settings and preferences
          </p>
        </div>
        <Button disabled className="w-full sm:w-auto">
          Edit
        </Button>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure basic system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system-name">System Name</Label>
              <Input id="system-name" defaultValue="Healthcare Management System" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="america-new-york" disabled>
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america-new-york">America/New York (EST)</SelectItem>
                  <SelectItem value="america-los-angeles">America/Los Angeles (PST)</SelectItem>
                  <SelectItem value="america-chicago">America/Chicago (CST)</SelectItem>
                  <SelectItem value="america-denver">America/Denver (MST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-format">Date Format</Label>
              <Select defaultValue="mm-dd-yyyy" disabled>
                <SelectTrigger id="date-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications for important events
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send SMS notifications for urgent alerts
                </p>
              </div>
              <input type="checkbox" disabled className="h-4 w-4 rounded border-gray-300" />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage security and authentication settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" type="number" defaultValue="30" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-policy">Password Policy</Label>
              <Select defaultValue="standard" disabled>
                <SelectTrigger id="password-policy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (8+ characters)</SelectItem>
                  <SelectItem value="strong">
                    Strong (12+ characters, mixed case, numbers)
                  </SelectItem>
                  <SelectItem value="very-strong">
                    Very Strong (16+ characters, special chars)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Force all users to enable 2FA</p>
              </div>
              <input type="checkbox" disabled className="h-4 w-4 rounded border-gray-300" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Login Audit Log</Label>
                <p className="text-sm text-muted-foreground">Log all login attempts and sessions</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Lock Account After Failed Attempts</Label>
                <p className="text-sm text-muted-foreground">
                  Lock account after 5 failed login attempts
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Billing Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Settings</CardTitle>
            <CardDescription>Configure billing and payment settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select defaultValue="usd" disabled>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="cad">CAD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
              <Input id="tax-rate" type="number" step="0.01" defaultValue="8.5" disabled />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Auto-Billing</Label>
                <p className="text-sm text-muted-foreground">Automatically generate invoices</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Send Payment Reminders</Label>
                <p className="text-sm text-muted-foreground">Send reminders for overdue payments</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-server">SMTP Server</Label>
              <Input id="smtp-server" defaultValue="smtp.example.com" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" type="number" defaultValue="587" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="from-email">From Email Address</Label>
              <Input id="from-email" type="email" defaultValue="noreply@healthcare.com" disabled />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Send Appointment Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Send reminders 24 hours before appointments
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Send Lab Result Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Notify patients when lab results are available
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle>System Maintenance</CardTitle>
            <CardDescription>System maintenance and backup settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Automatic Backups</Label>
                <p className="text-sm text-muted-foreground">Automatically backup database daily</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backup-time">Backup Time</Label>
              <Input id="backup-time" type="time" defaultValue="02:00" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retention-days">Backup Retention (days)</Label>
              <Input id="retention-days" type="number" defaultValue="30" disabled />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put system in maintenance mode</p>
              </div>
              <input type="checkbox" disabled className="h-4 w-4 rounded border-gray-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { Settings };
