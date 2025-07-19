import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

function VerifyPage() {
  const { mailToken } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!mailToken) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    const verifyEmail = async () => {
      try {
        console.log("Verifying email with token:", mailToken);
        const res = await fetch(`${BASE_URL}/user/verify/${mailToken}`);

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }

        const data = await res.json();
        setStatus("success");
        setMessage(data.message || "Email verified successfully!");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage(err.message || "Verification failed");
      }
    };

    verifyEmail();
  }, [mailToken, navigate]);

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
        Email Verification
      </h1>

      {status === "verifying" && (
        <div
          className="loading"
          style={{ textAlign: "center", fontSize: 18, color: "#4a5568" }}
        >
          Verifying your email...
        </div>
      )}

      {status === "success" && (
        <div className="message success">
          <strong>Success!</strong> {message}
          <br />
          <small>Redirecting to login page...</small>
        </div>
      )}

      {status === "error" && (
        <div className="message error">
          <strong>Error:</strong> {message}
          <br />
          <small>Please try registering again or contact support.</small>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <a href="/login" className="nav-link">
          Go to Login
        </a>
      </div>
    </div>
  );
}

export default VerifyPage;
