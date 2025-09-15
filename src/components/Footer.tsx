
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import shivlokLogo from "@/assets/shivlok-title-img.png";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card text-card-foreground pt-16 pb-8 border-t">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="animate-fade-in [animation-delay:100ms] flex flex-col items-start">
            <div className="flex items-center mb-4 space-x-2">
             <Link to ="/"> 
              <img
                src={shivlokLogo}
                alt="Shivlok Tours Logo"
                className="h-36 w-auto object-contain transition-transform group-hover:scale-105"
                style={{ maxWidth: '160px' }}
              />
             </Link>
            </div>
            <p className="text-muted-foreground mb-4">
              {t.footer.description}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/175LmEpFnD/" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://www.instagram.com/shivloktours?utm_source=qr&igsh=cHozMTlpN2I2N2wz" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
          
          <div className="animate-fade-in [animation-delay:200ms]">
            <h4 className="text-xl font-bold mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {[
                { name: t.nav.home, path: "/" },
                { name: t.nav.packages, path: "/packages" },
                { name: t.nav.amenities, path: "/amenities" },
                { name: t.nav.gallery, path: "/gallery" },
                { name: t.nav.contact, path: "/contact" },
                { name: t.nav.bookNow, path: "/booking" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="animate-fade-in [animation-delay:300ms]">
            <h4 className="text-xl font-bold mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 text-primary" />
                <span className="text-muted-foreground">
                  Shrinath Niketan, 29A Snehlata Ganj<br />
                  Indore, Madhya Pradesh, 452003<br />
                  India
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary" />
                <span className="text-muted-foreground">+91 87700 54107</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary" />
                <span className="text-muted-foreground">shivloktoursofficial@gmail.com</span>
              </li>
            </ul>
          </div>
          
          <div className="aspect-video rounded-x1 overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1839.9709155750038!2d75.86270991371708!3d22.730403337661933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fdc72fa1e0a1%3A0x361530efa9a2c208!2sSHIVLOK%20TOURS!5e0!3m2!1sen!2sin!4v1757747825818!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 1 }} 
                    allowFullScreen 
                    loading="lazy"
                    title="Location Map"
                  />
                </div>
        </div>
        
        <div className="border-t border-border pt-8 mt-8 text-center text-muted-foreground flex flex-col items-center gap-2">
          <p>&copy; {currentYear} Shivlok Tours. {t.footer.allRights}</p>
        </div>
      </div>
    </footer>
  );
}
