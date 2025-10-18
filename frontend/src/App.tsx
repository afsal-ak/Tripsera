import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Loader from './components/Loader';

// Lazy load route components
const AdminRoutes = lazy(() => import('./router/admin/AdminRoutes'));
const UserRoutes = lazy(() => import('./router/user/UserRoutes'));

function App() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/*" element={<UserRoutes />} />
        </Routes>
      </Suspense>

      <Toaster position="top-right" expand={true} duration={2000} theme="dark" richColors />
    </>
  );
}

export default App;
