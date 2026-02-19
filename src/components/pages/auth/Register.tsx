"use client";

import React, { useState } from "react";
import { Mail, Lock, User, Chrome, EyeOff, Eye } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { signUp } from "@/src/lib/auth-client";
import Logo from "@/src/components/shared/logo";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      await signUp.email(
        {
          email,
          password,
          name,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Registration failed");
          },
        },
      );
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[var(--color-charcoal)] to-[var(--color-charcoal-light)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-30"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <Link href="/" className="flex items-center space-x-2 mb-8 ">
              <Logo />
              <span className="text-4xl font-light tracking-tight">
                Clarity
              </span>
            </Link>
            <h2 className="text-4xl font-light mb-4">
              Start your journey with
              <br />
              <span className="font-normal text-[var(--color-green)]">
                Clarity today
              </span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Transform how your team captures, transcribes, and leverages
              meeting insights with cutting-edge AI technology.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mt-12">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[var(--color-green)]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-[var(--color-green)] rounded-full"></div>
              </div>
              <div>
                <p className="font-medium mb-1">Instant Transcription</p>
                <p className="text-sm text-gray-400">
                  AI-powered accuracy across 50+ languages
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[var(--color-green)]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-[var(--color-green)] rounded-full"></div>
              </div>
              <div>
                <p className="font-medium mb-1">Smart Q&A</p>
                <p className="text-sm text-gray-400">
                  Ask anything about your meetings
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[var(--color-green)]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-[var(--color-green)] rounded-full"></div>
              </div>
              <div>
                <p className="font-medium mb-1">Secure & Private</p>
                <p className="text-sm text-gray-400">
                  End-to-end encryption for all data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-light tracking-tight mb-2">
              Create your{" "}
              <span className="font-normal text-[var(--color-green)]">
                account
              </span>
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="input pl-12"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"} // toggle type
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input pl-12 pr-10"
                  disabled={loading}
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"} // toggle type
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input pl-12 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-4 h-4 text-[var(--color-green)] border-gray-300 rounded focus:ring-[var(--color-green)] mt-1"
              />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-[var(--color-green)] hover:text-[var(--color-green-dark)]"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-[var(--color-green)] hover:text-[var(--color-green-dark)]"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-[var(--color-green)] hover:text-[var(--color-green-dark)] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
