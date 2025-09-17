<?php
require_once 'dBCon.php';
class Admin
{
    protected $admin_id;
    protected $admin_id1;
    protected $email1;
    protected $password1;
    protected $name;
    protected $email;
    protected $password;
    protected $contact_no;
    protected $disable_sts;
    protected $conn;
    public $id = 3;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }

    public function LoginAdmin($email, $password)
    {
        $this->email = $email;
        $this->password = $password;
        // echo $this->email;
        // echo $this->password;

        try {
            $sql = "SELECT admin_id,password,email FROM admin WHERE email=?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(1, $this->email);
            $stmt->execute();
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);
            
             if ($admin && ($this->password === $admin['password'])) {
                return [
                    'success' => true,
                    'admin_id' => $admin['admin_id'],
                    'email' => $admin['email'],
                    'message' => 'Login Successful...'
                ];
            } else {
                return [
                    'success' => false,
                    'admin_id' => $admin['admin_id'] ?? null,
                    'email' => $admin['email'] ?? null,
                    'password_in_db' => $admin['password'] ?? null,
                    'message' => 'Incorrect email or password...'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to login. " . $e->getMessage()]);
        }
    }
      public function getAllCustomers()
    {
        $status="active";
        $user_role="customer";

        try {
            $sql = "SELECT * FROM user WHERE  user_role=:user_role ";
            $stmt = $this->conn->prepare($sql);
             $stmt->bindParam(':user_role', $user_role); 
            //  $stmt->bindParam(':status', $status); 
            //  $stmt->bindParam(':provider_id', $provider_id); 
            $stmt->execute();
            $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($customers) {
                return [
                    'success' => true,
                    'customers' => $customers,
                    'message' => 'Jobs fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No jobs found.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all jobs. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch jobs. ' . $e->getMessage()
            ];
        }
    }
public function getProviderCounts($provider_id)
{
    try {
        // Query to get the count of products for the provider
        $sql_products = "SELECT COUNT(*) as product_count FROM product WHERE service_provider_id = :provider_id AND is_delete = 0";
        $stmt_products = $this->conn->prepare($sql_products);
        $stmt_products->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
        $stmt_products->execute();
        $product_count = $stmt_products->fetch(PDO::FETCH_ASSOC)['product_count'];

        // Query to get the count of services for the provider
        $sql_services = "SELECT COUNT(*) as service_count FROM job_posting WHERE service_provider_id = :provider_id";
        $stmt_services = $this->conn->prepare($sql_services);
        $stmt_services->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
        $stmt_services->execute();
        $service_count = $stmt_services->fetch(PDO::FETCH_ASSOC)['service_count'];

        return [
            'success' => true,
            'products_count' => $product_count,
            'services_count' => $service_count,
            'message' => 'Counts fetched successfully.'
        ];
    } catch (PDOException $e) {
        return [
            'success' => false,
            'message' => 'Failed to fetch counts: ' . $e->getMessage()
        ];
    }
}
          public function getAllProviders()
    {
        $status="active";
        $user_role="service_provider";

        try {
            $sql = "
                SELECT u.*, sp.contact_number, sp.address, sp.district, sp.profile_image, sp.company_name, 
                sp.business_registration_number, sp.company_description, sp.website, sp.verification_status
                FROM user u
                LEFT JOIN service_provider sp ON u.user_id = sp.user_id
                WHERE u.user_role = :user_role
                ";

            $stmt = $this->conn->prepare($sql);
             $stmt->bindParam(':user_role', $user_role); 
            //  $stmt->bindParam(':status', $status); 
            //  $stmt->bindParam(':provider_id', $provider_id); 
            $stmt->execute();
            $providers = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($providers) {
                return [
                    'success' => true,
                    'providers' => $providers,
                    'message' => 'Jobs fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No jobs found.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all jobs. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch jobs. ' . $e->getMessage()
            ];
        }
    }

          public function getAllProducts()
    {
        $status="active";
        $user_role=0;

        try {
            $sql = "SELECT * FROM product WHERE  is_delete=:user_role ";
            $stmt = $this->conn->prepare($sql);
             $stmt->bindParam(':user_role', $user_role); 
            //  $stmt->bindParam(':status', $status); 
            //  $stmt->bindParam(':provider_id', $provider_id); 
            $stmt->execute();
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($products) {
                return [
                    'success' => true,
                    'products' => $products,
                    'message' => 'Jobs fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No jobs found.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all jobs. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch jobs. ' . $e->getMessage()
            ];
        }
    }

            public function getAllJobs()
    {
        // $status="active";
        // $user_role=0;

        try {
            $sql = "SELECT * FROM job_posting  ";
            $stmt = $this->conn->prepare($sql);
            //  $stmt->bindParam(':user_role', $user_role); 
            //  $stmt->bindParam(':status', $status); 
            //  $stmt->bindParam(':provider_id', $provider_id); 
            $stmt->execute();
            $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($jobs) {
                return [
                    'success' => true,
                    'jobs' => $jobs,
                    'message' => 'Jobs fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No jobs found.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all jobs. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch jobs. ' . $e->getMessage()
            ];
        }
    }
    // public function Register($name, $email, $contact_no, $password)
    // {
    //     $this->name = $name;
    //     $this->email = $email;
    //     $this->contact_no = $contact_no;
    //     $this->password = $password;


    //     try {
    //         $sql = "INSERT INTO customer (customer_id, name, email, contact_no, password) VALUES ( ?, ?, ?, ?, ?)";
    //         $stmt = $this->conn->prepare($sql);
    //         $stmt->bindParam(1, $this->id);
    //         $stmt->bindParam(2, $this->name);
    //         $stmt->bindParam(3, $this->email);
    //         $stmt->bindParam(4, $this->contact_no);
    //         $stmt->bindParam(5, $this->password);
    //         $result = $stmt->execute();

    //         if ($result) {
    //             return true;
    //         }
    //         return false;
    //     } catch (PDOException $e) {
    //         http_response_code(500);
    //         echo json_encode(["message" => "Failed to register. " . $e->getMessage()]);
    //     }
    // }
}
