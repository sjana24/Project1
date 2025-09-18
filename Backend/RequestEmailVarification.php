<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


// require_once "./Root/Product.php";

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    http_response_code(200);
    exit();
}

if (isset($_SESSION['varification']) || 1) {
    // $email_var = $_SESSION['varification']['email'];
    // $otp_var = $_SESSION['varifivation']['otp'];
$email_var="provider21@gmail.com";
$otp_var="12345";

    // echo "$email,$otp;
    // if ("service_provider" === $user_role) {
        
        $data = json_decode(file_get_contents("php://input"), true);
        $email = $data['email'];
        // $otp = $data['otp'];
        // echo $email;

        if (($email_var === $email) ){
            echo json_encode([
        "success" => true,
        "message" => "email successfully varified",
       
    ]);
        }
        else{
                  echo json_encode([
        "success " => false,
        "message" => "email varification failed",
                  ]);
       

        }

        // echo "email",$email_var,$email;
        // echo "otp===",$otp_var,$otp;

        // $product = new Product();
        // echo $product_id;
     
        // $response = $product->deleteProductProvider($product_id, $user_id);
        // $product->deleteProductProvider()
        // echo json_encode($response);

    

    }
// }
