
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useProducts, Product } from '@/hooks/useProducts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductForm from '@/components/ProductForm';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Edit, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const UserProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { products, isLoading, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      fetchProducts(false); // Only fetch user's products
    }
  }, [user]);
  
  const handleCreateProduct = async (formValues: any, files: File[]) => {
    await createProduct(formValues, files);
  };
  
  const handleUpdateProduct = async (formValues: any, files: File[]) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, formValues);
      setEditingProduct(null);
    }
  };
  
  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };
  
  const confirmDelete = (productId: string) => {
    setProductToDelete(productId);
    setDeleteConfirmOpen(true);
  };
  
  const handleDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };
  
  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => filter === 'public' ? p.is_public : !p.is_public);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-28 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold mb-2">
                My Products
              </h1>
              <p className="text-gray-600 mb-4 md:mb-0">
                Manage your clothing items and accessories
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter size={16} /> 
                    {filter === 'all' ? 'All Products' : 
                     filter === 'public' ? 'Public Only' : 'Private Only'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilter('all')}>
                    All Products
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('public')}>
                    Public Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('private')}>
                    Private Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button onClick={() => {
                setEditingProduct(null);
                setFormOpen(true);
              }} className="gap-2">
                <Plus size={16} /> Add Product
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                {filter !== 'all' 
                  ? `You don't have any ${filter} products yet.`
                  : "You haven't created any products yet."}
              </p>
              <Button 
                onClick={() => {
                  setEditingProduct(null);
                  setFormOpen(true);
                }}
                className="gap-2"
              >
                <Plus size={16} /> Create Your First Product
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="group relative animate-scale-in">
                  <ProductCard 
                    product={{
                      id: product.id,
                      name: product.name,
                      brand: product.brand,
                      price: product.price,
                      description: product.description,
                      // Map category to the correct type
                      category: mapCategoryToProductType(product.category),
                      size: product.size,
                      color: product.color,
                      shopLink: product.shop_link || '',
                      images: {
                        main: product.images?.find(img => img.type === 'main')?.url || '',
                        gallery: product.images?.filter(img => img.type !== 'main').map(img => img.url) || []
                      }
                    }} 
                  />
                  
                  {/* Admin actions overlay */}
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-4 p-6">
                    <Link
                      to={`/try-on/${product.id}`}
                      className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-white text-black rounded-full hover:bg-white/90 transition-colors"
                    >
                      <Eye size={18} /> Try On
                    </Link>
                    
                    <Button 
                      variant="outline"
                      onClick={() => openEditForm(product)}
                      className="w-full gap-2"
                    >
                      <Edit size={18} /> Edit
                    </Button>
                    
                    <Button 
                      variant="destructive"
                      onClick={() => confirmDelete(product.id)}
                      className="w-full gap-2"
                    >
                      <Trash2 size={18} /> Delete
                    </Button>
                  </div>
                  
                  {/* Visibility badge */}
                  <div className="absolute top-4 left-4 px-2 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full">
                    {product.is_public ? 'Public' : 'Private'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <ProductForm 
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        initialValues={editingProduct || undefined}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      />
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
};

// Helper function to map database category to Product interface category
const mapCategoryToProductType = (category: string): "tops" | "bottoms" | "dresses" | "outerwear" | "accessories" => {
  switch (category) {
    case "shirts": return "tops";
    case "pants": return "bottoms";
    case "dresses": return "dresses";
    case "coats": return "outerwear";
    default: return "accessories";
  }
};

export default UserProducts;
