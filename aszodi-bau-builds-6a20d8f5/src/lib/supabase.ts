import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Warn if Supabase is not configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
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
    throw projectError || new Error('Failed to create project');
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
      // Cleanup: delete project and any uploaded images
      await deleteProject(project.id);
      throw uploadError;
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
    // Cleanup: delete project (cascade will delete image records, but we need to delete files)
    await deleteProject(project.id);
    throw imagesError;
  }

  return project.id;
};

export const getProjects = async (): Promise<Project[]> => {
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (projectsError) {
    throw projectsError;
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
    throw imagesError;
  }

  // Group images by project
  const projectsWithImages = projects.map(project => ({
    ...project,
    images: (images || []).filter(img => img.project_id === project.id),
  }));

  return projectsWithImages;
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
