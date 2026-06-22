import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav";
import SkillStackService from "../../service/SkillStackService";

function UserProfile() {
// const { user, setUser } = useState("");
  const navigate = useNavigate();
 
let user=JSON.parse(localStorage.getItem("user"));
  const [name, setName] = useState(user?.name || "");
  const [mail, setMail] = useState(user?.mail || "");
  const [phoneno, setPhoneno] = useState(user?.phoneno || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

console.log("User in profile:", user);
  return (
    <>
      <Nav />
      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>

        {/* Profile Picture */}
        <div className="flex items-center gap-6 mb-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-green-400 flex items-center justify-center text-white text-3xl font-bold">
              {user?.name ? user.name[0].toUpperCase() : "N"}
            </div>
            <button className="absolute bottom-0 right-0 bg-gray-300 rounded-full p-1 text-sm hover:bg-gray-400">
              📷
            </button>
          </div>
          <div>
            <p className="font-semibold text-lg">
              {user?.name || "Guest User"}
            </p>
            <p className="text-gray-500">
              {user?.mail || "No email available"}
            </p>
          </div>
        </div>

        {/* Update Profile */}
        <h3 className="text-lg font-semibold mb-3">Update Profile Details</h3>
        <form
          className="space-y-4 mb-10"
          onSubmit={async (e) => {
            e.preventDefault();
           //setUser({ ...user, name, mail, phoneno });
           console.log("after update:", { name, mail, phoneno });
        localStorage.setItem(
              "user",
              JSON.stringify({ ...user, name, mail, phoneno })
            );
            user=JSON.parse(localStorage.getItem("user"));
          
            const token = localStorage.getItem("token");
            await SkillStackService.updateUser(user, token)
              .then((data) => console.log("Updated:", data))
              .catch((err) => console.error(err));

            alert("Profile updated successfully ✅");
          }}
        >
          <input
            type="text"
            value={name||""}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full border p-3 rounded-lg"
          />
          <input
            type="email"
            value={user?.mail || ""}
            readOnly
            placeholder="Email"
            className="w-full border p-3 rounded-lg"
          />
          <span className="text-sm text-gray-500 mx-3 hover:text-gray-700">
            email can't be changed
          </span>
          <input
            type="text"
            value={phoneno}
            onChange={(e) => setPhoneno(e.target.value)}
            placeholder="Mobile"
            className="w-full border p-3 rounded-lg"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </form>

        {/* Delete Profile */}
        <h3 className="text-lg font-semibold mb-3">Delete Profile</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={deleteConfirm}
              onChange={() => setDeleteConfirm(!deleteConfirm)}
            />
            I agree to delete my profile
          </label>
          <button
            disabled={!deleteConfirm}
            className={`px-6 py-2 rounded-lg ${
              deleteConfirm
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => {
             // setUser(null);
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              alert("Profile deleted ❌");
              navigate("/");
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
