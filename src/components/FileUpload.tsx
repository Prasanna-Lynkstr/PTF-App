import { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  files: File[];
}

export const FileUpload = ({ onFilesChange, files }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      return validTypes.includes(file.type);
    });

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card
        className={`relative border-2 border-dashed transition-all duration-300 ${
          dragActive 
            ? 'border-primary bg-primary/5 shadow-glow' 
            : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Upload Resume(s)</h3>
          <p className="text-muted-foreground mb-4">
            Drag & drop files here, or click to browse
          </p>
          <p className="text-sm text-muted-foreground mb-4 font-semibold text-primary">
            Supports PDF or DOCX files (max 5 resumes at a time)
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mx-auto"
          >
            Choose Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.zip"
            onChange={(e) => {
              if (e.target.files) {
                handleFiles(Array.from(e.target.files));
              }
            }}
            className="hidden"
          />
        </div>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Uploaded Files:</h4>
          {files.map((file, index) => (
            <Card key={index} className="p-3 bg-gradient-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <File className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};