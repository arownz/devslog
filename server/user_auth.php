<?php
require_once 'config.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Get the content type of the request
$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

// If it's a JSON request, decode the input
if (strcasecmp($contentType, 'application/json') == 0) {
    $content = trim(file_get_contents("php://input"));
    $decoded = json_decode($content, true);

    // If json_decode failed, the JSON is invalid
    if(!is_array($decoded)) {
        echo json_encode(["success" => false, "message" => "Invalid JSON"]);
        exit;
    }
} else {
    // For non-JSON requests, use $_POST
    $decoded = $_POST;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = isset($decoded['action']) ? $decoded['action'] : null;

    if ($action) {
        if ($action === 'register') {
            $username = $conn->real_escape_string($decoded['username']);
            $email = $conn->real_escape_string($decoded['email']);
            $password = password_hash($decoded['password'], PASSWORD_DEFAULT);

            // Handle profile image as base64
            $profile_image = null;
            if (isset($decoded['profile_image']) && !empty($decoded['profile_image'])) {
                $profile_image = $decoded['profile_image'];
            }

            $sql = "INSERT INTO usertblaccounts (username, email, password, profile_image) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssss", $username, $email, $password, $profile_image);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "User registered successfully"]);
            } else {
                echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
            }
            $stmt->close();
        } elseif ($action === 'login') {
            $email = $conn->real_escape_string($decoded['email']);
            $password = $decoded['password'];

            $sql = "SELECT * FROM usertblaccounts WHERE email = '$email'";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                if (password_verify($password, $user['password'])) {
                    // Password is correct
                    unset($user['password']); // Remove password from user data
                    echo json_encode(["success" => true, "message" => "Login successful", "user" => $user]);
                } else {
                    // Password is incorrect
                    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
                }
            } else {
                // No user found with that email
                echo json_encode(["success" => false, "message" => "Invalid email or password"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Invalid action"]);
        }

    } else {
        echo json_encode(["success" => false, "message" => "Action not specified"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}