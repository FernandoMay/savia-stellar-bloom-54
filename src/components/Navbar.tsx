import { Button } from "@/components/ui/button";
import { Heart, Wallet, Menu, X } from "lucide-react";
import saviaLogo from "@/assets/Savia_logo.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Campañas", href: "/#campaigns" },
    { label: "Cómo Funciona", href: "/#how-it-works" },
    { label: "NFT Dashboard", href: "/nft-dashboard" },
    { label: "Donar", href: "/donation-flow" },
  ];

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.querySelector(href.replace("/", ""))?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      } else {
        document.querySelector(href.replace("/", ""))?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <img src={saviaLogo} alt="Savia" className="h-8 w-auto" />
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="hero"
              className="rounded-full hidden sm:flex"
              onClick={() => navigate("/create-campaign")}
            >
              <Heart className="w-4 h-4" />
              Crear Campaña
            </Button>
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-border/30 pt-3 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors text-sm"
              >
                {link.label}
              </button>
            ))}
            <Button
              variant="hero"
              className="rounded-full w-full sm:hidden"
              onClick={() => { setMobileOpen(false); navigate("/create-campaign"); }}
            >
              <Heart className="w-4 h-4" />
              Crear Campaña
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
