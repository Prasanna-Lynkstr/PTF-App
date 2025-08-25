import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Helmet } from 'react-helmet';


const ScryynHeader = () => (
  <>
    {/* Top Navbar */}
    <nav className="w-full bg-white border-b border-indigo-100 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center space-x-2 group">
          <span className="text-2xl font-black tracking-tight text-indigo-700 group-hover:text-indigo-900 transition-colors duration-150">
            Scryyn
          </span>
        </a>
        <a
          href="/"
          className="text-indigo-600 hover:text-indigo-900 font-medium px-3 py-1 rounded transition-colors duration-150 border border-transparent hover:border-indigo-200"
        >
          Home
        </a>
      </div>
    </nav>
    <header className="max-w-6xl mx-auto mb-10 text-center">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-2 mt-8">Candidate Intent & Readiness Assessment</h1>
      {/* Highlighted info box after heading */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
        <p className="text-sm text-yellow-800 font-medium">
         
          Why this matters: Recruiters and hiring managers prioritize candidates who are honest, committed, and responsive. Completing this assessment truthfully can help highlight your seriousness and improve your visibility for top opportunities. 
        </p>
      </div>
      <p className="text-indigo-500 text-lg max-w-xl mx-auto">
        Think of this as your credibility badge.
      </p>
    </header>
  </>
);

const LynkstrFooter = () => (
  <footer className="max-w-6xl mx-auto mt-10 text-center text-sm text-gray-500">
    <p>© 2024 Lynkstr. All rights reserved.</p>
  </footer>
);

const CandidateIntentAssessment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentSalary: '',
    offerSalary: '',
    resigned: '',
    lastWorkingDate: '',
    noticePeriod: '',
    availability: '',
    interviewHistory: '',
    offersInHand: '',
    offerDropHistory: '',
    motivation: '',
    expectedSalary: '',
    resignationProof: null as File | null, // renamed for clarity
    salaryJustification: '',
    offerLPA: '', // Add field for offer LPA
    hasOffer: '', // Add field for hasOffer (yes/no)
    linkedinProfile: '', // New field
    portfolioUrl: '', // New field
    preferredLocations: [], // New field (array)
    preferredWorkMode: [], // New field (array)
    offerInHandReason: '', // for reason for still looking
  });
  // New fields for short tenure leave
  const [shortTenureLeave, setShortTenureLeave] = useState('');
  const [shortTenureReason, setShortTenureReason] = useState('');
  // New fields for delay after relieving
  const [delayAfterRelieving, setDelayAfterRelieving] = useState('');
  const [delayReason, setDelayReason] = useState('');
  // Top 2 next role preferences
  const [nextRolePreferences, setNextRolePreferences] = useState('');
  const [intentMessage, setIntentMessage] = useState('');
  // New state for resume file and comments
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [comments, setComments] = useState('');
  // Error state for inline errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // Track submit for inline error rendering
  const [submitted, setSubmitted] = useState(false);
  // State for Job Search Intent
  const [jobSearchActivity, setJobSearchActivity] = useState('');

  // Webcam/photo capture state
  const webcamRef = useRef<Webcam>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) setPhoto(imageSrc);
    setShowCamera(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // For handling checkbox group for preferredWorkMode
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => {
      const prevArr = Array.isArray(prev[name]) ? prev[name] : [];
      if (checked) {
        return { ...prev, [name]: [...prevArr, value] };
      } else {
        return { ...prev, [name]: prevArr.filter((v: string) => v !== value) };
      }
    });
  };

  // For resignation proof file upload
  const handleResignationFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, resignationProof: file }));
  };

  // Salary expectation validation function
  const isJustificationRequired = (current: number, offer: number | null, expected: number): boolean => {
    if (!expected) return false;
    if (!offer) {
      // No offer salary entered
      return expected > current * 1.4;
    } else {
      // Offer salary entered
      return expected > offer * 1.2;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIntentMessage('');
    setSubmitted(true);
    const newErrors: { [key: string]: string } = {};
    // Required fields
    if (!formData.name) newErrors.name = 'Full Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.noticePeriod) newErrors.noticePeriod = 'Notice period is required';
    if (!formData.expectedSalary) newErrors.expectedSalary = 'Expected salary is required';
    // Preferred Job Locations required
    if (!formData.preferredLocations || formData.preferredLocations.length === 0) {
      newErrors.preferredLocations = "Please enter at least one preferred job location.";
    }
    // Job Search Activity required
    if (!jobSearchActivity) {
      newErrors.jobSearchActivity = "Please select how actively you are looking for a job.";
    }
    // Resume upload required
    if (!resumeFile) newErrors.resume = 'Resume upload is required';
    // Last working date and resignation proof required if resigned
    if (formData.resigned === 'yes') {
      if (!formData.lastWorkingDate) newErrors.lastWorkingDate = 'Last Working Date is required';
      if (!formData.resignationProof) newErrors.resignationProof = 'Proof of resignation is required';
    }
    // Offer in hand fields required if hasOffer is Yes
    if (formData.hasOffer === "Yes") {
      if (!formData.offerLPA) newErrors.offerLPA = "Offer LPA is required";
      if (!formData.offerInHandReason) newErrors.offerInHandReason = "Reason for still looking is required";
    }
    // Salary justification required if validation triggers it
    if (justificationRequired && !formData.salaryJustification) {
      newErrors.salaryJustification = "Justification is required for your expected salary.";
    }
    // Reason for leaving if tenure < 1 year
    if (shortTenureLeave === "Yes" && !shortTenureReason) {
      newErrors.shortTenureReason = "Reason for leaving within a year is required";
    }
    // Top 2 things in next role required
    if (!nextRolePreferences) {
      newErrors.nextRolePreferences = "Please mention top 2 things you are looking for in your next role";
    }
    // --- Offer LPA and hasOffer validation ---
    if (formData.hasOffer === "No" && formData.offerLPA && formData.offerLPA.trim() !== "") {
      newErrors.offerLPA = "You cannot enter an offer LPA if you do not have an offer in hand.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    console.log('Form submitted:', formData);
  };

  const currentSalary = parseFloat(formData.currentSalary || '0');
  const offerSalary = parseFloat(formData.offerSalary || '0') || null;
  const expectedSalary = parseFloat(formData.expectedSalary || '0');

  const justificationRequired = isJustificationRequired(currentSalary, offerSalary, expectedSalary);
  const justificationLabel = justificationRequired ? "Justification for Salary Expectation (Required)" : "Justification for Salary Expectation (Optional)";
  const showJustificationMessage = justificationRequired && !formData.salaryJustification;

  // For conditional rendering
  const availabilityStatus = formData.resigned === 'yes' ? 'resigned' : (formData.resigned === 'no' ? 'working' : '');
  const lastWorkingDate = formData.lastWorkingDate;

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Scryyn - Candidate Intent &amp; Readiness Assessment</title>
      </Helmet>
      <ScryynHeader />
      {/* Highlighted info box moved to header */}
      <main className="container mx-auto max-w-6xl px-4 bg-white rounded-xl shadow-lg p-4 md:p-10">
        {/* Friendly one-liner below form title */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info Section */}
          <section className="border border-indigo-100 bg-indigo-50 rounded-md p-4 md:p-6 mb-6">
            <h2 className="text-lg font-semibold text-indigo-800 mb-4">Personal Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                <label className="block text-sm font-medium text-indigo-700 mb-1 sm:w-1/3">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  className={`w-full sm:w-2/3 rounded-md border ${errors.name && submitted ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} bg-indigo-50 py-2 px-3 text-indigo-900 focus:outline-none focus:ring-2 transition`}
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                <label className="block text-sm font-medium text-indigo-700 mb-1 sm:w-1/3">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  className={`w-full sm:w-2/3 rounded-md border ${errors.email && submitted ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} bg-indigo-50 py-2 px-3 text-indigo-900 focus:outline-none focus:ring-2 transition`}
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                <label className="block text-sm font-medium text-indigo-700 mb-1 sm:w-1/3">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  onChange={handleChange}
                  className={`w-full sm:w-2/3 rounded-md border ${errors.phone && submitted ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} bg-indigo-50 py-2 px-3 text-indigo-900 focus:outline-none focus:ring-2 transition`}
                  required
                />
              </div>
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                <label className="block text-sm font-medium text-indigo-700 mb-1 sm:w-1/3">LinkedIn Profile URL</label>
                <input
                  type="text"
                  name="linkedinProfile"
                  placeholder="https://linkedin.com/in/yourname"
                  value={formData.linkedinProfile || ""}
                  onChange={handleChange}
                  className="mt-1 w-full sm:w-2/3 border border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder:text-sm placeholder:italic"
                />
              </div>
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                <label className="block text-sm font-medium text-indigo-700 mb-1 sm:w-1/3">GitHub / Portfolio URL</label>
                <input
                  type="text"
                  name="portfolioUrl"
                  placeholder="https://github.com/username"
                  value={formData.portfolioUrl || ""}
                  onChange={handleChange}
                  className="mt-1 w-full sm:w-2/3 border border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder:text-sm placeholder:italic"
                />
              </div>
            </div>
          </section>
          {/* Availability Section */}
          <section className="border border-indigo-100 bg-indigo-50 rounded-md p-4 md:p-6 mb-6">
            <h2 className="text-lg font-semibold text-indigo-800 mb-4">Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* What's your official notice period duration? (moved here) */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  What’s your official notice period duration? <span className="text-red-500">*</span>
                </label>
                <select
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md border ${errors.noticePeriod && submitted ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} bg-indigo-50 py-2 px-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 transition`}
                >
                  <option value="">Select</option>
                  <option value="15">15 Days</option>
                  <option value="30">30 Days</option>
                  <option value="60">60 Days</option>
                  <option value="90">90 Days</option>
                </select>
              </div>
              {/* Are you leaving current org within a year? */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-indigo-700 mb-1">Are you leaving your current organization within a year of joining?</label>
                <select
                  name="shortTenureLeave"
                  value={shortTenureLeave}
                  onChange={e => setShortTenureLeave(e.target.value)}
                  className="block w-full rounded-md border border-indigo-300 bg-indigo-50 py-2 px-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              {shortTenureLeave === 'Yes' && (
                <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                  <label htmlFor="shortTenureReason" className="block text-sm font-medium text-indigo-700 mb-1 sm:w-1/3">
                    Please explain why you're leaving within a year <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="shortTenureReason"
                    name="shortTenureReason"
                    rows={2}
                    className={`mt-1 w-full sm:w-2/3 border ${errors.shortTenureReason && submitted ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md shadow-sm focus:ring-2 sm:text-sm placeholder:text-sm placeholder:italic`}
                    value={shortTenureReason}
                    onChange={(e) => setShortTenureReason(e.target.value)}
                    required
                  />
                  {!shortTenureReason && submitted && (
                    <p className="text-sm text-red-500 mt-1">{errors.shortTenureReason}</p>
                  )}
                </div>
              )}
              {/* Have you resigned? */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Have you already resigned?</label>
                <select
                  name="resigned"
                  value={formData.resigned}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-indigo-300 bg-indigo-50 py-2 px-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes, I have resigned</option>
                  <option value="no">No, still working</option>
                </select>
              </div>
              {/* Last Working Date (conditional) */}
              {availabilityStatus === 'resigned' && (
                <div>
                  <label htmlFor="lastWorkingDate" className="block text-sm font-medium text-indigo-700 mb-1">
                    Last Working Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="lastWorkingDate"
                    id="lastWorkingDate"
                    value={formData.lastWorkingDate}
                    onChange={handleChange}
                    required
                    className={`mt-1 block w-full border ${errors.lastWorkingDate && submitted ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} rounded-md shadow-sm focus:ring-2 text-sm text-indigo-900`}
                  />
                  {!formData.lastWorkingDate && submitted && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastWorkingDate}</p>
                  )}
                </div>
              )}
              {/* Upload Proof of Resignation (conditional) */}
              {availabilityStatus === 'resigned' && (
                <>
                  <div>
                    <label htmlFor="resignationProof" className="block text-sm font-medium text-indigo-700 mb-1">
                      Upload Proof of Resignation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="resignationProof"
                      required
                      onChange={handleResignationFileUpload}
                      className={`mt-1 block w-full text-sm text-indigo-900 ${errors.resignationProof && submitted ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {!formData.resignationProof && submitted && (
                      <p className="text-sm text-red-500 mt-1">{errors.resignationProof}</p>
                    )}
                  </div>
                  {/* Confirmation Checkbox for Resignation */}
                  <div className="col-span-2 mt-2">
                    <label className="inline-flex items-start">
                      <input
                        type="checkbox"
                        name="resignationConfirmation"
                        required
                        className="h-4 w-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-indigo-700 italic">
                        I confirm that I have truly resigned, my last working date is approved by my current employer, and I will not come back with changes to this information at a later time.
                      </span>
                    </label>
                  </div>
                </>
              )}
              {/* Are you available for interviews with 24-48 hour notice? */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Are you available for interviews with 24-48 hour notice?</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-indigo-300 bg-indigo-50 py-2 px-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="">Select</option>
                  <option value="flexible">Yes – I’m flexible</option>
                  <option value="prior">Need prior planning</option>
                  <option value="weekends">Prefer weekends/after hours</option>
                </select>
              </div>
              {/* Will you delay joining after relieving? */}
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-start sm:space-x-4 w-full">
                <label htmlFor="delayJoiningAfterRelieving" className="block text-sm font-medium text-indigo-700 mb-1 sm:w-1/3">
                  Do you plan to delay joining after your last working day? <span className="text-red-500">*</span>
                </label>
                <div className="w-full sm:w-2/3">
                  <select
                    id="delayJoiningAfterRelieving"
                    name="delayJoiningAfterRelieving"
                    className="block w-full rounded-md border border-indigo-300 bg-indigo-50 py-2 px-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    value={delayAfterRelieving}
                    onChange={(e) => setDelayAfterRelieving(e.target.value)}
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
              {/* Reason for delay (conditional) */}
              {['Yes', 'Not sure'].includes(delayAfterRelieving) && (
                <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                  <label htmlFor="delayReason" className="block text-sm font-medium text-indigo-700 mb-1 sm:w-1/3">
                    Why might there be a delay in joining after your last working day?
                  </label>
                  <textarea
                    id="delayReason"
                    name="delayReason"
                    rows={2}
                    className="mt-1 w-full sm:w-2/3 border border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder:text-sm placeholder:italic"
                    value={delayReason}
                    onChange={(e) => setDelayReason(e.target.value)}
                  />
                </div>
              )}
            </div>
          </section>
          {/* Offers & Salary Section */}
          <section className="border border-indigo-100 bg-indigo-50 rounded-md p-4 md:p-6 mb-6">
            <h2 className="text-lg font-semibold text-indigo-800 mb-4">Offers &amp; Salary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Do you have an offer in hand? */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Do you currently have any offers in hand? {formData.hasOffer === '' && <span className="text-red-500">*</span>}
                </label>
                <select
                  name="hasOffer"
                  value={formData.hasOffer}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md border ${errors.hasOffer && submitted ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} bg-indigo-50 py-2 px-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 transition`}
                >
                  <option value="">Select</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              {/* Offer LPA */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Offer LPA {formData.hasOffer === 'Yes' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="number"
                  name="offerLPA"
                  value={formData.offerLPA}
                  onChange={handleChange}
                  required={formData.hasOffer === 'Yes'}
                  className={`block w-full rounded-md border ${errors.offerLPA && submitted ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} bg-indigo-50 py-2 px-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 transition`}
                />
                {errors.offerLPA && submitted && (
                  <p className="text-sm text-red-500 mt-1">{errors.offerLPA}</p>
                )}
              </div>
              {/* Expected Salary */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Expected Salary (in LPA) <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs text-gray-400 italic align-middle">
                    We understand your expectations. A brief justification helps hiring managers assess fit and fairness.
                  </span>
                </label>
                <input
                  type="number"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md border ${errors.expectedSalary && submitted ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} bg-indigo-50 py-2 px-3 text-indigo-900 focus:outline-none focus:ring-2 transition`}
                />
                {!formData.expectedSalary && submitted && (
                  <p className="text-sm text-red-500 mt-1">{errors.expectedSalary}</p>
                )}
              </div>
              {/* Salary Justification */}
              <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${justificationRequired ? 'text-indigo-700' : 'text-indigo-700'}`}>
                  {justificationLabel} {justificationRequired && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  className={`mt-1 block w-full border ${errors.salaryJustification && submitted ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : justificationRequired ? 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} rounded-md shadow-sm p-2`}
                  value={formData.salaryJustification}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryJustification: e.target.value })
                  }
                  rows={3}
                  required={justificationRequired}
                />
                {errors.salaryJustification && submitted && (
                  <p className="text-sm text-red-500 mt-2">{errors.salaryJustification}</p>
                )}
              </div>
              {/* Offer Salary (if any, LPA) */}
              <div>
                <label htmlFor="offerSalary" className="block text-sm font-medium text-indigo-700 mb-1">
                  Offer Salary (if any, LPA)
                </label>
                <input
                  type="number"
                  id="offerSalary"
                  name="offerSalary"
                  value={formData.offerSalary}
                  onChange={e =>
                    setFormData({ ...formData, offerSalary: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 bg-indigo-50 py-2 px-3 text-indigo-900 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500 transition"
                />
              </div>
              {/* Current Salary (LPA) */}
              <div>
                <label htmlFor="currentSalary" className="block text-sm font-medium text-indigo-700 mb-1">
                  Current Salary (LPA) 
                </label>
                <input
                  type="number"
                  id="currentSalary"
                  name="currentSalary"
                  value={formData.currentSalary}
                  onChange={e =>
                    setFormData({ ...formData, currentSalary: e.target.value })
                  }
                 className={`block w-full rounded-md border ${errors.currentSalary && submitted ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} bg-indigo-50 py-2 px-3 text-indigo-900 focus:outline-none focus:ring-2 transition`}
                />
                {!formData.currentSalary && submitted && (
                  <p className="text-sm text-red-500 mt-1">{errors.currentSalary}</p>
                )}
              </div>
              {/* Reason still exploring despite offer (conditional) */}
              {formData.hasOffer === "Yes" && (
                <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                <label htmlFor="offerInHandReason" className="block text-sm font-medium text-indigo-700 mb-1 sm:w-1/3">
                    You’re holding an offer — what’s missing in that role? What kind of opportunity would you accept and commit to? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="offerInHandReason"
                    name="offerInHandReason"
                    rows={6}
                    placeholder="Explain your reasons and influencing factors here"
                    className={`w-full sm:w-2/3 border ${errors.offerInHandReason && submitted ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} rounded-md shadow-sm focus:ring-2 sm:text-base placeholder:text-sm placeholder:italic`}
                    value={formData.offerInHandReason || ""}
                    onChange={e => setFormData(prev => ({ ...prev, offerInHandReason: e.target.value }))}
                    required
                  />
                  {!formData.offerInHandReason && submitted && (
                    <p className="text-sm text-red-500 mt-1">{errors.offerInHandReason}</p>
                  )}
                </div>
              )}
            </div>
          </section>
          {/* Location Preferences Section */}
          <section className="border border-indigo-100 bg-indigo-50 rounded-md p-4 md:p-6 mb-6">
            <h2 className="text-lg font-semibold text-indigo-800 mb-4">Location Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preferred Job Locations */}
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                <label className="block text-sm font-medium text-indigo-700 mb-1 sm:w-1/3">
                  Preferred Job Locations <span className="text-red-500">*</span>
                </label>
                <div className="w-full sm:w-2/3">
                  <PreferredLocationsInput
                    preferredLocations={formData.preferredLocations}
                    setPreferredLocations={(locs: string[]) =>
                      setFormData({ ...formData, preferredLocations: locs })
                    }
                  />
                  {/* Inline error for preferred locations */}
                  {submitted && errors.preferredLocations && (
                    <p className="text-sm text-red-500 mt-1">{errors.preferredLocations}</p>
                  )}
                </div>
              </div>
              {/* Preferred Work Mode */}
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                <label className="block text-sm font-medium text-indigo-700 mb-1 sm:w-1/3">Preferred Work Mode</label>
                <div className="mt-2 flex flex-wrap gap-4 w-full sm:w-2/3">
                  {["Work from Office", "Hybrid", "Remote"].map((mode) => (
                    <label key={mode} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="preferredWorkMode"
                        value={mode}
                        checked={formData.preferredWorkMode?.includes(mode) || false}
                        onChange={handleMultiSelectChange}
                        className="mr-2"
                      />
                      {mode}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>
          {/* Job Preferences Section */}
          <section className="border border-indigo-100 bg-indigo-50 rounded-md p-4 md:p-6 mb-6">
            <h2 className="text-lg font-semibold text-indigo-800 mb-4">Job Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* How actively are you looking? */}
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                <label htmlFor="jobSearchActivity" className="block text-sm font-medium text-indigo-700 mb-1 sm:w-1/3">
                  How actively are you looking for a job? <span className="text-red-500">*</span>
                </label>
                <div className="w-full sm:w-2/3">
                  <select
                    id="jobSearchActivity"
                    name="jobSearchActivity"
                    value={jobSearchActivity}
                    onChange={(e) => setJobSearchActivity(e.target.value)}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="Not looking">Not looking</option>
                    <option value="Casually exploring">Casually exploring</option>
                    <option value="Actively applying">Actively applying</option>
                    <option value="Very actively, want to join ASAP">Very actively, want to join ASAP</option>
                  </select>
                  {submitted && errors.jobSearchActivity && (
                    <p className="text-sm text-red-500 mt-1">{errors.jobSearchActivity}</p>
                  )}
                </div>
              </div>
              {/* Top 2 things you are looking for in your next role */}
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                <label htmlFor="nextRolePreferences" className="block text-sm font-medium text-indigo-700 mb-1 sm:w-1/3">
                  Top 2 things you are looking for in your next role <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="nextRolePreferences"
                  name="nextRolePreferences"
                  rows={2}
                  placeholder="E.g., Career growth, better work-life balance"
                  className={`w-full sm:w-2/3 border ${errors.nextRolePreferences && submitted ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} rounded-md shadow-sm focus:ring-2 sm:text-sm placeholder:text-sm placeholder:italic`}
                  value={nextRolePreferences}
                  onChange={(e) => setNextRolePreferences(e.target.value)}
                  required
                />
                {!nextRolePreferences && submitted && (
                  <p className="text-sm text-red-500 mt-1">{errors.nextRolePreferences}</p>
                )}
              </div>
            </div>
          </section>
          {/* Additional Info Section */}
          <section className="border border-indigo-100 bg-indigo-50 rounded-md p-4 md:p-6 mb-6">
            <h2 className="text-lg font-semibold text-indigo-800 mb-4">Additional Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Resume <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  name="resume"
                  className={`mt-1 block w-full ${errors.resume && submitted ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  required
                />
                {!resumeFile && submitted && (
                  <p className="text-sm text-red-500 mt-1">{errors.resume}</p>
                )}
              </div>
              {/* Optional Photo Capture */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Capture Photo (optional)
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Adding a photo builds credibility and helps us recognize genuine interest. Completely optional, but highly recommended!
                </p>
                {!photo ? (
                  <div>
                    {!showCamera ? (
                      <button
                        type="button"
                        onClick={() => setShowCamera(true)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        Take Photo
                      </button>
                    ) : (
                      <>
                        <Webcam
                          audio={false}
                          screenshotFormat="image/jpeg"
                          ref={webcamRef}
                          className="rounded-md shadow-md"
                        />
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="mt-2 inline-flex items-center px-3 py-2 border border-indigo-500 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        >
                          Capture
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <img src={photo} alt="Captured" className="w-32 h-32 rounded border mb-2" />
                    <button
                      type="button"
                      onClick={() => { setPhoto(null); setShowCamera(false); }}
                      className="text-xs text-red-500 underline"
                    >
                      Retake Photo
                    </button>
                  </div>
                )}
              </div>
              {/* Additional Comments */}
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                <label htmlFor="additionalComments" className="block text-sm font-medium text-indigo-700 mb-1 sm:w-1/3">
                  Additional Comments
                </label>
                <textarea
                  name="additionalComments"
                  rows={4}
                  placeholder="Mention anything more that helps us understand your profile better and why you’re interested in this role. This helps assess how serious you are and could give you an edge."
                  className="mt-1 w-full sm:w-2/3 border border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder:text-sm placeholder:italic"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            </div>
          </section>
          {/* Interview/Offer/Motivation Section */}
          <section className="border border-indigo-100 bg-indigo-50 rounded-md p-4 md:p-6 mb-6">
            <h2 className="text-lg font-semibold text-indigo-800 mb-4">Interview &amp; Motivation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Have you missed or dropped out of interviews recently? */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Have you missed or dropped out of interviews recently?</label>
                <select
                  name="interviewHistory"
                  onChange={handleChange}
                  className="block w-full rounded-md border border-indigo-300 bg-indigo-50 py-2 px-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="">Select</option>
                  <option value="no">No, I attend all scheduled interviews</option>
                  <option value="few">Once or twice due to valid reasons</option>
                  <option value="many">Yes, multiple times</option>
                </select>
              </div>
              {/* Have you declined any offers in the last 6 months? */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Have you declined any offers in the last 6 months?</label>
                <select
                  name="offerDropHistory"
                  onChange={handleChange}
                  className="block w-full rounded-md border border-indigo-300 bg-indigo-50 py-2 px-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="">Select</option>
                  <option value="none">No</option>
                  <option value="preaccept">Yes – before accepting</option>
                  <option value="postaccept">Yes – after accepting</option>
                </select>
              </div>
              {/* What's your main motivation for switching jobs? */}
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                <label className="block text-sm font-medium text-indigo-700 mb-1 sm:w-1/3">What's your main motivation for switching jobs?</label>
                <select
                  name="motivation"
                  onChange={handleChange}
                  className="w-full sm:w-2/3 rounded-md border border-indigo-300 bg-indigo-50 py-2 px-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="">Select</option>
                  <option value="growth">Growth/Learning</option>
                  <option value="hike">Salary Hike</option>
                  <option value="toxic">Toxic Environment</option>
                  <option value="relocation">Relocation</option>
                  <option value="restart">Career Restart</option>
                </select>
              </div>
            </div>
          </section>
          {intentMessage && (
            <p className="text-sm text-red-600 mt-2">{intentMessage}</p>
          )}
          {/* Declaration Checkbox */}
          <div className="col-span-2 mt-4">
            <label className="inline-flex items-start">
              <input
                type="checkbox"
                name="declaration"
                required
                className="h-4 w-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-indigo-700 italic">
                I confirm that the information provided above is true and accurate to the best of my knowledge. I understand that if any details are found to be false or deliberately misleading, I may be banned from using this platform or considered ineligible for job opportunities.
              </span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
          >
            Submit Assessment
          </button>
        </form>
      </main>
      <LynkstrFooter />
    </div>
  );
};

export default CandidateIntentAssessment;
// PreferredLocationsInput component
const PreferredLocationsInput: React.FC<{
  preferredLocations: string[];
  setPreferredLocations: (locs: string[]) => void;
}> = ({ preferredLocations, setPreferredLocations }) => {
  const [preferredLocationsInput, setPreferredLocationsInput] = useState('');

  // Helper: parse input into tags using comma or space as separator
  const parseLocations = (input: string, currentTags: string[]) => {
    // Split on comma or space, trim, filter empty and deduplicate
    const tokens = input
      .split(/[, ]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    // Only add new tokens not already present
    const allTags = [...currentTags];
    tokens.forEach((token) => {
      if (!allTags.includes(token)) {
        allTags.push(token);
      }
    });
    return allTags;
  };

  // On input change, check if input contains a comma or space and parse tags
  const handlePreferredLocationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // If input ends with comma or space, parse and add tags
    if (/[,\s]$/.test(value)) {
      const tags = parseLocations(value, preferredLocations);
      setPreferredLocations(tags);
      setPreferredLocationsInput('');
    } else {
      setPreferredLocationsInput(value);
    }
  };

  // On blur, parse any remaining input
  const handlePreferredLocationsBlur = () => {
    if (preferredLocationsInput.trim() !== '') {
      const tags = parseLocations(preferredLocationsInput, preferredLocations);
      setPreferredLocations(tags);
      setPreferredLocationsInput('');
    }
  };

  // Remove tag by index
  const removeLocation = (idx: number) => {
    const newLocs = preferredLocations.filter((_, i) => i !== idx);
    setPreferredLocations(newLocs);
  };

  // Custom onKeyDown to handle comma/space and keep focus
  const handlePreferredLocationsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === ' ' || e.key === ',') && preferredLocationsInput.trim() !== '') {
      e.preventDefault();
      const tags = parseLocations(preferredLocationsInput, preferredLocations);
      setPreferredLocations(tags);
      setPreferredLocationsInput('');
    }
  };

  return (
    <div className="w-full">
      <input
        type="text"
        value={preferredLocationsInput}
        onChange={handlePreferredLocationsChange}
        onBlur={handlePreferredLocationsBlur}
        onKeyDown={handlePreferredLocationsKeyDown}
        placeholder="Type locations, separate by comma or space"
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-12 placeholder:text-sm placeholder:italic"
      />
      <div className="flex flex-wrap mt-2 gap-2">
        {preferredLocations.map((loc, idx) => (
          <span
            key={loc + idx}
            className="inline-flex items-center px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-sm font-medium mr-1 mb-1"
          >
            {loc}
            <button
              type="button"
              className="ml-1 text-indigo-500 hover:text-red-500 focus:outline-none"
              onClick={() => removeLocation(idx)}
              aria-label={`Remove ${loc}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};