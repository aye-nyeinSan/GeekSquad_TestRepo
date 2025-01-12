"use client";
import React, { useState } from "react";
import "./dashboard.css";
import Cart from "../cart/page";
export default function DashboardPage() {
  const [cart, setCart] = useState([]);

  const [showCart, setShowCart] = useState(false);

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const products = [
    { id: 1, name: "Product A", price: 0 },
    { id: 2, name: "Product B", price: 0 },
    { id: 3, name: "Product C", price: 0 },
    { id: 4, name: "Product D", price: 0 },
    { id: 5, name: "Product E", price: 0 },
    { id: 6, name: "Product F", price: 0 },
    { id: 7, name: "Product G", price: 0 },
    { id: 8, name: "Product H", price: 0 },
  ];

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <div>
      {!showCart && (
        <div className="dashboard">
          <header className="header">
            <div className="logo-circle"></div>
            <h1>Home</h1>
            <div className="cart">
              <span role="img" aria-label="cart" onClick={toggleCart}>
                🛒
              </span>
              <span className="cart-count">{cart.length}</span>
            </div>
          </header>
          <main className="products-container">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image"></div>
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
                <button
                  className="add-to-cart"
                  onClick={() => addToCart(product)}
                >
                  ADD TO CART
                </button>
              </div>
            ))}
          </main>
        </div>
      )}
      {showCart && (
        <Cart cart={cart} setCart={setCart} toggleCart={toggleCart} />
      )}
    </div>
  );
}
