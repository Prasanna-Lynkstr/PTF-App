import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MainSidebar from "@/components/MainSidebar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("If the email exists, a new password will be sent.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to send request. Please check your connection.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="z-50 relative border-b border-gray-200 bg-white">
        <Header />
      </div>
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 pt-20 pb-6 sm:px-6 lg:px-8">
      
        <main className="flex-1">
          <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Forgot Password</h2>
            <p className="text-sm text-gray-600 mb-6">
              Enter your email address below. If it exists in our system, you will receive an auto-generated password via email. 
              Please check your inbox, spam, or other folders. It may take 5–10 minutes for the email to arrive.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  ref={emailRef}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
              >
                Send Reset Password
              </button>
              <div className="text-center mt-4">
                <a href="/hiring-org/" className="text-sm text-indigo-600 hover:underline">
                  Back to Login
                </a>
              </div>
            </form>
          </div>
        </main>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
}