import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#03050c]">

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-8 py-10 md:flex-row">

        {/* Logo */}

        <div>

          <Link href="/" className="text-3xl font-black">
            DARES-
            <span className="text-blue-500">AI</span>
          </Link>

          <p className="mt-3 max-w-sm text-gray-400">
            Empowering Egyptian students with AI-powered personalized learning.
          </p>

        </div>

        {/* Links */}

        <div className="flex gap-8 text-gray-400">

          <a href="#home" className="hover:text-white transition">
            Home
          </a>

          <a href="#subjects" className="hover:text-white transition">
            Subjects
          </a>

          <a href="#features" className="hover:text-white transition">
            Features
          </a>

          <a href="#about" className="hover:text-white transition">
            About
          </a>

        </div>

      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-gray-500">
        © 2026 DARES-AI. All rights reserved.
      </div>

    </footer>
  );
}