import type { FieldError, FieldPath, FieldValues, FormState, UseFormReturn } from 'react-hook-form';

/**
 * Get the error message for a form field
 * @param formState - The form state from react-hook-form
 * @param fieldName - The name of the field
 * @returns The error message or undefined if no error
 */
export function getFieldError<TFormData extends FieldValues>(
  formState: FormState<TFormData>,
  fieldName: FieldPath<TFormData>
): string | undefined {
  const error = formState.errors[fieldName] as FieldError | undefined;
  return error?.message;
}

/**
 * Check if a field should show an error based on form state
 * Shows error if:
 * - Form has been submitted (show all errors), OR
 * - Field is dirty OR touched OR empty (any of these conditions)
 * 
 * This matches the logic used in ControlledInput component for consistency.
 * 
 * @param formState - The form state from react-hook-form
 * @param fieldName - The name of the field
 * @param getValues - Function to get the current value of a field
 * @returns true if the error should be displayed
 */
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

  // Check if field has been touched (user focused/blurred it)
  const isTouched = !!(formState.touchedFields as Partial<Record<FieldPath<TFormData>, boolean>>)[fieldName];

  // Show error if:
  // 1. Form has been submitted (show all errors), OR
  // 2. Field is dirty OR touched OR empty (any of these conditions)
  return isSubmitted || (isDirty || isTouched || isEmpty);
}

/**
 * Get the CSS class name for a form field, including error styling
 * @param formState - The form state from react-hook-form
 * @param fieldName - The name of the field
 * @param getValues - Function to get the current value of a field
 * @param baseClassName - Optional base CSS class name
 * @returns Combined class name string
 */
export function getFieldClassName<TFormData extends FieldValues>(
  formState: FormState<TFormData>,
  fieldName: FieldPath<TFormData>,
  getValues: (name: FieldPath<TFormData>) => any,
  baseClassName = ''
): string {
  const errorClass = hasFieldError(formState, fieldName, getValues) ? 'border-destructive' : '';
  return [baseClassName, errorClass].filter(Boolean).join(' ');
}

/**
 * Convenience wrapper for UseFormReturn that extracts formState and getValues
 * This allows the same utility functions to work with UseFormReturn directly
 */
export function getFieldErrorFromForm<TFormData extends FieldValues>(
  form: UseFormReturn<TFormData>,
  fieldName: FieldPath<TFormData>
): string | undefined {
  return getFieldError(form.formState, fieldName);
}

export function hasFieldErrorFromForm<TFormData extends FieldValues>(
  form: UseFormReturn<TFormData>,
  fieldName: FieldPath<TFormData>
): boolean {
  return hasFieldError(form.formState, fieldName, form.getValues);
}

export function getFieldClassNameFromForm<TFormData extends FieldValues>(
  form: UseFormReturn<TFormData>,
  fieldName: FieldPath<TFormData>,
  baseClassName = ''
): string {
  return getFieldClassName(form.formState, fieldName, form.getValues, baseClassName);
}

