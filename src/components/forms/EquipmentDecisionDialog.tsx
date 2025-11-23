import { useMemo } from 'react';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { useValidateEquipment, useRejectEquipment } from '../../hooks/mutations/useEquipmentMutations';

interface EquipmentDecisionDialogProps {
  open: boolean;
  equipmentId: number;
  equipmentName?: string;
  mode: 'validate' | 'reject';
  onClose: () => void;
  onSuccess?: (result: { id: number; statut: string }) => void;
}

export const EquipmentDecisionDialog = ({
  open,
  equipmentId,
  equipmentName,
  mode,
  onClose,
  onSuccess,
}: EquipmentDecisionDialogProps) => {
  const { validateEquipment, loading: validating } = useValidateEquipment();
  const { rejectEquipment, loading: rejecting } = useRejectEquipment();

  const { title, description } = useMemo(() => {
    if (mode === 'validate') {
      return {
        title: 'Valider cet équipement ?',
        description: `Confirmez la validation de ${equipmentName ?? 'cet équipement'}.`,
      };
    }
    return {
      title: 'Rejeter cet équipement ?',
      description: `Indiquez que ${equipmentName ?? "l'équipement"} est refusé.`,
    };
  }, [equipmentName, mode]);

  const loading = mode === 'validate' ? validating : rejecting;

  const handleConfirm = async () => {
    try {
      if (mode === 'validate') {
        await validateEquipment(equipmentId, {
          onSuccess: (result) => onSuccess?.(result),
        });
      } else {
        await rejectEquipment(equipmentId, {
          onSuccess: (result) => onSuccess?.(result),
        });
      }
      onClose();
    } catch {
      // snackbar handles errors
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title={title}
      description={description}
      loading={loading}
      onConfirm={handleConfirm}
      onCancel={onClose}
      confirmLabel={mode === 'validate' ? 'Valider' : 'Rejeter'}
    />
  );
};
