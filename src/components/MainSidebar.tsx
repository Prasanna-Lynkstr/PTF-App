import { Link, useLocation } from "react-router-dom";
import { FiHome, FiFileText, FiUsers, FiBarChart2, FiSettings, FiMail, FiCheckCircle } from "react-icons/fi";

const MainSidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", href: "/hiring-org/home", icon: <FiHome /> },
    { name: "Assessments", href: "/hiring-org/assessment", icon: <FiFileText /> },
    { name: "Invites", href: "/hiring-org/invites", icon: <FiMail /> },
    { name: "Responses", href: "/hiring-org/responses", icon: <FiCheckCircle /> },
    { name: "Candidates", href: "/hiring-org/candidates", icon: <FiUsers /> },
    { name: "Reports", href: "/hiring-org/reports", icon: <FiBarChart2 /> },
    { name: "Settings", href: "/hiring-org/settings", icon: <FiSettings /> },
    { name: "Admin Panel", href: "/hiring-org/admin", icon: <FiSettings /> },
    
  ];

  return (
    <div className="w-64 bg-white border-r min-h-screen mt-16 p-4">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link to={item.href}>
              <div
                className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                  location.pathname === item.href ? "bg-gray-100 font-medium" : ""
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainSidebar;