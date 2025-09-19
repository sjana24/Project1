import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Briefcase, Search, Filter, MoreHorizontal, Eye, EyeOff, MapPin, Clock } from 'lucide-react';
import axios from 'axios';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: 'Full Time' | 'Part Time' | 'Internship';
  salary: string;
  status: 'active' | 'inactive';
  visible: boolean;
  datePosted: string;
  applications?: number;
}

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllJobsAdmin.php", { withCredentials: true })
      .then(response => {
        if (response.data.success && response.data.jobs) {
          const mappedJobs: Job[] = response.data.jobs.map((job: any) => ({
            id: job.job_id,
            title: job.title,
            company: `Provider ${job.provider_id}`,
            location: job.location,
            type: job.job_type as 'Full Time' | 'Part Time' | 'Internship',
            salary: `Rs ${job.min_salary.toLocaleString()} - Rs ${job.max_salary.toLocaleString()}`,
            status: job.status,
            visible: job.is_approved === 1,
            datePosted: job.posting_date,
            applications: 0 // backend doesn't provide applications count, default 0
          }));
          setJobs(mappedJobs);
          setFilteredJobs(mappedJobs);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const toggleVisibility = (jobId: number) => {
    const updatedJobs = jobs.map(job =>
      job.id === jobId ? { ...job, visible: !job.visible } : job
    );
    setJobs(updatedJobs);
    setFilteredJobs(updatedJobs);
  };

  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      default:
        return <Badge variant="destructive">Inactive</Badge>;
    }
  };

  const getTypeBadge = (type: Job['type']) => {
    switch (type) {
      case 'Full Time':
        return <Badge variant="default">Full-time</Badge>;
      case 'Part Time':
        return <Badge variant="outline">Part-time</Badge>;
      case 'Internship':
        return <Badge variant="secondary">Internship</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
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
                placeholder="Search jobs by title, company or location..."
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
        {filteredJobs.map(job => (
          <Card key={job.id} className="glass-card hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-success rounded-full flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    {/* <p className="text-sm text-muted-foreground">{job.company}</p> */}
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
                  <span className="text-sm text-muted-foreground">Posted</span>
                  <span className="text-sm">{new Date(job.datePosted).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Visible</span>
                  <div className="flex items-center gap-2">
                    {job.visible ? <Eye className="w-4 h-4 text-success" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                    <Switch checked={job.visible} onCheckedChange={() => toggleVisibility(job.id)} />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                  <Button size="sm" variant="outline">Applications</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
