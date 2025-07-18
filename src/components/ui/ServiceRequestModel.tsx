import React, { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Service {
  service_id: number;
  provider_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  // specifications: string;
  /// rating add pannale
  images: string; // this is a JSON string (array in string)
  is_approved: number;
  created_at: string;
  updated_at: string;
  // success?: boolean;



}
const provinces = [
  { value: "Central", label: "Central Province" },
  { value: "Eastern", label: "Eastern Province" },
  { value: "North Central", label: "North Central Province" },
  { value: "Northern", label: "Northern Province" },
  { value: "North Western", label: "North Western Province" },
  { value: "Sabaragamuwa", label: "Sabaragamuwa Province" },
  { value: "Southern", label: "Southern Province" },
  { value: "Uva", label: "Uva Province" },
  { value: "Western", label: "Western Province" },
];

const citiesByProvince: Record<string, string[]> = {
  Western: ["Colombo", "Gampaha", "Kalutara"],
  Central: ["Kandy", "Matale", "Nuwara Eliya"],
  Southern: ["Galle", "Matara", "Hambantota"],
  Eastern: ["Trincomalee", "Batticaloa", "Ampara"],
  Northern: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  NorthCentral: ["Anuradhapura", "Polonnaruwa"],
  NorthWestern: ["Kurunegala", "Puttalam"],
  Uva: ["Badulla", "Monaragala"],
  Sabaragamuwa: ["Ratnapura", "Kegalle"]
};

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  selectedService: String;
}

const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({ isOpen, onClose, onSubmit,selectedService }) => {
  const [formData, setFormData] = useState<any>({
    fullName: "",
    phone: "",
    email: "",
    province: "",
    city: "",
    address: "",
    zip: "",
    locationLink: "",
    roofHeight: "",
    serviceType: "installation",
    roofType: "",
    roofSize: "",
    capacity: "",
    battery: "no",
    oldAddress: "",
    newAddress: "",
    problem: "",
    preferredDate: "",
    preferredTime: "",
  });
  //  useEffect(() => {
  //   console.log(selectedService.category);
        

  // });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const requiredFields = ["fullName", "phone", "email", "province", "city", "address", "roofHeight"];
    const newErrors: any = {};
    requiredFields.forEach(field => {
      if (!formData[field]) newErrors[field] = "This field is required.";
    });
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    // console.log(selectedService[0].category);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 overflow-y-auto max-h-[90vh] relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500">✕</button>
        <h2 className="text-xl font-semibold mb-4">Service Request Form</h2>
        <div className="space-y-4">

          <div>
            <label className="block mb-1 text-sm font-medium">Full Name *</label>
            <Input placeholder="Full Name" value={formData.fullName} onChange={e => handleChange("fullName", e.target.value)} />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Phone *</label>
            <Input placeholder="Phone" type="tel" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email *</label>
            <Input placeholder="Email" type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Province *</label>
              <Select value={formData.province} onValueChange={v => {
                handleChange("province", v);
                handleChange("city", "");
              }}>
                <SelectTrigger><SelectValue placeholder="Select Province" /></SelectTrigger>
                <SelectContent>
                  {provinces.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">City *</label>
              <Select value={formData.city} onValueChange={v => handleChange("city", v)}>
                <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                <SelectContent>
                  {(citiesByProvince[formData.province.replace(/\s/g, "")] || []).map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Address *</label>
            <Input placeholder="Address" value={formData.address} onChange={e => handleChange("address", e.target.value)} />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">ZIP Code</label>
            <Input placeholder="ZIP Code" value={formData.zip} onChange={e => handleChange("zip", e.target.value)} />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Google Map Link (optional)</label>
            <Input placeholder="Google Map Link" value={formData.locationLink} onChange={e => handleChange("locationLink", e.target.value)} />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Approx. Roof Height from Floor (m) *</label>
            <Input placeholder="Roof Height" type="number" value={formData.roofHeight} onChange={e => handleChange("roofHeight", e.target.value)} />
            {errors.roofHeight && <p className="text-red-500 text-sm mt-1">{errors.roofHeight}</p>}
          </div>

          {/* <div>
            <label className="block mb-1 text-sm font-medium">Service Type *</label>
            <Select value={formData.serviceType} onValueChange={v => handleChange("serviceType", v)}>
              <SelectTrigger><SelectValue placeholder="Select Service Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="installation">Installation</SelectItem>
                <SelectItem value="relocation">Relocation</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

        {selectedService === "installation" && (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium">Roof Type</label>
                <Input placeholder="Roof Type" value={formData.roofType} onChange={e => handleChange("roofType", e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Roof Size (m²)</label>
                <Input placeholder="Roof Size" value={formData.roofSize} onChange={e => handleChange("roofSize", e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Preferred kW Capacity</label>
                <Input placeholder="Capacity" value={formData.capacity} onChange={e => handleChange("capacity", e.target.value)} />
              </div>
            </>
          )}

       {selectedService  === "relocation" && (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium">Current Address</label>
                <Input placeholder="Current Address" value={formData.oldAddress} onChange={e => handleChange("oldAddress", e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">New Address</label>
                <Input placeholder="New Address" value={formData.newAddress} onChange={e => handleChange("newAddress", e.target.value)} />
              </div>
            </>
          )}

       {selectedService === "maintenance" && (
            <div>
              <label className="block mb-1 text-sm font-medium">Describe the issue</label>
              <Textarea placeholder="Describe the issue" value={formData.problem} onChange={e => handleChange("problem", e.target.value)} />
            </div>
          )}

          <div>
            <label className="block mb-1 text-sm font-medium">Preferred Date</label>
            <Input type="date" value={formData.preferredDate} onChange={e => handleChange("preferredDate", e.target.value)} />
          </div>

          <Button className="w-full mt-4" onClick={handleSubmit}>Submit Request</Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestModal;
