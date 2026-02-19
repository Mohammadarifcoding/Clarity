import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="py-12 px-6 lg:px-8 border-t border-gray-200">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-(--color-green) rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-light tracking-tight">Clarity</span>
          </div>
          <div className="flex items-center space-x-8 text-sm text-gray-600">
            <Link href="/" className="nav-link">
              Privacy
            </Link>
            <Link href="/" className="nav-link">
              Terms
            </Link>
            <Link href="/" className="nav-link">
              Support
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            © 2026 Clarity. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
