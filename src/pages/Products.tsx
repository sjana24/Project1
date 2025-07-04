import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Product {
  product_id: number;
  provider_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  specifications: string;
  /// rating add pannale
  images: string; // this is a JSON string (array in string)
  is_approved: number;
  created_at: string;
  updated_at: string;
  success?: boolean;
}


const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate=useNavigate;
  const [products, setProducts] = useState<Product[]>([]);


  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllProductCustomer.php")
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          console.log("data got");

          setProducts(data.products);
        }
        else {
          // setError('Failed to load products.');
          console.log(response.data);
          console.log(" sorry we cant get ur products");
        }
        setLoading(false);
      })

      .catch(err => {
        setError('Something went wrong.');
        setLoading(false);
      });

  }, []);

  const filteredProducts = products

    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        // case "rating":
        //   return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });


  const handleClick = (product: any) => {
    console.log("hi this is me");
    setSelectedProduct(product);
    setIsModalOpen(true);
    // navigate("/emo");
  }
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  const handleAddToCart = async(product: any) => {

    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to add items to your cart.",
        variant: "destructive", // optional styling

      });
      // navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    else{
    
    const response=await axios.post("http://localhost/Git/Project1/Backend/AddToCart.php",{
      customer_id: currentUser.customerId,
      product_Details:product,

      });
    toast({
      title: "Added to Cart function!",
      description: `${product.name} has been added to your cart.`,

    });
  }
    setIsModalOpen(false);
  }


  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Solar Products
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our comprehensive range of high-quality solar products from trusted manufacturers.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">

              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card
                key={product.product_id}
                onClick={() => handleClick(product)}
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 glass-effect"
              >
                <div className="hidden md:block">
                  <CardHeader>
                    <div className="w-full h-48 bg-secondary/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/50 transition-colors">
                      <img src="../one.jpeg" className="h-full w-full text-primary" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <div className="flex items-center space-x-1">

                        {/* <span className="text-sm font-medium">{product.name}</span> */}
                      </div>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground">
                      {product.description}
                    </CardDescription>
                    <div className="text-xs text-muted-foreground mt-2">

                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-primary">
                        ${product.price.toLocaleString()}
                      </div>
                    </div>
                    <Button onClick={() => handleAddToCart(product)}
                      className="w-full solar-gradient text-white group-hover:scale-105 transition-transform"
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </div>

                {/* Mobile view */}
                <div className="flex md:hidden p-4 items-start gap-4 border-b">

                  <img
                    // src={product.name} // replace with image URL
                    src="../one.jpeg"
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-semibold line-clamp-1">{product.name}</h3>
                      <div className="flex gap-2 items-center mt-1">
                        <span className="text-xs   font-medium px-2 py-0.5 rounded">
                          {/* <span className="text-xs bg-yellow-100 text-yellow-700 font-medium px-2 py-0.5 rounded"></span> */}
                          {product.description}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        Colombo, Mobile Accessories
                      </p>
                      <p className="text-lg font-bold  mt-1">
                        Rs {product.price.toLocaleString()}
                      </p>
                    </div>
                    {/* <span className="text-xs text-gray-400 text-right mt-2">just now</span> */}
                  </div>
                </div>

              </Card>
            ))}

          </div>


        </div>
      </div>
      {/* Product Modal */}
            {isModalOpen && selectedProduct && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto px-2 py-4">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl h-[90vh] overflow-hidden relative">
      
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        onClick={closeModal}
      >
        ✕
      </button>

      {/* Scrollable Content */}
      <div className="flex flex-col md:flex-row h-full overflow-y-auto">
        
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-4 border-r">
          <img
            // src={(() => {
            //   try {
            //     const imgArr = JSON.parse(selectedProduct.images);
            //     return imgArr[0] || "../one.jpeg";
            //   } catch {
            //     return "../one.jpeg";
            //   }
            // })()}
            alt={selectedProduct.name}
            src="../one.jpeg"
            className="w-full max-w-xs h-auto object-contain rounded-lg"
          />
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 p-6 space-y-4 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
          <p className="text-sm text-muted-foreground">{selectedProduct.category}</p>
          
          <div className="text-gray-600 text-sm">
            <strong>Provider:</strong> Solar Lanka Solutions
          </div>

          <p className="text-sm text-gray-700">{selectedProduct.description}</p>

          <div className="text-sm">
            <strong>Specifications:</strong>
            <p className="mt-1 text-gray-600">{selectedProduct.specifications}</p>
          </div>

          <div className="text-lg font-semibold text-green-600">
            Rs {selectedProduct.price.toLocaleString()}
          </div>
           {/* Actions */}
          <div className="pt-4 border-t flex justify-between items-center">
            {/* <div className="text-xl font-bold text-primary">
              Rs {selectedProduct.price.toLocaleString()}
            </div> */}
            <Button
              onClick={() => handleAddToCart(selectedProduct)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Add to Cart
            </Button>
          </div>

          {/* Reviews Section */}
          <div className="pt-4 border-t">
            <h3 className="text-md font-bold text-gray-800 mb-2">Reviews</h3>
            <ul className="space-y-2 text-sm text-gray-600 max-h-32 overflow-y-auto pr-1">
              <li>
                ⭐⭐⭐⭐☆ - “Great performance even in cloudy weather.” – <i>Ayesha</i>
              </li>
              <li>
                ⭐⭐⭐⭐⭐ - “Highly recommended for rooftop installation.” – <i>Ramesh</i>
              </li>
              <li>
                ⭐⭐⭐☆☆ - “Expected better packaging.” – <i>Dinuka</i>
              </li>
            </ul>
          </div>

         
        </div>
      </div>
    </div>
  </div>
)}


      <Footer />
    </div>
  );
};

export default Products;