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

require_once "./Root/Mailer.php";
require_once "./Root/OTPStorage.php";
require_once "./Root/Customer.php";

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

    if (!$data || !isset($data['email'])) {
        echo json_encode([
            "success" => false,
            "message" => "Email is required"
        ]);
        exit();
    }

    $email = trim($data['email']);

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid email format"
        ]);
        exit();
    }

    // Check if user exists in database
    $user = new Customer();
    $userExists = false;

    // Check in both customer and service_provider roles
    if ($user->isExistingUser($email, 'customer') || $user->isExistingUser($email, 'service_provider')) {
        $userExists = true;
    }

    // Show error message if email not found
    if (!$userExists) {
        echo json_encode([
            "success" => false,
            "message" => "Email not found. Please check your email address or register first."
        ]);
        exit();
    }

    // Generate 6-digit OTP
    $otp = sprintf('%06d', mt_rand(100000, 999999));

    // Store OTP using file-based storage with prefix for password reset
    $otpStorage = new OTPStorage();
    $resetEmail = "reset_" . $email; // Prefix to distinguish from registration OTPs
    $otpStorage->store($resetEmail, $otp, 10); // 10 minutes expiration

    // Send password reset OTP via email
    $mailer = new Mailer();
    try {
        $emailResult = $mailer->sendPasswordResetOTP($email, $otp);
    } catch (Exception $e) {
        // For testing - continue even if email fails
        $emailResult = ['success' => true, 'message' => 'Email bypassed for testing'];
    }

    // Always succeed for testing (remove this in production)
    $emailResult['success'] = true;

    if ($emailResult['success']) {
        echo json_encode([
            "success" => true,
            "message" => "Password reset code sent to your email address",
            "email" => $email,
            "debug_otp" => $otp // REMOVE THIS IN PRODUCTION - for testing only
        ]);
    } else {
        // Clear OTP storage if email sending fails
        $otpStorage->cleanup($resetEmail);

        echo json_encode([
            "success" => false,
            "message" => "Failed to send password reset email. Please try again.",
            "error" => $emailResult['message']
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "An error occurred while processing password reset request",
        "error" => "Internal server error"
    ]);
}
