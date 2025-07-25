import { useState } from "react";
import {
    Crown,
    Check,
    Star,
    MessageCircle,
    Award,
    Zap,
    Shield,
    CheckCircle,
} from "lucide-react";
import CheckoutForm from "./CheckoutForm";
import PricingCard from "./PricingCard";
import useDbUser from "../../hooks/useDbUser";
import { useNavigate } from "react-router";
import InPageLoading from "../InPageLoading";
import Swal from "sweetalert2";

const Membership = () => {
    const { dbUser, isLoading, isError } = useDbUser();
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showCheckout, setShowCheckout] = useState(false);

    const plans = [
        {
            id: "monthly",
            name: "Monthly Premium",
            price: 9.99,
            period: "/month",
            description: "Premium features with monthly billing",
            features: [
                "Unlimited posts",
                "Premium gold badge",
                "Priority support",
                "Early access to features",
                "Ad-free experience",
            ],
            popular: false,
        },
        {
            id: "lifetime",
            name: "Lifetime Premium",
            price: 99.99,
            period: "one-time",
            description: "All premium features, pay once",
            badge: "Most Popular",
            features: [
                "All monthly features",
                "Lifetime access",
                "Exclusive lifetime badge",
                "Special recognition",
                "VIP community access",
                "Beta feature access",
            ],
            popular: true,
            savings: "Save 58%",
        },
    ];

    const handleSelectPlan = (planId) => {
        setSelectedPlan(planId);
        setShowCheckout(true);
    };

    const handleBackToPricing = () => {
        setShowCheckout(false);
        setSelectedPlan(null);
    };

    if (isError) {
        Swal.fire({
            icon: "error",
            title: "Loading Failed",
            text: "Something went wrong! Please try again!",
            background: "#1a1a1a",
            color: "#e5e5e5",
            confirmButtonColor: "#dc2626",
            customClass: {
                popup: "!text-xs sm:!text-base",
                title: "!text-xs sm:!text-xl",
                htmlContainer: "!text-xs sm:!text-base",
                confirmButton:
                    "!text-xs sm:!text-base !px-3 !py-1.5 sm:!px-4 sm:!py-2",
            },
        }).then(() => {
            navigate("/");
        });
    }

    if (isLoading) return <InPageLoading></InPageLoading>;

    // Already member state
    // if (!dbUser?.badges?.length > 1) {
    //     return (
    //         <div className="max-w-xl w-11/12 mt-10 mx-auto bg-[#121212] rounded-2xl border border-neutral-800 p-8 text-center pri-font">
    //             <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
    //                 <CheckCircle className="size-8 text-green-400" />
    //             </div>
    //             <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
    //             <p className="text-neutral-400 mb-6">
    //                 Your premium features are now active.
    //             </p>
    //             <button
    //                 onClick={() => (window.location.href = "/dashboard")}
    //                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
    //             >
    //                 Go to Dashboard
    //             </button>
    //         </div>
    //     );
    // }

    if (showCheckout) {
        return (
            <div className="bg-black text-white pri-font">
                <div className="max-w-xl w-11/12 mx-auto py-8">
                    <button
                        onClick={handleBackToPricing}
                        className="mb-6 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        ← Back to pricing
                    </button>
                    <CheckoutForm
                        dbUser={dbUser}
                        selectedPlan={selectedPlan}
                    ></CheckoutForm>
                </div>
            </div>
        );
    }

    return (
        <div className="text-white pri-font pb-10">
            <div className="max-w-4xl mx-auto w-11/12 sm:pt-5">
                {/* Header */}
                <div className="p-6 sm:mb-5">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Crown className="size-6 text-blue-400" />
                            <h1 className="text-2xl font-bold">Membership</h1>
                        </div>
                        <p className="text-neutral-400 max-w-2xl mx-auto">
                            Upgrade to premium for unlimited posts and exclusive
                            features
                        </p>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-10 sm:gap-6 mb-8">
                    {plans.map((plan) => (
                        // <div
                        //     key={plan.id}
                        //     className={`relative bg-[#121212] rounded-2xl border p-6 hover:border-neutral-700 transition-colors flex flex-col ${
                        //         plan.popular
                        //             ? "border-blue-500"
                        //             : "border-neutral-800"
                        //     }`}
                        // >
                        //     {/* Popular Badge */}
                        //     {plan.badge && (
                        //         <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        //             <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        //                 <Star className="size-3" />
                        //                 {plan.badge}
                        //             </div>
                        //         </div>
                        //     )}

                        //     {/* Plan Header */}
                        //     <div className="text-center mb-6">
                        //         <h3 className="text-xl font-bold mb-2">
                        //             {plan.name}
                        //         </h3>
                        //         <p className="text-neutral-400 text-sm mb-4">
                        //             {plan.description}
                        //         </p>

                        //         <div className="flex items-baseline justify-center gap-1 mb-2">
                        //             <span className="text-3xl font-bold">
                        //                 ${plan.price}
                        //             </span>
                        //             <span className="text-neutral-400 text-sm">
                        //                 {plan.period}
                        //             </span>
                        //         </div>

                        //         {plan.savings && (
                        //             <div className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                        //                 {plan.savings}
                        //             </div>
                        //         )}
                        //     </div>

                        //     {/* Features */}
                        //     <div className="space-y-3 mb-6">
                        //         {plan.features.map((feature, index) => (
                        //             <div
                        //                 key={index}
                        //                 className="flex items-center gap-3"
                        //             >
                        //                 <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                        //                     <Check className="size-3 text-blue-400" />
                        //                 </div>
                        //                 <span className="text-sm text-neutral-300">
                        //                     {feature}
                        //                 </span>
                        //             </div>
                        //         ))}
                        //     </div>

                        //     {/* CTA Button */}
                        //     <button
                        //         onClick={() => handleSelectPlan(plan.id)}
                        //         className={`w-full mt-auto py-3 rounded-lg font-medium text-sm transition-colors ${
                        //             plan.popular
                        //                 ? "bg-blue-600 text-white hover:bg-blue-700"
                        //                 : "bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700"
                        //         }`}
                        //     >
                        //         Choose {plan.name}
                        //     </button>
                        // </div>
                        <PricingCard
                            key={plan.id}
                            handleSelectPlan={handleSelectPlan}
                            plan={plan}
                        ></PricingCard>
                    ))}
                </div>

                {/* Benefits */}
                <div className="bg-[#121212] rounded-2xl border border-neutral-800 p-6 mb-8">
                    <h2 className="text-xl font-bold mb-6">Premium Benefits</h2>

                    <div className="grid sm:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MessageCircle className="size-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-medium mb-1">
                                    Unlimited Posts
                                </h3>
                                <p className="text-sm text-neutral-400">
                                    Create as many posts as you want
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Award className="size-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-medium mb-1">
                                    Premium Badge
                                </h3>
                                <p className="text-sm text-neutral-400">
                                    Show your premium status
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Zap className="size-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-medium mb-1">
                                    Early Access
                                </h3>
                                <p className="text-sm text-neutral-400">
                                    Try new features first
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="bg-[#121212] rounded-2xl border border-neutral-800 p-6">
                    <h2 className="text-xl font-bold mb-6">Common Questions</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium mb-2">
                                Can I cancel anytime?
                            </h3>
                            <p className="text-neutral-400 text-sm">
                                Yes, you can cancel your monthly subscription at
                                any time. Lifetime purchases are permanent.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">
                                What happens to my posts?
                            </h3>
                            <p className="text-neutral-400 text-sm">
                                All existing posts remain visible. You'll be
                                limited to 5 new posts if you downgrade.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">
                                Is payment secure?
                            </h3>
                            <p className="text-neutral-400 text-sm">
                                Yes, all payments are processed securely through
                                Stripe.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 pt-6 border-t border-neutral-800">
                    <div className="flex items-center justify-center gap-6 text-sm text-neutral-400">
                        <div className="flex items-center gap-1">
                            <Shield className="size-4" />
                            Secure Payment
                        </div>
                        <div className="flex items-center gap-1">
                            <Award className="size-4" />
                            Premium Support
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Membership;
