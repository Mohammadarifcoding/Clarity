import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full glass border-b border-gray-200 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-(--color-green) rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-2xl font-light tracking-tight">Clarity</span>
          </div>
          <div className="flex items-center space-x-8">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href={"/auth/login"}>
              <button className="px-6 py-2 bg-(--color-charcoal) text-white rounded-lg text-sm font-medium hover:bg-(--color-green) transition-all duration-300 hover:scale-105">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
