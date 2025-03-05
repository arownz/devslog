<?php
// filepath: /c:/xampp/htdocs/devslog/server/verify_password.php
require_once 'config.php';

// Set timezone explicitly to match your database server
date_default_timezone_set('Asia/Manila');

// Enable detailed error logging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'password_reset_errors.log');

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type");

// Function to send JSON response and exit
function sendJSON($success, $message, $redirect = null) {
    $response = ['success' => $success, 'message' => $message];
    if ($redirect) {
        $response['redirect'] = $redirect;
    }
    echo json_encode($response);
    exit;
}

try {
    // Log the request for debugging
    error_log("Password verification request received with token: " . ($_GET['token'] ?? 'none'));
    
    $token = $_GET['token'] ?? null;
    
    if (!$token) {
        error_log("No token provided in request");
        sendJSON(false, 'Invalid token');
    }
    
    // Debug: Log current time and format
    $now = date('Y-m-d H:i:s');
    error_log("Current server time: $now");
    
    // Get token info with debug info
    $checkStmt = $conn->prepare("SELECT token, expires_at, used FROM password_reset_tokens WHERE token = ?");
    $checkStmt->bind_param("s", $token);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        error_log("Token not found in database: " . $token);
        sendJSON(false, 'Token not found in database');
    }
    
    $tokenData = $result->fetch_assoc();
    error_log("Found token: " . $token);
    error_log("Token expiration: " . $tokenData['expires_at']);
    error_log("Token used status: " . $tokenData['used']);
    
    // Check if token is used
    if ($tokenData['used'] == 1) {
        error_log("Token already used: " . $token);
        sendJSON(false, 'Token already used');
    }
    
    // Check if token is expired - with explicit time comparison
    if (strtotime($tokenData['expires_at']) <= time()) {
        error_log("Token expired: " . $tokenData['expires_at'] . " vs current time: " . date('Y-m-d H:i:s'));
        sendJSON(false, 'Token expired');
    }
    
    // Get full token info with user data
    $stmt = $conn->prepare(
        "SELECT prt.*, u.email, u.username 
         FROM password_reset_tokens prt
         JOIN usertblaccounts u ON prt.user_id = u.id
         WHERE prt.token = ?"
    );
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        error_log("User data not found for token: " . $token);
        sendJSON(false, 'User data not found');
    }
    
    $tokenInfo = $result->fetch_assoc();
    error_log("Processing password update for user: " . $tokenInfo['username']);
    
    // Update the user's password
    $stmt = $conn->prepare("UPDATE usertblaccounts SET password = ? WHERE id = ?");
    $stmt->bind_param("si", $tokenInfo['new_password_hash'], $tokenInfo['user_id']);
    
    if (!$stmt->execute()) {
        error_log("Failed to update password: " . $conn->error);
        sendJSON(false, 'Failed to update password: ' . $conn->error);
    }
    
    // Mark token as used
    $stmt = $conn->prepare("UPDATE password_reset_tokens SET used = 1 WHERE id = ?");
    $stmt->bind_param("i", $tokenInfo['id']);
    if (!$stmt->execute()) {
        error_log("Failed to mark token as used: " . $conn->error);
        // Continue anyway since password was changed
    }
    
    error_log("Password successfully updated for user: " . $tokenInfo['username']);
    
    // Send success response
    sendJSON(true, 'Password has been updated successfully', '/signin');
    
} catch (Exception $e) {
    error_log("Exception during password verification: " . $e->getMessage());
    sendJSON(false, 'Error: ' . $e->getMessage());
}