
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Upload, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import { useModels } from '@/hooks/useModels';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  name: z.string().min(2, { message: 'Category is required' }),
});

type FormValues = z.infer<typeof formSchema>;

const ModelCreationForm = ({ onComplete }: { onComplete?: () => void }) => {
  const { createModel } = useModels();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      name: '',
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + selectedFiles.length > 10) {
      toast.error('You can upload a maximum of 10 images');
      return;
    }
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    setSelectedFiles(prev => [...prev, ...files]);
  };
  
  const removeFile = (index: number) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const onSubmit = async (values: FormValues) => {
    if (selectedFiles.length < 5) {
      toast.error('Please upload at least 5 images');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await createModel(values.title, values.name, selectedFiles);
      
      if (result) {
        form.reset();
        setSelectedFiles([]);
        // Revoke all object URLs
        previews.forEach(preview => URL.revokeObjectURL(preview));
        setPreviews([]);
        
        if (onComplete) {
          onComplete();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          Upload 5-10 good quality photos of the subject. Choose photos with clear faces and varied
          poses for best results. The model will take a few minutes to train.
        </AlertDescription>
      </Alert>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My Model" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="man">Man</SelectItem>
                      <SelectItem value="woman">Woman</SelectItem>
                      <SelectItem value="boy">Boy</SelectItem>
                      <SelectItem value="girl">Girl</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <FormLabel>Upload Photos</FormLabel>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Image previews */}
              {previews.map((preview, index) => (
                <Card key={index} className="relative aspect-square overflow-hidden">
                  <img 
                    src={preview} 
                    alt={`Preview ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Card>
              ))}
              
              {/* Upload button */}
              {selectedFiles.length < 10 && (
                <Card 
                  className="flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedFiles.length === 0 ? 'Add Photos' : 'Add More'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedFiles.length}/10
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Card>
              )}
            </div>
            
            {selectedFiles.length > 0 && selectedFiles.length < 5 && (
              <p className="text-sm text-red-500">
                Please upload at least 5 images (currently {selectedFiles.length})
              </p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || selectedFiles.length < 5}
          >
            {isSubmitting ? 'Creating Model...' : 'Create Model'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ModelCreationForm;
