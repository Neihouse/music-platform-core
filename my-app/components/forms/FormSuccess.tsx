import { Alert, rem } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'

interface FormSuccessProps {
  message: string | null
  title?: string
}

export function FormSuccess({ message, title = 'Success' }: FormSuccessProps) {
  if (!message) return null

  return (
    <Alert 
      color="green" 
      title={title}
      variant="filled"
      icon={<IconCheck size={rem(16)} />}
    >
      {message}
    </Alert>
  )
} 