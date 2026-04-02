import { Fragment, lazy } from 'react';
import { Route } from 'react-router-dom';

const Home = lazy(() => import('@/pages/user/home/Home'));
const Packages = lazy(() => import('@/pages/user/packages/pages/Packages'));
const PackageDetails = lazy(() => import('@/pages/user/packages/pages/PackageDetail'));
const BlogsPage = lazy(() => import('@/pages/user/blog/BlogsPage'));
const BlogDetail = lazy(() => import('@/pages/user/blog/BlogDetails'));
const About = lazy(() => import('@/pages/user/about/About'));
const DemoSetupPage = lazy(() => import('@/pages/user/DemoSetupPage'));

const CommonRoutes = (
  <Fragment>
    <Route path="/" element={<Home />} />
    <Route path="/packages" element={<Packages />} />
    <Route path="/packages/:id" element={<PackageDetails />} />
    <Route path="/blog" element={<BlogsPage />} />
    <Route path="/blog/:slug" element={<BlogDetail />} />
    <Route path="/about" element={<About />} />
    <Route path="/demo" element={<DemoSetupPage />} />
  </Fragment>
);

export default CommonRoutes;
// import { Route } from 'react-router-dom';
// import Home from '@/pages/user/home/Home';
// import Packages from '@/pages/user/packages/pages/Packages';
// import PackageDetails from '@/pages/user/packages/pages/PackageDetail';
// import BlogsPage from '@/pages/user/blog/BlogsPage';
// import BlogDetail from '@/pages/user/blog/BlogDetails';
// import About from '@/pages/user/about/About';
// import { Fragment } from 'react/jsx-runtime';
// import DemoSetupPage from '@/pages/user/DemoSetupPage';
// const CommonRoutes = (
//   <Fragment>
//     <Route path="/" element={<Home />} />
//     <Route path="/packages" element={<Packages />} />
//     <Route path="/packages/:id" element={<PackageDetails />} />
//     <Route path="/blog" element={<BlogsPage />} />
//     <Route path="/blog/:slug" element={<BlogDetail />} />
//     <Route path="/about" element={<About />} />
//     <Route path="/demo" element={<DemoSetupPage />} />
//   </Fragment>
// );

// export default CommonRoutes;
