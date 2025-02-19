"use client"

import { TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';

interface AuthFormValues {
  email: string;
  password: string;
}

interface AuthProps {
  view: 'sign_in' | 'sign_up';
}

export function Auth({ view }: AuthProps) {
  const router = useRouter();
  const form = useForm<AuthFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: AuthFormValues) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace with actual auth logic
      localStorage.setItem('user', JSON.stringify({ email: values.email }));
      
      notifications.show({
        title: 'Success',
        message: view === 'sign_in' ? 'Successfully logged in!' : 'Account created successfully!',
        color: 'green',
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Authentication failed. Please try again.',
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          required
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          required
          label="Password"
          placeholder="Your password"
          {...form.getInputProps('password')}
        />

        <Button type="submit" fullWidth mt="sm">
          {view === 'sign_in' ? 'Sign in' : 'Create account'}
        </Button>
      </Stack>
    </form>
  );
} 