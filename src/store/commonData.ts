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

  export const districtsWithProvince = [
  // Western Province
  { value: "Colombo", label: "Colombo", province: "Western" },
  { value: "Gampaha", label: "Gampaha", province: "Western" },
  { value: "Kalutara", label: "Kalutara", province: "Western" },

  // Central Province
  { value: "Kandy", label: "Kandy", province: "Central" },
  { value: "Matale", label: "Matale", province: "Central" },
  { value: "Nuwara Eliya", label: "Nuwara Eliya", province: "Central" },

  // Southern Province
  { value: "Galle", label: "Galle", province: "Southern" },
  { value: "Matara", label: "Matara", province: "Southern" },
  { value: "Hambantota", label: "Hambantota", province: "Southern" },

  // Northern Province
  { value: "Jaffna", label: "Jaffna", province: "Northern" },
  { value: "Kilinochchi", label: "Kilinochchi", province: "Northern" },
  { value: "Mannar", label: "Mannar", province: "Northern" },
  { value: "Mullaitivu", label: "Mullaitivu", province: "Northern" },
  { value: "Vavuniya", label: "Vavuniya", province: "Northern" },

  // Eastern Province
  { value: "Batticaloa", label: "Batticaloa", province: "Eastern" },
  { value: "Ampara", label: "Ampara", province: "Eastern" },
  { value: "Trincomalee", label: "Trincomalee", province: "Eastern" },

  // North Western Province
  { value: "Kurunegala", label: "Kurunegala", province: "North Western" },
  { value: "Puttalam", label: "Puttalam", province: "North Western" },

  // North Central Province
  { value: "Anuradhapura", label: "Anuradhapura", province: "North Central" },
  { value: "Polonnaruwa", label: "Polonnaruwa", province: "North Central" },

  // Uva Province
  { value: "Badulla", label: "Badulla", province: "Uva" },
  { value: "Monaragala", label: "Monaragala", province: "Uva" },

  // Sabaragamuwa Province
  { value: "Ratnapura", label: "Ratnapura", province: "Sabaragamuwa" },
  { value: "Kegalle", label: "Kegalle", province: "Sabaragamuwa" },
];


  export const jobTypes = [
  {value: "all", key: "All"},
  { value: "Full Time", key: "Full Time" },
  { value: "Part Time", key: "Part Time" },
  { value: "Internship", key: "Internship" },
];

export const districts = [
  // Western Province
  {value: "all", key: "All"},
  { value: "Colombo", key: "Colombo" },
  { value: "Gampaha", key: "Gampaha" },
  { value: "Kalutara", key: "Kalutara" },

  // Central Province
  { value: "Kandy", key: "Kandy" },
  { value: "Matale", key: "Matale" },
  { value: "Nuwara Eliya", key: "Nuwara Eliya" },

  // Southern Province
  { value: "Galle", key: "Galle" },
  { value: "Matara", key: "Matara" },
  { value: "Hambantota", key: "Hambantota" },

  // Northern Province
  { value: "Jaffna", key: "Jaffna" },
  { value: "Kilinochchi", key: "Kilinochchi" },
  { value: "Mannar", key: "Mannar" },
  { value: "Mullaitivu", key: "Mullaitivu" },
  { value: "Vavuniya", key: "Vavuniya" },

  // Eastern Province
  { value: "Batticaloa", key: "Batticaloa" },
  { value: "Ampara", key: "Ampara" },
  { value: "Trincomalee", key: "Trincomalee" },

  // North Western Province
  { value: "Kurunegala", key: "Kurunegala" },
  { value: "Puttalam", key: "Puttalam" },

  // North Central Province
  { value: "Anuradhapura", key: "Anuradhapura"},
  { value: "Polonnaruwa", key: "Polonnaruwa"},

  // Uva Province
  { value: "Badulla", key: "Badulla"},
  { value: "Monaragala", key: "Monaragala"},

  // Sabaragamuwa Province
  { value: "Ratnapura", key: "Ratnapura" },
  { value: "Kegalle", key: "Kegalle" },
];


  export const productCategorys = [
  {value: "all", key: "All"},
  { value: "solar", key: "solar" },
  { value: "Part Time", key: "Part Time" },
  { value: "Internship", key: "Internship" },
];