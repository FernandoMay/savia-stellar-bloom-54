import { Heart, Shield, Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import saviaLogo from "@/assets/Savia_logo.svg";

export function Footer() {
  return (
    <footer className="bg-savia-teal text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={saviaLogo} alt="Savia" className="h-10 w-auto filter brightness-0 invert" />
              <div>
                {/* <h3 className="text-xl font-bold">Savia</h3> */}
                <p className="text-sm text-white/80">Donar con confianza</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed">
              Plataforma de crowdfunding verificada para causas de salud en México. 
              Conectamos necesidades reales con corazones generosos.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Plataforma</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#campaigns" className="hover:text-white transition-colors">Explorar Campañas</a></li>
              <li><a href="#create" className="hover:text-white transition-colors">Crear Campaña</a></li>
              <li><a href="#verify" className="hover:text-white transition-colors">Proceso de Verificación</a></li>
              <li><a href="#nfts" className="hover:text-white transition-colors">NFTs de Impacto</a></li>
              <li><a href="#transparency" className="hover:text-white transition-colors">Transparencia</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Soporte</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#help" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Seguridad</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacidad</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Términos de Uso</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="space-y-3 text-white/80">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hola@savia.mx</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+52 55 1234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Ciudad de México, México</span>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Verificado por:</span>
              </div>
              <p className="text-xs text-white/80">
                Comisión Nacional Bancaria y de Valores (CNBV)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/80 text-sm">
              © 2024 Savia. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-savia-coral" />
                Hecho con amor en México
              </span>
              <span>•</span>
              <span>Stellar Network</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}