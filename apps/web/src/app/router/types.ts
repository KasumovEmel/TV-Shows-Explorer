import type { PropsWithChildren } from 'react';


export interface RouterProps extends PropsWithChildren {
  isRestored: boolean;
}

export type OnLocationChange = () => void;
