<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// echo "hi";
require_once "./Root/Service.php";

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
        $service_id = $data['service_id'];
        $visibleToggle = $data['is_active'];
        $updateService = new Service();

        // $service_id = isset($array['service_id']) ? htmlspecialchars(strip_tags($array['service_id'])) : '';
       
        // $visible = isset($array['visible']) ? htmlspecialchars(strip_tags($array['visible'])) : '';

     
        
            $response = $updateService->updateServiceStatus($service_id, $visibleToggle);
            echo json_encode($response);
            // echo ("1");
        
    }
}
