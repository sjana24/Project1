// JobsAndRequests.tsx
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Jobs from "./Jobs"; // your existing jobs.tsx file
import JobRequest from "./JobRequest"; // your existing jobs_request.tsx file

export default function JobsAndRequests() {
  return (
    <div className="p-6">
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="pt-6">
          <Jobs />
        </TabsContent>

        <TabsContent value="requests" className="pt-6">
          <JobRequest />
        </TabsContent>
      </Tabs>
    </div>
  );
}

