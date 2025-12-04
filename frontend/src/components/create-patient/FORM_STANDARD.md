# Form Development Standard

This document outlines the standard pattern for building forms using `@tanstack/react-form` in this codebase.

## File Structure

```
components/[feature-name]/
├── types.ts          # Form types and interfaces
├── schemas.ts        # Re-export Zod schemas (or define here)
├── utils.ts          # Form utility functions
├── [FormSection].tsx # Form section components
└── FORM_STANDARD.md  # This file (copy for new forms)
```

## Step-by-Step Guide

### 1. Define Schema (if not exists)

Create or use existing Zod schema in `schemas/`:

```typescript
// schemas/[feature].ts
import { z } from 'zod';

export const featureCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

export type FeatureCreateFormData = z.infer<typeof featureCreateSchema>;
```

### 2. Create Types File

```typescript
// components/[feature]/types.ts
import type { FormApi } from '@tanstack/react-form';
import type { FeatureCreateFormData } from '@/schemas/feature';

export type FeatureCreateFormApi = FormApi<FeatureCreateFormData, unknown>;

export interface FormFieldProps<TValue = unknown> {
  field: {
    name: string;
    state: {
      value: TValue;
      meta: {
        errors: string[];
        errorMap: Record<string, string | undefined>;
        touchedErrors: string[];
        isTouched: boolean;
        isValidating: boolean;
      };
    };
    handleChange: (value: TValue) => void;
    handleBlur: () => void;
  };
}

export interface FormComponentProps<TFormData> {
  form: FormApi<TFormData, unknown>;
}
```

### 3. Create Schemas File (Re-export)

```typescript
// components/[feature]/schemas.ts
export { featureCreateSchema, type FeatureCreateFormData } from '@/schemas/feature';
```

### 4. Create Utils File

```typescript
// components/[feature]/utils.ts
import type { FormFieldProps } from './types';

export function getFieldError(field: FormFieldProps['field']): string | undefined {
  return field.state.meta.errors[0];
}

export function hasFieldError(field: FormFieldProps['field']): boolean {
  return field.state.meta.errors.length > 0;
}

export function getFieldClassName(field: FormFieldProps['field'], baseClassName = ''): string {
  const errorClass = hasFieldError(field) ? 'border-destructive' : '';
  return [baseClassName, errorClass].filter(Boolean).join(' ');
}
```

### 5. Create Form Component

```typescript
// components/[feature]/FeatureForm.tsx
import { memo } from 'react';
import { Input, Label } from '@/components/ui';
import type { FormComponentProps } from './types';
import type { FeatureCreateFormData } from './schemas';
import { getFieldError, hasFieldError, getFieldClassName } from './utils';

interface FeatureFormProps extends FormComponentProps<FeatureCreateFormData> {}

const FeatureForm = memo(({ form }: FeatureFormProps) => {
  return (
    <form.Field
      name="name"
      validators={{
        onChange: ({ value }: { value: string }) =>
          !value || value.length < 1 ? 'Name is required' : undefined,
      }}
      children={(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Name *</Label>
          <Input
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={e => field.handleChange(e.target.value)}
            className={getFieldClassName(field)}
          />
          {hasFieldError(field) && (
            <p className="text-xs text-destructive">{getFieldError(field)}</p>
          )}
        </div>
      )}
    />
  );
});

FeatureForm.displayName = 'FeatureForm';
export { FeatureForm };
```

### 6. Use Form in Page

```typescript
// pages/FeatureCreate.tsx
import { useForm } from '@tanstack/react-form';
import { featureCreateSchema, type FeatureCreateFormData } from '@/schemas/feature';
import { FeatureForm } from '@/components/feature';

const FeatureCreate = () => {
  const form = useForm<FeatureCreateFormData>({
    defaultValues: {
      name: '',
      email: '',
    },
    onSubmit: async ({ value }) => {
      const result = featureCreateSchema.safeParse(value);
      if (!result.success) return;

      // Submit data
      await submitFeature(result.data);
    },
  });

  return (
    <form onSubmit={e => { e.preventDefault(); form.handleSubmit(); }}>
      <FeatureForm form={form} />
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Best Practices

1. **Always use typed FormApi**: Use `FormApi<TFormData, unknown>` instead of `any`
2. **Reuse utilities**: Use `getFieldError`, `hasFieldError`, `getFieldClassName` from utils
3. **Schema validation**: Always validate with Zod schema before submission
4. **Type safety**: Export form data types from schemas for reuse
5. **Component structure**: Keep form sections in separate components for reusability

## Common Patterns

### Required String Field
```typescript
validators={{
  onChange: ({ value }: { value: string }) =>
    !value || value.length < 1 ? 'Field is required' : undefined,
}}
```

### Email Validation
```typescript
validators={{
  onChange: ({ value }: { value: string }) => {
    if (!value || value.length < 1) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
    return undefined;
  },
}}
```

### Optional Email Field
```typescript
validators={{
  onChange: ({ value }: { value: string | undefined }) => {
    if (value && value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email format';
    }
    return undefined;
  },
}}
```

### Number Field
```typescript
validators={{
  onChange: ({ value }: { value: number }) =>
    value < 0 ? 'Value must be >= 0' : undefined,
}}
```

