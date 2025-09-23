import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import {
  Search,
  ShoppingCart,
  Check,
  Clock,
  Eye,
  EyeOff,
  MoreHorizontal,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface Review {
  review_id: number;
  rating: number;
  comment: string;
  is_active: boolean;
}

export interface Service {
  service_id: number;
  provider_id: number;
  name: string;
  provider: string;
  category: string;
  price: number;
  description: string;
  images: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  reviews: Review[];
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost/Git/Project1/Backend/GetAllServiceAdmin.php")
      .then((response) => {
        const data = response.data;
        if (data.success && data.services?.length > 0) {
          const mappedServices = data.services.map((s: any) => ({
            ...s,
            provider: `Provider ${s.provider_id}`,
            price: parseFloat(s.price),
            reviews: s.reviews || [],
          }));
          setServices(mappedServices);
          setFilteredServices(mappedServices);
        } else {
          setServices([]);
          setFilteredServices([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  const getStatusBadge = (is_approved: boolean) => {
    if (is_approved)
      return (
        <Badge className="bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" /> Approved
        </Badge>
      );
    return (
      <Badge className="bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" /> Pending
      </Badge>
    );
  };

  /** ✅ Toggle Service Visibility API */
  const updateServiceStatus = async (
    serviceGet: Service,
    is_active: boolean
  ) => {
    try {
      const res = await axios.post(
        "http://localhost/Git/Project1/Backend/ServiceAdminStatusUpdate.php",
        {
          service_id: serviceGet.service_id,
          is_active: is_active ? 1 : 0,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast({
          title: "Service status updated!",
          description: `${serviceGet.name} is now ${
            is_active ? "Visible" : "Hidden"
          }`,
        });
      } else {
        toast({
          title: "Failed to update service",
          description: res.data.message || "Try again later",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleApproval = (service: Service) => {
    const updatedServices = services.map((s) =>
      s.service_id === service.service_id
        ? { ...s, is_approved: !s.is_approved }
        : s
    );
    setServices(updatedServices);
    setFilteredServices(updatedServices);
    updateServiceStatus(service, !service.is_approved);
  };

  /** ✅ Toggle Review Status API */
  const toggleReviewStatus = async (review: Review, serviceId: number) => {
    try {
      const res = await axios.post(
        "http://localhost/Git/Project1/Backend/yyy.php",
        {
          review_id: review.review_id,
          is_active: review.is_active ? 0 : 1,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast({
          title: "Review status updated",
          description: `Review is now ${
            review.is_active ? "Blocked" : "Visible"
          }`,
        });
        // update state locally
        setServices((prev) =>
          prev.map((s) =>
            s.service_id === serviceId
              ? {
                  ...s,
                  reviews: s.reviews.map((r) =>
                    r.review_id === review.review_id
                      ? { ...r, is_active: !r.is_active }
                      : r
                  ),
                }
              : s
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const hiddenServices = services.filter((s) => !s.is_approved).length;
  const visibleServices = services.filter((s) => s.is_approved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Service Management
          </h1>
          <p className="text-gray-600 mt-2">
            Review and approve services from providers
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-yellow-600">
              {hiddenServices} Hidden
            </span>{" "}
            •
            <span className="font-medium text-green-600 ml-1">
              {visibleServices} Visible
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">
                {services.length}
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hidden Services</p>
              <p className="text-2xl font-bold text-red-600">
                {hiddenServices}
              </p>
            </div>
            <Clock className="w-8 h-8 text-red-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Visible Services</p>
              <p className="text-2xl font-bold text-green-600">
                {visibleServices}
              </p>
            </div>
            <Check className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, provider, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const avgRating =
            service.reviews.length > 0
              ? (
                  service.reviews.reduce((a, b) => a + b.rating, 0) /
                  service.reviews.length
                ).toFixed(1)
              : null;

          return (
            <Card
              key={service.service_id}
              className="hover:shadow-lg transition-all duration-200"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {service.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {service.category}
                      </p>
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
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    {getStatusBadge(service.is_approved)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Provider
                    </span>
                    <span className="text-sm">{service.provider}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Price
                    </span>
                    <span className="font-medium">
                      Rs {service.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Date Added
                    </span>
                    <span className="text-sm">
                      {new Date(
                        service.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Visible
                    </span>
                    <div className="flex items-center gap-2">
                      {service.is_approved ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                      <Switch
                        checked={service.is_approved}
                        onCheckedChange={() => toggleApproval(service)}
                      />
                    </div>
                  </div>
                  {/* ✅ View Details Modal */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-3"
                      >
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>
                          {service.name} - Details & Reviews
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 text-gray-700">
                        <p>{service.description}</p>
                        <p>
                          <span className="font-semibold">Price:</span> Rs.{" "}
                          {service.price}
                        </p>
                        <p>
                          <span className="font-semibold">Category:</span>{" "}
                          {service.category}
                        </p>
                        {avgRating && (
                          <p className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">
                              Average Rating: {avgRating}/5
                            </span>
                          </p>
                        )}
                        <div>
                          <p className="font-semibold mb-2">Reviews:</p>
                          {service.reviews.length === 0 ? (
                            <p>No reviews yet</p>
                          ) : (
                            <ul className="space-y-3">
                              {service.reviews.map((review) => (
                                <li
                                  key={review.review_id}
                                  className="border p-3 rounded-md flex justify-between items-center"
                                >
                                  <div>
                                    <p className="font-medium">
                                      Rating: {review.rating}/5
                                    </p>
                                    <p>{review.comment}</p>
                                  </div>
                                  <Switch
                                    checked={review.is_active}
                                    onCheckedChange={() =>
                                      toggleReviewStatus(
                                        review,
                                        service.service_id
                                      )
                                    }
                                  />
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesPage;
