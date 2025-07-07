 <?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
// require_once "./Root/Customer.php";
// require_once "./Root/Admin.php";
require_once "./Root/Customer.php";



$data = json_decode(file_get_contents("php://input"), true);

$email = filter_var($data['email'],FILTER_SANITIZE_EMAIL);
$password = htmlspecialchars(strip_tags($data['password']));
$role = htmlspecialchars(strip_tags($data['role']));

if(!filter_var($data['email'],FILTER_VALIDATE_EMAIL)){
    echo json_encode("invalid mail");
}



// echo "$email";
// echo "$password";
// echo "$role";


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








