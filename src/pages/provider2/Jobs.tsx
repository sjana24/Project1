import React, { useState ,useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// import { useDashboardStore, Job } from '@/store/dashboardStore';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

export interface Job {
  // id: string;
  // title: string;
  // description: string;
  salary: number;
  // expiryDate: string;
  // createdAt: string;

  job_id:number;
  title:string;
  description:string;
  requirements:string;
  location:string;
  job_type:string;
  salary_range:string;
  is_approved:boolean;
  posting_date;
  expiry_date;
}

export default function Jobs() {
  // const { jobs, addJob, updateJob, deleteJob } = useDashboardStore();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [jobs, setJobs] = useState<Job []>([]);
     const [loading, setLoading] = useState(true);
  

  // const jobs=[];
   useEffect(() => {
        axios.get("http://localhost/Git/Project1/Backend/GetAllJobsProvider.php",{withCredentials:true})
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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: 0,
    expiryDate: '',
  });

  const sortedJobs = [...jobs].sort((a, b) => 
    new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingJob) {
      // updateJob(editingJob.id, formData);
      toast({
        title: 'Job Updated',
        description: 'Job posting has been updated successfully.',
      });
    } else {
      // addJob(formData);
      toast({
        title: 'Job Posted',
        description: 'New job posting has been created successfully.',
      });
    }

    setFormData({
      title: '',
      description: '',
      salary: 0,
      expiryDate: '',
    });
    setEditingJob(null);
    setIsModalOpen(false);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      salary: job.salary,
      expiryDate: job.expiry_date.split('T')[0], // Format for date input
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    // deleteJob(id);
    toast({
      title: 'Job Deleted',
      description: 'Job posting has been deleted successfully.',
      variant: 'destructive',
    });
  };

  const isExpired = (date: string) => {
    return new Date(date) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Postings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your job openings and hiring</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600">
              <Plus className="w-4 h-4 mr-2" />
              Post Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary">Monthly Salary (Rs.)</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Application Deadline</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-500 hover:bg-green-600">
                  {editingJob ? 'Update' : 'Post'} Job
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Job Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Jobs</p>
                <p className="text-3xl font-bold">{jobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Jobs</p>
                <p className="text-3xl font-bold text-green-600">
                  {jobs.filter(job => !isExpired(job.expiry_date)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expired Jobs</p>
                <p className="text-3xl font-bold text-red-600">
                  {jobs.filter(job => isExpired(job.expiry_date)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {sortedJobs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No job postings</h3>
              <p className="text-gray-500 dark:text-gray-400">Create your first job posting to start hiring</p>
            </CardContent>
          </Card>
        ) : (
          sortedJobs.map((job) => (
            <Card key={job.job_id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <Badge variant={isExpired(job.expiry_date) ? 'destructive' : 'default'}>
                        {isExpired(job.expiry_date) ? 'Expired' : 'Active'}
                      </Badge>

                      <Badge variant={!(job.is_approved) ? 'destructive' : 'secondary'}>
                        {(job.is_approved) ? 'Approveld' : 'Rejected'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Salary:</span>
                        {/* <p className="font-bold text-green-600">Rs. {job.salary.toLocaleString()}/month</p> */}
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Deadline:</span>
                        <p className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(job.expiry_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Posted:</span>
                        <p>{new Date(job.posting_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(job)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(job.job_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
