<?php
require_once "dbCon.php";

class Cart
{

    protected $conn;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }

    public function getAllCartCustomer($customer_id)
    {

        try {
            // $sql = "SELECT * FROM ";
            // $sql = " SELECT ci.item_id, ci.cart_id, ci.product_id, ci.quantity, ci.added_at FROM cart_item ci INNER JOIN cart c ON ci.cart_id = c.cart_id WHERE c.customer_id = ?";
                $sql = "SELECT  ci.item_id,  ci.cart_id, ci.product_id, p.name AS product_name, p.price AS unit_price,p.images AS images, ci.quantity, (ci.quantity * p.price) AS total_price,ci.added_at
                FROM cart_item ci
                INNER JOIN cart c ON ci.cart_id = c.cart_id
                INNER JOIN product p ON ci.product_id = p.product_id
                 WHERE c.customer_id = ?
                ";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(1, $customer_id);
            $stmt->execute();
            $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($cartItems) {
                return [
                    'success' => true,
                    'items' =>  $cartItems,
                    'message' => ' CartItems fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No cartItemss found.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all  cartItems. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch  cartItemss. ' . $e->getMessage()
            ];
        }
    }
}
