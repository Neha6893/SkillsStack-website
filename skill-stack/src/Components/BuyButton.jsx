import React, { useState } from "react";
import SkillStackService from "../service/SkillStackService";

const BuyButton = ({ note, user }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuy = async () => {
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      setError("Failed to load Razorpay SDK.");
      setLoading(false);
      return;
    }

    const result = await SkillStackService.makeRazorpayPayment(
      note.pointsRequired, // Use note price (or pointsRequired)
      token,
      note.noteId,
      user?.mail
    );

    setLoading(false);

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        className={`mt-5 w-full text-white py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
        }`}
      >
        {loading ? "Processing..." : `Buy ₹${note.pointsRequired}`}
      </button>
      {error && <p className="text-red-600 mt-2 text-center font-medium">{error}</p>}
    </div>
  );
};

export default BuyButton;
