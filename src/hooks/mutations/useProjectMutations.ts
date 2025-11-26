import { useCallback, useState } from 'react';
import { projectService } from '../../services/projectService';
import type { CreateProjectPayload, Project } from '../../types/project';
import { useSnackbar } from '../../context/SnackbarContext';

interface MutationOptions<TResult> {
  onSuccess?: (result: TResult) => void;
  onError?: (error: unknown) => void;
}

const useProjectMutation = <TPayload, TResult>(
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

export const useCreateProject = () => {
  const { mutate, loading } = useProjectMutation<CreateProjectPayload, Project>(
    (payload) => projectService.create(payload),
    'Projet créé avec succès.',
    'Impossible de créer le projet.',
  );

  return { createProject: mutate, loading };
};
