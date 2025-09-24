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
$sql="SELECT 
    u.*,    
    c.*
FROM user u
JOIN customer c ON u.user_id = c.user_id
WHERE u.user_role = :user_role";

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

    public function getAdminData($admin_id)
    {
        $this->admin_id = $admin_id;
        try {
    // $db = new Database();
    // $conn = $db->connect();

    // Total Users
    $totalUsers = $this->conn->query("SELECT COUNT(*) AS count FROM user")->fetch(PDO::FETCH_ASSOC)['count'];

    // Active Users (not blocked)
    $activeUsers = $this->conn->query("SELECT COUNT(*) AS count FROM user WHERE is_blocked = 0")->fetch(PDO::FETCH_ASSOC)['count'];

    // Providers
    $totalProviders = $this->conn->query("SELECT COUNT(*) AS count FROM user WHERE user_role = 'service_provider'")->fetch(PDO::FETCH_ASSOC)['count'];
    $blockedProviders = $this->conn->query("SELECT COUNT(*) AS count FROM user WHERE user_role = 'service_provider' AND is_blocked = '1'")->fetch(PDO::FETCH_ASSOC)['count'];

    // Products
    $totalProducts = $this->conn->query("SELECT COUNT(*) AS count FROM product")->fetch(PDO::FETCH_ASSOC)['count'];
    $activeProducts = $this->conn->query("SELECT COUNT(*) AS count FROM product WHERE is_approved = 1 AND is_delete = 0")->fetch(PDO::FETCH_ASSOC)['count'];

    // Services
    $totalServices = $this->conn->query("SELECT COUNT(*) AS count FROM service")->fetch(PDO::FETCH_ASSOC)['count'];
    $activeServices = $this->conn->query("SELECT COUNT(*) AS count FROM service WHERE is_approved=1 AND is_active = 1 AND is_delete = 0")->fetch(PDO::FETCH_ASSOC)['count'];

    // Revenue (sum of successful payments)
    $totalRevenue = $this->conn->query("SELECT COALESCE(SUM(amount), 0) AS sum FROM payment WHERE status = 'completed'")->fetch(PDO::FETCH_ASSOC)['sum'];

    // Recent Orders (last 5)
    $recentOrders = $this->conn->query("
        SELECT o.order_id, c.customer_id, u.username AS customer, o.total_amount, o.status, o.order_date
        FROM `order` o
        JOIN customer c ON o.customer_id = c.customer_id
        JOIN user u ON c.user_id = u.user_id
        ORDER BY o.order_date DESC
        LIMIT 5
    ")->fetchAll(PDO::FETCH_ASSOC);

    // Recent Customers (last 5)
    $recentCustomers = $this->conn->query("
        SELECT c.customer_id AS id, u.username AS name, u.email, u.created_at AS joinDate
        FROM customer c
        JOIN user u ON c.user_id = u.user_id
        ORDER BY u.created_at DESC
        LIMIT 5
    ")->fetchAll(PDO::FETCH_ASSOC);

    // Recent Providers (last 5)
    $recentProviders = $this->conn->query("
        SELECT sp.provider_id AS id, u.username AS name, u.email, sp.company_name AS company,
               sp.verification_status AS status, u.created_at AS joinDate
        FROM service_provider sp
        JOIN user u ON sp.user_id = u.user_id
        ORDER BY u.created_at DESC
        LIMIT 5
    ")->fetchAll(PDO::FETCH_ASSOC);

    return([
        "success" => true,
        "stats" => [
            "totalUsers" => (int)$totalUsers,
            "activeUsers" => (int)$activeUsers,
            "totalProviders" => (int)$totalProviders,
            "pendingProviders" => (int)$blockedProviders,
            "totalProducts" => (int)$totalProducts,
            "activeProducts" => (int)$activeProducts,
            "totalServices" => (int)$totalServices,
            "activeServices" => (int)$activeServices,
            "totalRevenue" => (float)$totalRevenue,
        ],
        "recentOrders" => $recentOrders,
        "recentCustomers" => $recentCustomers,
        "recentProviders" => $recentProviders,
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage(),
    ]);
    } 
}  







 public function getAllAdminOrders() 
 {
        $data = [];

        // ------------------------
        // 1. Product Orders with multiple items
        // ------------------------
        $sqlProductOrders = "
            SELECT 
                o.order_id,
                CONCAT('ORD-', YEAR(o.order_date), '-', LPAD(o.order_id, 3, '0')) AS orderNumber,
                u.username AS customerName,
                u.email AS customerEmail,
                o.status,
                o.order_date,
                pr.product_id,
                pr.name AS productName,
                pr.images AS productImage,
                pr.price,
                oi.quantity,
                (oi.quantity * pr.price) AS itemTotal
            FROM `order` o
            JOIN user u ON o.customer_id = u.user_id
            JOIN order_item oi ON o.order_id = oi.order_id
            JOIN product pr ON oi.product_id = pr.product_id
            ORDER BY o.order_id DESC
        ";

        $stmt = $this->conn->prepare($sqlProductOrders);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $productOrders = [];
        foreach ($rows as $row) {
            $id = $row['order_id'];
            if (!isset($productOrders[$id])) {
                $productOrders[$id] = [
                    "id" => $id,
                    "orderNumber" => $row['orderNumber'],
                    "customerName" => $row['customerName'],
                    "customerEmail" => $row['customerEmail'],
                    "status" => $row['status'],
                    "orderDate" => $row['order_date'],
                    "items" => [],
                    "visible" => true
                ];
            }

            $productOrders[$id]["items"][] = [
                "productId" => $row["product_id"],
                "productName" => $row["productName"],
                "productImage" => $row["productImage"],
                "price" => (float) $row["price"],
                "quantity" => (int) $row["quantity"],
                "total" => (float) $row["itemTotal"]
            ];
        }

        // Reset keys (from associative to indexed array)
        $data['productOrders'] = array_values($productOrders);

        // ------------------------
        // 2. Project Orders (with start + due date)
        // ------------------------
        $sqlProjectOrders = "
            SELECT 
    op.project_id AS id,
    CONCAT('PRJ-', YEAR(op.start_date), '-', LPAD(op.project_id, 3, '0')) AS orderNumber,
    u.username AS customerName,
    u.email AS customerEmail,
    op.project_name AS projectTitle,
    op.status,
    p.status AS projectStatus,
    sp.company_name AS providerName,
    op.start_date,
    op.due_date
FROM ongoing_project op
JOIN service_request sr ON op.request_id = sr.request_id
JOIN service s ON sr.service_id = s.service_id
JOIN service_provider sp ON s.provider_id = sp.provider_id
JOIN user u ON sr.customer_id = u.user_id
LEFT JOIN service_payment p ON op.request_id = p.request_id
ORDER BY op.project_id DESC";


        $stmt = $this->conn->prepare($sqlProjectOrders);
        $stmt->execute();
        $projectOrders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($projectOrders as &$proj) {
            $proj['visible'] = true;
            $proj['startDate'] = $proj['start_date'];
            $proj['dueDate'] = $proj['due_date'];
            unset($proj['start_date'], $proj['estimated_completion']);
        }

        $data['projectOrders'] = $projectOrders;

        return $data;
    }
}
