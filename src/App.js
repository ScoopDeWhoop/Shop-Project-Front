import axios from "axios";
import { useEffect, useState } from "react";
import Product from "./components/Product";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import ProductPage from "./components/ProductPage";
import Cart from "./components/Cart";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./components/Products.css";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loginChange, setLoginChange] = useState(false);
  const [userCart, setUserCart] = useState(false);
  useEffect(getProducts, []);
  const [cart, setCart] = useState({});
  
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setLoginChange(loginChange => !loginChange);
  }, []);
  useEffect(() => {
      const getCartProducts = () => {
        axios
          .get("http://127.0.0.1:8000/user-cart/")
          .then((response) => setCart(response.data.products))
          .catch((error) => console.error("Error fetching user cart:", error));
      };
      getCartProducts();
      
      return () => {};
    }, []);
  function getProducts(search = null) {
    let url = "http://127.0.0.1:8000/product";
    if (search) {
      url += `?search=${search}`;
    }
  
    axios
      .get(url)
      .then((response) => {
        // Handle successful response
        setProducts(response.data);
      })
      .catch((error) => {
        // Handle error
        if (error.response) {
          // The request was made, and the server responded with a status code
          console.error('Response error:', error.response.status, error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request error:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error:', error.message);
        }
      });
  }
  
  function handleCart(cart) {
    setUserCart(cart);
  }

  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Navbar getProducts={getProducts} loginChange={loginChange} cart={cart} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="product_body">
                  {products.map((product) => (
                    <div key={product.id}>
                      <Product userCart={userCart} product={product} />
                    </div>
                  ))}
                </div>
                <br />
              </>
            }
          ></Route>
          <Route
            path="/nutrition"
            element={
              <>
                <div className="product_body">
                  {products
                    .filter((product) => product.category === 1)
                    .map((product) => (
                      <div key={product.id}>
                        <Product userCart={userCart} product={product} />
                      </div>
                    ))}
                </div>
              </>
            }
          ></Route>
          <Route
            path="/clothing"
            element={
              <>
                <div className="product_body">
                  {products
                    .filter((product) => product.category === 2)
                    .map((product) => (
                      <div key={product.id}>
                        <Product userCart={userCart} product={product} />
                      </div>
                    ))}
                </div>
              </>
            }
          ></Route>
          <Route
            path="login"
            element={
              <Login
                loginChange={loginChange}
                setLoginChange={setLoginChange}
              />
            }
          ></Route>
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="register" element={<Register />}></Route>
          <Route path="cart" element={<Cart handleCart={handleCart} />}></Route>
        </Routes>
        <Footer></Footer>
      </BrowserRouter>
    </>
  );
}

export default App;
