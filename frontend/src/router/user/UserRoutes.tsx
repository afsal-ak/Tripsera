import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import Loader from '@/components/Loader';
import PublicRoutes from './PublicRoutes';
import CommonRoutes from './CommonRoutes';
import ProtectedRoutes from './ProtectedRoutes';
import UserLayout from '@/layouts/UserLayout';
import NotFoundPage from '@/components/NotFoundPage';

const UserRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {PublicRoutes}

        <Route element={<UserLayout />}>
          {CommonRoutes}
          {ProtectedRoutes}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default UserRoutes;
// import { Routes, Route } from 'react-router-dom';
// import PublicRoutes from './PublicRoutes';
// import CommonRoutes from './CommonRoutes';
// import ProtectedRoutes from './ProtectedRoutes';
// import UserLayout from '@/layouts/UserLayout';
// import NotFoundPage from '@/components/NotFoundPage';
// const UserRoutes = () => {
//   return (
//     <Routes>
//       {PublicRoutes}

//       <Route element={<UserLayout />}>
//         {CommonRoutes}

//         {ProtectedRoutes}
//       </Route>
//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   );
// };

// export default UserRoutes;
