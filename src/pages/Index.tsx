import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Zap, TrendingUp } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { JobDescriptionInput } from '@/components/JobDescriptionInput';
import { AnalysisResults, ResumeAnalysis } from '@/components/AnalysisResults';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { EmailModal } from '@/components/EmailModal';
// import { analyzeResume, setOpenAIApiKey } from '@/utils/mockAnalysis';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-image.jpg';

const isResumeAnalyzerEnabled = import.meta.env.VITE_RESUME_ANALYZER_ENABLED === 'true';

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessing, setCurrentProcessing] = useState({ file: 0, total: 0, fileName: '' });
  const [results, setResults] = useState<ResumeAnalysis[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (files.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload at least one resume file",
        variant: "destructive"
      });
      return;
    }

    if (jobDescription.length < 50) {
      toast({
        title: "Job description too short",
        description: "Please provide a more detailed job description (minimum 50 characters)",
        variant: "destructive"
      });
      return;
    }

    if (files.length > 5) {
      toast({
        title: "Too many resumes",
        description: "You can only analyze up to 5 resumes at a time",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
    setResults([]);
    setCurrentProcessing({ file: 0, total: files.length, fileName: '' });

    try {
      const allResults: ResumeAnalysis[] = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('resume', files[i]);
        formData.append('jobDescription', jobDescription);

        setCurrentProcessing({ file: i + 1, total: files.length, fileName: files[i].name });

        const response = await fetch(`/api/analyze/upload`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.analysisResults && Array.isArray(data.analysisResults)) {
          allResults.push(...data.analysisResults);
        }
      }

      setResults(allResults);
      toast({
        title: "Analysis complete!",
        description: `Successfully analyzed ${allResults.length} resume${allResults.length !== 1 ? 's' : ''}`,
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unknown error occurred during analysis",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    {
      icon: <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4"><Zap className="w-6 h-6 text-white" /></div>,
      title: "Instant Analysis",
      description: "Get detailed fitment scores and feedback in seconds"
    },
    {
      icon: <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4"><Shield className="w-6 h-6 text-white" /></div>,
      title: "Secure & Private",
      description: "Your files are processed securely and not permanently stored"
    },
    {
      icon: <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4"><TrendingUp className="w-6 h-6 text-white" /></div>,
      title: "Actionable Insights",
      description: "Receive specific suggestions to improve resume-job alignment"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Scryyn: Find your perfect fit—faster</title>
      </Helmet>
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-tr from-blue-800 via-blue-600 to-blue-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-blue-100 space-y-6">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Welcome to <span className="text-blue-200">Scryyn</span>
              </h1>
              <p className="text-blue-200 max-w-xl text-xl font-medium">
                Find your perfect fit—faster.
              </p>
              <p className="text-blue-100 max-w-2xl text-lg">
                In today&apos;s fast-paced hiring landscape, timely and accurate resume screening is crucial. 
                <strong className="text-white"> Scryyn </strong> leverages AI to help you quickly identify the best-fit candidates, 
                reduce manual effort, and focus your time where it matters most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  disabled={!isResumeAnalyzerEnabled}
                  onClick={() => {
                    const uploadSection = document.getElementById('scryyn-upload-section');
                    if (uploadSection) {
                      uploadSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Start Analysis
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Resume Analysis Illustration" 
                className="w-full h-auto rounded-lg shadow-glow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center bg-white shadow-lg hover:shadow-2xl transition-shadow rounded-lg">
              {feature.icon}
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Main Application */}
        {isResumeAnalyzerEnabled && (
          <div id="scryyn-upload-section" className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-blue-700">Try Scryyn's AI Resume Analyzer</h2>
              <p className="text-blue-800 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                Upload your <strong className="text-blue-900">resume files</strong> and <strong className="text-blue-900">job description</strong> to get an AI-powered fitment analysis — including <span className="text-blue-700">skill match breakdown</span>, <span className="text-blue-700">gap identification</span>, and <span className="text-blue-700">personalized improvement tips</span>.
                <br /><br />
                <span className="text-blue-800 font-semibold">Ideal for recruiters</span> who struggle to interpret complex JDs and want to <span className="underline underline-offset-2">quickly shortlist</span> the most suitable candidates — effortlessly.
              </p>
            </div>

            <div>
              <FileUpload files={files} onFilesChange={setFiles} />
            </div>
            <div>
              <JobDescriptionInput 
                value={jobDescription} 
                onChange={setJobDescription} 
              />
            </div>
            <div className="text-center">
              <Button 
                onClick={handleAnalyze}
                disabled={isProcessing || files.length === 0 || jobDescription.length < 50}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-8 py-3"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Check Fitment
                  </>
                )}
              </Button>
            </div>

            {/* Processing Status */}
            {isProcessing && (
              <ProcessingStatus
                currentFile={currentProcessing.file}
                totalFiles={currentProcessing.total}
                currentFileName={currentProcessing.fileName}
                isComplete={false}
              />
            )}

            {/* Results */}
            {results.length > 0 && !isProcessing && (
              <AnalysisResults 
                results={results} 
                onEmailResults={() => setShowEmailModal(true)}
              />
            )}

            {/* Privacy Notice */}
            <Card className="p-4 bg-muted/50 border-muted">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-blue-600" />
                <p>
                  <strong>Privacy Notice:</strong> We do not permanently store your files. 
                  All processing is secure and temporary. Your data is processed locally and 
                  deleted immediately after analysis.
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        resultsCount={results.length}
        analysisData={results} // pass results as prop
      />
      {/* Footer */}
      <footer className="mt-16 bg-blue-50 py-6 text-center text-sm text-gray-700">
        <div className="container mx-auto px-4">
          <p>
            © {new Date().getFullYear()} <strong>Lynkstr</strong>. All rights reserved.
          </p>
          <p>
            For inquiries, contact us at <a href="mailto:prasanna@lynkstr.com" className="text-blue-600 hover:underline">prasanna@lynkstr.com</a>
          </p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Index;
