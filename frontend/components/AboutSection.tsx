export default function AboutSection() {
  return (
    <section
      id="about"
      className="bg-[#050816] border-t border-white/10 py-24"
    >
      <div className="mx-auto max-w-6xl px-8 text-center">

        <p className="text-sm font-semibold tracking-[0.3em] text-blue-500">
          ABOUT DARES-AI
        </p>

        <h2 className="mt-4 text-5xl font-bold">
          Empowering Egyptian Students with AI
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-400">
          DARES-AI is an AI-powered educational platform designed specifically
          for the Egyptian National Curriculum. We help students learn smarter,
          prepare for exams, and achieve their academic goals through
          personalized AI tutoring, adaptive study plans, and intelligent
          progress tracking.
        </p>

      </div>
    </section>
  );
}