import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./SplashScreen.css";

import hero from "../../assets/hero.png";

const SplashScreen = () => {
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => navigate("/login"),
    });

    gsap.set(logoRef.current, {
      opacity: 0,
      scale: 0.7,
    });

    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "back.out(1.7)",
    });

    tl.to({}, { duration: 1 });

    tl.to(logoRef.current, {
      scale: 1.1,
      filter: "drop-shadow(0 0 20px rgba(0,119,255,.4))",
      duration: 0.4,
    });

    tl.to(containerRef.current, {
      scale: 4,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
    });

    return () => tl.kill();
  }, [navigate]);

  return (
    <div className="splash-container" ref={containerRef}>
      <img
        ref={logoRef}
        src={hero}
        alt="Note Keeper"
        className="logo-image"
      />
    </div>
  );
};

export default SplashScreen;