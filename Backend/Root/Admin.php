<?php
require_once 'dBCon.php';
class Admin
{
    protected $admin_id;
    protected $admin_id1;
    protected $email1;
    protected $password1;
    protected $name;
    protected $email;
    protected $password;
    protected $contact_no;
    protected $disable_sts;
    protected $conn;
    public $id = 3;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }

    public function LoginAdmin($email, $password)
    {
        $this->email = $email;
        $this->password = $password;
        // echo $this->email;
        // echo $this->password;

        try {
            $sql = "SELECT admin_id,password,email FROM admin WHERE email=?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(1, $this->email);
            $stmt->execute();
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);
            
             if ($admin && ($this->password === $admin['password'])) {
                return [
                    'success' => true,
                    'admin_id' => $admin['admin_id'],
                    'email' => $admin['email'],
                    'message' => 'Login Successful...'
                ];
            } else {
                return [
                    'success' => false,
                    'admin_id' => $admin['admin_id'] ?? null,
                    'email' => $admin['email'] ?? null,
                    'password_in_db' => $admin['password'] ?? null,
                    'message' => 'Incorrect email or password...'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to login. " . $e->getMessage()]);
        }
    }
    // public function Register($name, $email, $contact_no, $password)
    // {
    //     $this->name = $name;
    //     $this->email = $email;
    //     $this->contact_no = $contact_no;
    //     $this->password = $password;


    //     try {
    //         $sql = "INSERT INTO customer (customer_id, name, email, contact_no, password) VALUES ( ?, ?, ?, ?, ?)";
    //         $stmt = $this->conn->prepare($sql);
    //         $stmt->bindParam(1, $this->id);
    //         $stmt->bindParam(2, $this->name);
    //         $stmt->bindParam(3, $this->email);
    //         $stmt->bindParam(4, $this->contact_no);
    //         $stmt->bindParam(5, $this->password);
    //         $result = $stmt->execute();

    //         if ($result) {
    //             return true;
    //         }
    //         return false;
    //     } catch (PDOException $e) {
    //         http_response_code(500);
    //         echo json_encode(["message" => "Failed to register. " . $e->getMessage()]);
    //     }
    // }
}
