import { useCallback, useState } from 'react';
import { equipmentService, type UpdateEquipmentPayload } from '../../services/equipmentService';
import type { Equipment, CreateEquipmentPayload } from '../../types/equipment';
import { useSnackbar } from '../../context/SnackbarContext';

interface MutationOptions<TResult> {
  onSuccess?: (result: TResult) => void;
  onError?: (error: unknown) => void;
}

type StatusResponse = { id: number; statut: string };

type UpdateResult = Equipment;

type CreateResult = Equipment;

const useMutationHandler = <TPayload, TResult>(
  request: (payload: TPayload) => Promise<TResult>,
  successMessage: string,
  errorMessage: string,
) => {
  const { showMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(
    async (payload: TPayload, options?: MutationOptions<TResult>) => {
      setLoading(true);
      try {
        const result = await request(payload);
        options?.onSuccess?.(result);
        showMessage(successMessage);
        return result;
      } catch (error) {
        options?.onError?.(error);
        showMessage(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [request, successMessage, errorMessage, showMessage],
  );

  return { mutate, loading } as const;
};

export const useCreateEquipment = () => {
  const { mutate, loading } = useMutationHandler<CreateEquipmentPayload, CreateResult>(
    (payload) => equipmentService.create(payload),
    'Équipement créé avec succès.',
    "Impossible de créer l'équipement.",
  );

  return { createEquipment: mutate, loading };
};

export const useUpdateEquipment = () => {
  const { mutate, loading } = useMutationHandler<
    { id: number; payload: UpdateEquipmentPayload },
    UpdateResult
  >(
    ({ id, payload }) => equipmentService.update(id, payload),
    'Équipement mis à jour.',
    "Mise à jour de l'équipement impossible.",
  );

  return { updateEquipment: mutate, loading };
};

export const useValidateEquipment = () => {
  const { mutate, loading } = useMutationHandler<number, StatusResponse>(
    (id) => equipmentService.validate(id),
    'Équipement validé.',
    "Validation de l'équipement impossible.",
  );

  return { validateEquipment: mutate, loading };
};

export const useRejectEquipment = () => {
  const { mutate, loading } = useMutationHandler<number, StatusResponse>(
    (id) => equipmentService.reject(id),
    "Équipement marqué comme refusé.",
    "Rejet de l'équipement impossible.",
  );

  return { rejectEquipment: mutate, loading };
};
