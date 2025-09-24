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
    $notification = new Notification();

     $data = json_decode(file_get_contents("php://input"), true);
        $notification_id = $data['notification_id'];
    // $response = $getAll->GetOrdersCustomer($user_id);
$response=$notification->deleteNotification($notification_id);
    // $response=$notification->markAllNotificationsRead($user_id,);
       echo json_encode($response);
    }else{
     echo json_encode([
        "get to data from order " => false,
        "message" => "something issue in ur credietials",
      
    ]);}
} else {
    echo json_encode([
        "select order " => false,
        "message" => "tou need to login first",
      
    ]);
    error_log("SESSION FETCHED: " . print_r($_SESSION, true));

}
?>