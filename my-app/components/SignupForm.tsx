"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  Button, 
  Stack, 
  Radio, 
  Group,
  Paper,
  Title,
  Text,
  Divider,
  Box,
  Transition,
  Container
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { 
  IconUser, 
  IconMicrophone,
  IconHeadphones,
} from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { z } from 'zod'
import { FormTextInput, FormPasswordInput } from './forms/FormInput'
import { FormError } from './forms/FormError'
import { FormSuccess } from './forms/FormSuccess'

const schema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  username: z.string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be 20 characters or less')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  userType: z.enum(['artist', 'fan'])
})

type FormValues = z.infer<typeof schema>

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, { toggle }] = useDisclosure(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      username: '',
      userType: 'fan' as const,
    },
    validate: zodResolver(schema),
  })

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
            user_type: values.userType,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({ 
            id: data.user.id, 
            username: values.username, 
            user_type: values.userType 
          })

        if (insertError) throw insertError

        setSuccess('Account created successfully! Redirecting...')
        toggle() // Start exit animation
        setTimeout(() => {
          router.push('/dashboard')
        }, 500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup')
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
                Create your account
              </Title>
              <Text c="dimmed" size="sm" ta="center" mb="lg">
                Join our community of music lovers and artists
              </Text>

              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                  <FormTextInput
                    required
                    label="Email"
                    placeholder="your@email.com"
                    type="email"
                    {...form.getInputProps('email')}
                  />
                  
                  <FormPasswordInput
                    required
                    label="Password"
                    placeholder="Your password"
                    type="password"
                    {...form.getInputProps('password')}
                  />

                  <FormTextInput
                    required
                    label="Username"
                    placeholder="Choose a username"
                    type="text"
                    leftSection={<IconUser size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />}
                    {...form.getInputProps('username')}
                  />

                  <Divider 
                    label="Account Type" 
                    labelPosition="center"
                    mt="md"
                  />

                  <Radio.Group
                    name="userType"
                    label="Select your account type"
                    {...form.getInputProps('userType')}
                  >
                    <Group mt="xs" gap="xl">
                      <Radio
                        value="artist"
                        label={
                          <Group gap="xs">
                            <IconMicrophone 
                              size={16} 
                              style={{ color: 'var(--mantine-color-blue-6)' }} 
                            />
                            <Box>
                              <Text size="sm">Artist</Text>
                              <Text size="xs" c="dimmed">Share your music</Text>
                            </Box>
                          </Group>
                        }
                      />
                      <Radio
                        value="fan"
                        label={
                          <Group gap="xs">
                            <IconHeadphones 
                              size={16} 
                              style={{ color: 'var(--mantine-color-green-6)' }} 
                            />
                            <Box>
                              <Text size="sm">Fan</Text>
                              <Text size="xs" c="dimmed">Discover new music</Text>
                            </Box>
                          </Group>
                        }
                      />
                    </Group>
                  </Radio.Group>

                  <FormError error={error} />
                  <FormSuccess message={success} />

                  <Button 
                    type="submit" 
                    loading={isLoading}
                    fullWidth
                    radius="md"
                    size="md"
                    mt="sm"
                  >
                    {isLoading ? 'Creating account...' : 'Create account'}
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

