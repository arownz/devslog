<?php
require_once 'config.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

// Check if the user is logged in as an admin
if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$query = "SELECT id, username, email, profile_image, created_at FROM usertblaccounts ORDER BY created_at DESC";
$result = $conn->query($query);

$users = [];
while ($row = $result->fetch_assoc()) {
    // Encode the profile image as base64 if it exists
    if (!is_null($row['profile_image'])) {
        $row['profile_image'] = base64_encode($row['profile_image']);
    }
    $users[] = $row;
}

echo json_encode($users);
?>
