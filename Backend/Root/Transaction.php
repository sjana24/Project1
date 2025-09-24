<?php
require_once "dBCon.php";

class Transaction{
    protected $conn;
    // protected $customer_id;
    protected $provider_id;
    protected $new_status;
    protected $order_id;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }

public function getAllTransactionsAdmin()
{
    try {
        $sql = "
        -- Product Orders (grouped by order_id across all providers)
        (SELECT 
            p.transaction_id,
            p.payment_id,
            p.order_id,
            c.customer_id,
            u.username AS customer_name,
            u.email AS customer_email,
            p.amount,
            p.payment_method,
            p.status,
            p.payment_date AS transaction_date,
            o.order_id AS reference_id,
            pr.provider_id,
            up.username AS provider_name,
            GROUP_CONCAT(DISTINCT prd.name SEPARATOR ', ') AS product_names,
            NULL AS service_name
        FROM payment p
        JOIN `order` o ON p.order_id = o.order_id
        JOIN customer c ON p.customer_id = c.customer_id
        JOIN user u ON c.user_id = u.user_id
        JOIN order_item oi ON o.order_id = oi.order_id
        JOIN product prd ON oi.product_id = prd.product_id
        JOIN service_provider pr ON prd.provider_id = pr.provider_id
        JOIN user up ON pr.user_id = up.user_id
        GROUP BY p.transaction_id, p.payment_id, p.order_id, c.customer_id, u.username, u.email, 
                 p.amount, p.payment_method, p.status, p.payment_date, o.order_id, pr.provider_id, up.username)

        UNION ALL

        -- Service Payments (already one per request)
        (SELECT 
            spay.transaction_id,
            spay.payment_id,
            spay.request_id AS order_id,
            c.customer_id,
            u.username AS customer_name,
            u.email AS customer_email,
            spay.amount,
            spay.payment_method,
            spay.status,
            spay.payment_date AS transaction_date,
            sr.request_id AS reference_id,
            s.provider_id,
            up.username AS provider_name,
            NULL AS product_names,
            s.name AS service_name
        FROM service_payment spay
        JOIN customer c ON spay.customer_id = c.customer_id
        JOIN user u ON c.user_id = u.user_id
        JOIN service_request sr ON spay.request_id = sr.request_id
        JOIN service s ON sr.service_id = s.service_id
        JOIN service_provider sp ON s.provider_id = sp.provider_id
        JOIN user up ON sp.user_id = up.user_id)
        
        ORDER BY transaction_date DESC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'success' => true,
            'transactions' => $transactions
        ];
    } catch (PDOException $e) {
        return [
            'success' => false,
            'message' => 'Failed to fetch transactions: ' . $e->getMessage()
        ];
    }
}

public function getAllTransactionsByProvider1($provider_id)
{
    try {
        $sql = "
        -- Product Orders (for this provider)
        (SELECT 
            p.transaction_id,
            p.payment_id,
            p.order_id,
            c.customer_id,
            u.username AS customer_name,
            u.email AS customer_email,
            p.amount,
            p.payment_method,
            p.status,
            p.payment_date AS transaction_date,
            o.order_id AS reference_id,
            pr.provider_id,
            up.username AS provider_name,
            NULL AS service_name
        FROM payment p
        JOIN `order` o ON p.order_id = o.order_id
        JOIN customer c ON p.customer_id = c.customer_id
        JOIN user u ON c.user_id = u.user_id
        JOIN order_item oi ON o.order_id = oi.order_id
        JOIN product prd ON oi.product_id = prd.product_id
        JOIN service_provider pr ON prd.provider_id = pr.provider_id
        JOIN user up ON pr.user_id = up.user_id
        WHERE pr.provider_id = :provider_id)

        UNION ALL

        -- Service Payments (for this provider)
        (SELECT 
            spay.transaction_id,
            spay.payment_id,
            spay.request_id AS order_id,
            c.customer_id,
            u.username AS customer_name,
            u.email AS customer_email,
            spay.amount,
            spay.payment_method,
            spay.status,
            spay.payment_date AS transaction_date,
            sr.request_id AS reference_id,
            s.provider_id,
            up.username AS provider_name,
            s.name AS service_name
        FROM service_payment spay
        JOIN customer c ON spay.customer_id = c.customer_id
        JOIN user u ON c.user_id = u.user_id
        JOIN service_request sr ON spay.request_id = sr.request_id
        JOIN service s ON sr.service_id = s.service_id
        JOIN service_provider sp ON s.provider_id = sp.provider_id
        JOIN user up ON sp.user_id = up.user_id
        WHERE s.provider_id = :provider_id)
        
        ORDER BY transaction_date DESC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
        $stmt->execute();
        $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'success' => true,
            'transactions' => $transactions
        ];
    } catch (PDOException $e) {
        return [
            'success' => false,
            'message' => 'Failed to fetch transactions: ' . $e->getMessage()
        ];
    }
}
public function getAllTransactionsByProvider($provider_id)
{
    try {
        $sql = "
        -- Product Orders (grouped by order_id for this provider)
        (SELECT 
            p.transaction_id,
            p.payment_id,
            p.order_id,
            c.customer_id,
            u.username AS customer_name,
            u.email AS customer_email,
            p.amount,
            p.payment_method,
            p.status,
            p.payment_date AS transaction_date,
            o.order_id AS reference_id,
            pr.provider_id,
            up.username AS provider_name,
            GROUP_CONCAT(DISTINCT prd.name SEPARATOR ', ') AS product_names,
            NULL AS service_name
        FROM payment p
        JOIN `order` o ON p.order_id = o.order_id
        JOIN customer c ON p.customer_id = c.customer_id
        JOIN user u ON c.user_id = u.user_id
        JOIN order_item oi ON o.order_id = oi.order_id
        JOIN product prd ON oi.product_id = prd.product_id
        JOIN service_provider pr ON prd.provider_id = pr.provider_id
        JOIN user up ON pr.user_id = up.user_id
        WHERE pr.provider_id = :provider_id
        GROUP BY p.transaction_id, p.payment_id, p.order_id, c.customer_id, u.username, u.email, 
                 p.amount, p.payment_method, p.status, p.payment_date, o.order_id, pr.provider_id, up.username)

        UNION ALL

        -- Service Payments (no grouping needed, already one per request)
        (SELECT 
            spay.transaction_id,
            spay.payment_id,
            spay.request_id AS order_id,
            c.customer_id,
            u.username AS customer_name,
            u.email AS customer_email,
            spay.amount,
            spay.payment_method,
            spay.status,
            spay.payment_date AS transaction_date,
            sr.request_id AS reference_id,
            s.provider_id,
            up.username AS provider_name,
            NULL AS product_names,
            s.name AS service_name
        FROM service_payment spay
        JOIN customer c ON spay.customer_id = c.customer_id
        JOIN user u ON c.user_id = u.user_id
        JOIN service_request sr ON spay.request_id = sr.request_id
        JOIN service s ON sr.service_id = s.service_id
        JOIN service_provider sp ON s.provider_id = sp.provider_id
        JOIN user up ON sp.user_id = up.user_id
        WHERE s.provider_id = :provider_id)
        
        ORDER BY transaction_date DESC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
        $stmt->execute();
        $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'success' => true,
            'transactions' => $transactions
        ];
    } catch (PDOException $e) {
        return [
            'success' => false,
            'message' => 'Failed to fetch transactions: ' . $e->getMessage()
        ];
    }
}





// public function getAllQas()
// {
//     try {
//         $sql = "SELECT *
//                 FROM qa
//                 WHERE answer IS NULL OR answer_date IS NULL
//                 ORDER BY created_at DESC";
        
//         $stmt = $this->conn->prepare($sql);
//         $stmt->execute();

//         $qas = $stmt->fetchAll(PDO::FETCH_ASSOC);

//         if ($qas) {
//             return [
//                 'success' => true,
//                 'Qas' => $qas,
//                 'message' => 'Requests fetched successfully.'
//             ];
//         } else {
//             return [
//                 'success' => false,
//                 'message' => 'No qass found.'
//             ];
//         }
//     } catch (PDOException $e) {
//         http_response_code(500);
//         return [
//             'success' => false,
//             'message' => 'Failed to fetch QAs. ' . $e->getMessage()
//         ];
//     }
// }
// public function customerQueryInsert($full_name, $email, $subject, $question)
// {
//     try {
//         // Prepare SQL query to insert a new question
//         $sql = "INSERT INTO qa (full_name, email, subject, question, created_at)
//                 VALUES (:full_name, :email, :subject, :question, NOW())";

//         $stmt = $this->conn->prepare($sql);
//         $stmt->bindParam(':full_name', $full_name, PDO::PARAM_STR);
//         $stmt->bindParam(':email', $email, PDO::PARAM_STR);
//         $stmt->bindParam(':subject', $subject, PDO::PARAM_STR);
//         $stmt->bindParam(':question', $question, PDO::PARAM_STR);

//         $stmt->execute();

//         if ($stmt->rowCount() > 0) {
//             return [
//                 'success' => true,
//                 'message' => 'Question submitted successfully.',
//                 'qa_id' => $this->conn->lastInsertId() // Return inserted QA ID
//             ];
//         } else {
//             return [
//                 'success' => false,
//                 'message' => 'Failed to submit question.'
//             ];
//         }
//     } catch (PDOException $e) {
//         http_response_code(500);
//         return [
//             'success' => false,
//             'message' => 'Failed to submit question. ' . $e->getMessage()
//         ];
//     }
// }


// public function updateAnswer($qa_id, $responcer_id, $answer)
// {
//     try {
//         // Prepare SQL query to update answer and answer_date
//         $sql = "UPDATE qa 
//                 SET answer = :answer, 
//                     answer_date = NOW(), 
//                     responcer_id = :responcer_id 
//                 WHERE qa_id = :qa_id";

//         $stmt = $this->conn->prepare($sql);
//         $stmt->bindParam(':answer', $answer, PDO::PARAM_STR);
//         $stmt->bindParam(':responcer_id', $responcer_id, PDO::PARAM_INT);
//         $stmt->bindParam(':qa_id', $qa_id, PDO::PARAM_INT);

//         $stmt->execute();

//         if ($stmt->rowCount() > 0) {
//             return [
//                 'success' => true,
//                 'message' => 'Answer updated successfully.'
//             ];
//         } else {
//             return [
//                 'success' => false,
//                 'message' => 'No record updated. Please check QA ID.'
//             ];
//         }
//     } catch (PDOException $e) {
//         http_response_code(500);
//         return [
//             'success' => false,
//             'message' => 'Failed to update answer. ' . $e->getMessage()
//         ];
//     }
// }



}
