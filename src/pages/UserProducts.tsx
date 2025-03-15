import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/context/AuthContext';
import { SupabaseProduct } from '@/integrations/supabase/types';
import { AddProductModal } from '@/components/AddProductModal';
import { EditProductModal } from '@/components/EditProductModal';
import { DeleteProductDialog } from '@/components/DeleteProductDialog';
import ProductCardAdmin from '@/components/ProductCardAdmin';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2, Package, Search } from 'lucide-react';
import { toast } from 'sonner';

const UserProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [openEditProductModal, setOpenEditProductModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SupabaseProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  useEffect(() => {
    if (user) {
      fetchProducts(false)
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user, fetchProducts]);
  
  const handleProductAdded = async (newProduct: SupabaseProduct) => {
    try {
      await addProduct(newProduct);
      toast.success('Product added successfully!');
    } catch (error) {
      toast.error('Failed to add product.');
    } finally {
      setOpenAddProductModal(false);
    }
  };
  
  const handleEditProduct = (product: SupabaseProduct) => {
    setSelectedProduct(product);
    setOpenEditProductModal(true);
  };
  
  const handleProductUpdated = async (updatedProduct: SupabaseProduct) => {
    try {
      if (!selectedProduct) {
        toast.error('No product selected to update.');
        return;
      }
      await updateProduct({ ...selectedProduct, ...updatedProduct });
      toast.success('Product updated successfully!');
    } catch (error) {
      toast.error('Failed to update product.');
    } finally {
      setOpenEditProductModal(false);
      setSelectedProduct(null);
    }
  };
  
  const handleDeleteProduct = (product: SupabaseProduct) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
  };
  
  const confirmDeleteProduct = async () => {
    if (!selectedProduct) {
      toast.error('No product selected to delete.');
      return;
    }
    
    setIsDeleting(true);
    try {
      await deleteProduct(selectedProduct.id);
      toast.success('Product deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete product.');
    } finally {
      setOpenDeleteDialog(false);
      setIsDeleting(false);
      setSelectedProduct(null);
    }
  };
  
  const filteredProducts = products.filter(product => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter;
    return searchRegex.test(product.name) && categoryMatch;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-28 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold mb-2">Your Products</h1>
              <p className="text-gray-600">
                Manage your clothing items for virtual try-on
              </p>
            </div>
            <Button 
              onClick={() => setOpenAddProductModal(true)}
              className="mt-4 md:mt-0 flex items-center gap-2"
            >
              <Plus size={18} />
              Add New Product
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
              <div className="bg-white rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm">
                <Package size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Add your first product to start creating virtual try-on experiences. You can upload both your own items and products from your favorite brands.
              </p>
              <Button 
                onClick={() => setOpenAddProductModal(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus size={18} />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <>
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Products</TabsTrigger>
                  <TabsTrigger value="public">Public</TabsTrigger>
                  <TabsTrigger value="private">Private</TabsTrigger>
                </TabsList>
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-10 w-full max-w-xs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="max-w-[200px]">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="shirts">Shirts</SelectItem>
                        <SelectItem value="pants">Pants</SelectItem>
                        <SelectItem value="dresses">Dresses</SelectItem>
                        <SelectItem value="coats">Coats</SelectItem>
                        <SelectItem value="shoes">Shoes</SelectItem>
                        <SelectItem value="hats">Hats</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="swimwear">Swimwear</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                
                  <TabsContent value="all" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCardAdmin 
                          key={product.id} 
                          product={product} 
                          onEdit={() => handleEditProduct(product)}
                          onDelete={() => handleDeleteProduct(product)}
                          onTryOn={() => navigate(`/try-on/${product.id}`)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="public" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredProducts.filter(p => p.is_public).map((product) => (
                        <ProductCardAdmin 
                          key={product.id} 
                          product={product} 
                          onEdit={() => handleEditProduct(product)}
                          onDelete={() => handleDeleteProduct(product)}
                          onTryOn={() => navigate(`/try-on/${product.id}`)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="private" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredProducts.filter(p => !p.is_public).map((product) => (
                        <ProductCardAdmin 
                          key={product.id} 
                          product={product} 
                          onEdit={() => handleEditProduct(product)}
                          onDelete={() => handleDeleteProduct(product)}
                          onTryOn={() => navigate(`/try-on/${product.id}`)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </>
          )}
        </div>
      </div>
      
      <AddProductModal 
        open={openAddProductModal} 
        onClose={() => setOpenAddProductModal(false)}
        onProductAdded={handleProductAdded}
      />
      
      {selectedProduct && (
        <EditProductModal 
          open={openEditProductModal}
          onClose={() => setOpenEditProductModal(false)}
          product={selectedProduct}
          onProductUpdated={handleProductUpdated}
        />
      )}
      
      <DeleteProductDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={confirmDeleteProduct}
        isDeleting={isDeleting}
      />
      
      <Footer />
    </div>
  );
};

export default UserProducts;
