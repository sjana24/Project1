<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once'Root/Customer.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
   
    http_response_code(200);
    exit();
}


$data = json_decode(file_get_contents("php://input"), true);

$name = htmlspecialchars(strip_tags($data['name']));
$email = htmlspecialchars(strip_tags($data['email']));
$password = htmlspecialchars(strip_tags($data['password']));
$contact_no =htmlspecialchars(strip_tags($data['contact_no']));

$customerRegister=new Customer();
$Result = $customerRegister->Register($name,$email,$password,$contact_no);

if($Result) {
    http_response_code(200);
    echo json_encode(array("message" => "Customer was successfully registered."));
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to register the Customer."));
}





?>