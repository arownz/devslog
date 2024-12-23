<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require 'config.php';

session_start(); // Start the session to access session variables

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT id, title, content, thumbnail, created_at, upvotes, downvotes FROM posts WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$posts = [];
while ($row = $result->fetch_assoc()) {
    $posts[] = [
        'id' => $row['id'],
        'title' => $row['title'],
        'content' => $row['content'],
        'image' => $row['thumbnail'],
        'time' => $row['created_at'],
        'upvotes' => $row['upvotes'],
        'downvotes' => $row['downvotes'],
        'comments' => 0, // You might want to fetch the actual number of comments
        'author' => 'Author Name', // Replace with actual author name if available
    ];
}

echo json_encode(['success' => true, 'posts' => $posts]);

$stmt->close();
$conn->close();
