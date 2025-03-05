<?php
// filepath: /c:/xampp/htdocs/devslog/server/reset_password.php
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Function to send JSON response
function sendJSON($success, $message) {
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

// Set timezone explicitly
date_default_timezone_set('Asia/Manila');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(false, 'Invalid request method');
}

// Get the JSON data from the request
$json = file_get_contents('php://input');
$data = json_decode($json);

if (!$data || !isset($data->token) || !isset($data->password)) {
    sendJSON(false, 'Missing required fields');
}

$token = $data->token;
$password = $data->password;

// Validate password
if (strlen($password) < 6) {
    sendJSON(false, 'Password must be at least 6 characters long');
}

try {
    // Begin transaction
    $conn->begin_transaction();
    
    // Check if token exists and is valid
    $stmt = $conn->prepare("SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0 AND expires_at > NOW()");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $conn->rollback();
        sendJSON(false, 'Invalid or expired token');
    }
    
    $tokenData = $result->fetch_assoc();
    $userId = $tokenData['id'];
    
    // Hash the new password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    // Update the user's password
    $stmt = $conn->prepare("UPDATE usertblaccounts SET password = ? WHERE id = ?");
    $stmt->bind_param("si", $passwordHash, $tokenData['user_id']);
    
    if (!$stmt->execute()) {
        $conn->rollback();
        sendJSON(false, 'Failed to update password');
    }
    
    // Mark the token as used
    $stmt = $conn->prepare("UPDATE password_reset_tokens SET used = 1 WHERE id = ?");
    $stmt->bind_param("i", $tokenData['id']);
    
    if (!$stmt->execute()) {
        $conn->rollback();
        sendJSON(false, 'Failed to update token status');
    }
    
    // Commit the transaction
    $conn->commit();
    
    // Success response
    sendJSON(true, 'Your password has been updated successfully');
    
} catch (Exception $e) {
    // Roll back the transaction if something fails
    $conn->rollback();
    error_log('Password reset error: ' . $e->getMessage());
    sendJSON(false, 'An error occurred. Please try again later.');
}