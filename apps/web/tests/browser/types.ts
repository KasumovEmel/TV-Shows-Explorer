import type { JSHandle, Locator, Page, Route } from '@playwright/test';

import type { NotificationEvent } from '../../src/app/notifications';
import type { Show } from '../../src/app/types/show.types';


export type ReleaseRequest = () => void;

export interface NotifyParams {
  page: Page;
  events: NotificationEvent[];
}

export interface SeekRemovalParams {
  motions: JSHandle<Animation[]>;
  time: number;
}

export interface PageResponseParams {
  items: Show[];
  url: string;
}

export interface RespondParams {
  route: Route;
  items: Show[];
}

export interface HoldRequestsParams {
  page: Page;
  pattern: RegExp;
}

export interface ExpectRowsParams {
  rows: Locator;
  container: Locator;
}
