import React, { useState, useEffect } from "react";
import logo from "../ourResource/logo.svg";
import { useNavigate } from "react-router-dom";
import ISUserLogged from "./IsUserLogged";
import { Flame } from "lucide-react";
import DirectPopup from "./directpopup";

const Nav = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  );
  const [showLogin, setShowLogin] = useState(false);
  const [redirectTo, setRedirectTo] = useState("");

  // ✅ FIX: sync user state with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLinkClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      setShowLogin(false);
      setRedirectTo(path);
      setTimeout(() => setShowLogin(true), 10);
    }
  };

  return (
    <div className="flex h-20 p-4 mb-2 items-center justify-around bg-yellow-200 shadow-lg sticky">
      <img
        src={logo}
        alt="logo"
        className="h-16 w-45 ml-14 cursor-pointer"
        onClick={() => navigate("/")}
      />

      <div className="first-div font-semibold space-x-4 ml-auto pr-5 text-lg md:text-lg">
        <button className="hover:text-blue-500" onClick={() => navigate("/")}>
          Home
        </button>
        <button
          className="hover:text-blue-500"
          onClick={() => handleLinkClick("/all")}
        >
          Browse Notes
        </button>
        <button
          className="hover:text-blue-500"
          onClick={() => handleLinkClick("/upload")}
        >
          Upload Notes
        </button>
        <button
          className="hover:text-blue-500"
          onClick={() => navigate("/about")}
        >
          About Us
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <button className="flex items-center gap-1 text-orange-600 font-bold text-lg bg-orange-100 px-3 py-1 rounded-full">
          <Flame size={24} className="fill-orange-500 stroke-yellow-500" />
          {user?.points || 0}
        </button>
        <ISUserLogged />
      </div>

      {showLogin && (
        <DirectPopup redirectTo={redirectTo} onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
};

export default Nav;
