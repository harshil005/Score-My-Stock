import axios from 'axios';

// --- Configuration ---
// IMPORTANT: Replace 'YOUR_FINNHUB_API_KEY' with your actual key, 
// preferably loaded from environment variables (.env.local)
const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || 'YOUR_FINNHUB_API_KEY'; 
const BASE_URL = 'https://finnhub.io/api/v1';

if (API_KEY === 'YOUR_FINNHUB_API_KEY') {
    console.warn('Finnhub API key is not configured. Please set NEXT_PUBLIC_FINNHUB_API_KEY in your .env.local file.');
}

const finnhubClient = axios.create({
  baseURL: BASE_URL,
  params: {
    token: API_KEY,
  },
});

// --- API Call Functions ---

/**
 * Searches for stock symbols matching the query.
 * Finnhub API: /search
 */
export const searchSymbols = async (query: string): Promise<any> => {
  if (!query || API_KEY === 'YOUR_FINNHUB_API_KEY') {
    // Return empty or mock data if no query or API key is missing
    return { count: 0, result: [] };
  }
  try {
    const response = await finnhubClient.get('/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Finnhub search results:', error);
    throw new Error('Failed to fetch stock symbols.');
  }
};

/**
 * Fetches company profile information.
 * Finnhub API: /stock/profile2
 */
export const getCompanyProfile = async (symbol: string): Promise<any> => {
  if (!symbol || API_KEY === 'YOUR_FINNHUB_API_KEY') {
    return null; 
  }
  try {
    const response = await finnhubClient.get('/stock/profile2', {
      params: { symbol: symbol },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching Finnhub profile for ${symbol}:`, error);
    throw new Error(`Failed to fetch company profile for ${symbol}.`);
  }
};

/**
 * Fetches basic financial metrics for a company.
 * Finnhub API: /stock/metric
 */
export const getBasicFinancials = async (symbol: string): Promise<any> => {
   if (!symbol || API_KEY === 'YOUR_FINNHUB_API_KEY') {
    return null; 
  }
  try {
    const response = await finnhubClient.get('/stock/metric', {
        params: { symbol: symbol, metric: 'all' }, // Fetch all available basic metrics
    });
    // The response structure includes a 'metric' object with the KPIs
    return response.data;
  } catch (error) {
    console.error(`Error fetching Finnhub basic financials for ${symbol}:`, error);
    throw new Error(`Failed to fetch basic financials for ${symbol}.`);
  }
};

// --- Add more functions as needed for other Finnhub endpoints (e.g., financials, quotes) --- 