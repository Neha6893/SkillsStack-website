import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import NotesListing from "./Components/NotesListing";
import UserLogin from "./Components/UserLogin";
import UserProfile from "./Components/UserProfile/UserProfile";
import { UserContext } from "./Components/UserContext"; 
import React, { useState } from "react";
import NoteDetails from "./Components/NotesDetails";
import UploadNotes from "./Components/UploadNotes";
import AllNotesListing from "./Components/AllNotes";


function App() {
  // ✅ this state will be shared everywhere
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);


  return (
    <UserContext.Provider value={{ user, setUser ,token,setToken}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<NotesListing />} />
          <Route path="/UserLogin" element={<UserLogin />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/notes/:note" element={<NoteDetails/>}/>
          <Route path="/upload" element={<UploadNotes />} />
           <Route path="/all" element={<AllNotesListing />} />
          
        </Routes>
        <div>
          {user?.name || "No user logged in"}
          {user?.mail || "No email available"}
          <p>Token: {token}</p>
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
