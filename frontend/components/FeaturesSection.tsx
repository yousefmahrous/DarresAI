import {
  Brain,
  GraduationCap,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Personal Tutor",
    description:
      "Ask questions anytime and receive instant explanations tailored to your learning style.",
    color: "text-blue-400",
  },
  {
    icon: GraduationCap,
    title: "Adaptive Learning Paths",
    description:
      "DARES-AI automatically adjusts your study plan based on your strengths and weaknesses.",
    color: "text-purple-400",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Track your performance with detailed reports and AI-powered insights.",
    color: "text-green-400",
  },
  {
    icon: ShieldCheck,
    title: "Parent Dashboard",
    description:
      "Parents can monitor progress, attendance, and learning achievements in real time.",
    color: "text-orange-400",
  },
];

export default function FeaturesSection() {
  return (
<section id="features" className="bg-[#06080f] py-28">
      <div className="mx-auto max-w-7xl px-8">

        <p className="text-center text-sm font-semibold tracking-[0.3em] text-blue-500">
          FEATURES
        </p>

        <h2 className="mt-3 text-center text-5xl font-bold">
          Why Students Love DARES-AI
        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-center text-lg text-gray-400">
          Powerful AI tools designed specifically for Egyptian students to
          improve learning, confidence, and academic performance.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-500/40"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                  <Icon size={34} className={feature.color} />
                </div>

                <h3 className="text-2xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-8 text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}