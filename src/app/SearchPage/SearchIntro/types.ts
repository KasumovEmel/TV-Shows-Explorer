import type { SearchFieldProps } from './components/SearchField';
import type { RefObject } from 'react';


export interface SearchIntroProps {
  restored: boolean;
  introRef: RefObject<HTMLElement | null>;
  field: SearchFieldProps;
}
