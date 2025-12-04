export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getLastVisit(patient: {
  medicalInfo?: { lastVisit?: string };
  documents?: Array<{ uploadDate: string }>;
}): string | undefined {
  if (patient.medicalInfo?.lastVisit) {
    return patient.medicalInfo.lastVisit;
  }

  if (patient.documents && patient.documents.length > 0) {
    const sortedDocs = [...patient.documents].sort(
      (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
    return sortedDocs[0].uploadDate;
  }

  return undefined;
}
