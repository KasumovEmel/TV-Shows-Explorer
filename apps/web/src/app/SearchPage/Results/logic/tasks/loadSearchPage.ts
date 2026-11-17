import type { LoadSearchPageParams } from '../types';


export function loadSearchPage({ criteria, signal, requestPage }: LoadSearchPageParams) {
  return requestPage(criteria, { signal });
}
