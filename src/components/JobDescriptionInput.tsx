import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const JobDescriptionInput = ({ value, onChange }: JobDescriptionInputProps) => {
  return (
    <Card className="p-6 bg-gradient-card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Job Description</h3>
          <p className="text-sm text-muted-foreground">
            Paste the complete job description for accurate analysis
          </p>
        </div>
      </div>
      
      <Textarea
        placeholder="Paste the job description here...

Example:
• Role: Senior Software Engineer
• Required Skills: React, TypeScript, Node.js
• Experience: 5+ years
• Responsibilities: Lead development team, architect solutions..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] resize-none border-border/50 focus:border-primary transition-colors"
      />
      
      <div className="mt-3 flex justify-between items-center text-xs text-muted-foreground">
        <span>
          {value.length} characters
        </span>
        <span>
          Minimum 100 characters recommended
        </span>
      </div>
    </Card>
  );
};