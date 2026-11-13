export interface TVmazeShow {
  id: number;
  name: string;
  genres: string[];
  premiered: string | null;
  summary?: string | null;
  rating?: { average: number | null } | null;
  image: { medium: string; original: string } | null;
}
