<?php 
require_once 'dbCon.php';

abstract class Provider{
    protected $provider_id;
    protected $name;
    protected $email;
    protected $password;
    protected $contact_no;
    protected $comapany_name;
    protected $business_reg_no;
    protected $company_description;
    protected $address;
    protected $district;
    protected $website;
    protected $profile_image;
    protected $approval_status;
    protected $status;
    protected $conn;
    
    public function __construct(){

        $dbObj=new Database;
        $this->conn=$dbObj->connect();
    }

    public function Login($email,$password){
        $this->email=$email;
        $this->password=$password;

        try{
            $sql="SELECT provider_id,password,approval_status FROM service_provider WHERE email=?";
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