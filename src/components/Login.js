import "./Login.css";
// React Component
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginForm() {
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
  try {
    const response = await fetch('https://danielshop.onrender.com/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Login successful');
      const accessToken = data.token;
      localStorage.setItem('accessToken', accessToken);
      navigate('/Shop-Project-Front'); 
    } else {
      console.error('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Error during login:', error);
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
