export interface PageNavProps {
  loading: boolean;
  pages: number;
  current: number;
  jump: (page: number, keyboard: boolean) => void;
}
