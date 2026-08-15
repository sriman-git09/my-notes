import React, { useContext } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen/SplashScreen";

import Home from "./pages/Home";
import Createnote from "./pages/Createnote";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import { NoteContext } from "./context/NoteContext";

function App() {
  const location = useLocation();
  const { loading, isAuthenticated } = useContext(NoteContext);

  const PrivateRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-400">Checking authentication...</p>
        </div>
      );
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  // Pages where Navbar & Footer should be hidden
  const hideLayout = [
    "/",
    "/login",
    "/forgot-password",
    "/reset-password",
  ].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">

      {!hideLayout && <Navbar />}

      <main className="flex-1">

        <Routes>

          {/* Splash Screen */}
          <Route path="/" element={<SplashScreen />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Main Application */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute><Createnote /></PrivateRoute>} />

        </Routes>

      </main>

      {!hideLayout && <Footer />}

    </div>
  );
}

export default App;