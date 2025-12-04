import type { FormField } from './types';

export function getFieldError<TValue = unknown>(field: FormField<TValue>): string | undefined {
  return field.state.meta.errors[0];
}

export function hasFieldError<TValue = unknown>(field: FormField<TValue>): boolean {
  return field.state.meta.errors.length > 0;
}

export function getFieldClassName<TValue = unknown>(field: FormField<TValue>, baseClassName = ''): string {
  const errorClass = hasFieldError(field) ? 'border-destructive' : '';
  return [baseClassName, errorClass].filter(Boolean).join(' ');
}

