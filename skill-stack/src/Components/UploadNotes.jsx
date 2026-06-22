import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import SkillStackService from "../service/SkillStackService";
import Footer from "./main_footer";
function UploadNotes() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [points, setPoints] = useState("");
  const [file, setFile] = useState([]); // store files as array

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to upload notes.");
      navigate("/UserLogin");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // get JWT token

      // build FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subject", subject);
      formData.append("pointsRequired", points);
      for (let i = 0; i < file.length; i++) {
        formData.append("files", file[i]); // multiple files supported
      }

      let data = await SkillStackService.uploadNotes(formData, token);

      // update localStorage and context
      localStorage.setItem("user", JSON.stringify({ ...user, points: data.points }));
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

      <div className="min-h-screen bg-gray-50 pt-16 pb-10 ">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl border border-gray-100">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Upload New Notes 📚
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="e.g., Advanced JavaScript Concepts"
                  className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Subject Input */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  id="subject"
                  placeholder="e.g., Computer Science - Front-End Development"
                  className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              {/* Points Input */}
              <div>
                <label htmlFor="points" className="block text-sm font-medium text-gray-700">
                  Points Required
                </label>
                <input
                  type="number"
                  id="points"
                  placeholder="e.g., 50 (Points users need to spend to download your notes)"
                  className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  required
                />
              </div>

              {/* File Input */}
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Files (PDF, Docs, Images)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-150 ease-in-out"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 014 4v2a4 4 0 00-4 4h-4zm-4 0a4 4 0 004 4h4m-4-4l-4 4m4-4l4 4"></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">Maximum 5 files (PDF, DOC, PNG, JPG)</p>
                    </div>
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => setFile(Array.from(e.target.files))} 
                      multiple 
                      required 
                    />
                  </label>
                </div>

                {/* Display selected file names */}
                {file.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>Selected files:</strong>
                    <ul className="list-disc list-inside">
                      {file.map((f, idx) => (
                        <li key={idx}>{f.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out mt-8"
              >
                Upload Notes
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UploadNotes;
