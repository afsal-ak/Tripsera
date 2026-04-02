import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Loader from './components/Loader';
import CompanyRoutes from './router/company/CompanyRoutes';
import { closeSnackbar, SnackbarProvider } from 'notistack';

// Lazy load route components
const AdminRoutes = lazy(() => import('./router/admin/AdminRoutes'));
const UserRoutes = lazy(() => import('./router/user/UserRoutes'));

function App() {
  return (
    <>
     {/* <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    > */}
    <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        action={(snackbarId) => (
          <button
            onClick={() => closeSnackbar(snackbarId)}
          //  className="ml-2 text-white font-bold text-lg"
          >
            ✕
          </button>
        )}
      >
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/company/*" element={<CompanyRoutes />} />
          <Route path="/*" element={<UserRoutes />} />
        </Routes>
      </Suspense>

      <Toaster position="top-right" expand={true} duration={2000} theme="dark" richColors />
   </SnackbarProvider>
    </>
  );
}

export default App;
