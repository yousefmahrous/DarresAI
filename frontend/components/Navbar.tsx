import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      <div className="mx-auto mt-5 flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-8 py-4 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">

        {/* Logo */}

        <Link href="/" className="flex flex-col">

          <span className="text-4xl font-black tracking-tight">
            DARES-
            <span className="text-blue-500">AI</span>
          </span>

          <span className="-mt-1 text-[11px] uppercase tracking-[0.25em] text-gray-400">
            AI Education Platform
          </span>

        </Link>

        {/* Navigation */}

        <nav className="hidden items-center gap-10 md:flex">

        <a
  href="#home"
  className="border-b-2 border-blue-500 pb-1 font-medium text-blue-400"
>
  Home
</a>

<a
  href="#features"
  className="text-gray-300 transition hover:text-white"
>
  Features
</a>

   <a
  href="#subjects"
  className="text-gray-300 transition hover:text-white"
>
  Subjects
</a>

        <a
  href="#about"
  className="text-gray-300 transition hover:text-white"
>
  About Us
</a>
                
          

        </nav>

        {/* Buttons */}

        <div className="flex items-center gap-4">

          <Link
            href="/login"
            className="rounded-xl border border-blue-500/40 bg-white/5 px-6 py-3 text-white transition hover:border-blue-500 hover:bg-blue-500/10"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 hover:scale-105"
          >
            Get Started →
          </Link>

        </div>

      </div>

    </header>
  );
}