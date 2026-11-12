import type { ComponentPropsWithRef } from 'react';
import type { IconName } from '@shared/components/Icon';
type Native = Omit<ComponentPropsWithRef<'button'>, 'children'>;
export type ButtonProps = Native &
  (
    | { variant: 'icon'; icon: IconName; 'aria-label': string; children?: never }
    | { variant?: 'primary' | 'chip'; icon?: IconName; children: string }
  );
