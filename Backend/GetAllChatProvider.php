<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// echo "hi";
require_once "./Root/Chat.php";

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
        
       




        $getChat = new Chat();
        $response=$getChat->getAllChatProvider($user_id);
        // $response = $addProduct->addProduct($product_id, $user_id, $name, $description, $price, $category, $image_path, $specifications);
        echo json_encode($response);
        // echo "$uploadedImages";
        // print_r($uploadedImages);
        // echo json_encode(false)
    
// }
    }}