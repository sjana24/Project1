import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Briefcase, Search, Filter, MoreHorizontal, Eye, EyeOff, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
// import AdminLayout from '@/components/AdminLayout';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: string;
  status: 'open' | 'closed' | 'draft';
  visible: boolean;
  datePosted: string;
  applications: number;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Solar Installation Technician',
    company: 'SolarTech Solutions',
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: '$50,000 - $70,000',
    status: 'open',
    visible: true,
    datePosted: '2024-01-15',
    applications: 23
  },
  {
    id: '2',
    title: 'Renewable Energy Engineer',
    company: 'Green Energy Co',
    location: 'Austin, TX',
    type: 'full-time',
    salary: '$80,000 - $120,000',
    status: 'open',
    visible: true,
    datePosted: '2024-01-14',
    applications: 45
  },
  {
    id: '3',
    title: 'Sales Representative',
    company: 'EcoSolar Systems',
    location: 'Remote',
    type: 'contract',
    salary: '$40,000 - $60,000',
    status: 'draft',
    visible: false,
    datePosted: '2024-01-10',
    applications: 0
  }
];

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');


      useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllJobsAdmin.php", { withCredentials: true })
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          console.log("data got");

        //   setCustomers(data.providers);
        setJobs(data.jobs);
        }
        else {
          // setError('Failed to load products.');
          console.log(response.data);
          console.log(" sorry we cant get ur products");
        }
        // setLoading(false);
      })

      .catch(err => {
        // setError('Something went wrong.');
        // setLoading(false);
      });

  }, []);

  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'open':
        // return <Badge variant="success">Open</Badge>;
      case 'closed':
        return <Badge variant="destructive">Closed</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: Job['type']) => {
    switch (type) {
      case 'full-time':
        return <Badge variant="default">Full-time</Badge>;
      case 'part-time':
        return <Badge variant="outline">Part-time</Badge>;
      case 'contract':
        // return <Badge variant="warning">Contract</Badge>;
      case 'internship':
        return <Badge variant="secondary">Internship</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const toggleVisibility = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { ...job, visible: !job.visible }
        : job
    ));
  };

  return (
    // <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Openings</h1>
            <p className="text-muted-foreground">Manage job postings and applications</p>
          </div>
          <Button className="gap-2">
            <Briefcase className="w-4 h-4" />
            Post Job
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search jobs by title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-success rounded-full flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(job.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    {getTypeBadge(job.type)}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Salary</span>
                    <span className="text-sm font-medium">{job.salary}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Applications</span>
                    <span className="font-medium">{job.applications}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Posted</span>
                    <span className="text-sm">{new Date(job.datePosted).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Visible</span>
                    <div className="flex items-center gap-2">
                      {job.visible ? <Eye className="w-4 h-4 text-success" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                      <Switch 
                        checked={job.visible} 
                        onCheckedChange={() => toggleVisibility(job.id)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Applications
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    // </AdminLayout>
  );
};

export default JobsPage;