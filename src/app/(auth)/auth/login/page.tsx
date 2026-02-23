import LoginForm from "@/src/components/pages/auth/Login";
import { Suspense } from "react";
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex">
      <Suspense
        fallback={
          <div className="min-h-screen flex-1 items-center justify-center">
            Loading...
          </div>
        }
      >
        <LoginForm />
      </Suspense>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[var(--color-charcoal)] to-[var(--color-charcoal-light)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-30"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="w-16 h-16 bg-(--color-green) rounded-2xl flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <h2 className="text-4xl font-light mb-4">
              Your meetings,
              <br />
              <span className="font-normal text-(--color-green)">
                intelligently organized
              </span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Join thousands of teams using Clarity to transform their meetings
              into actionable insights with AI-powered transcription and search.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-3xl font-light text-(--color-green) mb-1">
                50K+
              </div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-light text-(--color-green) mb-1">
                1M+
              </div>
              <div className="text-sm text-gray-400">Meetings Recorded</div>
            </div>
            <div>
              <div className="text-3xl font-light text-(--color-green) mb-1">
                99%
              </div>
              <div className="text-sm text-gray-400">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
