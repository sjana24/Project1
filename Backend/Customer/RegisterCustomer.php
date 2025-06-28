<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
include "../dbCon.php";

$objDb=new Database;
$conn=$objDb->connect();


$data = json_decode(file_get_contents("php://input"), true);


if ($data && isset($data['name'], $data['email'], $data['mobileNumber'], $data['password'])) {
     // Get data from input
    $name = $data['name'];
    $email = $data['email'];
    $mobile = (int)$data['mobileNumber']; // cast to int just in case
    $password = $data['password'];

    // Prepare statement to prevent SQL injection
    
       $sql = "INSERT INTO `customer`( `fullName`, `email`, `mobileNumber`, `password`) VALUES (?,?,?,?)";
    $stmt = $conn->prepare($sql);
   
    $stmt->bind_param("ssis", $name, $email, $mobile, $password);
   

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Name saved successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database insert failed."]);
    }

    $stmt->close();
    $conn->close();
}


?>