"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  TextInput, 
  Button, 
  Stack, 
  Alert, 
  Paper,
  Title,
  Text,
  Container,
  Transition,
  rem
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { 
  IconAlertCircle, 
  IconCheck, 
  IconMail,
  IconArrowLeft 
} from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import Link from 'next/link'

interface FormValues {
  email: string
}

export function PasswordResetForm() {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, { toggle }] = useDisclosure(true)
  const supabase = createClientComponentClient()

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+$/.test(value)) return 'Invalid email address';
        return null;
      },
    },
  })

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true)
    setError(null)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setMessage('Check your email for the password reset link')
      form.reset()
      toggle() // Start exit animation
      setTimeout(() => {
        // You could redirect here if needed
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link')
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
                Reset Password
              </Title>
              <Text c="dimmed" size="sm" ta="center" mb="lg">
                Enter your email address and we&apos;ll send you a link to reset your password
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

                  {message && (
                    <Alert 
                      color="green" 
                      title="Success" 
                      variant="filled"
                      icon={<IconCheck size={rem(16)} />}
                    >
                      {message}
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    loading={isLoading}
                    fullWidth
                    radius="md"
                    size="md"
                  >
                    {isLoading ? 'Sending link...' : 'Send Reset Link'}
                  </Button>

                  <Button
                    component={Link}
                    href="/login"
                    variant="subtle"
                    color="gray"
                    fullWidth
                    leftSection={<IconArrowLeft size={16} />}
                    radius="md"
                    size="md"
                  >
                    Back to Login
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Paper>
        </Container>
      )}
    </Transition>
  )
}

