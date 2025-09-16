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
        $start_date = $data['startDate'];
        $due_date = $data['dueDate'];
        
        if ($start_date>$due_date){
            echo json_encode([
            "success" => false,
            "message" => "Due date must be grater than start date"
        ]);
        exit;

        }
        
        $ongoing = new OngoingProject();
        $response = $ongoing->updateOngoingProjectDateProvider($project_id,$start_date,$due_date);

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
