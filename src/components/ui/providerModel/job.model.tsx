import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

interface JobFormProps {
  job?: any; // if job passed → edit mode, else add mode
  onSuccess: (updatedJob: any, isEdit?: boolean) => void;
}

export default function JobFormModal({ job, onSuccess }: JobFormProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false); // control modal state
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: job?.title || "",
    description: job?.description || "",
    requirements: job?.requirements || "",
    location: job?.location || "",
    job_type: job?.job_type || "Full Time",
    min_salary: job?.min_salary || "",
    max_salary: job?.max_salary || "",
    benefits: job?.benefits || "",
    expiry_date: job?.expiry_date || "",
  });

  const districts = [
    "Colombo",
    "Gampaha",
    "Kalutara",
    "Kandy",
    "Matale",
    "Nuwara Eliya",
    "Galle",
    "Matara",
    "Hambantota",
    "Jaffna",
    "Kilinochchi",
    "Mannar",
    "Vavuniya",
    "Mullaitivu",
    "Batticaloa",
    "Ampara",
    "Trincomalee",
    "Kurunegala",
    "Puttalam",
    "Anuradhapura",
    "Polonnaruwa",
    "Badulla",
    "Monaragala",
    "Ratnapura",
    "Kegalle",
  ];

  const job_types = ["Full Time", "Part Time"];

  // Format today's date for "min" in expiry date input
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.location || !form.expiry_date) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      salary_range: `${form.min_salary} - ${form.max_salary}`,
      job_id: job?.job_id,
    };

    try {
      const res = await axios.post(
        "http://localhost/Git/Project1/Backend/editJobProvider.php",
        payload,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast({
          title: res.data.message,
          description: job
            ? "Job updated successfully"
            : "Job added successfully",
        });

        onSuccess(res.data.job || payload, !!job);

        setOpen(false); // close modal after success
      } else {
        toast({
          title: "Error",
          description: res.data.errors || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {job ? (
          <Button variant="ghost" size="sm" className="text-blue-500">
            Edit
          </Button>
        ) : (
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600">
            + Add Job
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[75vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{job ? "Edit Job" : "Add Job"}</DialogTitle>
        </DialogHeader>

        {/* Scrollable form */}
        <div className="grid gap-4 py-4 overflow-y-auto pr-2 flex-1">
          <div>
            <Label>Title *</Label>
            <Input name="title" value={form.title} onChange={handleChange} />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Requirements</Label>
            <Textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              placeholder="List requirements, separated by new lines"
            />
          </div>

          <div>
            <Label>Location *</Label>
            <Select
              value={form.location}
              onValueChange={(value) => setForm({ ...form, location: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Job Type *</Label>
            <Select
              value={form.job_type}
              onValueChange={(value) => setForm({ ...form, job_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                {job_types.map((jt) => (
                  <SelectItem key={jt} value={jt}>
                    {jt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Min Salary *</Label>
              <Input
                name="min_salary"
                type="number"
                value={form.min_salary}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Max Salary *</Label>
              <Input
                name="max_salary"
                type="number"
                value={form.max_salary}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label>Benefits</Label>
            <Textarea
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
              placeholder="List benefits, separated by new lines"
            />
          </div>

          <div>
            <Label>Expiry Date *</Label>
            <Input
              type="date"
              name="expiry_date"
              value={form.expiry_date}
              onChange={handleChange}
              min={today} // 🔹 restrict to today & future only
            />
          </div>
        </div>

        {/* Footer fixed at bottom */}
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : job ? "Update Job" : "Add Job"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
