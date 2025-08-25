import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MainSidebar from "@/components/MainSidebar";

export default function AssessmentInviteLayout() {
  const [viewMode, setViewMode] = useState("my");
  const [assessmentQuery, setAssessmentQuery] = useState("");
    const mockAssessments = [
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
            <h1 className="text-3xl font-bold mb-2 text-blue-800">Assessment Invites</h1>
            <p className="text-sm text-gray-500">Easily invite candidates to take assessments and track their progress here.</p>
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
          {/* Send New Invite button, right-aligned */}
          <div className="flex justify-end mb-4">
            <Link
              to="/hiring-org/assessment-invite"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center"
            >
              Send New Invite (Assessment)
            </Link>
          </div>

          {/* Snapshot Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: "Total Invites", value: 128 },
              { label: "Completed", value: 76 },
              { label: "Pending", value: 34 },
              { label: "Expired", value: 12 },
              { label: "Avg. Completion Time", value: "2d 4h" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded shadow text-center">
                <div className="text-2xl font-bold text-blue-700">{item.value}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Filter Section */}
          <div className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-4 items-center">
            <input type="text" placeholder="Search by name/email" className="border px-3 py-2 rounded w-full md:w-1/4" />
            <select className="border px-3 py-2 rounded w-full md:w-1/5">
              <option>Status</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Expired</option>
            </select>
            {/* Assessment Autocomplete Input */}
            {(() => {
              const filteredAssessments = mockAssessments.filter(a =>
                a.title.toLowerCase().includes(assessmentQuery.toLowerCase())
              );
              return (
                <div className="relative w-full md:w-1/5">
                  <input
                    type="text"
                    placeholder="Search Assessments"
                    value={assessmentQuery}
                    onChange={(e) => setAssessmentQuery(e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                  />
                  {assessmentQuery && (
                    <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-40 overflow-auto z-10 rounded shadow">
                      {filteredAssessments.map((a, index) => (
                        <li
                          key={index}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => setAssessmentQuery(a.title)}
                        >
                          {a.title}
                        </li>
                      ))}
                      {filteredAssessments.length === 0 && (
                        <li className="px-3 py-2 text-sm text-gray-400">No matches found</li>
                      )}
                    </ul>
                  )}
                </div>
              );
            })()}
            <button className="bg-gray-300 text-sm text-gray-700 px-3 py-2 rounded">Clear Filters</button>
          </div>

          {/* Recent Invites Table */}
          <div className="bg-white p-4 rounded shadow mb-6 overflow-x-auto">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Invites</h2>
            <table className="w-full text-sm text-left border">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <th className="px-4 py-2 border">Candidate Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Assessment</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Sent Date</th>
                  <th className="px-4 py-2 border">Completed On</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "John Doe",
                    email: "john@example.com",
                    assessment: "Java Basics",
                    status: "Pending",
                    sent: "Jul 24",
                    completed: "",
                  },
                  {
                    name: "Priya K",
                    email: "priya@abc.com",
                    assessment: "Python Advanced",
                    status: "Completed",
                    sent: "Jul 20",
                    completed: "Jul 22",
                  },
                ].map((invite, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2 border">{invite.name}</td>
                    <td className="px-4 py-2 border">{invite.email}</td>
                    <td className="px-4 py-2 border">{invite.assessment}</td>
                    <td className={`px-4 py-2 border font-medium ${invite.status === "Completed" ? "text-green-600" : "text-yellow-600"}`}>
                      {invite.status}
                    </td>
                    <td className="px-4 py-2 border">{invite.sent}</td>
                    <td className="px-4 py-2 border">{invite.completed || "-"}</td>
                    <td className="px-4 py-2 border space-x-2">
                      {invite.status === "Completed" ? (
                        <button className="text-blue-600 hover:underline">View Response</button>
                      ) : (
                        <>
                          <button className="text-indigo-600 hover:underline">Edit</button>
                          <button className="text-gray-600 hover:underline">Resend</button>
                        </>
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