import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

function LoginPage({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Starting login...");
    console.log("BASE_URL:", BASE_URL);
    console.log("Request URL:", `${BASE_URL}/user/signin`);
    console.log("Request body:", { email, password });

    try {
      const res = await fetch(`${BASE_URL}/user/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);

      if (!res.ok) {
        const errorText = await res.text();
        console.log("Error response text:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "Login failed");
        } catch (parseError) {
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
      }

      const data = await res.json();
      console.log("Success response:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        window.dispatchEvent(new Event("userLogin"));
        navigate("/profile");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      // Make error messages more user-friendly
      let userFriendlyError = err.message;

      if (err.message.includes("incorrect email or password")) {
        userFriendlyError =
          "The email or password you entered is incorrect. Please try again.";
      } else if (
        err.message.includes("Please verify your email before logging in")
      ) {
        userFriendlyError =
          "Please check your email and click the verification link before logging in. If you didn't receive the email, check your spam folder.";
      } else if (err.message.includes("email already in use")) {
        userFriendlyError =
          "This email is already registered. Please try logging in instead.";
      } else if (err.message.includes("Failed to fetch")) {
        userFriendlyError =
          "Unable to connect to the server. Please check your internet connection and try again.";
      } else if (err.message.includes("HTTP 500")) {
        userFriendlyError = "Server error occurred. Please try again later.";
      } else if (err.message.includes("HTTP 404")) {
        userFriendlyError = "Service not found. Please contact support.";
      }

      setError(userFriendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1
        style={{
          fontSize: 28,
          marginBottom: 24,
          color: "#2d3748",
          textAlign: "center",
        }}
      >
        Welcome Back
      </h1>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 600,
              color: "#4a5568",
            }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 600,
              color: "#4a5568",
            }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>
        <button
          type="submit"
          className="btn"
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      {error && (
        <div className="message error">
          <strong>Login Error:</strong> {error}
          <br />
          <small>Please check your credentials and try again.</small>
        </div>
      )}
      <div style={{ textAlign: "center", marginTop: 20, color: "#4a5568" }}>
        Don't have an account?{" "}
        <a
          href="/register"
          style={{ color: "#667eea", textDecoration: "none", fontWeight: 600 }}
        >
          Sign up
        </a>
      </div>
    </div>
  );
}

export default LoginPage;
