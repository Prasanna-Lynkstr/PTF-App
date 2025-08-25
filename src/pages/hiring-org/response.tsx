import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MainSidebar from "@/components/MainSidebar";
import { useState } from "react";

export default function Response() {
  const [viewMode, setViewMode] = useState("my");
  const [editStatusRow, setEditStatusRow] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
    const DummyData = [
    // Public Assessments
    {
      title: "Intent & Readiness",
      mode: "Voice",
      description: "Evaluate career clarity and motivation for fresh graduates.",
      tags: ["Intent", "Motivation", "Career Clarity"],
      duration: "15 mins",
      level: "Entry",
      type: "public",
      questionType: "Fixed",
      hasInvites: true, // Dummy: this assessment has invites sent
    },
    {
      title: "Leadership Readiness",
      mode: "Video",
      description: "Screen for vision, EI, and leadership decision-making.",
      tags: ["Leadership", "Vision", "EQ"],
      duration: "30 mins",
      level: "Leadership",
      type: "public",
      questionType: "Dynamic",
      hasInvites: true, // Dummy: this assessment has invites sent
    },
    {
      title: "Adaptability & Ownership",
      mode: "MCQ",
      description: "Assess workplace readiness, adaptability, and ownership.",
      tags: ["Adaptability", "Ownership", "Work Ethic"],
      duration: "20 mins",
      level: "Mid-level",
      type: "public",
      questionType: "Fixed",
    },
    {
      title: "Team Collaboration Skills",
      mode: "Video",
      description: "Evaluate collaboration and communication in teams.",
      tags: ["Teamwork", "Communication", "Collaboration"],
      duration: "20 mins",
      level: "All Levels",
      type: "public",
      questionType: "Dynamic",
    },
    {
      title: "Workplace Integrity",
      mode: "MCQ",
      description: "Assess integrity and ethical alignment at workplace.",
      tags: ["Integrity", "Ethics", "Responsibility"],
      duration: "18 mins",
      level: "All Levels",
      type: "public",
      questionType: "Fixed",
    },
    {
      title: "Self Awareness Assessment",
      mode: "Voice",
      description: "Gauge self-awareness and emotional intelligence.",
      tags: ["Self-awareness", "Reflection", "EQ"],
      duration: "15 mins",
      level: "Entry",
      type: "public",
      questionType: "Fixed",
    },
    {
      title: "Problem Solving Skills",
      mode: "MCQ",
      description: "Measure analytical and problem-solving abilities.",
      tags: ["Problem Solving", "Critical Thinking"],
      duration: "25 mins",
      level: "Mid-level",
      type: "public",
      questionType: "Fixed",
    },
    {
      title: "Conflict Management",
      mode: "Video",
      description: "Evaluate ability to resolve conflicts in teams.",
      tags: ["Conflict Resolution", "Communication"],
      duration: "20 mins",
      level: "All Levels",
      type: "public",
      questionType: "Dynamic",
    },
    {
      title: "Ownership & Drive",
      mode: "Voice",
      description: "Assess personal drive and accountability.",
      tags: ["Ownership", "Drive", "Initiative"],
      duration: "18 mins",
      level: "Mid-level",
      type: "public",
      questionType: "Fixed",
    },
    {
      title: "Workplace Clarity",
      mode: "Voice",
      description: "Gauge clarity about job roles and organizational goals.",
      tags: ["Clarity", "Alignment", "Goals"],
      duration: "15 mins",
      level: "Entry",
      type: "public",
      questionType: "Fixed",
    },
    {
      title: "Situational Judgment",
      mode: "MCQ",
      description: "Test decision-making in practical job situations.",
      tags: ["Judgment", "Ethics", "Responsibility"],
      duration: "20 mins",
      level: "Mid-level",
      type: "public",
      questionType: "Fixed",
    },
    {
      title: "Communication Effectiveness",
      mode: "Video",
      description: "Assess clarity and impact of verbal communication.",
      tags: ["Communication", "Impact", "Verbal"],
      duration: "20 mins",
      level: "Entry",
      type: "public",
      questionType: "Dynamic",
    },
    {
      title: "Motivation Screening",
      mode: "Voice",
      description: "Evaluate intrinsic and extrinsic motivation factors.",
      tags: ["Motivation", "Goals", "Career Aspiration"],
      duration: "15 mins",
      level: "All Levels",
      type: "public",
      questionType: "Fixed",
    },
    {
      title: "Emotional Intelligence",
      mode: "MCQ",
      description: "Screen for emotional awareness and regulation.",
      tags: ["EQ", "Self-regulation", "Empathy"],
      duration: "22 mins",
      level: "Mid-level",
      type: "public",
      questionType: "Fixed",
    },
    {
      title: "Decision Making Skills",
      mode: "Video",
      description: "Evaluate logic, reasoning and choices under pressure.",
      tags: ["Decision Making", "Reasoning", "Problem Solving"],
      duration: "25 mins",
      level: "Senior",
      type: "public",
      questionType: "Dynamic",
    },
    {
      title: "Career Clarity Screening",
      mode: "Voice",
      description: "Gauge if the candidate understands career paths and fit.",
      tags: ["Career Clarity", "Intent", "Self-awareness"],
      duration: "15 mins",
      level: "Entry",
      type: "public",
      questionType: "Fixed",
    },
    {
      title: "Workplace Etiquette",
      mode: "MCQ",
      description: "Test understanding of workplace norms and etiquette.",
      tags: ["Etiquette", "Behavior", "Professionalism"],
      duration: "18 mins",
      level: "All Levels",
      type: "public",
      questionType: "Fixed",
    },
    {
      title: "Time Management Assessment",
      mode: "Voice",
      description: "Evaluate time management habits and priorities.",
      tags: ["Time Management", "Prioritization", "Efficiency"],
      duration: "16 mins",
      level: "Mid-level",
      type: "public",
      questionType: "Fixed",
    },
    {
      title: "Job Fit Assessment",
      mode: "MCQ",
      description: "Screen for behavioral and motivation-job match.",
      tags: ["Job Fit", "Behavioral", "Culture"],
      duration: "20 mins",
      level: "All Levels",
      type: "public",
      questionType: "Fixed",
    },
    {
      title: "Vision & Growth",
      mode: "Video",
      description: "Evaluate future orientation and growth mindset.",
      tags: ["Vision", "Growth Mindset", "Goals"],
      duration: "20 mins",
      level: "Leadership",
      type: "public",
      questionType: "Dynamic",
    },

    // Private Assessments
    {
      title: "Senior Backend Developer",
      mode: "Video",
      description: "Advanced backend knowledge and system design.",
      tags: ["Java", "System Design", "Databases"],
      duration: "45 mins",
      level: "Senior",
      type: "private",
      questionType: "Dynamic",
    },
    {
      title: "Frontend Developer MCQ",
      mode: "MCQ",
      description: "Test React and JavaScript fundamentals.",
      tags: ["React", "JavaScript", "HTML"],
      duration: "25 mins",
      level: "Entry",
      type: "private",
      questionType: "Fixed",
      hasInvites: true, // Dummy: this private assessment has invites sent
    },
    {
      title: "Data Structures & Algorithms",
      mode: "MCQ",
      description: "Algorithmic thinking and problem solving.",
      tags: ["DSA", "Algorithms", "Logic"],
      duration: "30 mins",
      level: "Mid-level",
      type: "private",
      questionType: "Fixed",
    },
    {
      title: "Advanced SQL & Data Modeling",
      mode: "MCQ",
      description: "Assess SQL queries and schema design.",
      tags: ["SQL", "Schema", "Joins"],
      duration: "35 mins",
      level: "Senior",
      type: "private",
      questionType: "Fixed",
    },
    {
      title: "Team Collaboration",
      mode: "Video",
      description: "Evaluate teamwork and communication.",
      tags: ["Teamwork", "Coordination", "Clarity"],
      duration: "20 mins",
      level: "All Levels",
      type: "private",
      questionType: "Dynamic",
    },
    {
      title: "Cloud Fundamentals",
      mode: "MCQ",
      description: "Cloud basics for junior engineers.",
      tags: ["AWS", "Azure", "Cloud"],
      duration: "30 mins",
      level: "Entry",
      type: "private",
      questionType: "Fixed",
    },
    {
      title: "System Design L2",
      mode: "Video",
      description: "Evaluate knowledge of microservices & infra.",
      tags: ["System Design", "Microservices", "Scalability"],
      duration: "40 mins",
      level: "Senior",
      type: "private",
      questionType: "Dynamic",
    },
    {
      title: "Coding Round (Java)",
      mode: "MCQ",
      description: "Programming logic and Java syntax.",
      tags: ["Java", "Coding", "OOP"],
      duration: "30 mins",
      level: "Entry",
      type: "private",
      questionType: "Fixed",
    },
    {
      title: "GCP & Data Pipelines",
      mode: "Video",
      description: "BigQuery, ETL, and GCP skills evaluation.",
      tags: ["GCP", "ETL", "BigQuery"],
      duration: "35 mins",
      level: "Mid-level",
      type: "private",
      questionType: "Dynamic",
    },
    {
      title: "Frontend Live Task",
      mode: "Video",
      description: "Screen UI building capability in React.",
      tags: ["React", "Hooks", "UI"],
      duration: "45 mins",
      level: "Mid-level",
      type: "private",
      questionType: "Dynamic",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="z-50 relative border-b border-gray-200 bg-white">
        <Header />
      </div>
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 pt-20 pb-6">
        <MainSidebar />
        <main className="flex-1 ml-0 md:ml-6 flex flex-col">
          {/* Welcome and Summary Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-4">
            <h1 className="text-3xl font-bold mb-2 text-blue-800">Candidate Assessment Responses</h1>
            <p className="text-sm text-gray-500">Review completed assessments, view reports, and take action on candidate responses efficiently.</p>
          </div>
          {/* Assessment Summary Widget */}
          <div className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Assessment Summary</h2>
              <p className="text-sm text-gray-500">Overview of candidate responses</p>
            </div>
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-700">125</div>
                <div className="text-xs text-gray-500">Total Responses</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">68%</div>
                <div className="text-xs text-gray-500">Shortlisted</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-600">72</div>
                <div className="text-xs text-gray-500">Pending Review</div>
              </div>
            </div>
          </div>
          {/* Global View Mode Toggle */}
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
          {/* Saved Filters / Views Dropdown */}
          <div className="flex items-center space-x-4 mb-4">
            <label className="text-sm text-gray-700 font-medium">Saved Views:</label>
            <select className="px-2 py-1 border border-gray-300 rounded">
              <option>All Responses</option>
              <option>My Shortlisted</option>
              <option>Pending Review</option>
              <option>Recent Submissions</option>
            </select>
          </div>
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <input
              type="text"
              placeholder="Search by candidate name or email"
              className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded"
            />
            <div className="flex space-x-2">
              <select className="px-4 py-2 border border-gray-300 rounded">
                <option value="">All Assessments</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Assessments"
                  className="px-4 py-2 border border-gray-300 rounded w-52"
                  onChange={(e) => {
                    // Optional: implement state or logic for filtering
                  }}
                  list="assessment-list"
                />
                <datalist id="assessment-list">
                  {DummyData.map((item, idx) => (
                    <option key={idx} value={item.title} />
                  ))}
                </datalist>
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded">
                <option value="">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="bookmarked">Bookmarked</option>
              </select>
            </div>
          </div>

          {/* Response List Table */}
          <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
            {/* Bulk Actions Toolbar */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">3 selected</span>
              <div className="flex space-x-2">
                <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded">Update Status</button>
                <button className="text-sm px-3 py-1 bg-yellow-500 text-white rounded">Bookmark</button>
                <button className="text-sm px-3 py-1 bg-gray-600 text-white rounded">Export</button>
              </div>
            </div>
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2"><input type="checkbox" /></th>
                  <th className="px-4 py-2">Bookmark</th>
                  <th className="p-2 font-medium">Candidate</th>
                  <th className="p-2 font-medium">Assessment</th>
                  <th className="p-2 font-medium">Overall Score</th>
                  <th className="p-2 font-medium">Submitted On</th>
                  <th className="p-2 font-medium">Recommendation</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2"><input type="checkbox" /></td>
                    <td className="px-4 py-2 text-center"><span className="text-yellow-400">★</span></td>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <span className="inline-block w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold">J</span>
                        <div>
                          <div className="font-medium text-gray-800">John Doe</div>
                          <div className="text-xs text-gray-500">john.doe@example.com</div>
                          <div className="text-xs text-gray-400">+91-9876543210</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">Problem Solving Skills</td>
                    <td className="p-2">
                      <div className="text-sm font-semibold text-green-700">Score: 85%</div>
                      <div className="text-xs text-gray-500">High overall performance with strong communication and logic</div>
                    </td>
                    <td className="p-2">2025-07-20</td>
                    <td className="p-2 text-green-700">Recommended</td>
                    <td className="px-4 py-2">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Shortlisted</span>
                    </td>
                    <td className="p-2 space-x-2 flex items-center">
                    
                      {/* Replace Notes icon with Add Notes text */}
                      <button
                        title="Add Notes"
                        className="text-blue-600 hover:underline text-sm"
                        // onClick handler should remain as before (add notes logic)
                        onClick={() => {
                          // Dummy: placeholder for add notes functionality
                          alert('Add notes clicked!');
                        }}
                      >
                        Add Notes
                      </button>
                      {/* Quick Note Summary Tooltip */}
                      {editStatusRow === i ? (
                        <select
                          className="text-sm border rounded px-1 py-0.5 text-gray-700"
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          onBlur={() => setEditStatusRow(null)}
                          autoFocus
                        >
                          <option value="">Update Status</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                          <option value="on_hold">On Hold</option>
                          <option value="in_progress">In Progress</option>
                        </select>
                      ) : (
                        <button
                          className="text-sm text-blue-600"
                          onClick={() => {
                            setEditStatusRow(i);
                            setSelectedStatus(""); // or pass current status if stored
                          }}
                        >
                          Update Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}