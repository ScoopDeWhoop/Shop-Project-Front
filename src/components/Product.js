import React from 'react';
import "./Products.css";
import { Link } from "react-router-dom";

function Products({ product }) {
  const hostname = 'https://danielshop.onrender.com/static';
const imageUrl = `${hostname}${product.image}`;
  return (
    <Link className="product_frame" key={product.id} to={`/product/${product.id}?imageUrl=${imageUrl}`}>
      <div className="product_content">
        <img src={imageUrl} alt={product.name} className="product_image" />
        <h5 className="product_name">{product.name}</h5>
        <p className="product_price">Price:{product.price}₪</p>
      </div>
    </Link>
  );
}

export default Products;