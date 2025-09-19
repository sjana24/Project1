<?php

require_once 'dbCon.php';
class Service
{

    protected $service_id;
    protected $provider_id;
    protected $name;
    protected $description;
    protected $price;
    protected $category;
    protected $images;
    protected $conn;
    protected $request_id;
    protected $customer_id;
    protected $request_date;
    protected $status;
    protected $payment_status;
    protected $created_at;
    protected $updated_at;

    protected $fullName;
    protected $phone;
    // protected $email;
    // protected $province;
    // protected $city;
    // protected $address;
    // protected $zip;
    // protected $locationLink;

    protected $fullAddressInstallation;
    protected $fullAddressOld;
    protected $fullAddressNew;
    protected $fullAddressMaintainance;
    protected $roofSizeInstallation;
    protected $roofHeightInstallation;

    protected $roofHeight;
    protected $roofHeightNew;
    protected $roofHeightOld;
    protected $serviceType;
    protected $roofType;
    protected $roofSize;
    protected $capacity;
    protected $battery;
    protected $oldAddress;
    protected $newAddress;
    protected $problem;
    protected $preferredDate;
    // protected $preferredTime;

    // protected $name;
    // protected $description;
    // protected $price;
    protected $type;
    protected $visible;
    // protected $status;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }

    public function getAllServices()
    {

        try {
            $sql = "SELECT 
            s.*, 
            u.username AS provider_name,
            sp.company_name AS company_name,
            sp.profile_image AS company_image
            FROM 
            service s
            JOIN 
            service_provider sp ON s.provider_id = sp.provider_id
            JOIN 
            user u ON sp.user_id = u.user_id";

            $stmt = $this->conn->prepare($sql);

            $stmt->execute();
            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($services) {
                foreach ($services as &$service) {
                    $service_id = $service['service_id'];

                    // Fetch individual reviews
                    $reviewSql = "
        SELECT 
            r.review_id,
            r.customer_id,
            r.rating,
            r.comment,
            r.created_at,
            u.username AS reviewer_name
        FROM service_review r
        JOIN user u ON r.customer_id = u.user_id
        WHERE r.service_id = :service_id
        ORDER BY r.created_at DESC
    ";
                    $reviewStmt = $this->conn->prepare($reviewSql);
                    $reviewStmt->bindParam(':service_id', $service_id, PDO::PARAM_INT);
                    $reviewStmt->execute();
                    $reviews = $reviewStmt->fetchAll(PDO::FETCH_ASSOC);

                    // Fetch average rating
                    $avgRatingSql = "
        SELECT ROUND(AVG(rating), 1) AS average_rating
        FROM service_review
        WHERE service_id = :service_id
    ";
                    $avgStmt = $this->conn->prepare($avgRatingSql);
                    $avgStmt->bindParam(':service_id', $service_id, PDO::PARAM_INT);
                    $avgStmt->execute();
                    $avgRating = $avgStmt->fetch(PDO::FETCH_ASSOC);

                    // Attach to service array
                    $service['reviews'] = $reviews;
                    $service['average_rating'] = $avgRating['average_rating'] ?? null;
                }


                return [
                    'success' => true,
                    'services' => $services,
                    'message' => 'Services fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No services found.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all services. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch services. ' . $e->getMessage()
            ];
        }
    }
    public function getAllServicesAdmin()
    {

        try {
            $sql = "SELECT * FROM service ";
            $stmt = $this->conn->prepare($sql);

            $stmt->execute();
            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($services) {
                return [
                    'success' => true,
                    'services' => $services,
                    'message' => 'Services fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No products found.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "failed get all services. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch services. ' . $e->getMessage()
            ];
        }
    }

    // public function getAllServicesProvider($provider_id)
    // {

    //     try {
    //         $sql = "SELECT * FROM service WHERE  provider_id=:provider_id";
    //         $stmt = $this->conn->prepare($sql);
    //         $stmt->bindParam(':provider_id', $provider_id);
    //         $stmt->execute();
    //         $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //         if ($services) {
    //             return [
    //                 'success' => true,
    //                 'services' => $services,
    //                 'message' => 'Services fetched successfully.'
    //             ];
    //         } else {
    //             return [
    //                 'success' => false,
    //                 'message' => 'No services found.'
    //             ];
    //         }
    //     } catch (PDOException $e) {
    //         http_response_code(500);
    //         echo json_encode(["message" => "failed get all services. " . $e->getMessage()]);
    //         return [
    //             'success' => false,
    //             'message' => 'Failed to fetch services. ' . $e->getMessage()
    //         ];
    //     }
    // }
    public function getAllServicesProvider($provider_id)
{
    try {
        $sql = "SELECT * FROM service WHERE provider_id = :provider_id AND is_delete = 0";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':provider_id', $provider_id);
        $stmt->execute();
        $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($services) {
            // Now fetch reviews for each service
            foreach ($services as &$service) {
                $reviewSql = "SELECT review_id, customer_id, service_id, rating, comment, created_at, updated_at, is_approved 
                              FROM service_review 
                              WHERE service_id = :service_id";
                
                $reviewStmt = $this->conn->prepare($reviewSql);
                $reviewStmt->bindParam(':service_id', $service['service_id']);
                $reviewStmt->execute();
                $reviews = $reviewStmt->fetchAll(PDO::FETCH_ASSOC);

                // Attach reviews to the service
                $service['reviews'] = $reviews;
            }

            return [
                'success' => true,
                'services' => $services,
                'message' => 'Services and reviews fetched successfully.'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'No services found.'
            ];
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to get services. " . $e->getMessage()]);
        return [
            'success' => false,
            'message' => 'Failed to fetch services. ' . $e->getMessage()
        ];
    }
}


    public function isExistingServiceRequest($customer_id, $service_id, $service_type)
    {
        $sql = "SELECT COUNT(*) FROM service_request 
            WHERE customer_id = ? AND service_id = ? AND service_type = ? AND status = 'pending'";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$customer_id, $service_id, $service_type]);
        $count = $stmt->fetchColumn();

        return $count > 0;
    }


    public function insertServiceRequest($customer_id, $sanitizedData, $serviceDataFetch)
    {
        $this->fullName                = $sanitizedData['fullName'] ?? '';
        $this->phone                   = $sanitizedData['phone'] ?? '';
        // $this->email                = $sanitizedData['email'] ?? '';
        // $this->province             = $sanitizedData['province'] ?? '';
        // $this->city                 = $sanitizedData['city'] ?? '';
        // $this->address              = $sanitizedData['address'] ?? '';
        $this->fullAddressInstallation = $sanitizedData['fullAddressInstallation'] ?? '';
        $this->fullAddressOld          = $sanitizedData['fullAddressOldRelocation'] ?? '';
        $this->fullAddressNew          = $sanitizedData['fullAddressNewRelocation'] ?? '';
        $this->fullAddressMaintainance = $sanitizedData['fullAddressMaintainance'] ?? '';
        // $this->zip                 = $sanitizedData['zip'] ?? '';
        // $this->locationLink        = $sanitizedData['locationLink'] ?? '';
        $this->roofHeight              = $sanitizedData['roofHeightInstallation'] ?? '';
        $this->roofSizeInstallation                = $sanitizedData['roofSizeInstallation'] ?? '';

        $this->roofHeightInstallation                = $sanitizedData['roofHeightInstallation'] ?? '';
        $this->roofHeightOld           = $sanitizedData['fullHeightOldRelocation'] ?? '';
        $this->roofHeightNew           = $sanitizedData['fullHeightNewRelocation'] ?? '';

        $this->serviceType             = $sanitizedData['serviceType'] ?? '';
        $this->roofType                = $sanitizedData['roofType'] ?? '';
        $this->roofSize                = $sanitizedData['roofSize'] ?? '';
        $this->capacity                = $sanitizedData['capacity'] ?? '';
        $this->battery                 = $sanitizedData['battery'] ?? '';
        $this->oldAddress              = $sanitizedData['oldAddress'] ?? '';
        $this->newAddress              = $sanitizedData['newAddress'] ?? '';
        $this->problem                 = $sanitizedData['problem'] ?? '';
        $this->preferredDate           = $sanitizedData['preferredDate'] ?? '';
        // $this->preferredTime       = $sanitizedData['preferredTime'] ?? '';

        // $this->preferredTime = $sanitizedData['preferredTime'] ?? '';
        // Assuming $customer_id is the ID of the customer making the request
        // and $serviceDataFetch contains the service details


        $this->service_id = $serviceDataFetch['service_id'];
        $this->serviceType = $serviceDataFetch['category'] ?? '';
        $this->customer_id = $customer_id;



        // try {
        //     $sql = "INSERT INTO service_request ( customer_id, provider_id, service_id, request_date, status, payment_status, created_at, updated_at)
        //             VALUES ( ?, ?, NOW(), ?, 'pending', 'pending', NOW(), NOW())";
        //     $stmt = $this->conn->prepare($sql);
        //     $result = $stmt->execute([
        //         // $this->request_id,
        //         (int)$this->customer_id,
        //         (int)$this->provider_id,
        //        (int) $this->service_id,
        //         // $this->request_date,
        //         // $this->status,
        //         // $this->payment_status,
        //         // $this->created_at,
        //         // $this->updated_at
        //     ]);
        //         public function insertServiceRequest($customer_id, $provider_id, $service_id, $serviceType, $extraData)
        // {
        try {

            if ($this->isExistingServiceRequest($this->customer_id, $this->service_id, $this->serviceType)) {
                return [
                    "success" => false,
                    "message" => "Request already exists for this service."
                ];
            }
            // 1. Insert into service_request (common table)
            // echo "Inserting service request: ";
            // echo "$this->customer_id, $this->service_id, $this->serviceType";
            // echo "Inserting service request: end";
            else {
                $sql = "INSERT INTO service_request (
                    customer_id, service_id, request_date, status, payment_status, created_at, updated_at,service_type
                ) VALUES (?, ?, NOW(), 'pending', 'pending', NOW(), NOW(),?)";

                $stmt = $this->conn->prepare($sql);
                $stmt->execute([
                    (int)$this->customer_id,
                    // (int)$this->provider_id,
                    (int)$this->service_id,
                    $this->serviceType,
                ]);

                $request_id = $this->conn->lastInsertId(); // get the inserted request_id

                // 2. Based on serviceType, insert into the corresponding table
                switch (strtolower($this->serviceType)) {
                    case 'installation':
                        $installationSql = "INSERT INTO installation_request (
                                        request_id, installation_address, roof_height,roof_size
                                    ) VALUES (?, ?, ?,?)";
                        $stmt = $this->conn->prepare($installationSql);
                        $stmt->execute([
                            $request_id,
                            $this->fullAddressInstallation ?? '',
                            (int)$this->roofHeightInstallation ?? null,
                            (int)$this->roofSizeInstallation ?? null
                        ]);
                        break;

                    case 'maintenance':
                        $maintenanceSql = "INSERT INTO maintenance_request_details (
                                        request_id, device_condition, service_notes, last_maintenance_date, roof_height
                                    ) VALUES (?, ?, ?, ?, ?)";
                        $stmt = $this->conn->prepare($maintenanceSql);
                        $stmt->execute([
                            $request_id,
                            $extraData['device_condition'] ?? '',
                            $extraData['service_notes'] ?? '',
                            $extraData['last_maintenance_date'] ?? null,
                            $extraData['roofHeight'] ?? null
                        ]);
                        break;

                    case 'relocation':
                        $relocatedSql = "INSERT INTO relocated_request (
                                     request_id, current_address, new_address, current_roof_height, new_roof_height
                                 ) VALUES (?, ?, ?, ?, ?)";
                        $stmt = $this->conn->prepare($relocatedSql);
                        $stmt->execute([
                            $request_id,
                            $this->fullAddressOld ?? '',
                            $this->fullAddressNew ?? '',
                            (int)$this->roofHeightOld ?? null,
                            (int)$this->roofHeightNew ?? null
                        ]);
                        break;

                    default:
                        throw new Exception("Unsupported service type: $this->serviceType");
                }

                return [
                    "success" => true,
                    "message" => "Service request inserted successfully",
                    "request_id" => $request_id
                ];
            }
        } catch (PDOException $e) {
            return [
                "success" => false,
                "message" => "Database error: " . $e->getMessage()
            ];
        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => $e->getMessage()
            ];
        }
    }


    //     if ($result) {
    //         return true;
    //     }
    //     return false;
    // } catch (PDOException $e) {
    //     http_response_code(500);
    //     echo json_encode(["message" => "Failed to insert request. " . $e->getMessage()]);
    // }
    public function isExistingService($provider_id, $name, $type)
    {
        try {
            $sql = "SELECT COUNT(*) as count FROM service 
                WHERE provider_id = ? AND name = ? AND category = ?";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                (int)$provider_id,
                htmlspecialchars(strip_tags($name)),
                htmlspecialchars(strip_tags($type))
            ]);

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['count'] > 0;
        } catch (PDOException $e) {
            // You can log the error here if needed
            return false;
        }
    }


    public function insertService($provider_id, $name, $description, $price, $type, $status, $visible)
    {
        $this->name        = $name;
        $this->description = $description;
        $this->price       = $price;
        $this->type        = $type;
        $this->status      = $status;
        $this->visible      = 0;
        $this->provider_id = (int)$provider_id;

        $count = $this->isExistingService($this->provider_id, $this->name, $this->type);

        try {
            // Check for existing service before inserting
            if ($count > 0) {
                return [
                    "success" => false,
                    "message" => "Service already exists with the same name and category for this provider."
                ];
            }


            // Insert into `service` table
            $sql = "INSERT INTO service (
                    provider_id, name, description, price, category, is_approved,is_active, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                $this->provider_id,
                $this->name,
                $this->description,
                $this->price,
                $this->type,
                $this->status,
                $this->visible
            ]);

            $service_id = $this->conn->lastInsertId();

            return [
                "success" => true,
                "message" => "Service inserted successfully.",
                "service_id" => $service_id
            ];
        } catch (PDOException $e) {
            return [
                "success" => false,
                "message" => "Database error: " . $e->getMessage()
            ];
        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => $e->getMessage()
            ];
        }
    }
    public function updateService($service_id, $provider_id, $name, $description, $price, $type, $status, $visible)
    {
        $this->service_id   = $service_id;
        $this->provider_id  = (int)$provider_id;
        $this->name         = $name;
        $this->description  = $description;
        $this->price        = $price;
        $this->type         = $type;
        $this->status       = $status;
        $this->visible      = $visible;


        try {


            // Update the service
            $sqlUpdate = "UPDATE service SET
                        name = ?,
                        description = ?,
                        price = ?,
                        category = ?,
                        is_approved = ?,
                        is_Active=?,
                        updated_at = NOW()
                      WHERE service_id = ? AND provider_id = ?";

            $stmt = $this->conn->prepare($sqlUpdate);
            $stmt->execute([
                $this->name,
                $this->description,
                $this->price,
                $this->type,
                $this->status,
                $this->visible,
                $this->service_id,
                $this->provider_id
            ]);

            return [
                "success" => true,
                "message" => "Service updated successfully."
            ];
        } catch (PDOException $e) {
            return [
                "success" => false,
                "message" => "Database error: " . $e->getMessage()
            ];
        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => $e->getMessage()
            ];
        }
    }
    public function updateServiceStatus($service_id, $visible)
    {
        $this->service_id = (int)$service_id;
        $this->visible = (bool)$visible;

        try {
            $sql = "UPDATE service 
                SET is_active = :visible, updated_at = NOW() 
                WHERE service_id = :service_id";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':visible', $this->visible, PDO::PARAM_BOOL);
            $stmt->bindParam(':service_id', $this->service_id, PDO::PARAM_INT);

            if ($stmt->execute()) {
                return [
                    "success" => true,
                    "message" => "Service visibility status updated successfully."
                ];
            } else {
                return [
                    "success" => false,
                    "message" => "Failed to update service visibility status."
                ];
            }
        } catch (PDOException $e) {
            return [
                "success" => false,
                "message" => "Error updating service visibility: " . $e->getMessage()
            ];
        }
    }

    public function deleteServiceProvider($service_id, $provider_id)
    {
        $this->service_id = (int)$service_id;
        $this->provider_id= (int)$provider_id;
        $is_delete=1;

        try {
            $sql = "UPDATE service 
                SET is_delete = :is_delete, updated_at = NOW() 
                WHERE service_id = :service_id AND provider_id = :provider_id";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':is_delete', $is_delete, PDO::PARAM_BOOL);
            $stmt->bindParam(':service_id', $this->service_id, PDO::PARAM_INT);
            $stmt->bindParam(':provider_id', $this->provider_id, PDO::PARAM_INT);

            if ($stmt->execute()) {
                return [
                    "success" => true,
                    "message" => "Service visibility status updated successfully."
                ];
            } else {
                return [
                    "success" => false,
                    "message" => "Failed to update service visibility status."
                ];
            }
        } catch (PDOException $e) {
            return [
                "success" => false,
                "message" => "Error updating service visibility: " . $e->getMessage()
            ];
        }
    }
    // public function deleteService($service_id, $provider_id)
    // {
    //     $this->service_id = (int)$service_id;
    //     $this->provider_id = (int)$provider_id;

    //     try {
    //         $sql = "DELETE FROM service WHERE service_id = :service_id AND provider_id = :provider_id";
    //         $stmt = $this->conn->prepare($sql);
    //         $stmt->bindParam(':service_id', $this->service_id, PDO::PARAM_INT);
    //         $stmt->bindParam(':provider_id', $this->provider_id, PDO::PARAM_INT);

    //         if ($stmt->execute()) {
    //             return [
    //                 "success" => true,
    //                 "message" => "Service deleted successfully."
    //             ];
    //         } else {
    //             return [
    //                 "success" => false,
    //                 "message" => "Failed to delete service."
    //             ];
    //         }
    //     } catch (PDOException $e) {
    //         return [
    //             "success" => false,
    //             "message" => "Error deleting service: " . $e->getMessage()
    //         ];
    //     }
    // }

    public function getAllServiceRequestsByProvider1($provider_id)
    {
        try {
            // $sql = "SELECT * FROM service_request WHERE provider_id = :provider_id";
    //         $sql="SELECT 
    // sr.*,
    // -- c.name AS customer_name,
    // -- c.email AS customer_email,
    // -- c.phone AS customer_phone,
    // -- s.name AS service_name,
    // -- s.type AS service_type,

    // -- Installation fields
    // ir.*,
    // -- ir.installation_date,
    // -- ir.device_type,
    // -- ir.location AS installation_location,

    // -- Maintenance fields
    // mr.*,
    // -- mr.maintenance_date,
    // -- mr.issue_description,
    // -- mr.location AS maintenance_location,

    // -- Relocation fields
    // -- rr.relocation_date,
    // -- rr.old_address,
    // -- rr.new_address
    // rr.*

// FROM service_request sr
// JOIN service s ON sr.service_id = s.service_id
// JOIN customer c ON sr.customer_id = c.customer_id

// LEFT JOIN installation_request ir ON sr.request_id = ir.request_id
// LEFT JOIN maintenance_request_details mr ON sr.request_id = mr.request_id
// LEFT JOIN relocated_request rr ON sr.request_id = rr.request_id

// WHERE s.provider_id = :provider_id AND sr.status =:status

// ";

$sql="SELECT 
    sr.*,
    c.name AS customer_name,
    s.name AS service_name,
    s.type AS service_type,

    CASE 
        WHEN sr.service_type = 'installation' 
            THEN JSON_OBJECT('installation_date', ir.installation_date, 'device_type', ir.device_type, 'location', ir.location)
        WHEN sr.service_type = 'maintenance' 
            THEN JSON_OBJECT('maintenance_date', mr.maintenance_date, 'issue_description', mr.issue_description, 'location', mr.location)
        WHEN sr.service_type = 'relocation' 
            THEN JSON_OBJECT('relocation_date', rr.relocation_date, 'old_address', rr.old_address, 'new_address', rr.new_address)
    END AS details

FROM service_requests sr
LEFT JOIN customers c ON sr.customer_id = c.id
LEFT JOIN services s ON sr.service_id = s.id
LEFT JOIN installation_requests ir ON sr.request_id = ir.request_id
LEFT JOIN maintenance_requests mr ON sr.request_id = mr.request_id
LEFT JOIN relocation_requests rr ON sr.request_id = rr.request_id;
";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':provider_id', $provider_id);
            $stmt->bindParam(':status', 'pending');
            $stmt->execute();
            $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($requests) {
                return [
                    'success' => true,
                    'requests' => $requests,
                    'message' => 'Service requests fetched successfully.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No service requests found for this provider.'
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to fetch service requests. " . $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Failed to fetch service requests. ' . $e->getMessage()
            ];
        }
    }

// function getServiceRequestsByProvider($providerId) {
//     $sql = "
//         SELECT 
//             sr.request_id,
//             sr.customer_id,
//             sr.service_id,
//             sr.status,
//             sr.payment_status,
//             sr.request_date,

//             c.name  AS customer_name,
//             c.email AS customer_email,
//             c.phone AS customer_phone,

//             s.name  AS service_name,
//             s.type  AS service_type,
//             s.category AS service_category,
//             s.price    AS service_price,

//             ir.installation_date,
//             ir.device_type,
//             ir.location AS installation_location,
//             ir.roof_height AS installation_roof_height,

//             mr.maintenance_date,
//             mr.issue_description,
//             mr.location AS maintenance_location,

//             rr.relocation_date,
//             rr.old_address,
//             rr.new_address,
//             rr.current_roof_height,
//             rr.new_roof_height

//         FROM service_request sr
//         JOIN customer c ON sr.customer_id = c.id
//         JOIN service s  ON sr.service_id = s.id

//         LEFT JOIN installation_request ir 
//                ON sr.request_id = ir.request_id AND s.type = 'installation'
//         LEFT JOIN maintenance_request_details mr 
//                ON sr.request_id = mr.request_id AND s.type = 'maintenance'
//         LEFT JOIN relocated_request rr 
//                ON sr.request_id = rr.request_id AND s.type = 'relocation'

//         WHERE s.provider_id = :provider_id
//     ";

//     $stmt = $this->conn->prepare($sql);
//     $stmt->execute(['provider_id' => $providerId]);
//     $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

//     $requests = [];
//     foreach ($rows as $row) {
//         $details = [];

//         if ($row['service_type'] === 'installation') {
//             $details = [
//                 "installation_date" => $row['installation_date'],
//                 "device_type"       => $row['device_type'],
//                 "location"          => $row['installation_location'],
//                 "roof_height"       => $row['installation_roof_height']
//             ];
//         } elseif ($row['service_type'] === 'maintenance') {
//             $details = [
//                 "maintenance_date"  => $row['maintenance_date'],
//                 "issue_description" => $row['issue_description'],
//                 "location"          => $row['maintenance_location']
//             ];
//         } elseif ($row['service_type'] === 'relocation') {
//             $details = [
//                 "relocation_date"    => $row['relocation_date'],
//                 "old_address"        => $row['old_address'],
//                 "new_address"        => $row['new_address'],
//                 "current_roof_height"=> $row['current_roof_height'],
//                 "new_roof_height"    => $row['new_roof_height']
//             ];
//         }

//         $requests[] = [
//             "request_id"      => $row['request_id'],
//             "customer_id"     => $row['customer_id'],
//             "service_id"      => $row['service_id'],
//             "status"          => $row['status'],
//             "payment_status"  => $row['payment_status'],
//             "request_date"    => $row['request_date'],
//             "customer_name"   => $row['customer_name'],
//             "customer_email"  => $row['customer_email'],
//             "customer_phone"  => $row['customer_phone'],
//             "service_name"    => $row['service_name'],
//             "service_type"    => $row['service_type'],
//             "service_category"=> $row['service_category'],
//             "service_price"   => $row['service_price'],
//             "details"         => $details
//         ];
//     }

//     return [
//         "success"  => true,
//         "requests" => $requests,
//         "message"  => "Service requests fetched successfully for provider."
//     ];
// }



    public function getServiceRequestsByProvider($provider_id)
{
    try {
        $finalResults = [];
        $status = 'pending'; // You can change this to any status you want to filter by
        // Step 1: Get all service requests for the given provider with related user, customer, and service info
        $sql = "SELECT 
                    sr.*,
                    u.username AS customer_name,
                    u.email AS customer_email,
                    c.contact_number AS customer_phone,
                    s.name AS service_name,
                    s.description AS service_description,
                    s.price AS service_price,
                    s.category AS service_category
                    -- s.type AS service_type
                FROM service_request sr
                JOIN customer c ON sr.customer_id = c.customer_id
                JOIN user u ON c.user_id = u.user_id
                JOIN service s ON sr.service_id = s.service_id
                WHERE s.provider_id = :provider_id  AND sr.status =:status";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':provider_id', $provider_id);
        $stmt->bindParam(':status', $status);
        $stmt->execute();
        $serviceRequests = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Step 2: Get detailed info from the appropriate table for each service_type
        foreach ($serviceRequests as $request) {
            $requestId = $request['request_id'];
            // $type = strtolower($request['service_type']);
              $type = strtolower($request['service_category']);

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

            $finalResults[] = array_merge($request, ['details' => $extraDetails]);
        }

        return [
            'success' => true,
            'requests' => $finalResults,
            'message' => 'Service requests fetched successfully for provider.'
        ];

    } catch (PDOException $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'Error fetching service requests: ' . $e->getMessage()
        ];
    }
}
public function updateRequestStatus($request_id, $provider_id, $new_status)
{
    $this->request_id = (int)$request_id;
    $this->provider_id = (int)$provider_id;
    $this->status = $new_status;

    try {
        // 1. Update request status
        $sql = "UPDATE service_request sr
                JOIN service s ON sr.service_id = s.service_id
                SET sr.status = :status, sr.updated_at = NOW()
                WHERE sr.request_id = :request_id 
                  AND s.provider_id = :provider_id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':status', $this->status, PDO::PARAM_STR);
        $stmt->bindParam(':request_id', $this->request_id, PDO::PARAM_INT);
        $stmt->bindParam(':provider_id', $this->provider_id, PDO::PARAM_INT);

        if ($stmt->execute()) {

            // 2. If status is accepted, insert into ongoing_project
            if (strtolower($this->status) === "accepted") {

                // Fetch customer name + service name
                $query = "SELECT u.username AS customer_name, s.name AS service_name
                          FROM service_request sr
                          JOIN customer c ON sr.customer_id = c.customer_id
                          JOIN user u ON c.user_id = u.user_id
                          JOIN service s ON sr.service_id = s.service_id
                          WHERE sr.request_id = :request_id
                            AND s.provider_id = :provider_id
                          LIMIT 1";
                $stmt2 = $this->conn->prepare($query);
                $stmt2->bindParam(':request_id', $this->request_id, PDO::PARAM_INT);
                $stmt2->bindParam(':provider_id', $this->provider_id, PDO::PARAM_INT);
                $stmt2->execute();
                $row = $stmt2->fetch(PDO::FETCH_ASSOC);

                if ($row) {
                    $project_name = $row['customer_name'] . " - " . $row['service_name'];

                    $insert = "INSERT INTO ongoing_project 
                               (request_id, project_name, status, start_date, due_date, completed_date, payment_id, created_at, updated_at) 
                               VALUES (:request_id, :project_name, 'new', NULL, NULL, NULL, NULL, NOW(), NOW())";

                    $stmt3 = $this->conn->prepare($insert);
                    $stmt3->bindParam(':request_id', $this->request_id, PDO::PARAM_INT);
                    $stmt3->bindParam(':project_name', $project_name, PDO::PARAM_STR);
                    $stmt3->execute();
                }
            }

            return [
                "success" => true,
                "message" => "Service request status updated successfully."
            ];
        } else {
            return [
                "success" => false,
                "message" => "Failed to update service request status."
            ];
        }
    } catch (PDOException $e) {
        return [
            "success" => false,
            "message" => "Error updating service request: " . $e->getMessage()
        ];
    }
}


  public function updateRequestStatus1($request_id,$provider_id, $new_status)
    {
        $this->request_id= (int)$request_id;
        $this->provider_id= (int)$provider_id;
        $this->status= $new_status;
        // $is_delete=1;

        try {
           $sql = "UPDATE service_request sr
        JOIN service s ON sr.service_id = s.service_id
        SET sr.status = :status, sr.updated_at = NOW()
        WHERE sr.request_id = :request_id 
          AND s.provider_id = :provider_id";


            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':status', $this->status, PDO::PARAM_STR);
            $stmt->bindParam(':request_id', $this->request_id, PDO::PARAM_INT);
            $stmt->bindParam(':provider_id', $this->provider_id, PDO::PARAM_INT);

            if ($stmt->execute()) {
                
                return [
                    "success" => true,
                    "message" => "Service request status updated successfully."
                ];
            } else {
                return [
                    "success" => false,
                    "message" => "Failed to update service request status."
                ];
            }
        } catch (PDOException $e) {
            return [
                "success" => false,
                "message" => "Error updating service request: " . $e->getMessage()
            ];
        }
    }

    public function getOngoingProjectsByCustomer($customer_id)
{
    try {
        $sql = "
            SELECT 
                op.project_id,
                op.project_name,
                op.status AS project_status,
                op.start_date,
                op.due_date,
                op.completed_date,
                op.payment_id,
                sr.request_id,
                sr.request_date,
                sr.payment_status,
                s.service_id,
                s.name AS service_name,
                s.description AS service_description,
                s.price,
                s.category AS service_category,
                sp.provider_id,
                sp.company_name AS provider_name,
                sp.verification_status
            FROM ongoing_project op
            INNER JOIN service_request sr ON op.request_id = sr.request_id
            INNER JOIN service s ON sr.service_id = s.service_id
            INNER JOIN service_provider sp ON s.provider_id = sp.provider_id
            WHERE sr.customer_id = :customer_id
            ORDER BY op.start_date DESC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
        $stmt->execute();

        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($projects) {
            return [
                'success' => true,
                'projects' => $projects,
                'message' => 'Ongoing projects fetched successfully.'
            ];
        } else {
            return [
                'success' => false,
                'projects' => [],
                'message' => 'No ongoing projects found for this customer.'
            ];
        }
    } catch (PDOException $e) {
        return [
            'success' => false,
            'message' => 'Database error: ' . $e->getMessage()
        ];
    }
}





}
