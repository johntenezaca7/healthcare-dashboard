import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm } from '@tanstack/react-form';

import {
  Breadcrumb,
  Card,
  CardContent,
  Button,
} from '@/components/ui';
import {
  PersonalInfoForm,
  EmergencyContactForm,
  InsuranceForm,
  MedicalInfoForm,
} from '@/components/create-patient';
import { patientCreateSchema } from '@/components/create-patient/schemas';
import { getDefaultPatientFormValues, transformFormDataToPatientCreate } from '@/components/create-patient/util';
import { useCreatePatient } from '@/hooks';
import { ROUTES, getPatientDetailRoute } from '@/utils/constants';

const PatientCreate = () => {
  const navigate = useNavigate();
  const createPatientMutation = useCreatePatient();

  const form = useForm({
    defaultValues: getDefaultPatientFormValues(),
    onSubmit: async ({ value }) => {
      const result = patientCreateSchema.safeParse(value);
      if (!result.success) {
        // Errors will be handled by field-level validators
        return;
      }

      try {
        const patientData = transformFormDataToPatientCreate(result.data);
        const createdPatient = await createPatientMutation.mutateAsync(patientData);
        navigate(getPatientDetailRoute(createdPatient.id));
      } catch (err) {
        // Error is handled by mutation
      }
    },
  });

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Patient list', to: ROUTES.PATIENTS },
          { label: 'New Patient' },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create New Patient</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Add a new patient to the system
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.PATIENTS)}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>

      {createPatientMutation.error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive">
              {createPatientMutation.error instanceof Error
                ? createPatientMutation.error.message
                : 'Failed to create patient'}
            </div>
          </CardContent>
        </Card>
      )}

      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <PersonalInfoForm form={form} />
        <EmergencyContactForm form={form} />
        <InsuranceForm form={form} />
        <MedicalInfoForm form={form} />

        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.PATIENTS)}
            disabled={createPatientMutation.isPending}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <form.Subscribe
            selector={state => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || createPatientMutation.isPending}
                className="w-full sm:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting || createPatientMutation.isPending ? 'Creating...' : 'Create Patient'}
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  );
};

export { PatientCreate };
