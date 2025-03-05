<?php
// filepath: /c:/xampp/htdocs/devslog/server/request_password_reset.php
require_once 'config.php';
require_once 'includes/email_helper.php';
session_start();

// Error handling - capture all errors
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

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
    // Get user email and username
    $stmt = $conn->prepare("SELECT email, username FROM usertblaccounts WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user) {
        sendJSON(false, 'User not found');
    }

    // Generate a unique token
    $token = bin2hex(random_bytes(32));
    
    // Set timezone explicitly before creating expiration timestamp
    date_default_timezone_set('Asia/Manila');
    
    // Token expires in 24 hours
    $expires = date('Y-m-d H:i:s', time() + 86400);
    
    // Create a new password hash that will be empty - user will set this when they follow the link
    $new_password_hash = '';
    
    // Store the token in the database
    $stmt = $conn->prepare("INSERT INTO password_reset_tokens (user_id, token, new_password_hash, expires_at) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $user_id, $token, $new_password_hash, $expires);
    
    if (!$stmt->execute()) {
        sendJSON(false, 'Failed to generate password reset token');
    }

    // Send the email with the reset link
    $emailSent = sendPasswordResetEmail($user['email'], $token, $user['username']);
    
    if ($emailSent) {
        sendJSON(true, 'Password reset link has been sent to your email');
    } else {
        // If email fails, log it and provide a response
        error_log("Failed to send password reset email to: " . $user['email']);
        sendJSON(false, 'Failed to send password reset email. Please try again later.');
    }
    
} catch (Exception $e) {
    error_log("Password reset request error: " . $e->getMessage());
    sendJSON(false, 'An error occurred while processing your request');
}