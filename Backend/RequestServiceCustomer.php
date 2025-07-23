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
// echo "hi";
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    http_response_code(200);
    exit();
}

if (isset($_SESSION['user'])) {
    $user_name = $_SESSION['user']['user_name'];
    $user_id = $_SESSION['user']['user_id'];
    $user_role = $_SESSION['user']['user_role'];

    // echo "$user_name,$user_id,$user_role";
    if ("customer" === $user_role) {

// Get JSON input and decode it as an associative array
$data = json_decode(file_get_contents("php://input"), true);

// // Sanitize each expected field
$serviceDataFetch=$data['serviceData'];
// Sanitize all fields
$fullName                   = htmlspecialchars(strip_tags($data['userData']['fullName'] ?? ''));
$phone                      = htmlspecialchars(strip_tags($data['userData']['phone'] ?? ''));
$maintainanceRoofHeight     = htmlspecialchars(strip_tags($data['userData']['maintainanceRoofHeight'] ?? ''));

$installationAddress        = htmlspecialchars(strip_tags($data['userData']['installationAddress'] ?? ''));
$installationCity           = htmlspecialchars(strip_tags($data['userData']['installationCity'] ?? ''));
$installationProvince       = htmlspecialchars(strip_tags($data['userData']['installationProvince'] ?? ''));
$installationZip            = htmlspecialchars(strip_tags($data['userData']['installationZip'] ?? ''));
$installationRoofType           = htmlspecialchars(strip_tags($data['userData']['installationRoofType'] ?? ''));
$installationRoofHeight     = htmlspecialchars(strip_tags($data['userData']['installationRoofHeight'] ?? ''));
$installationRoofSize       = htmlspecialchars(strip_tags($data['userData']['installationRoofSize'] ?? ''));
$installationCapacity       = htmlspecialchars(strip_tags($data['userData']['installationCapacity'] ?? ''));

$maintenanceAddress         = htmlspecialchars(strip_tags($data['userData']['maintenanceAddress'] ?? ''));
$maintenanceCity            = htmlspecialchars(strip_tags($data['userData']['maintenanceCity'] ?? ''));
$maintenanceProvince        = htmlspecialchars(strip_tags($data['userData']['maintenanceProvince'] ?? ''));
$maintenanceZip             = htmlspecialchars(strip_tags($data['userData']['maintenanceZip'] ?? ''));
$maintenanceProblem         = htmlspecialchars(strip_tags($data['userData']['maintenanceProblem'] ?? ''));

$relocationOldAddress       = htmlspecialchars(strip_tags($data['userData']['relocationOldAddress'] ?? ''));
$relocationOldCity          = htmlspecialchars(strip_tags($data['userData']['relocationOldCity'] ?? ''));
$relocationOldProvince      = htmlspecialchars(strip_tags($data['userData']['relocationOldProvince'] ?? ''));
$relocationOldZip           = htmlspecialchars(strip_tags($data['userData']['relocationOldZip'] ?? ''));

$relocationNewAddress       = htmlspecialchars(strip_tags($data['userData']['relocationNewAddress'] ?? ''));
$relocationNewCity          = htmlspecialchars(strip_tags($data['userData']['relocationNewCity'] ?? ''));
$relocationNewProvince      = htmlspecialchars(strip_tags($data['userData']['relocationNewProvince'] ?? ''));
$relocationNewZip           = htmlspecialchars(strip_tags($data['userData']['relocationNewZip'] ?? ''));

$relocationRoofHeightOld    = htmlspecialchars(strip_tags($data['userData']['relocationRoofHeightOld'] ?? ''));
$relocationRoofHeightNew    = htmlspecialchars(strip_tags($data['userData']['relocationRoofHeightNew'] ?? ''));
$relocationRoofSize         = htmlspecialchars(strip_tags($data['userData']['relocationRoofSize'] ?? ''));

$preferredDate              = htmlspecialchars(strip_tags($data['userData']['preferredDate'] ?? ''));


$addressPartsInstallation = array_filter([$installationAddress, $installationCity, $installationProvince, $installationZip]);
$fullAddressInstallation = implode(', ', $addressPartsInstallation);

$addressPartsRelocationOld = array_filter([$relocationOldAddress, $relocationOldCity, $relocationOldProvince, $relocationOldZip]);
$fullAddressRelocationOld = implode(', ', $addressPartsRelocationOld);

$addressPartsRelocationNew = array_filter([$relocationNewAddress, $relocationNewCity, $relocationNewProvince, $relocationNewZip]);
$fullAddressRelocationNew = implode(', ', $addressPartsRelocationNew);

$addressPartsMaintainance = array_filter([$maintenanceAddress, $maintenanceCity, $maintenanceProvince, $maintenanceZip]);
$fullAddressMaintainance = implode(', ', $addressPartsMaintainance);


// Combine into key-value array
$sanitizedData = [
    "fullName"                  => $fullName,
    "phone"                     => $phone,

    // Installation details
    "installationAddress"       => $installationAddress,
    "installationCity"          => $installationCity,
    "installationProvince"      => $installationProvince,
    "installationZip"           => $installationZip,
    "roofType"                  => $installationRoofType,
    "roofHeightInstallation"    => $installationRoofHeight,
    "roofSizeInstallation"                  => $installationRoofSize,
    "capacity"                  => $installationCapacity,
    "fullAddressInstallation"   => $fullAddressInstallation,

    // Maintenance details
    "maintenanceAddress"        => $maintenanceAddress,
    "maintenanceCity"           => $maintenanceCity,
    "maintenanceProvince"       => $maintenanceProvince,
    "maintenanceZip"            => $maintenanceZip,
    "problem"                   => $maintenanceProblem,
    "roofHeightMaintainance"    => $maintainanceRoofHeight,
    "fullAddressMaintainance"   => $fullAddressMaintainance,

    // Relocation - old
    "relocationOldAddress"      => $relocationOldAddress,
    "relocationOldCity"         => $relocationOldCity,
    "relocationOldProvince"     => $relocationOldProvince,
    "relocationOldZip"          => $relocationOldZip,
    "roofHeightOldRelocation"             => $relocationRoofHeightOld,
    "fullAddressOldRelocation"            => $fullAddressRelocationOld,

    // Relocation - new
    "relocationNewAddress"      => $relocationNewAddress,
    "relocationNewCity"         => $relocationNewCity,
    "relocationNewProvince"     => $relocationNewProvince,
    "relocationNewZip"          => $relocationNewZip,
    "roofHeightNewRelocation"             => $relocationRoofHeightNew,
    "fullAddressNewRelocation"            => $fullAddressRelocationNew,

    // Common/shared
    "relocationRoofSize"        => $relocationRoofSize,
    "preferredDate"             => $preferredDate,

    // Optionals or extras
    "battery"                   => $battery ?? '',
];

// print_r($sanitizedData);

// You can now access like:
 $serviceType       = $serviceDataFetch['category'];

echo "Full Name: $fullName<br>";
echo "Phone: $phone<br>";
echo "Maintainance Roof Height: $maintainanceRoofHeight<br><br>";

// echo "Installation Address: $installationAddress<br>";
// echo "Installation City: $installationCity<br>";
// echo "Installation Province: $installationProvince<br>";
// echo "Installation Zip: $installationZip<br>";
echo "Installation Roof Type: $installationRoofType<br>";
echo "Installation Roof Height: $installationRoofHeight<br>";
echo "Installation Roof Size: $installationRoofSize<br>";
echo "Installation Capacity: $installationCapacity<br>";
echo "Full Address (Installation): $fullAddressInstallation<br><br>";

echo "Maintenance Address: $maintenanceAddress<br>";
// echo "Maintenance City: $maintenanceCity<br>";
// echo "Maintenance Province: $maintenanceProvince<br>";
// echo "Maintenance Zip: $maintenanceZip<br>";
echo "Maintenance Problem: $maintenanceProblem<br>";
echo "Full Address (Maintenance): $fullAddressMaintainance<br><br>";

echo "Relocation Old Address: $relocationOldAddress<br>";
echo "Relocation Old City: $relocationOldCity<br>";
echo "Relocation Old Province: $relocationOldProvince<br>";
echo "Relocation Old Zip: $relocationOldZip<br>";
echo "Full Address (Relocation - Old): $fullAddressRelocationOld<br><br>";

echo "Relocation New Address: $relocationNewAddress<br>";
echo "Relocation New City: $relocationNewCity<br>";
echo "Relocation New Province: $relocationNewProvince<br>";
echo "Relocation New Zip: $relocationNewZip<br>";
echo "Full Address (Relocation - New): $fullAddressRelocationNew<br><br>";

echo "Relocation Roof Height (Old): $relocationRoofHeightOld<br>";
echo "Relocation Roof Height (New): $relocationRoofHeightNew<br>";
echo "Relocation Roof Size: $relocationRoofSize<br><br>";

echo "Preferred Date: $preferredDate<br>";






// echo json_encode([
//     'fullName' => $fullName,
//     'phone' => $phone,
//     'email' => $email,
//     'province' => $province,
//     'city' => $city,
//     'address' => $address,
//     'zip' => $zip,
//     'locationLink' => $locationLink,
//     'roofHeight' => $roofHeight,
//     'serviceType' => $serviceType,
//     'roofType' => $roofType,
//     'roofSize' => $roofSize,
//     'capacity' => $capacity,
//     'battery' => $battery,
//     'oldAddress' => $oldAddress,
//     'newAddress' => $newAddress,
//     'problem' => $problem,
//     'preferredDate' => $preferredDate,
//     'preferredTime' => $preferredTime,
//     "fkmkdsfm"=>$serviceDataFetch
// ]);


// $serviceDataFetch = $data['serviceData'];
// print_r ($sanitizedData);  
// print_r($serviceDataFetch);
// echo "serviceDataFetch: " ($serviceDataFetch['service_id'] ?? '');

// $service_id     = $serviceDataFetch['service_id'];
// $service_id = trim($serviceDataFetch['service_id']);

// $provider_id    = $serviceDataFetch['provider_id'];
// $name           = $serviceDataFetch['name'];
// $description    = $serviceDataFetch['description'];
// $price          = $serviceDataFetch['price'];
// $category       = $serviceDataFetch['category'];
// $images         = $serviceDataFetch['images'];
// $is_approved    = $serviceDataFetch['is_approved'];
// $created_at     = $serviceDataFetch['created_at'];
// $updated_at     = $serviceDataFetch['updated_at'];
// $company_name   = $serviceDataFetch['company_name'];
// $provider_name  = $serviceDataFetch['provider_name'];

$insertService=new Service();
$response=$insertService->insertServiceRequest( $user_id, $sanitizedData, $serviceDataFetch);
  if($response['success']){
    echo json_encode([
        "message" => true,
        "erroe"=>$response['message'],
        // "request_id" => $response['request_id'],
        // "service_id" => $response['service_id'],
        // "serviceType" => $response['serviceType']
    ]);}
//     }
  else{
    echo json_encode([
      "message"=>false,
      "erroe"=>$response['message'],
    ]);}
//   }
} else {
    echo json_encode([
        "message" => "User not logged in or not a customer",
    ]);
}
} else {
    echo json_encode([
        "message" => "Session expired or user not logged in",
    ]);
} 