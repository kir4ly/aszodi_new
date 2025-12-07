import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Warn if Supabase is not configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase nincs konfigurálva! Állítsd be a VITE_SUPABASE_URL és VITE_SUPABASE_ANON_KEY változókat a .env fájlban.');
  console.error('📝 Lásd a supabase-setup.sql fájlt az adatbázis beállításához.');
}

// Create a dummy client if not configured to prevent crashes
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  images?: ProjectImage[];
}

export const verifyAccessCode = async (code: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('admin_access')
      .select('code')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error verifying access code:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error verifying access code:', error);
    return false;
  }
};

export const createProject = async (
  title: string,
  description: string | null,
  files: File[]
): Promise<string> => {
  // Check if Supabase is configured
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase nincs konfigurálva. Ellenőrizd a .env fájlt!');
  }

  // Create the project first
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      title,
      description,
    })
    .select()
    .single();

  if (projectError || !project) {
    console.error('Error creating project:', projectError);

    // Check if table doesn't exist
    if (projectError?.message.includes('relation') && projectError?.message.includes('does not exist')) {
      throw new Error('Az adatbázis táblák nincsenek létrehozva. Futtasd le a supabase-setup.sql fájlt!');
    }

    throw new Error(`Projekt létrehozása sikertelen: ${projectError?.message || 'Ismeretlen hiba'}`);
  }

  // Upload all images
  const uploadedImages: { url: string; order: number }[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `projects/${project.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      // Cleanup: delete project and any uploaded images
      await deleteProject(project.id);

      // Check if bucket doesn't exist
      if (uploadError.message.includes('not found') || uploadError.message.includes('bucket')) {
        throw new Error('A "images" storage bucket nem található. Hozd létre a Supabase Dashboard-on!');
      }

      throw new Error(`Kép feltöltése sikertelen: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    uploadedImages.push({ url: publicUrl, order: i });
  }

  // Insert all image records
  const imageRecords = uploadedImages.map(({ url, order }) => ({
    project_id: project.id,
    image_url: url,
    display_order: order,
  }));

  const { error: imagesError } = await supabase
    .from('project_images')
    .insert(imageRecords);

  if (imagesError) {
    console.error('Error inserting image records:', imagesError);
    // Cleanup: delete project (cascade will delete image records, but we need to delete files)
    await deleteProject(project.id);

    throw new Error(`Képek adatbázisba mentése sikertelen: ${imagesError.message}`);
  }

  return project.id;
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase nincs konfigurálva. Ellenőrizd a .env fájlt!');
    }

    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);

      // Check for common error types
      if (projectsError.message.includes('relation') && projectsError.message.includes('does not exist')) {
        throw new Error('Az adatbázis táblák nincsenek létrehozva. Futtasd le a supabase-setup.sql fájlt a Supabase Dashboard SQL Editor-jában!');
      }

      // Check for network/connection errors
      if (projectsError.message.includes('Failed to fetch') ||
          projectsError.message.includes('Load failed') ||
          projectsError.message.includes('NetworkError')) {
        throw new Error('Nem sikerült kapcsolódni a Supabase-hez. Ellenőrizd az internet kapcsolatot és a VITE_SUPABASE_URL értékét a .env fájlban!');
      }

      // Check for authentication errors
      if (projectsError.message.includes('JWT') ||
          projectsError.message.includes('Invalid API key') ||
          projectsError.message.includes('unauthorized')) {
        throw new Error('Érvénytelen Supabase API kulcs. Ellenőrizd a VITE_SUPABASE_ANON_KEY értékét a .env fájlban!');
      }

      throw new Error(`Projektek betöltése sikertelen: ${projectsError.message}`);
    }

    if (!projects || projects.length === 0) {
      return [];
    }

    // Fetch images for all projects
    const { data: images, error: imagesError } = await supabase
      .from('project_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (imagesError) {
      console.error('Error fetching project images:', imagesError);

      // Check if table doesn't exist
      if (imagesError.message.includes('relation') && imagesError.message.includes('does not exist')) {
        throw new Error('Az adatbázis táblák nincsenek létrehozva. Futtasd le a supabase-setup.sql fájlt a Supabase Dashboard SQL Editor-jában!');
      }

      throw new Error(`Projekt képek betöltése sikertelen: ${imagesError.message}`);
    }

    // Group images by project
    const projectsWithImages = projects.map(project => ({
      ...project,
      images: (images || []).filter(img => img.project_id === project.id),
    }));

    return projectsWithImages;
  } catch (error) {
    console.error('Error in getProjects:', error);

    // Check if it's a TypeError (network error)
    if (error instanceof TypeError) {
      if (error.message.includes('Load failed') || error.message.includes('Failed to fetch')) {
        throw new Error('Nem sikerült kapcsolódni a Supabase-hez. Lehetséges okok:\n1. Nincs internet kapcsolat\n2. A VITE_SUPABASE_URL helytelen a .env fájlban\n3. A Supabase projekt nem létezik vagy nem elérhető\n\n🔧 Ellenőrizd a .env fájlt és a SETUP.md útmutatót!');
      }
    }

    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  // Get all images for this project
  const { data: images, error: fetchError } = await supabase
    .from('project_images')
    .select('image_url')
    .eq('project_id', id);

  if (fetchError) {
    console.error('Error fetching project images:', fetchError);
  }

  // Delete files from storage
  if (images && images.length > 0) {
    const filePaths = images.map(img => {
      const urlParts = img.image_url.split('/');
      return `projects/${id}/${urlParts[urlParts.length - 1]}`;
    });

    const { error: storageError } = await supabase.storage
      .from('images')
      .remove(filePaths);

    if (storageError) {
      console.error('Error deleting from storage:', storageError);
    }
  }

  // Delete project (cascade will delete image records)
  const { error: dbError } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (dbError) {
    throw dbError;
  }
};
