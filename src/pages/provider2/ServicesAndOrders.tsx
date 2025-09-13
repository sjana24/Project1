import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import your existing 3 components
import Services from "./Services";
import Orders from "./ProjectOrder";
import ServiceRequests from "./Service_Request";

export default function ServicesAndOrders() {
  return (
    <div className="p-6">

      <Tabs defaultValue="services" className="w-full">
        {/* Tab Navigation */}
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="requests">Service Requests</TabsTrigger>
           <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services">
          <Services />
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Orders />
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests">
          <ServiceRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
}
