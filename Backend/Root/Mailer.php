<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Import PHPMailer classes
require_once __DIR__ . '/../phpmailer/src/Exception.php';
require_once __DIR__ . '/../phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/../phpmailer/src/SMTP.php';

class Mailer
{
    private $mail;

    public function __construct()
    {
        $this->mail = new PHPMailer(true);

        // Server settings
        $this->mail->isSMTP();
        $this->mail->Host       = 'smtp.gmail.com';
        $this->mail->SMTPAuth   = true;
        $this->mail->Username   = 'madhan2001ana@gmail.com'; // SMTP email
        $this->mail->Password   = 'ilergdrkkdycocoh'; // SMTP password
        $this->mail->SMTPSecure = 'ssl';
        $this->mail->Port       = 465;
        //mahinthan2001a@gmail.com  nmmivtjmwmufbszb
        $this->mail->setFrom('madhan2001ana@gmail.com', 'GearSphere');
    }

    // Enhanced method with neat templates
    public function setInfo($recipientEmail, $subject, $message)
    {
        $this->mail->addAddress($recipientEmail);
        $this->mail->isHTML(true);
        $this->mail->Subject = $subject;
        $this->mail->Body = $message;
    }

    // Method to send OTP verification email
    public function sendOTPEmail($recipientEmail, $otp, $userName = '')
    {
        try {
            $this->mail->clearAddresses(); // Clear any previous addresses
            $this->mail->addAddress($recipientEmail);
            $this->mail->isHTML(true);
            $this->mail->Subject = 'SolaX - Email Verification Code';

            $message = $this->generateOTPTemplate($otp, $userName);
            $this->mail->Body = $message;

            $result = $this->mail->send();
            return ['success' => true, 'message' => 'OTP sent successfully'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Failed to send OTP: ' . $this->mail->ErrorInfo];
        }
    }

    // Method to send password reset OTP email
    public function sendPasswordResetOTP($recipientEmail, $otp, $userName = '')
    {
        try {
            $this->mail->clearAddresses(); // Clear any previous addresses
            $this->mail->addAddress($recipientEmail);
            $this->mail->isHTML(true);
            $this->mail->Subject = 'SolaX - Password Reset Code';

            $message = $this->generatePasswordResetTemplate($otp, $userName);
            $this->mail->Body = $message;

            $result = $this->mail->send();
            return ['success' => true, 'message' => 'Password reset OTP sent successfully'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Failed to send password reset OTP: ' . $this->mail->ErrorInfo];
        }
    }    // Generate OTP email template
    private function generateOTPTemplate($otp, $userName = '')
    {
        $greeting = !empty($userName) ? "Hello $userName," : "Hello,";

        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Email Verification - SolaX</title>
        </head>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>
            <div style='background: linear-gradient(135deg, #26B170 0%, #1e8e5a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
                <h1 style='color: white; margin: 0; font-size: 28px;'>SolaX</h1>
                <p style='color: white; margin: 10px 0 0 0; font-size: 16px;'>Solar Energy Solutions</p>
            </div>
            
            <div style='background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee;'>
                <h2 style='color: #26B170; margin-top: 0;'>Email Verification Required</h2>
                
                <p>$greeting</p>
                
                <p>Thank you for joining SolaX! To complete your registration, please verify your email address using the verification code below:</p>
                
                <div style='background: white; border: 2px solid #26B170; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;'>
                    <p style='margin: 0; font-size: 14px; color: #666;'>Your Verification Code</p>
                    <h1 style='margin: 10px 0; font-size: 36px; color: #26B170; letter-spacing: 5px; font-weight: bold;'>$otp</h1>
                </div>
                
                <p><strong>Important:</strong></p>
                <ul style='color: #666; font-size: 14px;'>
                    <li>This code will expire in 10 minutes</li>
                    <li>Enter this code exactly as shown</li>
                    <li>If you didn't request this verification, please ignore this email</li>
                </ul>
                
                <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;'>
                    <p style='color: #888; font-size: 12px; margin: 0;'>
                        This is an automated message from SolaX. Please do not reply to this email.
                    </p>
                    <p style='color: #888; font-size: 12px; margin: 5px 0 0 0;'>
                        © 2025 SolaX - Powering Your Future with Solar Energy
                    </p>
                </div>
            </div>
        </body>
        </html>";
    }

    // Generate password reset OTP email template
    private function generatePasswordResetTemplate($otp, $userName = '')
    {
        $greeting = !empty($userName) ? "Hello $userName," : "Hello,";

        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Password Reset - SolaX</title>
        </head>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>
            <div style='background: linear-gradient(135deg, #26B170 0%, #1e8e5a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
                <h1 style='color: white; margin: 0; font-size: 28px;'>SolaX</h1>
                <p style='color: white; margin: 10px 0 0 0; font-size: 16px;'>Solar Energy Solutions</p>
            </div>
            
            <div style='background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee;'>
                <h2 style='color: #26B170; margin-top: 0;'>🔒 Password Reset Request</h2>
                
                <p>$greeting</p>
                
                <p>We received a request to reset your password for your SolaX account. Use the verification code below to proceed with your password reset:</p>
                
                <div style='background: white; border: 2px solid #e74c3c; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;'>
                    <p style='margin: 0; font-size: 14px; color: #666;'>Password Reset Code</p>
                    <h1 style='margin: 10px 0; font-size: 36px; color: #e74c3c; letter-spacing: 5px; font-weight: bold;'>$otp</h1>
                </div>
                
                <p><strong>⚠️ Security Notice:</strong></p>
                <ul style='color: #666; font-size: 14px;'>
                    <li>This code will expire in 10 minutes</li>
                    <li>Only use this code if you requested a password reset</li>
                    <li>Never share this code with anyone</li>
                    <li>If you didn't request this reset, please ignore this email and consider changing your password</li>
                </ul>
                
                <div style='background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;'>
                    <p style='margin: 0; color: #856404; font-size: 14px;'>
                        <strong>Didn't request this?</strong> If you didn't ask to reset your password, you can safely ignore this email. Your password will remain unchanged.
                    </p>
                </div>
                
                <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;'>
                    <p style='color: #888; font-size: 12px; margin: 0;'>
                        This is an automated security message from SolaX. Please do not reply to this email.
                    </p>
                    <p style='color: #888; font-size: 12px; margin: 5px 0 0 0;'>
                        © 2025 SolaX - Powering Your Future with Solar Energy
                    </p>
                </div>
            </div>
        </body>
        </html>";
    }

    // Method to send email (wrapper for backward compatibility)
    public function send()
    {
        try {
            return $this->mail->send();
        } catch (Exception $e) {
            return false;
        }
    }
}
