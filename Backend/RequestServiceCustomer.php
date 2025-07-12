<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "./Root/Service.php";
// echo "hi";

// Get JSON input and decode it as an associative array
$data = json_decode(file_get_contents("php://input"), true);

// Sanitize each expected field
$fullName = htmlspecialchars(strip_tags($data['fullName'] ?? ''));
$phone = htmlspecialchars(strip_tags($data['phone'] ?? ''));
$email = htmlspecialchars(strip_tags($data['email'] ?? ''));
$province = htmlspecialchars(strip_tags($data['province'] ?? ''));
$city = htmlspecialchars(strip_tags($data['city'] ?? ''));
$address = htmlspecialchars(strip_tags($data['address'] ?? ''));
$zip = htmlspecialchars(strip_tags($data['zip'] ?? ''));
$locationLink = htmlspecialchars(strip_tags($data['locationLink'] ?? ''));
$roofHeight = htmlspecialchars(strip_tags($data['roofHeight'] ?? ''));
$serviceType = htmlspecialchars(strip_tags($data['serviceType'] ?? 'installation'));
$roofType = htmlspecialchars(strip_tags($data['roofType'] ?? ''));
$roofSize = htmlspecialchars(strip_tags($data['roofSize'] ?? ''));
$capacity = htmlspecialchars(strip_tags($data['capacity'] ?? ''));
$battery = htmlspecialchars(strip_tags($data['battery'] ?? 'no'));
$oldAddress = htmlspecialchars(strip_tags($data['oldAddress'] ?? ''));
$newAddress = htmlspecialchars(strip_tags($data['newAddress'] ?? ''));
$problem = htmlspecialchars(strip_tags($data['problem'] ?? ''));
$preferredDate = htmlspecialchars(strip_tags($data['preferredDate'] ?? ''));
$preferredTime = htmlspecialchars(strip_tags($data['preferredTime'] ?? ''));

echo json_encode([
    'fullName' => $fullName,
    'phone' => $phone,
    'email' => $email,
    'province' => $province,
    'city' => $city,
    'address' => $address,
    'zip' => $zip,
    'locationLink' => $locationLink,
    'roofHeight' => $roofHeight,
    'serviceType' => $serviceType,
    'roofType' => $roofType,
    'roofSize' => $roofSize,
    'capacity' => $capacity,
    'battery' => $battery,
    'oldAddress' => $oldAddress,
    'newAddress' => $newAddress,
    'problem' => $problem,
    'preferredDate' => $preferredDate,
    'preferredTime' => $preferredTime
]);