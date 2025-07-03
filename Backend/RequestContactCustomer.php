<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// echo "hi";
require_once "./Root/Service.php";

// Get JSON input and decode it as an associative array
$data = json_decode(file_get_contents("php://input"), true);


// Sanitize each expected field
$service_id = intval($data['service_id'] ?? 0);
$provider_id = intval($data['provider_id'] ?? 0);
$name = htmlspecialchars(strip_tags($data['name'] ?? ''));
$description = htmlspecialchars(strip_tags($data['description'] ?? ''));
$price = floatval($data['price'] ?? 0);
$category = htmlspecialchars(strip_tags($data['category'] ?? ''));
// $specifications = htmlspecialchars(strip_tags($data['specifications'] ?? ''));
$images = htmlspecialchars(strip_tags($data['images'] ?? '')); // if this is a JSON string, store as is
$is_approved = intval($data['is_approved'] ?? 0);
$created_at = htmlspecialchars(strip_tags($data['created_at'] ?? ''));
$updated_at = htmlspecialchars(strip_tags($data['updated_at'] ?? ''));

// Example: return sanitized data as JSON for testing
echo json_encode([
    'service_id' => $service_id,
    'provider_id' => $provider_id,
    'name' => $name,
    'description' => $description,
    'price' => $price,
    'category' => $category,
    // 'specifications' => $specifications,
    'images' => $images,
    'is_approved' => $is_approved,
    'created_at' => $created_at,
    'updated_at' => $updated_at,
]);

?>
