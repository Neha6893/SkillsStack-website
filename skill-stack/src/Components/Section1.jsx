import React, { useState, useContext } from "react";
import bgImage from "../ourResource/bgImage1.webp";
import useful from "../ourResource/useful.avif";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import DirectPopup from "./directpopup";

const Section1 = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // Controls showing the popup
  const [showLogin, setShowLogin] = useState(false);
  const [redirectTo, setRedirectTo] = useState("");

  // Handles opening popup or navigating if logged in
  const handleClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      setRedirectTo(path);
      setShowLogin(false);          // reset first
      setTimeout(() => setShowLogin(true), 1); // reopen popup reliably
    }
  };

  return (
    <section>
      <div
        className="flex items-center justify-center min-h-96 w-full bg-slate-600 bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${bgImage})`, zIndex: 0 }}
      >
        <div className="p-14 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            Stack Your Skills, Shape Your Future.
          </h2>
          <p className="text-lg md:text-xl mb-10">
            Find every syllabus PDF you need—organized, accessible, and ready to
            guide your learning journey.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleClick("/all")}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold"
            >
              Browse Notes
            </button>
            <button
              onClick={() => handleClick("/upload")}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-6 py-3 rounded-lg font-semibold"
            >
              Upload Notes
            </button>
          </div>
        </div>
        <div className="flex items-center max-w-xl">
          <img src={useful} alt="sideimage" className="h-96" />
        </div>
      </div>

      {/* Show popup if user not logged in */}
      {showLogin && (
        <DirectPopup
          redirectTo={redirectTo}
          onClose={() => setShowLogin(false)}
          key={redirectTo} // forces remount each time user clicks
        />
      )}
    </section>
  );
};

export default Section1;
