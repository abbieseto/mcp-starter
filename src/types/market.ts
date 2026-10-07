export type AssetCategory = 'indices' | 'stocks' | 'crypto' | 'forex' | 'futures' | 'bonds';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface Candle {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  exchange: string;
  currency: string;
  sector?: string;
  country?: string;
  price: number;
  change: number;
  changePercent: number;
  prevClose: number;
  open: number;
  high: number;
  low: number;
  volume: string;
  volumeNumeric: number;
  marketCap?: string;
  marketCapNumeric?: number;
  peRatio?: number;
  dividendYield?: number;
  dayRange: {
    low: number;
    high: number;
  };
  yearRange: {
    low: number;
    high: number;
  };
  technicalRating: TechnicalRating;
  ratingScores: {
    buy: number;
    neutral: number;
    sell: number;
  };
  sparkline: number[];
  candles: Candle[];
  lastUpdate?: number;
}

export interface SectorHeatmapData {
  name: string;
  color: string;
  weight: number;
  items: {
    symbol: string;
    name: string;
    price: number;
    changePercent: number;
    marketCap: string;
    weight: number;
    pe?: number;
  }[];
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  flag: string;
  date: string;
  time: string;
  impact: 'High' | 'Medium' | 'Low';
  actual?: string;
  forecast: string;
  previous: string;
}

export interface MarketNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  category: string;
  imageUrl?: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  symbols: string[];
}

export interface TradingIdea {
  id: string;
  title: string;
  author: string;
  authorBadge: string;
  symbol: string;
  side: 'Long' | 'Short' | 'Neutral';
  timeframe: string;
  targetPrice: string;
  likes: number;
  comments: number;
  timestamp: string;
  description: string;
}
