import { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "@/utils/auth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MainSidebar from "@/components/MainSidebar";

export default function Settings() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleSave = async () => {
    setSubmitted(true);

    if (!fullName.trim()) {
      return;
    }

    if (showPasswordSection) {
      if (!currentPassword.trim()) {
        return;
      }
      if (!newPassword.trim()) {
        return;
      }
      if (!confirmPassword.trim()) {
        return;
      }
      if (newPassword !== confirmPassword) {
        return;
      }
    }


    // Call GPT-powered API for updating user's full name and password
    const payload: any = { fullName };
    if (showPasswordSection) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    try {
      const response = await fetch(`/api/user/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Profile updated successfully!");
      } else {
        const message = result.message || result.error || "Failed to update profile.";
        toast.error(message);
      }
    } catch (err: any) {
      if (err instanceof Error) {
        toast.error(err.message || 'Failed to update profile.');
      } else {
        toast.error('Failed to update profile.');
      }
    }
  };

  useEffect(() => {
    // Simulate API call to fetch profile
    const fetchProfile = async () => {
      const userId = user?.id;
      if (!userId) return;
      try {
        const res = await fetch(`/api/user/${userId}`);
        const data = await res.json();
        setFullName(data.fullName);
        setEmail(data.email);
        document.getElementById("fullName")?.focus();
      } catch (error) {
        // error handling
      }
    };
    fetchProfile();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="z-50 relative border-b border-gray-200 bg-white">
        <Header />
      </div>
     <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 pb-6">
        <MainSidebar />
        <main className="flex-1">
          <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Account Settings</h1>
            <div className="bg-white shadow-md rounded-md p-6">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Profile Information</h2>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
                {submitted && !fullName.trim() && (
                  <p className="text-sm text-red-500 mt-1">Full Name cannot be blank.</p>
                )}
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <h2 className="text-lg font-medium text-gray-700 mb-4">Security</h2>
              <button
                onClick={() => {
                  setShowPasswordSection(!showPasswordSection);
                  setTimeout(() => {
                    currentPasswordRef.current?.focus();
                    currentPasswordRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 0);
                }}
                className="text-sm text-blue-600 underline mb-4"
              >
                {showPasswordSection ? "Hide Password Section" : "Change Password"}
              </button>
              {showPasswordSection && (
                <>
                  <div className="mb-4">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      ref={currentPasswordRef}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter current password"
                    />
                    {submitted && currentPassword.trim() === "" && (
                      <p className="text-sm text-red-500 mt-1">Current password is required.</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter new password"
                    />
                    {submitted && newPassword.trim() === "" && (
                      <p className="text-sm text-red-500 mt-1">New password is required.</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Retype new password"
                    />
                    {submitted && confirmPassword.trim() === "" && (
                      <p className="text-sm text-red-500 mt-1">Please confirm your new password.</p>
                    )}
                    {submitted && newPassword !== confirmPassword && confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">New password and confirm password do not match.</p>
                    )}
                  </div>
                </>
              )}

              <div className="text-right">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}