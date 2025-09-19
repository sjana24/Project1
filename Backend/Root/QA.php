<?php
require_once "dBCon.php";

class QA{
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


public function getAllQas()
{
    try {
        $sql = "SELECT *
                FROM qa
                WHERE answer IS NULL OR answer_date IS NULL
                ORDER BY created_at DESC";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        $qas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($qas) {
            return [
                'success' => true,
                'Qas' => $qas,
                'message' => 'Requests fetched successfully.'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'No qass found.'
            ];
        }
    } catch (PDOException $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'Failed to fetch QAs. ' . $e->getMessage()
        ];
    }
}
public function customerQueryInsert($full_name, $email, $subject, $question)
{
    try {
        // Prepare SQL query to insert a new question
        $sql = "INSERT INTO qa (full_name, email, subject, question, created_at)
                VALUES (:full_name, :email, :subject, :question, NOW())";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':full_name', $full_name, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':subject', $subject, PDO::PARAM_STR);
        $stmt->bindParam(':question', $question, PDO::PARAM_STR);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return [
                'success' => true,
                'message' => 'Question submitted successfully.',
                'qa_id' => $this->conn->lastInsertId() // Return inserted QA ID
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Failed to submit question.'
            ];
        }
    } catch (PDOException $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'Failed to submit question. ' . $e->getMessage()
        ];
    }
}


public function updateAnswer($qa_id, $responcer_id, $answer)
{
    try {
        // Prepare SQL query to update answer and answer_date
        $sql = "UPDATE qa 
                SET answer = :answer, 
                    answer_date = NOW(), 
                    responcer_id = :responcer_id 
                WHERE qa_id = :qa_id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':answer', $answer, PDO::PARAM_STR);
        $stmt->bindParam(':responcer_id', $responcer_id, PDO::PARAM_INT);
        $stmt->bindParam(':qa_id', $qa_id, PDO::PARAM_INT);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return [
                'success' => true,
                'message' => 'Answer updated successfully.'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'No record updated. Please check QA ID.'
            ];
        }
    } catch (PDOException $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'Failed to update answer. ' . $e->getMessage()
        ];
    }
}



}
