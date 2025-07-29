
<?php
require_once "dbCon.php";
class Job{

    protected $job_id;
    protected $provider_id;
    protected $admin_id;
    protected $title;
    protected $description;
    protected $requirements;
    protected $location;
    protected $job_type;
    protected $salary_range;
    protected $posting_date;
    protected $expiry_date;
    protected $conn;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }

        public function getAllJobsCustomer(){

        try {
            $sql = "SELECT * FROM job_posting";
            $stmt = $this->conn->prepare($sql);

            $stmt->execute();
            $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($jobs) {
                return [
                    'success' => true,
                    'jobs' => $jobs,
                    'message' => 'Jobs fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No jobs found.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all jobs. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch jobs. ' . $e->getMessage()
            ];
        }
    }
      public function getAllJobsProvider($provider_id)
    {

        try {
            $sql = "SELECT * FROM job_posting WHERE  provider_id=:provider_id";
            $stmt = $this->conn->prepare($sql);
             $stmt->bindParam(':provider_id', $provider_id); 
            $stmt->execute();
            $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($jobs) {
                return [
                    'success' => true,
                    'jobs' => $jobs,
                    'message' => 'Jobs fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No jobs found.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all jobs. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch jobs. ' . $e->getMessage()
            ];
        }
    }
    public function addJob($provider_id, $title, $description, $requirements, $benefits, $location, $job_type, $expiryDate, $minSalary,$maxSalary)
    {   /////salary mathanum marakathaaa
        
        try {
            $sql = "INSERT INTO job_posting (provider_id, title, description, requirements, benefits, location, job_type, expiry_date, salary_range) 
                    VALUES (:provider_id, :title, :description, :requirements, :benefits, :location, :job_type, :expiry_date, :salary_range)";
            $stmt = $this->conn->prepare($sql);

            $stmt->bindParam(':provider_id', $provider_id);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':requirements', $requirements);
            $stmt->bindParam(':benefits', $benefits);
            $stmt->bindParam(':location', $location);
            $stmt->bindParam(':job_type', $job_type);
            $stmt->bindParam(':expiry_date', $expiryDate);
            $stmt->bindParam(':salary_range', $salary);

            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Job added successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to add job.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed to add job. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to add job. ' . $e->getMessage()
            ];
        }
    }

    public function updateJob($job_id, $provider_id, $title, $description, $requirements, $benefits, $location, $job_type, $expiryDate, $salary)
{
    try {
        $sql = "UPDATE job_posting SET 
                    provider_id = :provider_id,
                    title = :title,
                    description = :description,
                    requirements = :requirements,
                    benefits = :benefits,
                    location = :location,
                    job_type = :job_type,
                    expiry_date = :expiry_date,
                    salary_range = :salary_range
                WHERE job_id = :job_id";

        $stmt = $this->conn->prepare($sql);

        // Bind values
        $stmt->bindParam(':provider_id', $provider_id);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':requirements', $requirements);
        $stmt->bindParam(':benefits', $benefits);
        $stmt->bindParam(':location', $location);
        $stmt->bindParam(':job_type', $job_type);
        $stmt->bindParam(':expiry_date', $expiryDate);
        $stmt->bindParam(':salary_range', $salary);
        $stmt->bindParam(':job_id', $job_id);

        if ($stmt->execute()) {
            return [
                'success' => true,
                'message' => 'Job updated successfully.'
            ];
        } else {
            error_log(print_r($stmt->errorInfo(), true));
            return [
                'success' => false,
                'message' => 'Failed to update job.'
            ];
        }
    } catch (PDOException $e) {
        http_response_code(500);
        error_log("PDO Error: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to update job. ' . $e->getMessage()
        ];
    }
}


}