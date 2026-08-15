import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { resetPassword, validateResetToken } from "../../api/authApi";
import "./ResetPassword.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        Swal.fire({ icon: "error", title: "Invalid link", text: "No token provided." });
        setValidating(false);
        return;
      }

      try {
        await validateResetToken(token);
        setIsTokenValid(true);
      } catch (err) {
        const msg = err?.response?.data?.message || "Invalid or expired token";
        Swal.fire({ icon: "error", title: "Error", text: msg });
        setIsTokenValid(false);
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isTokenValid) {
      Swal.fire({ icon: "error", title: "Invalid link", text: "The reset link is invalid or has expired." });
      return;
    }

    if (!passwordRegex.test(password)) {
      Swal.fire({ icon: "error", title: "Invalid password", text: "Password does not meet requirements." });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({ icon: "error", title: "Mismatch", text: "Passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      await resetPassword({ token, password });

      Swal.fire({ icon: "success", title: "Password reset", text: "Your password has been updated. Redirecting to login..." });
      setPassword("");
      setConfirmPassword("");

      // Auto-redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      const msg = err?.response?.data?.message || "Unable to reset password. The link may be invalid or expired.";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="container">
        <h2>Reset Password</h2>

        {validating ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Validating reset link...</p>
          </div>
        ) : isTokenValid ? (
          <>
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <div className="input-box">
                <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
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

              <button type="submit" disabled={loading}>{loading ? "Saving..." : "Reset Password"}</button>
            </form>

            <Link to="/login" className="back">← Back to Login</Link>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p style={{ color: "#ff6b6b" }}>The reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className="back">← Request a new reset link</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
