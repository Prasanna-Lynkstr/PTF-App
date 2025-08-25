import React, { useState } from 'react';
import Select from 'react-select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MainSidebar from "@/components/MainSidebar";

const AssessmentInvite = () => {
  const [assessment, setAssessment] = useState('');
  const [coverMessage, setCoverMessage] = useState('');
  const [emails, setEmails] = useState('');
  const [file, setFile] = useState<File | null>(null);

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

  const handleSubmit = () => {
    // Implement submission logic
    alert('Invites sent!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="z-50 relative border-b border-gray-200 bg-white">
        <Header />
      </div>
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 pt-20 pb-6">
        <MainSidebar />
        <main className="flex-1">
          <div className="bg-white rounded-xl shadow-lg px-10 py-10">
            <h2 className="text-3xl font-bold mb-8 text-blue-800">Invite Candidates to Assessment</h2>

            {/* Select Assessment Section */}
            <section className="mb-8">
              <label className="block mb-3 text-lg font-semibold text-gray-700">Select Assessment:</label>
              <Select
                options={[
                  {
                    label: 'Public Assessments',
                    options: DummyData.filter(a => a.type === 'public').map(a => ({
                      label: a.title,
                      value: a.title,
                    })),
                  },
                  {
                    label: 'Private Assessments',
                    options: DummyData.filter(a => a.type === 'private').map(a => ({
                      label: a.title,
                      value: a.title,
                    })),
                  },
                ]}
                onChange={(selectedOption) => setAssessment(selectedOption?.value || '')}
                placeholder="Search and select an assessment..."
                isClearable
                className="text-base"
              />
            </section>

            {/* Assessment Details */}
            {assessment && (
              <section className="border border-blue-200 rounded-lg p-6 mb-10 bg-blue-50">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Assessment Details</h3>
                {(() => {
                  const selected = DummyData.find(a => a.title === assessment);
                  return selected ? (
                    <ul className="text-gray-800 space-y-1 text-base">
                      <li><span className="font-medium text-gray-700">Description:</span> {selected.description}</li>
                      <li><span className="font-medium text-gray-700">Mode:</span> {selected.mode}</li>
                      <li><span className="font-medium text-gray-700">Duration:</span> {selected.duration}</li>
                      <li><span className="font-medium text-gray-700">Level:</span> {selected.level}</li>
                      <li><span className="font-medium text-gray-700">Tags:</span> {selected.tags.join(', ')}</li>
                      <li><span className="font-medium text-gray-700">Question Type:</span> {selected.questionType}</li>
                      <li><span className="font-medium text-gray-700">Type:</span> {selected.type}</li>
                    </ul>
                  ) : null;
                })()}
              </section>
            )}

            {/* Cover Message */}
            <section className="mb-8">
              <label className="block mb-3 text-lg font-semibold text-gray-700">Cover Message:</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
                rows={4}
                value={coverMessage}
                onChange={(e) => setCoverMessage(e.target.value)}
                placeholder="Enter your message here..."
              />
            </section>

            {/* Candidate Emails */}
            <section className="mb-8">
              <label className="block mb-3 text-lg font-semibold text-gray-700">Enter Candidate Emails (comma separated):</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
                rows={3}
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="e.g., john@example.com, jane@example.com"
              />
            </section>

            {/* Upload File */}
            <section className="mb-10">
              <label className="block mb-3 text-lg font-semibold text-gray-700">Or Upload Excel File:</label>
              <input
                type="file"
                accept=".xlsx"
                className="block w-full text-base text-gray-700 border border-gray-300 rounded-lg cursor-pointer py-2 px-3"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </section>

            {/* Action Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white text-lg font-semibold px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition-all duration-150"
              >
                Send Invites
              </button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AssessmentInvite;