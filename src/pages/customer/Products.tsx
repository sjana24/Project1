import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
// import { useNavigation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/store/useCartStore";
import { Star } from "lucide-react";
import { productCategorys } from "@/store/commonData";
import { IProduct, IUser } from "@/store/commonInterface";





const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(() => null);
  const { checkSession } = useAuth();
  const { setCartItemsCount, updateCartCount, cartUpdated } = useCartStore();
  const { triggerCartUpdate } = useCartStore();
  const [categoryFilter, setCategoryFilter] = useState("all");
  useEffect(() => {
    (async () => {
      if (!currentUser) {
        const user = await checkSession();
        setCurrentUser(user);
      }
    })();
  }, []);
  useEffect(() => {

    axios
      .get("http://localhost/Git/Project1/Backend/ShowCardItems.php", {
        withCredentials: true
      })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          console.log("Data received:", data);
          setCartItemsCount(data.items);
          updateCartCount();
          // setCartItems(data.items);
        } else {
          console.log("Failed to load items:", data);
        }
      })
      .catch((err) => {
        console.error("Error fetching cart items:", err);
      });
  }, [cartUpdated]);

  // useEffect(() => {
  //   axios.get("http://localhost/Git/Project1/Backend/GetAllProductCustomer.php")
  //     .then(response => {
  //       const data = response.data;
  //       if (response.data.success) {
  //          setProducts(data.products);
  //       }
  //       else {
  //         toast({
  //           title: "Fetch Data",
  //           description: "Fetch datas failed.",
  //           variant: "destructive",
  //         });
  //       }
  //       setLoading(false);
  //     })

  //     .catch(err => {
  //       setError('Something went wrong.');
  //       setLoading(false);
  //     });

  // }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost/Git/Project1/Backend/GetAllProductCustomer.php"
      );
      const data = response.data;

      if (data.success) {
        setProducts(data.products);
      } else {
        toast({
          title: "Fetch Data",
          description: "Fetching products failed.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


    useEffect(() => {
    fetchProducts();
  }, []);


  const filteredProducts = products


    .filter(product =>
      (categoryFilter === "all" || product.category === categoryFilter) &&

      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.average_rating - a.average_rating;
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
  const handleAddToCart = async (product: any) => {

    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to add items to your cart.",
        variant: "destructive", // optional styling

      });
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    else {

      const response = await axios.post("http://localhost/Git/Project1/Backend/AddToCart.php", {
        // customer_id: currentUser.customerId,
        product_Details: product,

      },
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.data.success) {
        // After adding product to cart
        triggerCartUpdate();
        console.log("add to cart sucess ");
        toast({
          title: "Added to Cart function!",
          description: `${product.name} has been added to your cart.`,

        });
      }
      else {
        console.log(" erroe adoi");
        toast({
          title: "Only for Customers!",
          variant: "destructive",
          description: `You are not authorized to add items to the cart.`,

        });

      }


      navigate('/products');
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
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                {productCategorys.map((category) => (
                  <SelectItem key={category.key} value={category.value}>
                    {category.value === "all" ? "All Categories" : category.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
              {/* <img
                src="/no-products.svg" // optional illustration if you want
                alt="No products"
                className="w-40 h-40 mb-4 opacity-70"
              /> */}
              <h2 className="text-xl font-semibold text-gray-700">
                No Products Available
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.product_id}
                  onClick={() => handleClick(product)}
                  className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border rounded-2xl overflow-hidden cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <img
                      src={`http://localhost/Git/Project1/Backend/${product.images.split(',')[0]}`}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <CardHeader className="p-4">
                    <CardTitle className="text-lg font-semibold line-clamp-1 text-gray-800">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 line-clamp-2">
                      {product.description || "No description available"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-4 pb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#26B170]">
                        Rs {Number(product.price).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">


                      {product.average_rating != null ? (
                        <>
                          <Star size={20} className="text-yellow-500" />
                          <span className="text-sm font-medium">{product.average_rating}</span>
                        </>
                      ) : (
                        <span className="text-sm font-medium">New Product</span>
                      )}





                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="w-full bg-[#26B170] hover:bg-[#21965F] text-white font-medium rounded-xl mt-2"
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}



        </div>
      </div>
      {/* Product Modal */}
      {isModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-2 py-4"
          onClick={closeModal} // Close when clicking the overlay
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-4xl h-[70vh] relative flex"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground text-lg"
              onClick={closeModal}
            >
              ✕
            </button>

            {/* Left Section (Image + Details) */}
            <div className="w-2/3 p-6 flex flex-col gap-4 overflow-y-auto border-r">
              {/* Product Image */}
              <div className="w-full flex items-center justify-center bg-gray-50 p-4 rounded-lg">
                <img
                  alt={selectedProduct.name}
                  src={`http://localhost/Git/Project1/Backend/${selectedProduct.images.split(',')[0]}`}
                  className="w-full max-w-sm h-auto object-contain rounded-md"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>

                <Badge variant="default" className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {selectedProduct.category || "Uncategorized"}
                </Badge>

                <div className="text-sm text-gray-600">
                  <strong>Provider:</strong> {selectedProduct.provider_name}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedProduct.description || "No description available"}
                </p>

                {selectedProduct.specifications && (
                  <div className="text-sm">
                    <strong>Specifications:</strong>
                    <p className="mt-1 text-gray-600">{selectedProduct.specifications}</p>
                  </div>
                )}

                <div className="text-xl font-semibold text-green-600">
                  Rs {Number(selectedProduct.price).toLocaleString()}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t">
                  <Button
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="bg-[#26B170] hover:bg-[#21965F] text-white w-full rounded-lg"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Section (Reviews) */}
            <div className="w-1/3 p-6 flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Customer Reviews</h3>

              <div className="flex-1 overflow-y-auto pr-2">
                <ul className="space-y-3 text-sm text-gray-600">
                  {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                    selectedProduct.reviews.map((review, index) => (
                      <li
                        key={index}
                        className="bg-gray-50 p-3 rounded-lg shadow-sm border"
                      >
                        <div className="flex items-center mb-1">
                          <span className="text-yellow-500">
                            {"⭐".repeat(Math.floor(review.rating))}
                            {"☆".repeat(5 - Math.floor(review.rating))}
                          </span>
                        </div>
                        <p className="italic">“{review.comment}”</p>
                        <p className="text-xs text-gray-500 mt-1">– {review.reviewer_name}</p>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No reviews yet.</li>
                  )}
                </ul>
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