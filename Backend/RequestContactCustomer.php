<?php
  session_start();
    header("Access-Control-Allow-Origin: http://localhost:8080");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json");
    // header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    require_once "./Root/Chat.php";


    if (isset($_SESSION['user'])) {
        
        $user_name = $_SESSION['user']['user_name'];
        $user_id = $_SESSION['user']['user_id'];
        $user_role = $_SESSION['user']['user_role'];

        // echo "$user_name,$user_id,$user_role";



        // Get JSON input and decode it as an associative array
        $data = json_decode(file_get_contents("php://input"), true);


        // Sanitize each expected field
        $service_id = intval($data['service_id'] ?? 0);
        $provider_id = intval($data['provider_id'] ?? 0);


        $getChat=new Chat();
        $response=$getChat->sendRequestContactCustomer($service_id,$user_id,$provider_id);
        echo json_encode($response);
        // Example: return sanitized data as JSON for testing
        // echo json_encode([
        //     'service_id' => $service_id,
        //     'provider_id' => $provider_id,
            
        // ]);

    }
    else{
        echo "kjsdnkjds";
    }
?>
