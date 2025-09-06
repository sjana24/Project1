<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// echo "hi";
// require_once "./Root/Chat.php";
// require_once "./Root/Notification.php";

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    http_response_code(200);
    exit();
}

if (isset($_SESSION['user'])) {
    $user_name = $_SESSION['user']['user_name'];
    $user_id = $_SESSION['user']['user_id'];
    $user_role = $_SESSION['user']['user_role'];

    echo "$user_name,$user_id,$user_role";
    if ("service_provider" === $user_role) {
        
    //    $data = json_decode(file_get_contents("php://input"), true);
    //    $request_id = htmlspecialchars(strip_tags($data['request_id']));
  


    //     $openChat = new Chat();
    //     $responce=$openChat->OpenConversation($request_id);
     
    //     echo json_encode($responce);
        
    }}
    else{
        // echo "flknksglsdkg";
        // Get URL path and method
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
$basePath = '/Git/Project1/Backend/';
if (strpos($path, $basePath) === 0) {
    $paths = substr($path, strlen($basePath));
}
echo $paths;
echo $method;
    }