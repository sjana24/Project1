<?php
require_once "dbCon.php";
// session_start();
abstract class User
{

    protected $conn;
    protected $user_id;
    protected $logged;
    protected $user_name;
    protected $email;
    protected $password;
    protected $role;

    protected $name;
    //   protected $email;
    protected $contact_no;
    //   protected $role;
    //   protected $password;
    protected $address;
    protected $district;
    protected $province;
    protected $company_name;
    protected $business_reg_no;
    protected $company_description;
    protected $website;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }

    public function Login($email, $password, $role)
    {
        $this->email = $email;
        $this->password = $password;
        $this->role = $role;

        try {
            $sql = "SELECT * FROM user WHERE email=? AND user_role=? ";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(1, $this->email);
            $stmt->bindParam(2, $this->role);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($this->password, $user['password'])) {
                // if ($user['disable_status'] === 'disabled') {
                //     return ['success' => false, 'message' => 'Your account has been disabled. Please contact support.'];
                // }

                // $this->logged = $user['success'];
                $this->user_id = $user['user_id'];
                $this->user_name = $user['username'];
                $this->role = $user['user_role'];
                $_SESSION['user'] = [
                    "user_id" => $user['user_id'],
                    "user_name" => $user['username'],
                    "user_role" => $user['user_role'],
                ];
                error_log("Session set: " . print_r($_SESSION['user'], true));

                return ['user_id' => $this->user_id, 'user_name' => $this->user_name, 'user_role' => $this->role, 'success' => true, 'message' => 'Login Successful...'];
            } else {
                return ["success" => false, "message" => "Incorrect email or password..."];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to login. " . $e->getMessage()]);
        }
    }

    public function isExistingUser($email, $user_role)
    {
        $query = "SELECT COUNT(*) FROM user WHERE email = ? AND user_role = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $email);
        $stmt->bindParam(2, $user_role);
        $stmt->execute();

        $count = $stmt->fetchColumn();
        return $count > 0;
    }


    public function signupUser($name, $email, $contact_no, $role, $password, $address, $district, $province, $company_name, $business_reg_no, $company_description, $website)
    {
        $this->name = $name;
        $this->email = $email;
        $this->contact_no = $contact_no;
        $this->password = $password;

        $this->role = $role;

        $this->address = $address;
        $this->district = $district;
        $this->province = $province;
        $this->company_name = $company_name;
        $this->business_reg_no = $business_reg_no;
        $this->company_description = $company_description;
        $this->website = $website;

        $dash = 0;
        $count = $this->isExistingUser($this->email, $this->role);
        $email_var = 1;
        $is_blocked = 0;

        if (0 == $count) {
            try {
                // 1. Insert into `user` table
                $stmt = $this->conn->prepare("INSERT INTO `user` (`username`, `email`, `email_verified`, `password`,`is_blocked`, `user_role`, `created_at`, `updated_at`) 
                                  VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())");
                $stmt->execute([
                    $this->name,
                    $this->email,
                    $email_var,
                    $this->password,
                    $is_blocked,
                    $this->role
                ]);

                // 2. Get auto-incremented user_id
                $userId = $this->conn->lastInsertId();
                $dash = $userId;

                // 3. Depending on role, insert into service_provider or customer
                if ($this->role === 'service_provider') {

                    $stmt = $this->conn->prepare("INSERT INTO `service_provider` 
            (`user_id`, `contact_number`, `address`, `district`, `company_name`, `business_registration_number`, `company_description`, `website`, `verification_status`) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')");

                    $stmt->execute([
                        $userId,
                        $this->contact_no,
                        $this->address,
                        $this->district,
                        // '', // profile_image initially empty
                        $this->company_name,
                        $this->business_reg_no,
                        $this->company_description,
                        $this->website
                    ]);
                } elseif ($this->role === 'customer') {

                    $stmt = $this->conn->prepare("INSERT INTO `customer` 
            (`user_id`, `contact_number`) 
            VALUES (?, ?)");

                    $stmt->execute([
                        $userId,
                        $this->contact_no,
                        // $this->address,
                        // $this->district,
                        // $this->province
                    ]);
                }

                return ["success" => true, "message" => "User registered successfully.", "user_id" => $userId];
            } catch (PDOException $e) {
                http_response_code(500);
                return ["success" => false, "userid" => $dash, "message" => "Error creating user: " . $e->getMessage()];
            }
        } else {
            return ["success" => false, "message" => "User already exit."];
        }
    }
    // New method to update username
    public function updateUsername($user_id, $username)
    {
        $sql = "UPDATE user SET username = ? WHERE user_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $username);
        $stmt->bindParam(2, $user_id);
        return $stmt->execute();
    }

    // New method to update email
    public function updateEmail($user_id, $email)
    {
        // First, check if the email already exists for another user
        $sql = "SELECT user_id FROM user WHERE email = ? AND user_id != ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $email);
        $stmt->bindParam(2, $user_id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return false; // Email already exists, so prevent the update
        }

        // If the email is unique, proceed with the update
        $sql = "UPDATE user SET email = ? WHERE user_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $email);
        $stmt->bindParam(2, $user_id);
        return $stmt->execute();
    }

    // New method to update password by email (for password reset)
    public function updatePassword($email, $hashedPassword)
    {
        try {
            $sql = "UPDATE user SET password = ?, updated_at = NOW() WHERE email = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(1, $hashedPassword);
            $stmt->bindParam(2, $email);
            $result = $stmt->execute();

            if ($result && $stmt->rowCount() > 0) {
                return ["success" => true, "message" => "Password updated successfully"];
            } else {
                return ["success" => false, "message" => "User not found or password unchanged"];
            }
        } catch (PDOException $e) {
            return ["success" => false, "message" => "Database error: " . $e->getMessage()];
        }
    }
}
