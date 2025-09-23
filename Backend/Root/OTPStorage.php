<?php
// Simple file-based OTP storage for testing
class OTPStorage
{
    private $storage_dir;

    public function __construct()
    {
        $this->storage_dir = __DIR__ . '/temp_otp/';
        if (!is_dir($this->storage_dir)) {
            mkdir($this->storage_dir, 0777, true);
        }
    }

    public function store($email, $otp, $expires_minutes = 10)
    {
        $data = [
            'email' => $email,
            'otp' => $otp,
            'expires_at' => time() + ($expires_minutes * 60),
            'attempts' => 0,
            'created_at' => time()
        ];

        $filename = $this->getFilename($email);
        file_put_contents($filename, json_encode($data));
        return true;
    }

    public function verify($email, $otp)
    {
        $filename = $this->getFilename($email);

        if (!file_exists($filename)) {
            return ['success' => false, 'message' => 'No OTP found for this email'];
        }

        $data = json_decode(file_get_contents($filename), true);

        if (!$data) {
            return ['success' => false, 'message' => 'Invalid OTP data'];
        }

        // Check expiration
        if (time() > $data['expires_at']) {
            unlink($filename);
            return ['success' => false, 'message' => 'OTP has expired'];
        }

        // Check attempts
        if ($data['attempts'] >= 5) {
            unlink($filename);
            return ['success' => false, 'message' => 'Too many failed attempts'];
        }

        // Verify OTP
        if ($data['otp'] === $otp) {
            // Mark as verified
            $data['verified'] = true;
            $data['verified_at'] = time();
            file_put_contents($filename, json_encode($data));

            return ['success' => true, 'message' => 'OTP verified successfully'];
        } else {
            // Increment attempts
            $data['attempts']++;
            file_put_contents($filename, json_encode($data));

            $remaining = 5 - $data['attempts'];
            return ['success' => false, 'message' => "Invalid OTP. $remaining attempts remaining"];
        }
    }

    public function isVerified($email)
    {
        $filename = $this->getFilename($email);

        if (!file_exists($filename)) {
            return false;
        }

        $data = json_decode(file_get_contents($filename), true);

        if (!$data || !isset($data['verified']) || !$data['verified']) {
            return false;
        }

        // Check if verification hasn't expired (30 minutes)
        $verification_age = time() - $data['verified_at'];
        if ($verification_age > (30 * 60)) {
            unlink($filename);
            return false;
        }

        return true;
    }

    public function cleanup($email)
    {
        $filename = $this->getFilename($email);
        if (file_exists($filename)) {
            unlink($filename);
        }
    }

    private function getFilename($email)
    {
        $safe_email = preg_replace('/[^a-zA-Z0-9@.]/', '_', $email);
        return $this->storage_dir . 'otp_' . md5($safe_email) . '.json';
    }
}
