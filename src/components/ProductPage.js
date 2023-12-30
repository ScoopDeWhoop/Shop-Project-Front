import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


function ProductPage() {
    const { productId } = useParams();
    const imageUrl = new URLSearchParams(window.location.search).get("imageUrl");
    const [product, setProduct] = useState(null);
  
    useEffect(() => {
      if (productId) {
        axios.get(`https://danielshop.onrender.com/product/${productId}`)
          .then((response) => {
            setProduct(response.data);
          })
          .catch((error) => {
            console.error("Error fetching product data:", error);
          });
      }
    }, [productId]);
  
    return (
      <div className="product_content">
        {product ? (
          <>
            <h5 className="product_name">{product.name}</h5>
            <p className="product_price">Price: {product.price}₪</p>
            <img src={imageUrl} alt={product.name} className="product_image" />
          </>
        ) : (
          <p>Loading product data...</p>
        )}
      </div>
    );
  }
  
  export default ProductPage;
  