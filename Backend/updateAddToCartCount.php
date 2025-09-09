<?php
  session_start();
    header("Access-Control-Allow-Origin: http://localhost:8080");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json");
    // header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    require_once "./Root/Cart.php";


    if (isset($_SESSION['user'])) {
        
        $user_name = $_SESSION['user']['user_name'];
        $user_id = $_SESSION['user']['user_id'];
        $user_role = $_SESSION['user']['user_role'];

        echo "$user_name,$user_id,$user_role";



        // Get JSON input and decode it as an associative array
        $data = json_decode(file_get_contents("php://input"), true);
        $product_id=$data['product_id'];
        $quantity=$data['quantity'];
        // echo " <\n>snvsnv",$product_id,$quantity;
$update=new Cart();
        $responce=$update->updateCartItemQuantity($user_id,9,$quantity);
        echo JSON_encode($responce);



    }
    else{
        echo "kjsdnkjds";
    }
?>
