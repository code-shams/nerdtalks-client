import React from "react";
import Membership from "../../components/Membership/Membership";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../../utils/stripe";

const MembershipPage = () => {
    return (
        <div>
            <Elements stripe={stripePromise}>
                <Membership></Membership>
            </Elements>
        </div>
    );
};

export default MembershipPage;
