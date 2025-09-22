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
    public function isExistingChatRequest($customer_id, $provider_id){
    $this->customer_id=$customer_id;
    $this->provider_id=$provider_id;
    
        $query = "SELECT COUNT(*) 
              FROM contact_request 
              WHERE customer_id = ? 
              AND provider_id = ? 
              AND status IN ('pending', 'accepted')";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->customer_id);
        $stmt->bindParam(2, $this->provider_id);
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
        $count = $this->isExistingChatRequest($this->customer_id, $this->provider_id, $this->service_id);

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
                    "count" => $count,
                    "message" => "Request send successfully."
                ];
            } catch (PDOException $e) {
                http_response_code(500);
                return [
                    "success" => false,
                    "data" => $count,
                    "message" => "Error send Request: " . $e->getMessage()
                ];
            }
        } else {
            return [
                "success" => false,
                "data" => $count,
                "message" => "Already you are in touch."
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
            WHERE cr.provider_id = ? AND cr.status = 'pending'
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



    public function createConversation($request_id, $customer_id, $provider_id)
    {
        try {
            // Insert into conversation table
            $sql = "INSERT INTO conversation1 (request_id, customer_id, provider_id, is_active) 
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

    // public function OpenConversation($request_id)
    // {
    //     try {
    //         $sql = "
    //             SELECT 
    //                 *
    //             FROM conversation
    //             WHERE request_id = ?
    //             LIMIT 1
    //         ";

    //         $stmt = $this->conn->prepare($sql);
    //         $stmt->execute([$request_id]);

    //         $conversation = $stmt->fetch(PDO::FETCH_ASSOC);

    //         if ($conversation) {
    //             return [
    //                 "success" => true,
    //                 "message" => "Conversation details fetched successfully.",
    //                 "data" => $conversation
    //             ];
    //         } else {
    //             return [
    //                 "success" => false,
    //                 "message" => "No conversation found for the given request ID."
    //             ];
    //         }
    //     } catch (PDOException $e) {
    //         http_response_code(500);
    //         return [
    //             "success" => false,
    //             "message" => "Error fetching conversation: " . $e->getMessage()
    //         ];
    //     }
    // }


    public function OpenConversation($request_id)
    {
        try {
            // Step 1: Get conversation by request_id
            // $sql = "SELECT * FROM conversation WHERE request_id = ? LIMIT 1";
            $sql = "
        SELECT 
    c.*, 
    cu.user_id AS customer_user_id,
    cu_user.username AS customer_username,
    pr.user_id AS provider_user_id,
    pr_user.username AS provider_username
FROM conversation c
LEFT JOIN customer cu ON c.customer_id = cu.customer_id
LEFT JOIN user cu_user ON cu.user_id = cu_user.user_id
LEFT JOIN service_provider pr ON c.provider_id = pr.provider_id
LEFT JOIN user pr_user ON pr.user_id = pr_user.user_id
WHERE c.request_id = ?
LIMIT 1
";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$request_id]);
            $conversation = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$conversation) {
                return [
                    "success" => false,
                    "message" => "No conversation found for the given request ID."
                ];
            }

            $chatSession_id = $conversation['chatSession_id'];

            // Step 2: Fetch messages for that conversation_id
            $msgSql = "
            SELECT 
                message_id, 
                chatSession_id, 
                sender_id, 
                receiver_id, 
                message, 
                is_read, 
                sent_at 
            FROM chat_sessions 
            WHERE chatSession_id = ?
            ORDER BY sent_at ASC
        ";

            $msgStmt = $this->conn->prepare($msgSql);
            $msgStmt->execute([$chatSession_id]);
            $messages = $msgStmt->fetchAll(PDO::FETCH_ASSOC);

            if(empty($messages)){
                

            }
            // Step 3: Return conversation and messages
            return [
                "success" => true,
                "message" => count($messages) > 0 ? "Conversation with messages fetched successfully." : "Start a new conversation.",
                "conversation" => $conversation,
                "messages" => $messages
            ];
        } catch (PDOException $e) {
            http_response_code(500);
            return [
                "success" => false,
                "message" => "Error fetching conversation: " . $e->getMessage()
            ];
        }
    }

//     public function getAllChats($user_id)
//     {
//         try {
//         //     $sql = "
//         //     SELECT 
//         //         cr.contact_id,
//         //         cr.customer_id,
//         //         cr.provider_id,
//         //         cr.service_id,
//         //         cr.status,
//         //         cr.requested_at,
//         //         u1.username AS customer_name,
//         //         u2.username AS provider_name,
//         //         s.name AS service_name
//         //     FROM contact_request cr
//         //     JOIN user u1 ON cr.customer_id = u1.user_id
//         //     JOIN user u2 ON cr.provider_id = u2.user_id
//         //     JOIN service s ON cr.service_id = s.service_id
//         //     WHERE cr.customer_id = ? OR cr.provider_id = ?
//         //     ORDER BY cr.requested_at DESC
//         // ";

//        $sql=" SELECT 
//     cr.contact_id,
//     cr.customer_id,
//     cr.provider_id,
//     cr.service_id,
//     cr.status,
//     cr.requested_at,
//     u1.username AS customer_name,
//     u2.username AS provider_name,
//     s.name AS service_name,
//     COALESCE(
//         JSON_ARRAYAGG(
//             JSON_OBJECT(
//                 'message_id', m.message_id,
//                 'sender_id', m.sender_id,
//                 'receiver_id', m.receiver_id,
//                 'message', m.message,
//                 'is_read', m.is_read,
//                 'sent_at', m.sent_at
//             )
//         ), JSON_ARRAY()
//     ) AS messages
// FROM contact_request cr
// JOIN user u1 ON cr.customer_id = u1.user_id
// JOIN user u2 ON cr.provider_id = u2.user_id
// JOIN service s ON cr.service_id = s.service_id
// LEFT JOIN chat_sessions m ON m.chatSession_id = cr.contact_id
// WHERE cr.customer_id = ? OR cr.provider_id = ?
// GROUP BY cr.contact_id
// ORDER BY cr.requested_at DESC";

//             $stmt = $this->conn->prepare($sql);
//             $stmt->bindParam(1, $user_id, PDO::PARAM_INT);
//             $stmt->bindParam(2, $user_id, PDO::PARAM_INT);
//             $stmt->execute();

//             $chats = $stmt->fetchAll(PDO::FETCH_ASSOC);

//             if ($chats) {
//                 return [
//                     'success' => true,
//                     'chats' => $chats,
//                     'message' => 'Chats fetched successfully.'
//                 ];
//             } else {
//                 return [
//                     'success' => false,
//                     'chats' => [],
//                     'message' => 'No chats found for this user.'
//                 ];
//             }
//         } catch (PDOException $e) {
//             http_response_code(500);
//             return [
//                 'success' => false,
//                 'chats' => [],
//                 'message' => 'Failed to fetch chats. ' . $e->getMessage()
//             ];
//         }
//     }





public function getAllChats($user_id)
{
    try {
//         $sql = "
                 
//         SELECT 
//     c.*, 
//     cu.user_id AS customer_user_id,
//     cu_user.username AS customer_username,
//     pr.user_id AS provider_user_id,
//     pr_user.username AS provider_username
// FROM conversation c
// LEFT JOIN customer cu ON c.customer_id = cu.customer_id
// LEFT JOIN user cu_user ON cu.user_id = cu_user.user_id
// LEFT JOIN service_provider pr ON c.provider_id = pr.provider_id
// LEFT JOIN user pr_user ON pr.user_id = pr_user.user_id

// WHERE c.customer_id = ?


//         ";
$sql="
SELECT 
    c.conversation_id,
    c.customer_id,
    c.provider_id,
    cu.user_id AS customer_user_id,
    cu_user.username AS customer_username,
    pr.user_id AS provider_user_id,
    pr_user.username AS provider_username,
    
    cs.message_id,
    cs.chatSession_id,
    cs.sender_id,
    cs.receiver_id,
    cs.message,
    cs.is_read,
    cs.sent_at

FROM conversation c
LEFT JOIN customer cu ON c.customer_id = cu.customer_id
LEFT JOIN user cu_user ON cu.user_id = cu_user.user_id
LEFT JOIN service_provider pr ON c.provider_id = pr.provider_id
LEFT JOIN user pr_user ON pr.user_id = pr_user.user_id
LEFT JOIN chat_sessions cs ON cs.chatSession_id = c.chatSession_id

WHERE c.chatSession_id = ?
ORDER BY cs.sent_at ASC";


        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $user_id, PDO::PARAM_INT);
        // $stmt->bindParam(2, $user_id, PDO::PARAM_INT);
        $stmt->execute();

        $chats = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            "success" => true,
            "chats" => $chats,
            "message" => count($chats) > 0 ? "Chats fetched successfully." : "No chats found for this user."
        ];
    } catch (PDOException $e) {
        http_response_code(500);
        return [
            "success" => false,
            "chats" => [],
            "message" => "Failed to fetch chats. " . $e->getMessage()
        ];
    }
}
public function getUserConversationsWithMessages1($user_id,$userrole) {
    try {
        // 1️⃣ Fetch all conversations where this user is either customer or provider
        $sql = "
            SELECT 
                c.chatSession_id,
                c.customer_id,
                c.provider_id,
                cu.user_id AS customer_user_id,
                cu_user.username AS receiver_username,
                pr.user_id AS provider_user_id,
                pr_user.username AS sender_username
            FROM conversation c
            LEFT JOIN customer cu ON c.customer_id = cu.customer_id
            LEFT JOIN user cu_user ON cu.user_id = cu_user.user_id
            LEFT JOIN service_provider pr ON c.provider_id = pr.provider_id
            LEFT JOIN user pr_user ON pr.user_id = pr_user.user_id
            WHERE cu.user_id = ? OR pr.user_id = ?
            ORDER BY c.chatSession_id DESC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $user_id, PDO::PARAM_INT);
        $stmt->bindParam(2, $user_id, PDO::PARAM_INT);
        $stmt->execute();

        $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // 2️⃣ For each conversation, fetch its messages
        foreach ($conversations as &$conv) {
            $sqlMessages = "
                SELECT 
                    message_id, 
                    chatSession_id, 
                    sender_id, 
                    receiver_id, 
                    message, 
                    is_read, 
                    sent_at
                FROM chat_sessions
                WHERE chatSession_id = ?
                ORDER BY sent_at ASC
            ";
            $stmtMsg = $this->conn->prepare($sqlMessages);
            $stmtMsg->bindParam(1, $conv['chatSession_id'], PDO::PARAM_INT);
            $stmtMsg->execute();
            $messages = $stmtMsg->fetchAll(PDO::FETCH_ASSOC);

            // Attach messages as an array inside conversation
            $conv['messages'] = $messages;
        }

        return [
            "success" => true,
            "conversations" => $conversations,
            "message" => count($conversations) > 0 
                ? "Conversations with messages fetched successfully." 
                : "No conversations found for this user."
        ];

    } catch (PDOException $e) {
        http_response_code(500);
        return [
            "success" => false,
            "conversations" => [],
            "message" => "Failed to fetch conversations. " . $e->getMessage()
        ];
    }
}


public function getUserConversationsWithMessages($user_id, $userrole) {
    try {
        // 1️⃣ Fetch all conversations where this user is either customer or provider
        $sql = "
            SELECT 
                c.chatSession_id,
                c.customer_id,
                c.provider_id,
                cu.user_id AS customer_user_id,
                cu_user.username AS customer_username,
                pr.user_id AS provider_user_id,
                pr_user.username AS provider_username
            FROM conversation c
            LEFT JOIN customer cu ON c.customer_id = cu.customer_id
            LEFT JOIN user cu_user ON cu.user_id = cu_user.user_id
            LEFT JOIN service_provider pr ON c.provider_id = pr.provider_id
            LEFT JOIN user pr_user ON pr.user_id = pr_user.user_id
            WHERE cu.user_id = ? OR pr.user_id = ?
            ORDER BY c.chatSession_id DESC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $user_id, PDO::PARAM_INT);
        $stmt->bindParam(2, $user_id, PDO::PARAM_INT);
        $stmt->execute();

        $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // 2️⃣ For each conversation, fetch its messages and adjust sender/receiver names
        foreach ($conversations as &$conv) {
            $sqlMessages = "
                SELECT 
                    message_id, 
                    chatSession_id, 
                    sender_id, 
                    receiver_id, 
                    message, 
                    is_read, 
                    sent_at
                FROM chat_sessions
                WHERE chatSession_id = ?
                ORDER BY sent_at ASC
            ";
            $stmtMsg = $this->conn->prepare($sqlMessages);
            $stmtMsg->bindParam(1, $conv['chatSession_id'], PDO::PARAM_INT);
            $stmtMsg->execute();
            $messages = $stmtMsg->fetchAll(PDO::FETCH_ASSOC);

            // Determine the other participant's name based on user role
            if ($userrole === 'customer') {
                // If current user is customer, the other participant is provider
                $conv['other_participant_name'] = $conv['provider_username'];
                $conv['other_participant_id'] = $conv['provider_user_id'];
                $conv['current_user_role'] = 'customer';
            } else if ($userrole === 'service_provider') {
                // If current user is provider, the other participant is customer
                $conv['other_participant_name'] = $conv['customer_username'];
                $conv['other_participant_id'] = $conv['customer_user_id'];
                $conv['current_user_role'] = 'provider';
            } else {
                // For admin or other roles, show both names
                $conv['other_participant_name'] = "Customer: " . $conv['customer_username'] . " | Provider: " . $conv['provider_username'];
                $conv['current_user_role'] = 'admin';
            }

            // Add sender/receiver names to each message based on user role
            foreach ($messages as &$msg) {
                if ($userrole === 'customer') {
                    $msg['sender_name'] = ($msg['sender_id'] == $user_id) ? 'You' : $conv['provider_username'];
                    $msg['receiver_name'] = ($msg['receiver_id'] == $user_id) ? 'You' : $conv['provider_username'];
                } else if ($userrole === 'provider') {
                    $msg['sender_name'] = ($msg['sender_id'] == $user_id) ? 'You' : $conv['customer_username'];
                    $msg['receiver_name'] = ($msg['receiver_id'] == $user_id) ? 'You' : $conv['customer_username'];
                } else {
                    // For admin, show actual usernames
                    if ($msg['sender_id'] == $conv['customer_user_id']) {
                        $msg['sender_name'] = 'Customer: ' . $conv['customer_username'];
                    } else if ($msg['sender_id'] == $conv['provider_user_id']) {
                        $msg['sender_name'] = 'Provider: ' . $conv['provider_username'];
                    } else {
                        $msg['sender_name'] = 'Unknown';
                    }
                    
                    if ($msg['receiver_id'] == $conv['customer_user_id']) {
                        $msg['receiver_name'] = 'Customer: ' . $conv['customer_username'];
                    } else if ($msg['receiver_id'] == $conv['provider_user_id']) {
                        $msg['receiver_name'] = 'Provider: ' . $conv['provider_username'];
                    } else {
                        $msg['receiver_name'] = 'Unknown';
                    }
                }
            }

            // Attach messages as an array inside conversation
            $conv['messages'] = $messages;
        }

        return [
            "success" => true,
            "conversations" => $conversations,
            "message" => count($conversations) > 0 
                ? "Conversations with messages fetched successfully." 
                : "No conversations found for this user."
        ];

    } catch (PDOException $e) {
        http_response_code(500);
        return [
            "success" => false,
            "conversations" => [],
            "message" => "Failed to fetch conversations. " . $e->getMessage()
        ];
    }
}


     // === Insert new message ===
    public function sendMessage($chatSession_id, $sender_id, $receiver_id, $message) {
        $sql =" INSERT INTO chat_sessions
(chatSession_id, sender_id, receiver_id, message, sent_at, is_read)
VALUES (:chatSession_id, :sender_id, :receiver_id, :message, NOW(), 0)";

        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            ':chatSession_id' => $chatSession_id,
            ':sender_id'       => $sender_id,
            // ':sender_role'     => $sender_role,
            ':receiver_id'     => $receiver_id,
            // ':sent_at'   => $sent_atNow,
            ':message'         => $message
        ]);
    }

    // === Mark messages as read for a user ===
    public function markConversationAsRead($chatSession_id, $user_id) {
        $sql = "UPDATE chat_sessions 
                SET is_read = 1 
                WHERE chatSession_id = :chatSession_id AND receiver_id = :user_id";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            ':chatSession_id' => $chatSession_id,
            ':user_id'         => $user_id
        ]);
    }


}
