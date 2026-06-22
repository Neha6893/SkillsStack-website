import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "./Nav";

const MyEarnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [moneyEarnings, setMoneyEarnings] = useState(0);
  const [pointEarnings, setPointEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9090/api/purchases/earnings?email=${user.mail}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setEarnings(res.data.notes);
          setMoneyEarnings(res.data.totalMoneyEarnings);
          setPointEarnings(res.data.totalPointEarnings);
        }
      } catch (err) {
        console.error("Error fetching earnings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [user, token]);

  if (loading) return <p className="text-center mt-10 text-lg">Loading earnings...</p>;

  return (
    <>
      <Nav />
      <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">📊 My Earnings Dashboard</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-5 rounded-xl shadow-sm bg-gradient-to-br from-green-100 to-green-50 border border-green-200">
            <h3 className="text-gray-700 font-semibold mb-1">Money Earned</h3>
            <p className="text-3xl font-bold text-green-700">₹{moneyEarnings}</p>
          </div>

          <div className="p-5 rounded-xl shadow-sm bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200">
            <h3 className="text-gray-700 font-semibold mb-1">Points Earned</h3>
            <p className="text-3xl font-bold text-blue-700">{pointEarnings}</p>
          </div>

          <div className="p-5 rounded-xl shadow-sm bg-gradient-to-br from-yellow-100 to-yellow-50 border border-yellow-200">
            <h3 className="text-gray-700 font-semibold mb-1">Total Notes Sold</h3>
            <p className="text-3xl font-bold text-yellow-700">
              {earnings.reduce((acc, n) => acc + n.purchaseCount, 0)}
            </p>
          </div>
        </div>

        {/* Notes Earnings Table */}
        {earnings.length === 0 ? (
          <p className="text-gray-500 text-center">No earnings yet 😔</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm text-center">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Price (₹)</th>
                  <th className="p-4">Point Downloads</th>
                  <th className="p-4">Razorpay Downloads</th>
                  <th className="p-4">Money Earned</th>
                  <th className="p-4">Points Earned</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition duration-150 border-b border-gray-200"
                  >
                    <td className="p-4 text-left font-medium text-gray-800">{item.title}</td>
                    <td className="p-4 text-gray-600">{item.subject}</td>
                    <td className="p-4 text-gray-700">{item.pointsRequired}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                        {item.pointsDownloads}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                        {item.razorpayDownloads}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-green-700">₹{item.moneyEarnings}</td>
                    <td className="p-4 font-semibold text-blue-700">{item.pointEarnings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default MyEarnings;
