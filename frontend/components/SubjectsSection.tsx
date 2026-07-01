import {
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  BookOpen,
  Globe,
  Code2,
  Landmark,
} from "lucide-react";

const subjects = [
  {
    title: "Mathematics",
    grade: "All Grades",
    icon: Calculator,
    color: "text-blue-400",
  },
  {
    title: "Physics",
    grade: "Preparatory • Secondary",
    icon: Atom,
    color: "text-purple-400",
  },
  {
    title: "Chemistry",
    grade: "Preparatory • Secondary",
    icon: FlaskConical,
    color: "text-green-400",
  },
  {
    title: "Biology",
    grade: "Preparatory • Secondary",
    icon: Dna,
    color: "text-lime-400",
  },
  {
    title: "Arabic",
    grade: "All Grades",
    icon: BookOpen,
    color: "text-orange-400",
  },
  {
    title: "English",
    grade: "All Grades",
    icon: Globe,
    color: "text-cyan-400",
  },
  {
    title: "Computer Science",
    grade: "Secondary",
    icon: Code2,
    color: "text-violet-400",
  },
  {
    title: "History",
    grade: "Preparatory • Secondary",
    icon: Landmark,
    color: "text-yellow-400",
  },
];

export default function SubjectsSection() {
  return (
<section id="subjects" className="bg-[#06080f] py-24">
      <div className="mx-auto max-w-7xl px-8">

        <p className="text-center text-sm font-semibold tracking-[0.3em] text-blue-500">
          SUBJECTS
        </p>

        <h2 className="mt-3 text-center text-5xl font-bold">
          Explore All Subjects
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-gray-400">
          Comprehensive coverage of the Egyptian curriculum for all grades.
        </p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">

          {subjects.map((subject) => {
            const Icon = subject.icon;

            return (
              <div
                key={subject.title}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-2 hover:border-blue-500/40 hover:bg-white/[0.05]"
              >
                <Icon
                  size={40}
                  className={`${subject.color} mx-auto transition group-hover:scale-110`}
                />

                <h3 className="mt-6 text-center font-semibold">
                  {subject.title}
                </h3>

                <p className="mt-2 text-center text-xs text-gray-500">
                  {subject.grade}
                </p>
              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}