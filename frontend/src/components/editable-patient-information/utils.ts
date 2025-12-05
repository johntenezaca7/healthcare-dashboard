import type { FieldError, FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

// Helper functions that work with react-hook-form
export function getFieldError<TFormData extends FieldValues>(
  form: UseFormReturn<TFormData>,
  fieldName: FieldPath<TFormData>
): string | undefined {
  const error = form.formState.errors[fieldName] as FieldError | undefined;
  return error?.message;
}

export function hasFieldError<TFormData extends FieldValues>(
  form: UseFormReturn<TFormData>,
  fieldName: FieldPath<TFormData>
): boolean {
  return !!form.formState.errors[fieldName];
}

export function getFieldClassName<TFormData extends FieldValues>(
  form: UseFormReturn<TFormData>,
  fieldName: FieldPath<TFormData>,
  baseClassName = ''
): string {
  const errorClass = hasFieldError(form, fieldName) ? 'border-destructive' : '';
  return [baseClassName, errorClass].filter(Boolean).join(' ');
}
