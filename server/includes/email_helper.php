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

function sendPasswordResetEmail($userEmail, $token, $username) {
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
        $mail->Subject = 'Password Reset Request - Devslog';
        
        $resetLink = "http://localhost:5173/reset-password?token=" . $token;
        
        $mail->Body = "
            <html>
            <body style='font-family: Arial, sans-serif; line-height: 1.6;'>
                <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;'>
                    <h2 style='color: #4CAF50;'>Password Reset Request</h2>
                    <p>Hello {$username},</p>
                    <p>We received a request to reset your password. To create a new password, please click the button below:</p>
                    <p style='text-align: center;'>
                        <a href='{$resetLink}' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;'>Reset Password</a>
                    </p>
                    <p>Or copy and paste this link in your browser:</p>
                    <p>{$resetLink}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't request a password reset, you can ignore this email and your password will remain unchanged.</p>
                    <p>Best regards,<br>The Devslog Team</p>
                </div>
            </body>
            </html>
        ";
        
        $mail->AltBody = "Hello {$username},\n\nWe received a request to reset your password. To create a new password, please visit this link:\n\n{$resetLink}\n\nThis link will expire in 24 hours.\n\nIf you didn't request a password reset, you can ignore this email and your password will remain unchanged.\n\nBest regards,\nThe Devslog Team";
        
        $mail->send();
        error_log("Password reset email sent to: " . $userEmail);
        return true;
    } catch (Exception $e) {
        error_log("Mail Error: {$mail->ErrorInfo}");
        return false;
    }
}