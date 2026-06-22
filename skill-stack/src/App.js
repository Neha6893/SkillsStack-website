import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import NotesListing from "./Components/NotesListing";
import UserLogin from "./Components/UserLogin";
import UserProfile from "./Components/UserProfile/UserProfile";
import NoteDetails from "./Components/NotesDetails";
import UploadNotes from "./Components/UploadNotes";
import MyEarnings from "./Components/MyEarnings";
import AllNotesListing from "./Components/AllNotes";
import AboutUs from "./Components/Aboutus";
import React from "react";
import { UserProvider } from "./Components/UserContext"; // ✅ updated import

function App() {
  return (
    // ✅ wrap entire app inside UserProvider (handles user, token, logout)
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<NotesListing />} />
          <Route path="/UserLogin" element={<UserLogin />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/notes/:note" element={<NoteDetails />} />
          <Route path="/upload" element={<UploadNotes />} />
          <Route path="/all" element={<AllNotesListing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/my-earnings" element={<MyEarnings />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
