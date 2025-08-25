import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/AdminSideBar";
import Footer from "@/components/Footer";

const ConfigAdminPage = () => {
  const [enableUserLogins, setEnableUserLogins] = useState(true);
  const [enableAssessments, setEnableAssessments] = useState(true);

  const handleSave = () => {
    // Simulate save operation
    alert("Configuration saved successfully!");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 p-6 bg-white">
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-6">Configuration Settings</h2>

            <div className="mb-4 flex items-center justify-between">
              <label htmlFor="enableUserLogins" className="font-medium">
                Enable User Logins
              </label>
              <input
                id="enableUserLogins"
                type="checkbox"
                checked={enableUserLogins}
                onChange={() => setEnableUserLogins(!enableUserLogins)}
                className="toggle toggle-primary"
              />
            </div>

            <div className="mb-6 flex items-center justify-between">
              <label htmlFor="enableAssessments" className="font-medium">
                Enable Assessments
              </label>
              <input
                id="enableAssessments"
                type="checkbox"
                checked={enableAssessments}
                onChange={() => setEnableAssessments(!enableAssessments)}
                className="toggle toggle-primary"
              />
            </div>

            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Configuration
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ConfigAdminPage;