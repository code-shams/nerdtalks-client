import { Check, Star } from "lucide-react";
import React from "react";

const PricingCard = ({ plan, handleSelectPlan }) => {
    return (
        <div
            key={plan.id}
            className={`relative bg-[#121212] rounded-2xl border p-6 hover:border-neutral-700 transition-colors flex flex-col ${
                plan.popular ? "border-blue-500" : "border-neutral-800"
            }`}
        >
            {/* Popular Badge */}
            {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star className="size-3" />
                        {plan.badge}
                    </div>
                </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-neutral-400 text-sm mb-4">
                    {plan.description}
                </p>

                <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-neutral-400 text-sm">
                        {plan.period}
                    </span>
                </div>

                {plan.savings && (
                    <div className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                        {plan.savings}
                    </div>
                )}
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Check className="size-3 text-blue-400" />
                        </div>
                        <span className="text-sm text-neutral-300">
                            {feature}
                        </span>
                    </div>
                ))}
            </div>

            {/* CTA Button */}
            <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full mt-auto py-3 rounded-lg font-medium text-sm transition-colors ${
                    plan.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700"
                }`}
            >
                Choose {plan.name}
            </button>
        </div>
    );
};

export default PricingCard;
