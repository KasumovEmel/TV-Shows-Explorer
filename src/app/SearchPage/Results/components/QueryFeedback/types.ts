export interface QueryFeedbackProps {
  state: 'error' | 'empty' | 'filtered';
  retry: () => void;
}
