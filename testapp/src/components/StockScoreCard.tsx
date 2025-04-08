import React from 'react';

// Define the structure for the data this component will receive
interface ScoreData {
  symbol: string;
  companyName?: string;
  overallScore: number;
  // Add more specific score categories as defined by the scoring logic
  valuationScore?: number;
  profitabilityScore?: number;
  growthScore?: number;
  debtScore?: number;
  // Could also include raw KPI data if needed for display
  // kpis?: { [key: string]: number | string };
}

interface StockScoreCardProps {
  scoreData: ScoreData | null;
  isLoading: boolean;
  error: string | null;
}

const StockScoreCard: React.FC<StockScoreCardProps> = ({ scoreData, isLoading, error }) => {
  if (isLoading) {
    return <div className="mt-8 text-center">Loading score...</div>;
  }

  if (error) {
    return <div className="mt-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!scoreData) {
    // Initially, before a search is made
    return null; 
  }

  // Basic display structure - will be enhanced with styling and more details
  return (
    <div className="mt-8 p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {scoreData.companyName || scoreData.symbol} ({scoreData.symbol})
      </h2>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-600">Overall Score:</p>
        {/* TODO: Add more visual representation for the score (e.g., gauge, color coding) */}
        <p className="text-5xl font-bold text-blue-600">{scoreData.overallScore}<span className="text-xl text-gray-500"> / 100</span></p>
      </div>
      {/* Placeholder for detailed scores - map through categories later */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">Detailed scores (placeholders):</p>
        {scoreData.valuationScore !== undefined && (
            <div className="flex justify-between"><span className="text-gray-700">Valuation:</span> <span className="font-semibold">{scoreData.valuationScore}</span></div>
        )}
         {scoreData.profitabilityScore !== undefined && (
            <div className="flex justify-between"><span className="text-gray-700">Profitability:</span> <span className="font-semibold">{scoreData.profitabilityScore}</span></div>
        )}
         {scoreData.growthScore !== undefined && (
            <div className="flex justify-between"><span className="text-gray-700">Growth:</span> <span className="font-semibold">{scoreData.growthScore}</span></div>
        )}
         {scoreData.debtScore !== undefined && (
            <div className="flex justify-between"><span className="text-gray-700">Debt Structure:</span> <span className="font-semibold">{scoreData.debtScore}</span></div>
        )}
      </div>
       {/* Add link/button to Score Calculation page as per README */}
       <div className="text-center pt-2">
            {/* TODO: Implement routing to score calculation page */}
            <a href="#" className="text-sm text-blue-500 hover:underline">How is this score calculated?</a>
       </div>
    </div>
  );
};

export default StockScoreCard; 