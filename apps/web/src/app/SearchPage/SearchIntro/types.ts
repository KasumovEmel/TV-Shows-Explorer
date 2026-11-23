import type { RefObject } from 'react';

import type { SearchFieldProps } from './components/SearchField';


export interface SearchIntroProps {
  isRestored: boolean;
  introRef: RefObject<HTMLElement | null>;
  field: SearchFieldProps;
}
