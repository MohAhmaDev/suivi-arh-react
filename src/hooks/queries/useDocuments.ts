import { useCallback, useEffect, useState } from 'react';
import { documentService } from '../../services/documentService';
import type { DocumentMetadata } from '../../types/document';

interface UploadArgs {
  file: File;
  description?: string;
}

export const useDocuments = (courrierId: number | undefined) => {
  const [data, setData] = useState<DocumentMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    if (!courrierId) {
      setData([]);
      return undefined;
    }

    let ignore = false;
    const controller = new AbortController();

    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        const documents = await documentService.list({ courrier: courrierId }, controller.signal);
        if (!ignore) setData(documents);
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Failed to load documents');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchDocuments();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [courrierId, reloadIndex]);

  const uploadDocument = useCallback(
    async ({ file, description }: UploadArgs) => {
      if (!courrierId) throw new Error('Cannot upload without a courrierId');
      setUploading(true);
      setError(null);
      try {
        await documentService.upload({ courrier: courrierId, fichier: file, description });
        setReloadIndex((prev) => prev + 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload document');
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [courrierId],
  );

  return {
    data,
    loading,
    error,
    uploading,
    uploadDocument,
    refetch: () => setReloadIndex((prev) => prev + 1),
  };
};
