import { Alert, rem } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'

interface FormErrorProps {
  error: string | null
  title?: string
}

export function FormError({ error, title = 'Error' }: FormErrorProps) {
  if (!error) return null

  return (
    <Alert 
      color="red" 
      title={title}
      variant="filled" 
      icon={<IconAlertCircle size={rem(16)} />}
    >
      {error}
    </Alert>
  )
} 