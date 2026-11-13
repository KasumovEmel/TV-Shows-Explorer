import { Component } from 'react';

import { RecoveryScreen } from './components/RecoveryScreen';
import type { BoundaryState, ErrorBoundaryProps } from './types';


export class ErrorBoundary extends Component<ErrorBoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false, retrying: false, attempt: 0 };
  private locked = false;

  static getDerivedStateFromError() {
    return { failed: true, retrying: false };
  }

  componentDidUpdate() {
    if (!this.state.retrying) {
      this.locked = false;
    }
  }

  private restore = () => {
    if (this.locked || !this.state.failed) {
      return;
    }
    this.locked = true;
    this.setState({ retrying: true }, () => {
      this.setState(({ attempt }) => ({ failed: false, retrying: false, attempt: attempt + 1 }));
    });
  };

  render() {
    const { failed, retrying, attempt } = this.state;
    if (failed) {
      return <RecoveryScreen key={attempt} retrying={retrying} onRestore={this.restore} />;
    }

    return this.props.children(attempt > 0);
  }
}
