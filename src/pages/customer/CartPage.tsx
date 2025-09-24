import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import CartModal from "@/components/ui/cartModel";
import axios from "axios";
import { create } from 'zustand'
import { useCartStore } from "@/store/useCartStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { add } from "date-fns";

export interface item {
    item_id: number,
    images: string;
    name: string;
    price: number;
    productId: number;
    providerId: number;
    quantity: number;
    total_price: number;
    userId: number;
    unit_price: number;
}

const CartPage = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cartItems, setCartItems] = useState<item[]>([]);
    const { setCartItemsCount, updateCartCount, cartUpdated } = useCartStore();
    const [address, setAddress] = useState(
       "address"
    );


    // const item1s: item[] = [
    //     {
    //         image: "one.jpeg",
    //         name: "Sample Product",
    //         price: 12345,
    //         productId: 1,
    //         providerId: 1,
    //         quantity: 1,
    //         userId: 1,
    //         total_price:1,
    //         unit_price:2,
    //     },
    // {
    //     image: "one.jpeg",
    //     name: "Sample Product",
    //     price: 12345,
    //     productId: 2,
    //     providerId: 2,
    //     quantity: 2,
    //     userId: 2,
    // },
    // {
    //     image: "one.jpeg",
    //     name: "Sample Product",
    //     price: 12345,
    //     productId: 3,
    //     providerId: 3,
    //     quantity: 3,
    //     userId: 3,
    // },
    // ];
    const provinces = [
        { value: "Central", label: "Central Province" },
        { value: "Eastern", label: "Eastern Province" },
        { value: "North Central", label: "North Central Province" },
        { value: "Northern", label: "Northern Province" },
        { value: "North Western", label: "North Western Province" },
        { value: "Sabaragamuwa", label: "Sabaragamuwa Province" },
        { value: "Southern", label: "Southern Province" },
        { value: "Uva", label: "Uva Province" },
        { value: "Western", label: "Western Province" },
    ];
    const citiesByProvince: Record<string, string[]> = {
        Western: ["Colombo", "Gampaha", "Kalutara"],
        Central: ["Kandy", "Matale", "Nuwara Eliya"],
        Southern: ["Galle", "Matara", "Hambantota"],
        Eastern: ["Trincomalee", "Batticaloa", "Ampara"],
        Northern: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
        NorthCentral: ["Anuradhapura", "Polonnaruwa"],
        NorthWestern: ["Kurunegala", "Puttalam"],
        Uva: ["Badulla", "Monaragala"],
        Sabaragamuwa: ["Ratnapura", "Kegalle"]
    };
    useEffect(() => {
        //   const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "null");
        setCartItems([]);

        //   if (!currentUser) return; // Safeguard in case there's no user

        axios
            .get("http://localhost/Git/Project1/Backend/ShowCardItems.php", {
                withCredentials: true
            })
            .then((response) => {
                const data = response.data;
                if (data.success) {
                    console.log("Data received:", data);
                    setCartItemsCount(data.items);
                    updateCartCount();
                    setCartItems(data.items);
                } else {
                    console.log("Failed to load items:", data);
                }
            })
            .catch((err) => {
                console.error("Error fetching cart items:", err);
            });
    }, [cartUpdated]); // Add currentUser as dependency if it can change

    const [formData, setFormData] = useState<any>({
        province: "",
        city: "",
        street: "",


    });



    const [errors, setErrors] = useState<any>({});


    const handleQuantityChange =async (
        productId: number,
        newQuantity: number,
        // userId: number
    ) => {
          const responce= await axios.post("http://localhost/Git/Project1/Backend/updateAddTocartCount.php",{product_id:productId,quantity:newQuantity}, {
                withCredentials: true
            });
        if (newQuantity < 1) {
            console.log("removed");
            toast({
                title: "Item removed",
                description: "Item has been removed from your cart.",
            });
        } else {
            console.log("updated",newQuantity,"----",productId,"for---",);
          
            

        }
        
    };

    const handleItemSelect = (item_id: number, checked: boolean) => {
        if (checked) {
            setSelectedItems((prev) => [...prev, item_id]);
        } else {
            setSelectedItems((prev) => prev.filter((id) => id !== item_id));
            setSelectAll(false);
        }
    };

    const selectedCartItems = cartItems.filter((item) =>
        selectedItems.includes(item.item_id)
    );

    const subtotal = selectedCartItems.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0
    );
    const handleChange = (key: string, value: string) => {
        console.log(` key: ${key}, value: ${value} `);
        setFormData(prev => ({ ...prev, [key]: value }));
        setErrors(prev => ({ ...prev, [key]: "" }));
    };
    const handleClick = () => {
        console.log("hi this is me");
        console.log("Selected items:", selectedCartItems);
        console.log("Form data:", formData);
        const addressData = `${formData.street}, ${formData.province}, ${formData.city}`;
        console.log("Address data:", addressData);
        // setAddress({address:addressData});
         setAddress(addressData);
        //   setSelectedProduct(product);
        setIsModalOpen(true);
        // navigate("/emo");
    }
    const closeModal = () => {
        setIsModalOpen(false);
        // setSelectedProduct(null);
    };

    return (
        <div className="min-h-screen">
            <Navigation />
            {cartItems.length !== 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 py-8">
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setSelectAll(checked);
                                    setSelectedItems(checked ? cartItems.map((i) => i.item_id) : []);
                                }}
                                className="mr-2"
                            />
                            <span className="text-sm font-medium">Select All</span>
                        </div>

                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {cartItems.map((item) => (
                                <div
                                    key={item.item_id}
                                    className="flex items-center p-6 border-b border-gray-200 last:border-b-0"
                                >
                                    <input
                                        type="checkbox"
                                        className="mr-4"
                                        checked={selectedItems.includes(item.item_id)}
                                        onChange={(e) =>
                                            handleItemSelect(item.item_id, e.target.checked)
                                        }
                                    />

                                    <img
                                        // src={item.image}
                                        src={`http://localhost/Git/Project1/Backend/${item.images}`}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />

                                    <div className="flex-1 ml-6">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {item.name}
                                        </h3>
                                        <p className="text-[#26B170] font-semibold mt-1">
                                            Rs {item.unit_price}
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.item_id,
                                                        item.quantity - 1,
                                                        // currentUser?.id
                                                    )
                                                }
                                                className="p-2 hover:bg-gray-100 transition-colors"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="px-4 py-2 font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.item_id,
                                                        item.quantity + 1,
                                                        // currentUser?.id
                                                    )
                                                }
                                                className="p-2 hover:bg-gray-100 transition-colors"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <button className="p-2 text-[#26B170] hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="ml-4 text-right">
                                        <p className="text-lg font-semibold text-gray-900">
                                            Rs {(item.unit_price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-between">
                            <Link
                                to="/products"
                                className="text-[#26B170] hover:text-blue-800 font-medium"
                            >
                                ← Continue Shopping
                            </Link>
                            <button
                                onClick={() => {
                                    toast({
                                        title: "Cart cleared",
                                        description: "All items have been removed from your cart.",
                                    });
                                }}
                                className="text-[#26B170] hover:text-[#26B170] font-medium"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                    {/* Address Box */}
                    {/* <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Address</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Province"
                                value={address.province}
                                onChange={(e) => setAddress({ ...address, province: e.target.value })}
                                className="w-full border rounded-md px-4 py-2 text-sm"
                            />
                            <input
                                type="text"
                                placeholder="District"
                                value={address.district}
                                onChange={(e) => setAddress({ ...address, district: e.target.value })}
                                className="w-full border rounded-md px-4 py-2 text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Street"
                                value={address.street}
                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                className="w-full border rounded-md px-4 py-2 text-sm"
                            />
                        </div>
                    </div> */}

                    {/* Order Summary */}
                    <div className="lg:col-span-1 p-4 ">
                        <div className="bg-white rounded-lg shadow-md p-4 ">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Address</h2>
                            <div className="space-y-4">
                                  <input
                                    type="text"
                                    placeholder="Street"
                                    value={formData.street}
                                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                    className="w-full border rounded-md px-4 py-2 text-sm"
                                />
                                <div className="flex gap-2">
                                    
                                    <div className="flex-1">
                                        <label className="block mb-1 text-sm font-medium">Province *</label>
                                        <Select value={formData.province} onValueChange={v => {
                                            handleChange("province", v);
                                            handleChange("city", "");
                                        }}>
                                            <SelectTrigger><SelectValue placeholder="Select Province" /></SelectTrigger>
                                            <SelectContent>
                                                {provinces.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        {errors.installationProvince && <p className="text-red-500 text-sm mt-1">{errors.installationProvince}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block mb-1 text-sm font-medium">City *</label>
                                        <Select value={formData.city} onValueChange={v => handleChange("city", v)}>
                                            <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                                            <SelectContent>
                                                {(citiesByProvince[formData.province?.replace(/\s/g, "")] || []).map(c => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.installationCity && <p className="text-red-500 text-sm mt-1">{errors.installationCity}</p>}
                                    </div>
                                </div>
                                {/* <input
                                    type="text"
                                    placeholder="Province"
                                    value={address.province}
                                    onChange={(e) => setAddress({ ...address, province: e.target.value })}
                                    className="w-full border rounded-md px-4 py-2 text-sm"
                                /> */}
                                {/* <input
                                    type="text"
                                    placeholder="District"
                                    value={address.district}
                                    onChange={(e) => setAddress({ ...address, district: e.target.value })}
                                    className="w-full border rounded-md px-4 py-2 text-sm"
                                /> */}
                              
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 m-5">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>Rs {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Rs 0</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span>Rs {subtotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>



                            {/* Proceed Button */}
                            <button
                                disabled={
                                    selectedItems.length === 0 ||
                                    !formData.province.trim() ||
                                    !formData.city.trim()|| 
                                    !formData.street.trim()
                                }
                                onClick={handleClick}
                                className={`w-full py-3 rounded-lg mt-4 font-semibold transition-colors 
                                    ${
                                    selectedItems.length === 0 ||
                                    !formData.province.trim() ||
                                    !formData.city.trim() ||
                                    !formData.street.trim()
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-[#26B170] text-white hover:bg-[#26B170]"
                                    }`}
                            >
                                Proceed to Checkout
                            </button>

                            
                        </div>
                    </div>


                </div >
            ) : (
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Start shopping to add items to your cart
                        </p>
                        <Link
                            to="/products"
                            className="bg-[#26B170] text-white px-6 py-3 rounded-lg hover:bg-[#26B170]"
                        >
                            Continue Shopping
                        </Link>

                    </div>
                </div>
            )}
            {/* Product Modal */}
            {/* {isModalOpen && ( */}
            {/* // <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"> */}
            {/* <div className="bg-white rounded-xl shadow-lg p-6 w-[700px] h-[450px] relative overflow-hidden"> */}

            {/* Close button */}
            {/* <button
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                            onClick={closeModal}
                        >
                            <span className="text-sm">Cancel</span>
                        </button> */}






            {/* </div> */}
            {/* </div> */}

            {/* ) */}
            {/* } */}
            <CartModal
                isOpen={isModalOpen}
                onClose={closeModal}
                selectedItems={selectedCartItems}
                formData={address}
            />
        </div >
    );
};

export default CartPage;
