import React from "react";
import { useParams, useNavigate ,useLocation} from "react-router-dom";
import Nav from "./Nav";
import pdf from "./AllNotes/NotesPDF/NehaMarathe.pdf"
// helper function
import axios from "axios";


async function handleDownload(note) {
  try {
    const noteId = note.noteId ?? note.id; // handle either field
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `http://localhost:9090/api/notes/user/download/${noteId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
        validateStatus: () => true // ✅ always resolve (no auto-throw)
      }
    );
    // 🔹 If backend returned 403 (not enough points)
    if (res.status === 403) {
      // try to read the error message (backend sends "Not enough points...")
      const text = await res.data.text?.() || "Not enough points to download this note";
      alert(text);//change this code too add points upload notes
      return;
    }

    // 🔹 If file not found
    if (res.status === 404) {
      alert("File not found on server");
      return;
    }
     

    // try to parse filename from header
    const disposition = res.headers["content-disposition"] || res.headers["Content-Disposition"];
    let filename = null;

    if (disposition) {
      // common patterns: filename="name.ext" or filename*=UTF-8''name.ext
      const filenameRegex = /filename\*=(?:UTF-8'')?([^;]+)|filename="([^"]+)"|filename=([^;]+)/i;
      const matches = filenameRegex.exec(disposition);
      if (matches) {
        filename = decodeURIComponent(matches[1] || matches[2] || matches[3]).replace(/["']/g, "");
      }
    }

    // fallback to note.fileName or a default
    if (!filename) filename = note.fileName ?? note.fileName ?? `download-${noteId}.bin`;

    // create blob link
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);


  } catch (err) {
    console.error("Download error:", err);
    const msg = err.response?.data ? String(err.response.data) : "Download failed";
    alert(msg);
  }
}

 

function NoteDetails() {
  const { state } = useLocation();
   const navigate = useNavigate();
  const note = state?.note;

  if (!note) return <p>No note found</p>;
//  const note = notes.find((n) => n.id.toString() === id);
  return (
    <>
      <Nav />
      <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-lg hover:shadow-lg">
        <h2 className="text-3xl font-bold mb-4">{note.title}</h2>
        <p className="text-gray-600 mb-2">Subject: {note.subject}</p>
        <p className="text-gray-600 mb-2">Points: {note.pointsRequired}</p>
       
        <div className="flex gap-4">
         
<button
  onClick={() => handleDownload(note)}
  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
>
  Download
</button>


          <button
            onClick={() => navigate("/list")}
            className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400"
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
}

export default NoteDetails;
