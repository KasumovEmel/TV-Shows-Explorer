import type { IconName } from '../Icon';
import type { ComponentPropsWithRef, ReactElement } from 'react';


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
