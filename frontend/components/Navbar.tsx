export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-6">
      <h1 className="text-2xl font-bold text-blue-600">
        DARES-AI
      </h1>

      <button className="rounded-lg bg-blue-600 px-5 py-2 text-white">
        Login
      </button>
    </nav>
  );
}