import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import LoginPage from "../pages/Auth/LoginPage";
import ProjectsPage from "../pages/Projects/ProjectsPage";
import ProjectDetailPage from "../pages/Projects/ProjectDetailPage";
import EquipmentPage from "../pages/Equipment/EquipmentPage";
import EquipmentDetailPage from "../pages/Equipment/EquipmentDetailPage";
import DossiersPage from "../pages/Dossiers/DossiersPage";
import { ProtectedRoute } from "./ProdectedRoute";

export const router = createBrowserRouter([
   {
      path: '/',
      element: <ProtectedRoute />,
      handle: {
         breadcrumb: { label: 'Tableau de bord' },
      },
      children: [
         {
            index: true,
            element: <DashboardPage />,
            handle: {
               hideBreadcrumbs: true,
            },
         },
         {
            path: 'profile',
            element: <ProfilePage />,
            handle: {
               breadcrumb: { label: 'Mon profil' },
            },
         },
         {
            path: 'projects',
            element: <ProjectsPage />,
            handle: {
               breadcrumb: { label: 'Projets' },
            },
         },
         {
            path: 'projects/:projectId',
            element: <ProjectDetailPage />,
            handle: {
               breadcrumb: { label: 'Projet', dynamic: true },
            },
         },
         {
            path: 'equipment',
            element: <EquipmentPage />,
            handle: {
               breadcrumb: { label: 'Équipements' },
            },
         },
         {
            path: 'equipment/:equipmentId',
            element: <EquipmentDetailPage />,
            handle: {
               breadcrumb: { label: 'Équipement', dynamic: true },
            },
         },
         {
            path: 'dossiers',
            element: <DossiersPage />,
            handle: {
               breadcrumb: { label: 'Dossiers & Courriers' },
            },
         },
      ],
   },
   {
      path: '/login',
      element: <LoginPage />,
   },
]);