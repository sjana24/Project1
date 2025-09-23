<?php
session_start();

// Allow CORS for localhost:8080 with credentials
$allowedOrigin = "http://localhost:8080";

if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $allowedOrigin) {
    header("Access-Control-Allow-Origin: $allowedOrigin");
    header("Access-Control-Allow-Credentials: true");
}

header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "./Root/Review.php";

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Check admin session
if (!isset($_SESSION['user']) || $_SESSION['user']['user_role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

// Read input data
$data = json_decode(file_get_contents("php://input"), true);
$reviewId = $data['review_id'] ?? null;
$visible = $data['visible'] ?? null;

if (!$reviewId || $visible === null) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

// Toggle review visibility
$review = new Review();
$updated = $review->toggleVisibility($reviewId, $visible);

echo json_encode(["success" => $updated]);
