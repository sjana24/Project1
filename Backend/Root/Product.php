<?php
require_once "dbCon.php";

class Product{
    protected $product_id;
    protected $provider_id;
    protected $name;
    protected $description;
    protected $price;
    protected $category;
    protected $images;
    protected $specification;
    protected $is_approved;
    protected $conn;

    public function __construct(){
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
        
    }

    public function getAllProductsCustomer(){

        try {
            $sql = "SELECT * FROM product";
            $stmt = $this->conn->prepare($sql);
            
            $stmt->execute();
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if ($products) {
                return [
                'success' => true,
                'products' => $products,
                'message' => 'Products fetched successfully.'
            ];
               
            } else {
                return [
                'success' => false,
                'message' => 'No products found.'
            ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all products. " . $e->getMessage()]);
            return [
            'success' => false,
            'message' => 'Failed to fetch products. ' . $e->getMessage()
        ];
        }

    }

    public function getAllProductsProvider(){

        try {
            $sql = "SELECT * FROM product WHERE ";
            $stmt = $this->conn->prepare($sql);
            
            $stmt->execute();
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if ($products) {
                return [
                'success' => true,
                'products' => $products,
                'message' => 'Products fetched successfully.'
            ];
               
            } else {
                return [
                'success' => false,
                'message' => 'No products found.'
            ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all products. " . $e->getMessage()]);
            return [
            'success' => false,
            'message' => 'Failed to fetch products. ' . $e->getMessage()
        ];
        }

    }
}