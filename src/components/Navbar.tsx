import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import shivlokLogo from "@/assets/shivlok-title-img.png";

export default function Navbar() {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navLinks = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.packages, path: "/packages" },
    { name: t.nav.amenities, path: "/amenities" },
    { name: t.nav.gallery, path: "/gallery" },
    { name: t.nav.contact, path: "/contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleBookingClick = () => {
    if (user) {
      navigate('/booking');
    } else {
      // Pass redirect param so Auth page knows where to go after login
      navigate('/auth?redirect=/booking');
    }
    setMobileMenuOpen(false);
  };
  
  return <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-white/80 dark:bg-card/80 backdrop-blur-lg py-3 shadow-md" : "bg-transparent py-5")}>
      <nav className="container flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <img
            src={shivlokLogo}
            alt="Shivlok Tours Logo"
            className="h-15 w-auto object-contain transition-transform group-hover:scale-105"
            style={{ maxWidth: '80px' }}
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8">
          {navLinks.map(link => <li key={link.name} className="relative">
              <Link to={link.path} className="font-medium transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full">
                {link.name}
              </Link>
            </li>)}
        </ul>

        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
          <Button onClick={handleBookingClick} className="btn-primary">
            {t.nav.bookNow}
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                      {((user.user_metadata as any)?.first_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="max-w-[240px] truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-full">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={cn("fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden transition-opacity duration-300", mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <div className={cn("fixed inset-y-0 right-0 w-3/4 max-w-sm bg-card shadow-xl p-6 transition-transform duration-300 ease-in-out", mobileMenuOpen ? "translate-x-0" : "translate-x-full")}>
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-center mb-8">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2">
                  <img
                    src={shivlokLogo}
                    alt="Shivlok Tours Logo"
                    className="h-12 w-auto object-contain"
                    style={{ maxWidth: '60px' }}
                  />
                  <span className="text-xl font-bold text-primary">Shivlok Tours</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="rounded-full">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <ul className="space-y-6">
                {navLinks.map(link => <li key={link.name}>
                    <Link to={link.path} className="text-lg font-medium transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                      {link.name}
                    </Link>
                  </li>)}
              </ul>
            </div>
            
            <Button onClick={handleBookingClick} className="w-full btn-primary mt-6">
              {t.nav.bookNow}
            </Button>
            {user ? (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button asChild variant="outline">
                  <Link to="/profile">Profile</Link>
                </Button>
                <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
              </div>
            ) : (
              <Button asChild variant="outline" className="w-full mt-4">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>;
}
