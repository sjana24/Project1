
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductOrdernew from "./ProductOrdernew";
import Products from "./Productsnew";

export default function ProductStuffs() {
  return (
    <div className="p-6">

      <Tabs defaultValue="products" className="w-full">
        {/* Tab Navigation */}
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
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
