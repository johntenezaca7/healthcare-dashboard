import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger, Breadcrumb } from '@/components/ui';
import {
  EditablePersonalInfoCard,
  EditableEmergencyContactCard,
  EditableInsuranceInfoCard,
  EditableMedicalInfoCard,
  EditableCurrentMedicationsCard,
} from '@/components/editable-patient-information';
import {
  PatientDetailSkeleton,
  PatientDetailError,
  PatientHeaderCard,
  DocumentsCard,
} from '@/components/patient-details';
import { normalizePatientData } from '@/components/patient-details/utils';
import { useGetPatient } from '@/hooks/queries';
import { ROUTES } from '@/utils/constants';

import type { PatientDataUnion } from '@/components/patient-details/types';

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('information');

  // Handle missing patient ID
  if (!id) {
    return <PatientDetailError error={new Error('Patient ID is required')} />;
  }

  const { data: patient, isLoading, error, refetch } = useGetPatient(id);

  if (isLoading) {
    return <PatientDetailSkeleton />;
  }

  if (error || !patient) {
    return <PatientDetailError error={error} />;
  }

  // Normalize patient data from either API format (snake_case) or frontend format (camelCase)
  const normalized = normalizePatientData(patient as PatientDataUnion);
  const address = normalized.address;
  const emergencyContact = normalized.emergencyContact;
  const insurance = normalized.insurance;
  const medicalInfo = normalized.medicalInfo;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Patient list', to: ROUTES.PATIENTS },
          { label: 'Patient detail' },
        ]}
      />

      <PatientHeaderCard
        patient={patient as PatientDataUnion}
        medicalInfo={medicalInfo}
        onRefetch={refetch}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full flex-wrap gap-1 sm:gap-2 h-auto sm:h-10 sm:justify-start">
          <TabsTrigger
            value="information"
            className="flex-1 min-w-[calc(50%-0.25rem)] sm:flex-1 sm:min-w-0 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5"
          >
            <span className="hidden sm:inline">Patient Information</span>
            <span className="sm:hidden">Info</span>
          </TabsTrigger>
          <TabsTrigger
            value="medical"
            className="flex-1 min-w-[calc(50%-0.25rem)] sm:flex-1 sm:min-w-0 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5"
          >
            <span className="hidden sm:inline">Medical History</span>
            <span className="sm:hidden">Medical</span>
          </TabsTrigger>
          <TabsTrigger
            value="medications"
            className="flex-1 min-w-[calc(50%-0.25rem)] sm:flex-1 sm:min-w-0 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5"
          >
            <span className="hidden sm:inline">Current Medications</span>
            <span className="sm:hidden">Meds</span>
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="flex-1 min-w-[calc(50%-0.25rem)] sm:flex-1 sm:min-w-0 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5"
          >
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="information" className="space-y-6 mt-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <EditablePersonalInfoCard
              patientId={normalized.id}
              firstName={normalized.firstName}
              lastName={normalized.lastName}
              dateOfBirth={normalized.dateOfBirth}
              email={normalized.email}
              phone={normalized.phone}
              bloodType={medicalInfo?.bloodType || null}
              address={address || undefined}
              onUpdate={() => {
                refetch();
              }}
            />

            <EditableEmergencyContactCard
              patientId={normalized.id}
              name={emergencyContact?.name || ''}
              relationship={emergencyContact?.relationship || ''}
              phone={emergencyContact?.phone || ''}
              email={emergencyContact?.email || null}
              onUpdate={() => {
                refetch();
              }}
            />

            <EditableInsuranceInfoCard
              patientId={normalized.id}
              provider={insurance?.provider || ''}
              policyNumber={insurance?.policyNumber || ''}
              groupNumber={insurance?.groupNumber || null}
              effectiveDate={insurance?.effectiveDate || ''}
              expirationDate={insurance?.expirationDate || null}
              copay={insurance?.copay || 0}
              deductible={insurance?.deductible || 0}
              onUpdate={() => {
                refetch();
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-6 mt-6">
          <EditableMedicalInfoCard
            patientId={normalized.id}
            allergies={medicalInfo?.allergies || []}
            conditions={medicalInfo?.conditions || []}
            lastVisit={medicalInfo?.lastVisit || null}
            onUpdate={() => {
              refetch();
            }}
          />
        </TabsContent>

        <TabsContent value="medications" className="space-y-6 mt-6">
          <EditableCurrentMedicationsCard
            patientId={normalized.id}
            medications={medicalInfo?.currentMedications || []}
            onUpdate={() => {
              refetch();
            }}
          />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6 mt-6">
          <DocumentsCard documents={normalized.documents} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { PatientDetail };
