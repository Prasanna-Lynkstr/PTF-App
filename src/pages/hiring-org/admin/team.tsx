import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Sidebar from "@/components/AdminSidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/utils/auth";

interface Team {
  id: number;
  name: string;
  isActive: boolean;
}

const TeamManagementPage = () => {
  const { user } = useAuth();
  const teamNameInputRef = useRef<HTMLInputElement>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [editingTeamName, setEditingTeamName] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  useEffect(() => {
    if (user?.roleName && user.roleName !== "orgAdmin") {
      window.location.href = "/unauthorized";
    }
  }, [user]);


  // Move fetchTeams outside useEffect to allow calling from anywhere
  const fetchTeams = async () => {
    if (!user) {
      return;
    }
    if (!user.organizationId) {
      toast.error("Organization ID not found");
      return;
    }
    try {
      const res = await fetch(`/api/org/${user.organizationId}/teams`);
      const debugText = await res.text();
      // Re-create the Response to allow downstream parsing
      const resClone = new Response(debugText, {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      });
      const contentType = resClone.headers.get("content-type");

      if (!resClone.ok) {
        const text = await resClone.text();
     
        toast.error("Failed to load teams: API Error");
        return;
      }

      if (contentType && contentType.includes("application/json")) {
        const json = await resClone.json();
        const mappedTeams = json.map((team: any) => ({
          id: team.id,
          name: team.teamName,
          isActive: team.isActive,
        }));
        setTeams(mappedTeams);
      } else {
        const raw = await resClone.text();
        toast.error("Failed to load teams: Invalid response format");
      }
    } catch (err) {
      toast.error("Failed to load teams");
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    if (!user.organizationId) {
      toast.error("Organization ID not found");
      return;
    }
    fetchTeams();
    teamNameInputRef.current?.focus();
  }, [user?.organizationId]);
  const addTeam = () => {
    if (!user || !user.organizationId) {
      toast.error("User or Organization ID not available");
      return;
    }

    if (!newTeamName.trim()) {
      toast.warning("Please enter a team name");
      return;
    }
    fetch(`/api/org/${user.organizationId}/create-team`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName: newTeamName }),
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          // Try to get error message from response body, fallback to generic error
          let errorText = "";
          if (contentType && contentType.includes("application/json")) {
            try {
              const json = await res.json();
              errorText = json?.message || "";
            } catch { /* ignore */ }
          } else {
            errorText = await res.text();
          }
          throw new Response(errorText || "Failed to add team", { status: res.status });
        }
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        } else {
          throw new Response("Invalid response format", { status: res.status });
        }
      })
      .then((data) => {
        setTeams([...teams, data]);
        setNewTeamName("");
        toast.success("Team added successfully");
        fetchTeams();
      })
      .catch(async (err) => {
        
        if (err instanceof Response) {
          const errorText = await err.text();
          toast.error(errorText || "Failed to add team");
        } else {
          toast.error("Failed to add team");
        }
      });
  };

  const updateTeam = (id: number, name: string) => {
    fetch(`/api/org/${user?.organizationId}/teams/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName: name }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        toast.success("Team updated successfully");
        fetchTeams();
      })
      .catch((err) => toast.error(err.message || "Failed to update team"));
  };

  const deactivateTeam = (id: number, isActive: boolean) => {
    fetch(`/api/org/${user?.organizationId}/teams/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        toast.success(`Team ${isActive ? "deactivated" : "activated"} successfully`);
        fetchTeams();
      })
      .catch((err) => toast.error(err.message || "Failed to update status"));
  };

  const deleteTeam = (id: number) => {
    fetch(`/api/org/${user?.organizationId}/teams/${id}`, { method: "DELETE" })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        toast.success("Team deleted");
        fetchTeams();
      })
      .catch((err) => toast.error(err.message || "Failed to delete team"));
  };

  const filteredTeams = teams.filter((team) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return team.isActive;
    if (statusFilter === "inactive") return !team.isActive;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 pb-6">
        <Sidebar />
        <main className="relative flex-grow p-6 bg-gray-50">
          <h2 className="text-3xl font-extrabold mb-6 text-indigo-800">Team Management</h2>

          <div className="flex mb-6">
            <input
              ref={teamNameInputRef}
              type="text"
              className="border p-2 rounded-l w-64"
              placeholder="Enter team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTeam();
                }
              }}
            />
            <button
              onClick={addTeam}
              className="bg-blue-600 text-white px-4 rounded-r"
            >
              Add Team
            </button>
          </div>

          <div className="mb-4">
            <label htmlFor="statusFilter" className="mr-2 font-medium">Filter by Status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="all">All</option>
            </select>
          </div>

          <table className="w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Team Name</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team) => {
                const isEditing = editingTeamId === team.id;
                return (
                  <tr key={team.id} className="text-center">
                    <td className="border px-4 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          className="border p-1 w-full"
                          value={editingTeamName}
                          onChange={(e) => setEditingTeamName(e.target.value)}
                        />
                      ) : (
                        <span>{team.name}</span>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {team.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      {isEditing ? (
                        <button
                          onClick={() => {
                            updateTeam(team.id, editingTeamName);
                            setEditingTeamId(null);
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                        >
                          Update
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingTeamId(team.id);
                            setEditingTeamName(team.name);
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => {
                          deactivateTeam(team.id, team.isActive);
                        }}
                        className={`px-3 py-1 rounded text-white transition ${
                          team.isActive
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {team.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => deleteTeam(team.id)}
                        className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredTeams.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </main>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default TeamManagementPage;
