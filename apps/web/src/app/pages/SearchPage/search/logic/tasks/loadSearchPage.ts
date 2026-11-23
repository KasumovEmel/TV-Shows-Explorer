import type { LoadSearchPageParams } from '../types/SearchPageRequest';


export function loadSearchPage({ criteria, signal, requestPage }: LoadSearchPageParams) {
  return requestPage(criteria, { signal });
}
