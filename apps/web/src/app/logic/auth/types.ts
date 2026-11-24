export interface AccountControls {
  email?: string | null;
  logout: () => void;
  isPending: boolean;
}

export interface UserSession {
  email: string;
  signal: AbortSignal;
}

export type SubmitEmail = (email: string) => void;
