<?php
session_start();

// === Headers ===
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// === Handle preflight ===
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "./Root/Chat.php";
require_once "./Root/Notification.php";

// === Ensure user is logged in ===
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized: User not logged in."
    ]);
    exit();
}

$user = $_SESSION['user'];
$user_id = $user['user_id'] ?? null;
$user_role = $user['user_role'] ?? null;
$user_name = $user['user_name'] ?? "Unknown";

// Only providers can manage
if ($user_role !== "service_provider") {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "message" => "Forbidden: Only service providers can manage chat requests."
    ]);
    exit();
}

// === Read input JSON ===
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['request_id'], $data['customer_id'], $data['status'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Bad request: Missing required fields."
    ]);
    exit();
}

$request_id = htmlspecialchars(strip_tags($data['request_id']));
$customer_id = htmlspecialchars(strip_tags($data['customer_id']));
$status = htmlspecialchars(strip_tags($data['status']));

// === Main logic ===
try {
    $chat = new Chat();
    $notify = new Notification();

    $response = $chat->ManageChatProvider($request_id, $status);

    if (!$response || !isset($response['success'], $response['status'], $response['contact_id'])) {
        throw new Exception("Invalid response from ManageChatProvider.");
    }

    $contact_id = $response['contact_id'];
    $success = $response['success'];
    $newStatus = $response['status'];

    if ($success && $newStatus === "accepted") {
        // $res1 = $notify->insertNotification(
        //     // $contact_id,
        //     $user_role,
        //     $newStatus,
        //     $customer_id,
        //     $success,
        //     $user_id
        // );

         $res1=$notify->insertNotification($response['customer_id'],$user_role,"Contact request status","Your contact request '$newStatus' successfully by the service provider.",$user_id);
          
        $res2 = $chat->createConversation($contact_id, $customer_id, $user_id);
        // $resNotify=

        if ($res1 && $res2) {
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Request accepted"
            ]);
            exit();
        }
    }

    if ($success && $newStatus === "rejected") {
        $res = $notify->insertNotificationStatusCustomer(
            $contact_id,
            $user_role,
            $newStatus,
            $customer_id,
            $success,
            $user_id
        );
        if ($res) {
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Request rejected"
            ]);
            exit();
        }
    }

    // If it reaches here → failure
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Request failed"
    ]);
    exit();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
    exit();
}
