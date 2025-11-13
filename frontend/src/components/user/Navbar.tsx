import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, X, Bell, MessageCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/redux/slices/userAuthSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { toast } from 'sonner';
import { useTotalUnreadCount } from '@/hooks/useTotalUnreadCount';
import { EnumUserRole } from '@/Constants/enums/userEnum';
import { OptionsDropdown } from '../OptionsDropdown ';

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isAuthenticated, accessToken, user } = useSelector(
    (state: RootState) => state.userAuth
  );

  const notificationUnread = useSelector(
    (state: RootState) => state.notifications.unreadCount
   );
  // const notificationUnread=0
  // const totalChatUnread = 0
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

  return (
    <header className="bg-background shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Logo & Links */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold">
              <span className="text-orange">Tripsera</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-foreground hover:text-orange transition-colors">
                Home
              </Link>
              <Link to="/packages" className="text-foreground hover:text-orange transition-colors">
                Packages
              </Link>
              <Link to="/blog" className="text-foreground hover:text-orange transition-colors">
                Blog
              </Link>
              <Link
                to="/custom-package"
                className="text-foreground hover:text-orange transition-colors"
              >
                Custom Package
              </Link>
              <Link to="/chatbot" className="text-foreground hover:text-orange transition-colors">
                Chat Bot
              </Link><Link to="/about"
             className="text-foreground hover:text-orange transition-colors">
                About
              </Link>
            </nav>
          </div>

          {/* Right - Icons & Auth */}
          <div className="flex items-center space-x-4">
            {/* Chat Icon */}
            <Link to="/chat" className="relative">
              <MessageCircle className="w-6 h-6 text-foreground hover:text-orange" />
              {unreadChats > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadChats}
                </span>
              )}
            </Link>

            {/* Notification Bell */}
            <Link to="/notification" className="relative">
              <Bell className="w-6 h-6 text-foreground hover:text-orange" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </Link>

            {/* Profile / Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative hidden sm:flex items-center">
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
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border cursor-pointer hover:ring-2 hover:ring-orange transition"
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

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link
              to="/"
              className="block text-foreground hover:text-orange"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/packages"
              className="block text-foreground hover:text-orange"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Packages
            </Link>
            <Link
              to="/blog"
              className="block text-foreground hover:text-orange"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/chat"
              className="block text-foreground hover:text-orange"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Chat {unreadChats > 0 && `(${unreadChats})`}
            </Link>
            <Link
              to="/notification"
              className="block text-foreground hover:text-orange"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Notifications {unreadNotifications > 0 && `(${unreadNotifications})`}
            </Link>
            <Link
              to="/account/profile"
              className="block text-foreground hover:text-orange"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Account
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  dispatch(logoutUser());
                  toast.success('Logout successful');
                  setIsMobileMenuOpen(false);
                }}
                className="block text-red-500 font-semibold"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-orange font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block text-orange font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
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
