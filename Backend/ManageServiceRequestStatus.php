<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// echo "hi";
require_once "./Root/Chat.php";
require_once "./Root/Notification.php";

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
       $request_id = htmlspecialchars(strip_tags($data['request_id']));
        $customer_id = htmlspecialchars(strip_tags($data['customer_id']));
       $status = htmlspecialchars(strip_tags($data['status']));
// echo "$user_name,$customer_id,$request_id";



        // $manageChat = new Chat();
        // $insertNotification =new Notification();
        // $response=$manageChat->ManageChatProvider($request_id,$status);
        // $contact_id=$response['contact_id'];
        // $status=$response['status'];
        // $success=$response['success'];

        // if ($success){
        //     $responce2=$insertNotification->insertNotificationStatusCustomer($contact_id,$user_role, $status, $customer_id, $success, $user_id);
        //     $responce3=$manageChat->createConversation($contact_id, $customer_id, $user_id);
        //     echo json_encode($responce3);
        //      echo json_encode($responce2);
        // }
        // echo json_encode($response);
        
        // echo "$uploadedImages";
        // print_r($uploadedImages);
        // echo json_encode(false)
    
// }
    }}