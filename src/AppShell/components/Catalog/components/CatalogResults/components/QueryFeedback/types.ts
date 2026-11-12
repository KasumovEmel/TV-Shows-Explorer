export interface QueryFeedbackProps {
  state: 'loading' | 'error' | 'empty';
  retry: () => void;
}
