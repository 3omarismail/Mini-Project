import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { DataContext } from './DataContext';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useContext(DataContext); // Get the loginUser function from DataContext

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const success = await loginUser(email, password); // Call the loginUser function from DataContext
      if (success) {
        navigate("/"); // Redirect to dashboard on successful login
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred during login.");
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>} {/* Display error message */}

        <button type="submit" style={{ marginTop: "20px" }}>Login</button>
      </form>
    </div>
  );
}

export default Login;