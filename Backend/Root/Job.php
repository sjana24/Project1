
<?php
require_once "dbCon.php";
class Job
{

    protected $job_id;
    protected $provider_id;
    protected $admin_id;
    protected $title;
    protected $description;
    protected $requirements;
    protected $location;
    protected $job_type;
    protected $benifits;
    protected $salary_range;
    protected $minSalary;
    protected $maxSalary;
    protected $posting_date;
    protected $expiry_date;
    protected $conn;

    protected $jobId;
    protected $fullName;
    protected $email;
    protected $phone;
    protected $contactMethod;
    protected $jobRole;
    protected $resume;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }

    public function getAllJobsCustomer()
    {

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

public function getAllJobRequestsProvider($provider_id)
{
    $this->provider_id = $provider_id;
    try {
        $sql = "SELECT 
                    ja.jobid AS request_id,
                    ja.fullName,
                    ja.email,
                    ja.phone,
                    ja.contactMethod,
                    ja.resume,
         
                    ja.created_at AS applied_at,

                    jp.job_id,
                    jp.title,
                    jp.location,
                    jp.job_type,
                    jp.min_salary,
                    jp.max_salary,
                    jp.posting_date,
                    jp.expiry_date,
                    jp.status AS job_status,
                    jp.requirements,
                    jp.benefits
                FROM jobapply ja
                INNER JOIN job_posting jp ON ja.jobId = jp.job_id
                WHERE jp.provider_id = :provider_id
                ORDER BY ja.created_at DESC";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':provider_id', $this->provider_id, PDO::PARAM_INT);
        $stmt->execute();
        $jobRequests = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($jobRequests) {
            return [
                'success' => true,
                'jobRequests' => $jobRequests,
                'message' => 'Requests fetched successfully.'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'No requests found.'
            ];
        }
    } catch (PDOException $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'Failed to fetch job requests. ' . $e->getMessage()
        ];
    }
}


//     public function getAllJobRequestsProvider1($provider_id)
//     {

//         $this->provider_id = $provider_id;
//         try {
//             $sql = "SELECT 
//     jp.*,
//     ja.*
    
// FROM jobapply ja
// LEFT JOIN job_posting jp ON ja.jobId = jp.job_id
// WHERE jp.provider_id = :provider_id;
// ";
//             $stmt = $this->conn->prepare($sql);
//             $stmt->bindParam(':provider_id', $this->provider_id);
//             $stmt->execute();
//             $jobRequests = $stmt->fetchAll(PDO::FETCH_ASSOC);

//             if ($jobRequests) {
//                 return [
//                     'success' => true,
//                     'jobRequests' => $jobRequests,
//                     'message' => 'Requests fetched successfully.'
//                 ];
//             } else {
//                 return [
//                     'success' => false,
//                     'message' => 'No requests found.'
//                 ];
//             }
//         } catch (PDOException $e) {
//             http_response_code(500);
//             echo json_encode(["message" => "failed get all jobs. " . $e->getMessage()]);
//             return [
//                 'success' => false,
//                 'message' => 'Failed to fetch jobs. ' . $e->getMessage()
//             ];
//         }
//     }

    public function addJobProvider($provider_id, $title, $description, $requirements, $benifits, $location, $job_type, $expiryDate, $minSalary, $maxSalary)
    {   /////salary mathanum marakathaaa

        //  $this->job_id = $job_id;
        $this->provider_id = $provider_id;
        $this->title = $title;
        $this->description = $description;
        $this->requirements = $requirements;
        $this->benifits = $benifits;
        $this->location = $location;
        $this->job_type = $job_type;
        $this->minSalary = $minSalary;
        $this->maxSalary = $maxSalary;
        $this->expiry_date = $expiryDate;
        try {
            $sql = "INSERT INTO job_posting (provider_id, title, description, requirements, benefits, location, job_type,min_salary,max_salary, expiry_date) 
                    VALUES (:provider_id, :title, :description, :requirements, :benefits, :location, :job_type, :expiry_date, :min_salary ,:max_salary)";
            $stmt = $this->conn->prepare($sql);

            $stmt->bindParam(':provider_id', $this->provider_id);
            $stmt->bindParam(':title', $this->title);
            $stmt->bindParam(':description', $this->description);
            $stmt->bindParam(':requirements', $this->requirements);
            $stmt->bindParam(':benefits', $this->benifits);
            $stmt->bindParam(':location', $this->location);
            $stmt->bindParam(':job_type', $this->job_type);
            $stmt->bindParam(':expiry_date', $this->expiry_date);
            $stmt->bindParam(':min_salary', $this->maxSalary);
            $stmt->bindParam(':max_salary', $this->minSalary);

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

    public function addJobApplication($jobId, $fullName, $email, $phone, $contactMethod, $jobRole, $resumeFileName)
{
    $this->jobId = $jobId;
    $this->fullName = $fullName;
    $this->email = $email;
    $this->phone = $phone;
    $this->contactMethod = $contactMethod;
    $this->jobRole = $jobRole;
    $this->resume = $resumeFileName;

    try {
        $sql = "INSERT INTO jobapply 
                (jobId, fullName, email, phone, contactMethod, jobRole, resume, created_at) 
                VALUES 
                (:jobId, :fullName, :email, :phone, :contactMethod, :jobRole, :resume, NOW())";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindParam(':jobId', $this->jobId, PDO::PARAM_INT);
        $stmt->bindParam(':fullName', $this->fullName);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':contactMethod', $this->contactMethod);
        $stmt->bindParam(':jobRole', $this->jobRole);
        $stmt->bindParam(':resume', $this->resume);

        if ($stmt->execute()) {
            return [
                'success' => true,
                'message' => 'Job application submitted successfully.'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Failed to submit job application.'
            ];
        }
    } catch (PDOException $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'Failed to submit job application. ' . $e->getMessage()
        ];
    }
}

    public function editJobProvider($job_id, $provider_id, $title, $description, $requirements, $benifits, $location, $job_type, $expiryDate, $minSalary, $maxSalary)
    {
        $this->job_id = $job_id;
        $this->provider_id = $provider_id;
        $this->title = $title;
        $this->description = $description;
        $this->requirements = $requirements;
        $this->benifits = $benifits;
        $this->location = $location;
        $this->job_type = $job_type;
        $this->minSalary = $minSalary;
        $this->maxSalary = $maxSalary;
        $this->expiry_date = $expiryDate;

        try {
            $sql = "UPDATE job_posting SET 
                    title = :title,
                    description = :description,
                    requirements = :requirements,
                    benefits = :benefits,
                    location = :location,
                    job_type = :job_type,
                    expiry_date = :expiry_date,
                    min_salary = :min_salary,
                    max_salary = :max_salary
                WHERE job_id = :job_id AND  provider_id = :provider_id";

            $stmt = $this->conn->prepare($sql);

            // Bind values
            $stmt->bindParam(':provider_id', $this->provider_id);
            $stmt->bindParam(':title', $this->title);
            $stmt->bindParam(':description', $this->description);
            $stmt->bindParam(':requirements', $this->requirements);
            $stmt->bindParam(':benefits', $this->benifits);
            $stmt->bindParam(':location', $this->location);
            $stmt->bindParam(':job_type', $this->job_type);
            $stmt->bindParam(':expiry_date', $this->expiry_date);
            $stmt->bindParam(':min_salary', $this->minSalary);
            $stmt->bindParam(':max_salary', $this->maxSalary);
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
