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
                    'message' => 'No cartItems found.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all  cartItems. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch  cartItems. ' . $e->getMessage()
            ];
        }
    }

    // Update quantity of a product in cart
    public function updateCartItemQuantity($customer_id, $product_id, $new_quantity)
    {
        try {
            // First check if the product exists in the customer's cart
            $sqlCheck = "SELECT ci.item_id, ci.quantity 
                         FROM cart_item ci 
                         INNER JOIN cart c ON ci.cart_id = c.cart_id 
                         WHERE c.customer_id = ? AND ci.product_id = ?";
            
            $stmtCheck = $this->conn->prepare($sqlCheck);
            $stmtCheck->bindParam(1, $customer_id);
            $stmtCheck->bindParam(2, $product_id);
            $stmtCheck->execute();
            $existingItem = $stmtCheck->fetch(PDO::FETCH_ASSOC);

            if (!$existingItem) {
                return [
                    'success' => false,
                    'message' => 'Product not found in cart.'
                ];
            }

            // If quantity is 0 or negative, remove the item from cart
            if ($new_quantity <= 0) {
                return $this->removeProductFromCart($customer_id, $product_id);
            }

            // Update the quantity
            $sqlUpdate = "UPDATE cart_item ci
                         INNER JOIN cart c ON ci.cart_id = c.cart_id 
                         SET ci.quantity = ?, ci.added_at = NOW()
                         WHERE c.customer_id = ? AND ci.product_id = ?";
            
            $stmtUpdate = $this->conn->prepare($sqlUpdate);
            $stmtUpdate->bindParam(1, $new_quantity);
            $stmtUpdate->bindParam(2, $customer_id);
            $stmtUpdate->bindParam(3, $product_id);
            $stmtUpdate->execute();
            
            $rowsAffected = $stmtUpdate->rowCount();

            if ($rowsAffected > 0) {
                return [
                    'success' => true,
                    'message' => 'Cart quantity updated successfully.',
                    'old_quantity' => $existingItem['quantity'],
                    'new_quantity' => $new_quantity
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to update cart quantity.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return [
                'success' => false,
                'message' => 'Failed to update cart quantity. ' . $e->getMessage()
            ];
        }
    }

    // Remove a single product from cart
    public function removeProductFromCart($customer_id, $product_id)
    {
        try {
            $sql = "DELETE ci FROM cart_item ci 
                    INNER JOIN cart c ON ci.cart_id = c.cart_id 
                    WHERE c.customer_id = ? AND ci.product_id = ?";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(1, $customer_id);
            $stmt->bindParam(2, $product_id);
            $stmt->execute();
            $rowsDeleted = $stmt->rowCount();

            if ($rowsDeleted > 0) {
                return [
                    'success' => true,
                    'message' => 'Product removed from cart successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Product not found in cart.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return [
                'success' => false,
                'message' => 'Failed to remove product from cart. ' . $e->getMessage()
            ];
        }
    }

    // Remove all products from cart (empty cart)
    public function emptyCart($customer_id)
    {
        try {
            $sql = "DELETE ci FROM cart_item ci 
                    INNER JOIN cart c ON ci.cart_id = c.cart_id 
                    WHERE c.customer_id = ?";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(1, $customer_id);
            $stmt->execute();
            $rowsDeleted = $stmt->rowCount();

            if ($rowsDeleted > 0) {
                return [
                    'success' => true,
                    'message' => 'Cart emptied successfully. ' . $rowsDeleted . ' items removed.',
                    'items_removed' => $rowsDeleted
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Cart is already empty.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return [
                'success' => false,
                'message' => 'Failed to empty cart. ' . $e->getMessage()
            ];
        }
    }

    // Add product to cart or update quantity if already exists
    public function addToCart($customer_id, $product_id, $quantity = 1)
    {
        try {
            // Check if customer has a cart, create if not
            $cartCheck = "SELECT cart_id FROM cart WHERE customer_id = ?";
            $stmtCart = $this->conn->prepare($cartCheck);
            $stmtCart->bindParam(1, $customer_id);
            $stmtCart->execute();
            $cart = $stmtCart->fetch(PDO::FETCH_ASSOC);

            if (!$cart) {
                // Create a new cart for the customer
                $sqlCreateCart = "INSERT INTO cart (customer_id, created_at) VALUES (?, NOW())";
                $stmtCreate = $this->conn->prepare($sqlCreateCart);
                $stmtCreate->bindParam(1, $customer_id);
                $stmtCreate->execute();
                $cart_id = $this->conn->lastInsertId();
            } else {
                $cart_id = $cart['cart_id'];
            }

            // Check if product already exists in cart
            $sqlCheck = "SELECT item_id, quantity FROM cart_item 
                         WHERE cart_id = ? AND product_id = ?";
            
            $stmtCheck = $this->conn->prepare($sqlCheck);
            $stmtCheck->bindParam(1, $cart_id);
            $stmtCheck->bindParam(2, $product_id);
            $stmtCheck->execute();
            $existingItem = $stmtCheck->fetch(PDO::FETCH_ASSOC);

            if ($existingItem) {
                // Update existing item quantity
                $newQuantity = $existingItem['quantity'] + $quantity;
                return $this->updateCartItemQuantity($customer_id, $product_id, $newQuantity);
            } else {
                // Add new item to cart
                $sqlInsert = "INSERT INTO cart_item (cart_id, product_id, quantity, added_at) 
                              VALUES (?, ?, ?, NOW())";
                
                $stmtInsert = $this->conn->prepare($sqlInsert);
                $stmtInsert->bindParam(1, $cart_id);
                $stmtInsert->bindParam(2, $product_id);
                $stmtInsert->bindParam(3, $quantity);
                $stmtInsert->execute();

                return [
                    'success' => true,
                    'message' => 'Product added to cart successfully.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return [
                'success' => false,
                'message' => 'Failed to add product to cart. ' . $e->getMessage()
            ];
        }
    }
}