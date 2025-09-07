<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// echo "hi";
require_once "./Root/Product.php";

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
        $data = json_decode(file_get_contents("php://input"), true);
        $array = $data['product_Details'];
        $card=$data['card_details'];

        print_r( $array);
        print_r($card); 

       
    } else {

        
        
        echo json_encode(array("success"=>false,"message" => "Only for customer not fot $user_role."));
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


// $data = json_decode(file_get_contents("php://input"), true);
// $array = $data['product_Details'];

// // $customerID = isset($data['customer_id']) ? htmlspecialchars(strip_tags($data['customer_id'])) : null;

// $product_id = htmlspecialchars(strip_tags($array['product_id']));
// $provider_id = htmlspecialchars(strip_tags($array['provider_id']));
// echo "$product_id,$provider_id";
// $provider_id = htmlspecialchars(strip_tags($array['quantity']));


// $addToCart = new Product();
// $Result = $addToCart->AddToCart($customerID, $product_id, 1);

//   if($Result) {
//       http_response_code(200);
//       echo json_encode(array("message" => "Add to cart successfully."));
//   } else {
//       http_response_code(400);
//       echo json_encode(array("message" => "Unable to add to cart."));
//   }

// echo json_encode([
//     'product_id' => $product_id,
//     'provider_id' => $provider_id,
    
//     ""=>$customerID
// ]);
