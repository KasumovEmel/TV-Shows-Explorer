import type { ComponentPropsWithRef, ReactElement } from 'react';

import type { IconName } from '@components/Icon';


type IconButton = {
  variant: 'icon' | 'framedIcon';
  icon: IconName | ReactElement;
  'aria-label': string;
  children?: never;
};

type TextButton = { variant?: 'primary' | 'chip'; icon?: IconName; children: string };

export type ButtonProps = { transparent?: boolean } & (
  | (Omit<ComponentPropsWithRef<'button'>, 'children'> & (IconButton | TextButton))
  | (ComponentPropsWithRef<'a'> & { href: string } & Omit<IconButton, 'children'>)
);
