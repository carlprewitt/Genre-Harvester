
import React, { useState, useEffect } from 'react';
import { MurekaBrief } from '../types';
import { Copy, Check } from 'lucide-react';

interface JsonDisplayProps {
  data: MurekaBrief;
}

const JsonDisplay: React.FC<JsonDisplayProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  useEffect(() => {
      setCopied(false);
  }, [data]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Raw JSON Output</h3>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center bg-brand-surface hover:bg-brand-border text-brand-secondary font-bold py-2 px-3 rounded transition-colors duration-200 text-sm"
        >
          {copied ? <Check className="mr-2 h-4 w-4 text-brand-primary" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy JSON'}
        </button>
      </div>
      <pre className="bg-brand-surface text-brand-secondary p-4 rounded-lg text-sm overflow-auto flex-1 custom-scrollbar">
        <code>
          {jsonString}
        </code>
      </pre>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e1e1e;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #2d2d2d;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }
      `}</style>
    </div>
  );
};

export default JsonDisplay;
