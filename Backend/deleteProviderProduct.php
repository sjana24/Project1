<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

echo "hi";
require_once "./Root/Product.php";

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    http_response_code(200);
    exit();
}

if (isset($_SESSION['user'])) {
    $user_name = $_SESSION['user']['user_name'];
    $user_id = $_SESSION['user']['user_id'];
    $user_role = $_SESSION['user']['user_role'];

    // echo "$user_name,$user_id,$user_role";
    if ("service_provider" === $user_role) {
        
        $data = json_decode(file_get_contents("php://input"), true);
        $product_id = $data['product_id'];
        $deleteProduct = new Product();
        echo $product_id;
     
        $response = $deleteProduct->$deleteProduct($product_id, $user_id);
        echo json_encode($response);

    

    }}