
export interface Request {
  request_id: number;
  customer_id: number;
  service_id: number;
  request_date: string;         // ISO date string
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  service_type: "installation" | "maintenance" | "relocation";

  // Customer info
  customer_name: string;
  customer_email: string;
  customer_phone: string;

  // Service info
  service_name: string;
  service_description: string;
  service_price: number;
  service_category: string;

  // Extra service-type-specific details
  details: InstallationDetails | MaintenanceDetails | RelocationDetails | {};
}

export interface InstallationDetails {
  installation_address: string;
  roof_height: number;
}

export interface MaintenanceDetails {
  device_condition: string;
  service_notes: string;
  last_maintenance_date: string;
  roof_height: number;
}

export interface RelocationDetails {
  current_address: string;
  new_address: string;
  current_roof_height: number;
  new_roof_height: number;
}

// export interface IOngoingProject {
//     id:number;
//     orderNumber:number;
//     projectTitle:string;
//     customerName: string;
//     customerEmail: string;
//     budget: number;
//     status: string;
//     priority: string;
//     startDate:string;
//     estimatedCompletion: string;
//     paymentStatus: string;
//     description: string;
// }
export interface IOngoingProject extends Request {
  project_id: number;
  project_name: string;
  status: string;           // Project-specific status (e.g., "new", "in_progress", "completed")
  start_date: string;       // ISO date string
  due_date: string;         // ISO date string
  completed_date: string | null;
  payment_id: number | null;
  request_status: string;   // Status of the related service_request (e.g., "accepted", "pending")
}