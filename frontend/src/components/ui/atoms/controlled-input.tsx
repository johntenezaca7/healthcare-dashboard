import { useController, useFormContext } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui';

interface ControlledInputProps<TFormData extends FieldValues = FieldValues> {
  name: FieldPath<TFormData>;
  control?: Control<TFormData>;
  label?: string;
  type?: string;
  required?: boolean;
  id?: string;
}

/**
 * Reusable controlled input component using useController
 * Following React Hook Form docs: https://react-hook-form.com/docs/usecontroller
 */
export function ControlledInput<TFormData extends FieldValues = FieldValues>({
  name,
  control,
  label,
  type = 'text',
  required = false,
  id,
}: ControlledInputProps<TFormData>) {
  const context = useFormContext<TFormData>();
  const controllerControl = control || context.control;

  const {
    field,
    fieldState: { invalid, isDirty, isTouched, error },
    formState: { isSubmitted },
  } = useController({
    name,
    control: controllerControl,
  });

  const isEmpty = field.value === '' || field.value == null || field.value === undefined;

  const showError = invalid && (isSubmitted || (isDirty || isTouched || isEmpty));

  const inputId = id || name;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium">
          {label} {required && '*'}
        </label>
      )}
      <Input
        {...field}
        id={inputId}
        type={type}
        className={showError ? 'border-destructive' : ''}
        aria-required={required}
        aria-invalid={showError}
        aria-describedby={showError ? `${inputId}-error` : undefined}
      />
      {showError && error?.message && (
        <p id={`${inputId}-error`} className="text-xs text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}

