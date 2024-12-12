<?php
require_once 'config.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->action) && $data->action === 'login') {
        $email = $conn->real_escape_string($data->email);
        $password = $data->password;

        $sql = "SELECT * FROM admintblaccounts WHERE email = '$email'";
        $result = $conn->query($sql);

        if ($result === false) {
            echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
            exit;
        }

        if ($result->num_rows > 0) {
            $admin = $result->fetch_assoc();
            if (password_verify($password, $admin['password'])) {
                echo json_encode(["success" => true, "message" => "Login successful", "admin" => ["id" => $admin['id'], "email" => $admin['email']]]);
            } else {
                echo json_encode(["success" => false, "message" => "Invalid email or password"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Invalid email or password"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid action"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}