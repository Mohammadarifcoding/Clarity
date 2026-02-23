"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/src/lib/auth-client";
import { LoadingState } from "../meeting/chat";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      const redirectUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}`;

      router.replace(redirectUrl);
    }
  }, [session, isPending, router, pathname]);

  if (isPending)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingState />
      </div>
    );

  if (!session) return null;

  return <>{children}</>;
};

export default PrivateRoute;
