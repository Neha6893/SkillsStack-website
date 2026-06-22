import { useState, useEffect } from "react";
import { Search, Download, Flame } from "lucide-react";
import logo from "../ourResource/logo.svg";
import IsUserLogged from "./IsUserLogged";
import { useNavigate } from "react-router-dom";
import SkillStackService from "../service/SkillStackService";

const AllNotesListing = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRes = await SkillStackService.getUser(token);
        localStorage.setItem("user", JSON.stringify(userRes.data));
        const res = await SkillStackService.getAllNotes(token);
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="text-center mt-10 text-lg">⏳ Loading notes...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-white shadow-md rounded-xl px-6 py-4 mb-8 sticky top-0 z-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="h-12" />
          <h1 className="text-xl font-bold text-gray-700">SkillStack Notes</h1>
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
              <img
                src="/pdf-icon.png"
                alt="PDF"
                className="h-28 mb-4 drop-shadow"
              />
              <h3 className="font-bold text-lg text-gray-700">{note.title}</h3>
              <p className="text-sm text-gray-500">{note.subject}</p>

              <span className="mt-3 bg-yellow-200 text-yellow-800 px-4 py-1 rounded-full text-xs font-semibold">
                {note.pointsRequired} Points
              </span>

              <button
                className="mt-5 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition"
                onClick={() => {
                  navigate(`/notes/${note.id}`, { state: { note } });
                }}
              >
                <Download size={18} /> Download
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllNotesListing;
