<?php
require_once "dbCon.php";

class Notification
{
    protected $service_id;
    protected $customer_id;
    protected $provider_id;
    protected $receiver_id;
    protected $sender_type;
    protected $title;
    protected $message;
    protected $sender_id;

    protected $conn;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }

    public function getAllNotificationCustomer($user_id, $user_role)
    {
        $user_type = $user_role === "customer" ? "service_provider" : "customer";
        try {
            $sql = "
        SELECT 
    n.notification_id, 
    n.reciver_id, 
    n.sender_user_type, 
    n.title, 
    n.message, 
    n.is_read, 
    n.created_at, 
    n.sender_id,
    u.username AS sender_name

FROM notification n

-- Join with customer table (if sender is a customer)
LEFT JOIN customer c ON n.sender_user_type = 'customer' AND n.sender_id = c.customer_id

-- Join with provider table (if sender is a provider)
LEFT JOIN service_provider p ON n.sender_user_type = 'service_provider' AND n.sender_id = p.provider_id

-- Join with user table using user_id from role tables
LEFT JOIN user u ON 
    (n.sender_user_type = 'customer' AND c.user_id = u.user_id) OR 
    (n.sender_user_type = 'service_provider' AND p.user_id = u.user_id)

WHERE n.reciver_id = ? AND n.is_read = 0 AND n.sender_user_type = ?  ORDER BY created_at DESC";


            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(1, $user_id);
            $stmt->bindParam(2, $user_type);
            $stmt->execute();

            $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($notifications) {
                return [
                    'success' => true,
                    'notifications' => $notifications,
                    'message' => 'Notifications fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No notifications found for the given user.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to fetch notifications. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch notifications. ' . $e->getMessage()
            ];
        }
    }

    public function insertNotificationStatusCustomer($contact_id, $user_role, $status, $user_id, $success, $sender_id)
    {
        try {
            // Only insert notification if status is 'accepted'
            if (strtolower($status) !== 'accepted') {
                return [
                    "success" => false,
                    "message" => "Notification not created. Status is not 'accepted'."
                ];
            }

            // Optional: Auto-generate created_at and is_read = 0 (unread)
            $sql = "INSERT INTO notification (reciver_id,user_type, title, message, is_read, created_at, sender_id) 
                VALUES (?, ?, ?, ?, 0, NOW(), ?)";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                $user_id,
                $user_role,
                "Request Accepted",
                "Your contact request has been accepted.",
                $sender_id
            ]);

            return [
                "success" => true,
                "message" => "Notification inserted successfully."
            ];
        } catch (PDOException $e) {
            return [
                "success" => false,
                "message" => "Error inserting notification: " . $e->getMessage()
            ];
        }
    }

    // GetCountsProvider.php
    public function GetDashboardCounts1($provider_id)
    {
        try {
            // ------------------- Orders (group by status) -------------------
            $sqlOrders = "SELECT o.status, COUNT(DISTINCT o.order_id) as count
                      FROM `order` o
                      INNER JOIN `order_item` oi ON o.order_id = oi.order_id
                      INNER JOIN `product` p ON oi.product_id = p.product_id
                      WHERE p.provider_id = :provider_id
                      GROUP BY o.status";
            $stmt = $this->conn->prepare($sqlOrders);
            $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
            $stmt->execute();
            $orders = $stmt->fetchAll(PDO::FETCH_KEY_PAIR); // status => count

            // ------------------- Service Requests (group by status) -------------------
            $sqlRequests = "SELECT sr.status, COUNT(*) as count
                        FROM service_request sr
                        INNER JOIN service s ON sr.service_id = s.service_id
                        WHERE s.provider_id = :provider_id
                        GROUP BY sr.status";
            $stmt = $this->conn->prepare($sqlRequests);
            $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
            $stmt->execute();
            $requests = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

            // ------------------- Ongoing Projects (group by status) -------------------
            $sqlProjects = "SELECT op.status, COUNT(*) as count
                        FROM ongoing_project op
                        INNER JOIN service_request sr ON op.request_id = sr.request_id
                        INNER JOIN service s ON sr.service_id = s.service_id
                        WHERE s.provider_id = :provider_id
                        GROUP BY op.status";
            $stmt = $this->conn->prepare($sqlProjects);
            $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
            $stmt->execute();
            $projects = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

            // ------------------- Job Postings (group by status) -------------------
            $sqlJobs = "SELECT status, COUNT(*) as count
                    FROM job_posting
                    WHERE provider_id = :provider_id
                    GROUP BY status";
            $stmt = $this->conn->prepare($sqlJobs);
            $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
            $stmt->execute();
            $jobs = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

            // ------------------- Job Applications (group by status) -------------------
            $sqlJobApply = "SELECT ja.status, COUNT(*) as count
                        FROM jobapply ja
                        INNER JOIN job_posting jp ON ja.jobId = jp.job_id
                        WHERE jp.provider_id = :provider_id
                        GROUP BY ja.status";
            $stmt = $this->conn->prepare($sqlJobApply);
            $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
            $stmt->execute();
            $jobApply = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

            // ------------------- Return -------------------
            return [
                "success" => true,
                "data" => [
                    "orders"            => $orders,     // e.g. { "new": 3, "delivered": 5 }
                    "serviceRequests"   => $requests,   // e.g. { "pending": 2, "approved": 4 }
                    "projects"          => $projects,   // e.g. { "in_progress": 1, "completed": 3 }
                    "jobs"              => $jobs,       // e.g. { "active": 2, "expired": 1 }
                    "jobApplications"   => $jobApply    // e.g. { "new": 6, "reviewed": 3 }
                ]
            ];
        } catch (PDOException $e) {
            return [
                "success" => false,
                "message" => "Error fetching counts: " . $e->getMessage()
            ];
        }
    }

    public function GetDashboardCounts2($provider_id)
    {
        try {
            // ------------------- Orders (group by status) -------------------
            $sqlOrders = "SELECT o.status, COUNT(DISTINCT o.order_id) as count
                      FROM `order` o
                      INNER JOIN `order_item` oi ON o.order_id = oi.order_id
                      INNER JOIN `product` p ON oi.product_id = p.product_id
                      WHERE p.provider_id = :provider_id
                      GROUP BY o.status";
            $stmt = $this->conn->prepare($sqlOrders);
            $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
            $stmt->execute();
            $orders = $stmt->fetchAll(PDO::FETCH_KEY_PAIR); // status => count

            // ------------------- Service Requests (group by status) -------------------
            $sqlRequests = "SELECT sr.status, COUNT(*) as count
                        FROM service_request sr
                        INNER JOIN service s ON sr.service_id = s.service_id
                        WHERE s.provider_id = :provider_id
                        GROUP BY sr.status";
            $stmt = $this->conn->prepare($sqlRequests);
            $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
            $stmt->execute();
            $requests = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

            // ------------------- Ongoing Projects (group by status) -------------------
            $sqlProjects = "SELECT op.status, COUNT(*) as count
                        FROM ongoing_project op
                        INNER JOIN service_request sr ON op.request_id = sr.request_id
                        INNER JOIN service s ON sr.service_id = s.service_id
                        WHERE s.provider_id = :provider_id
                        GROUP BY op.status";
            $stmt = $this->conn->prepare($sqlProjects);
            $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
            $stmt->execute();
            $projects = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

            // ------------------- Job Postings (group by status) -------------------
            $sqlJobs = "SELECT status, COUNT(*) as count
                    FROM job_posting
                    WHERE provider_id = :provider_id
                    GROUP BY status";
            $stmt = $this->conn->prepare($sqlJobs);
            $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
            $stmt->execute();
            $jobs = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

            // ------------------- Job Applications (group by status) -------------------
            $sqlJobApply = "SELECT ja.status, COUNT(*) as count
                        FROM jobapply ja
                        INNER JOIN job_posting jp ON ja.jobId = jp.job_id
                        WHERE jp.provider_id = :provider_id
                        GROUP BY ja.status";
            $stmt = $this->conn->prepare($sqlJobApply);
            $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
            $stmt->execute();
            $jobApply = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

            // ------------------- Return -------------------
            return [
                "success" => true,
                "data" => [
                    "orders"            => $orders,     // e.g. { "new": 3, "delivered": 5 }
                    "serviceRequests"   => $requests,   // e.g. { "pending": 2, "approved": 4 }
                    "projects"          => $projects,   // e.g. { "in_progress": 1, "completed": 3 }
                    "jobs"              => $jobs,       // e.g. { "active": 2, "expired": 1 }
                    "jobApplications"   => $jobApply    // e.g. { "new": 6, "reviewed": 3 }
                ]
            ];
        } catch (PDOException $e) {
            return [
                "success" => false,
                "message" => "Error fetching counts: " . $e->getMessage()
            ];
        }
    }
    public function GetDashboardCounts($provider_id)
    {
        $status_SReq = "pending";
        $status_OnGoing = "new";
        $statusOrder = "pending";
        try {
            // ------------------- Orders -------------------
            $sqlOrders = "SELECT COUNT(DISTINCT o.order_id) as order_count
                      FROM `order` o
                      INNER JOIN `order_item` oi ON o.order_id = oi.order_id
                      INNER JOIN `product` p ON oi.product_id = p.product_id
                      WHERE p.provider_id = :provider_id AND status= :status";
            $stmt = $this->conn->prepare($sqlOrders);
            $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
            $stmt->bindParam(':status', $statusOrder, PDO::PARAM_STR);
            $stmt->execute();
            $orders = $stmt->fetch(PDO::FETCH_ASSOC);

            // ------------------- Service Requests -------------------
            $sqlRequests = "SELECT COUNT(*) as service_requests
                        FROM service_request sr
                        INNER JOIN service s ON sr.service_id = s.service_id
                        WHERE s.provider_id = :provider_id AND sr.status=:statusReq";
            $stmt = $this->conn->prepare($sqlRequests);
            $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
            $stmt->bindParam(':statusReq', $status_SReq, PDO::PARAM_STR);
            $stmt->execute();
            $requests = $stmt->fetch(PDO::FETCH_ASSOC);

            // ------------------- Ongoing Projects -------------------
            $sqlProjects = "SELECT COUNT(*) as projects
                        FROM ongoing_project op
                        INNER JOIN service_request sr ON op.request_id = sr.request_id
                        INNER JOIN service s ON sr.service_id = s.service_id
                        WHERE s.provider_id = :provider_id AND op.status=:statusOn";
            $stmt = $this->conn->prepare($sqlProjects);
            $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
            $stmt->bindParam(':statusOn', $status_OnGoing, PDO::PARAM_STR);
            $stmt->execute();
            $projects = $stmt->fetch(PDO::FETCH_ASSOC);

            // ------------------- Job Postings -------------------
            $sqlJobs = "SELECT COUNT(*) as jobs
                    FROM job_posting
                    WHERE provider_id = :provider_id";
            $stmt = $this->conn->prepare($sqlJobs);
            $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
            $stmt->execute();
            $jobs = $stmt->fetch(PDO::FETCH_ASSOC);

            // ------------------- Job Applications -------------------
            $sqlJobApply = "SELECT COUNT(*) as job_applications
                        FROM jobapply ja
                        INNER JOIN job_posting jp ON ja.jobId = jp.job_id
                        WHERE jp.provider_id = :provider_id";
            $stmt = $this->conn->prepare($sqlJobApply);
            $stmt->bindParam(':provider_id', $provider_id, PDO::PARAM_INT);
            $stmt->execute();
            $jobApply = $stmt->fetch(PDO::FETCH_ASSOC);

            // ------------------- Return -------------------
            return [
                "success" => true,
                "data" => [
                    "orderCount"          => (int)($orders["order_count"] ?? 0),
                    "serviceRequestCount" => (int)($requests["service_requests"] ?? 0),
                    "projectCount"        => (int)($projects["projects"] ?? 0),
                    "jobCount"            => (int)($jobs["jobs"] ?? 0),
                    "jobApplyCount"       => (int)($jobApply["job_applications"] ?? 0),
                ]
            ];
        } catch (PDOException $e) {
            return [
                "success" => false,
                "message" => "Error fetching counts: " . $e->getMessage()
            ];
        }
    }



    public function insertNotification($receiver_id, $sender_type, $title, $message, $sender_id)
    {
        try {
            $sql = "INSERT INTO notification 
                   (reciver_id, sender_user_type, title, message, is_read, created_at, sender_id) 
                VALUES 
                   (:receiver_id, :sender_type, :title, :message, 0, NOW(), :sender_id)";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":receiver_id", $receiver_id, PDO::PARAM_INT);
            $stmt->bindParam(":sender_type", $sender_type, PDO::PARAM_STR);
            $stmt->bindParam(":title", $title, PDO::PARAM_STR);
            $stmt->bindParam(":message", $message, PDO::PARAM_STR);
            $stmt->bindParam(":sender_id", $sender_id, PDO::PARAM_INT);

            $stmt->execute();

            return [
                "success" => true,
                "message" => "Notification inserted successfully."
            ];
        } catch (PDOException $e) {
            return [
                "success" => false,
                "message" => "Error inserting notification: " . $e->getMessage()
            ];
        }
    }

    public function markAllNotificationsRead($receiver_id)
{
    try {
        $sql = "UPDATE notification 
                SET is_read = 1 
                WHERE reciver_id = :receiver_id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":receiver_id", $receiver_id, PDO::PARAM_INT);
        $stmt->execute();

        return [
            "success" => true,
            "message" => "All notifications marked as read."
        ];
    } catch (PDOException $e) {
        return [
            "success" => false,
            "message" => "Error updating notifications: " . $e->getMessage()
        ];
    }
}
        public function deleteNotification($notification_id)
{
    try {
        $sql = "UPDATE notification 
                SET is_delete = 1 
                WHERE notification_id = :notification_id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":notification_id", $notification_id, PDO::PARAM_INT);
        $stmt->execute();

        return [
            "success" => true,
            "message" => "Notification deleted."
        ];
    } catch (PDOException $e) {
        return [
            "success" => false,
            "message" => "Error updating notification: " . $e->getMessage()
        ];
    }
}

}
