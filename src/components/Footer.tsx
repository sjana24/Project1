
import { Link } from "react-router-dom";
import { Mail,Phone ,Sun} from "lucide-react";


const Footer = () => {

  const mobile_number="+1 (555) 123-4567";
  const email="contact@solax.com";
  return (
    <footer className="bg-secondary border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
             
              <span className="font-bold text-xl text-foreground">SolaX</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Leading the solar energy revolution with trusted products, expert services, 
              and innovative solutions for a sustainable future.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{mobile_number}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/products" className="block text-muted-foreground hover:text-primary transition-colors">
                Products
              </Link>
              <Link to="/services" className="block text-muted-foreground hover:text-primary transition-colors">
                Services
              </Link>
              <Link to="/jobs" className="block text-muted-foreground hover:text-primary transition-colors">
                Find Jobs
              </Link>
              <Link to="/blogs" className="block text-muted-foreground hover:text-primary transition-colors">
                Expert Blog
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <div className="space-y-2">
              <Link to="/forum" className="block text-muted-foreground hover:text-primary transition-colors">
                Q&A Forum
              </Link>
              <Link to="/contacts" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link to="/jobs" className="block text-muted-foreground hover:text-primary transition-colors">
                Careers
              </Link>
             
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 SolaX. All rights reserved. | Powering a sustainable future with solar energy.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
