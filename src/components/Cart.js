import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Cart.css";

function Cart({sum}) {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [quantityMap, setQuantityMap] = useState({});
  const accessToken = localStorage.getItem("accessToken");
  useEffect(getCart, [accessToken]);
  
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) 
    setUser(username)
  }, []);
  function getCart() {
    
    if (accessToken)
    {axios.get('https://danielshop.onrender.com/user-cart/')
        .then(response => setCart(response.data))
        .catch(error => console.error('Error fetching user cart:', error));}
  }

  useEffect(() => {
    const getItems = () => {
      const itemsUrl = 'https://danielshop.onrender.com/cart/cart-items/';
      axios.get(itemsUrl).then((response) => {
        setCartItems(response.data);
        updateQuantityMap(response.data);
      });
    };
    getItems();
  }, [cart.id]);

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
  
    const cartItem = cartItems.find((item) => item.product === productId && item.cart === cartId);
  
    if (cartItem) {
      const url = `https://danielshop.onrender.com/cart/cart-items/${cartItem.id}/`;
      const data = {
        quantity: cartItem.quantity + 1,
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
          const updatedCartItems = cartItems.map((item) =>
            item.id === cartItem.id ? { ...item, quantity: item.quantity + 1 } : item
          );
  
          setCartItems(updatedCartItems);
  
          // Update the quantity map based on the response data
          updateQuantityMap(updatedCartItems);
        } else {
          console.error("Failed to update quantity");
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else {
      console.error("Product not found in the cart");
    }
  };
  

  const handleDecreaseQuantity = async (cartId, productId) => {
    const cartItem = cartItems.find((item) => item.product === productId && item.cart === cartId);
  
    if (cartItem) {
      const newQuantity = cartItem.quantity - 1;
  
      if (newQuantity > 0) {
        // Update quantity as usual
        const url = `https://danielshop.onrender.com/cart/cart-items/${cartItem.id}/`;
        const data = {
          quantity: newQuantity,
        };
  
        try {
          const response = await axios.patch(url, data);
  
          if (response.status === 200) {
            // Update the state based on the previous state
            updateQuantityMap(
              cartItems.map((item) =>
                item.id === cartItem.id ? { ...item, quantity: newQuantity } : item
              )
            );
            setCartItems((prevCartItems) =>
              prevCartItems.map((item) =>
                item.id === cartItem.id ? { ...item, quantity: newQuantity } : item
              )
            );
          } else {
            console.error("Failed to update quantity");
          }
        } catch (error) {
          console.error("Error updating quantity:", error);
        }
      } else {
        // Quantity is 0, so delete the cart item
        const deleteUrl = `https://danielshop.onrender.com/cart/cart-items/${cartItem.id}/`;
  
        try {
          const response = await axios.delete(deleteUrl);
  
          if (response.status === 204) {
            // Remove the item from the state
            setCartItems((prevCartItems) =>
              prevCartItems.filter((item) => item.id !== cartItem.id)
            );
            // Remove the product from the state
            setProducts((prevProducts) =>
              prevProducts.filter((product) => product.id !== productId)
            );
            // Optionally, you can update the quantity map here as well
            updateQuantityMap(
              cartItems.filter((item) => item.id !== cartItem.id)
            );
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

    let url = "https://danielshop.onrender.com/product";

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
  const handleDeleteAllItems = async () => {
    try {
      const response = await axios.delete(`https://danielshop.onrender.com/cart/delete-all-items/${cart.id}/`);
      if (response.status === 204) {
        setCartItems([]);
        setProducts([]);
        updateQuantityMap([]);
      } else {
        console.error("Failed to delete all cart items");
      }
    } catch (error) {
      console.error("Error deleting all cart items:", error);
    }
  };

  return (
    <div>{user ?(
      <><table>
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
                <img className="product-image" src={`https://danielshop.onrender.com/static${product.image}`} alt={product.name} />
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
      </table><button className="clear-btn" onClick={handleDeleteAllItems}>Clear Cart</button><div className="total-items">Total items:{sum}</div></>):(<div className='emptyCart'>
        <h1>Cart is empty</h1>
        <p>Please login</p>
        </div>
      )}
    </div>
  );
};

export default Cart;
