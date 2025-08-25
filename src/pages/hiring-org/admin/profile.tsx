import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/utils/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import { saveOrgImage } from "@/utils/upload"; // Adjust the path if different
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CompanyProfileCard from "@/components/CompanyProfileCard";

const Profile = () => {
 const { user } = useAuth();
  const navigate = useNavigate();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [about, setAbout] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [website, setWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [yearOfFounding, setYearOfFounding] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [numEmployees, setNumEmployees] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setLogoFile(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      setCoverFile(file);
    }
  };

  useEffect(() => {
    if (user && user.roleName !== "orgAdmin") {
      navigate("/unauthorized");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.organizationId) return;

      try {
        const response = await fetch(`/api/org/${user.organizationId}/profile`);
        let data: any = {};
        if (response.ok) {
          const text = await response.text();
          data = text ? JSON.parse(text) : {};
        } else if (response.status === 404) {
          console.warn("No profile data found, loading empty form.");
        } else {
          throw new Error("Failed to fetch profile");
        }

        setAbout(data.about || "");
        setMission(data.mission || "");
        setVision(data.vision || "");
        setWebsite(data.website || "");
        setContactEmail(data.contactEmail || "");
        setContactPhone(data.contactPhone || "");
        setYearOfFounding(data.yearFounded || "");
        setHeadquarters(data.headquarters || "");
        setNumEmployees(data.numberOfEmployees || "");
        setCompanyType(data.orgType || "");
        if (data.logoUrl) setLogoPreview(data.logoUrl);
        if (data.coverImageUrl) setCoverPreview(data.coverImageUrl);
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile data.");
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let logoUrl = null;
      let coverImageUrl = null;

      if (logoFile) {
        logoUrl = await saveOrgImage(logoFile, user?.organizationId || "default", "logo");
      }

      if (coverFile) {
        coverImageUrl = await saveOrgImage(coverFile, user?.organizationId || "default", "cover");
      }

      const payload = {
        about,
        mission,
        vision,
        website,
        contactEmail,
        contactPhone,
        yearFounded:yearOfFounding,
        headquarters,
        numberOfEmployees: numEmployees,
        orgType: companyType,
        logoUrl,
        coverImageUrl,
      };

      // Get orgId from session and debug log
      const orgId = user?.organizationId;
      if (!orgId) {
        toast.error("Organization ID not found in session.");
        return;
      }

      const url = `/api/org/${orgId}/profile`;

      const response = await fetch(`/api/org/${orgId}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");

      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response format. Raw response: ${text}`);
      }

      if (response.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result?.message || "Failed to update profile.");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Error: ${err.message}`);
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  const [showModal, setShowModal] = useState(false);

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    };

    if (showModal) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 pb-6">
        <AdminSidebar />
        <main className="relative flex-grow p-6 bg-gray-50">
          <h2 className="text-3xl font-extrabold mb-6 text-indigo-800">Organization Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-white shadow-md rounded-lg p-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block">
                <span className="text-blue-800 font-medium">Upload Logo (Recommended: 300x80)</span>
                <input onChange={handleLogoChange} type="file" accept="image/*" className="bg-white border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 mt-1 block w-full" />
                {logoPreview && <img src={logoPreview} alt="Logo Preview" className="mt-2 max-h-20 object-contain border rounded-md" />}
              </label>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block">
                <span className="text-blue-800 font-medium">Upload Cover Image (Recommended: 1584x396)</span>
                <input onChange={handleCoverChange} type="file" accept="image/*" className="bg-white border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 mt-1 block w-full" />
                {coverPreview && <img src={coverPreview} alt="Cover Preview" className="mt-2 w-full max-h-48 object-cover border rounded-md" />}
              </label>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block">
                <span className="text-blue-800 font-medium">About <span className="text-red-500">*</span></span>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="text-base p-3 bg-white border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 form-textarea mt-1 block w-full"
                  rows={4}
                  required
                ></textarea>
              </label>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block">
                <span className="text-blue-800 font-medium">Mission</span>
                <textarea
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  className="text-base p-3 bg-white border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 form-textarea mt-1 block w-full"
                  rows={4}
                ></textarea>
              </label>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block">
                <span className="text-blue-800 font-medium">Vision</span>
                <textarea
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  className="text-base p-3 bg-white border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 form-textarea mt-1 block w-full"
                  rows={4}
                ></textarea>
              </label>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block">
                <span className="text-blue-800 font-medium">Website <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="text-base p-3 bg-white border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 form-input mt-1 block w-full"
                  required
                />
              </label>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block">
                <span className="text-blue-800 font-medium">Contact Email</span>
                <input
                  type="text"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="text-base p-3 bg-white border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 form-input mt-1 block w-full"
                />
              </label>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block">
                <span className="text-blue-800 font-medium">Contact Phone</span>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="text-base p-3 bg-white border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 form-input mt-1 block w-full"
                />
              </label>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block">
                <span className="text-blue-800 font-medium">Year of Founding <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  value={yearOfFounding}
                  onChange={(e) => setYearOfFounding(e.target.value)}
                  className="text-base p-3 bg-white border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 form-input mt-1 block w-full"
                  required
                />
              </label>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block">
                <span className="text-blue-800 font-medium">Headquarters <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  value={headquarters}
                  onChange={(e) => setHeadquarters(e.target.value)}
                  className="text-base p-3 bg-white border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 form-input mt-1 block w-full"
                  required
                />
              </label>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block">
                <span className="text-blue-800 font-medium">No. of Employees <span className="text-red-500">*</span><span className="text-sm text-gray-500">(e.g., 15-20, 20-50, 50-100)</span></span>
                <input
                  type="text"
                  value={numEmployees}
                  onChange={(e) => setNumEmployees(e.target.value)}
                  className="text-base p-3 bg-white border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 form-input mt-1 block w-full"
                  required
                />
              </label>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block">
                <span className="text-blue-800 font-medium">Company Type <span className="text-red-500">*</span> <span className="text-sm text-gray-500">(e.g., Private Limited, Public Listed, etc.)</span></span>
                <input
                  type="text"
                  value={companyType}
                  onChange={(e) => setCompanyType(e.target.value)}
                  className="text-base p-3 bg-white border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 form-input mt-1 block w-full"
                  required
                />
              </label>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700"
            >
              Save Profile
            </button>
          </form>
        
        
          {user?.organizationId && (
            <div className="absolute right-6 top-24 w-48 h-48 shadow-lg rounded overflow-hidden border border-gray-200 bg-white hover:cursor-pointer"
                 onClick={() => setShowModal(true)}>
              <div className="scale-[0.25] origin-top-left transform w-[400%] h-[400%] pointer-events-none">
                <CompanyProfileCard orgId={user.organizationId} />
              </div>
            </div>
          )}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-hidden" onClick={() => setShowModal(false)}>
              <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 overflow-x-hidden" onClick={(e) => e.stopPropagation()}>
                <CompanyProfileCard orgId={user.organizationId} />
              </div>
            </div>
          )}
        </main>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Profile;