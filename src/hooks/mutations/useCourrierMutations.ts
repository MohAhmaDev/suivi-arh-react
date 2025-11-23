import { useCallback, useState } from 'react';
import { courrierService } from '../../services/courrierService';
import type { Courrier, CreateCourrierPayload } from '../../types/courrier';
import { useSnackbar } from '../../context/SnackbarContext';

interface MutationOptions<TResult> {
  onSuccess?: (result: TResult) => void;
  onError?: (error: unknown) => void;
}

export const useCreateCourrier = () => {
  const { showMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const createCourrier = useCallback(
    async (payload: CreateCourrierPayload, options?: MutationOptions<Courrier>) => {
      setLoading(true);
      try {
        const result = await courrierService.create(payload);
        options?.onSuccess?.(result);
        showMessage('Courrier créé.');
        return result;
      } catch (error) {
        options?.onError?.(error);
        showMessage('Création du courrier impossible.');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [showMessage],
  );

  return { createCourrier, loading };
};
