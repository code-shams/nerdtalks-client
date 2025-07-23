import { useState } from "react";
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import {
    CreditCard,
    Shield,
    Loader2,
    CheckCircle,
    XCircle,
    Lock,
} from "lucide-react";

const CheckoutForm = ({  }) => {
    const selectedPlan = "monthly"
    const stripe = useStripe();
    const elements = useElements();

    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [cardComplete, setCardComplete] = useState({
        cardNumber: false,
        cardExpiry: false,
        cardCvc: false,
    });

    // Plan details (this would come from props in real implementation)
    const planDetails = {
        monthly: {
            name: "Monthly Premium",
            price: 9.99,
            period: "/month",
            priceId: "price_monthly_premium", // Stripe price ID
        },
        lifetime: {
            name: "Lifetime Premium",
            price: 99.99,
            period: "one-time",
            priceId: "price_lifetime_premium", // Stripe price ID
        },
    };

    const currentPlan = planDetails[selectedPlan];
    const isFormComplete = Object.values(cardComplete).every(Boolean);

    // Stripe element styling to match your dark theme
    const cardElementOptions = {
        style: {
            base: {
                fontSize: "16px",
                color: "#e5e5e5",
                backgroundColor: "transparent",
                fontFamily: "inherit",
                "::placeholder": {
                    color: "#a3a3a3",
                },
                iconColor: "#3b82f6",
            },
            invalid: {
                color: "#ef4444",
                iconColor: "#ef4444",
            },
        },
        hidePostalCode: true,
    };

    const handleCardChange = (elementType) => (event) => {
        setError(event.error ? event.error.message : "");
        setCardComplete((prev) => ({
            ...prev,
            [elementType]: event.complete,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setError("Stripe hasn't loaded yet. Please try again.");
            return;
        }

        if (!isFormComplete) {
            setError("Please complete all card details");
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            // Step 1: Create payment intent on your backend
            const response = await fetch("/api/create-payment-intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    planId: selectedPlan,
                    amount: Math.round(currentPlan.price * 100), // Convert to cents
                    currency: "usd",
                }),
            });

            const { client_secret, error: backendError } =
                await response.json();

            if (backendError) {
                setError(backendError);
                setProcessing(false);
                return;
            }

            // Step 2: Confirm payment with Stripe
            const { error: stripeError, paymentIntent } =
                await stripe.confirmCardPayment(client_secret, {
                    payment_method: {
                        card: elements.getElement(CardNumberElement),
                        billing_details: {
                            // Add user details here if available
                            // name: user.name,
                            // email: user.email,
                        },
                    },
                });

            if (stripeError) {
                setError(stripeError.message);
                setProcessing(false);
            } else if (paymentIntent.status === "succeeded") {
                setSucceeded(true);
                setProcessing(false);

                // Step 3: Update user membership on your backend
                await fetch("/api/update-membership", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        paymentIntentId: paymentIntent.id,
                        planId: selectedPlan,
                    }),
                });

                // Call success callback
                // if (onSuccess) {
                //     onSuccess(paymentIntent);
                // }
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setProcessing(false);
        }
    };

    // Success state
    if (succeeded) {
        return (
            <div className="bg-[#121212] rounded-2xl border border-neutral-800 p-8 text-center pri-font">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="size-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                <p className="text-neutral-400 mb-6">
                    Welcome to {currentPlan.name}. Your premium features are now
                    active.
                </p>
                <button
                    onClick={() => (window.location.href = "/dashboard")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#121212] rounded-2xl border border-neutral-800 p-6 pri-font">
            {/* Header */}
            <div className="border-b border-neutral-800 pb-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="size-6 text-blue-400" />
                    <h2 className="text-xl font-bold">Complete Payment</h2>
                </div>

                {/* Plan Summary */}
                <div className="bg-neutral-900 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{currentPlan.name}</span>
                        <span className="font-bold">${currentPlan.price}</span>
                    </div>
                    <p className="text-sm text-neutral-400">
                        {selectedPlan === "monthly"
                            ? "Billed monthly"
                            : "One-time payment"}
                    </p>
                </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-6">
                {/* Card Number */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Card Number
                    </label>
                    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 focus-within:border-blue-500 transition-colors">
                        <CardNumberElement
                            options={cardElementOptions}
                            onChange={handleCardChange("cardNumber")}
                        />
                    </div>
                </div>

                {/* Card Expiry and CVC */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Expiry Date
                        </label>
                        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 focus-within:border-blue-500 transition-colors">
                            <CardExpiryElement
                                options={cardElementOptions}
                                onChange={handleCardChange("cardExpiry")}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            CVC
                        </label>
                        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 focus-within:border-blue-500 transition-colors">
                            <CardCvcElement
                                options={cardElementOptions}
                                onChange={handleCardChange("cardCvc")}
                            />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                        <XCircle className="size-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Security Notice */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="size-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">
                            Secure Payment
                        </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                        Your payment information is encrypted and secure. We use
                        Stripe for payment processing.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        // onClick={onCancel}
                        disabled={processing}
                        className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={processing || !stripe || !isFormComplete}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Lock className="size-4" />
                                Pay ${currentPlan.price}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutForm;
