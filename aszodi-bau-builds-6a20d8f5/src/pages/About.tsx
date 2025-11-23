import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import gallery1 from "@/assets/about-room.jpg";

const About = () => {
  const highlights = [
    "Pontos, előre egyeztetett határidők",
    "Átlátható, előre megbeszélt árak",
    "Tiszta, rendezett munkakörnyezet",
    "Szakszerű, precíz kivitelezés",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Rólunk – Aszódi Bau</h1>
            <p className="text-xl md:text-2xl opacity-90">
              Foglalkozunk építőipari munkákkal – lakásfelújítással, homlokzatszigeteléssel és
              kőműves kivitelezéssel. Cégünk célja, hogy ügyfeleink elképzeléseit valósággá alakítsuk
              megbízható, minőségi munkával.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="animate-fade-in">
              <img
                src={gallery1}
                alt="Aszódi Bau építőipari munka"
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
            <div className="animate-scale-in space-y-6">
              <h2 className="text-3xl font-bold text-primary">
                Teljes körű felújítás – a konyhától a fürdőig
              </h2>
              <p className="text-lg leading-relaxed">
                Cégünk teljes körű lakásfelújítással és építőipari munkákkal foglalkozik, a
                tervezéstől a kivitelezésig.
              </p>
              <p className="text-lg leading-relaxed">
                Célunk, hogy ügyfeleink álmait valóra váltsuk minőségi munkával, megbízhatósággal és
                precizitással.
              </p>
              <p className="text-lg leading-relaxed">
                Legyen szó kisebb javításról, teljes felújításról vagy modern átalakításról, minden
                projektet maximális odafigyeléssel végzünk.
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="max-w-4xl mx-auto">
            <Card className="animate-fade-in">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Kiemelten figyelünk:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <span className="text-lg">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Closing Statement */}
          <div className="max-w-4xl mx-auto mt-16 text-center animate-fade-in">
            <p className="text-xl leading-relaxed text-muted-foreground">
              Hiszünk abban, hogy egy jól sikerült felújítás nemcsak az ingatlan értékét növeli,
              hanem az ott élők mindennapjait is kényelmesebbé, élhetőbbé teszi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
