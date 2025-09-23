<?php
// Handle multiple possible frontend ports
$allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:5173'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: http://localhost:8081");
}

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

    // Use file-based OTP storage with reset prefix
    $otpStorage = new OTPStorage();
    $resetEmail = "reset_" . $email;
    $result = $otpStorage->verify($resetEmail, $inputOtp);

    if ($result['success']) {
        // OTP verified successfully - generate a temporary reset token
        $resetToken = bin2hex(random_bytes(32)); // 64-character token

        // Store the reset token with the email (valid for 30 minutes)
        $tokenStorage = new OTPStorage();
        $tokenKey = "token_" . $email;
        $tokenStorage->store($tokenKey, $resetToken, 30); // 30 minutes expiration

        echo json_encode([
            "success" => true,
            "message" => "Password reset verified successfully",
            "email" => $email,
            "reset_token" => $resetToken
        ]);
    } else {
        echo json_encode($result);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "An error occurred while verifying password reset OTP",
        "error" => "Internal server error"
    ]);
}
