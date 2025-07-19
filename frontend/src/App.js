import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AskQuestionPage from "./pages/AskQuestionPage";
import VerifyPage from "./pages/VerifyPage";
import ProtectedRoute from "./components/ProtectedRoute";
// src/config.js

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status on app load and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener("storage", checkAuth);

    // Listen for custom events when user logs in/out
    window.addEventListener("userLogin", checkAuth);
    window.addEventListener("userLogout", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("userLogin", checkAuth);
      window.removeEventListener("userLogout", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("userLogout"));
    window.location.reload();
  };

  return (
    <Router>
      <nav className="nav">
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: "#667eea" }}
          >
            MaskMe
          </div>
          <div>
            {isLoggedIn && (
              <>
                <Link to="/" className="nav-link">
                  Home
                </Link>
                <Link to="/ask" className="nav-link">
                  Ask
                </Link>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="nav-link"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#4a5568",
                    fontWeight: 500,
                  }}
                >
                  Logout
                </button>
              </>
            )}
            {!isLoggedIn && (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" />
            ) : (
              <LoginPage setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" /> : <RegisterPage />}
        />
        <Route path="/verify/:mailToken" element={<VerifyPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ask"
          element={
            <ProtectedRoute>
              <AskQuestionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
