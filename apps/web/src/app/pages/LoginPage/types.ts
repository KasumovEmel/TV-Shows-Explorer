import type { AccountControls, SubmitEmail } from '@/app/logic/auth';


export interface LoginPageProps {
  account: AccountControls;
  login: SubmitEmail;
}
