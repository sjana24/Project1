<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
include "../dbCon.php";


$dbObj = new Database;
$conn = $dbObj->connect();

$data = json_decode(file_get_contents("php://input"), true);
if ($data && isset($data['email'], $data['password'])) {
     // Get data from input
    
    $email = $data['email'];
    
    $userPassword = $data['password'];


     $sql = "SELECT id,fullName, email, password FROM provider WHERE email = ?";
    $stmt = $conn->prepare($sql);
   
    $stmt->bind_param("s",$email);
     $stmt->execute();

      $result = $stmt->get_result();
    if ($result->num_rows > 0) {
    $user = $result->fetch_assoc(); // Get DB row

    // Datas from database
    $dbProviderId = $user['id'];    
    $dbEmail = $user['email']; 
    $dbFullName = $user['fullName'];
    $dbPassword = $user['password'];
    

    if ($userPassword == $dbPassword) {
        echo json_encode([
            'success' => true,
            'userID'=>$dbProviderId,
            'userName'=>$dbFullName,           
            'userEmail'=>$dbEmail
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Incorrect password."
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "User not found."
    ]);
    exit;
}

    $stmt->close();
    $conn->close();
}


?>