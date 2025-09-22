<?php
session_start();

// === Headers ===
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// === Handle preflight ===
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "./Root/Chat.php";

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized: User not logged in."]);
    exit();
}

$user = $_SESSION['user'];
$sender_id   = $user['user_id'] ?? null;
$sender_role = $user['user_role'] ?? null;

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['chatSession_id'], $data['receiver_id'], $data['sender_id'], $data['message'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Bad request: Missing required fields."]);
    exit();
}

$chatSession_id = htmlspecialchars(strip_tags($data['chatSession_id']));
$receiver_id     = htmlspecialchars(strip_tags($data['receiver_id']));
// $sent_at   = htmlspecialchars(strip_tags($data['sent_at']));
$message         = trim($data['message']);

try {
    $chat = new Chat();
    $res = $chat->sendMessage($chatSession_id, $sender_id, $receiver_id, $message);

    if ($res) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Message sent successfully"]);
        exit();
    }

    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Failed to send message"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
