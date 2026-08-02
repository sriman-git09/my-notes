import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import SplashScreen from "./components/SplashScreen/SplashScreen";

import Home from "./pages/Home";
import Createnote from "./pages/Createnote";

import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import SplashScreen from "./components/SplashScreen/SplashScreen";

import Home from "./pages/Home";
import Createnote from "./pages/Createnote";

import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";

function App() {
  const location = useLocation();

  // Pages where Navbar & Footer should be hidden
  const hideLayout = [
    "/",
    "/login",
    "/forgot-password",
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

          {/* Main Application */}
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<Createnote />} />

        </Routes>

      </main>

      {!hideLayout && <Footer />}

    </div>
  );
}

export default App;