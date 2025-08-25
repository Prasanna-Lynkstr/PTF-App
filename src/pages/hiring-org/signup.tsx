import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HiringOrgSignup = () => {
  const navigate = useNavigate();
  const fullNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fullNameRef.current?.focus();
  }, []);
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    officialWebsite: '',
  });

  const [verificationDocFile, setVerificationDocFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVerificationDocFile(e.target.files[0]);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else {
      // Business email validation
      const businessEmailRegex = /^[^@]+@(?!gmail\.com$|yahoo\.com$|hotmail\.com$|outlook\.com$)[^@]+\.[^@]+$/i;
      if (!businessEmailRegex.test(formData.email)) {
        newErrors.email = 'Please use your business email (e.g., name@company.com)';
      }
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach(err => toast.error(err));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        let verificationDocumentUrl = '';
        if (verificationDocFile) {
          const uploadForm = new FormData();
          uploadForm.append('file', verificationDocFile);
          const uploadRes = await fetch('/api/upload?path=hiring-org/verification-docs', {
            method: 'POST',
            body: uploadForm
          });
          if (!uploadRes.ok) throw new Error('File upload failed');
          const uploadData = await uploadRes.json();
          verificationDocumentUrl = uploadData.url;
        }

        const payload = {
          fullName: formData.fullName,
          companyName: formData.companyName,
          email: formData.email,
          password: formData.password,
          officialWebsite: formData.officialWebsite || '',
          acceptTerms: formData.acceptTerms,
          ...(verificationDocumentUrl && { verificationDocumentUrl }),
        };

        const res = await fetch('/api/org', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw res;

        const data = await res.json();
        toast.success('Signup successful! Please verify your email.', { autoClose: 3000 });
       setTimeout(() => {
  navigate(`/hiring-org/emailverify?email=${encodeURIComponent(formData.email)}`);
}, 3000);
      } catch (err) {
        if (err instanceof Response) {
          try {
            const errorJson = await err.json();
            const message = errorJson.message || errorJson.error || 'Signup failed. Please try again.';
            toast.error(message);
          } catch {
            toast.error('Signup failed. Please try again.');
          }
        } else if (err instanceof Error) {
          toast.error(err.message || 'Signup failed. Please try again.');
        } else {
          toast.error('Signup failed. Please try again.');
        }
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50">
        <div className="flex items-center justify-center bg-blue-100 p-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-blue-800 mb-4">Welcome to Scryyn</h2>
            <p className="text-gray-700 text-base">
              Simplify your hiring process and find your perfect fit—faster. Join other forward-thinking organizations using Scryyn to build better teams.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md bg-white shadow-md rounded-lg p-2">
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Create your Scryyn Account</h2>
            <p className="text-center text-gray-500 text-xs mb-2">For Organizations signing up to hire with Scryyn</p>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  ref={fullNameRef}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                {errors.fullName && <p className="text-red-500 mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                {errors.companyName && <p className="text-red-500 mt-1">{errors.companyName}</p>}
              </div>

              {/* Organization Details Section */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Organization Details</h3>
                <label className="block font-medium text-gray-700 mb-1">
                  Official Website <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  name="officialWebsite"
                  value={formData.officialWebsite || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="https://yourcompany.com"
                />
              </div>


              <div>
                <label className="block font-medium text-gray-700 mb-1">Work Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                {errors.confirmPassword && <p className="text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-gray-600">
                  I accept the{' '}
                  <button
                    type="button"
                    className="text-blue-600 underline"
                    onClick={() => setShowTermsModal(true)}
                  >
                    Terms and Conditions
                  </button>
                </label>
              </div>
              {errors.acceptTerms && <p className="text-red-500 mt-1">{errors.acceptTerms}</p>}

              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  className="w-full max-w-xs bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold"
                  disabled={!formData.acceptTerms}
                >
                  Sign Up
                </button>
              </div>
            </form>
            <p className="text-center mt-6 text-gray-600 text-xs">
              Already have an account?{' '}
              <a href="/hiring-org" className="text-blue-600 hover:underline">
                Login
              </a>
            </p>
            {showTermsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white w-11/12 max-w-lg p-4 rounded shadow-lg relative">
                  <h3 className="font-bold mb-4 text-base">Terms and Conditions</h3>
                  <div className="text-gray-700 max-h-64 overflow-y-auto text-xs">
                    <p>Welcome to Scryyn. By signing up, you agree to the following terms:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>You are responsible for maintaining the confidentiality of your account.</li>
                      <li>You agree not to misuse the platform or upload any misleading information.</li>
                      <li>All information you provide must be accurate and truthful.</li>
                      <li>We reserve the right to suspend access if misuse is detected.</li>
                      <li>Terms are subject to change and continued use signifies acceptance of the updated terms.</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setShowTermsModal(false)}
                    className="mt-4 bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-center" />
    </>
  );
};

export default HiringOrgSignup;