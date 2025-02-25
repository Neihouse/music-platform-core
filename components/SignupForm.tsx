"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  TextInput, 
  Button, 
  Group, 
  Box, 
  PasswordInput,
  Stack,
  Title,
  Text,
  Paper,
  Divider,
  Container,
  rem,
  Anchor
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { signup } from '@/utils/auth'
import { 
  IconMail, 
  IconLock,
  IconUser,
  IconBrandGoogle,
  IconBrandGithub
} from '@tabler/icons-react'
import Link from 'next/link'

interface SignupFormValues {
  email: string
  password: string
  name: string
  confirmPassword: string
}

export function SignupForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+$/.test(value)) return 'Invalid email address';
        return null;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
      name: (value) => {
        if (!value) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > 50) return 'Name must be less than 50 characters';
        return null;
      },
    },
  })

  const handleSubmit = async (values: SignupFormValues) => {
    try {
      setLoading(true)
      
      const { user } = await signup(values)
      
      notifications.show({
        title: 'Success',
        message: 'Account created successfully! Welcome to MusicApp.',
        color: 'green',
      })
      
      router.push('/dashboard')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up'
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignup = (provider: string) => {
    notifications.show({
      title: 'Info',
      message: `${provider} signup is not available in demo mode`,
      color: 'blue',
    })
  }

  return (
    <Container size="xs">
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} ta="center" mt="md" mb={50}>
          Create your MusicApp account
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              required
              label="Name"
              placeholder="Your name"
              radius="md"
              size="md"
              leftSection={<IconUser size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />}
              {...form.getInputProps('name')}
            />

            <TextInput
              required
              label="Email"
              placeholder="your@email.com"
              radius="md"
              size="md"
              leftSection={<IconMail size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />}
              {...form.getInputProps('email')}
            />
            
            <PasswordInput
              required
              label="Password"
              placeholder="Create a strong password"
              description="Password must be at least 8 characters long, include uppercase, lowercase, and numbers"
              radius="md"
              size="md"
              leftSection={<IconLock size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />}
              {...form.getInputProps('password')}
            />

            <PasswordInput
              required
              label="Confirm Password"
              placeholder="Confirm your password"
              {...form.getInputProps('confirmPassword')}
            />

            <Text size="sm" c="dimmed" mt="sm">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </Text>

            <Button 
              type="submit" 
              loading={loading}
              fullWidth
              radius="md"
              size="md"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>

            <Text ta="center" size="sm">
              Already have an account?{' '}
              <Text component={Link} href="/login" size="sm" style={{ textDecoration: 'underline' }}>
                Sign in
              </Text>
            </Text>
          </Stack>
        </form>

        <Divider label="Or continue with" labelPosition="center" my="lg" />

        <Group grow mb="md" mt="md">
          <Button
            variant="default"
            radius="md"
            leftSection={<IconBrandGoogle size={rem(18)} />}
            onClick={() => handleSocialSignup('Google')}
          >
            Google
          </Button>
          <Button
            variant="default"
            radius="md"
            leftSection={<IconBrandGithub size={rem(18)} />}
            onClick={() => handleSocialSignup('GitHub')}
          >
            GitHub
          </Button>
        </Group>
      </Paper>
    </Container>
  )
}

