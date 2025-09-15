 <?php
    session_start();
    header("Access-Control-Allow-Origin: http://localhost:8080");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json");
    // header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    require_once "./Root/Admin.php";


    // echo "h";
    // $data = json_decode(file_get_contents("php://input"), true);
    // $email = filter_var($data->email,FILTER_SANITIZE_EMAIL);
    // echo "$data";
    // $provider_id = htmlspecialchars(strip_tags($data['providerid']));
    // echo "$provider_id";

    // $getAll=new Product();
    // $response=$getAll->getAllProductsProvider();

    // echo json_encode($response);

    if (isset($_SESSION['user'])) {
        $user_name = $_SESSION['user']['user_name'];
        $user_id = $_SESSION['user']['user_id'];
        $user_role = $_SESSION['user']['user_role'];

        // echo "$user_name,$user_id,$user_role";

        if ("admin" === $user_role) {

            $admin = new Admin();
            $response = $admin->getAllProviders();
             echo json_encode($response);

      
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
