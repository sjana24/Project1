import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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

const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({ isOpen, onClose, onSubmit, selectedService }) => {
const { toast } = useToast();
  
  const [formData, setFormData] = useState<any>({
    fullName: "",
    phone: "",
    preferredDate: "",

    // Installation
    installationAddress: "",
    installationCity: "",
    installationProvince: "",
    installationZip: "",
    installationRoofHeight: "",
    installationCapacity: "",
    installationRoofSize: "",

    // Relocation - Current
    relocationOldAddress: "",
    relocationOldCity: "",
    relocationOldProvince: "",
    relocationOldZip: "",
    relocationRoofHeightOld: "",

    // Relocation - New
    relocationNewAddress: "",
    relocationNewCity: "",
    relocationNewProvince: "",
    relocationNewZip: "",
    relocationRoofHeightNew: "",
    relocationRoofSize: "",

    // Maintenance
    maintenanceProblem: "",
    maintenanceAddress: "",
    maintenanceCity: "",
    maintenanceProvince: "",
    maintenanceZip: "",
    maintainanceRoofHeight:""
    
  });



  const [errors, setErrors] = useState<any>({});

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  // const validate = () => {
  //   const requiredFields = ["fullName", "phone", "province", "city", "address", "roofHeight"];
  //   const newErrors: any = {};
  //   requiredFields.forEach(field => {
  //     if (!formData[field]) newErrors[field] = "This field is required.";
  //   });
  //   return newErrors;
  // };
  const validate = () => {
    const newErrors: any = {};

    // Common required fields
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!formData.phone) newErrors.phone = "Phone is required.";

    // INSTALLATION VALIDATION
    if (selectedService === "installation") {
      if (!formData.installationAddress) newErrors.installationAddress = "Address is required.";
      if (!formData.installationCity) newErrors.installationCity = "City is required.";
      if (!formData.installationProvince) newErrors.installationProvince = "Province is required.";
      if (!formData.installationZip) newErrors.installationZip = "Zip code is required.";
      if (!formData.installationRoofHeight) newErrors.installationRoofHeight = "Roof height is required.";
      if (!formData.installationCapacity) newErrors.installationCapacity = "Preferred capacity is required.";
      if (!formData.installationRoofSize) newErrors.installationRoofSize = "Roof size is required.";
    }

    // RELOCATION VALIDATION
    if (selectedService === "relocation") {
      // Current Address
      if (!formData.relocationOldAddress) newErrors.relocationOldAddress = "Current address is required.";
      if (!formData.relocationOldCity) newErrors.relocationOldCity = "Current city is required.";
      if (!formData.relocationOldProvince) newErrors.relocationOldProvince = "Current province is required.";
      if (!formData.relocationOldZip) newErrors.relocationOldZip = "Current zip code is required.";
      if (!formData.relocationRoofHeightOld) newErrors.relocationRoofHeightOld = "Current roof height is required.";
      // if (!formData.relocationRoofCurrentRoofHeightHeightrelocationRoofHeightOld = "Current roof height is required.";

      // New Address
      if (!formData.relocationNewAddress) newErrors.relocationNewAddress = "New address is required.";
      if (!formData.relocationNewCity) newErrors.relocationNewCity = "New city is required.";
      if (!formData.relocationNewProvince) newErrors.relocationNewProvince = "New province is required.";
      // if (!formData.relocationCurrentAddress) newErrors.relocationCurrentAddress = "Current address is required.";
      // if (!formData.relocationCurrentCity) newErrors.relocationCurrentCity = "Current city is required.";
      // if (!formData.relocationCurrentProvince) newErrors.relocationCurrentProvince = "Current province is required.";
      if (!formData.relocationNewZip) newErrors.relocationNewZip = "New zip code is required.";
      if (!formData.relocationRoofHeightNew) newErrors.relocationRoofHeightNew = "New roof height is required.";

      if (!formData.relocationRoofSize) newErrors.relocationRoofSize = "Roof size is required.";
    }

    // MAINTENANCE VALIDATION
    if (selectedService === "maintenance") {
      if (!formData.maintenanceProblem) newErrors.maintenanceProblem = "Problem description is required.";
      if (!formData.maintenanceAddress) newErrors.maintenanceAddress = "Address is required.";
      if (!formData.maintenanceCity) newErrors.maintenanceCity = "City is required.";
      if (!formData.maintenanceProvince) newErrors.maintenanceProvince = "Province is required.";
      if (!formData.maintenanceZip) newErrors.maintenanceZip = "Zip code is required.";
      if (!formData.maintainanceRoofHeight) newErrors.maintenanceRoofHeight = "Roof Height code is required.";
    }

    return newErrors;
  };


  const handleSubmit = () => {
    const validationErrors = validate();
    // console.log(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Enter all requird fields",
        description: "You must be fill all requied field.",
        variant: "destructive", // optional styling

      });
      console.log("Validation errors:", validationErrors);
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
            <Input placeholder="Full Name" value={formData.fullName} onChange={e => handleChange("fullName", e.target.value)} required />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Phone *</label>
            <Input placeholder="Phone" type="tel" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} required />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {selectedService === "installation" && (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium">Street Address *</label>
                <Input placeholder="Street" value={formData.installationAddress} onChange={e => handleChange("installationAddress", e.target.value)} required />
                {errors.installationAddress && <p className="text-red-500 text-sm mt-1">{errors.installationAddress}</p>}
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium">Province *</label>
                  <Select value={formData.installationProvince} onValueChange={v => {
                    handleChange("installationProvince", v);
                    handleChange("installationCity", "");
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select Province" /></SelectTrigger>
                    <SelectContent>
                      {provinces.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.installationProvince && <p className="text-red-500 text-sm mt-1">{errors.installationProvince}</p>}
                </div>
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium">City *</label>
                  <Select value={formData.installationCity} onValueChange={v => handleChange("installationCity", v)}>
                    <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                    <SelectContent>
                      {(citiesByProvince[formData.installationProvince?.replace(/\s/g, "")] || []).map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.installationCity && <p className="text-red-500 text-sm mt-1">{errors.installationCity}</p>}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Zip Code *</label>
                <Input placeholder="Zip" value={formData.installationZip} onChange={e => handleChange("installationZip", e.target.value)} required />
                {errors.installationZip && <p className="text-red-500 text-sm mt-1">{errors.installationZip}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Roof Height (m) *</label>
                <Input type="number" placeholder="Roof Height" value={formData.installationRoofHeight} onChange={e => handleChange("installationRoofHeight", e.target.value)} required />
                {errors.installationRoofHeight && <p className="text-red-500 text-sm mt-1">{errors.installationRoofHeight}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Preferred kW Capacity *</label>
                <Input placeholder="Capacity" value={formData.installationCapacity} onChange={e => handleChange("installationCapacity", e.target.value)} required />
                {errors.installationCapacity && <p className="text-red-500 text-sm mt-1">{errors.installationCapacity}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Roof Size (m²) *</label>
                <Input placeholder="Roof Size" value={formData.installationRoofSize} onChange={e => handleChange("installationRoofSize", e.target.value)} required />
                {errors.installationRoofSize && <p className="text-red-500 text-sm mt-1">{errors.installationRoofSize}</p>}
              </div>
            </>
          )}
          {selectedService === "relocation" && (
            <>
              {/* Current Address */}
              <div>
                <label className="block mb-1 text-sm font-medium">Current Street Address *</label>
                <Input placeholder="Street" value={formData.relocationOldAddress} onChange={e => handleChange("relocationOldAddress", e.target.value)} required />
                {errors.relocationOldAddress && <p className="text-red-500 text-sm mt-1">{errors.relocationOldAddress}</p>}
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium">Current Province *</label>
                  <Select value={formData.relocationOldProvince} onValueChange={v => {
                    handleChange("relocationOldProvince", v);
                    handleChange("relocationOldCity", "");
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select Province" /></SelectTrigger>
                    <SelectContent>
                      {provinces.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.relocationOldProvince && <p className="text-red-500 text-sm mt-1">{errors.relocationOldProvince}</p>}
                </div>
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium">Current City *</label>
                  <Select value={formData.relocationOldCity} onValueChange={v => handleChange("relocationOldCity", v)}>
                    <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                    <SelectContent>
                      {(citiesByProvince[formData.relocationOldProvince?.replace(/\s/g, "")] || []).map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.relocationOldCity && <p className="text-red-500 text-sm mt-1">{errors.relocationOldCity}</p>}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Current Zip Code *</label>
                <Input placeholder="Zip" value={formData.relocationOldZip} onChange={e => handleChange("relocationOldZip", e.target.value)} required />
                {errors.relocationOldZip && <p className="text-red-500 text-sm mt-1">{errors.relocationOldZip}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Roof Height at Current Address (m) *</label>
                <Input type="number" placeholder="Roof Height" value={formData.relocationRoofHeightOld} onChange={e => handleChange("relocationRoofHeightOld", e.target.value)} required />
                {errors.relocationRoofHeightOld && <p className="text-red-500 text-sm mt-1">{errors.relocationRoofHeightOld}</p>}
              </div>

              {/* New Address */}
              <div>
                <label className="block mb-1 text-sm font-medium">New Street Address *</label>
                <Input placeholder="Street" value={formData.relocationNewAddress} onChange={e => handleChange("relocationNewAddress", e.target.value)} required />
                {errors.relocationNewAddress && <p className="text-red-500 text-sm mt-1">{errors.relocationNewAddress}</p>}
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium">New Province *</label>
                  <Select value={formData.relocationNewProvince} onValueChange={v => {
                    handleChange("relocationNewProvince", v);
                    handleChange("relocationNewCity", "");
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select Province" /></SelectTrigger>
                    <SelectContent>
                      {provinces.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.relocationNewProvince && <p className="text-red-500 text-sm mt-1">{errors.relocationNewProvince}</p>}
                </div>
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium">New City *</label>
                  <Select value={formData.relocationNewCity} onValueChange={v => handleChange("relocationNewCity", v)}>
                    <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                    <SelectContent>
                      {(citiesByProvince[formData.relocationNewProvince?.replace(/\s/g, "")] || []).map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.relocationNewCity && <p className="text-red-500 text-sm mt-1">{errors.relocationNewCity}</p>}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">New Zip Code *</label>
                <Input placeholder="Zip" value={formData.relocationNewZip} onChange={e => handleChange("relocationNewZip", e.target.value)} required />
                {errors.relocationNewZip && <p className="text-red-500 text-sm mt-1">{errors.relocationNewZip}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Roof Height at New Address (m) *</label>
                <Input type="number" placeholder="Roof Height" value={formData.relocationRoofHeightNew} onChange={e => handleChange("relocationRoofHeightNew", e.target.value)} required />
                {errors.relocationRoofHeightNew && <p className="text-red-500 text-sm mt-1">{errors.relocationRoofHeightNew}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Roof Size (m²)</label>
                <Input placeholder="Roof Size" value={formData.relocationRoofSize} onChange={e => handleChange("relocationRoofSize", e.target.value)} />
                {errors.relocationRoofSize && <p className="text-red-500 text-sm mt-1">{errors.relocationRoofSize}</p>}
              </div>
            </>
          )}
          {selectedService === "maintenance" && (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium">Street Address *</label>
                <Input placeholder="Street" value={formData.maintenanceAddress} onChange={e => handleChange("maintenanceAddress", e.target.value)} required />
                {errors.maintenanceAddress && <p className="text-red-500 text-sm mt-1">{errors.maintenanceAddress}</p>}
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium">Province *</label>
                  <Select value={formData.maintenanceProvince} onValueChange={v => {
                    handleChange("maintenanceProvince", v);
                    handleChange("maintenanceCity", "");
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select Province" /></SelectTrigger>
                    <SelectContent>
                      {provinces.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.maintenanceProvince && <p className="text-red-500 text-sm mt-1">{errors.maintenanceProvince}</p>}
                </div>
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium">City *</label>
                  <Select value={formData.maintenanceCity} onValueChange={v => handleChange("maintenanceCity", v)}>
                    <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                    <SelectContent>
                      {(citiesByProvince[formData.maintenanceProvince?.replace(/\s/g, "")] || []).map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.maintenanceCity && <p className="text-red-500 text-sm mt-1">{errors.maintenanceCity}</p>}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Zip Code *</label>
                <Input placeholder="Zip" value={formData.maintenanceZip} onChange={e => handleChange("maintenanceZip", e.target.value)} required />
                {errors.maintenanceZip && <p className="text-red-500 text-sm mt-1">{errors.maintenanceZip}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Roof Height (m) *</label>
                <Input type="number" placeholder="Roof Height" value={formData.maintenanceRoofHeight} onChange={e => handleChange("maintenanceRoofHeight", e.target.value)} required />
                {errors.maintenanceRoofHeight && <p className="text-red-500 text-sm mt-1">{errors.maintenanceRoofHeight}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Describe the issue *</label>
                <Textarea placeholder="Describe the issue" value={formData.maintenanceProblem} onChange={e => handleChange("maintenanceProblem", e.target.value)} />
                {errors.maintenanceProblem && <p className="text-red-500 text-sm mt-1">{errors.maintenanceProblem}</p>}
              </div>
            </>
          )}




          <div>
            <label className="block mb-1 text-sm font-medium">Preferred Date</label>
            <Input type="date" value={formData.preferredDate} onChange={e => handleChange("preferredDate", e.target.value)} />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full mt-6 bg-[#26B170] text-white font-semibold py-2 px-4 rounded"
          >
            Submit Request
          </Button>

        </div>
      </div>
    </div>
  );

};

export default ServiceRequestModal;
