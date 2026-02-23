'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'teacher' | 'student'>('student')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await res.json();

  if (data.success) {
    if (data.role === "teacher") {
      window.location.href = "/teacher";
    } else {
      window.location.href = "/student";
    }
  } else {
    alert("Invalid login");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4" suppressHydrationWarning>
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 -z-10" />
      
      {/* Floating shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute top-40 right-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'} as React.CSSProperties} />
      <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '4s'} as React.CSSProperties} />

      {/* Floating academic icons in background */}
      <div className="absolute top-20 right-20 text-5xl opacity-10 animate-bounce" style={{animationDelay: '0s'} as React.CSSProperties}>📚</div>
      <div className="absolute bottom-32 left-20 text-5xl opacity-10 animate-bounce" style={{animationDelay: '1s'} as React.CSSProperties}>📝</div>
      <div className="absolute top-1/2 left-10 text-5xl opacity-10 animate-bounce" style={{animationDelay: '2s'} as React.CSSProperties}>✏️</div>

      {/* Glass card login form */}
      <div className="relative z-10 w-full max-w-md" style={{animation: 'fadeIn 0.8s ease-out'} as React.CSSProperties}>
        <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">📚</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Class Notes
            </h1>
            <p className="text-gray-600">Student Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Username</label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/40 border border-white/50 placeholder:text-gray-500 focus:bg-white/60 focus:border-blue-400 h-11 rounded-xl transition-all duration-200 backdrop-blur-sm"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/40 border border-white/50 placeholder:text-gray-500 focus:bg-white/60 focus:border-blue-400 h-11 rounded-xl transition-all duration-200 backdrop-blur-sm"
                required
              />
            </div>

            {/* Role selector */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">I am a...</label>
              <div className="flex gap-3">
                {[
                  { value: 'student' as const, label: 'Student', icon: '👨‍🎓' },
                  { value: 'teacher' as const, label: 'Teacher', icon: '👨‍🏫' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                      role === option.value
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                        : 'bg-white/30 border border-white/40 text-gray-700 hover:bg-white/50'
                    }`}
                  >
                    {option.icon} {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Enter Portal
                    <span className="text-lg">→</span>
                  </>
                )}
              </span>
            </Button>

            {/* Demo credentials */}
            <div className="pt-4 border-t border-white/30">
              <p className="text-xs text-gray-600 text-center mb-3">Demo Credentials</p>
              <div className="space-y-2 text-xs text-gray-600">
                <p><strong>Student:</strong> student / password</p>
                <p><strong>Teacher:</strong> teacher / password</p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  )
}
