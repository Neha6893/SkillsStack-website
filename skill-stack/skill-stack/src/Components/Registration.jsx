import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import SkillStackService from "../service/SkillStackService";

function Registration({ handleClose }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const { setUser } = useContext(UserContext);

  let dumy = {
    "name":name,
    "mail":mail,
    "passwordHash":passwordHash,
    "phoneno":phoneno,
    "points":25
  }
  const handleRegister = (e) => {
    e.preventDefault();
    setUser(dumy); // ✅ store user
    SkillStackService.saveUser(dumy);
    handleClose(); // close popup
    navigate("/list"); // go to list page
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative flex flex-col gap-3">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="number"
            placeholder="Phone No"
            value={phoneno}
            onChange={(e) =>setPhoneno(e.target.value)}
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={passwordHash}
            onChange={(e) => setPasswordHash(e.target.value)}
            className="p-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
