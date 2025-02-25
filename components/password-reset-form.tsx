"use client"

import { useState } from 'react'
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
  rem,
  PasswordInput
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { 
  IconAlertCircle, 
  IconCheck, 
  IconMail,
  IconArrowLeft,
  IconLock
} from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface FormValues {
  email: string
  newPassword?: string
  confirmPassword?: string
}

export function PasswordResetForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, { toggle }] = useDisclosure(true)
  const [showResetForm, setShowResetForm] = useState(false)

  const form = useForm({
    initialValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+$/.test(value)) return 'Invalid email address';
        return null;
      },
      newPassword: (value) => {
        if (showResetForm) {
          if (!value) return 'New password is required';
          if (value.length < 8) return 'Password must be at least 8 characters';
        }
        return null;
      },
      confirmPassword: (value, values) => {
        if (showResetForm) {
          if (!value) return 'Please confirm your password';
          if (value !== values.newPassword) return 'Passwords do not match';
        }
        return null;
      },
    },
  })

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (!showResetForm) {
        // Send reset link
        notifications.show({
          title: 'Success',
          message: 'Check your email for the password reset link',
          color: 'green',
          icon: <IconCheck size={rem(16)} />
        })
        form.reset()
        toggle()
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        // Reset password
        notifications.show({
          title: 'Success',
          message: 'Your password has been reset successfully',
          color: 'green',
          icon: <IconCheck size={rem(16)} />
        })
        form.reset()
        toggle()
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to process request',
        color: 'red',
        icon: <IconAlertCircle size={rem(16)} />
      })
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
                {showResetForm ? 'Set New Password' : 'Reset Password'}
              </Title>
              <Text c="dimmed" size="sm" ta="center" mb="lg">
                {showResetForm 
                  ? 'Enter your new password below'
                  : 'Enter your email address and we\'ll send you a link to reset your password'
                }
              </Text>

              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                  {!showResetForm ? (
                    <TextInput
                      required
                      label="Email"
                      placeholder="your@email.com"
                      radius="md"
                      size="md"
                      leftSection={<IconMail size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />}
                      {...form.getInputProps('email')}
                    />
                  ) : (
                    <>
                      <PasswordInput
                        required
                        label="New Password"
                        placeholder="Enter your new password"
                        radius="md"
                        size="md"
                        leftSection={<IconLock size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />}
                        {...form.getInputProps('newPassword')}
                      />
                      <PasswordInput
                        required
                        label="Confirm Password"
                        placeholder="Confirm your new password"
                        radius="md"
                        size="md"
                        leftSection={<IconLock size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />}
                        {...form.getInputProps('confirmPassword')}
                      />
                    </>
                  )}

                  <Button 
                    type="submit" 
                    loading={isLoading}
                    fullWidth
                    radius="md"
                    size="md"
                  >
                    {isLoading 
                      ? (showResetForm ? 'Resetting Password...' : 'Sending Link...') 
                      : (showResetForm ? 'Reset Password' : 'Send Reset Link')
                    }
                  </Button>

                  {!showResetForm && (
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
                  )}
                </Stack>
              </form>
            </Stack>
          </Paper>
        </Container>
      )}
    </Transition>
  )
}

