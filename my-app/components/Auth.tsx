"use client"

import { TextInput, PasswordInput, Button, Stack, Text, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';

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
      if (view === 'sign_up') {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (error) throw error;

        notifications.show({
          title: 'Success',
          message: 'Check your email to confirm your account!',
          color: 'green',
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) throw error;

        notifications.show({
          title: 'Success',
          message: 'Successfully logged in!',
          color: 'green',
        });

        router.push('/dashboard');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Authentication failed',
        color: 'red',
      });
    }
  };

  return (
    <Stack gap="md">
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

      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {view === 'sign_in' ? (
          <>
            Don&apos;t have an account?{' '}
            <Anchor component={Link} href="/signup" size="sm">
              Create account
            </Anchor>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Anchor component={Link} href="/login" size="sm">
              Sign in
            </Anchor>
          </>
        )}
      </Text>
    </Stack>
  );
} 