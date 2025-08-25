

import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "Back to Dashboard", path: "/hiring-org/home" },
    { label: "Overview", path: "/hiring-org/admin" },
    { label: "Teams", path: "/hiring-org/admin/team" },
    { label: "Users", path: "/hiring-org/admin/users" },
    { label: "Billing & Usage", path: "/hiring-org/admin/billing" },
 
     { label: "Org Profile", path: "/hiring-org/admin/profile" },
  ];

  return (
    <div className="w-64 h-full bg-white border-r p-4">
      <h2 className="text-lg font-semibold mb-6 text-blue-700">Admin Panel</h2>
      <ul className="space-y-3">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block px-4 py-2 rounded flex items-center gap-2 ${
                currentPath === item.path
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              } ${item.label === "Back to Dashboard" ? "font-medium text-sm text-blue-800" : ""}`}
            >
              {item.label === "Back to Dashboard" && (
                <span className="text-base">←</span>
              )}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;