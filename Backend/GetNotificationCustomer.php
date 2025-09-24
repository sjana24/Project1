<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
// header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require_once "./Root/Notification.php";



if (isset($_SESSION['user'])) {
    $user_name = $_SESSION['user']['user_name'];
    $user_id = $_SESSION['user']['user_id'];
    $user_role = $_SESSION['user']['user_role'];

    // echo "$user_name,$user_id,$user_role";
    if("customer"===$user_role && !empty($user_id)){

    $getAll = new Notification();
    $response = $getAll->getAllNotificationCustomer($user_id,$user_role);
       echo json_encode($response);
    }else{
     echo json_encode([
        "success" => false,
        "message" => "something issue in ur credietials",
      
    ]);}
} else {
    echo json_encode([
        "success " => false,
        "message" => "You need need to login first",
      
    ]);
    // error_log("SESSION FETCHED: " . print_r($_SESSION, true));

}
































































    // if ("customer" === 0) {
        // $data = json_decode(file_get_contents("php://input"), true);
        // $array = $data['product_Details'];

        // $customerID = isset($data['customer_id']) ? htmlspecialchars(strip_tags($data['customer_id'])) : null;

        // $product_id = htmlspecialchars(strip_tags($array['product_id']));
        // $provider_id = htmlspecialchars(strip_tags($array['provider_id']));
        // echo "$product_id,$provider_id";
        // $addToCart = new Product();
        // $Result = $addToCart->AddToCart($user_id, $product_id, 1);

        //   if($Result) {
        //       http_response_code(200);
        //       echo json_encode(array("message" => "Add to cart successfully."));
        //   } else {
        //       http_response_code(400);
        //       echo json_encode(array("message" => "Unable to add to cart."));
        //   }
    // } else {

        // echo " this is not allowed to $user_role";
        // http_response_code(400);
        // echo json_encode(array("message" => "Only for customer not fot $user_role."));
    // }

    // echo json_encode([
    //     "loggedIn" => true,
    // ]);
    // error_log("Session: " . print_r($_SESSION, true));

    // echo " hi ";
