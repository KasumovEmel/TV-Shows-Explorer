export interface CatalogResultsProps {
  query: string | null;
}
export interface TVmazeShow {
  id: number;
  name: string;
  genres: string[];
  premiered: string | null;
  image: { medium: string; original: string } | null;
}
