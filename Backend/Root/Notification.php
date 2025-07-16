<?php
require_once "dbCon.php";

class Notification
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
    n.notification_id, 
    n.reciver_id, 
    n.user_type, 
    n.title, 
    n.message, 
    n.is_read, 
    n.created_at, 
    n.sender_id,
    u.username AS sender_name

FROM notification n

-- Join with customer table (if sender is a customer)
LEFT JOIN customer c ON n.user_type = 'customer' AND n.sender_id = c.customer_id

-- Join with provider table (if sender is a provider)
LEFT JOIN service_provider p ON n.user_type = 'service_provider' AND n.sender_id = p.provider_id

-- Join with user table using user_id from role tables
LEFT JOIN user u ON 
    (n.user_type = 'customer' AND c.user_id = u.user_id) OR 
    (n.user_type = 'service_provider' AND p.user_id = u.user_id)

WHERE n.reciver_id = ? AND n.is_read = 0

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

    public function insertNotificationStatusCustomer($contact_id,$user_role, $status, $user_id, $success, $sender_id)
    {
        try {
            // Only insert notification if status is 'accepted'
            if (strtolower($status) !== 'accepted') {
                return [
                    "success" => false,
                    "message" => "Notification not created. Status is not 'accepted'."
                ];
            }

            // Optional: Auto-generate created_at and is_read = 0 (unread)
            $sql = "INSERT INTO notification (reciver_id,user_type, title, message, is_read, created_at, sender_id) 
                VALUES (?, ?, ?, ?, 0, NOW(), ?)";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                $user_id,
                $user_role,
                "Request Accepted",
                "Your contact request has been accepted.",
                $sender_id
            ]);

            return [
                "success" => true,
                "message" => "Notification inserted successfully."
            ];
        } catch (PDOException $e) {
            return [
                "success" => false,
                "message" => "Error inserting notification: " . $e->getMessage()
            ];
        }
    }
}
