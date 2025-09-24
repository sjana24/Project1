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
$is_active = $data['is_active'] ?? null;

if (!$reviewId || $is_active === null) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

// Toggle review visibility
$review = new Review();
$response = $review->toggleVisibilityServiceReview($reviewId, $is_active);
if ($response) {
    echo json_encode(["success" => true, "message" => "Review visibility updated"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update review visibility"]);
}

// echo json_encode($response);
