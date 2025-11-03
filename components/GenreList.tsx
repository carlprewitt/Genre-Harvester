
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Search, Plus } from 'lucide-react';

interface GenreListProps {
  genres: string[];
  setGenres: React.Dispatch<React.SetStateAction<string[]>>;
  selectedGenre: string | null;
  onSelectGenre: (genre: string) => void;
}

const GenreList: React.FC<GenreListProps> = ({ genres, setGenres, selectedGenre, onSelectGenre }) => {
  const [filter, setFilter] = useState('');
  const [newGenre, setNewGenre] = useState('');

  const handleAddGenre = (e: FormEvent) => {
    e.preventDefault();
    const trimmedGenre = newGenre.trim();
    if (trimmedGenre && !genres.map(g => g.toLowerCase()).includes(trimmedGenre.toLowerCase())) {
      const capitalizedGenre = trimmedGenre.charAt(0).toUpperCase() + trimmedGenre.slice(1);
      const newGenres = [capitalizedGenre, ...genres];
      setGenres(newGenres);
      onSelectGenre(capitalizedGenre);
      setNewGenre('');
      setFilter('');
    }
  };

  const filteredGenres = genres
    .filter(genre => genre.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="hidden md:flex items-center space-x-2">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        <h1 className="text-xl font-bold">Genre Harvester</h1>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-secondary" />
        <input
          type="text"
          placeholder="Filter genres..."
          value={filter}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
          className="w-full bg-brand-bg border border-brand-border rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
        />
      </div>
      <form onSubmit={handleAddGenre} className="flex space-x-2">
        <input
          type="text"
          placeholder="Add a new genre..."
          value={newGenre}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewGenre(e.target.value)}
          className="flex-grow bg-brand-bg border border-brand-border rounded-md px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
        />
        <button type="submit" className="bg-brand-primary text-white p-2 rounded-md hover:bg-green-500 transition-colors flex items-center justify-center shrink-0">
          <Plus className="h-5 w-5" />
        </button>
      </form>
      <nav className="flex-1 overflow-y-auto pr-2 -mr-2">
        <ul className="space-y-1">
          {filteredGenres.map(genre => (
            <li key={genre}>
              <button
                onClick={() => onSelectGenre(genre)}
                className={`w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                  selectedGenre === genre
                    ? 'bg-brand-primary text-white font-semibold'
                    : 'text-brand-secondary hover:bg-brand-border hover:text-brand-text'
                }`}
              >
                {genre}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default GenreList;
