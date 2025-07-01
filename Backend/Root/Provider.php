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
            $provider = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($provider && ($this->password=== $provider['password'])) {
                // if ($user['disable_status'] === 'disabled') {
                 //     return ['success' => false, 'message' => 'Your account has been disabled. Please contact support.'];
                // }

                $this->provider_id = $provider['provider_id'];


                return [ 'provider_id' => $this->provider_id, 'success' => true, 'message' => 'Login Successful...'];
            } else {
                return ["success"=>false,"message"=>"Incorrect email or password..."];
            }

        }
        catch(PDOException $e){
            http_response_code(500);
            echo json_encode(["message" => "Failed to login. " . $e->getMessage()]);

        }
    }
     public function Register($name, $email, $contact_no, $password)
    {
        $this->name = $name;
        $this->email = $email;
        $this->contact_no = $contact_no;
        $this->password = $password;


        try {
            $sql = "INSERT INTO service_provider () VALUES ( ?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($sql);
            // $stmt->bindParam(1, $this->id);
            // $stmt->bindParam(2, $this->name);
            // $stmt->bindParam(3, $this->email);
            // $stmt->bindParam(4, $this->contact_no);
            // $stmt->bindParam(5, $this->password);
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