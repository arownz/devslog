<?php
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $postId = $_GET['id'];

    $stmt = $conn->prepare("
        SELECT p.*, u.username as author, u.profile_image as author_profile_image,
               COALESCE(SUM(CASE WHEN pv.vote_type = 'upvote' THEN 1 ELSE 0 END), 0) as upvotes,
               COALESCE(SUM(CASE WHEN pv.vote_type = 'downvote' THEN 1 ELSE 0 END), 0) as downvotes
        FROM posts p
        JOIN usertblaccounts u ON p.user_id = u.id
        LEFT JOIN post_votes pv ON p.id = pv.post_id
        WHERE p.id = ?
        GROUP BY p.id
    ");
    $stmt->bind_param("i", $postId);
    $stmt->execute();
    $result = $stmt->get_result();
    $post = $result->fetch_assoc();

    if ($post) {
        $post['thumbnail'] = base64_encode($post['thumbnail']);
        $post['author_profile_image'] = $post['author_profile_image'] ? base64_encode($post['author_profile_image']) : null;

        $commentStmt = $conn->prepare("
            SELECT c.*, u.username as author, u.profile_image as author_profile_image 
            FROM comments c 
            JOIN usertblaccounts u ON c.user_id = u.id 
            WHERE c.post_id = ? 
            ORDER BY c.created_at DESC
        ");
        $commentStmt->bind_param("i", $postId);
        $commentStmt->execute();
        $commentResult = $commentStmt->get_result();
        $comments = $commentResult->fetch_all(MYSQLI_ASSOC);

        // Encode profile images for comments
        foreach ($comments as &$comment) {
            $comment['author_profile_image'] = $comment['author_profile_image'] ? base64_encode($comment['author_profile_image']) : null;
        }

        echo json_encode(['success' => true, 'post' => $post, 'comments' => $comments]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Post not found']);
    }

    $stmt->close();
    $commentStmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}