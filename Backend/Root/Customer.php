<?php
// require_once 'dBCon.php';
include_once 'Root/User.php';
class Customer extends User
{
    protected $customer_id;
    protected $user_id;
    protected $name;
    protected $email;
    protected $password;
    protected $contact_number;
    // protected $conn;
    public $id = 3;

    // public function __construct()
    // {
    //     $dbObj = new Database;
    //     $this->conn = $dbObj->connect();
    // }
     public function __construct()
    {
        parent::__construct();
    }

    // public function Login($email, $password,$role)
    // {
    //     $this->email = $email;
    //     $this->password = $password;

    //     try {
    //         $sql = "SELECT customer_id,password,name FROM customer WHERE email=?";
    //         $stmt = $this->conn->prepare($sql);
    //         $stmt->bindParam(1, $this->email);
    //         $stmt->execute();
    //         $customer = $stmt->fetch(PDO::FETCH_ASSOC);
            
    //         if ($customer && ($this->password=== $customer['password'])) {
    //             // if ($user['disable_status'] === 'disabled') {
    //              //     return ['success' => false, 'message' => 'Your account has been disabled. Please contact support.'];
    //             // }

    //             $this->customer_id = $customer['customer_id'];
    //             $customer_name= $customer['name'];


    //             return [ 'user_id' => $this->customer_id,'user_name'=>$customer_name, 'success' => true, 'message' => 'Login Successful...'];
    //         } else {
    //             return ["success"=>false,"message"=>"Incorrect email or password..."];
    //         }
    //     } catch (PDOException $e) {
    //         http_response_code(500);
    //         echo json_encode(["message" => "Failed to login. " . $e->getMessage()]);
    //     }
    // }
    public function Register($name, $email, $contact_number, $password)
    {
        $this->name = $name;
        $this->email = $email;
        $this->contact_number = $contact_number;
        $this->password = $password;


        try {
            $sql = "INSERT INTO customer (customer_id, user_id, contact_number) VALUES ( ?, ?, ?)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(1, $this->customer_id);
            $stmt->bindParam(2, $this->user_id);
            $stmt->bindParam(3, $this->contact_number);
            $result = $stmt->execute();

            if ($result) {
                return true;
            }
            return false;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to register. " . $e->getMessage()]);
        }
    }
}
