import { Mail, Phone, MapPin, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">Aszódi Bau</h3>
            <p className="text-muted-foreground mb-4">
              Minőségi lakásfelújítás, homlokzatszigetelés és kőműves munkák Kecskeméten.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Elérhetőség</h3>
            <div className="space-y-3">
              <a href="mailto:felujitas@aszodibau.hu" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
                <span>felujitas@aszodibau.hu</span>
              </a>
              <a href="tel:+36304372393" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-5 w-5" />
                <span>+36 30 437 23 93</span>
              </a>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>6000 Kecskemét, Kossuth Lajos u. 60.</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Gyors linkek</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors">
                Főoldal
              </Link>
              <Link to="/rolunk" className="block text-muted-foreground hover:text-primary transition-colors">
                Rólunk
              </Link>
              <Link to="/kapcsolat" className="block text-muted-foreground hover:text-primary transition-colors">
                Kapcsolat
              </Link>
              <Link to="/kepgaleria" className="block text-muted-foreground hover:text-primary transition-colors">
                Képgaléria
              </Link>
              <a href="https://www.facebook.com/profile.php?id=61582900477580" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>© 2025 Aszódi Bau. Minden jog fenntartva.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;