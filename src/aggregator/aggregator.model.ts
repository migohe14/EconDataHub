export interface SeriesSummary {
  indicator: string;
  unit?: string;
  country: string;
  latest_value: number;
  previous_value: number;
  change: number;
  change_pct: number;
  observation_start: string;
  observation_end: string;
}

export interface MarketViewAnalysisBody {
  query: string;
  seriesIds?: string[];
}