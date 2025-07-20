<?php
  session_start();
    header("Access-Control-Allow-Origin: http://localhost:8080");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json");
    // header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    // require_once "./Root/Chat.php";

require_once "./Root/Service.php";
echo "hi";
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    http_response_code(200);
    exit();
}

if (isset($_SESSION['user'])) {
    $user_name = $_SESSION['user']['user_name'];
    $user_id = $_SESSION['user']['user_id'];
    $user_role = $_SESSION['user']['user_role'];

    echo "$user_name,$user_id,$user_role";
    if ("customer" === $user_role) {

// Get JSON input and decode it as an associative array
$data = json_decode(file_get_contents("php://input"), true);

// // Sanitize each expected field
$serviceDataFetch=$data['serviceData'];
$fullName = htmlspecialchars(strip_tags($data['userData']['fullName'] ?? ''));
$phone = htmlspecialchars(strip_tags($data['userData']['phone'] ?? ''));
$email = htmlspecialchars(strip_tags($data['userData']['email'] ?? ''));
$province = htmlspecialchars(strip_tags($data['userData']['province'] ?? ''));
$city = htmlspecialchars(strip_tags($data['userData']['city'] ?? ''));
$address = htmlspecialchars(strip_tags($data['userData']['address'] ?? ''));
$zip = htmlspecialchars(strip_tags($data['userData']['zip'] ?? ''));
$locationLink = htmlspecialchars(strip_tags($data['userData']['locationLink'] ?? ''));
$roofHeight = htmlspecialchars(strip_tags($data['userData']['roofHeight'] ?? ''));
$serviceType = htmlspecialchars(strip_tags($data['userData']['serviceType'] ?? 'installation'));
$roofType = htmlspecialchars(strip_tags($data['userData']['roofType'] ?? ''));
$roofSize = htmlspecialchars(strip_tags($data['userData']['roofSize'] ?? ''));
$capacity = htmlspecialchars(strip_tags($data['userData']['capacity'] ?? ''));
$battery = htmlspecialchars(strip_tags($data['userData']['battery'] ?? 'no'));
$oldAddress = htmlspecialchars(strip_tags($data['userData']['oldAddress'] ?? ''));
$newAddress = htmlspecialchars(strip_tags($data['userData']['newAddress'] ?? ''));
$problem = htmlspecialchars(strip_tags($data['userData']['problem'] ?? ''));
$preferredDate = htmlspecialchars(strip_tags($data['userData']['preferredDate'] ?? ''));
$preferredTime = htmlspecialchars(strip_tags($data['userData']['preferredTime'] ?? ''));

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
    'preferredTime' => $preferredTime,
    "fkmkdsfm"=>$serviceDataFetch
]);


$serviceDataFetch = $data['serviceData'];

// $service_id     = $serviceDataFetch['service_id'];
$service_id = trim($serviceDataFetch['service_id']);

$provider_id    = $serviceDataFetch['provider_id'];
$name           = $serviceDataFetch['name'];
$description    = $serviceDataFetch['description'];
$price          = $serviceDataFetch['price'];
$category       = $serviceDataFetch['category'];
$images         = $serviceDataFetch['images'];
$is_approved    = $serviceDataFetch['is_approved'];
$created_at     = $serviceDataFetch['created_at'];
$updated_at     = $serviceDataFetch['updated_at'];
$company_name   = $serviceDataFetch['company_name'];
$provider_name  = $serviceDataFetch['provider_name'];

$insertService=new Service();
$response=$insertService->insertServiceRequest( $user_id, $provider_id, $service_id);

    }
  else{
    echo json_encode([
      "message"=>false,
    ]);
  }
  
  }