// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} Skill Stack. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <a href="/about" className="hover:text-white">About</a>
          <a href="/contact" className="hover:text-white">Contact</a>
          {/* other links */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
