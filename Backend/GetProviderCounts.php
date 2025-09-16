<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once 'dBCon.php';

$admin = new Admin();

// Get the provider ID from the URL query parameter
if (isset($_GET['provider_id'])) {
    $provider_id = (int)$_GET['provider_id'];
    $response = $admin->getProviderCounts($provider_id);
    echo json_encode($response);
} else {
    echo json_encode(['success' => false, 'message' => 'Provider ID not provided.']);
}
?>