export interface ResultsProps {
  search: { query: string; signal: AbortSignal } | null;
  entering: boolean;
  genre: string;
  revision: number;
  selectGenre: (value: string) => void;
}
