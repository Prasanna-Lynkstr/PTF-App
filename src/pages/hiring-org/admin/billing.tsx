import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/AdminSidebar";

const BillingPage = () => {
  const [walletBalance, setWalletBalance] = useState(4850);
  const [showRateCard, setShowRateCard] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const rateCard = [
    { feature: "MCQ Assessment", rate: 50 },
    { feature: "Video Assessment", rate: 200 },
    { feature: "Resume Screening", rate: 10 },
   
  ];

  const usageHistory = [
    { date: "Jul 23", action: "Resume Analysis", candidate: "John Doe", rate: 10, balanceAfter: 4850, recruiter: "Anita" },
    { date: "Jul 23", action: "Video Assessment", candidate: "Jane Smith", rate: 200, balanceAfter: 4860, recruiter: "Kumar" },
    { date: "Jul 22", action: "MCQ Assessment", candidate: "Rahul Roy", rate: 50, balanceAfter: 5060, recruiter: "Ravi" },
  ];

  const handleTopUp = () => {
    alert("Redirecting to top-up...");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">Billing & Usage</h2>
          <div className="mb-6 flex items-center justify-between bg-white shadow p-4 rounded border">
            <div>
              <div className="text-gray-600">Wallet Balance</div>
              <div className="text-3xl font-bold text-green-600">₹{walletBalance}</div>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
              onClick={handleTopUp}
            >
              Top Up Balance
            </button>
          </div>

          <div className="bg-white shadow rounded p-4 mb-6 border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Rate Card</h3>
              <button
                onClick={() => setShowRateCard(!showRateCard)}
                className="text-blue-600 underline text-sm"
              >
                {showRateCard ? "Hide Rate Card" : "Show Rate Card"}
              </button>
            </div>
            {showRateCard && (
              <table className="w-full table-auto text-xs">
                <thead className="bg-gray-100">
                  <tr className="">
                    <th className="px-3 py-2 text-left first:rounded-tl-md last:rounded-tr-md">Feature</th>
                    <th className="px-3 py-2 text-left last:rounded-tr-md">Rate (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {rateCard.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-t even:bg-gray-50 odd:bg-white hover:bg-blue-50"
                    >
                      <td className="px-3 py-2">{item.feature}</td>
                      <td className="px-3 py-2">{item.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-white shadow rounded p-4 border">
            <h3 className="text-lg font-semibold mb-2">Last 10 Transactions</h3>
            <table className="w-full table-auto text-xs">
              <thead className="bg-gray-100">
                <tr className="">
                  <th className="px-3 py-2 text-left first:rounded-tl-md">Date</th>
                  <th className="px-3 py-2 text-left">Feature</th>
                  <th className="px-3 py-2 text-left">Candidate</th>
                  <th className="px-3 py-2 text-left">Cost (₹)</th>
                  <th className="px-3 py-2 text-left">Balance After (₹)</th>
                  <th className="px-3 py-2 text-left last:rounded-tr-md">Recruiter</th>
                </tr>
              </thead>
              <tbody>
                {usageHistory.map((log, idx) => (
                  <tr
                    key={idx}
                    className="border-t even:bg-gray-50 odd:bg-white hover:bg-blue-50"
                  >
                    <td className="px-3 py-2">{log.date}</td>
                    <td className="px-3 py-2">{log.action}</td>
                    <td className="px-3 py-2">{log.candidate}</td>
                    <td className="px-3 py-2">{log.rate}</td>
                    <td className="px-3 py-2">{log.balanceAfter}</td>
                    <td className="px-3 py-2">{log.recruiter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className="bg-white shadow rounded p-4 border mt-6">
            <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
            <div className="flex gap-4 items-center mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input type="date" className="border rounded px-2 py-1" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input type="date" className="border rounded px-2 py-1" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <table className="w-full table-auto text-xs">
              <thead className="bg-gray-100">
                <tr className="">
                  <th className="px-3 py-2 text-left first:rounded-tl-md">Opening Balance (₹)</th>
                  <th className="px-3 py-2 text-left">Feature</th>
                  <th className="px-3 py-2 text-left">Candidate</th>
                  <th className="px-3 py-2 text-left">Cost (₹)</th>
                  <th className="px-3 py-2 text-left">Balance After (₹)</th>
                  <th className="px-3 py-2 text-left last:rounded-tr-md">Recruiter</th>
                </tr>
              </thead>
              <tbody>
                {usageHistory
                  .filter(log => {
                    const logDate = new Date(`2024 ${log.date}`);
                    const start = startDate ? new Date(startDate) : null;
                    const end = endDate ? new Date(endDate) : null;
                    return (!start || logDate >= start) && (!end || logDate <= end);
                  })
                  .map((log, idx) => (
                  <tr
                    key={idx}
                    className="border-t even:bg-gray-50 odd:bg-white hover:bg-blue-50"
                  >
                    <td className="px-3 py-2">{log.balanceAfter + log.rate}</td>
                    <td className="px-3 py-2">{log.action}</td>
                    <td className="px-3 py-2">{log.candidate}</td>
                    <td className="px-3 py-2">{log.rate}</td>
                    <td className="px-3 py-2">{log.balanceAfter}</td>
                    <td className="px-3 py-2">{log.recruiter}</td>
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
};

export default BillingPage;
