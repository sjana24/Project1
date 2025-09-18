<?php
require_once 'dBCon.php';
class Contact
{
    // protected $admin_id;
    // protected $admin_id1;
    protected $email;
    protected $category;
    protected $full_name;
    protected $message;
    protected $subject;
    protected $contact_no;
    protected $disable_sts;
    protected $conn;
    // public $id = 3;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }

    public function customerQueryInsert($full_name, $email, $subject, $message){
        // public function addProductProvider($provider_id, $name, $description, $price, $category, $images, $specifications)
    // {

        // $this->product_id = $product_id;
        $this->full_name = $full_name;
        $this->email = $email;
        $this->subject = $subject;
        $this->message = $message;
       
             try {
                $sql = "INSERT INTO product (
                     provider_id, name, description, price,
                    category, images, message, created_at, updated_at
                ) VALUES ( ?, ?, ?, ?, NOW(), NOW())";

                $stmt = $this->conn->prepare($sql);


                $stmt->execute([
                    $this->full_name,
                    $this->email,
                    $this->subject,
                    $this->message,
                    ]);

                return [
                    "success" => true,
                    "message" => "Query inserted successfully."
                ];
            } catch (PDOException $e) {
                http_response_code(500);
                return [
                    "success" => false,
                    "message" => "Error inserting product: " . $e->getMessage()
                ];
            }
        } 
    


    
  
}
