<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// echo "hi";
require_once "./Root/Customer.php";

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    http_response_code(200);
    exit();
}
$data = json_decode(file_get_contents("php://input"), true);
$user_id = isset($data['user_id']) ? htmlspecialchars(strip_tags($data['user_id'])) : '';
$status = isset($data['status']) ? htmlspecialchars(strip_tags($data['status'])) : '';

// $product_id = $_POST['product_id'];
// $is_approved = $_POST['is_approved']; 

   if (isset($_SESSION['user'])) {
        $user_name = $_SESSION['user']['user_name'];
        $user_id = $_SESSION['user']['user_id'];
        $user_role = $_SESSION['user']['user_role'];

        // echo "$user_name,$user_id,$user_role";
        $status=$status==="disabled"?"0":"1";

        if ("admin" === $user_role) {

            $updateData = new Customer();
            $response = $updateData->updateCustomerStatus($user_id,$status);
             echo json_encode($response);

        
        }
   
    } else {
        echo json_encode([
            "add to cart " => false,
            "message" => "tou need to login first",
            // "user_name" => $_SESSION['user'],
            // "user_id" => $_SESSION['user']['user_id'],
            // "user_role" => $_SESSION['user']['user_role'],
        ]);
        error_log("SESSION FETCHED: " . print_r($_SESSION, true));
    }