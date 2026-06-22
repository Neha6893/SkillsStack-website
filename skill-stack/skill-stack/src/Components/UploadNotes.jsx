import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import SkillStackService from "../service/SkillStackService";

function UploadNotes() {
  const { user ,setUser} = useContext(UserContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [points, setPoints] = useState("");
  const [file, setFile] = useState([]);

  // history of uploads (store in localStorage for now)
  const handleSubmit =async (e) => {
   /* e.preventDefault();

    if (!user) {
      alert("You must be logged in to upload notes.");
      navigate("/UserLogin");
      return;
    }

    const newNote = {
      id: Date.now(),
      title,
      subject,
      points,
      fileName: file[0] || "No file selected",
      uploadedBy: user.name,
    };
    console.log(newNote);

    // get old uploads
    const oldNotes = JSON.parse(localStorage.getItem("uploads")) || [];
    const updatedNotes = [...oldNotes, newNote];
    localStorage.setItem("uploads", JSON.stringify(updatedNotes));

    alert("✅ Note uploaded successfully!");
    navigate("/list"); // redirect to notes list
    */


 e.preventDefault();

    if (!user) {
      alert("You must be logged in to upload notes.");
      navigate("/UserLogin");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // get JWT token
      console.log("Using token:", token);
      // build FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subject", subject);
      formData.append("pointsRequired", points);
      for (let i = 0; i < file.length; i++) {
        formData.append("files", file[i]); // multiple files supported
      }

      let data= await SkillStackService.uploadNotes(formData,token)
       
       
      console.log(data.points);
      localStorage.setItem("user",JSON.stringify({...user,"points":data.points}));
      setUser(JSON.parse(localStorage.getItem("user")));
      
      alert("✅ Note uploaded successfully!");
      navigate("/list");

    } catch (err) {
      console.error("Error uploading note:", err);
      alert("❌ Failed to upload note");
    }


  };

  return (
    <>
      <Nav />
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Upload Notes</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full border px-4 py-2 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Subject"
            className="w-full border px-4 py-2 rounded-lg"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Points"
            className="w-full border px-4 py-2 rounded-lg"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            required
          />
          <input
            type="file"
            className="w-full"
            onChange={(e) => setFile(e.target.files)}
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
          >
            Upload
          </button>
        </form>
      </div>
    </>
  );
}

export default UploadNotes;
