import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useState } from "react";

export interface item {
    image: string;
    name: string;
    price: 12345
    productId: number;
    providerId: number;
    quantity: number;
    userId: number
}
const CartPage = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);


    const items: item[] = [
        {
            image: " j",
            name: "jana",
            price: 12345,
            productId: 1,
            providerId: 1,
            quantity: 1,
            userId: 1
        }

    ];
    const handleQuantityChange = (productId: number, newQuantity: number, userId: number) => {

        if (newQuantity < 1) {
            console.log("removed");
            toast({
                title: "Item removed",
                description: "Item has been removed from your cart.",
            });
        }
        else {
            console.log("updated");
        }
    }

    return (
        <div className="min-h-screen">
            <Navigation />
            {(items.length !== 0) ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setSelectAll(checked);
                                setSelectedItems(checked ? items.map((item) => item.productId) : []);
                            }}
                            className="mr-2"
                        />
                        <span className="text-sm font-medium">Select All</span>
                    </div>
                    {/* Cart Items */}
                    {/* <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {items
                                // .filter(item => item.userId === currentUser.customerid)
                                .map((item) => (

                                    <div key={item.productId} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />

                                        <div className="flex-1 ml-6">
                                            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                            <p className="text-blue-600 font-semibold mt-1">Rs{item.price}</p>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center border border-gray-300 rounded-lg">
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1, currentUser.id)}
                                                    className="p-2 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1, currentUser.id)}
                                                    className="p-2 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <button

                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="ml-4 text-right">
                                            <p className="text-lg font-semibold text-gray-900">
                                                Rs{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className="mt-6 flex justify-between">
                            <Link
                                to="/products"
                                className="text-blue-600 hover:text-blue-800 font-medium"
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
                                className="text-red-600 hover:text-red-800 font-medium"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div> */}

                    {/* Order Summary */}
                    {/* <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3">
                                <div className="flex justify-between">

                                    <span>Subtotal </span>
                                    <span>Rs</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Rs</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span>Rs</span>
                                    </div>
                                </div>
                            </div>

                            <button

                                // className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mt-6 font-semibold"
                                className="w-full solar-gradient text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mt-6 font-semibold"
                            >
                                Proceed to Checkout
                            </button>

                            {1 && (
                                <p className="text-sm text-gray-600 text-center mt-4">
                                    Please <Link to="/login" className="text-blue-600 hover:underline">login</Link> to continue
                                </p>
                            )}
                        </div>
                    </div> */}
                </div>
            )
                : (<div className="container mx-auto px-4 py-16">

                    <div className="text-center">
                        <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
                        <Link
                            to="/products"
                            //  className="solar-gradient bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            className="solar-gradient  text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>)}
        </div>

    );
};
export default CartPage;