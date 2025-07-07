<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
$data = json_decode(file_get_contents("php://input"), true); // For JSON input

$name = htmlspecialchars(strip_tags(trim($data['name'] ?? '')));
$email = htmlspecialchars(strip_tags(trim($data['email'] ?? '')));
$contact_no = htmlspecialchars(strip_tags(trim($data['contact_no'] ?? '')));
$password = htmlspecialchars(strip_tags(trim($data['password'] ?? '')));
$confirmpassword = htmlspecialchars(strip_tags(trim($data['confirmpassword'] ?? '')));
$role = htmlspecialchars(strip_tags(trim($data['role'] ?? '')));
$address = htmlspecialchars(strip_tags(trim($data['address'] ?? '')));
$district = htmlspecialchars(strip_tags(trim($data['district'] ?? '')));
$province = htmlspecialchars(strip_tags(trim($data['province'] ?? '')));
$company_name = htmlspecialchars(strip_tags(trim($data['company_name'] ?? '')));
$business_reg_no = htmlspecialchars(strip_tags(trim($data['business_reg_no'] ?? '')));
$company_description = htmlspecialchars(strip_tags(trim($data['company_description'] ?? '')));
$website = htmlspecialchars(strip_tags(trim($data['website'] ?? '')));

// ✅ Simple validations (you can expand these)
$errors = [];

if (empty($name)) $errors[] = "Name is required.";
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required.";
if (strlen($password) < 6) $errors[] = "Password must be at least 6 characters.";
if ($password !== $confirmpassword) $errors[] = "Passwords do not match.";
if (empty($role) || !in_array($role, ['customer', 'service_provider'])) $errors[] = "Valid role is required.";
if (empty($contact_no) || !preg_match('/^[0-9]{10}$/', $contact_no)) $errors[] = "Valid 10-digit contact number is required.";
if ($website && !filter_var($website, FILTER_VALIDATE_URL)) $errors[] = "Website must be a valid URL.";

// Echo errors or continue
if (!empty($errors)) {
    echo json_encode(["success" => false, "errors" => $errors]);
    exit;
}

// ✅ Echo sanitized data (example)
echo json_encode([
    "success" => true,
    "data" => [
        "name" => $name,
        "email" => $email,
        "contact_no" => $contact_no,
        "role" => $role,
        "address" => $address,
        "district" => $district,
        "province" => $province,
        "company_name" => $company_name,
        "business_reg_no" => $business_reg_no,
        "company_description" => $company_description,
        "website" => $website,
    ]
]);
