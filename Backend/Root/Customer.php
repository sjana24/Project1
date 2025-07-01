<?php 
require_once 'dbConn.php';
abstract class Customer{
    protected $customer_id;
    protected $name;
    protected $email;
    protected $password;
    protected $contact_no;
    protected $disable_sts;
    protected $conn;

    public function __construct(){
        $dbObj=new Database;
        $this->conn=$dbObj->connect();

    }

    public function Login($email,$password){
        $this->email=$email;
        $this->password=$password;

        try{
            $sql="SELECT customer_id,password,disable_status FROM customer WHERE email=?";
            $stmt=$this->conn->prepare($sql);
            $stmt->bindParam(1,$this->email);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

        }
        catch(PDOException $e){
            http_response_code(500);
            echo json_encode(["message" => "Failed to login. " . $e->getMessage()]);

        }
    }
   

}