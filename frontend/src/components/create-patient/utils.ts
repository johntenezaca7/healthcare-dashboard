import type { FieldError, FieldPath, FieldValues, FormState } from 'react-hook-form';

// Helper functions that work with react-hook-form formState
export function getFieldError<TFormData extends FieldValues>(
  formState: FormState<TFormData>,
  fieldName: FieldPath<TFormData>
): string | undefined {
  const error = formState.errors[fieldName] as FieldError | undefined;
  return error?.message;
}

export function hasFieldError<TFormData extends FieldValues>(
  formState: FormState<TFormData>,
  fieldName: FieldPath<TFormData>,
  getValues: (name: FieldPath<TFormData>) => any
): boolean {
  const hasError = !!formState.errors[fieldName];
  if (!hasError) return false;
  
  const isSubmitted = formState.isSubmitted;
  
  // Get the current field value to check if it's empty
  const fieldValue = getValues(fieldName);
  const isEmpty = fieldValue === '' || fieldValue == null || fieldValue === undefined;
  
  // Check if field is dirty (user changed it from default)
  const isDirty = !!(formState.dirtyFields as Record<string, boolean>)[fieldName];
  
  // Show error if:
  // 1. Form has been submitted (show all errors), OR
  // 2. Field is dirty (user changed it) AND field is empty (user cleared it)
  // This ensures: user types → field becomes dirty
  //              user clears → field is dirty AND empty → error shows
  return isSubmitted || (isDirty && isEmpty);
}

export function getFieldClassName<TFormData extends FieldValues>(
  formState: FormState<TFormData>,
  fieldName: FieldPath<TFormData>,
  getValues: (name: FieldPath<TFormData>) => any,
  baseClassName = ''
): string {
  const errorClass = hasFieldError(formState, fieldName, getValues) ? 'border-destructive' : '';
  return [baseClassName, errorClass].filter(Boolean).join(' ');
}

