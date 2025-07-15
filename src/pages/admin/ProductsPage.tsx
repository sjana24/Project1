
import { useState, useEffect } from 'react';
// import { getData, setData, Product } from '../../utils/localStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";
import { useNavigate } from 'react-router-dom';
import { Search, Package, Check, X, Clock, DollarSign } from 'lucide-react';
import axios from 'axios';

export interface Product {
  // id: string;
  // name: string;
  provider: string;
  // category: string;
  // price: number;
  status: 'pending' | 'approved' | 'rejected';
  dateAdded: string;

  product_id: number;
  provider_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  specifications: string;
  /// rating add pannale
  images: string; // this is a JSON string (array in string)
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  success?: boolean;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // const productData = getData<Product>('products');
    const productData = [];
    // setProducts(productData);
    // setFilteredProducts(productData);
  }, []);
  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllProductAdmin.php")
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          console.log("data got");

          setProducts(data.products);
          setFilteredProducts(data.products);
        }
        else {
          // setError('Failed to load products.');
          console.log(response.data);
          console.log(" sorry we cant get ur products");
        }
        setLoading(false);
      })

      .catch(err => {
        // setError('Something went wrong.');
        setLoading(false);
      });

  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // product.provider_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const updateProductStatus = async(productGet:Product, is_approved: Product['is_approved']) => {
    const updatedProducts = products.map(product => {
      if (product.product_id === productGet.product_id) {
       
        return { ...product, is_approved };
      }
      return product;
    });

    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    
   try {
      const res = await axios.post("http://localhost/Git/Project1/Backend/UpdateProductStatusAdmin.php", 
        {
        product_id: productGet.product_id,
        is_approved: is_approved ? 1 : 0, // send as int to PHP
      }, 
        { withCredentials: true });
      // console.log("Registration successful:");
       if (res.data.success) {
        console.log("account created successful ");
        toast({
          title: "Account Created!",
          description: "Successful",
        });
        // navigate (0);


     
      }
      else {
        console.log(res.data);
        toast({
          title: "Sign up failed",
          description: "Email already used use another email",
          variant: "destructive",
        });
        console.log(" error in login"); // show error message from PHP

      }


    } catch (err) {
      console.error("Error registering user:", err);
    } finally {
      // setIsLoading(false);
    }

    //  toast({
    //       // title: "Product Status Updated",
    //       // description: `${productId} has been ${is_approved}`,
    //        title: "Product Status Updated",
    //         description: `${productGet.name} has been ${(is_approved)  ? "visible" : "hidden "}`,
    //         variant:(!(is_approved)? 'destructive':"default"),
    //     });
    // navigate(0);
    // setData('products', updatedProducts);
  };
  const updateProductVisibility = (product:Product, is_approved: boolean) => {
    updateProductStatus(product, is_approved ? true : false);
  };


  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <Check className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };
 
  // const pendingCount = products.filter(p => p.is_approved === 'pending').length;
  const approvedCount = products.filter(p => p.is_approved == true).length;
  const rejectedCount = products.filter(p => p.is_approved == false).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">Review and approve products from providers</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {/* <span className="font-medium text-yellow-600">{pendingCount} Pending Review</span> */}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        {/* <Card className="glass border-white/20"> */}
          {/* <CardContent className="p-6"> */}
            {/* <div className="flex items-center justify-between"> */}
              {/* <div> */}
                {/* <p className="text-sm text-gray-600">Pending</p> */}
                {/* <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p> */}
              {/* </div> */}
              {/* <Clock className="w-8 h-8 text-yellow-500" /> */}
            {/* </div> */}
          {/* </CardContent> */}
        {/* </Card> */}
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <X className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>Search Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, provider, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>All Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.product_id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/20 hover:bg-white/70 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-48 h-48 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    {/* <Package className="w-6 h-6 text-white" /> */}
                    {/* <div className="w-full h-48 bg-secondary/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/50 transition-colors"> */}
                    <img
                      src={`http://localhost/Git/Project1/Backend/${product.images.split(',')[0]}`}
                      className="h-full w-full text-primary" />
                    {/* </div> */}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">by {product.provider_id}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        Added: {new Date(product.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        Last Updated: {new Date(product.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center text-lg font-semibold text-gray-900">
                      <DollarSign className="w-4 h-4" />
                      {/* {product.price.toFixed(2)} */}
                      {product.price}
                    </div>
                  </div>

                  {getStatusBadge(product.status)}

                  {/* <div className="flex space-x-2">
                    {product.is_approved === 1 && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateProductStatus(product.product_id, 'approved')}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateProductStatus(product.product_id, 'rejected')}
                          className="hover:bg-red-50 hover:text-red-700 border-red-200"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

                    {(product.status === 'approved' || product.status === 'rejected') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateProductStatus(product.product_id, 'pending')}
                        className="hover:bg-yellow-50 hover:text-yellow-700"
                      >
                        Review Again
                      </Button>
                    )}
                  </div> */}
                  <div className="flex items-center space-x-2">
                   
                    <Switch
                      checked={product.is_approved} // assuming product has an `is_visible` boolean field
                      onCheckedChange={(checked) => updateProductVisibility(product, checked)}
                    />
                    <span className="text-sm text-gray-700">
                      {product.is_approved ? "Visible" : "Hidden"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;
