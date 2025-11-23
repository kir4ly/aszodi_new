import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Loader2, X, Maximize2 } from "lucide-react";
import { getProjects, type Project, type ProjectImage } from "@/lib/supabase";

interface LightboxState {
  isOpen: boolean;
  project: Project | null;
  currentImageIndex: number;
}

const ProjectCard = ({
  project,
  onOpenLightbox
}: {
  project: Project;
  onOpenLightbox: (project: Project, imageIndex: number) => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = project.images || [];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
      <div
        className="relative aspect-video bg-gray-200"
        onClick={() => onOpenLightbox(project, currentImageIndex)}
      >
        <img
          src={images[currentImageIndex].image_url}
          alt={project.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Enlarge icon on hover */}
        <div className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4" />
        </div>

        {/* Navigation arrows - only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
        {project.description && (
          <p className="text-gray-600 text-sm mb-3">{project.description}</p>
        )}
        <p className="text-xs text-gray-500">
          {images.length} kép
        </p>
      </div>
    </Card>
  );
};

const Lightbox = ({
  lightbox,
  onClose,
  onNavigate
}: {
  lightbox: LightboxState;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}) => {
  const images = lightbox.project?.images || [];
  const currentImage = images[lightbox.currentImageIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox.isOpen) return;

      if (e.key === 'ArrowLeft') {
        onNavigate('prev');
      } else if (e.key === 'ArrowRight') {
        onNavigate('next');
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.isOpen, onNavigate, onClose]);

  if (!currentImage || !lightbox.project) return null;

  return (
    <Dialog open={lightbox.isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 overflow-hidden bg-black/95">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
            {lightbox.currentImageIndex + 1} / {images.length}
          </div>

          {/* Project info */}
          <div className="absolute bottom-4 left-4 right-4 z-50 bg-black/50 text-white px-6 py-4 rounded-lg">
            <h3 className="text-xl font-bold mb-1">{lightbox.project.title}</h3>
            {lightbox.project.description && (
              <p className="text-sm opacity-90">{lightbox.project.description}</p>
            )}
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => onNavigate('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={() => onNavigate('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Main image */}
          <img
            src={currentImage.image_url}
            alt={lightbox.project.title}
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Gallery = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    project: null,
    currentImageIndex: 0,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError("Hiba történt a projektek betöltése során");
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Referenciáink</h1>
            <p className="text-xl md:text-2xl opacity-90">
              Válogatás az elkészült munkáinkból. Lakásfelújítások Kecskeméten és környékén.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Title */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Projektjeink</h2>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <Button onClick={loadProjects}>Újrapróbálás</Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                Jelenleg nincsenek megjeleníthető projektek.
              </p>
            </div>
          )}

          {/* Gallery Grid */}
          {!isLoading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="animate-scale-in"
                  style={{
                    animationDelay: `${(index % 6) * 0.1}s`,
                  }}
                >
                  <ProjectCard
                    project={project}
                    onOpenLightbox={openLightbox}
                  />
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          {!isLoading && projects.length > 0 && (
            <div className="mt-16 text-center animate-fade-in">
              <p className="text-xl text-muted-foreground mb-6">
                Tetszik, amit látsz? Lépj kapcsolatba velünk, és beszéljük meg a Te projektedet is!
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-accent">
                <a href="/kapcsolat">Ajánlatkérés</a>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <Lightbox
        lightbox={lightbox}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </div>
  );
};

export default Gallery;
