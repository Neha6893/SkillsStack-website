import { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { Search, Download, Flame, Upload } from "lucide-react";
import logo from "../ourResource/logo.svg";
import IsUserLogged from "./IsUserLogged";
import { useNavigate } from "react-router-dom";
import SkillStackService from "../service/SkillStackService";
import Main_footer from "./main_footer";

const NotesListing = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]); // selected files
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [points, setPoints] = useState("");

  // 🔄 Fetch notes from backend
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

  useEffect(() => {
    fetchNotes();
  }, []);

  // ⬆ Upload handler
  const handleUpload = async () => {
    if (!user) {
      alert("You must be logged in to upload notes.");
      navigate("/UserLogin");
      return;
    }
    if (!title || !subject || !points || files.length === 0) {
      alert("Please fill all fields and select at least one file.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subject", subject);
      formData.append("pointsRequired", points);
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const response = await SkillStackService.uploadNotes(formData, token);
      console.log("Uploaded successfully:", response);

      // update points in localStorage & context
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, points: response.points })
      );
      setUser(JSON.parse(localStorage.getItem("user")));

      // clear form
      setTitle("");
      setSubject("");
      setPoints("");
      setFiles([]);

      // refresh list
      await fetchNotes();

      alert("✅ Note uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Failed to upload note");
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="text-center mt-10">Loading notes...</p>;
  }

  return (
    <div className="mx-auto p-6 w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 mb-6 bg-yellow-100 shadow-lg sticky top-0 p-4 rounded-lg w-full">
        <img src={logo} alt="logo" className="h-16 w-45 ml-4" onClick={()=>{navigate("/")}} />
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
            {user?.points || 0}
          </button>
          <IsUserLogged />
        </div>
      </div>

      {/* Upload + Notes Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl p-6 shadow-lg max-w-6xl mx-auto">
        {/* Left: Upload Form */}
        <div className="flex flex-col p-4 border rounded-xl bg-gray-50">
          <Upload size={48} className="text-blue-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-center mb-4">Upload Notes</h2>

          <input
            type="text"
            placeholder="Title"
            className="border rounded-lg px-3 py-2 mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Subject"
            className="border rounded-lg px-3 py-2 mb-3"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <input
            type="number"
            placeholder="Points"
            className="border rounded-lg px-3 py-2 mb-3"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
          <input
            type="file"
            multiple
            className="border rounded-lg px-3 py-2 bg-white mb-4"
            onChange={(e) => setFiles(e.target.files)}
          />

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>

        {/* Right: Notes List */}
        <div>
          <h2 className="text-xl font-bold mb-4">Uploaded Notes</h2>
          <div className="space-y-3">
            {filteredNotes.length === 0 ? (
              <p className="text-gray-500 text-center">No notes found.</p>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex flex-col border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{note.title}</h3>
                      <p className="text-sm text-gray-500">{note.subject}</p>
                    </div>
                    <span className="bg-yellow-300 px-3 py-1 rounded-full text-xs font-bold">
                      {note.pointsRequired} Points
                    </span>
                  </div>
                  <button
                    className="mt-3 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    onClick={() => navigate("/notes/${note.id}")}
                  >
                    <Download size={18} /> Download
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Main_footer />
    </div>

  );
};

export default NotesListing;