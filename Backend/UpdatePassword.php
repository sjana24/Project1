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

    if (!$data || !isset($data['email']) || !isset($data['reset_token']) || !isset($data['new_password']) || !isset($data['confirm_password'])) {
        echo json_encode([
            "success" => false,
            "message" => "Email, reset token, new password, and confirm password are required"
        ]);
        exit();
    }

    $email = trim($data['email']);
    $resetToken = trim($data['reset_token']);
    $newPassword = preg_replace('/[\r\n\t\s]+/', '', $data['new_password']);
    $confirmPassword = preg_replace('/[\r\n\t\s]+/', '', $data['confirm_password']);

    // Validate passwords
    $errors = [];

    if (strlen($newPassword) < 6) {
        $errors[] = "Password must be at least 6 characters.";
    }

    if ($newPassword !== $confirmPassword) {
        $errors[] = "Passwords do not match.";
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Valid email is required.";
    }

    if (!empty($errors)) {
        echo json_encode([
            "success" => false,
            "errors" => $errors,
            "message" => "Validation failed"
        ]);
        exit();
    }

    // Verify reset token
    $tokenStorage = new OTPStorage();
    $tokenKey = "token_" . $email;
    $tokenResult = $tokenStorage->verify($tokenKey, $resetToken);

    if (!$tokenResult['success']) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid or expired reset token. Please request a new password reset."
        ]);
        exit();
    }

    // Hash the new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Update password in database
    $user = new Customer();
    $updateResult = $user->updatePassword($email, $hashedPassword);

    if ($updateResult['success']) {
        // Clean up all related tokens and OTPs
        $tokenStorage->cleanup($tokenKey); // Remove reset token
        $otpStorage = new OTPStorage();
        $otpStorage->cleanup("reset_" . $email); // Remove reset OTP

        echo json_encode([
            "success" => true,
            "message" => "Password updated successfully. You can now login with your new password."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to update password. Please try again."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "An error occurred while updating password",
        "error" => "Internal server error"
    ]);
}
