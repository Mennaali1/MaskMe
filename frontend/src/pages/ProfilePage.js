import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config";

function ProfilePage() {
  const [messages, setMessages] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);
  const [questionsForMe, setQuestionsForMe] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(
      "ProfilePage - Token from localStorage:",
      token ? "Present" : "Missing"
    );
    // Removed token value logging for security

    if (!token) {
      setError("You must be logged in to view your profile.");
      setLoading(false);
      return;
    }
    setLoading(true);

    // Fetch user's messages (questions they've asked)
    fetch(`${BASE_URL}/user/profile`, {
      headers: { token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        if (data.messages) setMessages(data.messages);
        else setError(data.message || "Failed to fetch messages");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        let userFriendlyError = err.message;

        if (err.message.includes("Failed to fetch")) {
          userFriendlyError =
            "Unable to load your profile. Please check your internet connection and try again.";
        } else if (err.message.includes("Invalid token")) {
          userFriendlyError = "Your session has expired. Please log in again.";
        } else if (err.message.includes("HTTP 500")) {
          userFriendlyError = "Server error occurred. Please try again later.";
        }

        setError(userFriendlyError);
        setLoading(false);
      });

    // Fetch user-specific questions from the new endpoint
    console.log(
      "Fetching user questions from:",
      `${BASE_URL}/message/user-questions`
    );
    console.log("Token:", token ? "Present" : "Missing");
    // Removed request headers logging for security

    fetch(`${BASE_URL}/message/user-questions`, {
      headers: { token },
    })
      .then((res) => {
        console.log("User questions response status:", res.status);

        if (!res.ok) {
          return res.text().then((text) => {
            console.log("User questions error response:", text);
            throw new Error(`HTTP ${res.status}: ${text}`);
          });
        }

        return res.json();
      })
      .then((data) => {
        console.log("User questions success response:", data);
        if (data.questions) {
          console.log("Setting user questions:", data.questions);
          setUserQuestions(data.questions);
        } else {
          console.log("No questions found in response");
          setUserQuestions([]);
        }
      })
      .catch((err) => {
        console.error("User questions fetch error:", err);
        // Don't set error here as it's not critical for the main profile
        setUserQuestions([]); // Set empty array on error
      });

    // Fetch questions sent to this user
    fetch(`${BASE_URL}/message/questions-for-me`, {
      headers: { token },
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(`HTTP ${res.status}: ${text}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.questions) {
          setQuestionsForMe(data.questions);
        }
      })
      .catch((err) => {
        console.error("Questions for me fetch error:", err);
        setQuestionsForMe([]);
      });
  }, []);

  const handleAnswer = async (questionId, answer) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setAnswering((prev) => ({ ...prev, [questionId]: true }));

    try {
      const res = await fetch(`${BASE_URL}/message/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ questionId, answer }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to answer question");
      }

      // Update the local state to show the answer
      setQuestionsForMe((prev) =>
        prev.map((q) =>
          q._id === questionId ? { ...q, answer, status: "answered" } : q
        )
      );
    } catch (err) {
      console.error("Answer question error:", err);
      alert("Failed to submit answer. Please try again.");
    } finally {
      setAnswering((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h1 style={{ fontSize: 32, color: "#2d3748" }}>
            Your Private Profile
          </h1>
        </div>
        <div
          className="loading"
          style={{ textAlign: "center", fontSize: 18, color: "#4a5568" }}
        >
          Loading your profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 style={{ color: "#2d3748", marginBottom: 16 }}>Profile</h2>
        <div className="message error">{error}</div>
        <div style={{ marginTop: 20 }}>
          <Link to="/login" className="nav-link" style={{ marginRight: 10 }}>
            Login
          </Link>{" "}
          or{" "}
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 32, color: "#2d3748" }}>Your Private Profile</h1>
      </div>

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
          <strong>🔒 Private & Anonymous:</strong> This is your personal space
          to track your questions. Your identity remains anonymous when asking
          questions.
        </p>
      </div>

      {/* Questions Sent to You Section */}
      <h2 style={{ fontSize: 24, color: "#4a5568", marginBottom: 16 }}>
        Questions for You
      </h2>
      {questionsForMe.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: "#888",
            fontSize: 18,
            marginBottom: 32,
          }}
        >
          <p>No questions have been sent to you yet.</p>
          <p style={{ marginTop: 8 }}>
            When someone asks you a question, it will appear here!
          </p>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginBottom: 32,
        }}
      >
        {questionsForMe.map((q, i) => (
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
              Q: {q.question}
            </div>
            {q.answer ? (
              <div style={{ color: "#2b6cb0", fontSize: 16, lineHeight: 1.6 }}>
                <strong>A:</strong> {q.answer}
              </div>
            ) : (
              <div style={{ marginTop: 16 }}>
                <textarea
                  placeholder="Write your answer here..."
                  rows={3}
                  className="input"
                  style={{ width: "100%", marginBottom: "8px" }}
                  id={`answer-${q._id}`}
                />
                <button
                  onClick={() => {
                    const answer = document.getElementById(
                      `answer-${q._id}`
                    ).value;
                    if (answer.trim()) {
                      handleAnswer(q._id, answer.trim());
                    }
                  }}
                  disabled={answering[q._id]}
                  className="btn"
                  style={{ fontSize: "14px", padding: "8px 16px" }}
                >
                  {answering[q._id] ? "Submitting..." : "Submit Answer"}
                </button>
              </div>
            )}
            {q.createdAt && (
              <div style={{ fontSize: 14, color: "#718096", marginTop: 8 }}>
                Asked on: {new Date(q.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User's Messages Section */}
      <h2 style={{ fontSize: 24, color: "#4a5568", marginBottom: 16 }}>
        Your Messages
      </h2>
      {messages.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: "#888",
            fontSize: 18,
            marginBottom: 32,
          }}
        >
          <p>No messages yet.</p>
          <p style={{ marginTop: 8 }}>Start by asking a question!</p>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginBottom: 32,
        }}
      >
        {messages.map((msg, i) => (
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
              Message: {msg.question || msg.message}
            </div>
            {msg.answer && (
              <div style={{ color: "#2b6cb0", fontSize: 16, lineHeight: 1.6 }}>
                <strong>Answer:</strong> {msg.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User's Questions History Section */}
      <h2 style={{ fontSize: 24, color: "#4a5568", marginBottom: 16 }}>
        Your Questions History
      </h2>
      {userQuestions.length === 0 && (
        <div style={{ textAlign: "center", color: "#888", fontSize: 18 }}>
          <p>You haven't asked any questions yet.</p>
          <p style={{ marginTop: 8 }}>
            Go to the Ask page to submit your first question!
          </p>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {userQuestions.map((q, i) => (
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
              Q: {q.question}
            </div>
            <div style={{ color: "#2b6cb0", fontSize: 16, lineHeight: 1.6 }}>
              <strong>A:</strong> {q.answer ? q.answer : "Not answered yet."}
            </div>
            <div style={{ fontSize: 14, color: "#718096", marginTop: 8 }}>
              <div>Asked to: {q.targetEmail}</div>
              {q.createdAt && (
                <div>
                  Asked on: {new Date(q.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
