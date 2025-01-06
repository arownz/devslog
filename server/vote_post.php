<?php
session_start();
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User not logged in']);
        exit;
    }

    $post_id = $_POST['post_id'] ?? null;
    $vote_type = $_POST['vote_type'] ?? null;
    $user_id = $_SESSION['user_id'];

    if (!$post_id || !$vote_type) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    try {
        $conn->begin_transaction();

        // Check if the user has already voted on this post
        $stmt = $conn->prepare("SELECT vote_type FROM post_votes WHERE post_id = ? AND user_id = ?");
        $stmt->bind_param("ii", $post_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $existing_vote = $result->fetch_assoc();

        if ($existing_vote) {
            // User has already voted, update their vote
            if ($existing_vote['vote_type'] !== $vote_type) {
                $stmt = $conn->prepare("UPDATE post_votes SET vote_type = ? WHERE post_id = ? AND user_id = ?");
                $stmt->bind_param("sii", $vote_type, $post_id, $user_id);
                $stmt->execute();

                // Update post votes
                $vote_change = ($vote_type === 'upvote') ? 2 : -2;
                $stmt = $conn->prepare("UPDATE posts SET upvotes = upvotes + ?, downvotes = downvotes - ? WHERE id = ?");
                $stmt->bind_param("iii", $vote_change, $vote_change, $post_id);
                $stmt->execute();
            }
        } else {
            // User hasn't voted yet, insert new vote
            $stmt = $conn->prepare("INSERT INTO post_votes (post_id, user_id, vote_type) VALUES (?, ?, ?)");
            $stmt->bind_param("iis", $post_id, $user_id, $vote_type);
            $stmt->execute();

            // Update post votes
            $vote_change = ($vote_type === 'upvote') ? 1 : -1;
            $stmt = $conn->prepare("UPDATE posts SET upvotes = upvotes + ? WHERE id = ?");
            $stmt->bind_param("ii", $vote_change, $post_id);
            $stmt->execute();
        }

        // Get updated vote counts
        $stmt = $conn->prepare("SELECT upvotes, downvotes FROM posts WHERE id = ?");
        $stmt->bind_param("i", $post_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $updated_votes = $result->fetch_assoc();

        $conn->commit();

        echo json_encode(['success' => true, 'upvotes' => $updated_votes['upvotes'], 'downvotes' => $updated_votes['downvotes']]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'An error occurred: ' . $e->getMessage()]);
    } finally {
        $conn->close();
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
