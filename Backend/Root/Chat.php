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
    public function getAllChatProvider($provider_id)
{
    try {
        $sql = "
            SELECT 
                cr.contact_id,
                cr.customer_id,
                cr.provider_id,
                cr.service_id,
                cr.status,
                cr.requested_at,
                u.username AS customer_name,
                c.contact_number AS customer_phone,
                u.email AS customer_email,
                s.name AS service_name
            FROM contact_request cr
            JOIN user u ON cr.customer_id = u.user_id
            JOIN customer c ON cr.customer_id = c.customer_id
            JOIN service s ON cr.service_id = s.service_id
            WHERE cr.provider_id = ?
            ORDER BY cr.requested_at DESC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $provider_id, PDO::PARAM_INT);
        $stmt->execute();

        $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($requests) {
            return [
                'success' => true,
                'requests' => $requests,
                'message' => 'Requests fetched successfully.'
            ];
        } else {
            return [
                'success' => false,
                'requests' => [],
                'message' => 'No requests found for this provider.'
            ];
        }
    } catch (PDOException $e) {
        http_response_code(500);
        return [
            'success' => false,
            'requests' => [],
            'message' => 'Failed to fetch requests. ' . $e->getMessage()
        ];
    }
}

public function ManageChatProvider($contact_id, $new_status)
{
    try {
        // Prepare the SQL update statement
        $sql = "UPDATE contact_request SET status = ? WHERE contact_id = ?";
        $stmt = $this->conn->prepare($sql);

        // Execute with bound parameters
        $stmt->execute([$new_status, $contact_id]);

        if ($stmt->rowCount() > 0) {
            return [
                "success" => true,
                "message" => "Status updated successfully.",
                "contact_id" => $contact_id,
                "status" => $new_status
            ];
        } else {
            return [
                "success" => false,
                "message" => "No record updated. Contact ID may not exist or status already set.",
                "contact_id" => $contact_id,
                "status" => $new_status
            ];
        }
    } catch (PDOException $e) {
        return [
            "success" => false,
            "message" => "Error updating status: " . $e->getMessage(),
            "contact_id" => $contact_id
        ];
    }
}

// public function createConversation($contact_id, $customer_id, $user_id){


public function createConversation($request_id, $customer_id, $provider_id)
{
    try {
        // Insert into conversation table
        $sql = "INSERT INTO conversation (request_id, customer_id, provider_id, is_active) 
                VALUES (?, ?, ?, ?)";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            $request_id,
            $customer_id,
            $provider_id,
            true // is_active = true (default to active conversation)
        ]);

        return [
            "success" => true,
            "message" => "Conversation created successfully.",
            "conversation_request_id" => $request_id
        ];
    } catch (PDOException $e) {
        http_response_code(500);
        return [
            "success" => false,
            "message" => "Error creating conversation: " . $e->getMessage()
        ];
    }
}

public function OpenConversation($request_id)
{
    try {
        $sql = "
            SELECT 
                *
            FROM conversation
            WHERE request_id = ?
            LIMIT 1
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$request_id]);

        $conversation = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($conversation) {
            return [
                "success" => true,
                "message" => "Conversation details fetched successfully.",
                "data" => $conversation
            ];
        } else {
            return [
                "success" => false,
                "message" => "No conversation found for the given request ID."
            ];
        }
    } catch (PDOException $e) {
        http_response_code(500);
        return [
            "success" => false,
            "message" => "Error fetching conversation: " . $e->getMessage()
        ];
    }
}


// public function OpenConversation($request_id)
// {
//     try {
//         // Step 1: Get conversation by request_id
//         $sql = "SELECT * FROM conversation WHERE request_id = ? LIMIT 1";
//         $stmt = $this->conn->prepare($sql);
//         $stmt->execute([$request_id]);
//         $conversation = $stmt->fetch(PDO::FETCH_ASSOC);

//         if (!$conversation) {
//             return [
//                 "success" => false,
//                 "message" => "No conversation found for the given request ID."
//             ];
//         }

//         $conversation_id = $conversation['conversation_id'];

//         // Step 2: Fetch messages for that conversation_id
//         $msgSql = "
//             SELECT 
//                 message_id, 
//                 conversation_id, 
//                 sender_id, 
//                 receiver_id, 
//                 message, 
//                 is_read, 
//                 sent_at 
//             FROM chat_sessions 
//             WHERE conversation_id = ?
//             ORDER BY sent_at ASC
//         ";

//         $msgStmt = $this->conn->prepare($msgSql);
//         $msgStmt->execute([$conversation_id]);
//         $messages = $msgStmt->fetchAll(PDO::FETCH_ASSOC);

//         // Step 3: Return conversation and messages
//         return [
//             "success" => true,
//             "message" => count($messages) > 0 ? "Conversation with messages fetched successfully." : "Start a new conversation.",
//             "conversation" => $conversation,
//             "messages" => $messages
//         ];

//     } catch (PDOException $e) {
//         http_response_code(500);
//         return [
//             "success" => false,
//             "message" => "Error fetching conversation: " . $e->getMessage()
//         ];
//     }
// }





}
