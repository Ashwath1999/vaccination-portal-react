import './Login.css';
import login from '../../assets/login.png';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';

export default function Login() {

    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin@123");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
      e.preventDefault();
      setError("");

      try {
        const response = await fetch("http://localhost:8081/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const message = await response.text();
          alert(message);
          navigate("/dashboard");
        } else {
          const errorMsg = await response.text();
          alert(errorMsg);
        }
      } catch (err) {
        alert(err.message);
      }
    };


    return (
      <div className="full-screen">
          <div className="imgcontainer">
              <img src={login} alt="Avatar" className="avatar"/>
          </div>
          <form className="Login" onSubmit={handleLogin}>
            <p className="login-header">Student Vaccination Portal</p>
            <label ><b>User Name</b></label>
            <input style={{width: "85%"}} type="text" value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter User Name" required/>
            <label ><b>Password</b></label>
            <input style={{width: "85%"}} type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password" required/>
            <br/>
            <button className="login-button" type="submit">Login</button>
          </form>
      </div>
    );
  }