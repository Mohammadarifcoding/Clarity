"use client";

import { signOut, useSession } from "@/src/lib/auth-client";
import { UserCircle, LogOut, Mail, ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { data: session, isPending } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setIsDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full glass border-b border-gray-200 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[var(--color-green)] rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-2xl font-light tracking-tight">Clarity</span>
          </Link>

          {/* Navigation / User */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="nav-link">
              Home
            </Link>

            {/* Always reserve space for user/login */}
            <div className="relative flex items-center min-w-[100px] justify-end">
              {isPending && (
                <div className="flex items-center space-x-2 animate-pulse">
                  {/* Skeleton avatar */}
                  <div className="w-9 h-9 rounded-full bg-gray-200 border-2 border-gray-300"></div>
                </div>
              )}

              {!isPending && !session && (
                <Link href="/auth/login">
                  <button className="px-6 py-2 bg-[var(--color-charcoal)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-green)] transition-all duration-300 hover:scale-105">
                    Login
                  </button>
                </Link>
              )}

              {!isPending && session && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-9 h-9 rounded-full object-cover border-2 border-gray-200 hover:border-[var(--color-green)] transition-colors"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[var(--color-green)]/10 flex items-center justify-center border-2 border-gray-200 hover:border-[var(--color-green)] transition-colors">
                        <UserCircle className="w-6 h-6 text-[var(--color-green)]" />
                      </div>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-fade-in">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-[var(--color-charcoal)] mb-1">
                          {session.user.name}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{session.user.email}</span>
                        </div>
                      </div>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-[var(--color-gray-50)] transition-colors flex items-center space-x-2 mt-1"
                      >
                        <LogOut className="w-4 h-4 text-gray-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
