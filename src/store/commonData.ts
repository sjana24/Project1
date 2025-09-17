export const provinces = [
    { value: "Western", label: "Western" },
    { value: "Central", label: "Central" },
    { value: "Southern", label: "Southern" },
    { value: "Northern", label: "Northern" },
    { value: "Eastern", label: "Eastern" },
    { value: "North Western", label: "North Western" },
    { value: "North Central", label: "North Central" },
    { value: "Uva", label: "Uva" },
    { value: "Sabaragamuwa", label: "Sabaragamuwa" },
  ];

  
export const districtsByProvince: Record<string, string[]> = {
    Western: ["Colombo", "Gampaha", "Kalutara"],
    Central: ["Kandy", "Matale", "Nuwara Eliya"],
    Southern: ["Galle", "Matara", "Hambantota"],
    Northern: ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
    Eastern: ["Trincomalee", "Batticaloa", "Ampara"],
    NorthWestern: ["Kurunegala", "Puttalam"],
    NorthCentral: ["Anuradhapura", "Polonnaruwa"],
    Uva: ["Badulla", "Monaragala"],
    Sabaragamuwa: ["Ratnapura", "Kegalle"]
  };