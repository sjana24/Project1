<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "./Root/OTPStorage.php";

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Only POST method allowed"
    ]);
    exit();
}

try {
    // Get and validate input
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['email']) || !isset($data['otp'])) {
        echo json_encode([
            "success" => false,
            "message" => "Email and OTP are required"
        ]);
        exit();
    }

    $email = trim($data['email']);
    $inputOtp = trim($data['otp']);

    // Convert OTP to string and remove any non-numeric characters
    $inputOtp = preg_replace('/[^0-9]/', '', $inputOtp);

    // Use file-based OTP storage
    $otpStorage = new OTPStorage();
    $result = $otpStorage->verify($email, $inputOtp);

    echo json_encode($result);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "An error occurred while verifying OTP",
        "error" => "Internal server error"
    ]);
}
