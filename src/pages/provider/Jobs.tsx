import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Briefcase,
  Eye,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  DoorOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import JobFormModal from '@/components/ui/providerModel/job.model';

export interface Job {
  job_id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  job_type: string;
  salary_range: number | string;
  is_approved: number;
  benefits: string;
  posting_date: string;
  expiry_date: string;
  status: string;
  min_salary:number;
  max_salary:number;

}

export default function Jobs() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // active | expired
  const [approvalFilter, setApprovalFilter] = useState("all"); // approved | pending
  const [sortOrder, setSortOrder] = useState("latest"); // latest | oldest

  // useEffect(() => {
  //   axios
  //     .get("http://localhost/Git/Project1/Backend/GetAllJobsProvider.php", {
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       if (res.data.success) setJobs(res.data.jobs);
  //       setLoading(false);
  //     })
  //     .catch(() => setLoading(false));
  // }, []);
   // 🔹 Separated function to fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost/Git/Project1/Backend/GetAllJobsProvider.php",
        { withCredentials: true }
      );
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Call fetchJobs inside useEffect
  useEffect(() => {
    fetchJobs();
  }, []);

  const isExpired = (date: string) => new Date(date) < new Date();

  // --- Derived jobs with search & filters ---
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // search filter
        const matchesSearch =
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase());

        // active/expired filter
        const matchesStatus =
          statusFilter === "all"
            ? true
            : statusFilter === "active"
              ? !isExpired(job.expiry_date)
              : isExpired(job.expiry_date);

        // approval filter
        const matchesApproval =
          approvalFilter === "all"
            ? true
            : approvalFilter === "approved"
              ? job.is_approved === 1
              : job.is_approved === 0;

        return matchesSearch && matchesStatus && matchesApproval;
      })
      .sort((a, b) => {
        if (sortOrder === "latest")
          return (
            new Date(b.posting_date).getTime() -
            new Date(a.posting_date).getTime()
          );
        else
          return (
            new Date(a.posting_date).getTime() -
            new Date(b.posting_date).getTime()
          );
      });
  }, [jobs, searchTerm, statusFilter, approvalFilter, sortOrder]);

  // --- Actions ---
  const handleDelete = async (job_id: number) => {
    const res = await axios.post(
      "http://localhost/Git/Project1/Backend/deleteProviderJob.php",
      { job_id },
      { withCredentials: true }
    );
    if (res.data.success) {
      setJobs((prev) => prev.filter((job) => job.job_id !== job_id));
      toast({
        title: "Job Deleted",
        description: "Job deleted successfully.",
        variant: "destructive",
      });
       fetchJobs();
    } else {
      toast({
        title: "Delete Failed",
        description: "Unable to delete job.",
        variant: "destructive",
      });
    }
  };

  // const handleEdit = (job: Job) => {
  //   toast({
  //     title: "Edit Mode",
  //     description: `Open edit form for: ${job.title}`,
  //   });
  //   // You can reuse your edit modal logic here
  // };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">
            Job Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and monitor your job postings
          </p>
        </div>
      
        <JobFormModal onSuccess={(updatedJob) => {
          setJobs((prev) => prev.map((j) => j.job_id === updatedJob.job_id ? updatedJob : j));
        }} />

      </div>
      {/* Stats Overview */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">{stats.pending}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Approved</p>
                      <p className="text-2xl font-bold">{stats.approved}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                      <p className="text-2xl font-bold">{stats.rejected}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {[
    {
      label: "Total Jobs",
      value: jobs.length,
      icon: (
        <Briefcase className="h-8 w-8 text-muted-foreground" />
      ),
    },
    {
      label: "Active Jobs",
      value: jobs.filter((j) => !isExpired(j.expiry_date)).length,
      icon: (
        <CheckCircle className="h-8 w-8 text-green-500" />
      ),
    },
    {
      label: "Expired Jobs",
      value: jobs.filter((j) => isExpired(j.expiry_date)).length,
      icon: (
        <XCircle className="h-8 w-8 text-red-500" />
      ),
    },
    
  ].map((stat, idx) => (
    <Card key={idx}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
          {stat.icon}
        </div>
      </CardContent>
    </Card>
  ))}
</div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
        <select
          value={approvalFilter}
          onChange={(e) => setApprovalFilter(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="all">All Approval</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Jobs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card
              key={job.job_id}
              className="hover:shadow-xl transition-shadow rounded-2xl"
            >
              <CardContent className="p-6 space-y-4">
                {/* Title + Badges */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.job_type}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge
                      variant={
                        isExpired(job.expiry_date) ? "destructive" : "default"
                      }
                    >
                      {isExpired(job.expiry_date) ? "Expired" : "Active"}
                    </Badge>
                    <Badge
                      variant={job.is_approved ? "secondary" : "destructive"}
                    >
                      {job.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                  {job.description}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> Location
                    </span>
                    <p className="font-medium">{job.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Briefcase className="w-4 h-4" /> Salary range
                    </span>
                    <p className="font-medium text-green-600">
                      Rs. {job.min_salary} - {job.max_salary}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Deadline
                    </span>
                    <p className="font-medium">
                      {new Date(job.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500"
                    onClick={() => setSelectedJob(job)}
                  >
                    <Eye className="w-4 h-4" /> View
                  </Button>
                  
                  <JobFormModal job={job} onSuccess={(updatedJob) => {
                    setJobs((prev) => prev.map((j) => j.job_id === updatedJob.job_id ? updatedJob : j));
                  }} />

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => handleDelete(job.job_id)}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Job Details Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-3xl rounded-2xl">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedJob.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <p className="text-gray-600">{selectedJob.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Location:</strong> {selectedJob.location}
                  </div>
                  <div>
                    <strong>Type:</strong> {selectedJob.job_type}
                  </div>
                  <div>
                    <strong>Salary:</strong> Rs. {selectedJob.salary_range}
                  </div>
                  <div>
                    <strong>Deadline:</strong>{" "}
                    {new Date(selectedJob.expiry_date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <strong>Requirements:</strong>
                  <ul className="list-disc ml-5 mt-1">
                    {selectedJob.requirements?.split("\n").map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Benefits:</strong>
                  <ul className="list-disc ml-5 mt-1">
                    {selectedJob.benefits?.split("\n").map((ben, i) => (
                      <li key={i}>{ben}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
     

    </div>
  );
}
