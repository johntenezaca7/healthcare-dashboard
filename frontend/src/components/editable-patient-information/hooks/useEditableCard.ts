import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

/**
 * Custom hook to manage common editable card state and logic
 * Extracts the duplicate pattern from all Editable*Card components
 */
export function useEditableCard<TFormData extends Record<string, unknown>>(
  defaultValues: TFormData,
  form: UseFormReturn<TFormData>,
  onUpdate: () => void
) {
  const [isEditing, setIsEditing] = useState(false);

  // Reset form when initial values change and not editing
  useEffect(() => {
    if (!isEditing) {
      form.reset(defaultValues);
    }
  }, [defaultValues, isEditing, form]);

  const handleCancel = () => {
    form.reset(defaultValues);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSuccess = () => {
    setIsEditing(false);
    onUpdate();
  };

  return {
    isEditing,
    setIsEditing,
    handleCancel,
    handleEdit,
    handleSuccess,
  };
}

