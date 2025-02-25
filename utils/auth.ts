import { jwtVerify } from 'jose';

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
}

// Mock user data for development
const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
    avatar_url: 'https://avatars.githubusercontent.com/u/1234567'
  }
];

export function getUser(): User | null {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export function login(email: string, password: string): Promise<{ user: User }> {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        resolve({ user: userWithoutPassword });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
}

export function signup(data: { email: string; password: string; name: string }): Promise<{ user: User }> {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const existingUser = MOCK_USERS.find(u => u.email === data.email);
      
      if (existingUser) {
        reject(new Error('Email already registered'));
        return;
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        name: data.name,
        avatar_url: `https://api.dicebear.com/7.x/avatars/svg?seed=${data.email}`,
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      resolve({ user: newUser });
    }, 500);
  });
}

export function logout(): void {
  localStorage.removeItem('user');
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}

export async function verifyAuth(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
}

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function makeAuthenticatedRequest(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  const headers = getAuthHeaders();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Clear invalid auth state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  return response;
} 