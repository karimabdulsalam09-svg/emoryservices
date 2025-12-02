import { Mail, Twitter } from "lucide-react";
const Footer = () => {
  return <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <span className="text-gradient-red-orange">Zyro

          </span>
          </div>
          
          {/* Contact */}
          
          
          {/* Social Icons */}
          <div className="flex gap-4">
            
            <a href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all">
              
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all">
              
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Optima — All rights reserved.
        </div>
      </div>
    </footer>;
};
export default Footer;