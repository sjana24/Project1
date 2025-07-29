<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "./Root/Job.php";

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Helper function to sanitize input
function sanitize_input($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Validate session and role
if (isset($_SESSION['user'])) {
    $user_name = $_SESSION['user']['user_name'];
    $user_id = $_SESSION['user']['user_id'];
    $user_role = $_SESSION['user']['user_role'];

    if ($user_role === "service_provider") {
        // Decode JSON input
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['formData'])) {
            echo json_encode([
                'success' => false,
                'error' => 'Missing formData in request.'
            ]);
            exit();
        }

        $form = $data['formData'];
        $job_id = $data['job_id'];

        // Sanitize inputs
        $title        = isset($form['title']) ? sanitize_input($form['title']) : '';
        $description  = isset($form['description']) ? sanitize_input($form['description']) : '';
        $requirements = isset($form['requirements']) ? sanitize_input($form['requirements']) : '';
        $benefits     = isset($form['benefits']) ? sanitize_input($form['benefits']) : '';
        $location     = isset($form['location']) ? sanitize_input($form['location']) : '';
        $job_type     = isset($form['job_type']) ? sanitize_input($form['job_type']) : '';
        $expiryDate   = isset($form['expiryDate']) ? sanitize_input($form['expiryDate']) : '';
        $salary       = isset($form['salary']) ? floatval($form['salary']) : 0;

        // Validation
        $errors = [];

        if ($title === '') $errors[] = "Title is required.";
        if ($description === '') $errors[] = "Description is required.";
        if ($requirements === '') $errors[] = "Requirements are required.";
        if ($benefits === '') $errors[] = "Benefits are required.";
        if ($location === '') $errors[] = "Location is required.";
        if ($job_type === '') $errors[] = "Job type is required.";
        if ($expiryDate === '') $errors[] = "Expiry date is required.";
        if ($salary <= 0) $errors[] = "Salary must be a positive number.";

        if (!empty($errors)) {
            echo json_encode([
                'success' => false,
                'errors' => $errors
            ]);
            exit();
        }

        $updateJob=new Job();
        $response=$updateJob->updateJob($job_id,$user_id, $title, $description, $requirements, $benefits, $location, $job_type, $expiryDate, $salary);
        echo json_encode($response);
        // Continue (e.g., insert into DB using Job class)
        // echo json_encode([
        //     'success' => true,
        //     'message' => 'Validated and sanitized successfully.',
        //     'data' => [
        //         'title' => $title,
        //         'description' => $description,
        //         'requirements' => $requirements,
        //         'benefits' => $benefits,
        //         'location' => $location,
        //         'job_type' => $job_type,
        //         'expiryDate' => $expiryDate,
        //         'salary' => $salary
        //     ]
        // ]);
    }
}
