import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Nav from "./Nav";
import axios from "axios";
import BuyButton from "./BuyButton";

async function handleDownload(note) {
  try {
    const noteId = note.noteId ?? note.id;
    console.log("Downloading note with ID:", noteId);
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `http://localhost:9090/api/notes/user/download/${noteId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
        validateStatus: () => true,
      }
    );
    if (res.status === 403) {
      alert("Not enough points! Please buy this note.");
      return;
    }
    if (res.status === 404) {
      console.log(res);
      alert("File not found on server");
      return;
    }

    const disposition =
      res.headers["content-disposition"] ||
      res.headers["Content-Disposition"];
    let filename = null;

    if (disposition) {
      const filenameRegex =
        /filename\*=(?:UTF-8'')?([^;]+)|filename="([^"]+)"|filename=([^;]+)/i;
      const matches = filenameRegex.exec(disposition);
      if (matches) {
        filename = decodeURIComponent(
          matches[1] || matches[2] || matches[3]
        ).replace(/["']/g, "");
      }
    }

    if (!filename) filename = note.fileName ?? `download-${noteId}.bin`;

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
    alert("Download failed");
  }
}

function NoteDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const note = state?.note;

  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Check purchase status initially
  useEffect(() => {
    const checkPurchase = async () => {
      if (!user || !note) return;
      try {
        const res = await axios.get(
          `http://localhost:9090/api/purchases/check?email=${user.mail}&noteId=${note.noteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAlreadyPurchased(res.data.purchased);
      } catch (err) {
        console.error("Purchase check error:", err);
      }
    };
    checkPurchase();
  }, [note, user, token]);

  if (!note) return <p>No note found</p>;

  return (
    <>
      <Nav />
      <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-lg hover:shadow-lg">
        <h2 className="text-3xl font-bold mb-4">{note.title}</h2>
        <p className="text-gray-600 mb-2">Subject: {note.subject}</p>
        <p className="text-gray-600 mb-2">Points Required: {note.pointsRequired}</p>

        <div className="flex gap-4 mt-6">
          {alreadyPurchased ? (
            <button
              onClick={() => handleDownload(note)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              View / Download
            </button>
          ) : user && note ? (
            user.points >= note.pointsRequired ? (
              <button
                onClick={() => handleDownload(note)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Download
              </button>
            ) : (
              <BuyButton
                note={note}
                user={user}
                // Pass callback to update state after purchase
                onPurchaseSuccess={() => setAlreadyPurchased(true)}
              />
            )
          ) : null}

          <button
            onClick={() => navigate("/all")}
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
