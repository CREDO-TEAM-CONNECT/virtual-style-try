
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGallery } from '@/context/GalleryContext';
import { Menu, X } from 'lucide-react';
import UserMenu from './UserMenu';

const Navbar = () => {
  const location = useLocation();
  const { savedItems } = useGallery();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 backdrop-blur-lg bg-white/80 shadow-subtle' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl font-medium tracking-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            VIRTUFIT
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" active={location.pathname === '/'}>
            Home
          </NavLink>
          <NavLink to="/try-on" active={location.pathname.includes('/try-on')}>
            Try On
          </NavLink>
          <NavLink to="/products" active={location.pathname === '/products'}>
            Products
          </NavLink>
          <NavLink to="/models" active={location.pathname === '/models'}>
            My Models
          </NavLink>
          <NavLink to="/gallery" active={location.pathname === '/gallery'}>
            <span className="flex items-center">
              Gallery
              {savedItems.length > 0 && (
                <span className="ml-1 flex items-center justify-center w-5 h-5 text-xs rounded-full bg-black text-white">
                  {savedItems.length}
                </span>
              )}
            </span>
          </NavLink>
        </nav>
        
        {/* User Menu (Desktop) */}
        <div className="hidden md:block">
          <UserMenu />
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X size={24} className="animate-fade-in" />
          ) : (
            <Menu size={24} className="animate-fade-in" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-slide-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <MobileNavLink to="/" active={location.pathname === '/'}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/try-on" active={location.pathname.includes('/try-on')}>
              Try On
            </MobileNavLink>
            <MobileNavLink to="/products" active={location.pathname === '/products'}>
              Products
            </MobileNavLink>
            <MobileNavLink to="/models" active={location.pathname === '/models'}>
              My Models
            </MobileNavLink>
            <MobileNavLink to="/gallery" active={location.pathname === '/gallery'}>
              <span className="flex items-center">
                Gallery
                {savedItems.length > 0 && (
                  <span className="ml-2 flex items-center justify-center w-5 h-5 text-xs rounded-full bg-black text-white">
                    {savedItems.length}
                  </span>
                )}
              </span>
            </MobileNavLink>
            <MobileNavLink to="/auth" active={location.pathname === '/auth'}>
              Sign In / Sign Up
            </MobileNavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, active, children }: NavLinkProps) => (
  <Link
    to={to}
    className={`relative py-2 text-sm transition-colors ${
      active ? 'text-black font-medium' : 'text-gray-600 hover:text-black'
    }`}
  >
    {children}
    {active && (
      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black rounded-full animate-slide-in" />
    )}
  </Link>
);

const MobileNavLink = ({ to, active, children }: NavLinkProps) => (
  <Link
    to={to}
    className={`py-3 border-b border-gray-100 text-base transition-colors ${
      active ? 'text-black font-medium' : 'text-gray-600'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
