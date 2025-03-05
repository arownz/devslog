<?php
// filepath: /c:/xampp/htdocs/devslog/server/forgot_password.php
require_once 'config.php';
require_once 'includes/email_helper.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Function to send JSON response and exit
function sendJSON($success, $message) {
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(false, 'Invalid request method');
}

// Get the JSON data from the request
$json = file_get_contents('php://input');
$data = json_decode($json);

if (!$data || !isset($data->email)) {
    sendJSON(false, 'Email address required');
}

$email = filter_var($data->email, FILTER_VALIDATE_EMAIL);

if (!$email) {
    sendJSON(false, 'Invalid email format');
}

try {
    // Check if user with this email exists
    $stmt = $conn->prepare("SELECT id, username, email FROM usertblaccounts WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        // Don't reveal that email doesn't exist for security reasons
        sendJSON(true, 'If your email exists in our system, you will receive a password reset link shortly.');
        exit;
    }
    
    $user = $result->fetch_assoc();
    $user_id = $user['id'];
    $username = $user['username'];
    
    // Generate a unique token
    $token = bin2hex(random_bytes(32));
    
    // Set timezone explicitly
    date_default_timezone_set('Asia/Manila');
    
    // Set token expiration (24 hours)
    $expires = date('Y-m-d H:i:s', time() + 86400);
    
    // Delete any existing reset tokens for this user
    $stmt = $conn->prepare("DELETE FROM password_reset_tokens WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    
    // Store the token in the database
    $stmt = $conn->prepare("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $user_id, $token, $expires);
    
    if (!$stmt->execute()) {
        sendJSON(false, 'Failed to process your request. Please try again later.');
        exit;
    }
    
    // Send a password reset email
    $emailSent = sendPasswordResetEmail($email, $token, $username);
    
    if (!$emailSent) {
        sendJSON(false, 'Failed to send password reset email. Please try again later.');
        exit;
    }
    
    // Success response
    sendJSON(true, 'A password reset link has been sent to your email address. Please check your inbox and spam folder.');
    
} catch (Exception $e) {
    error_log('Forgot password error: ' . $e->getMessage());
    sendJSON(false, 'An error occurred. Please try again later.');
}