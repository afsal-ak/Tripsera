
import { useState } from "react";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import { Menu, Search, User, X } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/redux/slices/userAuthSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { toast } from "sonner";

const Navbar = () => {
     const dispatch = useDispatch<AppDispatch>();
  
    const {  isAuthenticated } = useSelector(
      (state: RootState) => state.userAuth
    );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold">
              <span className="text-orange">Picnigo</span>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-foreground hover:text-orange transition-colors">Home</Link>
              <Link to="/packages" className="text-foreground hover:text-orange transition-colors">Packages</Link>
              <Link to="/blog" className="text-foreground hover:text-orange transition-colors">Blog</Link>
              <Link to="/about" className="text-foreground hover:text-orange transition-colors">About Us</Link>
              <Link to="/contact" className="text-foreground hover:text-orange transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>
          {isAuthenticated ? (
  <Button
    onClick={() => {
            toast.success('Logout successfull')

      dispatch(logoutUser());
    }}
    className="bg-red-500 hover:bg-red-600 text-white hidden sm:flex"
  >
    Logout
  </Button>
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


            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link to="/" className="block text-foreground hover:text-orange" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/packages" className="block text-foreground hover:text-orange" onClick={() => setIsMobileMenuOpen(false)}>Packages</Link>
            <Link to="/blog" className="block text-foreground hover:text-orange" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
            <Link to="/about" className="block text-foreground hover:text-orange" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link to="/contact" className="block text-foreground hover:text-orange" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
   {isAuthenticated ? (
  <Link
    to="/login"
    className="block text-orange font-semibold"
    onClick={() => setIsMobileMenuOpen(false)}
  >
    Login
  </Link>
) : (
  <Link
    to="/signup"
    className="block text-orange font-semibold"
    onClick={() => setIsMobileMenuOpen(false)}
  >
    Sign Up
  </Link>
)}

          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
