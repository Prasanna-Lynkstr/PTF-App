import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultsCount: number;
  analysisData?: any; // or specify the exact type if known
}

export const EmailModal = ({ isOpen, onClose, resultsCount, analysisData }: EmailModalProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate email sending
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, results: analysisData || [] })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send email: ${errorText}`);
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Sending Failed",
        description: error instanceof Error ? error.message : "Unable to send results. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(false);
    setIsSent(true);
    
    toast({
      title: "Results Sent!",
      description: `Analysis summary has been sent to ${email}`,
    });

    setTimeout(() => {
      setIsSent(false);
      setEmail('');
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      setIsSent(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Email Analysis Results</span>
          </DialogTitle>
        </DialogHeader>

        {!isSent ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Get a comprehensive summary of all {resultsCount} resume{resultsCount !== 1 ? 's' : ''} 
              analysis results sent directly to your inbox.
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
              <strong>What you'll receive:</strong>
              <ul className="mt-1 space-y-1">
                <li>• Detailed analysis for each resume</li>
                <li>• Skills comparison matrix</li>
                <li>• Improvement recommendations</li>
                <li>• Overall fitment summary</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Results
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Results Sent Successfully!</h3>
            <p className="text-muted-foreground">
              Check your inbox at <strong>{email}</strong>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};