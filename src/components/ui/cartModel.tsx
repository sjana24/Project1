import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { CreditCard, Wallet, X } from "lucide-react";

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedItems: item[];
}

export interface item {
    image: string;
    name: string;
    price: number;
    productId: number;
    providerId: number;
    quantity: number;
    userId: number;
}

const CartModal = ({ isOpen, onClose, selectedItems }: CartModalProps) => {
    const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | null>(null);

    const subtotal = selectedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
    const deliveryFee = 310;
    const total = subtotal + deliveryFee;


    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">

                <div className="fixed inset-0 bg-black opacity-30" />


                {/* Close Button */}
                <div className="relative bg-white rounded-lg w-full max-w-5xl shadow-lg z-10 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">


                    <div className="absolute top-3 right-3">
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-800 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Left: Item Details */}
                    <div className="lg:col-span-2 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
                        {selectedItems.map((item) => (
                            <div key={item.productId} className="flex items-center gap-4 border-b pb-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg border"
                                />
                                <div className="flex-1">
                                    <h3 className="text-md font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        Rs {(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">Choose Payment Method</h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setPaymentMethod("cod")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded border ${paymentMethod === "cod" ? "border-blue-500 bg-blue-100" : "border-gray-300"
                                        }`}
                                >
                                    <Wallet className="w-4 h-4" />
                                    Cash on Delivery
                                </button>
                                <button
                                    onClick={() => setPaymentMethod("card")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded border ${paymentMethod === "card" ? "border-blue-500 bg-blue-100" : "border-gray-300"
                                        }`}
                                >
                                    <CreditCard className="w-4 h-4" />
                                    Card Payment
                                </button>
                            </div>

                            {paymentMethod === "card" && (
                                <div className="mt-4 space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Card Number"
                                        className="w-full border px-4 py-2 rounded"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Expiry (MM/YY)"
                                            className="w-1/2 border px-4 py-2 rounded"
                                        />
                                        <input
                                            type="text"
                                            placeholder="CVV"
                                            className="w-1/2 border px-4 py-2 rounded"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="bg-gray-50 rounded-lg p-5 h-fit sticky top-1">
                        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>Rs {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span>Rs {deliveryFee.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-semibold text-base">
                                <span>Total</span>
                                <span>Rs {total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => alert("Payment confirmed")}
                            className="w-full mt-6 bg-[#26B170] text-white font-semibold py-2 px-4 rounded"
                            disabled={!paymentMethod}
                        >
                            Confirm & Pay
                        </button>



                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default CartModal;
