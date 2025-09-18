<?php
// session_start();

// --- CORS headers ---
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "./Root/Contact.php"; // if you plan to save contact messages

// --- Handle preflight (OPTIONS) ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Ensure user is logged in ---
// if (!isset($_SESSION['user'])) {
//     http_response_code(401);
//     echo json_encode([
//         "success" => false,
//         "message" => "You need to login first."
//     ]);
//     exit();
// }

// $user_name = $_SESSION['user']['user_name'] ?? '';
// $user_id   = $_SESSION['user']['user_id'] ?? '';
// $user_role = $_SESSION['user']['user_role'] ?? '';

if ($user_role !== "customer") {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "message" => "Only customers can send messages, not $user_role."
    ]);
    exit();
}

// --- Get raw JSON input ---
$data = json_decode(file_get_contents("php://input"), true);

// --- Basic sanitization helper ---
function sanitize($value) {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

// --- Extract + sanitize ---
$full_name = sanitize($data['full_name'] ?? '');
$email     = sanitize($data['email'] ?? '');
$subject   = sanitize($data['subject'] ?? '');
$message   = sanitize($data['message'] ?? '');

// --- Validation ---
$errors = [];

if (!preg_match("/^[A-Za-z., ]+$/", $full_name)) {
    $errors[] = "Full name must contain only letters, spaces, commas, and periods.";
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email address.";
}

if (strlen($subject) < 3) {
    $errors[] = "Subject must be at least 3 characters.";
}

if (strlen($message) < 10) {
    $errors[] = "Message must be at least 10 characters.";
}

// --- If validation failed ---
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "errors"  => $errors
    ]);
    exit();
}

// --- Example: save to DB / Contact.php ---
try {
    $contact = new Contact();
    $result = $contact->customerQueryInsert( $full_name, $email, $subject, $message);

    if ($result) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Message sent successfully."
        ]);
    } else {
        throw new Exception("DB insert failed.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error while saving message.",
        "error"   => $e->getMessage()
    ]);
}
