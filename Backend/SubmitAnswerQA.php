<?php
session_start();

// Allow cross-origin requests from your frontend
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include QA class
require_once "./Root/QA.php";

// Helper function to sanitize input
function sanitize_input($data)
{
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Validate session
if (!isset($_SESSION['user'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Unauthorized. Please login first.'
    ]);
    http_response_code(401);
    exit();
}

// Only allow service providers
$user_role = $_SESSION['user']['user_role'] ?? '';
$user_id = $_SESSION['user']['user_id'] ?? '';
if ($user_role === "customer") {
    echo json_encode([
        'success' => false,
        'error' => 'Access denied. You do not have permission.'
    ]);
    http_response_code(403);
    exit();
}

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode([
        'success' => false,
        'error' => 'Invalid JSON input.'
    ]);
    http_response_code(400);
    exit();
}

// Validate required fields
$qa_id = isset($data['qa_id']) ? intval($data['qa_id']) : 0;
$answer = isset($data['answer']) ? sanitize_input($data['answer']) : '';

$errors = [];
if ($qa_id <= 0) $errors[] = "Invalid QA ID.";
if ($answer === '') $errors[] = "Answer cannot be empty.";

if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'errors' => $errors
    ]);
    http_response_code(422);
    exit();
}

// Call QA class to update the answer
$qa = new QA();
$response = $qa->updateAnswer($qa_id, $_SESSION['user']['user_id'], $answer);

// Return response
echo json_encode($response);
