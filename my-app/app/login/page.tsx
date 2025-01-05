"use client";

import { Auth } from "@/components/Auth";

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <Auth view="sign_in" />
      </div>
    </div>
  );
}
