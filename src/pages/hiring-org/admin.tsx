import { useAuth } from "@/utils/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/footer";

import AdminSidebar from "@/components/AdminSidebar";


const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    if (user && user.roleName !== "orgAdmin") {
      navigate("/unauthorized");
    }
  }, [user, navigate]);

useEffect(() => {
  const fetchActivity = async () => {
    try {
      const res = await fetch("/api/admin/activity-log?limit=5", { credentials: "include" });
      console.log("Activity log response status:", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched activity logs:", data);
        setActivityLogs(data || []);
      } else {
        const errorText = await res.text();
        console.error("Failed to load activity logs", errorText);
      }
    } catch (err) {
      console.error("Error loading activity logs", err);
    }
  };
  fetchActivity();
}, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 pb-6">
        <AdminSidebar />
        <main className="flex-grow p-6 bg-gray-50">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Organization Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-sm text-gray-500">Total Users</h3>
              <p className="text-xl font-semibold text-blue-800">128</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-sm text-gray-500">Active Users</h3>
              <p className="text-xl font-semibold text-blue-800">97</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-sm text-gray-500">Total Assessments</h3>
              <p className="text-xl font-semibold text-blue-800">214</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-sm text-gray-500">Invites Sent</h3>
              <p className="text-xl font-semibold text-blue-800">1,340</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-sm text-gray-500">Completed Assessments</h3>
              <p className="text-xl font-semibold text-blue-800">980</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-sm text-gray-500">Pending Responses</h3>
              <p className="text-xl font-semibold text-blue-800">112</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">Top 5 Active Recruiters</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-blue-100 text-blue-800 uppercase text-xs">
                  <tr>
                    <th scope="col" className="px-4 py-2">Recruiter</th>
                    <th scope="col" className="px-4 py-2">Invites Sent</th>
                    <th scope="col" className="px-4 py-2">Completed</th>
                    <th scope="col" className="px-4 py-2">Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">Priya Patel</td>
                    <td className="px-4 py-2">145</td>
                    <td className="px-4 py-2">110</td>
                    <td className="px-4 py-2 text-green-600 font-semibold">76%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">Alex Kim</td>
                    <td className="px-4 py-2">132</td>
                    <td className="px-4 py-2">97</td>
                    <td className="px-4 py-2 text-green-600 font-semibold">73%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">John Smith</td>
                    <td className="px-4 py-2">120</td>
                    <td className="px-4 py-2">89</td>
                    <td className="px-4 py-2 text-green-600 font-semibold">74%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">Nisha Rao</td>
                    <td className="px-4 py-2">105</td>
                    <td className="px-4 py-2">72</td>
                    <td className="px-4 py-2 text-yellow-600 font-semibold">69%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">Sam Thomas</td>
                    <td className="px-4 py-2">97</td>
                    <td className="px-4 py-2">66</td>
                    <td className="px-4 py-2 text-yellow-600 font-semibold">68%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">Efficiency = (Completed / Invites Sent) × 100</p>
            <div className="mt-6">
              <div className="h-40 bg-blue-100 flex items-center justify-center text-blue-500 rounded">
                Usage Graph Coming Soon
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Recent Activity</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {activityLogs.length > 0 ? (
                activityLogs.map((log, idx) => (
                  <li key={idx}>
                    ✓ {log.description}
                    {log.actorName && (
                      <span className="ml-1 text-blue-600 font-medium">by {log.actorName}</span>
                    )}
                    <span className="text-gray-400 text-xs ml-2">
                      [{new Date(log.createdAt).toLocaleString('en-GB')}]
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 italic">No recent activity found.</li>
              )}
            </ul>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;