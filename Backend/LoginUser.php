<?php
// CORS headers
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "./Root/Customer.php";

// Start session (only if not already started)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed. Only POST is accepted."
    ]);
    exit();
}

// Read input data
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

// Validate input
$email = isset($data['email']) ? filter_var($data['email'], FILTER_SANITIZE_EMAIL) : '';
$password = isset($data['password']) ? $data['password'] : ''; // keep password raw
$role = isset($data['role']) ? htmlspecialchars(strip_tags($data['role'])) : '';

if (empty($email) || empty($password) || empty($role)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        "success" => false,
        "message" => "Email, password, and role are required."
    ]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        "success" => false,
        "message" => "Invalid email format."
    ]);
    exit();
}

// Login logic
$userLogin = new Customer();
$loginRes = $userLogin->Login($email, $password, $role);

if ($loginRes['success']) {
    http_response_code(200); // OK
    echo json_encode($loginRes);
} else {
 
    echo json_encode($loginRes);
}
