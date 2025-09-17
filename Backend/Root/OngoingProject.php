
<?php
require_once "dbCon.php";
class OngoingProject
{

    protected $project_id;
    protected $start_date;
    protected $due_date;
    protected $new_status;
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

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }

    public function getAllOngoingProjectProvider1($provider_id)
    {
        $this->provider_id = $provider_id;
        try {
            // $sql = "SELECT * FROM ongoing_project WHERE  provider_id=:provider_id";
            $sql = "SELECT 
    op.*,
    sr.*,
    s.*
FROM ongoing_project op
INNER JOIN service_request sr 
    ON op.request_id = sr.request_id
INNER JOIN service s 
    ON sr.service_id = s.service_id
WHERE s.provider_id = :provider_id";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':provider_id', $provider_id);
            $stmt->execute();
            $onProjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($onProjects) {
                return [
                    'success' => true,
                    'onProjects' => $onProjects,
                    'message' => 'Ongoing Projects fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No ongoing Projects found.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all ongoing Projects. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch ongoing Projects. ' . $e->getMessage()
            ];
        }
    }
    public function getOngoingProjectsByProvider($provider_id)
    {
        try {
            $finalResults = [];

            // Step 1: Get all ongoing projects for the given provider with related info
            $sql = "SELECT 
                    op.*,
                    sr.request_id,
                    sr.status AS request_status,
                    u.username AS customer_name,
                    u.email AS customer_email,
                    c.contact_number AS customer_phone,
                    s.name AS service_name,
                    s.description AS service_description,
                    s.price AS service_price,
                    s.category AS service_category
                FROM ongoing_project op
                JOIN service_request sr ON op.request_id = sr.request_id
                JOIN customer c ON sr.customer_id = c.customer_id
                JOIN user u ON c.user_id = u.user_id
                JOIN service s ON sr.service_id = s.service_id
                WHERE s.provider_id = :provider_id";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':provider_id', $provider_id);
            $stmt->execute();
            $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Step 2: Get detailed info depending on the service_category
            foreach ($projects as $project) {
                $requestId = $project['request_id'];
                $type = strtolower($project['service_category']); // installation, maintenance, relocation

                $extraDetails = [];

                switch ($type) {
                    case 'installation':
                        $detailSql = "SELECT installation_address, roof_height 
                                  FROM installation_request 
                                  WHERE request_id = :request_id";
                        break;

                    case 'maintenance':
                        $detailSql = "SELECT device_condition, service_notes, last_maintenance_date, roof_height 
                                  FROM maintenance_request_details 
                                  WHERE request_id = :request_id";
                        break;

                    case 'relocation':
                        $detailSql = "SELECT current_address, new_address, current_roof_height, new_roof_height 
                                  FROM relocated_request 
                                  WHERE request_id = :request_id";
                        break;

                    default:
                        $detailSql = null;
                }

                if ($detailSql) {
                    $detailStmt = $this->conn->prepare($detailSql);
                    $detailStmt->bindParam(':request_id', $requestId);
                    $detailStmt->execute();
                    $extraDetails = $detailStmt->fetch(PDO::FETCH_ASSOC) ?: [];
                }

                $finalResults[] = array_merge($project, ['details' => $extraDetails]);
            }

            return [
                'success' => true,
                'projects' => $finalResults,
                'message' => 'Ongoing projects fetched successfully for provider.'
            ];
        } catch (PDOException $e) {
            http_response_code(500);
            return [
                'success' => false,
                'message' => 'Error fetching ongoing projects: ' . $e->getMessage()
            ];
        }
    }

    public function updateOngoingProjectDateProvider($project_id, $start_date, $due_date)
    {
        $this->project_id = $project_id;
        $this->start_date = $start_date;
        $this->due_date = $due_date;

        try {
            $sql = "UPDATE `ongoing_project`
        SET start_date = :start_date, due_date = :due_date, updated_at = NOW()
        WHERE project_id = :project_id";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':start_date', $this->start_date, PDO::PARAM_STR);
            $stmt->bindParam(':due_date', $this->due_date, PDO::PARAM_STR);
            $stmt->bindParam(':project_id', $this->project_id, PDO::PARAM_INT);

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

        public function updateOngoingProjectStatusProvider($project_id, $new_status)
    {
        $this->project_id = $project_id;
        $this->new_status = $new_status;

        try {
            $sql = "UPDATE `ongoing_project`
        SET status = :new_status, updated_at = NOW()
        WHERE project_id = :project_id";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':new_status', $this->new_status, PDO::PARAM_STR);
            // $stmt->bindParam(':due_date', $this->due_date, PDO::PARAM_STR);
            $stmt->bindParam(':project_id', $this->project_id, PDO::PARAM_INT);

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



    // public function getAllJobsCustomer()
    // {

    //     try {
    //         $sql = "SELECT * FROM job_posting";
    //         $stmt = $this->conn->prepare($sql);

    //         $stmt->execute();
    //         $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //         if ($jobs) {
    //             return [
    //                 'success' => true,
    //                 'jobs' => $jobs,
    //                 'message' => 'Jobs fetched successfully.'
    //             ];
    //         } else {
    //             return [
    //                 'success' => false,
    //                 'message' => 'No jobs found.'
    //             ];
    //         }
    //     } catch (PDOException $e) {
    //         http_response_code(500);
    //         echo json_encode(["message" => "failed get all jobs. " . $e->getMessage()]);
    //         return [
    //             'success' => false,
    //             'message' => 'Failed to fetch jobs. ' . $e->getMessage()
    //         ];
    //     }
    // }
    // public function getAllJobsProvider($provider_id)
    // {

    //     try {
    //         $sql = "SELECT * FROM job_posting WHERE  provider_id=:provider_id";
    //         $stmt = $this->conn->prepare($sql);
    //         $stmt->bindParam(':provider_id', $provider_id);
    //         $stmt->execute();
    //         $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //         if ($jobs) {
    //             return [
    //                 'success' => true,
    //                 'jobs' => $jobs,
    //                 'message' => 'Jobs fetched successfully.'
    //             ];
    //         } else {
    //             return [
    //                 'success' => false,
    //                 'message' => 'No jobs found.'
    //             ];
    //         }
    //     } catch (PDOException $e) {
    //         http_response_code(500);
    //         echo json_encode(["message" => "failed get all jobs. " . $e->getMessage()]);
    //         return [
    //             'success' => false,
    //             'message' => 'Failed to fetch jobs. ' . $e->getMessage()
    //         ];
    //     }
    // }

    // public function addJobProvider($provider_id, $title, $description, $requirements, $benifits, $location, $job_type, $expiryDate, $minSalary, $maxSalary)
    // {   /////salary mathanum marakathaaa

    //     //  $this->job_id = $job_id;
    //     $this->provider_id = $provider_id;
    //     $this->title = $title;
    //     $this->description = $description;
    //     $this->requirements = $requirements;
    //     $this->benifits = $benifits;
    //     $this->location = $location;
    //     $this->job_type = $job_type;
    //     $this->minSalary = $minSalary;
    //     $this->maxSalary = $maxSalary;
    //     $this->expiry_date = $expiryDate;
    //     try {
    //         $sql = "INSERT INTO job_posting (provider_id, title, description, requirements, benefits, location, job_type,min_salary,max_salary, expiry_date) 
    //                 VALUES (:provider_id, :title, :description, :requirements, :benefits, :location, :job_type, :expiry_date, :min_salary ,:max_salary)";
    //         $stmt = $this->conn->prepare($sql);

    //         $stmt->bindParam(':provider_id',$this->provider_id);
    //         $stmt->bindParam(':title', $this->title);
    //         $stmt->bindParam(':description', $this->description);
    //         $stmt->bindParam(':requirements', $this->requirements);
    //         $stmt->bindParam(':benefits', $this->benifits);
    //         $stmt->bindParam(':location', $this->location);
    //         $stmt->bindParam(':job_type', $this->job_type);
    //         $stmt->bindParam(':expiry_date', $this->expiry_date);
    //         $stmt->bindParam(':min_salary', $this->maxSalary);
    //         $stmt->bindParam(':max_salary', $this->minSalary);

    //         if ($stmt->execute()) {
    //             return [
    //                 'success' => true,
    //                 'message' => 'Job added successfully.'
    //             ];
    //         } else {
    //             return [
    //                 'success' => false,
    //                 'message' => 'Failed to add job.'
    //             ];
    //         }
    //     } catch (PDOException $e) {
    //         http_response_code(500);
    //         echo json_encode(["message" => "failed to add job. " . $e->getMessage()]);
    //         return [
    //             'success' => false,
    //             'message' => 'Failed to add job. ' . $e->getMessage()
    //         ];
    //     }
    // }

    // public function editJobProvider($job_id, $provider_id, $title, $description, $requirements, $benifits, $location, $job_type, $expiryDate, $minSalary, $maxSalary)
    // {
    //     $this->job_id = $job_id;
    //     $this->provider_id = $provider_id;
    //     $this->title = $title;
    //     $this->description = $description;
    //     $this->requirements = $requirements;
    //     $this->benifits = $benifits;
    //     $this->location = $location;
    //     $this->job_type = $job_type;
    //     $this->minSalary = $minSalary;
    //     $this->maxSalary = $maxSalary;
    //     $this->expiry_date = $expiryDate;

    //     try {
    //         $sql = "UPDATE job_posting SET 
    //                 title = :title,
    //                 description = :description,
    //                 requirements = :requirements,
    //                 benefits = :benefits,
    //                 location = :location,
    //                 job_type = :job_type,
    //                 expiry_date = :expiry_date,
    //                 min_salary = :min_salary,
    //                 max_salary = :max_salary
    //             WHERE job_id = :job_id AND  provider_id = :provider_id";

    //         $stmt = $this->conn->prepare($sql);

    //         // Bind values
    //         $stmt->bindParam(':provider_id', $this->provider_id);
    //         $stmt->bindParam(':title', $this->title);
    //         $stmt->bindParam(':description', $this->description);
    //         $stmt->bindParam(':requirements', $this->requirements);
    //         $stmt->bindParam(':benefits', $this->benifits);
    //         $stmt->bindParam(':location', $this->location);
    //         $stmt->bindParam(':job_type', $this->job_type);
    //         $stmt->bindParam(':expiry_date', $this->expiry_date);
    //         $stmt->bindParam(':min_salary', $this->minSalary);
    //         $stmt->bindParam(':max_salary', $this->maxSalary);
    //         $stmt->bindParam(':job_id', $job_id);

    //         if ($stmt->execute()) {
    //             return [
    //                 'success' => true,
    //                 'message' => 'Job updated successfully.'
    //             ];
    //         } else {
    //             error_log(print_r($stmt->errorInfo(), true));
    //             return [
    //                 'success' => false,
    //                 'message' => 'Failed to update job.'
    //             ];
    //         }
    //     } catch (PDOException $e) {
    //         http_response_code(500);
    //         error_log("PDO Error: " . $e->getMessage());
    //         return [
    //             'success' => false,
    //             'message' => 'Failed to update job. ' . $e->getMessage()
    //         ];
    //     }
    // }
}
