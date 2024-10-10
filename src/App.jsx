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
      imageUrl:
        "https://images.unsplash.com/photo-1592492135673-55966d3b541a?q=80&w=2586&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Replace with actual image URL
    },
    {
      name: "Product 2",
      amount: 2000,
      currency: "bgn",
      quantity: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1522706604291-210a56c3b376?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Replace with actual image URLr
    },
  ]);

  const handleCheckout = async () => {
    try {
      const response = await fetch(
        "https://localhost:5000/api/stripe/payment",
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
