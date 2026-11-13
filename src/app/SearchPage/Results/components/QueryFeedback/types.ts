export interface QueryFeedbackProps {
  state: 'error' | 'empty';
  retry: () => void;
}
