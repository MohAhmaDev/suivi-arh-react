import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { HistoryEntry } from '../../types/history';
import { useEquipmentDetail } from '../../hooks/queries/useEquipmentDetail';
import { useDossierDetail } from '../../hooks/queries/useDossierDetail';
import { useDocuments } from '../../hooks/queries/useDocuments';
import { EquipmentStatusRail } from '../../components/equipment/EquipmentStatusRail';
import { DossierTable } from '../../components/dossiers/DossierTable';
import { DossierDetailPanel } from '../../components/dossiers/DossierDetailPanel';
import { CourrierTimeline } from '../../components/courriers/CourrierTimeline';
import { DocumentList } from '../../components/documents/DocumentList';
import { DocumentUploadDialog } from '../../components/documents/DocumentUploadDialog';
import { CreateDossierDialog } from '../../components/forms/CreateDossierDialog';
import { CreateCourrierDialog } from '../../components/forms/CreateCourrierDialog';
import { EquipmentDecisionDialog } from '../../components/forms/EquipmentDecisionDialog';
import { DossierDecisionDialog } from '../../components/forms/DossierDecisionDialog';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { EmptyState } from '../../components/shared/EmptyState';
import type { Dossier } from '../../types/dossier';

export const EquipmentDetailPage = () => {
  const navigate = useNavigate();
  const { equipmentId } = useParams();
  const id = Number(equipmentId);

  const {
    equipment,
    dossiers,
    history,
    loading,
    error,
    refetch,
  } = useEquipmentDetail(Number.isNaN(id) ? undefined : id);

  const [selectedDossierId, setSelectedDossierId] = useState<number | null>(null);
  const [pendingDossierId, setPendingDossierId] = useState<number | null>(null);
  const [selectedCourrierId, setSelectedCourrierId] = useState<number | null>(null);
  const [pendingCourrierId, setPendingCourrierId] = useState<number | null>(null);
  const [isCreateDossierOpen, setIsCreateDossierOpen] = useState(false);
  const [isCreateCourrierOpen, setIsCreateCourrierOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [equipmentDecision, setEquipmentDecision] = useState<{ open: boolean; mode: 'validate' | 'reject' }>({
    open: false,
    mode: 'validate',
  });
  const [dossierDecision, setDossierDecision] = useState<{ open: boolean; mode: 'validate' | 'reject'; dossier: Dossier | null}>(
    { open: false, mode: 'validate', dossier: null },
  );

  useEffect(() => {
    if (pendingDossierId && dossiers.some((dossier) => dossier.id === pendingDossierId)) {
      setSelectedDossierId(pendingDossierId);
      setPendingDossierId(null);
      return;
    }
    if (dossiers.length === 0) {
      setSelectedDossierId(null);
      return;
    }
    if (!selectedDossierId || !dossiers.some((dossier) => dossier.id === selectedDossierId)) {
      setSelectedDossierId(dossiers[0].id);
    }
  }, [dossiers, pendingDossierId, selectedDossierId]);

  const {
    dossier,
    courriers,
    loading: dossierLoading,
    refetch: refetchDossier,
  } = useDossierDetail(selectedDossierId ?? undefined);

  useEffect(() => {
    if (pendingCourrierId && courriers.some((courrier) => courrier.id === pendingCourrierId)) {
      setSelectedCourrierId(pendingCourrierId);
      setPendingCourrierId(null);
      return;
    }
    if (!courriers.length) {
      setSelectedCourrierId(null);
      return;
    }
    if (!selectedCourrierId || !courriers.some((courrier) => courrier.id === selectedCourrierId)) {
      setSelectedCourrierId(courriers[0].id);
    }
  }, [courriers, pendingCourrierId, selectedCourrierId]);

  const {
    data: documents,
    loading: documentsLoading,
    uploading,
    uploadDocument,
  } = useDocuments(selectedCourrierId ?? undefined);

  const dossierOptions = useMemo(() => dossiers.map((item) => ({ id: item.id, label: item.type_dossier })), [dossiers]);

  const userOptions = useMemo(() => {
    const unique = new Map<number, string>();
    courriers.forEach((courrier) => {
      unique.set(courrier.expediteur, courrier.expediteur_nom);
      unique.set(courrier.destinataire, courrier.destinataire_nom);
    });
    return Array.from(unique.entries()).map(([userId, label]) => ({ id: userId, label }));
  }, [courriers]);

  const selectedCourrier = courriers.find((item) => item.id === selectedCourrierId) ?? null;

  const handleDocumentUpload = (file: File, description?: string) => {
    if (!selectedCourrier) return;
    uploadDocument({ file, description })
      .then(() => {
        setIsUploadDialogOpen(false);
        if (selectedDossierId) {
          refetchDossier();
        }
      })
      .catch(() => {
        // handled via hook-level error state/snackbar
      });
  };

  const handleDossierAction = (dossierItem: Dossier, mode: 'validate' | 'reject') => {
    setDossierDecision({ open: true, mode, dossier: dossierItem });
  };

  const handleEquipmentAction = (mode: 'validate' | 'reject') => {
    setEquipmentDecision({ open: true, mode });
  };

  if (Number.isNaN(id)) {
    return <ErrorState error="Identifiant d'équipement invalide." />;
  }

  if (loading && !equipment) {
    return <LoadingState message="Chargement de l'équipement..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!equipment) {
    return <EmptyState title="Équipement introuvable" description="Vérifiez l'URL ou retournez à la liste." actionLabel="Retour" onAction={() => navigate('/equipment')} />;
  }

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton onClick={() => navigate('/equipment')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">{equipment.nom}</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        Projet : {equipment.projet_nom} · Localisation : {equipment.localisation || 'Non renseignée'} · Référence : {equipment.reference || '—'}
      </Typography>

      <EquipmentStatusRail
        status={equipment.statut}
        subtitle={`Dernière mise à jour le ${new Date(equipment.date_installation).toLocaleDateString('fr-FR')}`}
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="outlined" color="error" onClick={() => handleEquipmentAction('reject')}>
              Rejeter
            </Button>
            <Button variant="contained" onClick={() => handleEquipmentAction('validate')}>
              Valider
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={3}>
        <Grid xs={12} lg={8}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Dossiers ({dossiers.length})</Typography>
              <Button size="small" variant="outlined" onClick={() => setIsCreateDossierOpen(true)}>
                Nouveau dossier
              </Button>
            </Stack>
            {dossiers.length === 0 ? (
              <EmptyState title="Aucun dossier" description="Créez un dossier pour commencer le suivi." />
            ) : (
              <DossierTable
                dossiers={dossiers}
                onView={(item) => setSelectedDossierId(item.id)}
                onValidate={(item) => handleDossierAction(item, 'validate')}
                onReject={(item) => handleDossierAction(item, 'reject')}
              />
            )}
          </Paper>

          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Courriers</Typography>
              <Tooltip title={userOptions.length === 0 ? 'Aucun utilisateur disponible' : ''}>
                <span>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setIsCreateCourrierOpen(true)}
                    disabled={dossierOptions.length === 0 || userOptions.length === 0}
                  >
                    Nouveau courrier
                  </Button>
                </span>
              </Tooltip>
            </Stack>
            {dossierLoading ? (
              <LoadingState message="Chargement du dossier sélectionné..." />
            ) : courriers.length === 0 ? (
              <EmptyState title="Aucun courrier" description="Sélectionnez un dossier pour voir ses courriers." />
            ) : (
              <CourrierTimeline courriers={courriers} onSelect={(item) => setSelectedCourrierId(item.id)} />
            )}
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Détails du dossier
            </Typography>
            <DossierDetailPanel dossier={dossier ?? null} courriers={courriers} onCourrierSelect={(item) => setSelectedCourrierId(item.id)} />
          </Paper>
        </Grid>

        <Grid xs={12} lg={4}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Documents</Typography>
              <Button size="small" onClick={() => setIsUploadDialogOpen(true)} disabled={!selectedCourrier}>
                Ajouter
              </Button>
            </Stack>
            {documentsLoading ? (
              <LoadingState message="Chargement des documents..." />
            ) : selectedCourrier ? (
              <DocumentList
                documents={documents}
                onDownload={(document) => window.open(document.url_fichier, '_blank')}
                title={`Courrier #${selectedCourrier.id}`}
              />
            ) : (
              <EmptyState title="Sélectionnez un courrier" description="Choisissez un courrier pour afficher ses documents." />
            )}
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Historique
            </Typography>
            {history.length === 0 ? (
              <EmptyState title="Aucun événement" description="Aucune activité récente pour cet équipement." />
            ) : (
              <List>
                {history.map((entry: HistoryEntry) => (
                  <ListItem key={entry.id} divider>
                    <ListItemText
                      primary={`${entry.user_username} · ${entry.action}`}
                      secondary={new Date(entry.date_action).toLocaleString('fr-FR')}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      <CreateDossierDialog
        open={isCreateDossierOpen}
        equipmentId={equipment.id}
        equipmentName={equipment.nom}
        onClose={() => setIsCreateDossierOpen(false)}
        onSuccess={(newDossier) => {
          setPendingDossierId(newDossier.id);
          refetch();
          setIsCreateDossierOpen(false);
        }}
      />

      <CreateCourrierDialog
        open={isCreateCourrierOpen}
        dossierOptions={dossierOptions}
        userOptions={userOptions}
        defaultValues={selectedDossierId ? { dossier: selectedDossierId } : undefined}
        onClose={() => setIsCreateCourrierOpen(false)}
        onSuccess={(courrier) => {
          setIsCreateCourrierOpen(false);
          setPendingCourrierId(courrier.id);
          if (courrier.dossier === selectedDossierId) {
            refetchDossier();
          } else {
            setSelectedDossierId(courrier.dossier);
          }
        }}
      />

      <DocumentUploadDialog
        open={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onSubmit={handleDocumentUpload}
        submitting={uploading}
      />

      <EquipmentDecisionDialog
        open={equipmentDecision.open}
        equipmentId={equipment.id}
        equipmentName={equipment.nom}
        mode={equipmentDecision.mode}
        onClose={() => setEquipmentDecision((prev) => ({ ...prev, open: false }))}
        onSuccess={() => refetch()}
      />

      <DossierDecisionDialog
        open={dossierDecision.open}
        dossierId={dossierDecision.dossier?.id ?? 0}
        dossierLabel={dossierDecision.dossier?.type_dossier}
        mode={dossierDecision.mode}
        onClose={() => setDossierDecision({ open: false, mode: 'validate', dossier: null })}
        onSuccess={() => {
          refetch();
          if (selectedDossierId) {
            refetchDossier();
          }
        }}
      />
    </Box>
  );
};

export default EquipmentDetailPage;
