
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Model } from '@/hooks/useModels';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash, ImagePlus } from 'lucide-react';

interface ModelCardProps {
  model: Model;
  onDelete: (id: string) => Promise<boolean>;
}

const ModelCard = ({ model, onDelete }: ModelCardProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(model.id);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleTryOn = () => {
    navigate(`/try-on?modelId=${model.id}`);
  };
  
  // Get first image as cover or use placeholder
  const coverImage = model.images && model.images.length > 0
    ? model.images[0].url
    : '/placeholder.svg';
  
  // Format dates
  const formattedDate = new Date(model.created_at).toLocaleDateString();
  
  // Get status label and color
  const getStatusBadge = () => {
    switch (model.status) {
      case 'training':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Training</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Ready</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Failed</span>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square">
        <img 
          src={coverImage} 
          alt={model.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          {getStatusBadge()}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-base truncate">{model.title}</h3>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-500 capitalize">{model.name}</p>
          <p className="text-xs text-gray-400">{formattedDate}</p>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleTryOn}
          disabled={model.status !== 'completed'}
        >
          <ImagePlus className="mr-2 h-4 w-4" />
          Try On
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your model
                and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default ModelCard;
