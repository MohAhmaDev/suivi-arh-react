import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import { BreadcrumbsProvider } from '../context/BreadcrumbsContext';

export const ProtectedRoute = () => {
   const { isAuthenticated } = useAuth();
   if (!isAuthenticated) return <Navigate to="/login" replace />;

   return (
      <BreadcrumbsProvider>
         <AppShell>
            <Outlet />
         </AppShell>
      </BreadcrumbsProvider>
   );
};