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



}
