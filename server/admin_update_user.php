<?php
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

// Check if the user is logged in as an admin
if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$id = $conn->real_escape_string($data['id']);
$username = $conn->real_escape_string($data['username']);
$email = $conn->real_escape_string($data['email']);

$query = "UPDATE usertblaccounts SET username = '$username', email = '$email' WHERE id = $id";

if ($conn->query($query)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}