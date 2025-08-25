import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSend } from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MainSidebar from "@/components/MainSidebar";

// --- Mock Data with recruiter assignment ---
const currentRecruiter = { id: 100, name: "You" };


const mockTeamRecruiters = [
  { id: 1, name: "Samantha Lee", invites: [
    { candidate: "Raj Kumar", status: "Completed", assessment: "QA Engineer", date: "2024-06-02" },
    { candidate: "Neha Sinha", status: "Pending", assessment: "UI Designer", date: "2024-06-03" }
  ] },
  { id: 2, name: "Alex Kim", invites: [
    { candidate: "David Chen", status: "No Show", assessment: "DevOps Engineer", date: "2024-06-01" }
  ] },
  { id: 3, name: "Priya Patel", invites: [
    { candidate: "Arjun Mehta", status: "Completed", assessment: "Product Manager", date: "2024-05-30" }
  ] },
  // Add current recruiter as part of the team for "team" view
  // Invites for the current recruiter removed since mockInvites is removed
  { id: currentRecruiter.id, name: currentRecruiter.name, invites: [] }
];

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState<"invites" | "responses">("invites");
  // Global view mode state: "my" | "team"
  const [viewMode, setViewMode] = useState<"my" | "team" | "org">("my");
  const [activePage, setActivePage] = useState<"dashboard" | "assessments">("assessments");
  // Refactored: New filter state for assessments tab: "public" | "private" | "used"
  const [assessmentFilter, setAssessmentFilter] = useState<"public" | "private" | "used">("public");
  // Invites Sent tab quick filter state: "pending" | "completed" | "noShow" | "latest"

  const [searchTerm, setSearchTerm] = useState("");
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

  // --- Dynamic counts for assessments tabs ---
  // Used: count all assessments (private and public) that have hasInvites true
  const usedCount = mockAssessments.filter(a => a.hasInvites).length;
  const privateCount = mockAssessments.filter(a => a.type === "private").length;
  const publicCount = mockAssessments.filter(a => a.type === "public").length;


  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="z-50 relative border-b border-gray-200 bg-white">
          <Header />
        </div>
        <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 pt-20 pb-6">
            <div className="layout">
 
  <div className="content"> {/* your page content */} </div>
</div>
          {/* TODO: Replace with collapsible drawer for mobile view */}
          <MainSidebar />

          {/* Main Content */}
       <main className="flex-1 ml-0 md:ml-6 flex flex-col">
            {/* Welcome and Summary Section */}
              <div className="bg-white p-6 rounded-lg shadow mb-4">
            <h1 className="text-3xl font-bold mb-2 text-blue-800">Assessments</h1>
            <p className="text-sm text-gray-500">View and manage all your assessments here.</p>
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
            {activePage === "dashboard" ? (
              <>
                {/* Tab Content */}
             
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
              
                {/* Search bar at the top of the tabs section */}
                <div className="mb-5">
                  <input
                    type="text"
                    placeholder="Search Assessments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded w-full md:w-96 text-sm"
                  />
                </div>
                {/* Tab structure: Public, Private, Used Assessments */}
                <div className="flex gap-4 border-b mb-4">
                  <button
                    onClick={() => setAssessmentFilter("public")}
                    className={assessmentFilter === "public" ? "font-semibold border-b-2 border-blue-600 py-2 px-1" : "py-2 px-1"}
                  >
                    {`Public Assessments (${publicCount})`}
                  </button>
                  <button
                    onClick={() => setAssessmentFilter("private")}
                    className={assessmentFilter === "private" ? "font-semibold border-b-2 border-blue-600 py-2 px-1" : "py-2 px-1"}
                  >
                    {`Private Assessments (${privateCount})`}
                  </button>
                  <button
                    onClick={() => setAssessmentFilter("used")}
                    className={assessmentFilter === "used" ? "font-semibold border-b-2 border-blue-600 py-2 px-1" : "py-2 px-1"}
                  >
                    {`Used Assessments (${usedCount})`}
                  </button>
                </div>
                {/* Filtered arrays for each section */}
                {(() => {
                  // Arrays for each tab
                  const publicAssessments = mockAssessments.filter(a => a.type === "public");
                  const privateAssessments = mockAssessments.filter(a => a.type === "private");
                  // Used: hasInvites true, and (if My View, recruiter is current user, else all)
                  const usedAssessments = mockAssessments.filter(a =>
                    a.hasInvites === true &&
                    (viewMode === "my" ? true : true) // If you want recruiter-specific, add recruiter logic here
                  );
                  // Filter by search
                  const filterBySearch = (arr: typeof mockAssessments) =>
                    arr.filter(a =>
                      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                    );
                  let filtered: typeof mockAssessments = [];
                 
                  if (assessmentFilter === "public") {
                    filtered = filterBySearch(publicAssessments);
                   
                  } else if (assessmentFilter === "private") {
                    filtered = filterBySearch(privateAssessments);
                   
                  } else if (assessmentFilter === "used") {
                    filtered = filterBySearch(usedAssessments);
                   
                  }
                  return (
                    <div>
                     
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((assessment, idx) => (
                          <div key={idx} className="border rounded-lg p-4 bg-gray-50 hover:shadow">
                            {/* Assessment Card Header with Icon */}
                            <div className="assessment-header flex items-center gap-2 mb-2">
                              <FiSend size={22} className="send-icon text-blue-500 bg-blue-100 rounded-full p-1" />
                              <h4 className="font-semibold text-blue-700 text-lg">{assessment.title}</h4>
                            </div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center space-x-1">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                  {assessment.mode}
                                </span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded ${
                                    assessment.questionType === "Dynamic"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {assessment.questionType}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{assessment.description}</p>
                            <div className="flex flex-wrap gap-1 text-xs text-gray-700 mb-2">
                              {assessment.tags.map((tag, i) => (
                                <span key={i} className="bg-gray-200 px-2 py-0.5 rounded">{tag}</span>
                              ))}
                            </div>
                            <div className="text-xs text-gray-500">
                              Duration: <strong>{assessment.duration}</strong> | Level: <strong>{assessment.level}</strong>
                            </div>
                            
                            {/* Assessment Stats Section */}
                            {"hasInvites" in assessment && assessment.hasInvites === true && (
                              <div className="assessment-stats mt-3 mb-2 bg-white rounded px-3 py-2 border border-gray-200 flex flex-col gap-1">
                                <p className="text-xs text-gray-700 font-medium">
                                  Invites Sent: <span className="text-blue-600 font-semibold">120</span>
                                </p>
                                <p className="text-xs text-gray-700 font-medium">
                                  Completed: <span className="text-green-600 font-semibold">85</span>
                                </p>
                              </div>
                            )}
                            <Link
                              to="/hiring-org/assessment-invite"
                              className="mt-2 text-blue-600 hover:text-blue-800 p-2 rounded-full transition-colors inline-block"
                              title="Send Invite"
                              aria-label="Send Invite"
                            >
                              Send Invite
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}