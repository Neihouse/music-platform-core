import { Alert, Button, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Stack align="center" gap="md" p="xl">
          <IconAlertCircle size={48} color="var(--mantine-color-red-6)" />
          <Title order={2}>Something went wrong</Title>
          <Text c="dimmed">An error occurred while rendering this component</Text>
          <Alert color="red" variant="light" title="Error details">
            {this.state.error?.message}
          </Alert>
          <Button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </Button>
        </Stack>
      );
    }

    return this.props.children;
  }
} 