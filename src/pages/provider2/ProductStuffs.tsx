import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import your existing 3 components
import Services from "./Services";
import Orders from "./ProjectOrder";
import ServiceRequests from "./Service_Request";
import OngoingProject from "./ProjectOrder";
import ProductOrdernew from "./ProductOrdernew";
import ProductOrder from "./ProductOrder";
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
          <Products/>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <ProductOrdernew />
        </TabsContent>

      </Tabs>
    </div>
  );
}
