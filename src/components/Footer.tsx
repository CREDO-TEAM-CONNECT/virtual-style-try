
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 px-4 border-t border-gray-100">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and mission */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                VIRTUFIT
              </span>
            </Link>
            <p className="text-sm text-gray-600 mb-4 max-w-md">
              Revolutionizing the way you shop for clothes with AI-powered virtual try-on technology, 
              making online shopping more intuitive and personalized.
            </p>
            <p className="text-sm text-gray-500">
              &copy; {currentYear} VirtuFit. All rights reserved.
            </p>
          </div>
          
          {/* Company links */}
          <div>
            <h3 className="text-sm font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Partners</FooterLink>
              <FooterLink href="#">Press</FooterLink>
            </ul>
          </div>
          
          {/* Support links */}
          <div>
            <h3 className="text-sm font-medium mb-4">Support</h3>
            <ul className="space-y-3">
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Contact Us</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <a 
      href={href} 
      className="text-sm text-gray-500 hover:text-black transition-colors"
    >
      {children}
    </a>
  </li>
);

export default Footer;
