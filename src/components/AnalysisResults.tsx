import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export interface ResumeAnalysis {
  fileName: string;
  name: string;
  experience: number;
  email: string;
  phone: string;
  currentRole: string;
  currentEmployer: string;
  location: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  summary: string;
  resumeQuality: number;
  jobStability: number;
  jdFitment: number;
}

interface AnalysisResultsProps {
  results: ResumeAnalysis[];
  onEmailResults?: () => void;
}

const getScoreClass = (score: number): string => {
  if (score >= 80) return "bg-green-100 text-green-800";
  if (score >= 50) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

const getCandidateStatus = (score: number): string => {
  if (score >= 80) return "Screen Select";
  if (score >= 70) return "Can Consider";
  return "Screen Reject";
};

export const AnalysisResults = ({ results, onEmailResults }: AnalysisResultsProps) => {
  useEffect(() => {
   // console.log('Resume analysis results received from backend:', results);
  }, [results]);
  return (
    <div className="overflow-x-auto animate-fade-in">
      {onEmailResults && (
        <div className="text-right mb-4">
          <Button onClick={onEmailResults}>Email Results</Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {results.map((r, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
            {/* File Name */}
            <h3 className="text-sm font-medium text-gray-600">{r.fileName}</h3>

            {/* Header: Status */}
            <div className="flex justify-between items-start">
              <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full font-bold text-base shadow-md ${
                getCandidateStatus(r.score) === "Screen Select" ? "bg-green-100 text-green-800" :
                getCandidateStatus(r.score) === "Can Consider" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                {getCandidateStatus(r.score)}
              </div>
            </div>

            {/* Candidate Info */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
              <p><strong>Name:</strong> <span className="text-blue-700 font-semibold">{r.name}</span></p>
              <p><strong>Experience:</strong> {r.experience} years</p>
              <p><strong>Email:</strong> {r.email}</p>
              <p><strong>Phone:</strong> {r.phone}</p>
              <p><strong>Current Role:</strong> {r.currentRole}</p>
              <p><strong>Employer:</strong> {r.currentEmployer}</p>
              <p><strong>Location:</strong> {r.location}</p>
            </div>

            {/* Score Summary */}
            <div className="mt-2">
              <h4 className="font-semibold text-gray-800 mb-1">Score Summary</h4>
              <div className="flex flex-wrap gap-2">
                <div className={`px-3 py-1 rounded text-sm font-medium ${getScoreClass(r.resumeQuality)}`}>Resume Quality: {r.resumeQuality}%</div>
                <div className={`px-3 py-1 rounded text-sm font-medium ${getScoreClass(r.jobStability)}`}>Job Stability: {r.jobStability}%</div>
                <div className={`px-3 py-1 rounded text-sm font-medium ${getScoreClass(r.jdFitment)}`}>JD Fitment: {r.jdFitment}%</div>
                <div className={`px-3 py-1 rounded text-sm font-medium ${getScoreClass(r.score)}`}>Overall: {r.score}%</div>
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <h4 className="font-semibold text-gray-800">Matched Skills</h4>
              <p className="text-sm text-gray-600">{r.matchedSkills.join(", ") || "None"}</p>
              <h4 className="font-semibold text-gray-800 mt-2">Missing Skills</h4>
              <p className="text-sm text-gray-600">{r.missingSkills.join(", ") || "None"}</p>
            </div>

            {/* Suggestions */}
            <div>
              <h4 className="font-semibold text-gray-800">Suggestions</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {r.suggestions.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Summary */}
            <div>
              <h4 className="font-semibold text-gray-800">Summary</h4>
              <p className="text-sm text-gray-600">{r.summary}</p>
            </div>
          </div>
        ))}
      </div>

      {onEmailResults && (
        <div className="text-right mt-4">
          <Button onClick={onEmailResults}>Email Results</Button>
        </div>
      )}
    </div>
  );
};