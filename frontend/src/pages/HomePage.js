import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config";

function HomePage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    console.log("Fetching from:", `${BASE_URL}/message/answered`);

    fetch(`${BASE_URL}/message/answered`)
      .then((res) => {
        console.log("Response status:", res.status);
        console.log("Response headers:", res.headers);

        if (!res.ok) {
          return res.text().then((text) => {
            console.log("Error response text:", text);
            throw new Error(`HTTP ${res.status}: ${text}`);
          });
        }

        return res.json();
      })
      .then((data) => {
        console.log("Success response:", data);
        setQuestions(data.messages || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        let userFriendlyError = err.message;

        if (err.message.includes("Failed to fetch")) {
          userFriendlyError =
            "Unable to load questions. Please check your internet connection and try again.";
        } else if (err.message.includes("HTTP 500")) {
          userFriendlyError = "Server error occurred. Please try again later.";
        } else if (err.message.includes("HTTP 404")) {
          userFriendlyError = "Service not found. Please contact support.";
        }

        setError(userFriendlyError);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="card">
        <h1
          style={{
            fontSize: 32,
            marginBottom: 24,
            color: "#2d3748",
            textAlign: "center",
          }}
        >
          Answered Questions
        </h1>
        <div
          className="loading"
          style={{ textAlign: "center", fontSize: 18, color: "#4a5568" }}
        >
          Loading questions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h1 style={{ fontSize: 32, marginBottom: 24, color: "#2d3748" }}>
          Answered Questions
        </h1>
        <div className="message error">
          <strong>Loading Error:</strong> {error}
          <br />
          <small>Please refresh the page or try again later.</small>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h1
        style={{
          fontSize: 32,
          marginBottom: 24,
          color: "#2d3748",
          textAlign: "center",
        }}
      >
        Answered Questions
      </h1>
      {questions.length === 0 && (
        <div style={{ textAlign: "center", color: "#888", fontSize: 18 }}>
          <p>No answered questions yet.</p>
          <p style={{ marginTop: 8 }}>Be the first to ask a question!</p>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {questions.map((q, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 24,
              background: "#f9fafb",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
            }}
          >
            <div
              style={{
                fontWeight: 600,
                color: "#4a5568",
                fontSize: 18,
                marginBottom: 12,
              }}
            >
              Q: {q.question || q.message}
            </div>
            <div style={{ color: "#2b6cb0", fontSize: 16, lineHeight: 1.6 }}>
              <strong>A:</strong> {q.answer ? q.answer : "Not answered yet."}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
