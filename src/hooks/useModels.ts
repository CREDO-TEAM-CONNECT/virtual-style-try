
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface ModelImage {
  id: string;
  model_id: string;
  url: string;
  created_at: string;
}

export interface Model {
  id: string;
  user_id: string;
  title: string;
  name: string;
  token?: string;
  tune_id?: number;
  status: 'training' | 'completed' | 'failed';
  model_type: string;
  branch: string;
  created_at: string;
  updated_at: string;
  trained_at?: string;
  expires_at?: string;
  images?: ModelImage[];
}

type ModelStatus = 'training' | 'completed' | 'failed';

// Helper function to safely cast status to ModelStatus
const castStatus = (status: string): ModelStatus => {
  if (status === 'training' || status === 'completed' || status === 'failed') {
    return status as ModelStatus;
  }
  return 'training'; // Default to 'training' if status is not a valid value
};

export const useModels = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  
  const fetchModels = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch models
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (modelsError) throw modelsError;
      
      // Fetch images for each model
      const modelsWithImages = await Promise.all(
        modelsData.map(async (model) => {
          const { data: imagesData, error: imagesError } = await supabase
            .from('model_images')
            .select('*')
            .eq('model_id', model.id);
          
          if (imagesError) throw imagesError;
          
          return {
            ...model,
            status: castStatus(model.status), // Cast status to the correct type
            images: imagesData
          } as Model; // Explicitly cast to Model type
        })
      );
      
      setModels(modelsWithImages);
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Failed to fetch models');
    } finally {
      setIsLoading(false);
    }
  };
  
  const createModel = async (
    title: string,
    name: string,
    files: File[]
  ): Promise<Model | null> => {
    if (!user) {
      toast.error('You must be logged in to create a model');
      return null;
    }
    
    if (files.length < 5 || files.length > 10) {
      toast.error('You must upload between 5 and 10 images');
      return null;
    }
    
    setIsLoading(true);
    try {
      // Create model record first
      const modelId = uuidv4();
      const { data: model, error: modelError } = await supabase
        .from('models')
        .insert({
          id: modelId,
          user_id: user.id,
          title: `${title}-${modelId}`,
          name,
          status: 'training',
          model_type: 'lora',
          branch: 'fast'
        })
        .select()
        .single();
      
      if (modelError) throw modelError;
      
      // Upload images to storage and create records
      const imageUrls = await Promise.all(
        files.map(async (file, index) => {
          // Fix: Simplified file path structure to avoid nested paths that can cause issues
          const fileName = `${modelId}_${index}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          
          // Upload to storage with simplified path
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('model_images')
            .upload(fileName, file);
          
          if (uploadError) throw uploadError;
          
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('model_images')
            .getPublicUrl(fileName);
          
          const imageUrl = publicUrlData.publicUrl;
          
          // Create image record
          const { error: imageRecordError } = await supabase
            .from('model_images')
            .insert({
              model_id: modelId,
              url: imageUrl
            });
          
          if (imageRecordError) throw imageRecordError;
          
          return imageUrl;
        })
      );
      
      // Call edge function to create model in Astria API
      const response = await fetch('/api/create-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          modelData: model,
          imageUrls
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create model in Astria API');
      }
      
      // Fetch updated model
      const { data: updatedModel, error: fetchError } = await supabase
        .from('models')
        .select('*')
        .eq('id', modelId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Fetch images for the model
      const { data: imagesData, error: imagesError } = await supabase
        .from('model_images')
        .select('*')
        .eq('model_id', modelId);
      
      if (imagesError) throw imagesError;
      
      const modelWithImages = {
        ...updatedModel,
        status: castStatus(updatedModel.status), // Cast status to correct type
        images: imagesData
      } as Model; // Explicitly cast to Model type
      
      setModels((prev) => [modelWithImages, ...prev]);
      toast.success('Model created successfully and training started');
      
      return modelWithImages;
    } catch (error) {
      console.error('Error creating model:', error);
      toast.error('Failed to create model: ' + error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteModel = async (modelId: string) => {
    if (!user) return false;
    
    try {
      // Delete model (this will cascade delete the images records)
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', modelId);
      
      if (error) throw error;
      
      // Delete storage files - update to match the new file naming pattern
      const { data: files, error: listError } = await supabase.storage
        .from('model_images')
        .list();
      
      if (listError) throw listError;
      
      // Find files that start with the modelId
      const modelFiles = files?.filter(file => file.name.startsWith(`${modelId}_`)) || [];
      
      if (modelFiles.length > 0) {
        const filePaths = modelFiles.map(file => file.name);
        
        const { error: deleteError } = await supabase.storage
          .from('model_images')
          .remove(filePaths);
        
        if (deleteError) throw deleteError;
      }
      
      setModels((prev) => prev.filter(model => model.id !== modelId));
      toast.success('Model deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting model:', error);
      toast.error('Failed to delete model');
      return false;
    }
  };
  
  return {
    models,
    isLoading,
    fetchModels,
    createModel,
    deleteModel
  };
};
