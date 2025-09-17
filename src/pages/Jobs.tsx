import Navigation from "@/components/Navigation";
import { Search, MapPin, Calendar, DollarSign, Briefcase, Building, Mail, Phone } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Job {
  job_id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  job_type: string;
  salary_range: string;
  posting_date;
  expiry_date;



}
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);/// itha check pannum ellathukum podananu

  const [showDialog, setShowDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
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

  const locations = [];
  const types = [];
  // const jobs1=[
  //      {
  //   id: 1,
  //   title: "Solar Installation Technician",
  //   company: "SolarTech Pro",
  //   location: "California, USA",
  //   type: "Full-time",
  //   experience: "2+ years",
  //   salary: "$45,000 - $65,000",
  //   posted: "2024-01-15",
  //   description: "Install residential and commercial solar panel systems. Must have electrical experience and be comfortable working on rooftops.",
  //   requirements: ["NABCEP certification preferred", "Valid driver's license", "Physical ability to lift 50+ lbs"],
  //   benefits: ["Health insurance", "401k matching", "Paid training"],
  //   contact: {
  //     email: "jobs@solartechpro.com",
  //     phone: "+1 (555) 123-4567"
  //   }
  // },
  //   // {
  //   // id: 2,
  //   // title: "Solar Installation Technician",
  //   // company: "SolarTech Pro",
  //   // location: "California, USA",
  //   // type: "Full-time",
  //   // experience: "2+ years",
  //   // salary: "$45,000 - $65,000",
  //   // posted: "2024-01-15",
  //   // description: "Install residential and commercial solar panel systems. Must have electrical experience and be comfortable working on rooftops.",
  //   // requirements: ["NABCEP certification preferred", "Valid driver's license", "Physical ability to lift 50+ lbs"],
  //   // benefits: ["Health insurance", "401k matching", "Paid training"],
  //   // contact: {
  //   //   email: "jobs@solartechpro.com",
  //   //   phone: "+1 (555) 123-4567"
  //   // }},
  // ];

  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllJobsCustomer.php")
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          console.log("data got");

          setJobs(data.jobs);
        }
        else {
          // setError('Failed to load products.');
          console.log(response.data);
          console.log(" sorry we cant get ur products");
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
//   const requestJobApplication = async (formData: any) => {
//     console.log("Submitting job application:", formData);
//     const formDataToSend = new FormData();

// // Append text fields
// formDataToSend.append('jobId', formData.jobId.toString());
// formDataToSend.append('fullName', formData.fullName);
// formDataToSend.append('email', formData.email);
// formDataToSend.append('phone', formData.phone);
// formDataToSend.append('contactMethod', formData.contactMethod);
// formDataToSend.append('jobRole', formData.jobRole);

// // Append the resume file if present
// if (formData.resume) {
//   formDataToSend.append('resume', formData.resume); // 'resume' is the key expected by the backend
// }
//     try { 
//       const responce = await axios.post("http://localhost/Git/Project1/Backend/RequestJobApplication.php", {formDataToSend},{headers: { 'Content-Type': 'multipart/form-data' },withCredentials: true});
//       if (responce.data.success) {
//         toast({
//           title: "Application Submitted",
//           description: "Your job application has been submitted successfully.",
//           variant: "default", // optional styling
//         });
//       }else { 
//         toast({
//           title: "Application Failed",
//           description: responce.data.message || "There was an error submitting your application.",
//           variant: "destructive", // optional styling
//         });
//       }   
//     } catch (error) {
//       console.error("Error submitting job application:", error);  
//       toast({
//         title: "Application Error",
//         description: "There was an error submitting your job application. Please try again later.",
//         variant: "destructive", // optional styling
//       }); 
//     }
//   }
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
          //  job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location === "all" ? "All Locations" : location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Jobs List */}
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <Card key={job.job_id} className="group hover:shadow-lg transition-all duration-300 hover:scale-102 border-0 glass-effect">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-200 text-green-700 border-green-200">
                            {job.job_type}
                          </Badge>
                          <Badge variant="outline">
                            {job.requirements}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl mb-2 group-hover:text-green-700 transition-colors">
                          {job.title}
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-muted-foreground mb-4">
                          <div className="flex items-center space-x-1">
                            <Building className="h-4 w-4" />
                            <span className="font-medium">{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary_range}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            {/* <span>Posted {formatDate(job.posted)}</span> */}
                          </div>
                        </div>
                        <CardDescription className="text-muted-foreground mb-4">
                          {job.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Requirements</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {/* {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {req}
                          </li>
                        ))} */}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Benefits</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {/* {job.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1 h-1 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {benefit}
                          </li>
                        ))} */}
                        </ul>
                      </div>

                      <div>
                        {/* <h4 className="font-semibold text-foreground mb-2">Contact</h4> */}
                        <div className="space-y-2 text-sm text-muted-foreground">
                          {/* <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{job.contact.email}</span>
                        </div> */}
                          {/* <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{job.contact.phone}</span>
                        </div> */}
                        </div>

                        <Button
                          className="w-full mt-4 bg-[#26B170] text-white hover:bg-[#26B170] transition-transform"
                          onClick={() => handleApply(job.job_id)}
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          Apply Now
                        </Button>

                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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
                    <input type="text" name="fullName" required value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-2 border rounded" />
                  </div>

                  <div>
                    <label>Email *</label>
                    <input type="email" name="email" required value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2 border rounded" />
                  </div>

                  <div>
                    <label>Phone *</label>
                    <input type="tel" name="phone" required value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2 border rounded" />
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