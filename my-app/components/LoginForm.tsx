"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  Button, 
  Stack, 
  Alert, 
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Group,
  Anchor,
  Divider,
  rem,
  Container,
  Transition
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { 
  IconAlertCircle, 
  IconMail, 
  IconLock,
  IconCheck
} from '@tabler/icons-react'
import Link from 'next/link'
import { useDisclosure } from '@mantine/hooks'
import { z } from 'zod'

const schema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, { toggle }] = useDisclosure(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(schema),
  })

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) throw error

      setSuccess(true)
      toggle() // Start exit animation
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Transition mounted={mounted} transition="fade" duration={400}>
      {(styles) => (
        <Container size="xs" style={styles}>
          <Paper radius="md" p="xl" withBorder>
            <Stack gap="md">
              <Title order={2} ta="center" mt="md">
                Welcome back
              </Title>
              <Text c="dimmed" size="sm" ta="center" mb="lg">
                Sign in to your account to continue
              </Text>

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

                  {error && (
                    <Alert 
                      color="red" 
                      title="Error" 
                      variant="filled" 
                      icon={<IconAlertCircle size={rem(16)} />}
                    >
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert 
                      color="green" 
                      title="Success" 
                      variant="filled"
                      icon={<IconCheck size={rem(16)} />}
                    >
                      Signed in successfully! Redirecting...
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    loading={isLoading}
                    fullWidth
                    radius="md"
                    size="md"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>

                  <Divider 
                    label="or" 
                    labelPosition="center"
                    my="sm"
                  />

                  <Group justify="space-between" gap="xs">
                    <Anchor 
                      component={Link}
                      href="/forgot-password"
                      size="sm"
                      c="dimmed"
                      style={(theme) => ({
                        transition: 'color 150ms ease',
                        '&:hover': {
                          color: theme.colors.blue[5],
                        },
                      })}
                    >
                      Forgot your password?
                    </Anchor>
                    <Group gap={5} justify="flex-end">
                      <Text size="sm" c="dimmed">
                        Don&apos;t have an account?
                      </Text>
                      <Anchor 
                        component={Link}
                        href="/signup"
                        size="sm"
                        fw={500}
                        style={(theme) => ({
                          transition: 'color 150ms ease',
                          '&:hover': {
                            color: theme.colors.blue[5],
                          },
                        })}
                      >
                        Sign up
                      </Anchor>
                    </Group>
                  </Group>
                </Stack>
              </form>
            </Stack>
          </Paper>
        </Container>
      )}
    </Transition>
  )
}

