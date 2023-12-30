import "./Login.css";
// React Component
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function LoginForm({loginChange,setLoginChange}) {
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
    localStorage.setItem("username",username)
    navigate('/'); 
    setLoginChange(!loginChange)
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
