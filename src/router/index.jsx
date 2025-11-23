import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "../pages/Dashboard/DashboardPage";
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
      element: (
         <ProtectedRoute>
            <DashboardPage />
         </ProtectedRoute>
      ),
   },
   {
      path: '/projects',
      element: (
         <ProtectedRoute>
            <ProjectsPage />
         </ProtectedRoute>
      ),
   },
   {
      path: '/projects/:projectId',
      element: (
         <ProtectedRoute>
            <ProjectDetailPage />
         </ProtectedRoute>
      ),
   },
   {
      path: '/equipment',
      element: (
         <ProtectedRoute>
            <EquipmentPage />
         </ProtectedRoute>
      ),
   },
   {
      path: '/equipment/:equipmentId',
      element: (
         <ProtectedRoute>
            <EquipmentDetailPage />
         </ProtectedRoute>
      ),
   },
   {
      path: '/dossiers',
      element: (
         <ProtectedRoute>
            <DossiersPage />
         </ProtectedRoute>
      ),
   },
   {
      path: '/login',
      element: <LoginPage />,
   },
]);