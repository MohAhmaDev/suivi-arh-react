import { useCallback, useState } from 'react';
import { dossierService } from '../../services/dossierService';
import type {
  CreateDossierPayload,
  Dossier,
  DossierValidationPayload,
} from '../../types/dossier';
import { useSnackbar } from '../../context/SnackbarContext';

interface MutationOptions<TResult> {
  onSuccess?: (result: TResult) => void;
  onError?: (error: unknown) => void;
}

type StatusResponse = { id: number; statut: string };

type MutationTuple<TPayload, TResult> = {
  mutate: (payload: TPayload, options?: MutationOptions<TResult>) => Promise<TResult>;
  loading: boolean;
};

const useDossierMutation = <TPayload, TResult>(
  request: (payload: TPayload) => Promise<TResult>,
  successMessage: string,
  errorMessage: string,
): MutationTuple<TPayload, TResult> => {
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

  return { mutate, loading };
};

export const useCreateDossier = () => {
  const { mutate, loading } = useDossierMutation<CreateDossierPayload, Dossier>(
    (payload) => dossierService.create(payload),
    'Dossier créé.',
    'Création du dossier impossible.',
  );

  return { createDossier: mutate, loading };
};

export const useValidateDossier = () => {
  const { mutate, loading } = useDossierMutation<{ id: number; payload?: DossierValidationPayload }, StatusResponse>(
    ({ id, payload }) => dossierService.validate(id, payload),
    'Dossier validé.',
    'Validation du dossier impossible.',
  );

  return { validateDossier: mutate, loading };
};

export const useRejectDossier = () => {
  const { mutate, loading } = useDossierMutation<{ id: number; payload: DossierValidationPayload }, StatusResponse>(
    ({ id, payload }) => dossierService.reject(id, payload),
    'Dossier rejeté.',
    'Rejet du dossier impossible.',
  );

  return { rejectDossier: mutate, loading };
};
