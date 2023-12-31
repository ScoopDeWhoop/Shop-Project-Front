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
  const [sum, setSum] = useState(null);

  useEffect(getProducts, []);
  const [cart, setCart] = useState({});
  const [cartId, setCartId] = useState({});
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken)
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setLoginChange((loginChange) => !loginChange);
  }, []);
  useEffect(() => {
    const getCartId = () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        axios
          .get("https://danielshop.onrender.com/user-cart/")
          .then((response) => setCartId(response.data))
          .catch((error) => console.error("Error fetching user cart:", error));
      }
    };

    getCartId();
    return () => {};
  }, []);
  useEffect(() => {
    const getCartQuantity = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken && cartId.id) {
        try {
          const response = await axios.get(
            `https://danielshop.onrender.com/cart-items/${cartId.id}`
          );
          // Set only the "quantity" to the state
          setCart(response.data);
        } catch (error) {
          console.error("Error fetching user cart:", error);
        }
      }
    };

    getCartQuantity();

    return () => {};
  }, [cartId,cart]);

  useEffect(() => {
    const getSum= async ()=>{
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && await Array.isArray(cart)) {
      const sumOfQuantities = cart.reduce((sum, obj) => sum + obj.quantity, 0);
      setSum(sumOfQuantities);
    }};
    getSum();
    return () => {};
  }, [cart]);

  function getProducts(search = null) {
    let url = "https://danielshop.onrender.com/product";
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
          console.error(
            "Response error:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Request error:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error:", error.message);
        }
      });
  }

  function handleCart(cart) {
    setUserCart(cart);
  }

  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Navbar getProducts={getProducts} loginChange={loginChange} sum={sum} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="product_body">
                  {products.map((product) => (
                    <div key={product.id}>
                      <Product
                        userCart={userCart}
                        product={product}
                        cart={cart}
                      />
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
          <Route  path="cart" element={<Cart handleCart={handleCart} sum={sum}/>}></Route>
        </Routes>
        <Footer></Footer>
      </BrowserRouter>
    </>
  );
}

export default App;
