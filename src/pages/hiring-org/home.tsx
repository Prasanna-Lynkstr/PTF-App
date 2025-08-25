import React, { useState, useEffect } from "react";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import Header from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AssessmentInvite = () => {
  const [viewMode, setViewMode] = useState("my");
  const [aggregation, setAggregation] = useState("day");
  useEffect(() => {
    const chartId = `deviceChart-${viewMode}`;
    const ctx = document.getElementById(chartId) as HTMLCanvasElement | null;
    if (!ctx) return;

    const getLabels = () => {
      if (aggregation === "day") return ["Mon", "Tue", "Wed", "Thu", "Fri"];
      if (aggregation === "week") return ["Week 1", "Week 2", "Week 3", "Week 4"];
      return ["Jan", "Feb", "Mar", "Apr"];
    };

    const chartData = {
      labels: getLabels(),
      datasets: [
        {
          label: "Invites Sent",
          data: [20, 30, 25, 40, 15],
          backgroundColor: "#93c5fd",
        },
        {
          label: "Completed",
          data: [15, 22, 18, 35, 10],
          backgroundColor: "#3b82f6",
        },
        {
          label: "Pending",
          data: [5, 8, 7, 5, 5],
          backgroundColor: "#fbbf24",
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: "top" as const },
      },
    };

    const chartInstance = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });

    return () => chartInstance.destroy();
  }, [viewMode, aggregation]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="z-50 relative border-b border-gray-200 bg-white">
        <Header />
      </div>
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 pb-6">
        <MainSidebar />
        <main className="flex-1 px-6">
          <div className="space-y-6">

            {/* Welcome and Summary Section */}
            <div className="bg-white p-6 rounded-lg shadow mb-4">
            <h1 className="text-3xl font-bold mb-2 text-blue-800">Recruiter Dashboard</h1>
            <p className="text-sm text-gray-500">Manage and track your candidate assessments efficiently.</p>
          </div>
           

            {/* View Mode Toggle Tabs */}
            <div className="flex space-x-4 mb-4">
              <button
                className={`px-4 py-2 rounded ${viewMode === "my" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => setViewMode("my")}
              >
                My View
              </button>
              <button
                className={`px-4 py-2 rounded ${viewMode === "team" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => setViewMode("team")}
              >
                Team View
              </button>
              <button
                className={`px-4 py-2 rounded ${viewMode === "org" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => setViewMode("org")}
              >
                Org View
              </button>
            </div>

            {/* CTA */}
            <div className="flex justify-end">
              <a
                href="/hiring-org/assessment-invite"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Send New Invite
              </a>
            </div>

            {/* Tabbed Views */}
            {viewMode === "my" && (
              <>
                {/* Metric Snapshots */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Invites Sent", value: 120 },
                    { label: "Pending Responses", value: 35 },
                    { label: "Completed Assessments", value: 85 },
                    { label: "Avg. Response Time", value: "1.5 days" }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow text-center">
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                      <p className="text-xl font-bold text-blue-600">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Graph Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Assessment Status</h2>
                  <div className="mb-4">
                    <label className="text-sm text-gray-600 mr-2">Aggregate By:</label>
                    <select
                      value={aggregation}
                      onChange={(e) => setAggregation(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                    </select>
                  </div>
                  <div className="w-full h-64">
                    <canvas id={`deviceChart-${viewMode}`} />
                  </div>
                </div>

                {/* Recent Responses Table */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Recent Responses</h2>
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-600 border-b">
                        <th className="py-2">Candidate</th>
                        <th className="py-2">Assessment</th>
                        <th className="py-2">Date Completed</th>
                        <th className="py-2">Score</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: "resp1", name: "Alice Johnson", test: "React Coding", date: "2025-07-22", score: "85%", status: "Reviewed" },
                        { id: "resp2", name: "Bob Lee", test: "SQL Assessment", date: "2025-07-21", score: "90%", status: "Pending Review" },
                      ].map((response, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2">{response.name}</td>
                          <td className="py-2">{response.test}</td>
                          <td className="py-2">{response.date}</td>
                          <td className="py-2">{response.score}</td>
                          <td className="py-2">{response.status}</td>
                          <td className="py-2">
                            <Link
                              to={`/hiring-org/responses/${response.id}`}
                              className="text-blue-600 hover:underline"
                            >
                              View Response
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Recent Invites Table */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Recent Invites</h2>
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-600 border-b">
                        <th className="py-2">Candidate</th>
                        <th className="py-2">Assessment</th>
                        <th className="py-2">Date Sent</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: "inv1", name: "John Doe", test: "JavaScript MCQ", date: "2025-07-20", status: "Pending" },
                        { id: "inv2", name: "Jane Smith", test: "Python Coding", date: "2025-07-18", status: "Completed", responseId: "resp3" },
                      ].map((invite, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2">{invite.name}</td>
                          <td className="py-2">{invite.test}</td>
                          <td className="py-2">{invite.date}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              invite.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {invite.status}
                            </span>
                          </td>
                          <td className="py-2">
                            {invite.status === "Completed" ? (
                              <Link
                                to={`/hiring-org/responses/${invite.responseId}`}
                                className="text-blue-600 hover:underline"
                              >
                                View Response
                              </Link>
                            ) : (
                              <Link
                                to={`/hiring-org/invites/edit/${invite.id}`}
                                className="text-blue-600 hover:underline"
                              >
                                Edit Invite
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {viewMode === "team" && (
              <>
                {/* Metric Snapshots */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Invites Sent", value: 120 },
                    { label: "Pending Responses", value: 35 },
                    { label: "Completed Assessments", value: 85 },
                    { label: "Avg. Response Time", value: "1.5 days" }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow text-center">
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                      <p className="text-xl font-bold text-blue-600">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Graph Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Assessment Status</h2>
                  <div className="mb-4">
                    <label className="text-sm text-gray-600 mr-2">Aggregate By:</label>
                    <select
                      value={aggregation}
                      onChange={(e) => setAggregation(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                    </select>
                  </div>
                  <div className="w-full h-64">
                    <canvas id={`deviceChart-${viewMode}`} />
                  </div>
                </div>

                {/* Recent Responses Table */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Recent Responses</h2>
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-600 border-b">
                        <th className="py-2">Candidate</th>
                        <th className="py-2">Assessment</th>
                        <th className="py-2">Date Completed</th>
                        <th className="py-2">Score</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: "resp1", name: "Alice Johnson", test: "React Coding", date: "2025-07-22", score: "85%", status: "Reviewed" },
                        { id: "resp2", name: "Bob Lee", test: "SQL Assessment", date: "2025-07-21", score: "90%", status: "Pending Review" },
                      ].map((response, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2">{response.name}</td>
                          <td className="py-2">{response.test}</td>
                          <td className="py-2">{response.date}</td>
                          <td className="py-2">{response.score}</td>
                          <td className="py-2">{response.status}</td>
                          <td className="py-2">
                            <Link
                              to={`/hiring-org/responses/${response.id}`}
                              className="text-blue-600 hover:underline"
                            >
                              View Response
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Recent Invites Table */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Recent Invites</h2>
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-600 border-b">
                        <th className="py-2">Candidate</th>
                        <th className="py-2">Assessment</th>
                        <th className="py-2">Date Sent</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: "inv1", name: "John Doe", test: "JavaScript MCQ", date: "2025-07-20", status: "Pending" },
                        { id: "inv2", name: "Jane Smith", test: "Python Coding", date: "2025-07-18", status: "Completed", responseId: "resp3" },
                      ].map((invite, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2">{invite.name}</td>
                          <td className="py-2">{invite.test}</td>
                          <td className="py-2">{invite.date}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              invite.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {invite.status}
                            </span>
                          </td>
                          <td className="py-2">
                            {invite.status === "Completed" ? (
                              <Link
                                to={`/hiring-org/responses/${invite.responseId}`}
                                className="text-blue-600 hover:underline"
                              >
                                View Response
                              </Link>
                            ) : (
                              <Link
                                to={`/hiring-org/invites/edit/${invite.id}`}
                                className="text-blue-600 hover:underline"
                              >
                                Edit Invite
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {viewMode === "org" && (
              <>
                {/* Metric Snapshots */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Invites Sent", value: 120 },
                    { label: "Pending Responses", value: 35 },
                    { label: "Completed Assessments", value: 85 },
                    { label: "Avg. Response Time", value: "1.5 days" }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow text-center">
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                      <p className="text-xl font-bold text-blue-600">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Graph Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Assessment Status</h2>
                  <div className="mb-4">
                    <label className="text-sm text-gray-600 mr-2">Aggregate By:</label>
                    <select
                      value={aggregation}
                      onChange={(e) => setAggregation(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                    </select>
                  </div>
                  <div className="w-full h-64">
                    <canvas id={`deviceChart-${viewMode}`} />
                  </div>
                </div>

                {/* Recent Responses Table */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Recent Responses</h2>
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-600 border-b">
                        <th className="py-2">Candidate</th>
                        <th className="py-2">Assessment</th>
                        <th className="py-2">Date Completed</th>
                        <th className="py-2">Score</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: "resp1", name: "Alice Johnson", test: "React Coding", date: "2025-07-22", score: "85%", status: "Reviewed" },
                        { id: "resp2", name: "Bob Lee", test: "SQL Assessment", date: "2025-07-21", score: "90%", status: "Pending Review" },
                      ].map((response, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2">{response.name}</td>
                          <td className="py-2">{response.test}</td>
                          <td className="py-2">{response.date}</td>
                          <td className="py-2">{response.score}</td>
                          <td className="py-2">{response.status}</td>
                          <td className="py-2">
                            <Link
                              to={`/hiring-org/responses/${response.id}`}
                              className="text-blue-600 hover:underline"
                            >
                              View Response
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Recent Invites Table */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Recent Invites</h2>
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-600 border-b">
                        <th className="py-2">Candidate</th>
                        <th className="py-2">Assessment</th>
                        <th className="py-2">Date Sent</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: "inv1", name: "John Doe", test: "JavaScript MCQ", date: "2025-07-20", status: "Pending" },
                        { id: "inv2", name: "Jane Smith", test: "Python Coding", date: "2025-07-18", status: "Completed", responseId: "resp3" },
                      ].map((invite, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2">{invite.name}</td>
                          <td className="py-2">{invite.test}</td>
                          <td className="py-2">{invite.date}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              invite.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {invite.status}
                            </span>
                          </td>
                          <td className="py-2">
                            {invite.status === "Completed" ? (
                              <Link
                                to={`/hiring-org/responses/${invite.responseId}`}
                                className="text-blue-600 hover:underline"
                              >
                                View Response
                              </Link>
                            ) : (
                              <Link
                                to={`/hiring-org/invites/edit/${invite.id}`}
                                className="text-blue-600 hover:underline"
                              >
                                Edit Invite
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

          </div>
        </main> 
      </div>
      <Footer />
    </div>
  );
};

export default AssessmentInvite;