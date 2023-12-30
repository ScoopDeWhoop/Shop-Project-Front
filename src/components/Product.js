import React, { useEffect, useState } from "react";
import "./Products.css";
import { Link,useNavigate } from "react-router-dom";

import axios from "axios";

function Products({ product }) {
  const [cart, setCart] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getCart = () => {const accessToken = localStorage.getItem("accessToken");
    if (accessToken)
      {axios
        .get("https://danielshop.onrender.com/user-cart/")
        .then((response) => setCart(response.data))
        .catch((error) => console.error("Error fetching user cart:", error));}
        
    };
    getCart();
    return () => {};
  }, []);
  useEffect(()=>{
    const getItems=()=>{
      const itemsUrl="https://danielshop.onrender.com/cart/cart-items/"
      axios
      .get(itemsUrl)
      .then((response) => {
        
        setCartItems(response.data);
      })
    };
    getItems();
    return ()=> {};
  }, [])
  
  const hostname = "https://danielshop.onrender.com/static";
  const imageUrl = `${hostname}${product.image}`;
  
  const handleAdd = async (cartId, productId) => {
    if (cart.products.includes(productId)){
      

      const cartItem = cartItems.filter(item => item.product === productId && item.cart === cartId);
      if (cartItem.length > 0){
          const url = `https://danielshop.onrender.com/cart/cart-items/${cartItem[0].id}/`;
          const data = {
            quantity: cartItem[0].quantity + 1,
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
    const url = "https://danielshop.onrender.com/cart/cart-items/ ";
    const data = {
      quantity: 1,
      cart: cartId,
      product: productId,
    };
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
  const buyNow=async(cartId, productId) => {
      await handleAdd(cartId,productId)
      navigate("/cart")
    }
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
        <button onClick={() => buyNow(cart.id,product.id)} className="buybtn">
          Buy now
        </button>
      </div>
    </div>
  );
}

export default Products;
