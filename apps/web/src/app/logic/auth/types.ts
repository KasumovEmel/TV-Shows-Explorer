export interface AccountControls {
  email?: string | null;
  logout: () => void;
  isPending: boolean;
}

export interface UserSession {
  email: string;
  scope: AbortController;
}

export type SubmitEmail = (email: string) => void;
