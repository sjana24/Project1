<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "./Root/Order.php";
require_once "./Root/Notification.php";

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (isset($_SESSION['user'])) {
    $user_name = $_SESSION['user']['user_name'];
    $user_id   = $_SESSION['user']['user_id'];
    $user_role = $_SESSION['user']['user_role'];

    if ($user_role === "service_provider") {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || !isset($data['order_id'])) {
            echo json_encode([
                "success" => false,
                "message" => "Invalid request: order_id missing"
            ]);
            exit;
        }

        $order_id = $data['order_id'];
         $new_status = $data['new_status'];

        $order = new Order();
        
        $response = $order->updateOrderStatusProvider((int)$order_id,$new_status);
        if($response['success']){
            $notification=new Notification();
            $notificationResponse=$notification->insertNotification($response['customer_id'],$user_role,"Order status","Your order #$order_id status has been updated to '$new_status' by the service provider.",$user_id);
            if(!$notificationResponse['success']){

            }
            
        }

        echo json_encode($response);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Unauthorized role"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "User not logged in"
    ]);
}
