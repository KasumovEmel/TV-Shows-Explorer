export interface PageNavProps {
  pages: number;
  current: number;
  jump: (page: number, keyboard: boolean) => void;
}
