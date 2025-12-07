import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Facebook } from "lucide-react";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

// EmailJS inicializálás
emailjs.init("ROV9-lFEgKPaiVNre");
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validációk
    if (formData.name.trim().length < 2) {
      toast.error("A név legalább 2 karakter hosszú legyen");
      return;
    }
    
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Kérem adjon meg egy érvényes email címet");
      return;
    }
    
    if (formData.message.trim().length < 10) {
      toast.error("Az üzenet legalább 10 karakter hosszú legyen");
      return;
    }

    setIsLoading(true);

    try {
      const result = await emailjs.send(
        'service_t2v6tmm',
        'template_0muyr7p',
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone || 'Nincs megadva',
          message: formData.message,
        },
        'ROV9-lFEgKPaiVNre' // Public Key as 4th parameter
      );

      console.log('Email successfully sent:', result);
      toast.success("Üzenet elküldve! Hamarosan felvesszük veled a kapcsolatot.");
      
      // Form reset
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error: any) {
      console.error('Email sending failed:', error);
      toast.error("Hiba történt az üzenet küldése során. Kérjük, próbálja újra később vagy hívjon minket.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Kapcsolat



  </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Kérdésed van, ajánlatot szeretnél kérni, vagy már van kész terved a felújításra? Vedd
              fel velünk a kapcsolatot az alábbi elérhetőségek egyikén, vagy töltsd ki az űrlapot.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Küldjön üzenetet</CardTitle>
                <CardDescription>
                  A csillaggal jelölt mezők kitöltése kötelező. 1–2 munkanapon belül felvesszük
                  veled a kapcsolatot.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Név *
                    </label>
                    <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Az Ön neve" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email cím *
                    </label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="pelda@email.hu" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Telefonszám
                    </label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+36 30 123 4567" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Üzenet *
                    </label>
                    <Textarea id="message" name="message" required value={formData.message} onChange={handleChange} placeholder="Írja le, miben segíthetünk..." rows={6} />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-accent" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Küldés..." : "Üzenet elküldése"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="animate-scale-in">
                <CardHeader>
                  <CardTitle>Elérhetőségeink</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:aszodibau@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                        aszodibau@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Telefon</h3>
                      <a href="tel:+36304372393" className="text-muted-foreground hover:text-primary transition-colors">
                        +36 30 437 23 93
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Cím</h3>
                      <p className="text-muted-foreground">6000 Kecskemét, Kossuth Lajos u. 60.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Facebook className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Facebook</h3>
                      <a href="https://www.facebook.com/profile.php?id=61582900477580" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        @Aszódi Bau
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card className="animate-scale-in" style={{
              animationDelay: "0.1s"
            }}>
                <CardContent className="p-0">
                  <iframe src="https://www.google.com/maps?q=Kecskemét,+Kossuth+Lajos+u.+60&output=embed" width="100%" height="300" style={{
                  border: 0
                }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="rounded-lg" title="Aszódi Bau helyszíne - Kecskemét, Kossuth Lajos u. 60"></iframe>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Contact;