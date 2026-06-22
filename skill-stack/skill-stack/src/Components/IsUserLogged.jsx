import React, { useState, useEffect, useContext } from "react";
import { UserCircle } from "lucide-react";
import UserLogin from "./UserLogin";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext"; // ✅ import new context

function ISUserLogged() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditProfile = () => {
    setIsOpen(false);
    navigate("/profile");
  };

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <div className="flex justify-end p-4 relative">
      {user ? (
        <div className="relative">
          <UserCircle
            className="w-8 h-8 text-blue-500 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200">
              <ul className="py-2">
                <li
                  onClick={handleEditProfile}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Edit Profile
                </li>
                <li
                  onClick={()=>navigate("/list")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  My Notes
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                  onClick={() => {
                    setUser(null);
                    setIsOpen(false);
                    localStorage.removeItem("user");
                    navigate("/");
                  }}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <UserLogin />
      )}
    </div>
  );
}

export default ISUserLogged;
