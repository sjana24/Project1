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
    protected $contact_number;
    protected $disable_status;
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
            $sql = "SELECT admin_id FROM admin WHERE email=?";
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
          public function getAllProviders()
    {
        $status="active";
        $user_role="service_provider";

        try {
            $sql = "SELECT * FROM user WHERE  user_role=:user_role ";
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
    // public function Register($name, $email, $contact_number, $password)
    // {
    //     $this->name = $name;
    //     $this->email = $email;
    //     $this->contact_number = $contact_number;
    //     $this->password = $password;


    //     try {
    //         $sql = "INSERT INTO customer (customer_id, name, email, contact_number, password) VALUES ( ?, ?, ?, ?, ?)";
    //         $stmt = $this->conn->prepare($sql);
    //         $stmt->bindParam(1, $this->id);
    //         $stmt->bindParam(2, $this->name);
    //         $stmt->bindParam(3, $this->email);
    //         $stmt->bindParam(4, $this->contact_number);
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
