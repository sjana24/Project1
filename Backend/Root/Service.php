<?php

require_once 'dbCon.php';
class Service{

    protected $service_id;
    protected $provider_id;
    protected $name;
    protected $description;
    protected $price;
    protected $category;
    protected $images;
    protected $conn;

    public function __construct()
    {
        $dbObj=new Database;
        $this->conn=$dbObj->connect();   
    }

     public function getAllServices(){

        try {
            $sql = "SELECT * FROM service";
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
     public function getAllServicesAdmin(){

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

}