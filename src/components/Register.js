import "./Login.css";
// src/Register.js

import React, { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch("https://danielshop.onrender.com/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirm_password: confirmPassword,
          city,
          date_of_birth: dateOfBirth,
        }),
      });

      if (response.ok) {
        console.log("Registration successful!");
      } else {
        console.error("Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="register">
        <form className="registerwindow">
          <h2>Register</h2>
          <label className="registeritem">
            Username:
            <input className="registerinput"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="registeritem">
            Password:
            <input className="registerinput"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className="registeritem">
            Confirm Password:
            <input className="registerinput"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          
          <label className="registeritem">
            City:
            <input className="registerinput"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <label className="registeritem">
            Date of Birth:
            <input className="registerinput"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </label>
          <label className="registeritem">
            Email:
            <input className="registerinput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <br></br>
          <button className="submit" type="button" onClick={handleRegister}>
            Sumbit
          </button>
        </form>
    </div>
  );
};
export default Register;
