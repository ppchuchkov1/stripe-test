import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import pr1 from "./assets/product1.jpg";
import pr2 from "./assets/product2.jpg";

// Your public Stripe key
const stripePromise = loadStripe(
  "pk_test_51Hkv2kGETpcP6ndNqcDK55NUzHUgiLIDAcOdEyMNyyYTMBKsmo0YsRja7LZDuQcQj2PdOe3dqglbSkQR7Yq1FIBV00xgkelsaE"
);

const CheckoutForm = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [products, setProducts] = useState([
    {
      name: "Product 1",
      amount: 1000, // Price in cents
      currency: "bgn",
      quantity: 1,
      imageUrl: pr1,
    },
    {
      name: "Product 2",
      amount: 2000,
      currency: "bgn",
      quantity: 1,
      imageUrl: pr2,
    },
  ]);

  // Function to handle payment
  const handleCheckout = async () => {
    try {
      const lineItems = products.map((product) => ({
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
          },
          unit_amount: product.amount,
        },
        quantity: product.quantity,
      }));

      const response = await fetch(
        "http://localhost:5001/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ line_items: lineItems, customerEmail: email }), // Include email in the request body
        }
      );
      const { id: sessionId } = await response.json();

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
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)} // Update email state
        required // Optional: Add required attribute for form validation
      />
      <ul>
        {products.map((product, index) => (
          <li key={index} style={{ display: "flex", alignItems: "center" }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: "50px", height: "50px", marginRight: "10px" }}
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
