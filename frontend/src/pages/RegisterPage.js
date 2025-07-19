import React, { useState } from "react";
import { BASE_URL } from "../config";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    console.log("Starting registration...");
    console.log("BASE_URL:", BASE_URL);
    console.log("Request URL:", `${BASE_URL}/user/signup`);
    console.log("Request body:", { name, email, password });

    try {
      const res = await fetch(`${BASE_URL}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);

      if (!res.ok) {
        const errorText = await res.text();
        console.log("Error response text:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "Registration failed");
        } catch (parseError) {
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
      }

      const data = await res.json();
      console.log("Success response:", data);

      if (
        data.message.includes("Account created successfully") ||
        data.message.includes("Account updated successfully")
      ) {
        setMessage(data.message);
        // Clear any previous errors
        setError("");
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      // Make error messages more user-friendly
      let userFriendlyError = err.message;

      if (err.message.includes("email already in use")) {
        userFriendlyError =
          "This email is already registered. Please try logging in instead.";
      } else if (err.message.includes("already registered and verified")) {
        userFriendlyError =
          "This email is already registered and verified. Please try logging in instead.";
      } else if (err.message.includes("Failed to fetch")) {
        userFriendlyError =
          "Unable to connect to the server. Please check your internet connection and try again.";
      } else if (err.message.includes("HTTP 500")) {
        userFriendlyError = "Server error occurred. Please try again later.";
      } else if (err.message.includes("HTTP 404")) {
        userFriendlyError = "Service not found. Please contact support.";
      } else if (err.message.includes("password")) {
        userFriendlyError =
          "Please enter a valid password (at least 6 characters).";
      } else if (err.message.includes("email")) {
        userFriendlyError = "Please enter a valid email address.";
      } else if (err.message.includes("name")) {
        userFriendlyError = "Please enter your full name.";
      }

      setError(userFriendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return setError("No email available for resending");

    console.log("Starting resend verification email...");
    console.log("BASE_URL:", BASE_URL);
    console.log("Request URL:", `${BASE_URL}/user/resend-verification`);
    console.log("Request body:", { email });

    try {
      const res = await fetch(`${BASE_URL}/user/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      console.log("Resend response status:", res.status);
      console.log("Resend response headers:", res.headers);

      if (!res.ok) {
        const errorText = await res.text();
        console.log("Resend error response text:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "Resend failed");
        } catch (parseError) {
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
      }

      const data = await res.json();
      console.log("Resend success response:", data);
      setMessage(data.message || "Verification email resent successfully!");
    } catch (err) {
      console.error("Resend error:", err);
      let userFriendlyError = err.message;

      if (err.message.includes("user not found")) {
        userFriendlyError =
          "No account found with this email. Please register first.";
      } else if (err.message.includes("already verified")) {
        userFriendlyError =
          "This account is already verified. Please try logging in instead.";
      } else if (err.message.includes("Failed to fetch")) {
        userFriendlyError =
          "Unable to resend email. Please check your internet connection and try again.";
      }

      setError(`Resend failed: ${userFriendlyError}`);
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
        Create Account
      </h1>
      <form
        onSubmit={handleRegister}
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
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            placeholder="Create a password (at least 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="input"
          />
        </div>
        <button
          type="submit"
          className="btn"
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      {email && (
        <button
          onClick={handleResend}
          className="btn"
          style={{ marginTop: 16, background: "#4a5568" }}
        >
          Resend Verification Email
        </button>
      )}
      {message && <div className="message success">{message}</div>}
      {error && (
        <div className="message error">
          <strong>Registration Error:</strong> {error}
          <br />
          <small>Please check your information and try again.</small>
        </div>
      )}
      <div style={{ textAlign: "center", marginTop: 20, color: "#4a5568" }}>
        Already have an account?{" "}
        <a
          href="/login"
          style={{ color: "#667eea", textDecoration: "none", fontWeight: 600 }}
        >
          Sign in
        </a>
      </div>
    </div>
  );
}

export default RegisterPage;
