
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { X, Upload, Plus, Minus } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

// Define the form schema with Zod
const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  brand: z.string().min(1, 'Brand is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
  category: z.enum(['shirts', 'pants', 'coats', 'dresses', 'shoes', 'hats', 'accessories', 'swimwear']),
  size: z.array(z.string()).min(1, 'At least one size is required'),
  color: z.array(z.string()).min(1, 'At least one color is required'),
  is_public: z.boolean().default(false),
  shop_link: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productSchema>;

// Available categories for the select - ensure these match the database constraints
const categories = [
  'shirts', 
  'pants', 
  'coats', 
  'dresses', 
  'shoes', 
  'hats',
  'accessories',
  'swimwear'
] as const; // Make this a const array to ensure type safety

type CategoryType = typeof categories[number]; // Create a type from the array values

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ProductFormValues, files: File[]) => Promise<void>;
  initialValues?: Partial<Product>;
  title?: string;
}

const ProductForm = ({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  title = 'Add New Product'
}: ProductFormProps) => {
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>(
    initialValues?.images ? initialValues.images.map(img => img.url) : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values or passed values
  // Ensure category is properly typed as one of the allowed values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      brand: initialValues?.brand || '',
      price: initialValues?.price || 0,
      category: (initialValues?.category as CategoryType) || categories[0],
      size: initialValues?.size || ['S', 'M', 'L'],
      color: initialValues?.color || ['Black'],
      is_public: initialValues?.is_public || false,
      shop_link: initialValues?.shop_link || '',
    }
  });
  
  
  
  // Handle file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      // Create local preview URLs
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  // Remove an image from preview
  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle custom fields like size and color arrays
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  
  const addSize = () => {
    if (sizeInput && !form.getValues().size.includes(sizeInput)) {
      form.setValue('size', [...form.getValues().size, sizeInput]);
      setSizeInput('');
    }
  };
  
  const removeSize = (sizeToRemove: string) => {
    form.setValue('size', form.getValues().size.filter(size => size !== sizeToRemove));
  };
  
  const addColor = () => {
    if (colorInput && !form.getValues().color.includes(colorInput)) {
      form.setValue('color', [...form.getValues().color, colorInput]);
      setColorInput('');
    }
  };
  
  const removeColor = (colorToRemove: string) => {
    form.setValue('color', form.getValues().color.filter(color => color !== colorToRemove));
  };
  
  // Handle form submission
  const handleSubmit = async (values: ProductFormValues) => {
    if (!initialValues && imageFiles.length === 0) {
      toast.error('At least one product image is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(values, imageFiles);
      onOpenChange(false); // Close dialog on success
      
      // Reset form and state
      form.reset();
      setImageFiles([]);
      setImagePreviewUrls([]);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill out the details for your product.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Product Images */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Product Images
              </label>
              
              <div className="grid grid-cols-4 gap-2">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={url}
                      alt={`Product preview ${index + 1}`}
                      className="object-cover w-full h-full rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                <label className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md aspect-square hover:border-gray-400 transition-colors">
                  <div className="flex flex-col items-center p-2">
                    <Upload size={20} className="text-gray-500 mb-1" />
                    <span className="text-xs text-gray-500">Add Image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              
              {imagePreviewUrls.length === 0 && (
                <p className="text-sm text-red-500">At least one product image is required.</p>
              )}
            </div>
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter product description" 
                      className="resize-none h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...field}
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Size Options */}
            <FormField
              control={form.control}
              name="size"
              render={() => (
                <FormItem>
                  <FormLabel>Sizes</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.watch('size').map(size => (
                      <div 
                        key={size} 
                        className="bg-gray-100 rounded px-2 py-1 text-sm flex items-center gap-1"
                      >
                        {size}
                        <button 
                          type="button" 
                          onClick={() => removeSize(size)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={sizeInput}
                      onChange={e => setSizeInput(e.target.value)}
                      placeholder="Add size (e.g. S, M, L, XL)"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={addSize}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Color Options */}
            <FormField
              control={form.control}
              name="color"
              render={() => (
                <FormItem>
                  <FormLabel>Colors</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.watch('color').map(color => (
                      <div 
                        key={color} 
                        className="bg-gray-100 rounded px-2 py-1 text-sm flex items-center gap-1"
                      >
                        {color}
                        <button 
                          type="button" 
                          onClick={() => removeColor(color)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={colorInput}
                      onChange={e => setColorInput(e.target.value)}
                      placeholder="Add color (e.g. Black, Blue, Red)"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={addColor}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="shop_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Link (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/product" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_public"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Make this product public
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Public products will be visible to all users in the app.
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : initialValues ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
