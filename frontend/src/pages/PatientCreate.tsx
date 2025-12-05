import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Breadcrumb,
  Card,
  CardContent,
  Button,
} from '@/components/ui';
import { getErrorMessage, ERROR_MESSAGES } from '@/utils/errorMessages';
import {
  PersonalInfoForm,
  EmergencyContactForm,
  InsuranceForm,
  MedicalInfoForm,
} from '@/components/create-patient';
import { patientCreateSchema, type PatientCreateFormData } from '@/components/create-patient/schemas';
import { getDefaultPatientFormValues, transformFormDataToPatientCreate } from '@/components/create-patient/util';
import { useCreatePatient } from '@/hooks';
import { ROUTES, getPatientDetailRoute } from '@/utils/constants';

const PatientCreate = () => {
  const navigate = useNavigate();
  const createPatientMutation = useCreatePatient();

  const form = useForm<PatientCreateFormData>({
    resolver: yupResolver(patientCreateSchema),
    defaultValues: getDefaultPatientFormValues(),
    mode: 'onChange',
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: PatientCreateFormData) => {
    try {
      const patientData = transformFormDataToPatientCreate(data);
      const createdPatient = await createPatientMutation.mutateAsync(patientData);
      navigate(getPatientDetailRoute(createdPatient.id));
    } catch (err) {
      // Error is handled by createPatientMutation.error and displayed in the UI
    }
  };

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
        <Card className="border-destructive" role="alert" aria-live="polite">
          <CardContent className="pt-6">
            <div className="text-destructive">
              {getErrorMessage(createPatientMutation.error, ERROR_MESSAGES.FAILED_TO_CREATE_PATIENT)}
            </div>
          </CardContent>
        </Card>
      )}

      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <PersonalInfoForm control={control} />
          <EmergencyContactForm control={control} />
          <InsuranceForm control={control} />
          <MedicalInfoForm control={control} />

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
          <Button
            type="submit"
            disabled={!form.formState.isValid || createPatientMutation.isPending || form.formState.isSubmitting}
            className="w-full sm:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            {form.formState.isSubmitting || createPatientMutation.isPending ? 'Creating...' : 'Create Patient'}
          </Button>
        </div>
      </form>
      </FormProvider>
    </div>
  );
};

export { PatientCreate };
