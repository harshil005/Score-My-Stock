"use client";

import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '@/components/SearchBar';
import StockScoreCard from '@/components/StockScoreCard';
import type { ScoreData } from '@/components/StockScoreCard'; // Import the type

export default function Home() {
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string | null>(null);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStockSelect = async (symbol: string) => {
    console.log("Selected stock:", symbol);
    setSelectedStockSymbol(symbol);
    setIsLoading(true);
    setError(null);
    setScoreData(null); // Clear previous score data

    try {
      // Call the /api/score endpoint
      const response = await axios.get(`/api/score?symbol=${symbol}`);
      // Ensure the response data matches the ScoreData type structure
      if (response.data && typeof response.data.overallScore === 'number') {
          setScoreData(response.data as ScoreData);
      } else {
          throw new Error('Invalid data received from score API');
      }
    } catch (err: any) {
      console.error("Error fetching score:", err);
      // Extract error message from API response if available, otherwise use default
      const message = err.response?.data?.message || err.message || 'Failed to fetch stock score.';
      setError(message);
      setScoreData(null); // Clear score data on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 md:p-12 lg:p-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col">
        {/* Title/Header */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
          Score My Stock
        </h1>
        <p className="text-md md:text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
          Get an objective, data-driven score for your stock picks.
        </p>

        {/* Search Bar */}
        <div className="w-full mb-6">
            <SearchBar onStockSelect={handleStockSelect} />
        </div>

        {/* Score Card Display Area */}
        <div className="w-full">
            <StockScoreCard scoreData={scoreData} isLoading={isLoading} error={error} />
        </div>

        {/* Optional: Add About section based on README */}
        {/* <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p>Built to empower individual investors with transparent insights.</p>
        </div> */}
      </div>
    </main>
  );
}
