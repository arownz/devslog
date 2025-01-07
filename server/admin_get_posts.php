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

$query = "SELECT id, title, content, author, created_at, updated_at, thumbnail FROM posts ORDER BY updated_at DESC";
$result = $conn->query($query);

$posts = [];
while ($row = $result->fetch_assoc()) {
    // Convert thumbnail to base64
    if ($row['thumbnail']) {
        $row['thumbnail'] = base64_encode($row['thumbnail']);
    }
    $posts[] = $row;
}

echo json_encode($posts);
