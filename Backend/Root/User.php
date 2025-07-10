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

            if ($user && ($this->password === $user['password'])) {
                // if ($user['disable_status'] === 'disabled') {
                //     return ['success' => false, 'message' => 'Your account has been disabled. Please contact support.'];
                // }
                
                // $this->logged = $user['success'];
                $this->user_id = $user['user_id'];
                $this->user_name = $user['username'];
                $this->role = $user['user_role'];
                $_SESSION['user'] = [
                    "user_id" => $user['user_id'],
                    "user_name"=>$user['username'],
                    "user_role" =>$user['user_role'],
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
}
