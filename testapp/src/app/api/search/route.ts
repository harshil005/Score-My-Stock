import { NextRequest, NextResponse } from 'next/server';
import { searchSymbols } from '@/lib/finnhub'; // Using path alias defined in tsconfig.json

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ message: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const searchResults = await searchSymbols(query);

    // Finnhub's /search endpoint returns an object like: 
    // { count: 3, result: [ { description: 'APPLE INC', displaySymbol: 'AAPL', symbol: 'AAPL', type: 'Common Stock' }, ... ] }
    // We want to map this to the format expected by SearchBar: { symbol: string, description: string }[]
    const formattedSuggestions = (searchResults.result || []).map((item: any) => ({
        symbol: item.symbol, 
        description: item.description,
        // Optional: include displaySymbol if needed, or filter by type
    }));

    return NextResponse.json({ results: formattedSuggestions });

  } catch (error) {
    console.error('[API /search] Error:', error);
    // Determine if the error is a custom error from finnhub.ts or a generic one
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Failed to fetch search results: ${errorMessage}` }, { status: 500 });
  }
} 