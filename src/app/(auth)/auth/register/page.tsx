import Link from "next/link";
import Logo from "@/src/components/shared/logo";
import RegisterForm from "@/src/components/pages/auth/Register";

export default function Register() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-(--color-charcoal) to-(--color-charcoal-light) relative overflow-hidden">
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
      <RegisterForm />
    </div>
  );
}
