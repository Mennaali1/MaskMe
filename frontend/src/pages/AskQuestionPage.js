import React, { useState } from "react";
import { BASE_URL } from "../config";

function AskQuestionPage() {
  const [question, setQuestion] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    // Get the authentication token
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to ask questions. Please log in first.");
      setSubmitting(false);
      return;
    }

    // Validate required fields
    if (!question.trim()) {
      setError("Please enter your question.");
      setSubmitting(false);
      return;
    }

    if (!targetEmail.trim()) {
      setError("Please enter the email of the person you want to ask.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/message/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          question: question.trim(),
          targetEmail: targetEmail.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit question");
      }

      const data = await res.json();
      if (data.message) {
        setMessage(
          `Question submitted successfully! It will be sent to ${
            data.targetUser || targetEmail
          }.`
        );
        setQuestion("");
        setTargetEmail("");
      }
    } catch (err) {
      console.error("Ask question error:", err);
      let userFriendlyError = err.message;

      if (err.message.includes("User with this email not found")) {
        userFriendlyError =
          "The email address you entered is not registered. Please check the email and try again.";
      } else if (
        err.message.includes("Question and target email are required")
      ) {
        userFriendlyError =
          "Please enter both your question and the email of the person you want to ask.";
      } else if (err.message.includes("Token is required")) {
        userFriendlyError =
          "You must be logged in to ask questions. Please log in first.";
      } else if (err.message.includes("Failed to fetch")) {
        userFriendlyError =
          "Unable to submit your question. Please check your internet connection and try again.";
      } else if (err.message.includes("HTTP 500")) {
        userFriendlyError = "Server error occurred. Please try again later.";
      } else if (err.message.includes("HTTP 400")) {
        userFriendlyError = "Please check your question and try again.";
      }

      setError(userFriendlyError);
    } finally {
      setSubmitting(false);
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
        Ask Someone a Question
      </h1>

      <div
        style={{
          background: "#f7fafc",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "24px",
          border: "1px solid #e2e8f0",
        }}
      >
        <p style={{ margin: 0, color: "#4a5568", fontSize: "14px" }}>
          <strong>💬 Anonymous Questions:</strong> Ask a specific person a
          question completely anonymously. They will receive your question and
          can answer it, but won't know who asked it.
        </p>
      </div>

      <form
        onSubmit={handleAsk}
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
            Who to Ask *
          </label>
          <input
            type="email"
            placeholder="Enter the email of the person you want to ask"
            value={targetEmail}
            onChange={(e) => setTargetEmail(e.target.value)}
            required
            className="input"
          />
          <small
            style={{
              color: "#718096",
              fontSize: "12px",
              marginTop: "4px",
              display: "block",
            }}
          >
            The person must be registered on this platform
          </small>
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
            Your Question *
          </label>
          <textarea
            placeholder="What would you like to ask?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            rows={4}
            className="input"
            style={{ resize: "vertical" }}
          />
        </div>

        <button
          type="submit"
          className="btn"
          disabled={submitting}
          style={{ opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Submitting..." : "Send Question"}
        </button>
      </form>
      {message && <div className="message success">{message}</div>}
      {error && (
        <div className="message error">
          <strong>Submission Error:</strong> {error}
          <br />
          <small>Please check your information and try again.</small>
        </div>
      )}
    </div>
  );
}

export default AskQuestionPage;
