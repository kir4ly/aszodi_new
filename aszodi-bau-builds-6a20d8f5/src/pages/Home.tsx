import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Home as HomeIcon, Building2, Hammer, Grid3x3, Paintbrush, ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { getProjects, type Project } from "@/lib/supabase";
import heroImage from "@/assets/hero-building.png";
import logo from "@/assets/aszodi bau logo.png";
import gallery1 from "@/assets/gallery-1-new.jpg";
import aboutRoom2 from "@/assets/about-room-2.jpg";
import aboutRoom from "@/assets/about-room.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";
import gallery9 from "@/assets/gallery-9.jpg";
import gallery10 from "@/assets/gallery-10.jpg";
import gallery11 from "@/assets/gallery-11.jpg";

interface LightboxState {
  isOpen: boolean;
  project: Project | null;
  currentImageIndex: number;
}
const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    project: null,
    currentImageIndex: 0,
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        // Csak az első 3 legújabb projektet jelenítjük meg a főoldalon
        setProjects(data.slice(0, 3));
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const openLightbox = (project: Project, imageIndex: number) => {
    setLightbox({
      isOpen: true,
      project,
      currentImageIndex: imageIndex,
    });
  };

  const closeLightbox = () => {
    setLightbox({
      isOpen: false,
      project: null,
      currentImageIndex: 0,
    });
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!lightbox.project?.images) return;

    const imagesLength = lightbox.project.images.length;
    setLightbox(prev => ({
      ...prev,
      currentImageIndex: direction === 'next'
        ? (prev.currentImageIndex + 1) % imagesLength
        : (prev.currentImageIndex - 1 + imagesLength) % imagesLength,
    }));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox.isOpen) return;

      if (e.key === 'ArrowLeft') {
        navigateLightbox('prev');
      } else if (e.key === 'ArrowRight') {
        navigateLightbox('next');
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.isOpen]);

  const services = [{
    icon: HomeIcon,
    title: "Lakásfelújítás",
    subtitle: "Lakásfelújítás - új élet az otthonban",
    description: (
      <>
        Egy jól sikerült felújítás nemcsak a lakás megjelenését változtatja meg, hanem az egész életteret felfrissíti. Legyen szó konyháról, fürdőszobáról, burkolásról vagy teljes átalakításról - mi minden részletre odafigyelünk, hogy az elképzelésed valósággá váljon.
        <br /><br />
        Minőségi anyagokkal, precíz munkával és megbízható szakemberekkel dolgozunk, mert tudjuk: a lakásfelújítás nem csak munka - ez a Te otthonod. <strong>Ha felújításról van szó, mi minőséget és a megbízhatóságot tartjuk legfontosabbnak!</strong>
      </>
    )
  }, {
    icon: Hammer,
    title: "Kőműves munkák",
    subtitle: "Kőműves munkák - erős alap a biztos jövőhöz",
    description: (
      <>
        A jó kőműves munka minden építkezés lelke. Legyen szó alapozásról, falazásról, térkövezésről, válaszfalak vagy akár teljes házbővítésről - mi precízen, szakértelemmel és odafigyeléssel dolgozunk. Több éves tapasztalattal, minőségi anyagokkal és pontos kivitelezéssel biztosítjuk, hogy minden építmény tartós, biztonságos és esztétikus legyen. <strong>Ha kőműves munkáról van szó, mi nem csak építünk - mi értéket teremtünk!</strong>
      </>
    )
  }, {
    icon: Building2,
    title: "Homlokzatszigetelés",
    subtitle: "Homlokzatszigetelés - mert az energia a falaknál kezdődik",
    description: (
      <>
        A jó szigetelés nem luxus, hanem befektetés! Megtartja a meleget télen, a hűvöset nyáron, és jelentősen csökkenti a rezsiköltségeket. Emellett megóvja az épületet a nedvességtől és a penésztől, így otthona nemcsak szebb, hanem tartósabb is lesz. Mi a homlokzatszigetelést <strong>precízen tapasztalattal és minőségi anyagokkal</strong> végezzük - hogy az eredmény ne csak jól nézzen ki, hanem hosszú távon is megtérüljön. <strong>Ha szigetelésről van szó, mi tudjuk, hogyan lesz tökéletes!</strong>
      </>
    )
  }, {
    icon: Grid3x3,
    title: "Burkolás",
    subtitle: "Burkolás - precizitás és tartósság a tökéletes otthonért",
    description: (
      <>
        A burkolás az egyik legmeghatározóbb eleme egy lakásfelújításnak: nemcsak funkcionális, hanem esztétikai szerepe is kiemelkedő. Legyen szó csempéről, járólapról vagy egyedi mintázatú burkolatról, munkánkat mindig maximális precizitással és odafigyeléssel végezzük. Fontos számunkra a pontos előkészítés, a minőségi anyagok használata és a hibátlan kivitelezés, hogy az elkészült felület hosszú éveken át szép és tartós maradjon. <strong>Célunk, hogy ügyfeleink elképzelései professzionális módon valósuljanak meg, és otthonuk valóban azt az érzést nyújtsa, amit megálmodtak.</strong>
      </>
    )
  }, {
    icon: Paintbrush,
    title: "Festés",
    subtitle: "Friss színek, megújult hangulat",
    description: (
      <>
        A gondosan elvégzett festés az otthonfelújítás egyik leglátványosabb része: egy jól megválasztott szín, egy precíz ecsetvonás az egész lakás hangulatát képes megváltoztatni. Munkánkat mindig alapos előkészítéssel kezdjük – a falak javításától a megfelelő alapozásig –, hogy a végeredmény tökéletesen egyenletes és tartós legyen. Minőségi festékekkel dolgozunk, odafigyelve a részletekre és az ügyfelek elképzeléseire. <strong>Célunk, hogy a frissen festett terek nemcsak szépek, hanem hosszú éveken át kifogástalanok maradjanak.</strong>
      </>
    )
  }];

  // Fallback képek, ha nincs még projekt az adatbázisban
  const fallbackGalleryImages = [{
    src: gallery7,
    alt: "Teljes lakásfelújítás tiszta kivitelezéssel"
  }, {
    src: gallery8,
    alt: "Modern fürdőszoba komplett átalakítás"
  }, {
    src: gallery9,
    alt: "Irodahelyiség kialakítás és felújítás"
  }, {
    src: gallery10,
    alt: "Mennyezeti LED világítás beépítése"
  }, {
    src: gallery11,
    alt: "Indirekt LED világítás kivitelezés"
  }];
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[800px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Aszódi Bau - Modern építőipari megoldások" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white animate-fade-in">
          <div className="inline-block bg-white/95 backdrop-blur-sm p-8 shadow-2xl mb-8">
            <img src={logo} alt="Aszódi Bau - Haza hoztuk a minőséget" className="w-full max-w-sm mx-auto" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Építsük együtt álmaid otthonát
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Üdvözöljük az Aszódi Bau honlapján! Cégünk az építőiparban tevékenykedik, fő fókuszunk pedig a lakások felújítása. Célunk, hogy minőségi munkánkkal otthonossá és komfortossá tegyük ügyfeleink otthonát.
          </p>
          <Button asChild size="lg" className="bg-accent text-white hover:bg-accent/90 text-lg px-8 py-6 font-semibold">
            <Link to="/kapcsolat">Kapcsolatfelvétel</Link>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background" id="szolgaltatasok">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Szolgáltatásaink</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Lakásfelújítástól a kőműves munkákon, burkoláson, festésen át a homlokzatszigetelésig mindent vállalunk,
              amire egy otthon felújításánál szükség lehet.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            {/* First row - 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {services.slice(0, 3).map((service, index) => (
                <div key={index} className="animate-scale-in" style={{
                  animationDelay: `${index * 0.1}s`
                }}>
                  <ServiceCard {...service} />
                </div>
              ))}
            </div>
            {/* Second row - 2 cards centered */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {services.slice(3, 5).map((service, index) => (
                <div key={index + 3} className="animate-scale-in" style={{
                  animationDelay: `${(index + 3) * 0.1}s`
                }}>
                  <ServiceCard {...service} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section Preview */}
      <section className="pt-20 pb-32 bg-secondary overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-scale-in relative flex items-end gap-4 md:gap-6">
              {/* Bal oldali kisebb kép - szoba */}
              <div className="relative w-2/5 -mt-16 md:-mt-24 z-10">
                <img
                  src={gallery1}
                  alt="Aszódi Bau lakásfelújítás"
                  className="rounded-lg shadow-xl w-full h-auto"
                />
              </div>
              {/* Jobb oldali nagyobb kép - fürdőszoba */}
              <div className="relative w-3/5 z-20">
                <img
                  src={aboutRoom2}
                  alt="Aszódi Bau fürdőszoba felújítás"
                  className="rounded-lg shadow-2xl w-full h-auto border-4 border-white"
                />
              </div>
            </div>
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Rólunk – Aszódi Bau</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Foglalkozunk építőipari munkákkal – a lakásfelújítástól a homlokzatszigetelésen át
                a kőműves munkákig. Célunk, hogy megbízható, minőségi kivitelezéssel segítsünk olyan
                otthont kialakítani, ahol valóban jó élni.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Minden projektet úgy kezelünk, mintha a saját otthonunkat újítanánk fel:
                odafigyeléssel, precizitással és korrekt kommunikációval.
              </p>
              <Button asChild variant="outline" size="lg">
                <Link to="/rolunk">
                  Tudj meg többet <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tekintsd meg legutóbbi munkáinkat – egyszerűen őszintén.</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Néhány példa az általunk végzett lakásfelújításokra, homlokzatszigetelési és kőműves
              munkákra. A galériában még több elkészült projektet találsz.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Projektek betöltése...</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {projects.map((project, index) => {
                const firstImage = project.images?.[0];
                return firstImage ? (
                  <div
                    key={project.id}
                    className="group relative overflow-hidden rounded-lg shadow-lg animate-scale-in cursor-pointer"
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                    onClick={() => openLightbox(project, 0)}
                  >
                    <img
                      src={firstImage.image_url}
                      alt={project.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end p-4">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                        {project.description && (
                          <p className="text-sm text-white/90">{project.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {fallbackGalleryImages.slice(0, 3).map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg animate-scale-in" style={{
                  animationDelay: `${index * 0.1}s`
                }}>
                  <img src={image.src} alt={image.alt} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Button asChild size="lg" className="bg-primary hover:bg-accent">
              <Link to="/kepgaleria">
                Tovább a képgalériához <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <p className="text-sm uppercase tracking-wider mb-4">LÉPJ VELÜNK KAPCSOLATBA!</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Építsük együtt álmaid otthonát!</h2>
              <p className="text-lg mb-8 opacity-90">
                Kérj ajánlatot, egyeztessünk a terveidről, és megmutatjuk, hogyan lesz belőlük valóság.
              </p>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/kapcsolat">Kapcsolatfelvétel</Link>
              </Button>
            </div>
            <div className="space-y-6">
              <div className="bg-white text-foreground p-8 rounded-lg shadow-xl animate-scale-in">
                <h3 className="text-2xl font-bold mb-6 text-primary">Aszódi Bau</h3>
                <div className="space-y-4">
                  <p className="flex items-start">
                    <span className="font-semibold mr-2">Cím:</span>
                    <span>6000 Kecskemét, Kossuth Lajos u. 60.</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-semibold mr-2">Telefon:</span>
                    <a href="tel:+36304372393" className="hover:text-primary transition-colors">
                      +36 30 437 23 93
                    </a>
                  </p>
                  <p className="flex items-start">
                    <span className="font-semibold mr-2">Email:</span>
                    <a href="mailto:aszodibau@gmail.com" className="hover:text-primary transition-colors">
                      aszodibau@gmail.com
                    </a>
                  </p>
                </div>
              </div>
              
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

      {/* Lightbox Modal */}
      <Dialog open={lightbox.isOpen} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 overflow-hidden bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image counter */}
            {lightbox.project && lightbox.project.images && (
              <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
                {lightbox.currentImageIndex + 1} / {lightbox.project.images.length}
              </div>
            )}

            {/* Project info */}
            {lightbox.project && (
              <div className="absolute bottom-4 left-4 right-4 z-50 bg-black/50 text-white px-6 py-4 rounded-lg">
                <h3 className="text-xl font-bold mb-1">{lightbox.project.title}</h3>
                {lightbox.project.description && (
                  <p className="text-sm opacity-90">{lightbox.project.description}</p>
                )}
              </div>
            )}

            {/* Navigation arrows */}
            {lightbox.project && lightbox.project.images && lightbox.project.images.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() => navigateLightbox('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Main image */}
            {lightbox.project && lightbox.project.images && lightbox.project.images[lightbox.currentImageIndex] && (
              <img
                src={lightbox.project.images[lightbox.currentImageIndex].image_url}
                alt={lightbox.project.title}
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default Home;