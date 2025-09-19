<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "./Root/dBCon.php"; // Assuming a Database class exists
//require_once "./Root/User.php"; // Assuming a User class exists

// Helper function to sanitize input
function sanitize_input($data) {
    if (is_array($data)) {
        return array_map('sanitize_input', $data);
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Function to validate contact number
function validateContactNumber($number) {
    // Basic validation for a 10-digit number
    return preg_match('/^\d{10}$/', $number);
}

// Function to validate business registration number
function validateBusinessRegistrationNumber($number) {
    // Simple validation, can be more complex
    return preg_match('/^[a-zA-Z0-9]{1,100}$/', $number);
}

// Get user role from session
$user_role = isset($_SESSION['user']['user_role']) ? $_SESSION['user']['user_role'] : null;
$user_id = isset($_SESSION['user']['user_id']) ? $_SESSION['user']['user_id'] : null;

// Ensure user is logged in
if (!$user_id) {
    echo json_encode([
        'success' => false,
        'message' => 'User not logged in.'
    ]);
    exit();
}

$db = new Database();
$conn = $db->connect();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Handle GET request to fetch current user data
    $response = ['success' => false, 'data' => null, 'message' => ''];
    $sql = "";

    switch ($user_role) {
        case 'customer':
            $sql = "SELECT u.username, u.email, c.contact_number FROM user u JOIN customer c ON u.user_id = c.user_id WHERE u.user_id = ?";
            break;
        case 'service_provider':
            $sql = "SELECT u.username, u.email, sp.contact_number, sp.address, sp.district, sp.company_name, sp.business_registration_number, sp.company_description, sp.website FROM user u JOIN service_provider sp ON u.user_id = sp.user_id WHERE u.user_id = ?";
            break;
        case 'admin':
            $sql = "SELECT u.username, u.email FROM user u JOIN admin a ON u.user_id = a.user_id WHERE u.user_id = ?";
            break;
        default:
            $response['message'] = 'Invalid user role.';
            echo json_encode($response);
            exit();
    }

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $userData = $result->fetch_assoc();
        $response['success'] = true;
        $response['data'] = $userData;
        $response['message'] = 'User data fetched successfully.';
    } else {
        $response['message'] = 'User data not found.';
    }

    $stmt->close();
    echo json_encode($response);
    exit();

} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Handle PUT request to update user data
    $response = ['success' => false, 'message' => ''];
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['formData'])) {
        $response['message'] = 'Missing formData in request.';
        echo json_encode($response);
        exit();
    }

    $formData = sanitize_input($data['formData']);
    $user = new User();

    // Start a transaction for atomicity
    $conn->begin_transaction();

    try {
        // Validate and update user table data
        $errors = [];
        $username = isset($formData['username']) ? $formData['username'] : null;
        $email = isset($formData['email']) ? $formData['email'] : null;

        if ($username && $user->updateUsername($user_id, $username)) {
            // Update successful
        } else if ($username) {
            $errors[] = "Failed to update username.";
        }
        
        if ($email && $user->updateEmail($user_id, $email)) {
            // Update successful
        } else if ($email) {
            $errors[] = "Failed to update email or email already exists.";
        }

        // Validate and update role-specific data
        switch ($user_role) {
            case 'customer':
                $contact_number = isset($formData['contact_number']) ? $formData['contact_number'] : null;
                if ($contact_number && validateContactNumber($contact_number)) {
                    $sql = "UPDATE customer SET contact_number = ? WHERE user_id = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("si", $contact_number, $user_id);
                    if (!$stmt->execute()) {
                        $errors[] = "Failed to update customer contact number.";
                    }
                    $stmt->close();
                } else if ($contact_number) {
                    $errors[] = "Invalid contact number format.";
                }
                break;

            case 'service_provider':
                $contact_number = isset($formData['contact_number']) ? $formData['contact_number'] : null;
                $address = isset($formData['address']) ? $formData['address'] : null;
                $district = isset($formData['district']) ? $formData['district'] : null;
                $company_name = isset($formData['company_name']) ? $formData['company_name'] : null;
                $business_registration_number = isset($formData['business_registration_number']) ? $formData['business_registration_number'] : null;
                $company_description = isset($formData['company_description']) ? $formData['company_description'] : null;
                $website = isset($formData['website']) ? $formData['website'] : null;

                $sql = "UPDATE service_provider SET contact_number = ?, address = ?, district = ?, company_name = ?, business_registration_number = ?, company_description = ?, website = ? WHERE user_id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("sssssssi", $contact_number, $address, $district, $company_name, $business_registration_number, $company_description, $website, $user_id);
                
                // Add more specific validation for service provider fields
                if ($contact_number && !validateContactNumber($contact_number)) {
                    $errors[] = "Invalid contact number format.";
                }
                if ($business_registration_number && !validateBusinessRegistrationNumber($business_registration_number)) {
                    $errors[] = "Invalid business registration number.";
                }
                if (!empty($errors)) {
                     $conn->rollback();
                     echo json_encode(['success' => false, 'errors' => $errors]);
                     exit();
                }

                if (!$stmt->execute()) {
                    $errors[] = "Failed to update service provider details.";
                }
                $stmt->close();
                break;
        }

        if (empty($errors)) {
            $conn->commit();
            $response['success'] = true;
            $response['message'] = 'Profile updated successfully.';
        } else {
            $conn->rollback();
            $response['errors'] = $errors;
            $response['message'] = 'Failed to update profile.';
        }

    } catch (Exception $e) {
        $conn->rollback();
        $response['message'] = 'An error occurred: ' . $e->getMessage();
    }

    $conn->close();
    echo json_encode($response);
    exit();
}

$conn->close();
?>