export interface currentUser {
  customerId: number,
  customerName: string,
  role: string,

}


export interface IJob {
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
  profile_image: string;



}

export interface IProduct {
  product_id: number;
  provider_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  specifications: string;
  average_rating: number;
  /// rating add pannale
  images: string; // this is a JSON string (array in string)
  is_approved: number;
  created_at: string;
  updated_at: string;
  success?: boolean;
  provider_name:string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: string;
}