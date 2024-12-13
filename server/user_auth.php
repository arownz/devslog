<?php
require_once 'config.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents(filename: "php://input"));
    
    if (isset($data->action)) {
        if ($data->action === 'register') {
            $username = $conn->real_escape_string($data->username);
            $email = $conn->real_escape_string($data->email);
            $password = password_hash($data->password, PASSWORD_DEFAULT);
            
            $sql = "INSERT INTO usertblaccounts (username, email, password) VALUES ('$username', '$email', '$password')";
            
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["success" => true, "message" => "User registered successfully"]);
            } else {
                echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
            }
        } elseif ($data->action === 'login') {
            $email = $conn->real_escape_string($data->email);
            $password = $data->password;
            
            $sql = "SELECT * FROM usertblaccounts WHERE email = '$email'";
            $result = $conn->query($sql);
            
            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                if (password_verify($password, $user['password'])) {
                    echo json_encode(["success" => true, "message" => "Login successful", "user" => $user]);
                } else {
                    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
                }
            } else {
                echo json_encode(value: ["success" => false, "message" => "Invalid email or password"]);
            }
        }
    }
}

$conn->close();