import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [quantityMap, setQuantityMap] = useState({}); // Store quantity in local state

  useEffect(getCart, []);

  function getCart() {
    axios.get('http://127.0.0.1:8000/user-cart/')
      .then(response => setCart(response.data))
      .catch(error => console.error('Error fetching user cart:', error));
  }

  useEffect(() => {
    const getItems = () => {
      const itemsUrl = "http://127.0.0.1:8000/cart/cart-items/";
      axios
        .get(itemsUrl)
        .then((response) => {
          setCartItems(response.data);
          updateQuantityMap(response.data); // Update quantity map when cart items change
        });
    };
    getItems();
  }, [cart.id]); // Add cart.id as a dependency

  useEffect(() => {
    const productIds = cart.products;
    getProducts(productIds);
  }, [cart.products]);

  const updateQuantityMap = (cartItems) => {
    const newQuantityMap = {};
    cartItems.forEach(item => {
      newQuantityMap[item.product] = item.quantity;
    });
    setQuantityMap(newQuantityMap);
  };

  const calculateProductQuantity = (productId) => {
    return quantityMap[productId] || 0;
  };

  const handleAddQuantity = async (cartId, productId) => {
    const cartItem = cartItems.find(item => item.product === productId && item.cart === cartId);
    if (cartItem) {
      const url = `http://127.0.0.1:8000/cart/cart-items/${cartItem.id}/`;
      const data = {
        quantity: cartItem.quantity + 1,
      };

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        updateQuantityMap(cartItems.map(item => (item.id === cartItem.id ? { ...item, quantity: item.quantity + 1 } : item)));
      } else {
        console.error("Failed to update quantity");
      }
    } else {
      console.error("Product not found in the cart");
    }
  };

  const handleDecreaseQuantity = async (cartId, productId) => {
    const cartItem = cartItems.find(item => item.product === productId && item.cart === cartId);
  
    if (cartItem) {
      const newQuantity = cartItem.quantity - 1;
  
      if (newQuantity > 0) {
        // Update quantity as usual
        const url = `http://127.0.0.1:8000/cart/cart-items/${cartItem.id}/`;
        const data = {
          quantity: newQuantity,
        };
  
        try {
          const response = await fetch(url, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
  
          if (response.ok) {
            // Update the state based on the previous state
            updateQuantityMap(cartItems.map(item => (item.id === cartItem.id ? { ...item, quantity: newQuantity } : item)));
            setCartItems(prevCartItems => {
              return prevCartItems.map(item => (item.id === cartItem.id ? { ...item, quantity: newQuantity } : item));
            });
          } else {
            console.error("Failed to update quantity");
          }
        } catch (error) {
          console.error("Error updating quantity:", error);
        }
      } else {
        // Quantity is 0, so delete the cart item
        const deleteUrl = `http://127.0.0.1:8000/cart/cart-items/${cartItem.id}/`;
  
        try {
          const response = await fetch(deleteUrl, {
            method: "DELETE",
          });
  
          if (response.ok) {
            // Remove the item from the state
            setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== cartItem.id));
            // Optionally, you can update the quantity map here as well
            updateQuantityMap(cartItems.filter(item => item.id !== cartItem.id));
          } else {
            console.error("Failed to delete cart item");
          }
        } catch (error) {
          console.error("Error deleting cart item:", error);
        }
      }
    } else {
      console.error("Product not found in the cart");
    }
  };
  
  

  function getProducts(productIds) {
    if (!productIds || productIds.length === 0) {
      return;
    }

    let url = "http://127.0.0.1:8000/product";

    axios
      .get(url, { params: { ids: productIds } })
      .then((response) => {
        const filteredProducts = response.data.filter(product => productIds.includes(product.id));
        setProducts(filteredProducts);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 && products.map(product => (
            <tr key={product.id}>
              <td>
                <img className="product-image" src={`http://127.0.0.1:8000/static${product.image}`} alt={product.name} />
              </td>
              <td>{product.name}</td>
              <td>
                <button onClick={() => handleDecreaseQuantity(cart.id, product.id)}>-</button>
                {calculateProductQuantity(product.id)}
                <button onClick={() => handleAddQuantity(cart.id, product.id)}>+</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cart;
