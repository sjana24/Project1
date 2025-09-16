<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "./Root/OngoingProject.php";

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

     $project_id = $data['project_id'];
        $new_status = $data['new_status'];
        // $due_date = $data['dueDate'];
        
        
        
        $ongoing = new OngoingProject();
        //  updateOngoingProjectStatusProvider
        $response = $ongoing->updateOngoingProjectStatusProvider($project_id,$new_status);

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
