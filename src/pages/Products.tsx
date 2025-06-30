import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Footer  from "@/components/Footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const { toast } = useToast();
     const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // sample products 
   const products = [
    {
      id: 1,
      name: "Solar Panel X200",
      description: "High-efficiency monocrystalline solar panel with 22% efficiency rating",
      price: 250,
      rating: 4.8,
      image: "one.jpeg",
      category: "panels",
      specs: "300W, 25-year warranty"
    },
     {
      id: 2,
      name: "Solar Panel X200",
      description: "High-efficiency monocrystalline solar panel with 22% efficiency rating",
      price: 250,
      rating: 4.8,
      image: "one.jpeg",
      category: "panels",    
      specs: "300W, 25-year warranty"
    },
     {
      id: 3,
      name: "Solar Panel X200",
      description: "High-efficiency monocrystalline solar panel with 22% efficiency rating",
      price: 250,
      rating: 4.8,
      image:"one.jpeg",
      category: "panels",
      specs: "300W, 25-year warranty"
    },
     {
      id: 4,
      name: "Solar Panel X200",
      description: "High-efficiency monocrystalline solar panel with 22% efficiency rating",
      price: 250,
      rating: 4.8,
      image: "one.jpeg",
      category: "panels",    
      specs: "300W, 25-year warranty"
    },
     {
      id: 5,
      name: "Solar Panel X200",
      description: "High-efficiency monocrystalline solar panel with 22% efficiency rating",
      price: 250,
      rating: 4.8,
      image: "one.jpeg",
      category: "panels",    
      specs: "300W, 25-year warranty"
    },
     {
      id: 6,
      name: "Solar Panel X200",
      description: "High-efficiency monocrystalline solar panel with 22% efficiency rating",
      price: 250,
      rating: 4.8,
      image: "one.jpeg",
      category: "panels",    
      specs: "300W, 25-year warranty"
    },
  ]
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
        case "rating":
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

     const handleClick=(product:any)=>{
      console.log("hi this is me");
      setSelectedProduct(product);
    setIsModalOpen(true);
      // navigate("/emo");
    }
      const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
    const handleAddToCart=(product: any)=>{
      
       if (!currentUser) {
    toast({
      title: "Please log in",
      description: "You must be logged in to add items to your cart.",
      variant: "destructive", // optional styling
      
    });
  }
   toast({
        title: "Added to Cart function!",
        // description: `${product.title} has been added to your cart.`,
        description: `${product.productId},${product.name},${product.price},${product.productId},${currentUser.id}`,
      });

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
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredProducts.map((product) => (
                        <Card key={product.id} onClick={()=>handleClick(product)} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 glass-effect">
                          <CardHeader>
                            <div className="w-full h-48 bg-secondary/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/50 transition-colors">
                             <img src={product.image} className="h-full w-full text-primary" />
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <CardTitle className="text-lg">{product.name}</CardTitle>
                              <div className="flex items-center space-x-1">
                                
                                <span className="text-sm font-medium">{product.rating}</span>
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
                              <Button  onClick={() => handleAddToCart(product)}
                                className="w-full solar-gradient text-white group-hover:scale-105 transition-transform"
                              >
                                  Add to Cart
                              </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    
                </div>
            </div>
            {/* Product Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          {/* <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative"> */}
          <div className="bg-white rounded-xl shadow-lg p-6 w-[700px] h-[450px] relative overflow-hidden">

            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              onClick={closeModal}
            >
              <span className="text-sm">Cancel</span>
            </button>

            {/* Modal content in two columns */}
            <div className="flex flex-col md:flex-row gap-6">

              {/* Left: Image */}
              <div className="flex-shrink-0 flex items-center justify-center w-full md:w-1/2">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>

              {/* Right: Details */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                {/* <h2 className="text-2xl font-semibold mb-2">{selectedProduct.name}</h2> */}
                <p className="text-muted-foreground mb-2">{selectedProduct.description}</p>
                <p className="text-sm text-muted-foreground mb-4">{selectedProduct.specs}</p>

                <div className="flex justify-between items-center mt-auto">
                  <div className="text-lg font-bold">${selectedProduct.price}</div>
                  {/* <Button onClick={() => handleAddToCart(selectedProduct.name)}> */}
                  <Button onClick={() => handleAddToCart(selectedProduct)}>
                    
                    Add to Cart
                  </Button>
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