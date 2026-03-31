import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, User, X, Bell, MessageCircle, PlaneTakeoff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/redux/slices/userAuthSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { toast } from 'sonner';
import { useTotalUnreadCount } from '@/hooks/useTotalUnreadCount';
import { EnumUserRole } from '@/Constants/enums/userEnum';
import { OptionsDropdown } from '../OptionsDropdown ';
import ProtectedLink from '../ProtectedLink';

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, accessToken, user } = useSelector(
    (state: RootState) => state.userAuth
  );

  const notificationUnread = useSelector(
    (state: RootState) => state.notifications.unreadCount
  );

  const totalChatUnread = useTotalUnreadCount(EnumUserRole.USER);

  const unreadNotifications = isAuthenticated ? notificationUnread : 0;
  const unreadChats = isAuthenticated ? totalChatUnread : 0;

  useEffect(() => {
    if (!accessToken) {
      dispatch(logoutUser());
    }
  }, [accessToken, dispatch]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileImage = user?.profileImage?.url
    ? user.profileImage.url.replace('/upload/', '/upload/f_webp,q_auto/')
    : '/profile-default.jpg';

  // ✅ Active logic
  // const isActive = (path: string) =>
  //   location.pathname === path || location.pathname.startsWith(path);
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'; // exact match only
    }
    return location.pathname.startsWith(path);
  };
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-background shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center space-x-8">
            {/* <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-orange">
              Tripsera
              <PlaneTakeoff className="w-6 h-6" />
            </Link> */}
     <Link
  to="/"
  className="flex items-center gap-2 text-2xl font-bold"
>
  <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
    Tripsera
  </span>
  <PlaneTakeoff className="w-5 h-5 text-orange-500" />
</Link>
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">

              {[
                { to: '/', label: 'Home' },
                { to: '/packages', label: 'Packages' },
                { to: '/blog', label: 'Blog' },
                { to: '/about', label: 'About' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative pb-1 ${isActive(item.to)
                      ? 'text-orange font-semibold'
                      : 'hover:text-orange'
                    }`}
                >
                  {item.label}
                  {isActive(item.to) && (
                    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-orange rounded"></span>
                  )}
                </Link>
              ))}

              <ProtectedLink
                to="/custom-package"
                requireAuth
                className={`relative pb-1 ${isActive('/custom-package')
                    ? 'text-orange font-semibold'
                    : 'hover:text-orange'
                  }`}
              >
                Custom Package
                {isActive('/custom-package') && (
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-orange"></span>
                )}
              </ProtectedLink>

              <Link to="/demo" className="bg-orange text-white px-3 py-1 rounded text-sm">
                Demo Access
              </Link>
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center space-x-5">

            {/* ✅ Chat Icon */}
            <ProtectedLink
              to="/chat"
              requireAuth
              className="relative flex flex-col items-center"
            >
              <MessageCircle
                className={`w-6 h-6 ${isActive('/chat') ? 'text-orange' : 'hover:text-orange'
                  }`}
              />
              {unreadChats > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {unreadChats}
                </span>
              )}
              {isActive('/chat') && (
                <span className="absolute -bottom-1 w-5 h-[2px] bg-orange rounded"></span>
              )}
            </ProtectedLink>

            {/* ✅ Notification Icon */}
            <ProtectedLink
              to="/notification"
              requireAuth
              className="relative flex flex-col items-center"
            >
              <Bell
                className={`w-6 h-6 ${isActive('/notification') ? 'text-orange' : 'hover:text-orange'
                  }`}
              />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {unreadNotifications}
                </span>
              )}
              {isActive('/notification') && (
                <span className="absolute -bottom-1 w-5 h-[2px] bg-orange rounded"></span>
              )}
            </ProtectedLink>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden sm:flex">
                <OptionsDropdown
                  options={[
                    { label: 'My Account', value: 'profile' },
                    { label: 'Wishlist', value: 'wishlist' },
                    { label: 'Logout', value: 'logout', className: 'text-red-500' },
                  ]}
                  onSelect={(value) => {
                    if (value === 'profile') navigate('/account/profile');
                    else if (value === 'wishlist') navigate('/account/wishlist');
                    else if (value === 'logout') {
                      dispatch(logoutUser());
                      toast.success('Logout successful');
                    }
                  }}
                  triggerElement={
                    <img
                      src={profileImage}
                      className="w-10 h-10 rounded-full cursor-pointer"
                    />
                  }
                />
              </div>
            ) : (
              <>
                <Link to="/login">
                   <Button
                    variant="outline"
                    className="border-orange text-orange hover:bg-orange hover:text-white hidden sm:flex"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-orange hover:bg-orange-dark text-white hidden sm:flex">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-3 border-t pt-4">

            {[
              { to: '/', label: 'Home' },
              { to: '/packages', label: 'Packages' },
              { to: '/blog', label: 'Blog' },
              { to: '/about', label: 'About' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                className="block px-2 py-2 rounded hover:bg-gray-100"
              >
                {item.label}
              </Link>
            ))}

            <ProtectedLink to="/custom-package" requireAuth onClick={closeMenu} className="px-2 py-2">
              Custom Package
            </ProtectedLink>

            <ProtectedLink to="/chat" requireAuth onClick={closeMenu} className="px-2 py-2">
              Chat ({unreadChats})
            </ProtectedLink>

            <ProtectedLink to="/notification" requireAuth onClick={closeMenu} className="px-2 py-2">
              Notifications ({unreadNotifications})
            </ProtectedLink>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  dispatch(logoutUser());
                  closeMenu();
                }}
                className="text-red-500 px-2 py-2"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="px-2 py-2">
                  Login
                </Link>
                <Link to="/signup" onClick={closeMenu} className="px-2 py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
// import { useEffect, useState } from 'react';
// import { Button } from '../ui/button';
// import { Link, useNavigate } from 'react-router-dom';
// import { Menu, User, X, Bell, MessageCircle } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { logoutUser } from '@/redux/slices/userAuthSlice';
// import type { AppDispatch, RootState } from '@/redux/store';
// import { toast } from 'sonner';
// import { useTotalUnreadCount } from '@/hooks/useTotalUnreadCount';
// import { EnumUserRole } from '@/Constants/enums/userEnum';
// import { OptionsDropdown } from '../OptionsDropdown ';
// import ProtectedLink from '../ProtectedLink';

// const Navbar = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const { isAuthenticated, accessToken, user } = useSelector(
//     (state: RootState) => state.userAuth
//   );

//   const notificationUnread = useSelector(
//     (state: RootState) => state.notifications.unreadCount
//   );
//   // const notificationUnread=0
//   // const totalChatUnread = 0
//   const totalChatUnread = useTotalUnreadCount(EnumUserRole.USER);

//   const unreadNotifications = isAuthenticated ? notificationUnread : 0;
//   const unreadChats = isAuthenticated ? totalChatUnread : 0;

//   useEffect(() => {
//     if (!accessToken) {
//       dispatch(logoutUser());
//     }
//   }, [accessToken, dispatch]);

//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const profileImage = user?.profileImage?.url
//     ? user.profileImage.url.replace('/upload/', '/upload/f_webp,q_auto/')
//     : '/profile-default.jpg';

//   return (
//     <header className="bg-background shadow-sm border-b sticky top-0 z-50">
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex items-center justify-between">
//           {/* Left - Logo & Links */}
//           <div className="flex items-center space-x-8">
//             <Link to="/" className="text-2xl font-bold">
//               <span className="text-orange">Tripsera</span>
//             </Link>

//             <nav className="hidden md:flex items-center space-x-8">
//               <Link to="/" className="text-foreground hover:text-orange transition-colors">
//                 Home
//               </Link>
//               <Link to="/packages" className="text-foreground hover:text-orange transition-colors">
//                 Packages
//               </Link>
//               <Link to="/blog" className="text-foreground hover:text-orange transition-colors">
//                 Blog
//               </Link>
//               <ProtectedLink
//                 to="/custom-package" requireAuth
//                 className="text-foreground hover:text-orange transition-colors"
//               >
//                 Custom Package
//               </ProtectedLink>
//               <ProtectedLink to="/chatbot" requireAuth className="text-foreground hover:text-orange transition-colors">
//                 Chat Bot
//               </ProtectedLink>
//               <Link to="/about"
//                 className="text-foreground hover:text-orange transition-colors">
//                 About
//               </Link>
//               {/* <Link to="/demo" className="text-sm text-orange font-semibold">
//                 Demo
//               </Link> */}
//               <Link to="/demo" className="bg-orange text-white px-3 py-1 rounded text-sm">
//                 Demo Access
//               </Link>
//             </nav>
//           </div>

//           {/* Right - Icons & Auth */}
//           <div className="flex items-center space-x-4">
//             {/* Chat Icon */}
//             <ProtectedLink to="/chat" requireAuth className="relative">
//               <MessageCircle className="w-6 h-6 text-foreground hover:text-orange" />
//               {unreadChats > 0 && (
//                 <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
//                   {unreadChats}
//                 </span>
//               )}
//             </ProtectedLink>

//             {/* Notification Bell */}
//             <ProtectedLink to="/notification" requireAuth className="relative">
//               <Bell className="w-6 h-6 text-foreground hover:text-orange" />
//               {unreadNotifications > 0 && (
//                 <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
//                   {unreadNotifications}
//                 </span>
//               )}
//             </ProtectedLink>

//             {/* Profile / Auth Buttons */}
//             {isAuthenticated ? (
//               <div className="relative hidden sm:flex items-center">
//                 <OptionsDropdown
//                   options={[
//                     { label: 'My Account', value: 'profile' },
//                     { label: 'Wishlist', value: 'wishlist' },
//                     { label: 'Logout', value: 'logout', className: 'text-red-500' },
//                   ]}
//                   onSelect={(value) => {
//                     if (value === 'profile') navigate('/account/profile');
//                     else if (value === 'wishlist') navigate('/account/wishlist');
//                     else if (value === 'logout') {
//                       dispatch(logoutUser());
//                       toast.success('Logout successful');
//                     }
//                   }}
//                   triggerElement={
//                     <img
//                       src={profileImage}
//                       alt="Profile"
//                       className="w-10 h-10 rounded-full object-cover border cursor-pointer hover:ring-2 hover:ring-orange transition"
//                     />
//                   }
//                 />
//               </div>
//             ) : (
//               <>
//                 <Link to="/login">
//                   <Button
//                     variant="outline"
//                     className="border-orange text-orange hover:bg-orange hover:text-white hidden sm:flex"
//                   >
//                     <User className="w-4 h-4 mr-2" />
//                     Login
//                   </Button>
//                 </Link>
//                 <Link to="/signup">
//                   <Button className="bg-orange hover:bg-orange-dark text-white hidden sm:flex">
//                     Sign Up
//                   </Button>
//                 </Link>
//               </>
//             )}

//             {/* Mobile Menu Toggle */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             >
//               {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Dropdown */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden mt-4 space-y-4">
//             <Link
//               to="/"
//               className="block text-foreground hover:text-orange"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               Home
//             </Link>
//             <Link
//               to="/packages"
//               className="block text-foreground hover:text-orange"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               Packages
//             </Link>
//             <Link
//               to="/blog"
//               className="block text-foreground hover:text-orange"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               Blog
//             </Link>
//             <ProtectedLink requireAuth
//               to="/custom-package"
//               className="text-foreground hover:text-orange transition-colors"
//             >
//               Custom Package
//             </ProtectedLink>
//             <ProtectedLink
//               to="/chat" requireAuth
//               className="block text-foreground hover:text-orange"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               Chat {unreadChats > 0 && `(${unreadChats})`}
//             </ProtectedLink>
//             <ProtectedLink
//               to="/notification" requireAuth
//               className="block text-foreground hover:text-orange"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               Notifications {unreadNotifications > 0 && `(${unreadNotifications})`}
//             </ProtectedLink>
//             <ProtectedLink
//               to="/account/profile" requireAuth
//               className="block text-foreground hover:text-orange"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               Account
//             </ProtectedLink>
//             <Link to="/about" className="bg-orange text-white px-3 py-1 rounded text-sm">
//                 About
//               </Link>
//              <Link to="/demo" className="bg-orange text-white px-3 py-1 rounded text-sm">
//                 Demo Access
//               </Link>
//             {isAuthenticated ? (
//               <button
//                 onClick={() => {
//                   dispatch(logoutUser());
//                   toast.success('Logout successful');
//                   setIsMobileMenuOpen(false);
//                 }}
//                 className="block text-red-500 font-semibold"
//               >
//                 Logout
//               </button>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   className="block text-orange font-semibold"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="block text-orange font-semibold"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Navbar;
