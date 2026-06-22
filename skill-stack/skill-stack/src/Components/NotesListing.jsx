import { useState, useEffect ,useContext} from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { Search, Download, Flame } from "lucide-react";
import logo from "../ourResource/logo.svg";
import IsUserLogged from "./IsUserLogged";
import { useNavigate } from "react-router-dom";
import SkillStackService from "../service/SkillStackService";

//const USER_RELATED_URL = "http://localhost:8080"; // adjust as needed

const NotesListing = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [notes, setNotes] = useState([]); // fetch notes from backend
  const [loading, setLoading] = useState(true);
const { user ,setUser} = useContext(UserContext);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await SkillStackService.getOwnedNotes(token);
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
    return <p className="text-center mt-10">Loading notes...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 m-0">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 mb-6 bg-yellow-100 shadow-lg sticky ">
        <img src={logo} alt="logo" className="h-16 w-45 ml-14"></img>
        <div className="flex gap-2 w-2/5">
          <input
            type="text"
            placeholder="Search notes..."
            className="flex-1 border rounded-lg px-4 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="hover:bg-blue-600 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Search size={18} /> Search
          </button>
        </div>
        <div className="flex gap-3 items-center">
          <button className="flex gap-0.5 text-orange-500 font-bold text-xl">
            <Flame size={28} className="fill-orange-500 stroke-yellow-500" />
            {user?.points||0}
          </button>
          <IsUserLogged />
        </div>
      </div>

      {/* Notes grid */}
      <div className="text-2xl font-bold mb-6 pl-5">
        Own Notes
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No notes found.
            </p>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
              >
                <img src="/pdf-icon.png" alt="PDF" className="h-32 mx-auto" />
                <h3 className="mt-4 font-bold text-lg">{note.title}</h3>
                <p className="text-sm text-gray-500">{note.subject}</p>
                <span className="mt-2 inline-block bg-yellow-300 px-3 py-1 rounded-full text-xs font-bold">
                  {note.pointsRequired} Points
                </span>
                <button
                  className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  onClick={() => navigate(`/notes/${note.id}`)}
                >
                  <Download size={18} /> Download
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="text-2xl font-bold mb-6 pl-5">All Notes
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        </div>
      </div>
    </div>
  );
};

export default NotesListing;
