<!--  
//  header("Access-Control-Allow-Origin: http://localhost:8080");
// header("Content-Type: application/json");
// header("Access-Control-Allow-Credentials: true");
// header("Access-Control-Allow-Origin: *");

// header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Access-Control-Allow-Headers: Content-Type, Authorization"); -->
<!-- // require_once "./Root/Customer.php"; -->
<!-- // session_destroy(); -->

<?php
session_start();
session_unset(); // clear session variables
session_destroy(); // destroy session

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

echo json_encode(["success" => true, "message" => "Logged out successfully."]);
