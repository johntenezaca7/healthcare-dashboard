import { Edit } from 'lucide-react';

import { Button, CardHeader, CardTitle } from '@/components/ui';

interface EditableCardHeaderProps {
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  isValid?: boolean;
}

export const EditableCardHeader = ({
  title,
  isEditing,
  onEdit,
  onCancel,
  onSubmit,
  isSubmitting = false,
  isValid = true,
}: EditableCardHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle>{title}</CardTitle>
      {!isEditing ? (
        <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button size="sm" onClick={onSubmit} disabled={!isValid || isSubmitting}>
            Save
          </Button>
        </div>
      )}
    </CardHeader>
  );
};

