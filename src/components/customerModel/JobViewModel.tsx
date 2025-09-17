import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Briefcase, Building } from "lucide-react";

interface Job {
  job_id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  job_type: string;
  salary_range: string;
  posting_date: string;
  expiry_date: string;
  company_name: string;
  logo: string;
  min_salary: number;
  max_salary: number;
}

interface JobViewModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
  onApply: (jobId: number) => void;
}

const JobViewModal: React.FC<JobViewModalProps> = ({
  job,
  open,
  onClose,
  onApply,
}) => {
  if (!job) return null;

  // ✅ Convert requirements & benefits from string → array
  const requirementsList = job.requirements
    ? job.requirements.split(/,|\n/).map((r) => r.trim()).filter(Boolean)
    : [];
  const benefitsList = job.salary_range
    ? job.salary_range.split(/,|\n/).map((b) => b.trim()).filter(Boolean)
    : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-6 rounded-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            {/* Left: Logo + Info */}
            <div className="flex items-center gap-4">
              {job.logo && (
                <img
                  src={job.logo}
                  alt={`${job.company_name} logo`}
                  className="w-14 h-14 rounded-lg object-contain border"
                />
              )}
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {job.title}
                </DialogTitle>
                <p className="text-muted-foreground">{job.company_name}</p>
              </div>
            </div>

            {/* Right: Job Type */}
            <Badge className="bg-green-200 text-green-700 border-green-200">
              {job.job_type}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* job basics */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              <span>{job.company_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>
                Rs {job.min_salary} - {job.max_salary}
              </span>
            </div>
          </div>

          {/* description */}
          <div>
            <h4 className="font-semibold mb-2">Job Description</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* requirements */}
          {requirementsList.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Requirements</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {requirementsList.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* benefits */}
          {benefitsList.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Benefits</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {benefitsList.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* actions */}
        <div className="flex gap-3 mt-6">
          <Button
            className="flex-1 bg-[#26B170] text-white hover:bg-[#1d8d59]"
            onClick={() => onApply(job.job_id)}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Apply Now
          </Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobViewModal;
