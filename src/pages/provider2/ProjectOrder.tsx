import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Clock,
  DollarSign,
  Eye,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";
import axios from "axios";
import { IOngoingProject } from "@/store/provider.interface";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const OngoingProject = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [ongoingProjects, setOngoingProjects] = useState<IOngoingProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<IOngoingProject | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost/Git/Project1/Backend/GetAllOngoingProjectProvider.php", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          setOngoingProjects(response.data.projects);
        } else {
          console.log("Error fetching projects:", response.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "new":
        return "destructive";
      case "in-progress":
        return "secondary";
      case "completed":
        return "default";
      case "cancelled":
        return "outline";
      default:
        return "outline";
    }
  };
  //  const handleChange = (key: string, value: string) => {
  //   setFormData(prev => ({ ...prev, [key]: value }));
  //   console.log(key,value);
  //   // setErrors(prev => ({ ...prev, [key]: "" }));
  // };

  const handleStatusUpdate = async(projectId: number, newStatus: string) => {
    console.log(`Update project ${projectId} to ${newStatus}`);

     try {
      const response = await axios.post("http://localhost/Git/Project1/Backend/UpdateOngoingProjectStatusProvider.php", { "project_id":projectId,"new_status": newStatus}, { withCredentials: true });
      // console.log("Login successful:");
      // navigate("/");


      if (response.data.success) {
        console.log("Request sent successful");
        toast({
          title: "Request sent!",
          description: ` request sended to .`,
          // description: `${product.productId},${product.name},${product.price},${product.productId},${currentUser.id}`,
        });


      } else {
        console.log(response.data);
        toast({
          title: "Request sent failed",
          description: "Invalid credentials check and resend again",
          variant: "destructive",
        });
        // console.log(" error in login"); // show error message from PHP

      }
    } catch (err) {
      console.error("Error login user:", err);
    } finally {
      setLoading(false);
    } 

    setOngoingProjects((prev) =>
      prev.map((p) =>
        p.project_id === projectId ? { ...p, status: newStatus } : p
      )
    );
  };

  const filteredOrders = ongoingProjects.filter((order) => {
    const matchesSearch =
      order.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  //  const [formData, setFormData] = useState<any>({
  //   startDate:"",
  //   durDate:""
     
  //   });

  const totalOrders = ongoingProjects.length;
  const newOrders = ongoingProjects.filter((o) => o.status === "new").length;
  const inProgressOrders = ongoingProjects.filter((o) => o.status === "ongoing").length;
  const completedOrders = ongoingProjects.filter((o) => o.status === "completed").length;
  const [editingDates, setEditingDates] = useState(false);
  const [formData, setFormData] = useState({
  start_date:"",
  due_date:  ""
});

const handleChange = (field: string, value: string) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
  console.log(field,value);
};

const handleUpdateDates =async (project_id:number) => {
  // 🔥 Call API here to update the dates
  console.log("Updating project dates:", formData);
   try {
      const response = await axios.post("http://localhost/Git/Project1/Backend/UpdateOngoingProjectDateProvider.php", { "project_id":project_id,"startDate": formData.start_date,"dueDate":formData.due_date}, { withCredentials: true });
      // console.log("Login successful:");
      // navigate("/");


      if (response.data.success) {
        console.log("Request sent successful");
        toast({
          title: "Request sent!",
          description: ` request sended to .`,
          // description: `${product.productId},${product.name},${product.price},${product.productId},${currentUser.id}`,
        });


      } else {
        console.log(response.data);
        toast({
          title: "Request sent failed",
          description: "Invalid credentials check and resend again",
          variant: "destructive",
        });
        // console.log(" error in login"); // show error message from PHP

      }
    } catch (err) {
      console.error("Error login user:", err);
    } finally {
      setLoading(false);
    }
  setEditingDates(false);
};


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ongoing Projects</h1>
        <p className="text-muted-foreground">
          Track and manage your active service projects
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Projects</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
            <DollarSign className="h-6 w-6 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">New</p>
              <p className="text-2xl font-bold text-red-600">{newOrders}</p>
            </div>
            <AlertCircle className="h-6 w-6 text-red-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {inProgressOrders}
              </p>
            </div>
            <Clock className="h-6 w-6 text-blue-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {completedOrders}
              </p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-600" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No ongoing projects</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <Card
              key={order.project_id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <CardTitle>{order.project_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Project #{order.project_id}
                    </p>
                    <p className="text-sm">Customer: {order.customer_name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <p className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> Start:{" "}
                    {new Date(order.start_date).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> Due:{" "}
                    {new Date(order.due_date).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" /> Price: Rs.
                    {order.service_price}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 border-t pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProject(order)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> View Details
                  </Button>
                  {/* <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" /> Contact
                  </Button> */}
                  {/* {order.status === "new" && order.start_date == null && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(order.project_id, "in-progress")
                      }
                    >
                      Start Project
                    </Button>
                  )} */}

                  {order.status !== "terminated" && (<Select
                    defaultValue={order.status}
                    onValueChange={(value) =>
                      handleStatusUpdate(order.project_id, value)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={order.status} />
                    </SelectTrigger>
                    <SelectContent defaultValue={order.status}>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="ongoing">On Going</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>

                    </SelectContent>
                  </Select>)}

{/* {order.start_date !== "null" && (
  <div className="flex gap-5">
             <span className="items-center justify-center flex"> <label className=" mb-1 text-sm font-medium justify-center items-center">Start </label></span>
              <Input type="date" 
               value={order.start_date ?order.start_date :formData.start_date } 
              onChange={e => handleChange("start_date", e.target.value)}
               />

               <span className="items-center justify-center flex"> <label className=" mb-1 text-sm font-medium justify-center items-center">Due  </label></span>
              <Input type="date" 
              value={order.due_date ?order.due_date: formData.due_date} 
              onChange={e => handleChange("due_date", e.target.value)}
               />
              
            </div>
            
  
  
  )} */}
  <div className="flex flex-col gap-2">
  {order.status !== "terminated" ? 
  <> 
  <p>payment add pannaum</p>
  {!editingDates  ? (
    <div  className="flex gap-5">
      {/* <p className="text-sm">
        <span className="font-medium">Start:</span>{" "}
        {order.start_date ? new Date(order.start_date).toLocaleDateString() : "N/A"}
      </p> */}
      {/* <p className="text-sm">
        <span className="font-medium">Due:</span>{" "}
        {order.due_date ? new Date(order.due_date).toLocaleDateString() : "N/A"}
      </p> */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setEditingDates(true)}
      >
        Change Date
      </Button>
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div>
          <label className="block mb-1 text-sm font-medium">Start</label>
          <Input
            type="date"
            value={formData.start_date}
            onChange={(e) => handleChange("start_date", e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Due</label>
          <Input
            type="date"
            value={formData.due_date}
            onChange={(e) => handleChange("due_date", e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" 
        onClick={()=>handleUpdateDates(order.project_id)}
        >
          Update
        </Button>
        <Button
          size="sm"
          variant="outline"
          // onClick={() => setEditingDates(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  )} </>:null}
</div>
                  {/* {order.status == "in-progress" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(order.project_id, "completed")
                      }
                    >
                      Mark Complete
                    </Button>
                  )}
                  {!["completed", "cancelled"].includes(order.status) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(order.project_id, "cancelled")
                      }
                    >
                      Cancel Project
                    </Button>
                  )} */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <p><strong>Service:</strong> {selectedProject.service_name}</p>
              <p><strong>Description:</strong> {selectedProject.service_description}</p>
              <p><strong>Category:</strong> {selectedProject.service_category}</p>
              <p><strong>Customer:</strong> {selectedProject.customer_name} ({selectedProject.customer_email}, {selectedProject.customer_phone})</p>
              {selectedProject.details && (
                <div className="border-t pt-3 space-y-1 text-sm">
                  {Object.entries(selectedProject.details).map(([k, v]) => (
                    <p key={k}>
                      <span className="font-medium capitalize">
                        {k.replace(/_/g, " ")}:
                      </span>{" "}
                      {v}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OngoingProject;
