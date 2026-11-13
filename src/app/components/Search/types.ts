import type { RefObject } from 'react';


export interface SearchPageProps {
  restored: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export interface SearchProps extends SearchPageProps {
  headerRef: RefObject<HTMLElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}
