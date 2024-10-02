import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import pr1 from "./assets/product1.jpg";
import pr2 from "./assets/product2.jpg";

const stripePromise = loadStripe(
  "pk_test_51Hkv2kGETpcP6ndNqcDK55NUzHUgiLIDAcOdEyMNyyYTMBKsmo0YsRja7LZDuQcQj2PdOe3dqglbSkQR7Yq1FIBV00xgkelsaE"
); // Your Stripe Public Key

const CheckoutForm = () => {
  const [products, setProducts] = useState([
    {
      name: "Product 1",
      amount: 1000,
      currency: "bgn",
      quantity: 1,
      imageUrl: pr1, // Replace with actual image URL
    },
    {
      name: "Product 2",
      amount: 2000,
      currency: "bgn",
      quantity: 1,
      imageUrl: pr2, // Replace with actual image URLr
    },
  ]);

  const handleCheckout = async () => {
    try {
      const response = await fetch(
        "https://localhost:5001/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(products), // Send products as JSON
        }
      );

      const { sessionId } = await response.json();

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe error:", error);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <ul>
        {products.map((product, index) => (
          <li key={index} style={{ display: "flex", alignItems: "center" }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: "50px", height: "50px", marginRight: "10px" }} // Image styling
            />
            <div>
              <div>
                {product.name} - ${(product.amount / 100).toFixed(2)} x{" "}
                {product.quantity}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
};

const StripeContainer = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default StripeContainer;
