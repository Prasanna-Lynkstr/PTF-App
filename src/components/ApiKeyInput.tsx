import { useState } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { setOpenAIApiKey } from '@/utils/mockAnalysis';

interface ApiKeyInputProps {
  onApiKeySet: () => void;
}

export const ApiKeyInput = ({ onApiKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setOpenAIApiKey(apiKey.trim());
      onApiKeySet();
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-2 border-primary/20">
      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
          <Key className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">OpenAI API Key Required</h3>
          <p className="text-sm text-muted-foreground">
            Enter your OpenAI API key to enable AI-powered resume analysis
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showKey ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          
          <Button type="submit" className="w-full" disabled={!apiKey.trim()}>
            Set API Key
          </Button>
        </form>
        
        <div className="text-xs text-muted-foreground space-y-2">
          <p>• Your API key is stored locally and never sent to our servers</p>
          <p>• Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI Platform</a></p>
          <p>• For secure production use, consider using Supabase integration</p>
        </div>
      </div>
    </Card>
  );
};