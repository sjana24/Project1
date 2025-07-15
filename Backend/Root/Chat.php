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
    // public function isExistingRequest($customer_id,$provider_id)
    // {
    //     $query = "SELECT COUNT(*) FROM user WHERE email = ? AND user_role = ?";
    //     $stmt = $this->conn->prepare($query);
    //       $stmt->bindParam(1, $email);
    //         $stmt->bindParam(2, $user_role);
    //     $stmt->execute();

    //     $count = $stmt->fetchColumn();
    //     return $count > 0;
    // }
public function isExistingChatRequest($customer_id, $provider_id, $service_id)
{
    $query = "SELECT COUNT(*) 
              FROM contact_request 
              WHERE customer_id = ? 
              AND provider_id = ? 
              AND service_id = ? 
              AND status IN ('pending', 'accepted')";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $customer_id);
    $stmt->bindParam(2, $provider_id);
    $stmt->bindParam(3, $service_id);
    $stmt->execute();

    $count = $stmt->fetchColumn();
    return $count > 0; // returns true if such a request exists
}





    public function sendRequestContactCustomer($service_id, $customer_id, $provider_id)
    {
        $this->service_id = $service_id;
        $this->customer_id = $customer_id;
        $this->provider_id = $provider_id;


        //  is existing check pannum
        $count = $this->isExistingChatRequest($this->customer_id,$this->provider_id,$this->service_id);

        if ($count === false) {

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
                    "count"=>$count,
                    "message" => "Request send successfully."
                ];
            } catch (PDOException $e) {
                http_response_code(500);
                return [
                    "success" => false,
                    "data"=>$count,
                    "message" => "Error send Request: " . $e->getMessage()
                ];
            }
        } else {
            return [
                "success" => false,
                "data"=>$count,
                "message" => "Error send Request."
            ];
        }
    }
}
