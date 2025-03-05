<?php
// filepath: /c:/xampp/htdocs/devslog/server/validate_reset_token.php
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Function to send JSON response
function sendJSON($success, $message) {
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

// Set timezone explicitly
date_default_timezone_set('Asia/Manila');

if (!isset($_GET['token']) || empty($_GET['token'])) {
    sendJSON(false, 'Missing token parameter');
}

$token = $_GET['token'];

try {
    // Check if token exists and is valid
    $stmt = $conn->prepare("SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0 AND expires_at > NOW()");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        // Check why the token is invalid
        $stmt = $conn->prepare("SELECT * FROM password_reset_tokens WHERE token = ?");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $checkResult = $stmt->get_result();
        
        if ($checkResult->num_rows === 0) {
            sendJSON(false, 'Invalid token');
        } else {
            $tokenData = $checkResult->fetch_assoc();
            
            if ($tokenData['used'] == 1) {
                sendJSON(false, 'This reset link has already been used');
            } else {
                sendJSON(false, 'This reset link has expired');
            }
        }
    } else {
        sendJSON(true, 'Token is valid');
    }
} catch (Exception $e) {
    error_log('Token validation error: ' . $e->getMessage());
    sendJSON(false, 'Error validating token');
}