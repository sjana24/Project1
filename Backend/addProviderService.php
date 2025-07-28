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
        $array = $data['formData'];

        $name = isset($array['name']) ? htmlspecialchars(strip_tags($array['name'])) : '';
        $description = isset($array['description']) ? htmlspecialchars(strip_tags($array['description'])) : '';
        $price = isset($array['price']) && is_numeric($array['price']) ? floatval($array['price']) : 0.0;
        $type = isset($array['type']) ? htmlspecialchars(strip_tags($array['type'])) : '';
        $status = isset($array['status']) && in_array($array['status'], ['Active', 'Inactive'])
            ? $array['status']
            : 'Inactive'; // default to 'Active'
        $visible=1;
        $addService=new Service();
        $response=$addService->insertService($user_id,$name,$description,$price,$type,$status,$visible);
        echo json_encode($response);
        


    }
}
