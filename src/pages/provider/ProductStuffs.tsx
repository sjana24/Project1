
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductOrdernew from "./ProductOrdernew";
import Products from "./Productsnew";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useDashboardStore } from "@/store/orderProviderState";

export default function ProductStuffs() {
  // const [orderCount,setOrderCount] = useState<String>('');
  // Fetch products
    const { orderCount, serviceRequestCount, projectCount, fetchCounts } =
    useDashboardStore();

    useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  // const fetchProducts = () => {
  //   axios.get("http://localhost/Git/Project1/Backend/GetOrderCountProvider.php", { withCredentials: true })
  //     .then(res => {
  //       if (res.data.success) {
  //         setOrderCount(res.data.count);
  //         // setProducts(res.data.products);
  //       }
  //       else{
  //          toast({ title: "Fetch data", description: "Fetching data fail", variant: "destructive" });
  //       }
  //     })
  //     .catch(() => console.log("Failed to fetch products"));
  // };


  return (
    <div className="p-6">

      <Tabs defaultValue="products" className="w-full">
        {/* Tab Navigation */}
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders </TabsTrigger>
          <p>{orderCount}</p>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <Products />
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <ProductOrdernew />
        </TabsContent>

      </Tabs>
    </div>
  );
}
