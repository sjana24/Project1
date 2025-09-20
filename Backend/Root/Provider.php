<?php
require_once 'dbCon.php';

class Provider
{
    protected $provider_id;
    protected $name;
    protected $email;
    protected $password;
    protected $contact_no;
    protected $comapany_name;
    protected $business_reg_no;
    protected $company_description;
    protected $address;
    protected $district;
    protected $website;
    protected $profile_image;
    protected $approval_status;
    protected $status;
    protected $conn;

    public function __construct()
    {

        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }

    public function Login($email, $password)
    {
        $this->email = $email;
        $this->password = $password;

        try {
            $sql = "SELECT provider_id,password FROM service_provider WHERE email=?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(1, $this->email);
            $stmt->execute();
            $provider = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($provider && ($this->password === $provider['password'])) {
                // if ($user['disable_status'] === 'disabled') {
                //     return ['success' => false, 'message' => 'Your account has been disabled. Please contact support.'];
                // }

                $this->provider_id = $provider['provider_id'];


                return ['provider_id' => $this->provider_id, 'success' => true, 'message' => 'Login Successful...'];
            } else {
                return ["success" => false, "message" => "Incorrect email or password..."];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to login. " . $e->getMessage()]);
        }
    }
    public function Register($name, $email, $contact_no, $password)
    {
        $this->name = $name;
        $this->email = $email;
        $this->contact_no = $contact_no;
        $this->password = $password;


        try {
            $sql = "INSERT INTO service_provider () VALUES ( ?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($sql);
            // $stmt->bindParam(1, $this->id);
            // $stmt->bindParam(2, $this->name);
            // $stmt->bindParam(3, $this->email);
            // $stmt->bindParam(4, $this->contact_no);
            // $stmt->bindParam(5, $this->password);
            $result = $stmt->execute();

            if ($result) {
                return true;
            }
            return false;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to register. " . $e->getMessage()]);
        }
    }

    // public function getProviderData($provider_id){
    //     $this->provider_id=$provider_id;    
    // }

    public function getProviderData1($provider_id)
    {
        $this->provider_id = $provider_id;

        try {
            // ✅ 1. Get provider info
            $stmt = $this->conn->prepare("SELECT * FROM service_provider WHERE provider_id = :provider_id");
            $stmt->execute([':provider_id' => $this->provider_id]);
            $provider = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$provider) {
                return ["success" => false, "message" => "Provider not found"];
            }

            // ✅ 2. Get products
            $stmt = $this->conn->prepare("SELECT * FROM product WHERE provider_id = :provider_id AND is_delete = 0");
            $stmt->execute([':provider_id' => $provider_id]);
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ 3. Get services
            $stmt = $this->conn->prepare("SELECT * FROM service WHERE provider_id = :provider_id AND is_delete = 0");
            $stmt->execute([':provider_id' => $provider_id]);
            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ 4. Get orders (join order_items if you want more details)
            $stmt = $this->conn->prepare("SELECT * FROM `order` WHERE provider_id = :provider_id");
            $stmt->execute([':provider_id' => $provider_id]);
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ 5. Get related users (customers who ordered from this provider)
            $stmt = $this->conn->prepare("
            SELECT DISTINCT u.* 
            FROM user u
            JOIN `order` o ON o.customer_id = u.user_id
            WHERE o.provider_id = :provider_id
        ");
            $stmt->execute([':provider_id' => $provider_id]);
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ 6. Get ongoing projects
            $stmt = $this->conn->prepare("SELECT * FROM ongoing_project WHERE request_id = :provider_id");
            $stmt->execute([':provider_id' => $provider_id]);
            $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ Final Response
            return [
                "success" => true,
                "provider" => $provider,
                "products" => $products,
                "services" => $services,
                "orders" => $orders,
                "users" => $users,
                "projects" => $projects,
            ];
        } catch (Exception $e) {
            return ["success" => false, "message" => $e->getMessage()];
        }
    }
    public function getProviderData($provider_id)
    {
        $this->provider_id = $provider_id;

        try {
            // ✅ Provider info (assuming you have a service_provider table)
            $stmt = $this->conn->prepare("SELECT * FROM service_provider WHERE provider_id = :provider_id");
            $stmt->execute([':provider_id' => $provider_id]);
            $provider = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$provider) {
                return ["success" => false, "message" => "Provider not found"];
            }

            // ✅ Products by provider
            $stmt = $this->conn->prepare("SELECT * FROM product WHERE provider_id = :provider_id AND is_delete = 0");
            $stmt->execute([':provider_id' => $provider_id]);
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ Services by provider
            $stmt = $this->conn->prepare("SELECT * FROM service WHERE provider_id = :provider_id AND is_delete = 0");
            $stmt->execute([':provider_id' => $provider_id]);
            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ Orders related to provider (via product → order_items)
            $stmt = $this->conn->prepare("
            SELECT DISTINCT o.*
            FROM `order` o
            JOIN order_item oi ON oi.order_id = o.order_id
            JOIN product p ON p.product_id = oi.product_id
            WHERE p.provider_id = :provider_id
        ");
            $stmt->execute([':provider_id' => $provider_id]);
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ Users who ordered provider's products
            $stmt = $this->conn->prepare("
            SELECT DISTINCT u.*
            FROM user u
            JOIN `order` o ON o.customer_id = u.user_id
            JOIN order_item oi ON oi.order_id = o.order_id
            JOIN product p ON p.product_id = oi.product_id
            WHERE p.provider_id = :provider_id
        ");
            $stmt->execute([':provider_id' => $provider_id]);
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ Ongoing projects linked to provider
            $stmt = $this->conn->prepare("
                SELECT op.*
                FROM ongoing_project op
                JOIN service_request sr ON sr.request_id = op.request_id
                JOIN service s ON s.service_id = sr.service_id
                WHERE s.provider_id = :provider_id
            ");
            $stmt->execute([':provider_id' => $provider_id]);
            $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                "success"   => true,
                "provider"  => $provider,
                "products"  => $products,
                "services"  => $services,
                "orders"    => $orders,
                "users"     => $users,
                "projects"  => $projects,
            ];
        } catch (Exception $e) {
            return ["success" => false, "message" => $e->getMessage()];
        }
    }
}
