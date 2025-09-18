import Navigation from "@/components/Navigation";
import { Search, MapPin, Calendar, Briefcase, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/Footer";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import JobViewModal from "@/components/customerModel/JobViewModel";
import { districts, jobTypes } from "@/store/commonData";
import { IJob } from "@/store/commonInterface";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { checkSession } = useAuth();
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);/// itha check pannum ellathukum podananu

  const [showDialog, setShowDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(() => null);


  const [formData, setFormData] = useState({
    jobId: 0,
    fullName: '',
    email: '',
    phone: '',
    contactMethod: '',
    jobRole: '',
    resume: null as File | null,
  });
  useEffect(() => {
    (async () => {
      if (!currentUser) {
        const user = await checkSession();
        setCurrentUser(user);
      }
    })();
  }, []);
  // const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };


  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllJobsCustomer.php")
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          setJobs(data.jobs);
        }
        else {
         toast({
            title: "Fetch Data",
            description: "Fetch datas failed.",
            variant: "destructive",
          });

          console.log(response.data);

        }
        setLoading(false);
      })

      .catch(err => {
        // setError('Something went wrong.');
        setLoading(false);
      });

  }, []);
  const handleApply = (jobId: number) => {

    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to add items to your cart.",
        variant: "destructive", // optional styling

      });
    }
    else {
      const job = jobs.find(j => j.job_id === jobId);
      if (job) {
        setSelectedJob(job);
        setFormData(prev => ({ ...prev, jobId: job.job_id }));
        setModalOpen(false);
        setShowDialog(true);
      }
      else {
        toast({
          title: "Job not found",
          description: "The job you are trying to apply for does not exist.",
          variant: "destructive", // optional styling
        });
      }
    }

  }
  const requestJobApplication = async (formData: any) => {
    console.log("Submitting job application:", formData);
    const formDataToSend = new FormData();

    // Append text fields
    formDataToSend.append('jobId', formData.jobId.toString());
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('contactMethod', formData.contactMethod);
    formDataToSend.append('jobRole', formData.jobRole);

    // Append the resume file if present
    if (formData.resume) {
      formDataToSend.append('resume', formData.resume); // ✅ matches backend
    }

    try {
      const response = await axios.post(
        "http://localhost/Git/Project1/Backend/RequestJobApplication.php",
        formDataToSend,  // ✅ send raw FormData, not {formDataToSend}
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast({
          title: "Application submitted",
          description: "Your job application was sent successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: response.data.errors?.join(", ") || "Failed to apply",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };


  const filteredJobs = jobs

    .filter(job =>
      (locationFilter === "all" || job.location === locationFilter) &&
      (typeFilter === "all" || job.job_type === typeFilter) &&
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.posting_date).getTime() - new Date(a.posting_date).getTime());

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Solar Energy Jobs
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover exciting career opportunities in the growing solar energy industry.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, or keywords..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full lg:w-48">

                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((location) => (
                  <SelectItem key={location.key} value={location.value}>
                    {location.value === "all" ? "All Locations" : location.value}

                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((type) => (
                  <SelectItem key={type.key} value={type.value}>
                    {type.value === "all" ? "All Types" : type.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Jobs List */}
          <div className="space-y-6">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-xl font-semibold">🚫 No Job Vacancies Found</p>
                <p className="text-sm">Please try again later or adjust your filters.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <Card
                    key={job.job_id}
                    className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border rounded-2xl"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold group-hover:text-green-700 transition-colors">
                            {job.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">{job.company_name}</p>
                        </div>
                        <Badge className="bg-green-200 text-green-700 border-green-200">
                          {job.job_type}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          Salary-
                          <span>Rs-({job.min_salary}-{job.max_salary})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Posted {new Date(job.posting_date).toLocaleDateString()}
                          </span>

                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Closing {new Date(job.expiry_date).toLocaleDateString()}
                          </span>

                        </div>
                      </div>

                      <CardDescription className="line-clamp-2 mb-4">
                        {job.description}
                      </CardDescription>

                      <div className="flex gap-3">
                        <Button
                          className="flex-1 bg-[#26B170] text-white hover:bg-[#1d8d59]"
                          onClick={() => handleApply(job.job_id)}
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          Apply Now
                        </Button>

                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewDetails(job)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* job vew model */}
          <JobViewModal
            job={selectedJob}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onApply={handleApply}
          />

          {/* apply model */}
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
              </DialogHeader>

              <form encType='multipart/form-data' onSubmit={(e) => {
                e.preventDefault();
                console.log(formData); // Or send via axios
                requestJobApplication(formData);
                setShowDialog(false);
              }} className="space-y-4">

                <div>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    pattern="^[A-Za-z. ]+$"
                    title="Name can only contain letters, spaces, and periods."
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label>Email *</label>
                  <input type="email" name="email" required value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded" />
                </div>


                <div>
                  <label>Telephone number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    // pattern="$07^[0-9]{10}$"
                    pattern="^07\d{8}$"
                    maxLength={10}
                    title="Phone number must be 10 digits. and start with 07"
                    className="w-full p-2 border rounded"
                  />
                </div>


                <div>
                  <label>Preferred Contact Method *</label>
                  <select name="contactMethod" required value={formData.contactMethod}
                    onChange={e => setFormData({ ...formData, contactMethod: e.target.value })}
                    className="w-full p-2 border rounded">
                    <option value="">-- Select --</option>
                    <option value="phone">Phone</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                  </select>
                </div>

                <div>
                  <label>Upload Resume *</label>
                  <input type="file" accept=".pdf,.doc,.docx"
                    onChange={e => setFormData({ ...formData, resume: e.target.files?.[0] || null })}
                    required className="w-full p-2 border rounded" />
                </div>



                <Button type="submit" className="w-full bg-blue-600 text-white">
                  Submit Application
                </Button>
              </form>
            </DialogContent>
          </Dialog>


        </div>
      </div>
      <Footer />
    </div>
  );

}
export default Jobs;