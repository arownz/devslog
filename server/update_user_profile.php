<?php
require_once 'config.php';
session_start();

ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'true');

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");


if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    $username = $_POST['username'] ?? null;
    $email = $_POST['email'] ?? null;
    $current_password = $_POST['current_password'] ?? null;
    $new_password = $_POST['new_password'] ?? null;

    // Start building the query
    $updateFields = [];
    $params = [];
    $types = '';

    if ($username) {
        $updateFields[] = "username = ?";
        $params[] = $username;
        $types .= 's';
    }

    if ($email) {
        $updateFields[] = "email = ?";
        $params[] = $email;
        $types .= 's';
    }

    // Handle profile image
    if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $file_type = $_FILES['profile_image']['type'];
        
        if (!in_array($file_type, $allowed_types)) {
            echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPEG, PNG and GIF allowed.']);
            exit;
        }
        
        $max_size = 5 * 1024 * 1024; // 5MB
        if ($_FILES['profile_image']['size'] > $max_size) {
            echo json_encode(['success' => false, 'message' => 'File too large. Maximum size is 5MB.']);
            exit;
        }
        
        $updateFields[] = "profile_image = ?";
        $params[] = file_get_contents($_FILES['profile_image']['tmp_name']);
        $types .= 's';
    }

    // Handle password update
    if ($current_password && $new_password) {
        // Verify current password
        $stmt = $conn->prepare("SELECT password FROM usertblaccounts WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if (password_verify($current_password, $user['password'])) {
            $updateFields[] = "password = ?";
            $params[] = password_hash($new_password, PASSWORD_DEFAULT);
            $types .= 's';
        } else {
            echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
            exit;
        }
    }

    if (empty($updateFields)) {
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        exit;
    }

    // Add user_id to params
    $params[] = $user_id;
    $types .= 'i';

    $query = "UPDATE usertblaccounts SET " . implode(", ", $updateFields) . " WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
