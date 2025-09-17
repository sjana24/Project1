<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
// header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require_once './Root/Customer.php';
$data = json_decode(file_get_contents("php://input"), true); // For JSON input

$name = htmlspecialchars(strip_tags(trim($data['name'] ?? '')));
$email = htmlspecialchars(strip_tags(trim($data['email'] ?? '')));
$contact_number = htmlspecialchars(strip_tags(trim($data['contact_number'] ?? '')));
$password = htmlspecialchars(strip_tags(trim($data['password'] ?? '')));
$confirmpassword = htmlspecialchars(strip_tags(trim($data['confirmpassword'] ?? '')));
$role = htmlspecialchars(strip_tags(trim($data['user_role'] ?? '')));
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
if (empty($user_role) || !in_array($user_role, ['customer', 'service_provider'])) $errors[] = "Valid role is required.";
if (empty($contact_number) || !preg_match('/^[0-9]{10}$/', $contact_number)) $errors[] = "Valid 10-digit contact number is required.";
if ($website && !filter_var($website, FILTER_VALIDATE_URL)) $errors[] = "Website must be a valid URL.";

// Echo errors or continue
if (!empty($errors)) {
    echo json_encode(["success" => false, "errors" => $errors]);
    exit;
}
else{
    
    $createdUser=new Customer();
    $responce=$createdUser->signUpUser($name,$email,$contact_number,$user_role,$password,$address,$district,$province,$company_name,$business_reg_no,$company_description,$website);
   
}

if ($responce['success']) {
    http_response_code(200);
    
    echo json_encode($responce);
    
} else {
    echo json_encode($responce);
}










// ✅ Echo sanitized data (example)
// echo json_encode([
//     "success" => true,
//     "data" => [
//         "name" => $name,
//         "email" => $email,
//         "contact_number" => $contact_number,
//         "role" => $role,
//         "address" => $address,
//         "district" => $district,
//         "province" => $province,
//         "company_name" => $company_name,
//         "business_reg_no" => $business_reg_no,
//         "company_description" => $company_description,
//         "website" => $website,
//     ]
// ]);
