"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [userType, setUserType] = useState<'artist' | 'fan'>('fan')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          user_type: userType,
        },
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else if (data.user) {
      // Insert user data into the users table
      const { error: insertError } = await supabase
        .from('users')
        .insert({ id: data.user.id, username, user_type: userType })

      if (insertError) {
        setError(insertError.message)
        setIsLoading(false)
      } else {
        router.push('/dashboard')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label>User Type</Label>
        <RadioGroup value={userType} onValueChange={(value: 'artist' | 'fan') => setUserType(value)} className="mt-1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="artist" id="artist" />
            <Label htmlFor="artist">Artist</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fan" id="fan" />
            <Label htmlFor="fan">Fan</Label>
          </div>
        </RadioGroup>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing up...' : 'Sign up'}
      </Button>
    </form>
  )
}

