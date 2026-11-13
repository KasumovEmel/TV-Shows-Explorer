import { usePresenter } from './usePresenter';

import type { IconProps } from './types';


export function Icon(props: IconProps) {
  const { path, size } = usePresenter(props);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}
