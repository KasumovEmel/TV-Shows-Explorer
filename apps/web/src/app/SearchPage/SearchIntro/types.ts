import type { RefObject } from 'react';

import type { SearchFieldProps } from './components/SearchField';


export interface SearchIntroProps {
  restored: boolean;
  introRef: RefObject<HTMLElement | null>;
  field: SearchFieldProps;
}
