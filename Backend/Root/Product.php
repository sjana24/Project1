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
    // protected array $images=[];
    protected  $images;
    protected $specifications;
    protected $is_approved;
    protected $conn;
    protected $customer_ID;
    protected $quantity;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }



    // public function getAllProductsCustomer()
    // {

    //     try {
    //         // $sql = "SELECT * FROM product ";
    //         $sql = "SELECT * FROM product WHERE is_approved = :is_approved";
    //         $stmt = $this->conn->prepare($sql);
    //         $stmt->bindParam(':is_approved', $is_approved, PDO::PARAM_INT);
    //         $is_approved = 1;
    //         // $stmt->bindParam(':is_approved', 1);
    //         $stmt->execute();
    //         $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //         if ($products) {
    //             return [
    //                 'success' => true,
    //                 'products' => $products,
    //                 'message' => 'Products fetched successfully.'
    //             ];
    //         } else {
    //             return [
    //                 'success' => false,
    //                 'message' => 'No products found.'
    //             ];
    //         }
    //     } catch (PDOException $e) {
    //         http_response_code(500);
    //         echo json_encode(["message" => "failed get all products. " . $e->getMessage()]);
    //         return [
    //             'success' => false,
    //             'message' => 'Failed to fetch products. ' . $e->getMessage()
    //         ];
    //     }
    // }
    public function getAllProductsCustomer()
{
    try {
        $is_approved = 1;

        // Fetch all approved products
        // $sql = "SELECT * FROM product WHERE is_approved = :is_approved";
        $sql="SELECT 
    p.*, 
    u.username AS provider_name
FROM 
    product p
JOIN 
    service_provider sp ON p.provider_id = sp.provider_id
JOIN 
    user u ON sp.user_id = u.user_id
WHERE 
    p.is_approved = :is_approved
    ";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':is_approved', $is_approved, PDO::PARAM_INT);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($products) {
            foreach ($products as &$product) {
    $product_id = $product['product_id'];

    // Fetch individual reviews
    $reviewSql = "
        SELECT 
            r.review_id,
            r.customer_id,
            r.rating,
            r.comment,
            r.created_at,
            u.username AS reviewer_name
        FROM review r
        JOIN user u ON r.customer_id = u.user_id
        WHERE r.product_id = :product_id
        ORDER BY r.created_at DESC
    ";
    $reviewStmt = $this->conn->prepare($reviewSql);
    $reviewStmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $reviewStmt->execute();
    $reviews = $reviewStmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch average rating
    $avgRatingSql = "
        SELECT ROUND(AVG(rating), 1) AS average_rating
        FROM review
        WHERE product_id = :product_id
    ";
    $avgStmt = $this->conn->prepare($avgRatingSql);
    $avgStmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $avgStmt->execute();
    $avgRating = $avgStmt->fetch(PDO::FETCH_ASSOC);

    // Attach to product array
    $product['reviews'] = $reviews;
    $product['average_rating'] = $avgRating['average_rating'] ?? null;
}

            // For each product, fetch its reviews and reviewer names
            // foreach ($products as &$product) {
            //     $product_id = $product['product_id'];

            //     $reviewSql = "
            //         SELECT 
            //             r.review_id,
            //             r.customer_id,
            //             r.rating,
                        // r.comment,
            //             r.created_at,
            //             u.username AS reviewer_name
            //         FROM review r
            //         JOIN user u ON r.customer_id = u.user_id
            //         WHERE r.product_id = :product_id
            //         ORDER BY r.created_at DESC
            //     ";

            //     $reviewStmt = $this->conn->prepare($reviewSql);
            //     $reviewStmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
            //     $reviewStmt->execute();
            //     $reviews = $reviewStmt->fetchAll(PDO::FETCH_ASSOC);

            //     $product['reviews'] = $reviews;
            // }

            return [
                'success' => true,
                'products' => $products,
                'message' => 'Products with reviews fetched successfully.'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'No products found.'
            ];
        }
    } catch (PDOException $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'Failed to fetch products. ' . $e->getMessage()
        ];
    }
}

     public function getAllProductsAdmin()
    {

        try {
            // $sql = "SELECT * FROM product ";
            $sql = "SELECT * FROM product ";
            $stmt = $this->conn->prepare($sql);
            // $stmt->bindParam(':is_approved', $is_approved, PDO::PARAM_INT);
            // $is_approved = 1;
            // $stmt->bindParam(':is_approved', 1);
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

    public function getAllProductsProvider($provider_id)
    {

        try {
            $sql = "SELECT * FROM product WHERE  provider_id=:provider_id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':provider_id', $provider_id);
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
    // public function isAlreadyExistsCartItem($cart_id, $product_id)

    public function isAlreadyExistsCartItem($cart_id, $product_id)
    {
        $query = "SELECT item_id,quantity FROM cart_item WHERE product_id = :product_id AND cart_id = :cart_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':product_id', $product_id);  // FIX: Use method argument, not $this->product_id
        $stmt->bindParam(':cart_id', $cart_id);        // FIX: Use method argument, not $this->customer_ID
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            // return $result['item_id'];
            return $result;
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
                      quantity = :quantity                  
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


    // public function AddToCart($customer_id, $product_id,$quantity)
    public function AddToCart($customer_id, $product_id, $quantity)
    {
        $this->customer_ID = $customer_id;
        $this->product_id = $product_id;
        $this->quantity = $quantity;

        // 1. Check if cart exists
        $cart_id = $this->isAlreadyExistsCart();

        // 2. If not, insert cart
        if (!$cart_id) {
            $sql = "INSERT INTO cart (customer_id) VALUES (:customer_id)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':customer_id', $this->customer_ID);
            $stmt->execute();

            // Now retrieve newly inserted cart_id
            $cart_id = $this->conn->lastInsertId();
        }

        // 3. Check if this product already exists in this cart
        $existingItem = $this->isAlreadyExistsCartItem($cart_id, $product_id);

        if ($existingItem) {
            $item_id = $existingItem['item_id'];
            $existing_quantity = $existingItem['quantity'];

            $new_quantity = $existing_quantity + $quantity;

            return $this->updateCartItem($item_id, $cart_id, $product_id, $new_quantity);
            // $existing_quantity= $existingItemId['quantity'];

            // if ($existingItemId) {
            // 4. If it exists, update quantity
            // return $this->updateCartItem($existingItemId, $cart_id, $product_id,$existing_quantity);
        } else {
            // 5. If not, insert new cart item
            return $this->insertCartItem($cart_id, $product_id, $quantity);
        }
    }
    public function isExistingProduct()
    {
        $query = "SELECT COUNT(*) FROM product WHERE product_id = ? AND provider_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->product_id);
        $stmt->bindParam(2, $this->provider_id);
        $stmt->execute();

        $count = $stmt->fetchColumn();
        return $count > 0;
    }

    public function addProduct( $provider_id, $name, $description, $price, $category, $images, $specifications)
    {
  



        // $this->product_id = $product_id;
        $this->provider_id = $provider_id;
        $this->name = $name;
        $this->description = $description;
        $this->price = $price;
        $this->category = $category;
        // $this->images[] = $images;
        $this->images = is_array($images) ? $images : [$images];

        // $this->images[] =is_array($images) ? $images : [$images];
        $this->specifications = $specifications;

        //  is existing check pannum
        $count = $this->isExistingProduct();
        //  return [
        //             "success" => true,
        //             "message" => $this->images,
        //         ];
        if (0==$count) {

            try {
                $sql = "INSERT INTO product (
                     provider_id, name, description, price,
                    category, images, specifications, created_at, updated_at
                ) VALUES ( ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";

                $stmt = $this->conn->prepare($sql);

                // $created_at = date("Y-m-d H:i:s");
                // $created_at = NOW();
                // $updated_at = $created_at;
                // $is_approved =  '0'; // fallback to 'pending' if not set

                $stmt->execute([
                    // $this->product_id,
                    $this->provider_id,
                    $this->name,
                    $this->description,
                    $this->price,
                    $this->category,
                    // $this->images,
                    implode(',', $this->images),
                    $this->specifications,
                    // $is_approved,
                    // $created_at,
                    // $updated_at
                ]);

                return [
                    "success" => true,
                    "message" => "Product inserted successfully."
                ];
            } catch (PDOException $e) {
                http_response_code(500);
                return [
                    "success" => false,
                    "message" => "Error inserting product: " . $e->getMessage()
                ];
            }
        }
        else{
             return [
                    "success" => false,
                    "message" => "Product exist."
                ];
        }
    }

    public function updateProductServiceAdmin($product_id,$is_approved){
        $this->product_id=$product_id;
        $this->is_approved=$is_approved;

        try {
        $sql = "UPDATE product 
                SET is_approved = :is_approved, updated_at = NOW() 
                WHERE  product_id = :product_id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':is_approved', $is_approved, PDO::PARAM_INT);
        // $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
        $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return [
                "success" => true,
                "message" => "Product approval status updated successfully."
            ];
        } else {
            return [
                "success" => false,
                "message" => "Failed to update product approval status."
            ];
        }
    } catch (PDOException $e) {
        http_response_code(500);
        return [
            "success" => false,
            "message" => "Error updating product approval: " . $e->getMessage()
        ];
    }

    }
}
