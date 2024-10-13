import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Вашият публичен ключ на Stripe
const stripePromise = loadStripe(
  "pk_test_51Hkv2kGETpcP6ndNqcDK55NUzHUgiLIDAcOdEyMNyyYTMBKsmo0YsRja7LZDuQcQj2PdOe3dqglbSkQR7Yq1FIBV00xgkelsaE"
);

const CheckoutForm = () => {
  const [email, setEmail] = useState(""); // Състояние за имейл адреса
  const [products, setProducts] = useState([
    {
      name: "Product 1",
      amount: 1000, // Цена в стотинки
      currency: "bgn",
      quantity: 1,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/3/34/EIZO_Foris_FG2421_VGA_computer_monitor_displaying_test_pattern.png",
    },
    {
      name: "Product 2",
      amount: 2000,
      currency: "bgn",
      quantity: 1,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/3/34/EIZO_Foris_FG2421_VGA_computer_monitor_displaying_test_pattern.png",
    },
  ]);

  const [error, setError] = useState(""); // Състояние за съобщение за грешка

  // Функция за обработка на плащането
  const handleCheckout = async () => {
    if (!email) {
      setError("Please enter your email."); // Покажи грешка, ако имейлът е празен
      return;
    }
    setError(""); // Изчисти грешката, ако имейлът е предоставен

    try {
      const lineItems = products.map((product) => ({
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            images: [product.imageUrl], // Използвайте изображения
          },
          unit_amount: product.amount,
        },
        quantity: product.quantity,
      }));

      const response = await fetch(
        "https://test-express-docker-1.onrender.com/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ line_items: lineItems, customerEmail: email }),
        }
      );

      // Проверка дали отговорът е успешен
      if (!response.ok) {
        const { error } = await response.json();
        setError(`Error: ${error}`);
        return;
      }

      const { id: sessionId } = await response.json();

      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        console.error("Stripe error:", stripeError);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setError("An error occurred during checkout. Please try again.");
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)} // Обнови състоянието на имейл
        required // По желание: добавете атрибут за валидност
      />
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Показване на съобщение за грешка */}
      <ul>
        {products.map((product, index) => (
          <li key={index} style={{ display: "flex", alignItems: "center" }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: "100px", height: "100px", marginRight: "10px" }}
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
