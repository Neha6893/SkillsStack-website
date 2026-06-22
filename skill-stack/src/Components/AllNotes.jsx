import { useState, useEffect } from "react";
import { Search, Download, Flame } from "lucide-react";
import logo from "../ourResource/logo.svg";
import IsUserLogged from "./IsUserLogged";
import { useNavigate } from "react-router-dom";
import SkillStackService from "../service/SkillStackService";
import Footer from "./main_footer";

const AllNotesListing = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  );

  // Fetch notes and user info
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRes = await SkillStackService.getUser(token);
        localStorage.setItem("user", JSON.stringify(userRes.data));
        setUser(userRes.data);

        const res = await SkillStackService.getAllNotes(token);
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();

    // Polling localStorage to reflect any changes in user points
    const interval = setInterval(() => {
      const updatedUser = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      // Only update state if there's a change
      if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {
        setUser(updatedUser);
      }
    }, 500); // check every 500ms

    return () => clearInterval(interval);
  }, [user]); // dependency ensures it checks against latest state

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="text-center mt-10 text-lg">⏳ Loading notes...</p>;
  }

  return (
    <div className="w-full mx-auto">
      {/* Nav */}
      <div className="flex items-center justify-between bg-yellow-200 shadow-lg px-6 py-4 mb-8 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="logo"
            className="h-16 w-45 ml-14 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Search */}
        <div className="flex gap-2 w-1/2">
          <input
            type="text"
            placeholder="🔍 Search notes by title..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="hover:bg-blue-600 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
            <Search size={18} /> Search
          </button>
        </div>

        {/* Points + User */}
        <div className="flex gap-4 items-center">
          <button className="flex items-center gap-1 text-orange-600 font-bold text-lg bg-orange-100 px-3 py-1 rounded-full">
            <Flame size={24} className="fill-orange-500 stroke-yellow-500" />
            {user?.points || 0}
          </button>
          <IsUserLogged />
        </div>
      </div>

      {/* Notes Listing */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📚 All Notes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNotes.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 text-lg">
              ❌ No notes found.
            </p>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition duration-300 flex flex-col items-center"
              >
                
                <h3 className="font-bold text-lg text-gray-700">{note.title}</h3>
                <p className="text-sm text-gray-500">{note.subject}</p>
                <span className="mt-3 bg-yellow-200 text-yellow-800 px-4 py-1 rounded-full text-xs font-semibold">
                  {note.pointsRequired} Points
                </span>

                <button
                  className="mt-5 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition"
                  onClick={() => navigate(`/notes/${note.id}`, { state: { note } })}
                >
                  <Download size={18} /> View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllNotesListing;
