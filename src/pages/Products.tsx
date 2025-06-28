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
                      
                        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 glass-effect">
                          <CardHeader>
                            <div className="w-full h-48 bg-secondary/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/50 transition-colors">
                             
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <CardTitle className="text-lg">{}</CardTitle>
                              <div className="flex items-center space-x-1">
                                
                                <span className="text-sm font-medium">{}</span>
                              </div>
                            </div>
                            <CardDescription className="text-sm text-muted-foreground">
                             
                            </CardDescription>
                              <div className="text-xs text-muted-foreground mt-2">
                               
                              </div>
                          </CardHeader>
                          <CardContent>
                             <div className="flex items-center justify-between mb-4">
                               <div className="text-2xl font-bold text-primary">
                                 ${}
                               </div>
                              </div>
                              <Button 
                                className="w-full solar-gradient text-white group-hover:scale-105 transition-transform"
                              >
                                  Add to Cart
                              </Button>
                          </CardContent>
                        </Card>
                    
                    </div>

                    
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Products;