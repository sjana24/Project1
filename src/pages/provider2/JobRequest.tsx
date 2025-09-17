import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Users, Clock, CheckCircle, XCircle, Eye, Mail, Phone, MapPin, Briefcase, GraduationCap, Calendar, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

// Mock job application data
const mockJobRequests = [
  {
    id: '1',
    customer: {
      id: 'cust-001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      avatar: '/placeholder.svg',
      location: 'San Francisco, CA',
      experience: '5 years',
      education: 'Bachelor in Electrical Engineering'
    },
    job: {
      id: 'job-001',
      title: 'Solar Installation Technician',
      type: 'full-time',
      department: 'Installation',
      location: 'San Francisco Bay Area',
      salary: '$45,000 - $65,000'
    },
    applicationDate: '2024-01-20',
    status: 'pending',
    coverLetter: 'I am excited to apply for the Solar Installation Technician position. With 5 years of experience in electrical work and a passion for renewable energy...',
    resume: 'sarah-johnson-resume.pdf'
  },
  {
    id: '2',
    customer: {
      id: 'cust-002',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 987-6543',
      avatar: '/placeholder.svg',
      location: 'Oakland, CA',
      experience: '3 years',
      education: 'Associate Degree in Renewable Energy'
    },
    job: {
      id: 'job-002',
      title: 'Solar Sales Consultant',
      type: 'part-time',
      department: 'Sales',
      location: 'Remote',
      salary: '$35,000 - $50,000 + Commission'
    },
    applicationDate: '2024-01-18',
    status: 'approved',
    coverLetter: 'As someone passionate about clean energy solutions, I would love to help customers transition to solar power...',
    resume: 'michael-chen-resume.pdf'
  },
  {
    id: '3',
    customer: {
      id: 'cust-003',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1 (555) 456-7890',
      avatar: '/placeholder.svg',
      location: 'San Jose, CA',
      experience: '2 years',
      education: 'Bachelor in Environmental Science'
    },
    job: {
      id: 'job-003',
      title: 'Project Coordinator',
      type: 'contract',
      department: 'Operations',
      location: 'San Jose, CA',
      salary: '$40,000 - $55,000'
    },
    applicationDate: '2024-01-15',
    status: 'rejected',
    coverLetter: 'I am writing to express my interest in the Project Coordinator position. My background in environmental science...',
    resume: 'emily-rodriguez-resume.pdf'
  },
];
export interface IJobRequest {
  request_id: number;
  fullName: string;
  email: string;
  phone: string;
  contactMethod: string;
  resume: string | null;
  applied_at: string; // datetime string from DB

  job_id: number;
  title: string;
  location: string;
  job_type: string;
  min_salary: number;
  max_salary: number;
  posting_date: string;
  expiry_date: string;
  job_status: string;

  requirements: string;
  benefits: string;
}


const JobRequest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<typeof mockJobRequests[0] | null>(null);
  const [jobReqs,setJobReqs] = useState<IJobRequest[]>([])

    useEffect(() => {
    axios
      .get("http://localhost/Git/Project1/Backend/GetAllJobRequestsProvider.php", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success)
           setJobReqs(res.data.jobRequests);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

    useEffect(() => {
    axios
      .get("http://localhost/Git/Project1/Backend/GetAllJobRequestsProvider.php", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success)
          //  setJobs(res.data.jobs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const filteredRequests = jobReqs.filter(request => {
    const matchesSearch = request.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.job_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.job_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (requestId: string, newStatus: string) => {
    console.log(`Updating request ${requestId} to ${newStatus}`);
    // TODO: Implement status update logic
  };

  // const stats = {
  //   total: jobReqs.length,
  //   pending: jobReqs.filter(r => r.status === 'pending').length,
  //   approved: jobReqs.filter(r => r.status === 'approved').length,
  //   rejected: jobReqs.filter(r => r.status === 'rejected').length
  // };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Job Applications</h2>
          <p className="text-muted-foreground">Manage customer job applications</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card> */}
        <Card>
          {/* <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent> */}
        </Card>
        {/* <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by applicant name or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      {/* Job Applications List */}
      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Briefcase className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
            <h3 className="text-lg font-semibold mb-2">No Job Applications Found</h3>
            <p className="text-muted-foreground">No applications match your current filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            // <Card key={request.id} className="hover:shadow-md transition-shadow">
            //   <CardHeader>
            //     <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
            //       <div className="flex items-start gap-4 flex-1">
            //         <Avatar className="h-12 w-12">
            //           <AvatarImage src={request.customer.avatar} alt={request.customer.name} />
            //           <AvatarFallback>{request.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            //         </Avatar>
            //         <div className="flex-1">
            //           <div className="flex items-center gap-2 mb-2">
            //             <CardTitle className="text-lg">{request.customer.name}</CardTitle>
            //             <Badge variant={getStatusVariant(request.status)}>
            //               {getStatusIcon(request.status)}
            //               <span className="ml-1 capitalize">{request.status}</span>
            //             </Badge>
            //           </div>
            //           <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            //             <div className="flex items-center gap-1">
            //               <Briefcase className="h-4 w-4" />
            //               {request.job.title}
            //             </div>
            //             <div className="flex items-center gap-1">
            //               <Calendar className="h-4 w-4" />
            //               Applied: {new Date(request.applicationDate).toLocaleDateString()}
            //             </div>
            //             <div className="flex items-center gap-1">
            //               <Mail className="h-4 w-4" />
            //               {request.customer.email}
            //             </div>
            //             <div className="flex items-center gap-1">
            //               <Phone className="h-4 w-4" />
            //               {request.customer.phone}
            //             </div>
            //           </div>
            //         </div>
            //       </div>
            //       <div className="flex gap-2">
            //         <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
            //           <Eye className="h-4 w-4 mr-2" />
            //           View Details
            //         </Button>
            //         {request.status === 'pending' && (
            //           <>
            //             <Button 
            //               size="sm" 
            //               onClick={() => handleStatusUpdate(request.id, 'approved')}
            //             >
            //               <CheckCircle className="h-4 w-4 mr-2" />
            //               Approve
            //             </Button>
            //             <Button 
            //               variant="destructive" 
            //               size="sm"
            //               onClick={() => handleStatusUpdate(request.id, 'rejected')}
            //             >
            //               <XCircle className="h-4 w-4 mr-2" />
            //               Reject
            //             </Button>
            //           </>
            //         )}
            //       </div>
            //     </div>
            //   </CardHeader>
            //   <CardContent>
            //     <div className="space-y-3">
            //       <div>
            //         <h4 className="font-medium mb-2">Job Details:</h4>
            //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            //           <div>
            //             <span className="font-medium">Type:</span> {request.job.type}
            //           </div>
            //           <div>
            //             <span className="font-medium">Department:</span> {request.job.department}
            //           </div>
            //           <div>
            //             <span className="font-medium">Salary:</span> {request.job.salary}
            //           </div>
            //         </div>
            //       </div>
            //       <div>
            //         <h4 className="font-medium mb-2">Applicant Background:</h4>
            //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            //           <div className="flex items-center gap-1">
            //             <GraduationCap className="h-4 w-4" />
            //             <span className="font-medium">Education:</span> {request.customer.education}
            //           </div>
            //           <div className="flex items-center gap-1">
            //             <Briefcase className="h-4 w-4" />
            //             <span className="font-medium">Experience:</span> {request.customer.experience}
            //           </div>
            //           <div className="flex items-center gap-1">
            //             <MapPin className="h-4 w-4" />
            //             <span className="font-medium">Location:</span> {request.customer.location}
            //           </div>
            //         </div>
            //       </div>
            //     </div>
            //   </CardContent>
            // </Card>
             <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle className="text-xl">{request.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Applied on {new Date(request.applied_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-2">
            {1 && (
              <Button asChild size="sm">
                <a
                  href={`http://localhost/Git/Project1/Backend/uploads/resumes/${request.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Resume
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Applicant Info */}
        <div>
          <h4 className="font-medium mb-2">Applicant Info</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> {request.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> {request.phone}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> Contact Method: {request.contactMethod}
            </div>
          </div>
        </div>

        {/* Job Info */}
        <div>
          <h4 className="font-medium mb-2">Job Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> {request.title}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {request.location}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Type: {request.job_type || "N/A"}
            </div>
            <div className="flex items-center gap-2">
              💰 Min Salary: {request.min_salary}
            </div>
            <div className="flex items-center gap-2">
              💰 Max Salary: {request.max_salary}
            </div>
            <div className="flex items-center gap-2">
              📌 Status: {request.job_status}
            </div>
          </div>
        </div>

        {/* Extra Info */}
        {/* <div>
          <h4 className="font-medium mb-2">Requirements</h4>
          <p className="text-sm whitespace-pre-line">{request.requirements}</p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Benefits</h4>
          <p className="text-sm whitespace-pre-line">{request.benefits}</p>
        </div> */}
      </CardContent>
    </Card>
          ))}
        </div>
      )} 
      {}

      {/* Detail Modal would go here if selectedRequest is not null */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Application Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Cover Letter:</h3>
                <p className="text-sm text-muted-foreground">{selectedRequest.coverLetter}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Resume:</h3>
                <Button variant="outline" size="sm">
                  Download {selectedRequest.resume}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default JobRequest;