import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Package, Search, Filter, MoreHorizontal, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  category: string;
  provider: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  is_approved: boolean;
  created_at: string;
  image: string;
  specifications: string | null;
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch products from backend
  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllProductsAdmin.php", { withCredentials: true })
      .then(response => {
        if (response.data.success && response.data.products?.length > 0) {
          const mappedProducts: Product[] = response.data.products.map((p: any) => ({
            id: p.product_id.toString(),
            name: p.name,
            category: p.category || 'Uncategorized',
            provider: p.provider_name || `Provider ${p.provider_id}`, // fallback if provider_name not available
            price: parseFloat(p.price),
            status: p.is_approved ? 'approved' : 'pending',
            is_approved: p.is_approved === 1,
            created_at: p.created_at,
            image: p.images,
            specifications: p.specifications || '',
          }));
          setProducts(mappedProducts);
        } else {
          console.log("No products available from backend.");
          setProducts([]); // clear if nothing returned
        }
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  // Filtered products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleVisibility = (productId: string) => {
    setProducts(products.map(product =>
      product.id === productId
        ? { ...product, is_approved: !product.is_approved, status: !product.is_approved ? 'approved' : 'pending' }
        : product
    ));
  };

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products Management</h1>
          <p className="text-muted-foreground">Manage product listings and visibility</p>
        </div>
        <Button className="gap-2">
          <Package className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <Card className="glass-card">
        <CardContent className="p-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent rounded-lg overflow-hidden">
                      <img
                        src={`http://localhost/Git/Project1/Backend/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(product.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Provider</span>
                    <span className="text-sm">{product.provider}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="font-medium">Rs {product.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Date Added</span>
                    <span className="text-sm">{new Date(product.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Visible</span>
                    <div className="flex items-center gap-2">
                      {product.is_approved ? (
                        <Eye className="w-4 h-4 text-success" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                      <Switch
                        checked={product.is_approved}
                        onCheckedChange={() => toggleVisibility(product.id)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No products available.</p>
      )}
    </div>
  );
};

export default ProductPage;
