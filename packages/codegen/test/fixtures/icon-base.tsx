import { createElement, type ReactNode } from 'react';

interface IconProps {
  size?: number;
  children?: ReactNode;
  [key: string]: unknown;
}

export function Icon({ size = 24, children, ...props }: IconProps) {
  return createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      ...props,
    },
    children,
  );
}
