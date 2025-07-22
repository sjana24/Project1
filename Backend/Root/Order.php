<?php
require_once "dBCon.php";

class Order{
    protected $conn;
    protected $customer_id;

    public function __construct(){
         $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }



    public function GetOrdersCustomer($customer_id){
        $this->customer_id=$customer_id;
         try {
            $sql = "SELECT * FROM `order` WHERE customer_id=:customer_id";
            // $sql = "SELECT * FROM service WHERE  provider_id=:provider_id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':customer_id', $this->customer_id);

            // $stmt = $this->conn->prepare($sql);

            $stmt->execute();
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($orders) {
                return [
                    'success' => true,
                    'orders' => $orders,
                    'message' => 'Orders fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No Orders found.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all orders. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch orders. ' . $e->getMessage()
            ];
        }
    }
} 