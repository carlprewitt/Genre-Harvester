
import React, { useState, useCallback } from 'react';
import { MurekaBrief } from './types';
import { SEED_GENRES } from './constants';
import { generateGenreBrief } from './services/geminiService';
import GenreList from './components/GenreList';
import BriefDisplay from './components/BriefDisplay';
import JsonDisplay from './components/JsonDisplay';
import { RefreshCw, Loader, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [genres, setGenres] = useState<string[]>(SEED_GENRES);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [genreData, setGenreData] = useState<MurekaBrief | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrief = useCallback(async (genreName: string) => {
    setIsLoading(true);
    setError(null);
    setGenreData(null);
    try {
      const data = await generateGenreBrief(genreName);
      setGenreData(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectGenre = (genre: string) => {
    setSelectedGenre(genre);
    fetchBrief(genre);
  };

  const handleRegenerate = () => {
    if (selectedGenre) {
      fetchBrief(selectedGenre);
    }
  };

  const WelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-brand-secondary p-8">
       <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary mb-4"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
      <h2 className="text-2xl font-bold text-brand-text mb-2">Genre Harvester</h2>
      <p>Select a genre from the list to begin, or add a new one.</p>
    </div>
  );

  const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-brand-secondary p-8 animate-pulse">
      <Loader className="animate-spin h-12 w-12 text-brand-primary mb-4" />
      <h2 className="text-xl font-semibold text-brand-text">Harvesting data for "{selectedGenre}"...</h2>
      <p>Searching the web and normalizing the brief.</p>
    </div>
  );

  const ErrorScreen = () => (
     <div className="flex flex-col items-center justify-center h-full text-center text-red-400 p-8">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-white">Something Went Wrong</h2>
      <p className="mb-4">{error}</p>
      <button onClick={handleRegenerate} className="flex items-center justify-center bg-brand-primary hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-bg font-sans">
      <header className="md:hidden flex justify-between items-center p-4 bg-brand-surface border-b border-brand-border">
        <h1 className="text-xl font-bold text-brand-primary">Genre Harvester</h1>
      </header>
      
      <aside className="w-full md:w-1/4 lg:w-1/5 bg-brand-surface border-r border-brand-border flex flex-col">
        <GenreList
          genres={genres}
          setGenres={setGenres}
          selectedGenre={selectedGenre}
          onSelectGenre={handleSelectGenre}
        />
      </aside>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-px bg-brand-border">
        <div className="bg-brand-bg p-4 sm:p-6 lg:p-8 flex flex-col relative overflow-y-auto">
          {isLoading ? (
            <LoadingScreen />
          ) : error ? (
            <ErrorScreen />
          ) : genreData ? (
            <BriefDisplay data={genreData} onRegenerate={handleRegenerate} isLoading={isLoading}/>
          ) : (
            <WelcomeScreen />
          )}
        </div>
        <div className="bg-brand-bg p-4 sm:p-6 lg:p-8 hidden lg:flex flex-col overflow-y-auto">
           {genreData && !isLoading && !error && <JsonDisplay data={genreData} />}
        </div>
      </main>
    </div>
  );
};

export default App;
