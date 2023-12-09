import React, { useEffect, useState } from "react";
import "./Products.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Products({ product }) {
  const [cart, setCart] = useState({});
  const [cartItems, setCartItems] = useState({});
  
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
    if (cart.products.includes(productId)){
      const url="http://127.0.0.1:8000/cart/cart-items/"
      await axios
      .get(url)
      .then((response) => {
        
        setCartItems(response.data);
      })

      const cartItem = cartItems.filter(item => item.product === productId && item.cart === cartId);
      
        if (cartItem) {
          const updatedQuantity = cartItem[0].quantity + 1;

          
          const url = `http://127.0.0.1:8000/cart/cart-items/${cartItem[0].id}/`;
          const data = {
            quantity: updatedQuantity,
          };

          const response = await fetch(url, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              // Add any additional headers, such as authentication headers
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            // Quantity updated successfully
            console.log("updated")
          } else {
            // Handle error
            console.error("Failed to update quantity");
          }
        } else {
          // Handle case where the product is not found in the cart
          console.error("Product not found in the cart");
        }
    }
    else{
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
    }}
    
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
          onClick={() => handleAdd(cart.id,product.id)}
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
