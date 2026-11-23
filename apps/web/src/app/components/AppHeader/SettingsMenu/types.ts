import type { PropsWithChildren } from 'react';

import type { AccountControls } from '@/app/logic/auth';


export interface SettingsMenuProps extends PropsWithChildren {
  account: AccountControls;
}
