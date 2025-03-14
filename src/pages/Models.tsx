
import { useEffect, useState } from 'react';
import { useModels } from '@/hooks/useModels';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import ModelCard from '@/components/ModelCard';
import ModelCreationForm from '@/components/ModelCreationForm';
import Navbar from '@/components/Navbar';

const Models = () => {
  const { user } = useAuth();
  const { models, isLoading, fetchModels, deleteModel } = useModels();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchModels();
  }, [user]);
  
  const handleCreateComplete = () => {
    setIsDialogOpen(false);
    fetchModels();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Models</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Model
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create a New Model</DialogTitle>
                <DialogDescription>
                  Create a personalized model for virtual try-on.
                </DialogDescription>
              </DialogHeader>
              <ModelCreationForm onComplete={handleCreateComplete} />
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Models</TabsTrigger>
            <TabsTrigger value="completed">Ready</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ModelGrid 
              models={models} 
              isLoading={isLoading} 
              onDelete={deleteModel} 
            />
          </TabsContent>
          
          <TabsContent value="completed">
            <ModelGrid 
              models={models.filter(model => model.status === 'completed')} 
              isLoading={isLoading} 
              onDelete={deleteModel} 
            />
          </TabsContent>
          
          <TabsContent value="training">
            <ModelGrid 
              models={models.filter(model => model.status === 'training')} 
              isLoading={isLoading} 
              onDelete={deleteModel} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const ModelGrid = ({ 
  models, 
  isLoading, 
  onDelete 
}: { 
  models: ReturnType<typeof useModels>['models'], 
  isLoading: boolean, 
  onDelete: (id: string) => Promise<boolean> 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }
  
  if (models.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No models found</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {models.map(model => (
        <ModelCard 
          key={model.id} 
          model={model} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default Models;
