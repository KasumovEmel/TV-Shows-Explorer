import type { IconName } from '@shared/components/Icon';
import type { ComponentPropsWithRef } from 'react';


type Native = Omit<ComponentPropsWithRef<'button'>, 'children'>;
export type ButtonProps = Native &
  (
    | { variant: 'icon'; icon: IconName; 'aria-label': string; children?: never }
    | { variant?: 'primary' | 'chip'; icon?: IconName; children: string }
  );
