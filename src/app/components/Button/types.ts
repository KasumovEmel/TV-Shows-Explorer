import type { ComponentPropsWithRef, ReactElement } from 'react';

import type { IconName } from '../Icon';


type Native = Omit<ComponentPropsWithRef<'button'>, 'children'>;
export type ButtonProps = Native & { transparent?: boolean } & (
    | {
        variant: 'icon' | 'framedIcon';
        icon: IconName | ReactElement;
        'aria-label': string;
        children?: never;
      }
    | { variant?: 'primary' | 'chip'; icon?: IconName; children: string }
  );
