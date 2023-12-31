import "./Login.css";
// React Component
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function LoginForm({loginChange,setLoginChange, updateSum}) {
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'https://danielshop.onrender.com/login/',
        { username, password }
      );

      const accessToken = response.data.access_token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem("username", username);

      // Fetch cart items after login
      const cartIdResponse = await axios.get("https://danielshop.onrender.com/user-cart/");
      const cartId = cartIdResponse.data;

      if (cartId.id) {
        const cartResponse = await axios.get(`https://danielshop.onrender.com/cart-items/${cartId.id}`);
        const cartItems = cartResponse.data;

        // Calculate the sum of quantities
        const sumOfQuantities = cartItems.reduce((sum, obj) => sum + obj.quantity, 0);

        // Update the sum using the callback
        updateSum(sumOfQuantities);
      }

      navigate('/');
      setLoginChange(!loginChange);
    } catch (error) {
      console.error('Login failed', error.response.data);
    }
  };
  


  return (
    <form className="login">
      <div className="loginwindow">
        <h1>Login:</h1>
        <label className="loginitem">
          Username:
          <input className="logininput" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className="loginitem">
          Password:
          <input className="logininput"  type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <button className="submit" type="button" onClick={handleLogin}>
          Login
        </button></div>
      </form>
  );
}

export default LoginForm;
