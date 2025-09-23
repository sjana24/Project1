<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once './Root/Customer.php';
require_once './Root/OTPStorage.php';

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
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data"
        ]);
        exit();
    }

    // Extract email first for verification check
    $email = htmlspecialchars(strip_tags(trim($data['email'] ?? '')));

    if (empty($email)) {
        echo json_encode([
            "success" => false,
            "message" => "Email is required"
        ]);
        exit();
    }

    // Verify that email verification was completed using file-based storage
    $otpStorage = new OTPStorage();
    if (!$otpStorage->isVerified($email)) {
        echo json_encode([
            "success" => false,
            "message" => "Email verification required. Please verify your email first."
        ]);
        exit();
    }

    // Sanitize and validate input data
    $name = htmlspecialchars(strip_tags(trim($data['full_name'] ?? '')));
    $contact_no = htmlspecialchars(strip_tags(trim($data['contact_no'] ?? '')));

    // More robust password handling - remove all types of whitespace and control characters
    $password = preg_replace('/[\r\n\t\s]+/', '', $data['password'] ?? '');
    $confirmpassword = preg_replace('/[\r\n\t\s]+/', '', $data['confirmpassword'] ?? '');

    $role = htmlspecialchars(strip_tags(trim($data['role'] ?? '')));
    $address = htmlspecialchars(strip_tags(trim($data['address'] ?? '')));
    $district = htmlspecialchars(strip_tags(trim($data['district'] ?? '')));
    $province = htmlspecialchars(strip_tags(trim($data['province'] ?? '')));
    $company_name = htmlspecialchars(strip_tags(trim($data['company_name'] ?? '')));
    $business_reg_no = htmlspecialchars(strip_tags(trim($data['business_reg_no'] ?? '')));
    $company_description = htmlspecialchars(strip_tags(trim($data['company_description'] ?? '')));
    $website = htmlspecialchars(strip_tags(trim($data['website'] ?? '')));

    // Validation
    $errors = [];

    if (empty($name)) $errors[] = "Name is required.";
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required.";
    if (strlen($password) < 6) $errors[] = "Password must be at least 6 characters.";
    if ($password !== $confirmpassword) $errors[] = "Passwords do not match.";
    if (empty($role) || !in_array($role, ['customer', 'service_provider'])) $errors[] = "Valid role is required.";
    if (empty($contact_no) || !preg_match('/^[0-9]{10}$/', $contact_no)) $errors[] = "Valid 10-digit contact number is required.";
    if ($website && !filter_var($website, FILTER_VALIDATE_URL)) $errors[] = "Website must be a valid URL.";

    // Return validation errors
    if (!empty($errors)) {
        echo json_encode([
            "success" => false,
            "errors" => $errors,
            "message" => "Validation failed"
        ]);
        exit();
    }

    // Hash the password for security
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Log password hashing (remove in production)
    error_log("Password hashed successfully");

    // Create user account
    $createdUser = new Customer();
    $response = $createdUser->signUpUser(
        $name,
        $email,
        $contact_no,
        $role,
        $hashedPassword, // Use hashed password
        $address,
        $district,
        $province,
        $company_name,
        $business_reg_no,
        $company_description,
        $website
    );

    // Clear email verification after successful registration
    if ($response['success']) {
        $otpStorage->cleanup($email);
    }

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "An error occurred during registration",
        "error" => "Internal server error"
    ]);
}
