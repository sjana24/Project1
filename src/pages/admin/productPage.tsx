import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Package, Search, Filter, MoreHorizontal, Eye, EyeOff, Star } from 'lucide-react';
import axios from 'axios';

interface Review {
  review_id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  visible: boolean;
  is_approved: boolean |number;
}

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
  reviews: Review[];
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products
  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllProductsAdmin.php", { withCredentials: true })
      .then(response => {
        if (response.data.success && response.data.products?.length > 0) {
          const mappedProducts: Product[] = response.data.products.map((p: any) => ({
            id: p.product_id.toString(),
            name: p.name,
            category: p.category || 'Uncategorized',
            provider: p.provider_name || `Provider ${p.provider_id}`,
            price: parseFloat(p.price),
            status: p.is_approved ? 'approved' : 'pending',
            is_approved: p.is_approved === 1,
            created_at: p.created_at,
            image: p.images,
            specifications: p.specifications || '',
            reviews: p.reviews || [],
          }));
          setProducts(mappedProducts);
        } else setProducts([]);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProductVisibility = async (productId: string, isApproved: boolean) => {
    try {
      const res = await axios.post(
        "http://localhost/Git/Project1/Backend/ToggleProductVisibility.php", // zzz API
        { product_id: productId, is_active: !isApproved },
        { withCredentials: true }
      );
      if (res.data.success) {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, is_approved: !isApproved, status: !isApproved ? 'approved' : 'pending' } : p
        ));
      }
    } catch (err) {
      console.error("Error updating product visibility:", err);
    }
  };

  const handleToggleReviewVisibility = async (reviewId: number, visible: boolean) => {
  try {
    // Convert boolean to number for backend
    const visibleValue = visible ? 1 : 0;

    await axios.post(
      "http://localhost/Git/Project1/Backend/ToggleReviewVisibility.php",
      { review_id: reviewId, visible: visibleValue },
      { withCredentials: true }
    );

    // Update local state to reflect the change
    setSelectedProduct(prev => prev ? {
      ...prev,
      reviews: prev.reviews.map(r =>
        r.review_id === reviewId ? { ...r, is_approved: visibleValue } : r
      )
    } : prev);
  } catch (err) {
    console.error("Failed to toggle review visibility:", err);
  }
};


  // const handleToggleReviewApproval = async (reviewId: number, approved: boolean) => {
  //   try {
  //     await axios.post("http://localhost/Git/Project1/Backend/ToggleReviewApproval.php", { review_id: reviewId, approved }, { withCredentials: true });
  //     setSelectedProduct(prev => prev ? {
  //       ...prev,
  //       reviews: prev.reviews.map(r => r.review_id === reviewId ? { ...r, approved } : r)
  //     } : prev);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
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
        
      </div>

      {/* Search */}
      <Card className="glass-card">
        <CardContent className="p-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search products by name or category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
          </div>
          <Button variant="outline" className="gap-2"><Filter className="w-4 h-4" /> Filter</Button>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="glass-card hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-transparent rounded-lg overflow-hidden">
                    <img src={`http://localhost/Git/Project1/Backend/${product.image}`} alt={product.name} className="w-full h-full object-cover"/>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                </div>
                {/* <Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button> */}
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Status</span>{getStatusBadge(product.status)}</div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Provider</span><span className="text-sm">{product.provider}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Price</span><span className="font-medium">Rs {product.price.toLocaleString()}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Date Added</span><span className="text-sm">{new Date(product.created_at).toLocaleDateString()}</span></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Visible</span>
                  <div className="flex items-center gap-2">
                    {product.is_approved ? <Eye className="w-4 h-4 text-success" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                    <Switch checked={product.is_approved} onCheckedChange={() => toggleProductVisibility(product.id, product.is_approved)} />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openModal(product)}>View details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-2 py-4" onClick={closeModal}>
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl h-[70vh] relative flex" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground text-lg" onClick={closeModal}>✕</button>
            <div className="w-2/3 p-6 flex flex-col gap-4 overflow-y-auto border-r">
              <div className="w-full flex items-center justify-center bg-gray-50 p-4 rounded-lg">
                <img alt={selectedProduct.name} src={`http://localhost/Git/Project1/Backend/${selectedProduct.image}`} className="w-full max-w-sm h-auto object-contain rounded-md"/>
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
                <Badge variant="default" className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{selectedProduct.category || "Uncategorized"}</Badge>
                <div className="text-sm text-gray-600"><strong>Provider:</strong> {selectedProduct.provider}</div>
                <p className="text-gray-700 text-sm leading-relaxed">{selectedProduct.specifications || "No specifications available"}</p>
                <div className="text-xl font-semibold text-green-600">Rs {selectedProduct.price.toLocaleString()}</div>
              </div>
            </div>

            <div className="w-1/3 p-6 flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Customer Reviews</h3>
              <div className="flex-1 overflow-y-auto pr-2">
                <ul className="space-y-3 text-sm text-gray-600">
                  {selectedProduct.reviews.length > 0 ? selectedProduct.reviews.map(review => (
                    <li key={review.review_id} className="bg-gray-50 p-3 rounded-lg shadow-sm border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-yellow-500">
                          {"⭐".repeat(Math.floor(review.rating))}{"☆".repeat(5 - Math.floor(review.rating))}
                        </span>
                        <div className="flex gap-2 items-center">
                         <div className="flex flex-col items-center">
  <span className="text-xs mb-1">
    {review.is_approved === 1 ? "Disable" : "Enable"}
  </span>
  <Switch
    checked={review.is_approved === 1} // boolean
    onCheckedChange={(val: boolean) => handleToggleReviewVisibility(review.review_id, val)}
  />
</div>

                        
                        </div>
                      </div>
                      <p className="italic">“{review.comment}”</p>
                      <p className="text-xs text-gray-500 mt-1">– {review.reviewer_name}</p>
                    </li>
                  )) : <li className="text-gray-500">No reviews yet.</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductPage;
