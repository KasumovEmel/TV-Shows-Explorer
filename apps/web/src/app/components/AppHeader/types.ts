import type { AccountControls } from '@/app/logic/auth';


export interface AppHeaderProps {
  isFavoritesPage?: boolean;
  account: AccountControls;
  isLoginPage?: boolean;
  count?: number;
}
