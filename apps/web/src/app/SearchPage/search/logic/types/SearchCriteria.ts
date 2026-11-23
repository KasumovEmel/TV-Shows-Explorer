export interface SearchCriteria {
  q: string;
  genre?: string;
  page: number;
}

export interface SelectGenreParams {
  criteria: SearchCriteria;
  genre: string;
}
