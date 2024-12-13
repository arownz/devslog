<?php
require_once 'config.php';
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/devslog/server/php_errors.log');

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

header("Content-Type: application/json");

// Debug: Log the request method
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');

    // Debug: Log the raw input
    error_log("Raw input: " . $input);
    $data = json_decode($input);

    // Debug: Log the decoded data
    error_log("Decoded data: " . print_r($data, true));
    if (isset($data->action) && $data->action === 'login') {
        $email = $conn->real_escape_string($data->email);
        $password = $data->password;

        $sql = "SELECT * FROM admintblaccounts WHERE email = '$email'";
        $result = $conn->query($sql);

        // Debug: Log the SQL query and result
        error_log("SQL query: " . $sql);
        error_log("Query result: " . print_r($result, true));
        if ($result === false) {
            echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
            exit;
        }

        if ($result->num_rows > 0) {
            $admin = $result->fetch_assoc();
            if (password_verify($password, $admin['password'])) {
                echo json_encode(["success" => true, "message" => "Login successful", "admin" => ["id" => $admin['id'], "email" => $admin['email']]]);
            } else {
                error_log("Password verification failed for email: $email");
                echo json_encode(["success" => false, "message" => "Invalid password"]);
            }
        } else {
            error_log("Email not found: $email");
            echo json_encode(["success" => false, "message" => "Email not found"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid action"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}

