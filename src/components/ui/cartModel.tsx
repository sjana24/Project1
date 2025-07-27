import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { CreditCard, Wallet, X } from "lucide-react";

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedItems: item[];
    formData: string;
}
export interface address {
    province: string;
    city: string;
    street: string;
}

export interface item {
    images: string;
    name: string;
    price: number;
    productId: number;
    providerId: number;
    quantity: number;
    userId: number;
    unit_price: number;
}

const CartModal = ({ isOpen, onClose, selectedItems, formData }: CartModalProps) => {
    const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | null>(null);
    const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
});

    const subtotal = selectedItems.reduce(
        (total, item) => total + item.unit_price * item.quantity,
        0
    );
    const deliveryFee = 310;
    const total = subtotal + deliveryFee;

    const confirmPayment = () => {
        if (!paymentMethod) {
            console.log("hi");
        }
        else {
            console.log(" doi");
        }

    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardData((prev) => ({
            ...prev,
            [name]: value,
        }));
         setErrors(prev => ({ ...prev, [name]: "" }));
    };
    
      const [errors, setErrors] = useState<any>({});
    const validate = () => {
    const newErrors: any = {};

    // Common required fields
    if (!cardData.cardNumber) newErrors.cardNumber = "Card Number is required.";
    if (!cardData.expiry) newErrors.expiry = "Expiry date is required.";
    if (!cardData.cvv) newErrors.cvv = "CVV is required.";
    return newErrors;
    }


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
                                    src={`http://localhost/Git/Project1/Backend/${item.images}`}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg border"
                                />
                                <div className="flex-1">
                                    <h3 className="text-md font-semibold">{item.unit_price}</h3>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        Rs {(item.unit_price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center gap-4 border-b pb-4">
                            <p><b>Address : </b>
                                <span className="font-semibold">
                                    {formData}
                                </span>
                            </p>

                        </div>
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
                                        name="cardNumber"
                                        value={cardData.cardNumber}
                                        onChange={handleChange}
                                        placeholder="Card Number"
                                        className="w-full border px-4 py-2 rounded mb-2"
                                        required
                                    />
                                    {errors.CardNumber && <p className="text-red-500 text-sm mt-1">{errors.CardNumber}</p>}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="expiry"
                                            value={cardData.expiry}
                                            onChange={handleChange}
                                            placeholder="Expiry (MM/YY)"
                                            className="w-1/2 border px-4 py-2 rounded"
                                        />
                                        {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={cardData.cvv}
                                            onChange={handleChange}
                                            placeholder="CVV"
                                            className="w-1/2 border px-4 py-2 rounded"
                                        />
                                        {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
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

                            onClick={() => {
                                // alert("Payment confirmed");
                                confirmPayment();
                            }}
                            className={`w-full mt-6  font-semibold py-2 px-4 rounded
                                 ${!paymentMethod  
                                  
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-[#26B170] text-white hover:bg-[#26B170]"
                                }
                            `}
                            disabled={
                                !paymentMethod
                                //  ||
                                // (paymentMethod === "card" &&
                                //     (!cardData.cardNumber || !cardData.expiry || !cardData.cvv))
                            }

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
