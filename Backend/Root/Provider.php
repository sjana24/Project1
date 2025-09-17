<?php 
require_once 'dbCon.php';

class Provider{
    protected $provider_id;
    protected $name;
    protected $email;
    protected $password;
    protected $contact_number;
    protected $comapany_name;
    protected $business_reg_no;
    protected $company_description;
    protected $address;
    protected $district;
    protected $website;
    protected $profile_image;
    protected $verification_status;
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
            $sql="SELECT provider_id FROM service_provider WHERE email=?";
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
     public function Register($name, $email, $contact_number, $password)
    {
        $this->name = $name;
        $this->email = $email;
        $this->contact_number = $contact_number;
        $this->password = $password;


        try {
            $sql = "INSERT INTO service_provider () VALUES ( ?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($sql);
            // $stmt->bindParam(1, $this->provider_id);
            // $stmt->bindParam(2, $this->user_id);
            // $stmt->bindParam(3, $this->contact_number);
            // $stmt->bindParam(4, $this->);address);
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