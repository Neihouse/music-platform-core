"use client"

import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthProps {
  view: 'sign_in' | 'sign_up';
}

export function Auth({ view }: AuthProps) {
  return view === 'sign_in' ? <LoginForm /> : <SignupForm />;
} 