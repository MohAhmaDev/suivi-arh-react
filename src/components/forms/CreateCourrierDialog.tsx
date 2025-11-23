import type { CreateCourrierPayload } from '../../types/courrier';
import type { Courrier } from '../../types/courrier';
import { CourrierFormDialog } from '../courriers/CourrierFormDialog';
import { useCreateCourrier } from '../../hooks/mutations/useCourrierMutations';

interface Option {
  id: number;
  label: string;
}

interface CreateCourrierDialogProps {
  open: boolean;
  dossierOptions: Option[];
  userOptions: Option[];
  defaultValues?: Partial<CreateCourrierPayload>;
  onClose: () => void;
  onSuccess?: (courrier: Courrier) => void;
}

export const CreateCourrierDialog = ({
  open,
  dossierOptions,
  userOptions,
  defaultValues,
  onClose,
  onSuccess,
}: CreateCourrierDialogProps) => {
  const { createCourrier, loading } = useCreateCourrier();

  const handleSubmit = async (values: CreateCourrierPayload) => {
    try {
      await createCourrier(values, {
        onSuccess: (courrier) => onSuccess?.(courrier),
      });
      onClose();
    } catch {
      // snackbar already handles errors
    }
  };

  return (
    <CourrierFormDialog
      open={open}
      dossierOptions={dossierOptions}
      userOptions={userOptions}
      defaultValues={defaultValues}
      loading={loading}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
};
