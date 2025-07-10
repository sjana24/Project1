 <?php
 header("Access-Control-Allow-Origin: http://localhost:8080");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");
// header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// require_once "./Root/Customer.php";
// require_once "./Root/Admin.php";
require_once "./Root/Customer.php";

// echo " hi";
session_start();
$data = json_decode(file_get_contents("php://input"), true);

// $email = filter_var($data['email'] ?? null,FILTER_SANITIZE_EMAIL);
// $password = htmlspecialchars(strip_tags($data['password'] ?? null));
// $role = htmlspecialchars(strip_tags($data['role'] ?? null));
// $data = json_decode(file_get_contents("php://input"), true);

$email = isset($data['email']) ? htmlspecialchars(strip_tags($data['email'])) : '';
$password = isset($data['password']) ? htmlspecialchars(strip_tags($data['password'])) : '';
$role = isset($data['role']) ? htmlspecialchars(strip_tags($data['role'])) : '';


if(!filter_var($data['email'],FILTER_VALIDATE_EMAIL)){
    echo json_encode("invalid mail");
}






// $customerLogin=new Customer();
$userLogin=new Customer();
// $providerLogin=new Provider();



$loginRes=$userLogin->Login($email,$password,$role);
    // $x=$userLogin->Login($email,$password,$role);

if ($loginRes['success']) {
    http_response_code(200);
    
    echo json_encode($loginRes);
    
} else {
    echo json_encode($loginRes);
}








