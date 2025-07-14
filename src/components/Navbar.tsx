import { Button } from "@/components/ui/button";
import { Heart, Wallet, User, Search } from "lucide-react";
import saviaLogo from "@/assets/savia-logo.png";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={saviaLogo} alt="Savia" className="h-8 w-auto" />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-savia-teal">Savia</h1>
              <p className="text-xs text-muted-foreground -mt-1">
                Donar con confianza
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#campaigns" className="text-foreground hover:text-savia-teal transition-colors">
              Campañas
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-savia-teal transition-colors">
              Cómo Funciona
            </a>
            <a href="#about" className="text-foreground hover:text-savia-teal transition-colors">
              Nosotros
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="mint" className="hidden md:flex">
              <User className="w-4 h-4" />
              Iniciar Sesión
            </Button>
            <Button variant="hero" className="rounded-full">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Crear Campaña</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}