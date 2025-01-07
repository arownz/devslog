<?php
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

// Check if the user is logged in as an admin
if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$id = $conn->real_escape_string($_POST['id']);
$title = $conn->real_escape_string($_POST['title']);
$content = $conn->real_escape_string($_POST['content']);

$query = "UPDATE posts SET title = ?, content = ?";
$params = [$title, $content];

if (isset($_FILES['thumbnail']) && $_FILES['thumbnail']['error'] == 0) {
    $thumbnail = file_get_contents($_FILES['thumbnail']['tmp_name']);
    $query .= ", thumbnail = ?";
    $params[] = $thumbnail;
}

$query .= " WHERE id = ?";
$params[] = $id;

$stmt = $conn->prepare($query);
$types = str_repeat('s', count($params) - 1) . 'i';
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$stmt->close();
$conn->close();