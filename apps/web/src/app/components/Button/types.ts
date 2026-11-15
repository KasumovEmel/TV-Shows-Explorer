import type { ComponentPropsWithRef, ReactElement } from 'react';

import type { IconName } from '../Icon';


type IconButton = {
  variant: 'icon' | 'framedIcon';
  icon: IconName | ReactElement;
  'aria-label': string;
  children?: never;
};

type TextButton = { variant?: 'primary' | 'chip'; icon?: IconName; children: string };

export type ButtonProps = { transparent?: boolean } & (
  | (Omit<ComponentPropsWithRef<'button'>, 'children'> & (IconButton | TextButton))
  | (Omit<ComponentPropsWithRef<'a'>, 'children'> & { href: string } & IconButton)
);
