import { NextRequest, NextResponse } from 'next/server';
import { getCompanyProfile, getBasicFinancials } from '@/lib/finnhub';

// Placeholder scoring function - replace with actual logic based on README/requirements
const calculateScore = (profile: any, financials: any): number => {
    console.log("Calculating score with:", { profile, financials });
    // Example: very basic score based on presence of data
    let score = 0;
    if (profile && Object.keys(profile).length > 0) score += 25;
    if (financials && financials.metric && Object.keys(financials.metric).length > 0) score += 25;
    
    // --- TODO: Implement actual scoring logic --- 
    // Access specific metrics from financials.metric, e.g., financials.metric.peRatioAnnual
    // Define categories (Valuation, Profitability, Growth, Debt) and assign points based on KPI values.
    // Normalize and weight scores for each category.
    // Combine into an overall score (e.g., out of 100).
    // Example using a hypothetical P/E ratio:
    const peRatio = financials?.metric?.peRatioAnnual;
    if (peRatio !== undefined && peRatio > 0 && peRatio < 20) {
        score += 25; // Favorable P/E
    }

    // Ensure score is within a range (e.g., 0-100)
    return Math.max(0, Math.min(100, score)); 
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ message: 'Query parameter "symbol" is required' }, { status: 400 });
  }

  try {
    // Fetch data from Finnhub in parallel
    const [profile, financials] = await Promise.all([
      getCompanyProfile(symbol),
      getBasicFinancials(symbol),
    ]);

    if (!profile && !financials) {
         return NextResponse.json({ message: `No data found for symbol: ${symbol}` }, { status: 404 });
    }

    // Calculate the score using the fetched data
    const overallScore = calculateScore(profile, financials);

    // Prepare the response object matching ScoreData interface in StockScoreCard
    const scoreData = {
      symbol: symbol,
      companyName: profile?.name || symbol, // Use company name from profile if available
      overallScore: overallScore,
      // TODO: Add detailed scores once scoring logic is implemented
      // valuationScore: ..., 
      // profitabilityScore: ...,
      // growthScore: ...,
      // debtScore: ..., 
    };

    return NextResponse.json(scoreData);

  } catch (error) {
    console.error(`[API /score] Error for symbol ${symbol}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Failed to get score for ${symbol}: ${errorMessage}` }, { status: 500 });
  }
} 