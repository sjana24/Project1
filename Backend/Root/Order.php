<?php
require_once "dBCon.php";

class Order
{
    protected $conn;
    protected $customer_id;
    protected $provider_id;
    protected $new_status;
    protected $order_id;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }



    // public function GetOrdersCustomer($customer_id)
    // {
    //     $this->customer_id = $customer_id;
    //     try {
    //         $sql = "SELECT * FROM `order` WHERE customer_id=:customer_id";
    //         // $sql = "SELECT * FROM service WHERE  provider_id=:provider_id";
    //         $stmt = $this->conn->prepare($sql);
    //         $stmt->bindParam(':customer_id', $this->customer_id);

    //         // $stmt = $this->conn->prepare($sql);

    //         $stmt->execute();
    //         $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //         if ($orders) {
    //             return [
    //                 'success' => true,
    //                 'product' => $orders,
    //                 'message' => 'Orders fetched successfully.'
    //             ];
    //         } else {
    //             return [
    //                 'success' => false,
    //                 'message' => 'No Orders found.'
    //             ];
    //         }
    //     } catch (PDOException $e) {
    //         http_response_code(500);
    //         echo json_encode(["message" => "failed get all orders. " . $e->getMessage()]);
    //         return [
    //             'success' => false,
    //             'message' => 'Failed to fetch orders. ' . $e->getMessage()
    //         ];
    //     }
    // }

//     public function GetOrdersProvider($provider_id)
// {
//     $this->provider_id = $provider_id;
//     try {
//         // Get orders of the provider
//         $sql = "SELECT * FROM `order` WHERE provider_id=:provider_id";
//         $stmt = $this->conn->prepare($sql);
//         $stmt->bindParam(':provider_id', $this->provider_id, PDO::PARAM_INT);
//         $stmt->execute();
//         $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

//         if ($orders) {
//             // For each order, get related order items
//             foreach ($orders as &$order) {
//                 $itemSql = "SELECT item_id, order_id, product_id, quantity, unit_price, subtotal 
//                             FROM order_item 
//                             WHERE order_id = :order_id";
//                 $itemStmt = $this->conn->prepare($itemSql);
//                 $itemStmt->bindParam(':order_id', $order['order_id'], PDO::PARAM_INT);
//                 $itemStmt->execute();
//                 $items = $itemStmt->fetchAll(PDO::FETCH_ASSOC);

//                 // Attach items to order
//                 $order['items'] = $items ?: [];
//             }

//             return [
//                 'success' => true,
//                 'orders' => $orders,
//                 'message' => 'Orders fetched successfully.'
//             ];
//         } else {
//             return [
//                 'success' => false,
//                 'message' => 'No Orders found.'
//             ];
//         }
//     } catch (PDOException $e) {
//         http_response_code(500);
//         return [
//             'success' => false,
//             'message' => 'Failed to fetch orders. ' . $e->getMessage()
//         ];
//     }
// }
public function GetOrdersProvider($provider_id)
{
    $this->provider_id = $provider_id;

    try {
        // ✅ Get all orders that contain products from this provider
        $sql = "SELECT DISTINCT o.* 
                FROM `order` o
                INNER JOIN order_item oi ON o.order_id = oi.order_id
                INNER JOIN product p ON oi.product_id = p.product_id
                WHERE p.provider_id = :provider_id";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':provider_id', $this->provider_id, PDO::PARAM_INT);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$orders) {
            return [
                'success' => false,
                'message' => 'No Orders found for this provider.'
            ];
        }

        // ✅ For each order, get related order items + product details
        foreach ($orders as &$order) {
            $itemSql = "SELECT 
                            oi.item_id, 
                            oi.order_id, 
                            oi.product_id, 
                            oi.quantity, 
                            oi.unit_price, 
                            oi.subtotal,
                            p.name AS product_name,
                            p.images AS product_images,
                            p.category AS product_category
                        FROM order_item oi
                        INNER JOIN product p ON oi.product_id = p.product_id
                        WHERE oi.order_id = :order_id AND p.provider_id = :provider_id";

            $itemStmt = $this->conn->prepare($itemSql);
            $itemStmt->bindParam(':order_id', $order['order_id'], PDO::PARAM_INT);
            $itemStmt->bindParam(':provider_id', $this->provider_id, PDO::PARAM_INT);
            $itemStmt->execute();
            $items = $itemStmt->fetchAll(PDO::FETCH_ASSOC);

            $order['items'] = $items ?: [];

            // ✅ Compute totals for this provider's items in the order
            $totalAmount = 0;
            $totalItems = 0;
            foreach ($items as $item) {
                $totalAmount += $item['subtotal'];
                $totalItems += $item['quantity'];
            }

            $order['provider_total_amount'] = $totalAmount;
            $order['provider_total_items'] = $totalItems;
        }

        return [
            'success' => true,
            'orders' => $orders,
            'message' => 'Orders fetched successfully.'
        ];
    } catch (PDOException $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'Failed to fetch orders. ' . $e->getMessage()
        ];
    }
}



public function GetOrdersCustomer($customer_id)
{
    $this->customer_id = $customer_id;
    try {
        // Get orders of the customer
        $sql = "SELECT * FROM `order` WHERE customer_id=:customer_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':customer_id', $this->customer_id, PDO::PARAM_INT);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($orders) {
            // For each order, get related order items + product details
            foreach ($orders as &$order) {
                $itemSql = "SELECT 
                                oi.item_id, 
                                oi.order_id, 
                                oi.product_id, 
                                oi.quantity, 
                                oi.unit_price, 
                                oi.subtotal,
                                p.name AS product_name,
                                p.images AS product_images
                            FROM order_item oi
                            INNER JOIN product p ON oi.product_id = p.product_id
                            WHERE oi.order_id = :order_id";
                
                $itemStmt = $this->conn->prepare($itemSql);
                $itemStmt->bindParam(':order_id', $order['order_id'], PDO::PARAM_INT);
                $itemStmt->execute();
                $items = $itemStmt->fetchAll(PDO::FETCH_ASSOC);

                // Attach items (with product images) to order
                $order['items'] = $items ?: [];
            }

            return [
                'success' => true,
                'orders' => $orders,
                'message' => 'Orders fetched successfully.'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'No Orders found.'
            ];
        }
    } catch (PDOException $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'Failed to fetch orders. ' . $e->getMessage()
        ];
    }
}



    //     public function createOrder($customer_id, $cartItems, $paymentData, $shipping_address, $delivery_charge = 0)
    // {
    //     try {
    //         // Start transaction
    //         $this->conn->beginTransaction();

    //         // Calculate total amount from cart items
    //         $total_amount = 0;
    //         foreach ($cartItems as $item) {
    //             $total_amount += $item['total_price'];
    //         }
    //         $total_amount += $delivery_charge;

    //         // Insert into order table
    //         $sql = "INSERT INTO `order` (
    //             `customer_id`, 
    //             `order_date`, 
    //             `total_amount`, 
    //             `delivery_charge`, 
    //             `status`, 
    //             `shipping_address`, 
    //             `payment_status`, 
    //             `created_at`, 
    //             `updated_at`
    //         ) VALUES (?, NOW(), ?, ?, 'processing', ?, 'pending', NOW(), NOW())";

    //         $stmt = $this->conn->prepare($sql);
    //         $stmt->bindParam(1, $customer_id, PDO::PARAM_INT);
    //         $stmt->bindParam(2, $total_amount, PDO::PARAM_STR);
    //         $stmt->bindParam(3, $delivery_charge, PDO::PARAM_STR);
    //         $stmt->bindParam(4, $shipping_address, PDO::PARAM_STR);
    //         $stmt->execute();

    //         // Get the last inserted order ID
    //         $order_id = $this->conn->lastInsertId();

    //         // Insert into order_item table
    //         $orderItemSql = "INSERT INTO `order_item` (
    //             `order_id`, 
    //             `product_id`, 
    //             `quantity`, 
    //             `unit_price`, 
    //             `subtotal`
    //         ) VALUES (?, ?, ?, ?, ?)";

    //         $orderItemStmt = $this->conn->prepare($orderItemSql);

    //         foreach ($cartItems as $item) {
    //             $orderItemStmt->bindParam(1, $order_id, PDO::PARAM_INT);
    //             $orderItemStmt->bindParam(2, $item['product_id'], PDO::PARAM_INT);
    //             $orderItemStmt->bindParam(3, $item['quantity'], PDO::PARAM_INT);
    //             $orderItemStmt->bindParam(4, $item['unit_price'], PDO::PARAM_STR);
    //             $orderItemStmt->bindParam(5, $item['total_price'], PDO::PARAM_STR);
    //             $orderItemStmt->execute();
    //         }

    //         // Insert payment information
    //         $paymentSql = "INSERT INTO `payment` (
    //             `order_id`, 
    //             `customer_id`, 
    //             `card_number`, 
    //             `expiry_date`, 
    //             `cvv`, 
    //             `amount`, 
    //             `payment_status`, 
    //             `payment_date`
    //         ) VALUES (?, ?, ?, ?, ?, ?, 'completed', NOW())";

    //         $paymentStmt = $this->conn->prepare($paymentSql);
    //         $paymentStmt->bindParam(1, $order_id, PDO::PARAM_INT);
    //         $paymentStmt->bindParam(2, $customer_id, PDO::PARAM_INT);
    //         $paymentStmt->bindParam(3, $paymentData['cardNumber'], PDO::PARAM_STR);
    //         $paymentStmt->bindParam(4, $paymentData['expiry'], PDO::PARAM_STR);
    //         $paymentStmt->bindParam(5, $paymentData['cvv'], PDO::PARAM_STR);
    //         $paymentStmt->bindParam(6, $total_amount, PDO::PARAM_STR);
    //         $paymentStmt->execute();

    //         // Update order payment status
    //         $updateOrderSql = "UPDATE `order` SET `payment_status` = 'paid', `updated_at` = NOW() WHERE `order_id` = ?";
    //         $updateStmt = $this->conn->prepare($updateOrderSql);
    //         $updateStmt->bindParam(1, $order_id, PDO::PARAM_INT);
    //         $updateStmt->execute();

    //         // Clear the cart after successful order
    //         $clearCartSql = "DELETE ci FROM cart_item ci 
    //                         INNER JOIN cart c ON ci.cart_id = c.cart_id 
    //                         WHERE c.customer_id = ?";
    //         $clearCartStmt = $this->conn->prepare($clearCartSql);
    //         $clearCartStmt->bindParam(1, $customer_id, PDO::PARAM_INT);
    //         $clearCartStmt->execute();

    //         // Commit transaction
    //         $this->conn->commit();

    //         return [
    //             'success' => true,
    //             'order_id' => $order_id,
    //             'message' => 'Order created successfully'
    //         ];

    //     } catch (PDOException $e) {
    //         // Rollback transaction on error
    //         $this->conn->rollBack();

    //         error_log("Order creation failed: " . $e->getMessage());
    //         return [
    //             'success' => false,
    //             'message' => 'Failed to create order: ' . $e->getMessage()
    //         ];
    //     }
    // }

//     public function createOrder($customer_id, $cartItems, $paymentData, $shipping_address, $delivery_charge = 0)
//     {
//         try {
//             // Start transaction
//             $this->conn->beginTransaction();

//             // Calculate total amount from cart items
//             $total_amount = 0;
//             foreach ($cartItems as $item) {
//                 $total_amount += $item['total_price'];
//             }
//             $total_amount += $delivery_charge;

//             // Insert into order table
//             $sql = "INSERT INTO `order` (
//             `customer_id`, 
//             `order_date`, 
//             `total_amount`, 
//             `delivery_charge`, 
//             `status`, 
//             `shipping_address`, 
//             `payment_status`, 
//             `created_at`, 
//             `updated_at`
//         ) VALUES (?, NOW(), ?, ?, 'processing', ?, 'pending', NOW(), NOW())";

//             $stmt = $this->conn->prepare($sql);
//             $stmt->bindParam(1, $customer_id, PDO::PARAM_INT);
//             $stmt->bindParam(2, $total_amount, PDO::PARAM_STR);
//             $stmt->bindParam(3, $delivery_charge, PDO::PARAM_STR);
//             $stmt->bindParam(4, $shipping_address, PDO::PARAM_STR);
//             $stmt->execute();

//             // Get the last inserted order ID
//             $order_id = $this->conn->lastInsertId();

//             // Insert into order_item table
//             $orderItemSql = "INSERT INTO `order_item` (
//             `order_id`, 
//             `product_id`, 
//             `quantity`, 
//             `unit_price`, 
//             `subtotal`
//         ) VALUES (?, ?, ?, ?, ?)";

//             $orderItemStmt = $this->conn->prepare($orderItemSql);

//             foreach ($cartItems as $item) {
//                 $orderItemStmt->bindParam(1, $order_id, PDO::PARAM_INT);
//                 $orderItemStmt->bindParam(2, $item['product_id'], PDO::PARAM_INT);
//                 $orderItemStmt->bindParam(3, $item['quantity'], PDO::PARAM_INT);
//                 $orderItemStmt->bindParam(4, $item['unit_price'], PDO::PARAM_STR);
//                 $orderItemStmt->bindParam(5, $item['total_price'], PDO::PARAM_STR);
//                 $orderItemStmt->execute();
//             }

//             // Generate a unique transaction ID
//             $transaction_id = 'TXN_' . time() . '_' . $order_id;

//             // Insert payment information with correct table structure
//             $paymentSql = "INSERT INTO `payment` (
//             `order_id`, 
//             `customer_id`, 
//             `amount`, 
//             `payment_date`, 
//             `payment_method`, 
//             `transaction_id`, 
//             `status`
//         ) VALUES (?, ?, ?, NOW(), 'credit_card', ?, 'completed')";

//             $paymentStmt = $this->conn->prepare($paymentSql);
//             $paymentStmt->bindParam(1, $order_id, PDO::PARAM_INT);
//             $paymentStmt->bindParam(2, $customer_id, PDO::PARAM_INT);
//             $paymentStmt->bindParam(3, $total_amount, PDO::PARAM_STR);
//             $paymentStmt->bindParam(4, $transaction_id, PDO::PARAM_STR);
//             $paymentStmt->execute();

//             // Update order payment status
//             $updateOrderSql = "UPDATE `order` SET `payment_status` = 'paid', `updated_at` = NOW() WHERE `order_id` = ?";
//             $updateStmt = $this->conn->prepare($updateOrderSql);
//             $updateStmt->bindParam(1, $order_id, PDO::PARAM_INT);
//             $updateStmt->execute();

//             // // Clear the cart after successful order
//             // $clearCartSql = "DELETE ci FROM cart_item ci 
//             //                 INNER JOIN cart c ON ci.cart_id = c.cart_id 
//             //                 WHERE c.customer_id = ?";
//             // $clearCartStmt = $this->conn->prepare($clearCartSql);
//             // $clearCartStmt->bindParam(1, $customer_id, PDO::PARAM_INT);
//             // $clearCartStmt->execute();

//             $clearCartSql = "DELETE ci 
//                  FROM cart_item ci
//                  INNER JOIN cart c ON ci.cart_id = c.cart_id
//                  WHERE c.customer_id = ? AND ci.product_id = ?";

//             $clearCartStmt = $this->conn->prepare($clearCartSql);

//             foreach ($cartItems as $item) {
//                 $clearCartStmt->bindParam(1, $customer_id, PDO::PARAM_INT);
//                 $clearCartStmt->bindParam(2, $item['product_id'], PDO::PARAM_INT);
//                 $clearCartStmt->execute();
//             }

//             // Commit transaction
//             $this->conn->commit();

//             return [
//                 'success' => true,
//                 'order_id' => $order_id,
//                 'transaction_id' => $transaction_id,
//                 'message' => 'Order created successfully'
//             ];
//         } catch (PDOException $e) {
//             // Rollback transaction on error
//             $this->conn->rollBack();

//             error_log("Order creation failed: " . $e->getMessage());
//             return [
//                 'success' => false,
//                 'message' => 'Failed to create order: ' . $e->getMessage()
//             ];
//         }
//     }
// }

public function createOrder($customer_id, $cartItems, $paymentData, $shipping_address, $delivery_charge = 0)
{
    try {
        // Start transaction
        $this->conn->beginTransaction();

        // Calculate total amount from cart items
        $total_amount = 0;
        foreach ($cartItems as $item) {
            $total_amount += $item['total_price'];
        }
        $total_amount += $delivery_charge;

        // Determine payment status based on payment method
        // $payment_method = $paymentData['payment_method'] ?? 'cod';
        $payment_method=$paymentData;
        $payment_status = ($payment_method === 'card') ? 'completed' : 'pending';
        
        // Set initial order status
        $order_status = 'pending';

        // Insert into order table
        $sql = "INSERT INTO `order` (
            `customer_id`, 
            `order_date`, 
            `total_amount`, 
            `delivery_charge`, 
            `status`, 
            `shipping_address`, 
            `payment_status`, 
            `created_at`, 
            `updated_at`
        ) VALUES (?, NOW(), ?, ?, ?, ?, ?, NOW(), NOW())";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(1, $customer_id, PDO::PARAM_INT);
        $stmt->bindParam(2, $total_amount, PDO::PARAM_STR);
        $stmt->bindParam(3, $delivery_charge, PDO::PARAM_STR);
        $stmt->bindParam(4, $order_status, PDO::PARAM_STR);
        $stmt->bindParam(5, $shipping_address, PDO::PARAM_STR);
        $stmt->bindParam(6, $payment_status, PDO::PARAM_STR);
        $stmt->execute();

        // Get the last inserted order ID
        $order_id = $this->conn->lastInsertId();

        // Insert into order_item table
        $orderItemSql = "INSERT INTO `order_item` (
            `order_id`, 
            `product_id`, 
            `quantity`, 
            `unit_price`, 
            `subtotal`
        ) VALUES (?, ?, ?, ?, ?)";

        $orderItemStmt = $this->conn->prepare($orderItemSql);

        foreach ($cartItems as $item) {
            $orderItemStmt->bindParam(1, $order_id, PDO::PARAM_INT);
            $orderItemStmt->bindParam(2, $item['product_id'], PDO::PARAM_INT);
            $orderItemStmt->bindParam(3, $item['quantity'], PDO::PARAM_INT);
            $orderItemStmt->bindParam(4, $item['unit_price'], PDO::PARAM_STR);
            $orderItemStmt->bindParam(5, $item['total_price'], PDO::PARAM_STR);
            $orderItemStmt->execute();
        }

        // Generate a unique transaction ID only for card payments
        $transaction_id = null;
        if ($payment_method === 'card') {
            $transaction_id = 'TXN_' . time() . '_' . $order_id;
        }

        // Set payment status based on payment method
        $payment_status_db = ($payment_method !== 'cod') ? 'completed' : 'pending';

        // Insert payment information with correct table structure
        $paymentSql = "INSERT INTO `payment` (
            `order_id`, 
            `customer_id`, 
            `amount`, 
            `payment_date`, 
            `payment_method`, 
            `transaction_id`, 
            `status`
        ) VALUES (?, ?, ?, NOW(), ?, ?, ?)";

        $paymentStmt = $this->conn->prepare($paymentSql);
        $paymentStmt->bindParam(1, $order_id, PDO::PARAM_INT);
        $paymentStmt->bindParam(2, $customer_id, PDO::PARAM_INT);
        $paymentStmt->bindParam(3, $total_amount, PDO::PARAM_STR);
        $paymentStmt->bindParam(4, $payment_method, PDO::PARAM_STR);
        $paymentStmt->bindParam(5, $transaction_id, PDO::PARAM_STR);
        $paymentStmt->bindParam(6, $payment_status_db, PDO::PARAM_STR);
        $paymentStmt->execute();

        // For card payments, we don't update the order payment status yet as it's pending
        // For cash on delivery, we mark it as paid
        if ($payment_method === 'cash on delivery') {
            $updateOrderSql = "UPDATE `order` SET `payment_status` = 'paid', `updated_at` = NOW() WHERE `order_id` = ?";
            $updateStmt = $this->conn->prepare($updateOrderSql);
            $updateStmt->bindParam(1, $order_id, PDO::PARAM_INT);
            $updateStmt->execute();
        }

        // Clear only the purchased items from the cart
        $clearCartSql = "DELETE ci 
                         FROM cart_item ci
                         INNER JOIN cart c ON ci.cart_id = c.cart_id
                         WHERE c.customer_id = ? AND ci.product_id = ?";

        $clearCartStmt = $this->conn->prepare($clearCartSql);

        foreach ($cartItems as $item) {
            $clearCartStmt->bindParam(1, $customer_id, PDO::PARAM_INT);
            $clearCartStmt->bindParam(2, $item['product_id'], PDO::PARAM_INT);
            $clearCartStmt->execute();
        }

        // Commit transaction
        $this->conn->commit();

        return [
            'success' => true,
            'order_id' => $order_id,
            'transaction_id' => $transaction_id,
            'payment_method' => $payment_method,
            'payment_status' => $payment_status,
            'message' => 'Order created successfully'
        ];
    } catch (PDOException $e) {
        // Rollback transaction on error
        $this->conn->rollBack();

        error_log("Order creation failed: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to create order: ' . $e->getMessage()
        ];
    }
}

 public function updateOrderStatusProvider($order_id, $new_status)
    {
        $this->order_id = $order_id;
        $this->new_status = $new_status;

        try {
           $sql = "UPDATE `order`
        SET status = :status, updated_at = NOW()
        WHERE order_id = :order_id";

$stmt = $this->conn->prepare($sql);
$stmt->bindParam(':status', $this->new_status, PDO::PARAM_STR);
$stmt->bindParam(':order_id', $this->order_id, PDO::PARAM_INT);

$stmt->execute();


            if ($stmt->execute()) {
                return [
                    "success" => true,
                    "message" => "Order  status updated successfully."
                ];
            } else {
                return [
                    "success" => false,
                    "message" => "Failed to update order approval status."
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
