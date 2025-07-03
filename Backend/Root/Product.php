<?php
require_once "dbCon.php";

class Product
{
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
    protected $customer_ID;
    protected $quantity;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }



    public function getAllProductsCustomer()
    {

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

    public function getAllProductsProvider()
    {

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
    public function isAlreadyExistsCart()
    {

        $query = "SELECT cart_id FROM cart WHERE customer_id = :customer_id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":customer_id", $this->customer_ID);
        $stmt->execute();
        $cartId = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($stmt->rowCount() > 0) {
            return $cartId['cart_id'];
        }
        return false;
    }
    public function isAlreadyExistsCartItem($cart_id, $product_id)
    {

        $query = "SELECT item_id FROM cart_item WHERE product_id = :product_id AND cart_id = :cart_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':product_id', $this->product_id);
        $stmt->bindParam(':cart_id', $this->customer_ID);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($stmt->rowCount() > 0) {
            return $result['item_id'];
        }
        return false;
    }
    public function insertCartItem($cart_id, $product_id, $quantity)
{
    try {
        $query = "INSERT INTO cart_item (cart_id, product_id, quantity) VALUES (:cart_id, :product_id, :quantity)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':cart_id', $cart_id);
        $stmt->bindParam(':product_id', $product_id);
        $stmt->bindParam(':quantity', $quantity);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to insert cart item. " . $e->getMessage()]);
        return false;
    }
}



    public function updateCartItem($item_id, $cart_id, $product_id, $quantity)
    {
        try {
            $query = "UPDATE cart_item 
                  SET cart_id = :cart_id,
                      product_id = :product_id,
                      quantity = :quantity,
                    --   added_at = :added_at
                  WHERE item_id = :item_id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':cart_id', $cart_id);
            $stmt->bindParam(':product_id', $product_id);
            $stmt->bindParam(':quantity', $quantity);
            // $stmt->bindParam(':added_at', $added_at);
            $stmt->bindParam(':item_id', $item_id);

            if ($stmt->execute()) {
                return true;
            }

            return false;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update cart item. " . $e->getMessage()]);
            return false;
        }
    }


    public function AddToCart($customer_id, $product_id,$quantity)
    {

        $this->customer_ID = $customer_id;
        $this->product_id = $product_id;
        $this->quantity = $quantity;

        $check = $this->isAlreadyExistsCart();//
        if ($check !== false) {
            return false;
        }

        $check2=$this->isAlreadyExistsCartItem($check, $this->product_id);
        if ($check2 !== false) {
            //quality add ahanum
            $this->updateCartItem($check2,$check,$this->product_id,$this->quantity);
            return false;
        }

        $this-> insertCartItem($check,$this->product_id,1);

        try {
            $sql = "INSERT INTO cart (customer_id) VALUES (?)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(1, $this->customer_ID);  // assuming $this->customer_id is set somewhere
            // $stmt->bindParam(2, $this->created_at);   // assuming $this->created_at is set
            // $stmt->bindParam(3, $this->updated_at);   // assuming $this->updated_at is set
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
