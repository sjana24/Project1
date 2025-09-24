import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Users, UserCheck, UserX, Eye } from "lucide-react";

export interface Provider {
  user_id: number;
  username: string;
  email: string;
  contact_number?: string;
  created_at: string;
  company_name: string;
  business_registration_number: string;
  address: string;
  district: string;
  website: string;
  company_description: string;
  is_blocked: number; // 0 = active, 1 = disabled
}

const ProviderPage = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost/Git/Project1/Backend/GetAllProvidersAdmin.php", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          const mappedProviders: Provider[] = response.data.providers.map(
            (p: any) => ({
              ...p,
              is_blocked: p.is_blocked,
            })
          );
          setProviders(mappedProviders);
          setFilteredProviders(mappedProviders);
        } else {
          console.log("Failed to fetch providers:", response.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching providers:", err);
      });
  }, []);

  useEffect(() => {
    const filtered = providers.filter(
      (provider) =>
        provider.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProviders(filtered);
  }, [searchTerm, providers]);

  const updateStatus = async (user_id: number, new_status: "active" | "disabled") => {
    try {
      const res = await axios.post(
        "http://localhost/Git/Project1/Backend/UpdateProviderStatus.php",
        {
          user_id,
          is_blocked: new_status === "active" ? 0 : 1,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        const updated = providers.map((p) =>
          p.user_id === user_id ? { ...p, is_blocked: new_status === "active" ? 0 : 1 } : p
        );
        setProviders(updated);
        setFilteredProviders(updated);

        toast({
          title: "Status Updated",
          description: `Provider status updated to ${new_status}`,
        });
      } else {
        toast({
          title: "Error",
          description:
            res.data.message || "Failed to update provider status",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error updating provider status:", err);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (is_blocked: number) => {
    return is_blocked === 0 ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        <UserCheck className="w-3 h-3 mr-1" /> Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
        <UserX className="w-3 h-3 mr-1" /> Disabled
      </Badge>
    );
  };

  const activeProviders = providers.filter((p) => p.is_blocked === 0).length;
  const disabledProviders = providers.filter((p) => p.is_blocked === 1).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-3xl font-bold text-gray-900">
            Provider Management
          </h5>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <p className="text-sm text-gray-600">Total Providers</p>
              <p className="text-2xl font-bold text-gray-900">
                {providers.length}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <p className="text-sm text-gray-600">Active Providers</p>
              <p className="text-2xl font-bold text-green-600">
                {activeProviders}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <p className="text-sm text-gray-600">Disabled Providers</p>
              <p className="text-2xl font-bold text-red-600">
                {disabledProviders}
              </p>
            </div>
            <UserX className="w-8 h-8 text-red-500" />
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <Card
            key={provider.user_id}
            className="hover:shadow-lg transition-all duration-200"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-success rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{provider.username}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {provider.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {provider.contact_number ?? "0123456789"}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(provider.is_blocked)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Joined</span>
                  <span className="text-sm">
                    {new Date(provider.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* View Details */}
                <div className="pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" /> View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[700px] max-w-[95vw] rounded-xl overflow-hidden p-0">
                      <DialogHeader className="p-4 border-b">
                        <DialogTitle className="text-xl font-bold">
                          {provider.username}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="p-6 space-y-4 text-sm md:text-base">
                        <p className="flex justify-between border-b pb-2">
                          <strong>Email:</strong> <span>{provider.email}</span>
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <strong>Contact:</strong>{" "}
                          <span>{provider.contact_number}</span>
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <strong>Company:</strong>{" "}
                          <span>{provider.company_name}</span>
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <strong>Business Reg. No:</strong>{" "}
                          <span>{provider.business_registration_number}</span>
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <strong>Address:</strong> <span>{provider.address}</span>
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <strong>District:</strong>{" "}
                          <span>{provider.district}</span>
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <strong>Website:</strong>{" "}
                          <a
                            href={provider.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {provider.website}
                          </a>
                        </p>
                        <div className="border-b pb-2">
                          <strong>Description:</strong>
                          <p className="text-gray-700 leading-relaxed">
                            {provider.company_description}
                          </p>
                        </div>
                        <p className="flex justify-between items-center">
                          <strong>Status:</strong>
                          {getStatusBadge(provider.is_blocked)}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-2">
                  {provider.is_blocked === 1 ? (
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-1 bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() => updateStatus(provider.user_id, "active")}
                    >
                      <UserCheck className="w-3 h-3" /> Activate
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                      onClick={() => updateStatus(provider.user_id, "disabled")}
                    >
                      <UserX className="w-3 h-3" /> Suspend
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProviderPage;
