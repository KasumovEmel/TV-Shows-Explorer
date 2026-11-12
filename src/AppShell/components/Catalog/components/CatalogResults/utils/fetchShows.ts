import axios from 'axios';
import type { Show } from '../types';
export async function fetchShows(url: string) {
  return (await axios.get<Show[]>(url)).data;
}
