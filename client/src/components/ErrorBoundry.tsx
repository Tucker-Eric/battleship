import React, { Component } from 'react';
import { Alert } from 'reactstrap';

export default class ErrorBoundry extends Component {
  state = { hasError: false };
  componentDidCatch(error: Error | null, errorInfo: object) {
    console.log(error, errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert color="danger">
          Uh Oh! Something went wrong. Refresh your browser and try again
        </Alert>
      );
    }

    return this.props.children;
  }
}
