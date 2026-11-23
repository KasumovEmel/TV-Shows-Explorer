export interface PageNavProps {
  isLoading: boolean;
  pages: number;
  current: number;
  jump: (params: PageJump) => void;
}

export interface PageJump {
  page: number;
  isKeyboardNavigation: boolean;
}
