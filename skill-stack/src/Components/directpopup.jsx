import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Registration from "./Registration";
import { UserContext } from "./UserContext";
import SkillStackService from "../service/SkillStackService";
import PartyPopper from "./PartyPopper";

const DirectPopup = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(true); // ✅ show popup directly
  const [mail, setMail] = useState("");
  const [otp, setOtp] = useState("");
  const [step1, setStep1] = useState(true); // ✅ start at step 1
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  // Handlers
  const handleClose = () => {
    setIsOpen(false);
    setStep1(false);
    setIsOtpVisible(false);
    setIsButtonVisible(true);
    setIsVerifyOpen(false);
  };

  const handleRequest = (e) => {
    e.preventDefault();
    const data = SkillStackService.getOtp(mail);
    console.log(data);
    setIsOtpVisible(true);
    setIsVerifyOpen(true);
    setIsButtonVisible(false);
  };

  const handleVerify = async () => {
    try {
      const response = await SkillStackService.verifyOtp(mail, otp);

      console.log("Raw backend response:", response);
      if (!response.status) {
        alert("Invalid OTP, please try again.");
        navigate("/");
        handleClose();
        return;
      }

      setToken(response.token);
      localStorage.setItem("token", response.token);

      if (response.user.name == null) {
        await setUser({
          mail: response.user.mail,
          name: response.user.name,
          phoneno: response.user.phoneno,
          points: response.user.points,
        });
        await localStorage.setItem(
          "user",
          JSON.stringify({
            name: response.user.name,
            mail: response.user.mail,
            phoneno: response.user.phoneno,
            points: response.user.points,
          })
        );
        navigate("/profile");
      } else {
        await setUser({
          name: response.user.name,
          mail: response.user.mail,
          phoneno: response.user.phoneno,
          points: response.user.points,
        });
        await localStorage.setItem(
          "user",
          JSON.stringify({
            name: response.user.name,
            mail: response.user.mail,
            phoneno: response.user.phoneno,
            points: response.user.points,
          })
        );
        navigate("/");
      }

      alert("Login successful!");
      handleClose();
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      {/* ✅ no login button — directly show popup */}
      {isOpen && step1 && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">Enter Email</h2>

            <form onSubmit={handleRequest} className="flex flex-col gap-4">
              <input
                type="mail"
                required
                placeholder="Enter your phone number or email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                className="border p-3 rounded-lg w-full"
              />
              {isOtpVisible && (
                <div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="border p-3 rounded-lg w-full"
                  />
                </div>
              )}

              {isButtonVisible && (
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  Request OTP
                </button>
              )}
              {isVerifyOpen && (
                <button
                  type="button"
                  disabled={otp.length < 6}
                  onClick={handleVerify}
                  className={`py-2 rounded-lg w-full text-white 
                  ${
                    otp.length < 6
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  Verify OTP
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectPopup;
