import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Cart.css";
const Cart = (handleCart) => {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  useEffect(getCart, []);
  function getCart(){
    axios.get('http://127.0.0.1:8000/user-cart/')
      .then(response => setCart(response.data))
      .catch(error => console.error('Error fetching user cart:', error));
    
  };
    
  
  useEffect(() => {
    const productIds = cart.products;
    getProducts(productIds);
  }, [cart.products]);

  function getProducts(productIds) {
    if (!productIds || productIds.length === 0) {
      // Handle the case where productIds is undefined or an empty array
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
      <div>
        {products && products.length > 0 && products.map(product => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <img className="product-image" src={`http://127.0.0.1:8000/static${product.image}`} alt={product.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
