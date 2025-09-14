<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require "./Root/Job.php";

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (isset($_SESSION['user'])) {
    $user_name = $_SESSION['user']['user_name'];
    $user_id = $_SESSION['user']['user_id'];
    $user_role = $_SESSION['user']['user_role'];

    // echo "$user_name,$user_id,$user_role";
    if ("service_provider" === $user_role) {
        $product = new Job();

        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input) {
            echo json_encode(["success" => false, "message" => "Invalid JSON payload"]);
            exit;
        }

        // --- Sanitize ---
        $job_id       =isset($input['job_id']) ?  filter_var($input['job_id'], FILTER_VALIDATE_INT) : null;
        // $product_id   = isset($_POST['product_id']) ? (int) $_POST['product_id'] : null;
        $title        = htmlspecialchars(trim($input['title']), ENT_QUOTES, 'UTF-8');
        $description  = htmlspecialchars(trim($input['description']), ENT_QUOTES, 'UTF-8');
        $requirements = htmlspecialchars(trim($input['requirements']), ENT_QUOTES, 'UTF-8');
        $benefits     = htmlspecialchars(trim($input['benefits']), ENT_QUOTES, 'UTF-8');
        $location     = htmlspecialchars(trim($input['location']), ENT_QUOTES, 'UTF-8');
        $job_type     = htmlspecialchars(trim($input['job_type']), ENT_QUOTES, 'UTF-8');
        $min_salary   = filter_var($input['min_salary'], FILTER_SANITIZE_NUMBER_INT);
        $max_salary   = filter_var($input['max_salary'], FILTER_SANITIZE_NUMBER_INT);
        $salary_range = htmlspecialchars(trim($input['salary_range']), ENT_QUOTES, 'UTF-8');
        $expiry_date  = htmlspecialchars(trim($input['expiry_date']), ENT_QUOTES, 'UTF-8'); // validate separately

        // $expiry_date = htmlspecialchars(trim($input['expiry_date']), ENT_QUOTES, 'UTF-8');

// // ✅ Step 1: Validate only the date part
// $dateOnly = DateTime::createFromFormat('Y-m-d', $expiry_date);

// if (!$dateOnly || $dateOnly->format('Y-m-d') !== $expiry_date) {
//     $errors[] = "Invalid expiry date format. Use Y-m-d.";
// } else {
//     // ✅ Step 2: Convert to full datetime with default time
//     $expiry_date = $dateOnly->format('Y-m-d') . " 00:00:00";
// }

        // --- Validate ---
        $errors = [];
        $expiry_date = htmlspecialchars(trim($input['expiry_date']), ENT_QUOTES, 'UTF-8');

// validate format (YYYY-MM-DD)
$dateOnly = DateTime::createFromFormat('Y-m-d', $expiry_date);

if (!$dateOnly || $dateOnly->format('Y-m-d') !== $expiry_date) {
    $errors[] = "Invalid expiry date format. Use Y-m-d.";
} else {
    // ✅ Compare only dates (ignore time)
    $today = new DateTime('today'); // midnight today
    if ($dateOnly < $today) {
        $errors[] = "Expiry date cannot be in the past.";
    } 
    else {
        // ✅ If valid, store with default time
        // $expiry_date = $dateOnly->format('Y-m-d') . " 00:00:00";
        $expiry_date1=$dateOnly->format('Y-m-d');
    }
}


        // if (!$job_id) {
        //     $errors[] = "Invalid job ID.";
        // }
        if (empty($title) || strlen($title) < 3) {
            $errors[] = "Job title must be at least 3 characters.";
        }
        if (empty($description)) {
            $errors[] = "Job description is required.";
        }
        if (!in_array($job_type, ["Full Time", "Part Time", "Contract", "Internship"])) {
            $errors[] = "Invalid job type.";
        }
        if (!is_numeric($min_salary) || !is_numeric($max_salary)) {
            $errors[] = "Salary values must be numbers.";
        } elseif ($min_salary > $max_salary) {
            $errors[] = "Min salary cannot be greater than max salary.";
        }
        // if (!DateTime::createFromFormat('Y-m-d H:i:s', $expiry_date)) {
        //     $errors[] = "Invalid expiry date format. Use Y-m-d H:i:s.";
        // }

        if (!empty($errors)) {
            echo json_encode(["success" => false, "errors" => $errors]);
            exit;
        }
//  echo $expiry_date1;

        $job = new Job();
        if ($job_id === null){
        $response=$job->addJobProvider($user_id,$title,$description,$requirements,$benefits,$location,$job_type,$expiry_date1,$min_salary,$max_salary);
        }
        else{
        $response = $job->editJobProvider($job_id, $user_id, $title, $description, $requirements, $benefits, $location, $job_type, $expiry_date, $min_salary, $max_salary);
        }
        // print_r($response);
        echo json_encode($response);
    }
}
