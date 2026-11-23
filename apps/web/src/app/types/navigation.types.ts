export interface Navigation {
  path: string;
  replace?: boolean;
  onNavigate?: () => void;
}
