<?php
require_once "dbConn.php";

class Product{
    protected $product_id;
    protected $provider_id;
    protected $name;
    protected $description;
    protected $price;
    protected $category;
    protected $images;
    protected $specification;
    protected $is_approved;
    protected $conn;

    public function __construct(){
        
        
    }
}