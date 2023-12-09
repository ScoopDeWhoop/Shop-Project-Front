import React, { useEffect, useState } from "react";
import "./Products.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Products({ product }) {
  const [cart, setCart] = useState({});
  useEffect(() => {
    const getCart = () => {
      axios
        .get("http://127.0.0.1:8000/user-cart/")
        .then((response) => setCart(response.data))
        .catch((error) => console.error("Error fetching user cart:", error));
    };
    getCart();
    return () => {};
  }, []);
  const hostname = "http://127.0.0.1:8000/static";
  const imageUrl = `${hostname}${product.image}`;
  const handleAdd = async (cartId, productId) => {
    const url = "http://127.0.0.1:8000/cart/cart-items/ ";
    const data = {
      quantity: 1,
      cart: cartId,
      product: productId,
    };
    console.log('Request Payload:', data);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers, such as authentication headers
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // CartItem created successfully
      const responseData = await response.json();
      console.log("New CartItem:", responseData);
    } else {
      // Handle error
      console.error("Failed to create CartItem");
    }
  };
  return (
    <div className="product_frame">
      <Link
        className="product_content"
        key={product.id}
        to={`/product/${product.id}?imageUrl=${imageUrl}`}
      >
        <img src={imageUrl} alt={product.name} className="product_image" />
        <h5 className="product_name">{product.name}</h5>
      </Link>
      <p className="product_price">Price:{product.price}₪</p>
      <div className="product-btns">
        <button
          className="addcart"
          onClick={() => handleAdd(product.id, cart.id)}
        >
          Add to cart
        </button>
        <Link key={product.id} to="cart" className="buybtn">
          Buy now
        </Link>
      </div>
    </div>
  );
}

export default Products;
