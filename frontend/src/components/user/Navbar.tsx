import { useEffect, useState } from 'react';
import { Button } from '@/component/ui/button';
import { Link } from 'react-router-dom';
import { Menu, User, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/redux/slices/userAuthSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { toast } from 'sonner';

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();


  const { isAuthenticated, accessToken, user } = useSelector((state: RootState) => state.userAuth);
  useEffect(() => {

    if (!accessToken) {
      dispatch(logoutUser());
    }
  }, []);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileImage = user?.profileImage?.url
    ? user.profileImage.url.replace('/upload/', '/upload/f_webp,q_auto/')
    : '/profile-default.jpg';

  return (
    <header className="bg-background shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold">
              <span className="text-orange">Picnigo</span>
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
              <Link to="/custom-package" className="text-foreground hover:text-orange transition-colors">
                Custom Package
              </Link>
              <Link to="/chatbot" className="text-foreground hover:text-orange transition-colors">
                Chat Bot
              </Link>
              <Link to="/chat" className="text-foreground hover:text-orange transition-colors">
                Chat
              </Link>

              <Link to="/about" className="text-foreground hover:text-orange transition-colors">
                About Us
              </Link> <Link to="/file" className="text-foreground hover:text-orange transition-colors">
                file
              </Link>
              <Link to="/contact" className="text-foreground hover:text-orange transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">


            {isAuthenticated ? (
              <div className="relative hidden sm:flex items-center group">
                {/*  Icon */}
                <button className="flex items-center space-x-2 focus:outline-none">
                  <div className="flex items-center justify-center">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 w-44 bg-white shadow-md rounded-md border opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 z-50">
                  <Link
                    to="/account/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  <Link
                    to="/account/wishlist"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(logoutUser());
                      toast.success('Logout successful');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Login & Sign Up Buttons */}
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

            {/* Mobile Menu Button */}
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
              to="/about"
              className="block text-foreground hover:text-orange"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block text-foreground hover:text-orange"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
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
