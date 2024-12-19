<?php
require_once 'config.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input);

    if (isset($data->action)) {
        if ($data->action === 'register') {
            $username = $conn->real_escape_string($_POST['username']);
            $email = $conn->real_escape_string($_POST['email']);
            $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

            // Handle profile image upload
            $profile_image = null;
            if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
                $upload_dir = '../uploads/';
                $image_name = uniqid() . '_' . basename($_FILES['profile_image']['name']);
                $upload_file = $upload_dir . $image_name;

                if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $upload_file)) {
                    $profile_image = $image_name;
                } else {
                    echo json_encode(["success" => false, "message" => "Failed to upload image"]);
                    exit;
                }
            }

            $sql = "INSERT INTO usertblaccounts (username, email, password, profile_image) VALUES ('$username', '$email', '$password', '$profile_image')";
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
                    // Include profile image URL in the response
                    $user['profile_image_url'] = $user['profile_image'] ? 'http://localhost/devslog/uploads/' . $user['profile_image'] : null;
                    echo json_encode(["success" => true, "message" => "Login successful", "user" => $user]);
                } else {
                    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
                }
            } else {
                echo json_encode(["success" => false, "message" => "User not found"]);
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

$conn->close();