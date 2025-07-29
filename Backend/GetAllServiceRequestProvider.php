 <?php
    session_start();
    header("Access-Control-Allow-Origin: http://localhost:8080");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json");
    // header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    require_once "./Root/Service.php";


    if (isset($_SESSION['user'])) {
        $user_name = $_SESSION['user']['user_name'];
        $user_id = $_SESSION['user']['user_id'];
        $user_role = $_SESSION['user']['user_role'];

        // echo "$user_name,$user_id,$user_role";

        if ("service_provider" === $user_role) {

            // $getAll = new Service();
            // $response = $getAll->getAllServicesProvider($user_id);
            //  echo json_encode($response);

        
        }
   
    } else {
        echo json_encode([
            "add to cart " => false,
            "message" => "tou need to login first",
            // "user_name" => $_SESSION['user'],
            // "user_id" => $_SESSION['user']['user_id'],
            // "user_role" => $_SESSION['user']['user_role'],
        ]);
        error_log("SESSION FETCHED: " . print_r($_SESSION, true));
    }
