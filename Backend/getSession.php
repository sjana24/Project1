<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");

header("Content-Type: application/json");
// header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if (isset($_SESSION['user'])) {
    echo json_encode([
        "loggedIn" => true,
        "user_name" => $_SESSION['user']['user_name'],
        "user_id" => $_SESSION['user']['user_id'],
        "user_role" => $_SESSION['user']['user_role'],
        
    ]);
    error_log("Session: " . print_r($_SESSION, true));

    // echo " hi ";
} else {
    echo json_encode([
        "loggedIn" => false,
        // "user_name" => $_SESSION['user'],
        // "user_id" => $_SESSION['user']['user_id'],
        // "user_role" => $_SESSION['user']['user_role'],
    ]);
    error_log("SESSION FETCHED: " . print_r($_SESSION, true));

}
