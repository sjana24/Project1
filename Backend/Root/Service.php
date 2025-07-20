<?php

require_once 'dbCon.php';
class Service
{

    protected $service_id;
    protected $provider_id;
    protected $name;
    protected $description;
    protected $price;
    protected $category;
    protected $images;
    protected $conn;
    protected $request_id;
   protected $customer_id;
   protected $request_date;
   protected $status; 
   protected $payment_status;
   protected $created_at;
   protected $updated_at;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }

    public function getAllServices()
    {

        try {
            $sql = "SELECT 
            s.*, 
            u.username AS provider_name,
            sp.company_name AS company_name
            FROM 
            service s
            JOIN 
            service_provider sp ON s.provider_id = sp.provider_id
            JOIN 
            user u ON sp.user_id = u.user_id";

            $stmt = $this->conn->prepare($sql);

            $stmt->execute();
            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($services) {
                return [
                    'success' => true,
                    'services' => $services,
                    'message' => 'Services fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No products found.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all services. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch services. ' . $e->getMessage()
            ];
        }
    }
    public function getAllServicesAdmin()
    {

        try {
            $sql = "SELECT * FROM service ";
            $stmt = $this->conn->prepare($sql);

            $stmt->execute();
            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($services) {
                return [
                    'success' => true,
                    'services' => $services,
                    'message' => 'Services fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No products found.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all services. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch services. ' . $e->getMessage()
            ];
        }
    }

    public function getAllServicesProvider($provider_id)
    {

        try {
            $sql = "SELECT * FROM service WHERE  provider_id=:provider_id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':provider_id', $provider_id);
            $stmt->execute();
            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($services) {
                return [
                    'success' => true,
                    'services' => $services,
                    'message' => 'Services fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No services found.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all services. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch services. ' . $e->getMessage()
            ];
        }
    }

    public function insertServiceRequest( $customer_id, $provider_id, $service_id)
{
    // $this->request_id = $request_id;
    $this->customer_id = $customer_id;
    $this->provider_id = $provider_id;
    $this->service_id = $service_id;
    // $this->request_date = $request_date;
    // $this->status = $status;
    // $this->payment_status = $payment_status;
    // $this->created_at = $created_at;
    // $this->updated_at = $updated_at;

    try {
        $sql = "INSERT INTO service_request ( customer_id, provider_id, service_id, request_date, status, payment_status, created_at, updated_at)
                VALUES ( ?, ?, NOW(), ?, 'pending', 'pending', NOW(), NOW())";
        $stmt = $this->conn->prepare($sql);
        $result = $stmt->execute([
            // $this->request_id,
            (int)$this->customer_id,
            (int)$this->provider_id,
           (int) $this->service_id,
            // $this->request_date,
            // $this->status,
            // $this->payment_status,
            // $this->created_at,
            // $this->updated_at
        ]);

        if ($result) {
            return true;
        }
        return false;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to insert request. " . $e->getMessage()]);
    }
}



}
