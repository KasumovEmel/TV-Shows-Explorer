export interface CatalogResultsProps {
  query: string;
  genre: string;
  onGenre: (value: string) => void;
}
export interface Show {
  id: string;
  originalTitle: string;
  year: number;
  genre: string;
}
