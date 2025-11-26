import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import type { HistoryEntry } from '../../types/history';
import { useEquipmentDetail } from '../../hooks/queries/useEquipmentDetail';
import { useDossierDetail } from '../../hooks/queries/useDossierDetail';
import { useDocuments } from '../../hooks/queries/useDocuments';
import { EquipmentStatusRail } from '../../components/equipment/EquipmentStatusRail';
import { DossierAccordion } from '../../components/dossiers/DossierAccordion';
import { DossierDetailPanel } from '../../components/dossiers/DossierDetailPanel';
import { CourrierSummaryCard } from '../../components/courriers/CourrierSummaryCard';
import { HistoryModal } from '../../components/equipment/HistoryModal';
import { DocumentList } from '../../components/documents/DocumentList';
import { DocumentUploadDialog } from '../../components/documents/DocumentUploadDialog';
import { CreateCourrierDialog } from '../../components/forms/CreateCourrierDialog';
import { EquipmentDecisionDialog } from '../../components/forms/EquipmentDecisionDialog';
import { DossierDecisionDialog } from '../../components/forms/DossierDecisionDialog';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { EmptyState } from '../../components/shared/EmptyState';
import type { Dossier } from '../../types/dossier';
import { useDynamicBreadcrumb } from '../../context/BreadcrumbsContext';

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

  useDynamicBreadcrumb(equipment?.nom);

  const [selectedDossierId, setSelectedDossierId] = useState<number | null>(null);
  const [selectedCourrierId, setSelectedCourrierId] = useState<number | null>(null);
  const [pendingCourrierId, setPendingCourrierId] = useState<number | null>(null);
  const [isCreateCourrierOpen, setIsCreateCourrierOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [equipmentDecision, setEquipmentDecision] = useState<{ open: boolean; mode: 'validate' | 'reject' }>({
    open: false,
    mode: 'validate',
  });
  const [dossierDecision, setDossierDecision] = useState<{ open: boolean; mode: 'validate' | 'reject'; dossier: Dossier | null}>(
    { open: false, mode: 'validate', dossier: null },
  );

  useEffect(() => {
    if (dossiers.length === 0) {
      setSelectedDossierId(null);
      return;
    }
    if (!selectedDossierId || !dossiers.some((dossier) => dossier.id === selectedDossierId)) {
      setSelectedDossierId(dossiers[0].id);
    }
  }, [dossiers, selectedDossierId]);

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
      {/* Header */}
      <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
          <IconButton
            onClick={() => navigate('/equipment')}
            sx={{ width: 40, height: 40 }}
          >
            <ArrowBackIcon sx={{ fontSize: 24 }} />
          </IconButton>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 700, mb: 0.25 }}>
              {equipment.nom}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              Projet : {equipment.projet_nom} · Localisation : {equipment.localisation || 'Non renseignée'} · Référence : {equipment.reference || '—'}
            </Typography>
          </Box>
        </Stack>
        
        <Button
          variant="outlined"
          startIcon={<HistoryIcon />}
          onClick={() => setIsHistoryModalOpen(true)}
          sx={{ fontSize: '0.875rem', py: 0.75, px: 2, fontWeight: 500 }}
        >
          Voir l'historique
        </Button>
      </Stack>

      {/* Status Rail */}
      <Box sx={{ mb: 3 }}>
        <EquipmentStatusRail
          
          status={equipment.statut}
          subtitle={`Dernière mise à jour le ${new Date(equipment.date_installation).toLocaleDateString('fr-FR')}`}
          actions={
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleEquipmentAction('reject')}
                sx={{ fontSize: '0.875rem', py: 1, px: 2, fontWeight: 500, minWidth: 100 }}
              >
                Rejeter
              </Button>
              <Button
                variant="contained"
                onClick={() => handleEquipmentAction('validate')}
                sx={{ fontSize: '0.875rem', py: 1, px: 2, fontWeight: 500, minWidth: 100 }}
              >
                Valider
              </Button>
            </Stack>
          }
        />
      </Box>

      {/* Main Content */}
      <Grid container spacing={.2}>
        <Grid xs={12} lg={7.5}>
          {/* Dossiers Section */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'sm',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ fontSize: '1.125rem', fontWeight: 600 }}>
                Dossiers ({dossiers.length})
              </Typography>
            </Stack>
            {dossiers.length === 0 ? (
              <EmptyState title="Aucun dossier" description="Aucun dossier n'est encore associé à cet équipement." />
            ) : (
              <DossierAccordion
                dossiers={dossiers}
                onView={(item) => setSelectedDossierId(item.id)}
                onValidate={(item) => handleDossierAction(item, 'validate')}
                onReject={(item) => handleDossierAction(item, 'reject')}
              />
            )}
          </Paper>

          {/* Courriers Section */}
          <Paper
            // style={{
            //   display: "none"
            // }}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'sm',
            }}
            
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ fontSize: '1.125rem', fontWeight: 600 }}>
                Courriers
              </Typography>
              <Tooltip title={userOptions.length === 0 ? 'Aucun utilisateur disponible' : ''}>
                <span>
                  <Button
                    variant="contained"
                    onClick={() => setIsCreateCourrierOpen(true)}
                    disabled={dossierOptions.length === 0 || userOptions.length === 0}
                    sx={{ fontSize: '0.875rem', py: 0.875, px: 2, fontWeight: 500 }}
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
              <CourrierSummaryCard courriers={courriers} onSelect={(item) => setSelectedCourrierId(item.id)} />
            )}
          </Paper>

          {/* Dossier Details Section */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'sm',
            }}
          >
            <Typography variant="h5" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 2 }}>
              Détails du dossier
            </Typography>
            <DossierDetailPanel dossier={dossier ?? null} courriers={courriers} onCourrierSelect={(item) => setSelectedCourrierId(item.id)} />
          </Paper>
        </Grid>

        <Grid xs={12} lg={4} sx={{
          ml: { xs: 0, lg: 5 },   // espacement uniquement en large screen
          mt: { xs: 3, lg: 0 },   // marge top sur mobile, optionnel
        }}>
          {/* Documents Section with Tabs */}
          <Paper
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'sm',
              overflow: 'hidden',
              
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{
                  px: 2,
                  '& .MuiTab-root': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    minHeight: 48,
                  },
                }}
              >
                <Tab label="Documents" />
                <Tab label="Informations" />
              </Tabs>
            </Box>

            <Box sx={{ p: 4 ,}}>
              {activeTab === 0 && (
                <>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                      Documents
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => setIsUploadDialogOpen(true)}
                      disabled={!selectedCourrier}
                      sx={{ fontSize: '0.8125rem', py: 0.75, px: 2, fontWeight: 500 }}
                    >
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
                </>
              )}

              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2 }}>
                    Informations sur l'équipement
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: 'grey.50',
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                        Nom
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {equipment.nom}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: 'grey.50',
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                        Projet
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {equipment.projet_nom}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: 'grey.50',
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                        Localisation
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {equipment.localisation || 'Non renseignée'}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: 'grey.50',
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                        Référence
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {equipment.reference || '—'}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: 'grey.50',
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                        Date d'installation
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {new Date(equipment.date_installation).toLocaleDateString('fr-FR')}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* History Modal */}
      <HistoryModal
        open={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
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
