import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Sidebar from "@/components/AdminSidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/utils/auth";

type User = {
  id: number | string;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
  teamId?: string;
  isEditing?: boolean;
};

type Role = {
  id: string;
  name: string;
};

  const AdminUserPage: React.FC = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [userFilter, setUserFilter] = useState<"all" | "active" | "inactive">("active");
    const [newUser, setNewUser] = useState({ name: '', email: '', roleId: '', teamId: '', active: true, password: '' });
    const [roles, setRoles] = useState<Role[]>([]);
    const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const organizationId = user?.organizationId;
    const nameInputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (user?.roleName && user.roleName !== "orgAdmin") {
        window.location.href = "/unauthorized";
      }
    }, [user]);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!organizationId) return;
      try {
        const res = await fetch(`/api/user/org/${organizationId}/roles`);
        const data = await res.json();
        if (data.length > 0) {
          setRoles(data);
          const defaultRole = data.find(role => role.name.toLowerCase() === 'recruiter') || data[0];
          setNewUser(prev => ({
            ...prev,
            roleId: defaultRole.id,
          }));
        }
      } catch (err) {
        if (err instanceof Error) {
          toast.error(`Error: ${err.message}`);
        } else {
          toast.error("Unexpected error occurred.");
        }
      }
    };

    fetchRoles();
  }, [organizationId]);

  // Fetch teams when organizationId changes
  useEffect(() => {
    const fetchTeams = async () => {
      if (!organizationId) return;
      try {
        const res = await fetch(`/api/org/${organizationId}/teams`);
        const debugText = await res.text();
        const resClone = new Response(debugText, {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
        });

        if (!resClone.ok) {
          toast.error("Error fetching teams");
          return;
        }

        const contentType = resClone.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await resClone.json();
          setTeams(data.map((team: any) => ({ id: team.id, name: team.teamName })));
        }
      } catch (err) {
        if (err instanceof Error) {
          toast.error(`Error: ${err.message}`);
        } else {
          toast.error("Unexpected error occurred.");
        }
      }
    };

    fetchTeams();
  }, [organizationId]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/user/org/${organizationId}/user`);
      const data = await res.json();
      const mappedUsers = data.map((user: any) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.roleName || 'Recruiter',
        active: user.isActive,
        teamId: user.teamId,
      }));
      setUsers(mappedUsers);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Error: ${err.message}`);
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    if (organizationId) fetchUsers();
  }, [organizationId]);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast.warn("Please enter both name and email.");
      return;
    }

    if (!newUser.password.trim()) {
      toast.warn("Please enter a password.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?!gmail\.com$|yahoo\.com$|hotmail\.com$)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error("Please enter a valid business email address.");
      return;
    }

    if (!newUser.teamId.trim()) {
      toast.warn("Please select a team.");
      return;
    }


    try {
      const res = await fetch(`/api/user/org/${organizationId}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newUser.name,
          email: newUser.email,
          password: newUser.password,
          roleId: newUser.roleId,
          teamId: newUser.teamId,
          isActive: newUser.active,
          isEmailVerified: true,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add user.");
      }

      const data = await res.json();
      setUsers(prev => [...prev, data]);
      setNewUser({ name: '', email: '', roleId: roles.length > 0 ? roles[0].id : '', teamId: '', active: true, password: '' });
      toast.success("User added successfully.");
      fetchUsers();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Error: ${err.message}`);
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  const toggleEdit = (id: number) => {
    setUsers(prev =>
      prev.map(user => (user.id === id ? { ...user, isEditing: !user.isEditing } : user))
    );
  };

  const updateUser = (id: number, field: keyof User, value: string | boolean) => {
    setUsers(prev =>
      prev.map(user => (user.id === id ? { ...user, [field]: value } : user))
    );
  };

  const saveUser = async (id: number) => {
    const userToUpdate = users.find(u => u.id === id);
    if (!userToUpdate) return;
    // Transform role and team to roleId and teamId
    const roleId = roles.find(r => r.name === userToUpdate.role)?.id;
    const teamId =
      typeof userToUpdate.teamId === "string"
        ? userToUpdate.teamId
        : teams.find(t => t.name === (userToUpdate as any).team)?.id;
    // Prepare payload: replace role and team with roleId and teamId
    const payload: any = {
      ...userToUpdate,
      roleId,
      teamId,
    };
    delete payload.role;
    delete payload.team;
    try {
      await fetch(`/api/user/org/${id}/user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setUsers(prev =>
        prev.map(user => (user.id === id ? { ...user, isEditing: false } : user))
      );
      toast.success("User updated successfully.");
      fetchUsers(); // Ensures images and user list are refreshed
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Error: ${err.message}`);
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  const toggleActive = async (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    try {
      const roleId = roles.find(r => r.name === user.role)?.id;
      const res = await fetch(`/api/user/org/${id}/user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          roleId: roleId,
          teamId: user.teamId,
          isActive: !user.active,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to toggle active status.');
      }

      setUsers(prev =>
        prev.map(user => (user.id === id ? { ...user, active: !user.active } : user))
      );
      toast.success(`User ${!user.active ? "activated" : "deactivated"} successfully.`);
      fetchUsers(); // Ensures images and user list are refreshed
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Error: ${err.message}`);
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const res = await fetch(`/api/user/org/${id}/user`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete user.');
      }
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success("User deleted successfully.");
      fetchUsers(); // Ensures images and user list are refreshed
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Error: ${err.message}`);
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 pb-6">
        <Sidebar />
        <main className="relative flex-grow p-6 bg-gray-50">
          <form className="space-y-4 max-w-5xl w-full bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-semibold mb-6">User Management</h1>

            <div className="p-4 bg-blue-50 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Add New User</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="name" className="mb-1 font-medium">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={newUser.name}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-3 py-2"
                    ref={nameInputRef}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="mb-1 font-medium">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addUser();
                      }
                    }}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="mb-1 font-medium">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={newUser.password}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addUser();
                        }
                      }}
                      className="border border-gray-300 rounded px-3 py-2 w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-blue-600"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="role" className="mb-1 font-medium">Role</label>
                  <select
                    id="role"
                    name="roleId"
                    value={newUser.roleId ?? ""}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="team" className="mb-1 font-medium">Team</label>
                  <select
                    id="team"
                    name="teamId"
                    value={newUser.teamId ?? ""}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select Team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                <button
                  type="button"
                  onClick={addUser}
                  className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add User
                </button>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Existing Users</h2>
              {/* Filter Dropdown */}
              <div className="flex items-center mb-4">
                <div className="flex items-center space-x-2">
                  <label htmlFor="userFilter" className="mr-2 font-medium">Show Users:</label>
                  <select
                    id="userFilter"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value as "all" | "active" | "inactive")}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Role / Team</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(user =>
                        userFilter === "all"
                          ? true
                          : userFilter === "active"
                          ? user.active
                          : !user.active
                      )
                      .map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {user.isEditing ? (
                            <>
                              <input
                                type="text"
                                value={user.fullName}
                                onChange={e => updateUser(user.id, 'fullName', e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 mb-1 w-full"
                              />
                              <input
                                type="email"
                                value={user.email}
                                onChange={e => updateUser(user.id, 'email', e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                              />
                            </>
                          ) : (
                            <div>
                              <div className="font-medium">{user.fullName}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {user.isEditing ? (
                            <>
                              <select
                                value={user.role ?? ""}
                                onChange={e => updateUser(user.id, 'role', e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 w-full mb-1"
                              >
                                {roles.map(role => (
                                  <option key={role.id} value={role.name}>
                                    {role.label}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={(user as any).teamId ?? ""}
                                onChange={e => updateUser(user.id, 'teamId', e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                              >
                                <option value="">Select Team</option>
                                {teams.map(team => (
                                  <option key={team.id} value={team.id}>
                                    {team.name}
                                  </option>
                                ))}
                              </select>
                            </>
                          ) : (
                            <div>
                              <div className="font-medium">{user.role}</div>
                              <div className="text-sm text-gray-500">
                                {teams.find(team => team.id === (user as any).teamId)?.name || "—"}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {user.active ? 'Active' : 'Inactive'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 space-x-2">
                          {user.isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => saveUser(user.id)}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                              >
                                Update
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleEdit(user.id)}
                                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => toggleEdit(user.id)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleActive(user.id)}
                                className={`px-3 py-1 rounded text-white transition ${
                                  user.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                                }`}
                              >
                                {user.active ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteUser(user.id)}
                                className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 transition"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                    {users.filter(user =>
                        userFilter === "all"
                          ? true
                          : userFilter === "active"
                          ? user.active
                          : !user.active
                      ).length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-gray-500">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </main>
      </div>
      <Footer />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AdminUserPage;