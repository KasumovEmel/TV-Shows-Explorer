import type { RefObject } from 'react';


export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}
