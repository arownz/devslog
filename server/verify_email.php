<?php
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (isset($_GET['token'])) {
    $token = $_GET['token'];
    
    try {
        // Start transaction
        $conn->begin_transaction();

        // First check if token exists and is valid
        $stmt = $conn->prepare("
            SELECT ev.user_id, ev.expires_at, ev.verified as token_verified, 
                   u.verified as user_verified
            FROM email_verification ev
            JOIN usertblaccounts u ON ev.user_id = u.id
            WHERE ev.token = ?
        ");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();
        $verification = $result->fetch_assoc();

        // Add debug logging
        error_log("Verification data: " . json_encode($verification));

        if (!$verification) {
            throw new Exception("Invalid token");
        }

        if (strtotime($verification['expires_at']) < time()) {
            throw new Exception("Verification link has expired");
        }

        // If already verified, return success without updating
        if ($verification['token_verified'] && $verification['user_verified']) {
            echo json_encode([
                "success" => true,
                "message" => "Email already verified!",
                "alreadyVerified" => true
            ]);
            exit;
        }

        // Update email_verification table
        $stmt = $conn->prepare("
            UPDATE email_verification 
            SET verified = 1 
            WHERE token = ?
        ");
        $stmt->bind_param("s", $token);
        $stmt->execute();

        // Update user's verified status
        $stmt = $conn->prepare("
            UPDATE usertblaccounts 
            SET verified = 1 
            WHERE id = ?
        ");
        $stmt->bind_param("i", $verification['user_id']);
        $stmt->execute();

        $conn->commit();
        echo json_encode([
            "success" => true,
            "message" => "Email verified successfully!"
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        error_log("Verification error: " . $e->getMessage());
        echo json_encode([
            "success" => false,
            "message" => $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        "success" => false, 
        "message" => "No token provided"
    ]);
}
