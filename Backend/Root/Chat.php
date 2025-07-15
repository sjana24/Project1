<?php
require_once "dbCon.php";

class Chat
{
    protected $service_id;
    protected $customer_id;
    protected $provider_id;

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
     public function getAllNotificationCustomer($user_id)
    {

       try {
    $sql = "
        SELECT 
            notification_id, 
            user_id, 
            user_type, 
            title, 
            message, 
            is_read, 
            created_at, 
            sender_id 
        FROM notification 
        WHERE user_id = ?
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(1, $user_id);
    $stmt->execute();

    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($notifications) {
        return [
            'success' => true,
            'notifications' => $notifications,
            'message' => 'Notifications fetched successfully.'
        ];
    } else {
        return [
            'success' => false,
            'message' => 'No notifications found for the given user.'
        ];
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to fetch notifications. " . $e->getMessage()]);
    return [
        'success' => false,
        'message' => 'Failed to fetch notifications. ' . $e->getMessage()
    ];
}

    }


    public function sendRequestContactCustomer($service_id,$customer_id,$provider_id){
        $this->service_id = $service_id;
        $this->customer_id = $customer_id;
        $this->provider_id = $provider_id;


        //  is existing check pannum
        $count = $this->isExistingChatRequest();

        if (0==$count) {

            try {
                $sql = "INSERT INTO contact_request (customer_id,provider_id,service_id) VALUES (?, ?, ?)";

                $stmt = $this->conn->prepare($sql);
                
                $stmt->execute([
                    $this->customer_id,
                    $this->provider_id,
                    $this->service_id
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