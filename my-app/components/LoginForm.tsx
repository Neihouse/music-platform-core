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
  rem
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { login } from '@/utils/auth'
import { 
  IconMail, 
  IconLock,
  IconBrandGoogle,
  IconBrandGithub
} from '@tabler/icons-react'
import Link from 'next/link'

interface LoginFormValues {
  email: string
  password: string
}

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  })

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true)
      
      const { user } = await login(values.email, values.password)
      
      notifications.show({
        title: 'Success',
        message: 'Logged in successfully',
        color: 'green',
      })
      
      router.push('/dashboard')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to log in'
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    notifications.show({
      title: 'Info',
      message: `${provider} login is not available in demo mode`,
      color: 'blue',
    })
  }

  return (
    <Container size="xs">
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} ta="center" mt="md" mb={50}>
          Welcome back to MusicApp
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
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
              placeholder="Your password"
              radius="md"
              size="md"
              leftSection={<IconLock size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />}
              {...form.getInputProps('password')}
            />

            <Group justify="space-between" mt="md">
              <Text component={Link} href="/signup" size="sm">
                Don&apos;t have an account? Sign up
              </Text>
              <Text component={Link} href="/reset-password" size="sm">
                Forgot password?
              </Text>
            </Group>

            <Button 
              type="submit" 
              loading={loading}
              fullWidth
              radius="md"
              size="md"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Stack>
        </form>

        <Divider label="Or continue with" labelPosition="center" my="lg" />

        <Group grow mb="md" mt="md">
          <Button
            variant="default"
            radius="md"
            leftSection={<IconBrandGoogle size={rem(18)} />}
            onClick={() => handleSocialLogin('Google')}
          >
            Google
          </Button>
          <Button
            variant="default"
            radius="md"
            leftSection={<IconBrandGithub size={rem(18)} />}
            onClick={() => handleSocialLogin('GitHub')}
          >
            GitHub
          </Button>
        </Group>
      </Paper>
    </Container>
  )
}

