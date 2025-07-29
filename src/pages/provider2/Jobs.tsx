import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Briefcase, Eye } from 'lucide-react';
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

  job_id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  job_type: string;
  salary_range: number;
  minSalary:number;
  maxSalary:number;
  is_approved: boolean;
  // requirements: '',
  benefits: string;
  posting_date;
  expiry_date;
  // location: '',
  // job_type:string,
}

export default function Jobs() {
  // const { jobs, addJob, updateJob, deleteJob } = useDashboardStore();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  // const [selectedJob, setSelectedJob] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [loading, setLoading] = useState(true);


  // const jobs=[];
  useEffect(() => {
    axios.get("http://localhost/Git/Project1/Backend/GetAllJobsProvider.php", { withCredentials: true })
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
    requirements: '',
    benefits: '',
    location: '',
    minSalary: 0,
    maxSalary: 0,
    job_type: ''
  });

  const sortedJobs = [...jobs].sort((a, b) =>
    new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingJob) {

      const response = await axios.post("http://localhost/Git/Project1/Backend/updateJobsProvider.php", { formData: formData, job_id: editingJob.job_id }, { withCredentials: true });

      if (response.data.success) {
        toast({
          title: 'Job Updated',
          description: 'Job posting has been updated successfully.',
        });
      }
      else {
        toast({
          title: 'Job Updated failed',
          description: 'Job posting has been updated failed.',
          variant: 'destructive',
        });

      }


    } else {
      const response = await axios.post("http://localhost/Git/Project1/Backend/addJobsProvider.php", { formData: formData }, { withCredentials: true });
      if (response.data.success) {
        toast({
          title: 'Job Posted',
          description: 'New job posting has been created successfully.',
        });
      }
      else {
        toast({
          title: 'Job Posted failed',
          description: 'New job posting has been created failed.',
          variant: 'destructive',
        });

      }


    }

    setFormData({
      title: '',
      description: '',
      salary: 0,
      expiryDate: '',
      requirements: '',
      benefits: '',
      location: '',
      minSalary:0,
      maxSalary:0,
      job_type: '',
    });
    setEditingJob(null);
    setIsModalOpen(false);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      salary: job.salary_range,
      requirements: job.requirements,
      benefits: job.benefits,
      location: job.location,
      minSalary:job.maxSalary,
      maxSalary:job.minSalary,
      job_type: job.job_type,
      expiryDate: job.expiry_date.split('T')[0], // Format for date input
    });
    setIsModalOpen(true);
  };

  const handleDelete =async(job_id: number) => {
    // deleteJob(id);
    const response = await axios.post("http://localhost/Git/Project1/Backend/deleteProviderJob.php", {job_id:job_id }, { withCredentials: true });

      if (response.data.success) {
        toast({
      title: 'Job Deleted',
      description: 'Job posting has been deleted successfully.',
      variant: 'destructive',
    });
      }
      else {
        toast({
          title: 'Job Deleted failure',
          description: 'Job has been deleted failure.',
          variant: "destructive"
        });

      }
    
  };

  const isExpired = (date: string) => {
    return new Date(date) < new Date();
  };
  // const selected

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
              <div>
                <Label htmlFor="requirements">Job Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="benefits">Job Benefits</Label>
                <Textarea
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Job Location</Label>
                  <select
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="">Select District</option>
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Matale">Matale</option>
                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                    <option value="Galle">Galle</option>
                    <option value="Matara">Matara</option>
                    <option value="Hambantota">Hambantota</option>
                    <option value="Jaffna">Jaffna</option>
                    <option value="Kilinochchi">Kilinochchi</option>
                    <option value="Mannar">Mannar</option>
                    <option value="Vavuniya">Vavuniya</option>
                    <option value="Mullaitivu">Mullaitivu</option>
                    <option value="Batticaloa">Batticaloa</option>
                    <option value="Ampara">Ampara</option>
                    <option value="Trincomalee">Trincomalee</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Puttalam">Puttalam</option>
                    <option value="Anuradhapura">Anuradhapura</option>
                    <option value="Polonnaruwa">Polonnaruwa</option>
                    <option value="Badulla">Badulla</option>
                    <option value="Monaragala">Monaragala</option>
                    <option value="Ratnapura">Ratnapura</option>
                    <option value="Kegalle">Kegalle</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <select
                    id="jobType"
                    value={formData.job_type}
                    onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                </div>
              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minSalary">Minimum Salary (Rs.)</Label>
                    <Input
                      id="minSalary"
                      type="number"
                      value={formData.minSalary}
                      onChange={(e) =>
                        setFormData({ ...formData, minSalary: Number(e.target.value) })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxSalary">Maximum Salary (Rs.)</Label>
                    <Input
                      id="maxSalary"
                      type="number"
                      value={formData.maxSalary}
                      onChange={(e) =>
                        setFormData({ ...formData, maxSalary: Number(e.target.value) })
                      }
                      required
                    />
                  </div>
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
                        {(job.is_approved) ? 'Approveld' : 'Waiting'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {job.description}
                    </p>
                    {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                      <div>
                        <h4 className="font-semibold mb-1">Requirements:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {job.requirements?.split('\n').map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Benefits:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {job.benefits?.split('\n').map((benefit, idx) => (
                            <li key={idx}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div> */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Salary:</span>
                        <p className="font-bold text-green-600">Rs. {job.salary_range.toLocaleString()}/month</p>
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedJob(job)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Job Details</DialogTitle>
                        </DialogHeader>

                        {selectedJob && (
                          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="font-medium text-gray-500 dark:text-gray-400">Job Title</label>
                                <p className="text-lg font-semibold">{selectedJob.title}</p>
                              </div>
                              <div>
                                <label className="font-medium text-gray-500 dark:text-gray-400">Status</label>
                                <Badge variant={isExpired(selectedJob.expiry_date) ? 'destructive' : 'default'}>
                                  {isExpired(selectedJob.expiry_date) ? 'Expired' : 'Active'}
                                </Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="font-medium text-gray-500 dark:text-gray-400">Location</label>
                                <p>{selectedJob.location}</p>
                              </div>
                              <div>
                                <label className="font-medium text-gray-500 dark:text-gray-400">Job Type</label>
                                <p>{selectedJob.job_type}</p>
                              </div>
                            </div>

                            <div>
                              <label className="font-medium text-gray-500 dark:text-gray-400">Description</label>
                              <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                {selectedJob.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="font-medium text-gray-500 dark:text-gray-400">Salary</label>
                                <p className="font-semibold text-green-600">Rs. {selectedJob.salary_range}/month</p>
                              </div>
                              <div>
                                <label className="font-medium text-gray-500 dark:text-gray-400">Application Deadline</label>
                                <p>{new Date(selectedJob.expiry_date).toLocaleDateString()}</p>
                              </div>
                            </div>

                            <div>
                              <label className="font-medium text-gray-500 dark:text-gray-400">Requirements</label>
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                {selectedJob.requirements?.split('\n').map((req, idx) => (
                                  <li key={idx}>{req}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <label className="font-medium text-gray-500 dark:text-gray-400">Benefits</label>
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                {selectedJob.benefits?.split('\n').map((benefit, idx) => (
                                  <li key={idx}>{benefit}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <label className="font-medium text-gray-500 dark:text-gray-400">Posted On</label>
                              <p>{new Date(selectedJob.posting_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

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
