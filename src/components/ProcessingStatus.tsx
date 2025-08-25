import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle, FileText } from 'lucide-react';

interface ProcessingStatusProps {
  currentFile: number;
  totalFiles: number;
  currentFileName?: string;
  isComplete: boolean;
}

export const ProcessingStatus = ({ 
  currentFile, 
  totalFiles, 
  currentFileName,
  isComplete 
}: ProcessingStatusProps) => {
  const progress = (currentFile / totalFiles) * 100;

  return (
    <Card className="p-6 bg-gradient-card border-primary/20">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          {isComplete ? (
            <>
              <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Analysis Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  All {totalFiles} resume{totalFiles !== 1 ? 's' : ''} processed successfully
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse-glow">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Processing Resumes...</h3>
                <p className="text-sm text-muted-foreground">
                  Analyzing resume {currentFile} of {totalFiles}
                </p>
              </div>
            </>
          )}
        </div>

        {!isComplete && (
          <>
            <Progress value={progress} className="h-3" />
            
            {currentFileName && (
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>Currently processing: {currentFileName}</span>
              </div>
            )}
          </>
        )}

        <div className="text-xs text-muted-foreground">
          {isComplete ? (
            "Review your results below"
          ) : (
            "This may take a few moments depending on resume complexity"
          )}
        </div>
      </div>
    </Card>
  );
};