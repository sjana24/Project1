
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

}