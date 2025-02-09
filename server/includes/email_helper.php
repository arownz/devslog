<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

function sendVerificationEmail($userEmail, $token, $username) {
    $mail = new PHPMailer(true);
    
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'pasionharold01@gmail.com'; // Your Gmail
        $mail->Password = 'xwhe hszw zick ylqf'; // Gmail App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('pasionharold01@gmail.com', 'Devslog');
        $mail->addAddress($userEmail);
        
        $mail->isHTML(true);
        $mail->Subject = 'Verify Your Devslog Account';
        $verificationLink = "http://localhost:5173/verify-email?token=" . $token;
        
        $mail->Body = "
            <h2>Welcome to Devslog, $username!</h2>
            <p>Please click the link below to verify your email address:</p>
            <a href='$verificationLink'>Verify Email</a>
            <p>This link will expire in 24 hours.</p>
        ";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mail Error: {$mail->ErrorInfo}");
        return false;
    }
}