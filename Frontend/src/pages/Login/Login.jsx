import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { signupUser, loginUser } from "../../api/authApi";
import { NoteContext } from "../../context/NoteContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { setAuthToken, loading, isAuthenticated } = useContext(NoteContext);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  // States for animation and form handling
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  // 👇 Add these lines here
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Password validation: 8-10 chars, at least 1 upper, 1 lower, 1 digit, 1 special, no spaces
  const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}/;

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  // Signup Form State
  const [signupData, setSignupData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  // Initialize local storage database
  useEffect(() => {
  const handleContextMenu = (e) => e.preventDefault();

  const handleKeyDown = (e) => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
      (e.ctrlKey && ["U", "S"].includes(e.key))
    ) {
      e.preventDefault();
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "This action is disabled!",
      });
    }
  };

  document.addEventListener("contextmenu", handleContextMenu);
  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("contextmenu", handleContextMenu);
    document.removeEventListener("keydown", handleKeyDown);
  };
}, []);

  // Handle Input Changes
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

 

  // Handle Signup Submit
  const handleSignup = async (e) => {
  e.preventDefault();

  const { fullname, email, password, confirmPassword } = signupData;

  if (password !== confirmPassword) {
    return showError("Passwords do not match.");
  }

  if (!passwordRegex.test(password)) {
    return showError("Password must be 8-10 characters, include uppercase, lowercase, number, special character and no spaces.");
  }

  try {
    const data = await signupUser({
      fullname,
      email,
      password,
    });

    Swal.fire({
      icon: "success",
      title: "Success",
      text: data.message,
      confirmButtonColor: "#3085d6",
    });

    setSignupData({
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setIsRightPanelActive(false);
  } catch (err) {
    showError(err.response?.data?.message || "Signup failed");
  }
};

  // Handle Login Submit
  const handleLogin = async (e) => {
  e.preventDefault();

  if (!passwordRegex.test(loginData.password)) {
    return showError("Password must be 8-10 characters and cannot contain spaces.");
  }

  try {
    const data = await loginUser(loginData);

    setAuthToken(data.token);

    Swal.fire({
      icon: "success",
      title: "Success",
      text: data.message,
      confirmButtonColor: "#3085d6",
    }).then(() => {
  setLoginData({
    email: "",
    password: "",
  });

  navigate("/home");
});
  } catch (err) {
    showError(err.response?.data?.message || "Login failed");
  }
};

 
  const showError = (msg) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: msg,
      confirmButtonColor: "#d33",
    });
  };

  return (
    <div className="login-page-body">
      <div className={`login-container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
        
        {/* Signup Form */}
        <div className="login-form-container login-sign-up">
          <form onSubmit={handleSignup}>
            <h1>Create Account</h1>
            
            <input type="text" name="fullname" value={signupData.fullname} onChange={handleSignupChange} placeholder="Full Name" required />
            <input type="email" name="email" value={signupData.email} onChange={handleSignupChange} placeholder="Email" required />
            
            <div className="password-wrapper">
              <input maxLength={10} type={showSignupPassword ? "text" : "password"} name="password" value={signupData.password} onChange={handleSignupChange} placeholder="Password" required />
              <span onClick={() => setShowSignupPassword(!showSignupPassword)} className="eye-icon">
                <i className={`fa-solid ${showSignupPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>

            <div className="password-wrapper">
              <input maxLength={10} type={showSignupConfirmPassword ? "text" : "password"} name="confirmPassword" value={signupData.confirmPassword} onChange={handleSignupChange} placeholder="Confirm Password" required />
              <span onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)} className="eye-icon">
                <i className={`fa-solid ${showSignupConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>

            

            <button type="submit">Create Account</button>
          </form>
        </div>

        {/* Login Form */}
        <div className="login-form-container login-sign-in">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <input type="email" name="email" value={loginData.email} onChange={handleLoginChange} placeholder="Email" required />
            
            <div className="password-wrapper">
              <input maxLength={10} type={showLoginPassword ? "text" : "password"} name="password" value={loginData.password} onChange={handleLoginChange} placeholder="Password" required />
              <span onClick={() => setShowLoginPassword(!showLoginPassword)} className="eye-icon">
                <i className={`fa-solid ${showLoginPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>

            <Link to="/forgot-password" style={{ marginTop: '10px' }}>Forgot Password?</Link>
            
            <button type="submit" style={{ marginTop: '15px' }}>Proceed</button>
          </form>
        </div>

        {/* Sliding Overlays */}
        <div className="login-overlay-container">
          <div className="login-overlay">
            <div className="login-overlay-panel login-overlay-left">
              <h1>Hello, User!</h1>
              <p>Enter your details and start your journey with us</p>
              <button className="ghost" type="button" onClick={() => setIsRightPanelActive(false)}><span>Login</span></button>
            </div>
            <div className="login-overlay-panel login-overlay-right">
              <h1>Welcome Back!</h1>
              <p>To stay connected, login with your personal info</p>
              <button className="ghost" type="button" onClick={() => setIsRightPanelActive(true)}><span>Sign Up</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;