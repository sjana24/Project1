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

    public function getAllServicesProvider($provider_id)
    {

        try {
            $sql = "SELECT * FROM service WHERE  provider_id=:provider_id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':provider_id', $provider_id);
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




}
