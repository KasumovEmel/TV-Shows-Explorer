import { Component } from 'react';

import { RecoveryScreen } from './components/RecoveryScreen';
import type { BoundaryState, ErrorBoundaryProps } from './types';


export class ErrorBoundary extends Component<ErrorBoundaryProps, BoundaryState> {
  state: BoundaryState = { isFailed: false, isRetrying: false, attempt: 0 };
  private isLocked = false;

  static getDerivedStateFromError() {
    return { isFailed: true, isRetrying: false };
  }

  componentDidUpdate() {
    if (!this.state.isRetrying) {
      this.isLocked = false;
    }
  }

  private restore = () => {
    if (this.isLocked || !this.state.isFailed) {
      return;
    }
    this.isLocked = true;
    this.setState({ isRetrying: true }, () => {
      this.setState(({ attempt }) => ({
        isFailed: false,
        isRetrying: false,
        attempt: attempt + 1,
      }));
    });
  };

  render() {
    const { isFailed, isRetrying, attempt } = this.state;
    if (isFailed) {
      return <RecoveryScreen key={attempt} isRetrying={isRetrying} onRestore={this.restore} />;
    }

    const Screen = this.props.children;

    return <Screen isRestored={attempt > 0} />;
  }
}
