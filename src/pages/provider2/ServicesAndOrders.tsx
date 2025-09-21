import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import your existing 3 components
import Services from "./Services";
import Orders from "./ProjectOrder";
import ServiceRequests from "./Service_Request";
import OngoingProject from "./ProjectOrder";
import { useDashboardStore } from "@/store/orderProviderState";

export default function ServicesAndOrders() {
 const { orderCount, serviceRequestCount, projectCount, fetchCounts } =
    useDashboardStore();

    useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return (
    <div className="p-6">

      <Tabs defaultValue="services" className="w-full">
        {/* Tab Navigation */}
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="requests">Service Requests___ 
             <i>{serviceRequestCount}</i>
             </TabsTrigger>
         
           <TabsTrigger value="ongoingProjects">Ongoing Projects
            <i>{projectCount}</i>
           </TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services">
          <Services />
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="ongoingProjects">
          <OngoingProject/>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests">
          <ServiceRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
}
