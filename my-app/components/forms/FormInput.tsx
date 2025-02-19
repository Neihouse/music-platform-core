import { 
  TextInput, 
  PasswordInput, 
  type TextInputProps,
  type PasswordInputProps,
  rem
} from '@mantine/core'
import { IconMail, IconLock } from '@tabler/icons-react'
import { forwardRef } from 'react'

export type FormTextInputProps = TextInputProps & {
  type?: 'text' | 'email'
}

export type FormPasswordInputProps = PasswordInputProps & {
  type: 'password'
}

export const FormTextInput = forwardRef<HTMLInputElement, FormTextInputProps>((props, ref) => {
  const { type = 'text', ...rest } = props
  const Icon = type === 'email' ? IconMail : undefined

  return (
    <TextInput
      ref={ref}
      radius="md"
      size="md"
      leftSection={Icon && <Icon size={rem(16)} style={{ color: 'var(--mantine-color-dimmed)' }} />}
      {...rest}
    />
  )
})

export const FormPasswordInput = forwardRef<HTMLInputElement, FormPasswordInputProps>((props, ref) => {
  return (
    <PasswordInput
      ref={ref}
      radius="md"
      size="md"
      leftSection={<IconLock size={rem(16)} style={{ color: 'var(--mantine-color-dimmed)' }} />}
      {...props}
    />
  )
})

FormTextInput.displayName = 'FormTextInput'
FormPasswordInput.displayName = 'FormPasswordInput' 