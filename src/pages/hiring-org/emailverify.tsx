import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function EmailVerify() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/org/verify-email-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification failed. Please try again.");
      }

      toast.success("Email verified successfully!");
      window.location.href = "/hiring-org/home";
    } catch (error: any) {
      const message =
        error?.message || "Verification failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="z-50 relative border-b border-gray-200 bg-white">
        <Header />
      </div>
      <div className="flex flex-1 items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8 w-full max-w-md border border-gray-200"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
            Verify Your Email
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            A verification code has been sent to <strong>{email}</strong>. Please check your inbox or spam folder. 
            If you haven't received the code yet, please wait a few minutes. Once received, enter the code below to verify your email and proceed.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              className="w-full px-4 py-2 border rounded bg-gray-100 text-gray-600 cursor-not-allowed"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter the code"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Verify Code
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                const response = await fetch("/api/org/resend-verification", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email }),
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || "Failed to resend code.");
                }

                toast.success(`Verification code resent to ${email}`);
              } catch (error: any) {
                const message = error?.message || "Failed to resend code.";
                toast.error(message);
              }
            }}
            className="w-full mt-4 border border-indigo-600 text-indigo-600 py-2 rounded hover:bg-indigo-50 transition"
          >
            Resend Verification Code
          </button>
        </form>
    </div>
    <ToastContainer position="top-center" autoClose={3000} />
    <Footer />
  </div>
  );
}