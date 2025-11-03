
import React, { useState, useEffect } from 'react';
import { MurekaBrief } from '../types';
import { Copy, Check, RefreshCw } from 'lucide-react';

interface BriefDisplayProps {
  data: MurekaBrief;
  onRegenerate: () => void;
  isLoading: boolean;
}

const BriefDisplay: React.FC<BriefDisplayProps> = ({ data, onRegenerate, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const formatBriefForCopy = (briefData: MurekaBrief): string => {
    return `Mureka ${briefData.genre_name} Brief (Male Vocal):
${briefData.core_sound}

Tempo/BPM: ${briefData.bpm}
Core Sound / Production: ${briefData.core_sound}
Vocal Approach: ${briefData.vocal_style}
Mood: ${briefData.mood.join(', ')}
Artists to reference: ${briefData.artists.join(', ')}`;
  };

  const handleCopy = () => {
    const textToCopy = formatBriefForCopy(data);
    navigator.clipboard.writeText(textToCopy);
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
    <div className="text-brand-text flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl font-bold text-brand-primary">{data.title}</h2>
        <div className="flex space-x-2">
           <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="flex items-center justify-center bg-brand-surface hover:bg-brand-border text-brand-secondary font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Regenerate
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center bg-brand-primary hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Brief'}
          </button>
        </div>
      </div>
      
      <div className="prose prose-invert max-w-none space-y-6 text-brand-text flex-grow overflow-y-auto">
        <p className="text-lg leading-relaxed text-brand-secondary italic">{data.tagline}</p>
        
        <div>
          <h3 className="text-xl font-semibold mb-2 text-brand-text border-b-2 border-brand-primary pb-1">Overview</h3>
          <p className="text-brand-secondary">{data.core_sound}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-brand-text border-b-2 border-brand-primary pb-1">Tempo/BPM</h3>
          <p className="text-brand-secondary">{data.bpm}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-brand-text border-b-2 border-brand-primary pb-1">Vocal Approach</h3>
          <p className="text-brand-secondary">{data.vocal_style}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-brand-text border-b-2 border-brand-primary pb-1">Mood</h3>
          <div className="flex flex-wrap gap-2">
            {data.mood.map(m => (
              <span key={m} className="bg-brand-surface text-brand-secondary text-sm font-medium px-3 py-1 rounded-full">{m}</span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-brand-text border-b-2 border-brand-primary pb-1">Artists to Reference</h3>
           <div className="flex flex-wrap gap-2">
            {data.artists.map(a => (
              <span key={a} className="bg-brand-surface text-brand-secondary text-sm font-medium px-3 py-1 rounded-full">{a}</span>
            ))}
          </div>
        </div>

         <div>
          <h3 className="text-xl font-semibold mb-2 text-brand-text border-b-2 border-brand-primary pb-1">Overlaps With</h3>
           <div className="flex flex-wrap gap-2">
            {data.overlaps_with.map(o => (
              <span key={o} className="bg-brand-surface text-brand-secondary text-sm font-medium px-3 py-1 rounded-full">{o}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefDisplay;
