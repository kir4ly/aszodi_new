import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, Trash2, Loader2, X, Image as ImageIcon } from "lucide-react";
import { createProject, getProjects, deleteProject, type Project } from "@/lib/supabase";

const ImageUploader = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    // Create preview URLs for selected files
    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Cleanup old URLs
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error("Hiba a projektek betöltése során");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          imageFiles.push(file);
        }
      }
    }

    if (imageFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...imageFiles]);
      toast.success(`${imageFiles.length} kép beillesztve a vágólapról!`);
      e.preventDefault();
    } else {
      toast.error('Nincs kép a vágólapon!');
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      toast.error("Válassz ki legalább egy képet!");
      return;
    }

    if (!projectTitle.trim()) {
      toast.error("Add meg a projekt címét!");
      return;
    }

    setIsUploading(true);

    try {
      await createProject(
        projectTitle,
        projectDescription.trim() || null,
        selectedFiles
      );
      toast.success(`Projekt sikeresen létrehozva ${selectedFiles.length} képpel!`);

      // Reset form
      setSelectedFiles([]);
      setProjectTitle("");
      setProjectDescription("");
      const fileInput = document.getElementById("image-files") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      await loadProjects();
    } catch (error) {
      toast.error("Hiba a projekt létrehozása során");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Biztosan törölni szeretnéd a "${title}" projektet és összes képét?`)) {
      return;
    }

    try {
      await deleteProject(id);
      toast.success("Projekt sikeresen törölve!");
      await loadProjects();
    } catch (error) {
      toast.error("Hiba a projekt törlése során");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpload} className="space-y-4 p-6 bg-white rounded-lg border">
        <h3 className="text-lg font-semibold">Új Projekt Létrehozása</h3>

        <div className="space-y-2">
          <Label htmlFor="project-title">
            Projekt Címe <span className="text-red-500">*</span>
          </Label>
          <Input
            id="project-title"
            type="text"
            placeholder="Pl: Családi ház Budapesten"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            disabled={isUploading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-description">Leírás (opcionális)</Label>
          <Textarea
            id="project-description"
            placeholder="Pl: 2024-ben befejezett projekt, teljes felújítás"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            disabled={isUploading}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image-files">
            Képek Kiválasztása <span className="text-red-500">*</span>
          </Label>
          <Input
            id="image-files"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            multiple
          />
          <div
            onPaste={handlePaste}
            className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            tabIndex={0}
          >
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <ImageIcon className="w-4 h-4" />
              <span>Vagy kattints ide és nyomd meg a Ctrl/Cmd + V billentyűkombinációt képek beillesztéséhez</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Egyszerre több képet is kiválaszthatsz (Ctrl/Cmd + klikk vagy Shift + klikk)
          </p>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <Label>Kiválasztott képek ({selectedFiles.length})</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={previewUrls[index]}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button type="submit" disabled={isUploading || selectedFiles.length === 0 || !projectTitle.trim()} className="w-full">
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Projekt létrehozása...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Projekt Feltöltése
            </>
          )}
        </Button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-4">Feltöltött Projektek</h3>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-gray-500 text-center p-8">Még nincsenek feltöltött projektek</p>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{project.title}</h4>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        <ImageIcon className="w-3 h-3 inline mr-1" />
                        {project.images?.length || 0} kép
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(project.id, project.title)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Törlés
                    </Button>
                  </div>
                </div>

                {project.images && project.images.length > 0 && (
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {project.images.map((image) => (
                        <div key={image.id} className="aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={image.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
