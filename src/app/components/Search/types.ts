export interface SearchPageProps {
  restored: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export interface SearchProps extends SearchPageProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}
