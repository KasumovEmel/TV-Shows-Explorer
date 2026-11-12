import axios from 'axios';
import useSWR from 'swr';

interface Show {
  id: string;
  originalTitle: string;
  year: number;
  genre: string;
}

async function fetchShows(url: string) {
  const response = await axios.get<Show[]>(url);
  return response.data;
}

export function usePresenter() {
  return useSWR<Show[], Error>('/shows.json', fetchShows);
}
