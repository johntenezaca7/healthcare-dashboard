import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/**
 * Creates a form wrapper component for testing react-hook-form components
 */
export function createFormWrapper<T extends yup.AnyObjectSchema>(
  schema: T,
  defaultOptions?: {
    mode?: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all';
    reValidateMode?: 'onBlur' | 'onChange' | 'onSubmit' | 'all';
  }
) {
  return ({
    defaultValues,
    children,
  }: {
    defaultValues?: Partial<yup.InferType<T>>;
    children: (form: UseFormReturn<yup.InferType<T>>) => React.ReactNode;
  }) => {
    const form = useForm<yup.InferType<T>>({
      resolver: yupResolver(schema),
      defaultValues: defaultValues as yup.InferType<T>,
      mode: defaultOptions?.mode || 'onSubmit',
      reValidateMode: defaultOptions?.reValidateMode || 'onChange',
      criteriaMode: 'all',
    });

    return <>{children(form)}</>;
  };
}

/**
 * Creates a form wrapper with a submit button for testing form submission
 */
export function createFormWithSubmit<T extends yup.AnyObjectSchema>(
  schema: T,
  defaultOptions?: {
    mode?: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all';
    reValidateMode?: 'onBlur' | 'onChange' | 'onSubmit' | 'all';
  }
) {
  return ({
    defaultValues,
    children,
    onSubmit,
  }: {
    defaultValues?: Partial<yup.InferType<T>>;
    children: (form: UseFormReturn<yup.InferType<T>>) => React.ReactNode;
    onSubmit?: (data: yup.InferType<T>) => void;
  }) => {
    const form = useForm<yup.InferType<T>>({
      resolver: yupResolver(schema),
      defaultValues: defaultValues as yup.InferType<T>,
      mode: defaultOptions?.mode || 'onSubmit',
      reValidateMode: defaultOptions?.reValidateMode || 'onChange',
      criteriaMode: 'all',
    });

    const handleSubmit = form.handleSubmit(
      (data) => {
        onSubmit?.(data);
      },
      () => {
        // Validation errors are automatically set in formState.errors
        // This callback is called when validation fails
      }
    );

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit(e);
        }}
        noValidate
      >
        {children(form)}
        <button type="submit">Submit</button>
      </form>
    );
  };
}

