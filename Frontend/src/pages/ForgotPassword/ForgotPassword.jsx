import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { forgotPassword } from "../../api/authApi";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Swal.fire({ icon: "error", title: "Invalid email", text: "Please enter a valid email address.", confirmButtonColor: "#1d3557" });
      return;
    }

    setLoading(true);

    forgotPassword({ email })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "If an account exists",
          text: `If an account exists for this email, a password reset link has been sent. When you reset your password, it must be 8-10 characters, include an uppercase letter, a lowercase letter, a number and a special character, and cannot contain spaces.`,
          confirmButtonColor: "#1d3557",
        });

        setEmail("");
      })
      .catch(() => {
        Swal.fire({ icon: "error", title: "Error", text: "Unable to process request. Please try again later.", confirmButtonColor: "#1d3557" });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="forgot-page">
      <div className="container">
        <div className="icon">
          <i className="fas fa-lock"></i>
        </div>

        <h2>Forgot Password?</h2>

        <p>
          Enter your registered email address.
          <br />
          We'll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <i className="fas fa-envelope"></i>
          </div>

          <div className="password-policy">
              <h4>Password requirements</h4>
              <ul>
                <li>8-10 characters</li>
                <li>At least one uppercase letter (A-Z)</li>
                <li>At least one lowercase letter (a-z)</li>
                <li>At least one number (0-9)</li>
                <li>At least one special character (@$!%*?&)</li>
                <li>No spaces allowed</li>
              </ul>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <Link to="/" className="back">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;