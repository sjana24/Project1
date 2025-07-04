 <?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require_once "./Root/Customer.php";



$data = json_decode(file_get_contents("php://input"), true);
// $email = filter_var($data->email,FILTER_SANITIZE_EMAIL);
$email = htmlspecialchars(strip_tags($data['email']));
$password = htmlspecialchars(strip_tags($data['password']));
$role = htmlspecialchars(strip_tags($data['role']));
// echo "$email";
// echo "$password";
// echo "$role";


$customerLogin=new Customer();

$loginRes=$customerLogin->Login($email,$password,$role);

if ($loginRes['success']) {
    http_response_code(200);
    echo json_encode($loginRes);
} else {
    echo json_encode($loginRes);
}








