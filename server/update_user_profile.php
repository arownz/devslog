<?php
require_once 'config.php';

// Set session options BEFORE starting the session
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'true');

// Now start the session
session_start();

require_once 'includes/email_helper.php';  // Include the email helper

// Error handling - capture all errors
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors directly
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');  // Add this to log errors to a file

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Function to send JSON and exit
function sendJSON($success, $message, $data = null) {
    $response = ['success' => $success, 'message' => $message];
    if ($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    sendJSON(false, 'Unauthorized');
}

$user_id = $_SESSION['user_id'];

try {
    $username = $_POST['username'] ?? null;
    $email = $_POST['email'] ?? null;
    $current_password = $_POST['current_password'] ?? null;
    $new_password = $_POST['new_password'] ?? null;

    // Start building the query for profile updates
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
            sendJSON(false, 'Invalid file type. Only JPEG, PNG and GIF allowed.');
        }
        
        $max_size = 5 * 1024 * 1024; // 5MB
        if ($_FILES['profile_image']['size'] > $max_size) {
            sendJSON(false, 'File too large. Maximum size is 5MB.');
        }
        
        $updateFields[] = "profile_image = ?";
        $params[] = file_get_contents($_FILES['profile_image']['tmp_name']);
        $types .= 's';
    }

    // Special handling for password change - using email verification
    if ($current_password && $new_password) {
        // First verify the current password
        $stmt = $conn->prepare("SELECT password, email, username FROM usertblaccounts WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if (!$user || !password_verify($current_password, $user['password'])) {
            sendJSON(false, 'Current password is incorrect');
        }

        // Generate a unique token
        $token = bin2hex(random_bytes(32));

        // Set timezone explicitly before creating expiration timestamp
        date_default_timezone_set('Asia/Manila');

        // Extend expiration time to 24 hours for testing (instead of just 1 hour)
        $expires = date('Y-m-d H:i:s', time() + 86400); // 24 hours expiry
        
        // Store the token and new password hash in the database
        $stmt = $conn->prepare("INSERT INTO password_reset_tokens (user_id, token, new_password_hash, expires_at) VALUES (?, ?, ?, ?)");
        $new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);
        $stmt->bind_param("isss", $user_id, $token, $new_password_hash, $expires);
        
        if (!$stmt->execute()) {
            sendJSON(false, 'Failed to initiate password change');
        }

        // Send password reset email using our helper function
        $emailSent = sendPasswordResetEmail($user['email'], $token, $user['username']);
        
        if ($emailSent) {
            sendJSON(true, 'Please check your email to confirm the password change.');
        } else {
            // If email fails, log it and provide a response
            error_log("Failed to send password reset email to: " . $user['email']);
            sendJSON(false, 'Failed to send verification email. Please try again later.');
        }
    }

    // Handle normal profile updates (if we didn't already exit due to password change)
    if (empty($updateFields)) {
        sendJSON(false, 'No fields to update');
    }

    // Add user_id to params
    $params[] = $user_id;
    $types .= 'i';

    $query = "UPDATE usertblaccounts SET " . implode(", ", $updateFields) . " WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        sendJSON(true, 'Profile updated successfully');
    } else {
        sendJSON(false, 'Failed to update profile');
    }
    
} catch (Exception $e) {
    error_log("Update profile error: " . $e->getMessage());
    sendJSON(false, 'Error: ' . $e->getMessage());
}
