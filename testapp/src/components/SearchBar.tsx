"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Suggestion {
  symbol: string;
  description: string;
}

interface SearchBarProps {
  onStockSelect: (symbol: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onStockSelect }) => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Debounce function (simple implementation)
  const debounce = <F extends (...args: any[]) => any>(
    func: F,
    delay: number
  ) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<F>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsLoading(true);
    try {
      // Replace placeholder with actual API call
      const response = await axios.get(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      // Assuming the API returns { results: Suggestion[] }
      setSuggestions(response.data.results || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

  useEffect(() => {
    if (query) {
        debouncedFetchSuggestions(query);
    } else {
        setSuggestions([]);
        setShowSuggestions(false);
    }
  }, [query, debouncedFetchSuggestions]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    setSelectedSymbol(null); // Clear selected symbol if user types again
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.description); // Put description in input for clarity
    setSelectedSymbol(suggestion.symbol); // Store the actual symbol
    setSuggestions([]);
    setShowSuggestions(false);
    // Optionally trigger search immediately on click
    // handleSubmit(); 
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (selectedSymbol) {
        console.log(`Submitting symbol: ${selectedSymbol}`);
        onStockSelect(selectedSymbol);
        setQuery(''); // Clear input after submission
        setSelectedSymbol(null);
    } else if (suggestions.length === 1) {
        // If only one suggestion remains and user presses Enter
        const singleSuggestion = suggestions[0];
        setSelectedSymbol(singleSuggestion.symbol);
        onStockSelect(singleSuggestion.symbol);
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
    } else {
        // Handle case where input doesn't match a selected symbol (e.g., show error)
        console.log("Please select a valid stock from the suggestions.");
        // Maybe try searching based on the raw query if API supports it?
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center bg-white rounded-full shadow-md p-1">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && suggestions.length > 0 && setShowSuggestions(true)} // Show suggestions on focus if they exist
          // onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // Hide suggestions on blur (with delay to allow click)
          placeholder="Search for a stock (e.g., AAPL or Apple)"
          className="w-full px-4 py-2 text-gray-700 focus:outline-none rounded-l-full"
        />
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-r-full transition duration-150 ease-in-out disabled:opacity-50"
          disabled={!selectedSymbol && suggestions.length !== 1}
        >
          Score
        </button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul 
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
            // Use mousedown event to handle click before blur hides the list
            onMouseDown={(e) => e.preventDefault()} 
        >
          {isLoading ? (
            <li className="px-4 py-2 text-gray-500">Loading...</li>
          ) : (
            suggestions.map((suggestion) => (
              <li
                key={suggestion.symbol}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="font-bold">{suggestion.symbol}</span> - {suggestion.description}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar; 