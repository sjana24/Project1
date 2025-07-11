<?php
require_once "dbCon.php";

class Chat
{
    protected $service_id;
    protected $customer_id;

     protected $conn;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }
       public function isExistingChatRequest()
    {
        // ellam mathanum jst sample data ellame
        // $query = "SELECT COUNT(*) FROM product WHERE product_id = ? AND provider_id = ?";
        // $stmt = $this->conn->prepare($query);
        // $stmt->bindParam(1, $this->product_id);
        // $stmt->bindParam(2, $this->provider_id);
        // $stmt->execute();

        // $count = $stmt->fetchColumn();
        // return $count > 0;
    }


    public function sendRequestContactCustomer($service_id,$customer_id){
        $this->service_id = $service_id;
        $this->customer_id = $customer_id;


        //  is existing check pannum
        $count = $this->isExistingChatRequest();

        if (0==$count) {

            try {
                $sql = "INSERT INTO product (service_id, customer_id) VALUES (?, ?)";

                $stmt = $this->conn->prepare($sql);
                
                $stmt->execute([
                    $this->service_id,
                    $this->customer_id
                ]);

                return [
                    "success" => true,
                    "message" => "Request send successfully."
                ];
            } catch (PDOException $e) {
                http_response_code(500);
                return [
                    "success" => false,
                    "message" => "Error send Request: " . $e->getMessage()
                ];
            }
        }
        else{
             return [
                    "success" => false,
                    "message" => "Error send Request."
                ];
        }
    


    }
}